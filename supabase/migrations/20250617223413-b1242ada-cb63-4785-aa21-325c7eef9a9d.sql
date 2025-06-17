
-- Corriger les politiques RLS manquantes (en évitant les doublons)

-- 1. Supprimer les politiques existantes si elles existent déjà, puis les recréer
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 2. Politiques pour move_requests (supprimer et recréer pour éviter les conflits)
DROP POLICY IF EXISTS "Users can view their own requests" ON public.move_requests;
DROP POLICY IF EXISTS "Users can create their own requests" ON public.move_requests;
DROP POLICY IF EXISTS "Agents can update assigned requests" ON public.move_requests;

CREATE POLICY "Users can view their own requests" ON public.move_requests
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = agent_id OR 
    public.get_user_role(auth.uid()) IN ('agent', 'admin', 'moderator')
  );

CREATE POLICY "Users can create their own requests" ON public.move_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agents can update assigned requests" ON public.move_requests
  FOR UPDATE USING (
    auth.uid() = agent_id OR 
    public.get_user_role(auth.uid()) IN ('admin', 'moderator')
  );

-- 3. Politiques pour notifications
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;

CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Politiques pour profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Politiques pour user_roles
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- 6. Politiques pour posts
DROP POLICY IF EXISTS "Users can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

CREATE POLICY "Users can view all posts" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Ajouter des contraintes de sécurité (seulement si elles n'existent pas)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'check_status_valid'
  ) THEN
    ALTER TABLE public.move_requests ADD CONSTRAINT check_status_valid 
      CHECK (status IN ('pending', 'approved', 'declined', 'completed'));
  END IF;
END $$;

-- 8. Créer une fonction pour vérifier les permissions d'agent
CREATE OR REPLACE FUNCTION public.is_agent_or_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role(user_uuid) IN ('agent', 'admin', 'moderator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 9. Ajouter une politique pour permettre aux agents de s'assigner des demandes
DROP POLICY IF EXISTS "Agents can assign requests to themselves" ON public.move_requests;
CREATE POLICY "Agents can assign requests to themselves" ON public.move_requests
  FOR UPDATE USING (
    status = 'pending' AND 
    agent_id IS NULL AND 
    public.is_agent_or_admin(auth.uid())
  )
  WITH CHECK (
    auth.uid() = agent_id AND 
    public.is_agent_or_admin(auth.uid())
  );

-- 10. Créer un trigger pour mettre à jour automatiquement assigned_at
DROP TRIGGER IF EXISTS handle_move_request_assignment ON public.move_requests;
DROP FUNCTION IF EXISTS public.handle_request_assignment();

CREATE OR REPLACE FUNCTION public.handle_request_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Si agent_id change de NULL à une valeur, mettre à jour assigned_at
  IF OLD.agent_id IS NULL AND NEW.agent_id IS NOT NULL THEN
    NEW.assigned_at = now();
  END IF;
  
  -- Si le statut change, mettre à jour updated_at
  IF OLD.status != NEW.status THEN
    NEW.updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_move_request_assignment
  BEFORE UPDATE ON public.move_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_request_assignment();

-- 11. Ajouter des index pour améliorer les performances des requêtes RLS
CREATE INDEX IF NOT EXISTS idx_move_requests_user_id ON public.move_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_move_requests_agent_id ON public.move_requests(agent_id);
CREATE INDEX IF NOT EXISTS idx_move_requests_status ON public.move_requests(status);
CREATE INDEX IF NOT EXISTS idx_messages_request_id ON public.messages(request_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
