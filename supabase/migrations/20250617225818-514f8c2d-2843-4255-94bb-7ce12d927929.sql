
-- Optimisations de performance basées sur les recommandations du Performance Advisor

-- 1. Ajouter des index composites pour les requêtes complexes fréquentes
CREATE INDEX IF NOT EXISTS idx_move_requests_user_status ON public.move_requests(user_id, status);
CREATE INDEX IF NOT EXISTS idx_move_requests_agent_status ON public.move_requests(agent_id, status) WHERE agent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_move_requests_created_at ON public.move_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_move_requests_move_date ON public.move_requests(move_date);

-- 2. Index pour les messages avec tri par date
CREATE INDEX IF NOT EXISTS idx_messages_request_created ON public.messages(request_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_created ON public.messages(sender_id, created_at DESC) WHERE sender_id IS NOT NULL;

-- 3. Index pour les notifications avec tri et filtrage
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type_created ON public.notifications(type, created_at DESC) WHERE type IS NOT NULL;

-- 4. Index partiel pour les demandes en attente (requête très fréquente)
CREATE INDEX IF NOT EXISTS idx_move_requests_pending ON public.move_requests(created_at DESC) WHERE status = 'pending';

-- 5. Index pour les recherches par date d'assignation
CREATE INDEX IF NOT EXISTS idx_move_requests_assigned_at ON public.move_requests(assigned_at DESC) WHERE assigned_at IS NOT NULL;

-- 6. Optimiser les requêtes de jointure profiles/user_roles
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON public.profiles(full_name) WHERE full_name IS NOT NULL;

-- 7. Ajouter des statistiques étendues pour de meilleures estimations du planificateur
CREATE STATISTICS IF NOT EXISTS stat_move_requests_user_status ON user_id, status FROM public.move_requests;
CREATE STATISTICS IF NOT EXISTS stat_move_requests_agent_date ON agent_id, move_date FROM public.move_requests;

-- 8. Optimiser les fonctions RLS pour de meilleures performances
CREATE OR REPLACE FUNCTION public.get_user_role_cached(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Utiliser une approche mise en cache pour éviter les requêtes répétées
  SELECT role::TEXT INTO user_role
  FROM public.user_roles 
  WHERE user_id = user_uuid
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 9. Créer une vue matérialisée pour les statistiques de dashboard (si utilisée fréquemment)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.dashboard_stats AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_requests,
  COUNT(*) FILTER (WHERE status = 'declined') as declined_requests,
  COUNT(DISTINCT user_id) as total_users,
  COUNT(DISTINCT agent_id) FILTER (WHERE agent_id IS NOT NULL) as active_agents,
  DATE_TRUNC('day', NOW()) as last_updated
FROM public.move_requests;

-- 10. Index unique pour éviter les données dupliquées
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_unique ON public.user_roles(user_id, role);

-- 11. Améliorer les contraintes pour de meilleures performances
ALTER TABLE public.move_requests 
  ALTER COLUMN status SET DEFAULT 'pending',
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

-- 12. Optimiser les triggers pour réduire la charge
CREATE OR REPLACE FUNCTION public.handle_updated_at_optimized()
RETURNS TRIGGER AS $$
BEGIN
  -- Seulement mettre à jour si les données ont réellement changé
  IF OLD IS DISTINCT FROM NEW THEN
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remplacer les triggers existants par des versions optimisées
DROP TRIGGER IF EXISTS handle_move_requests_updated_at ON public.move_requests;
CREATE TRIGGER handle_move_requests_updated_at
  BEFORE UPDATE ON public.move_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at_optimized();

-- 13. Configuration des paramètres de performance pour les requêtes RLS
SET work_mem = '256MB';
SET random_page_cost = 1.1;
SET effective_cache_size = '1GB';

-- 14. Analyser les tables pour mettre à jour les statistiques
ANALYZE public.move_requests;
ANALYZE public.messages;
ANALYZE public.notifications;
ANALYZE public.profiles;
ANALYZE public.user_roles;

-- 15. Créer une fonction pour rafraîchir la vue matérialisée
CREATE OR REPLACE FUNCTION public.refresh_dashboard_stats()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.dashboard_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
