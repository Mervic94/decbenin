
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  content?: string;
  type?: string;
  reference_id?: string;
  read: boolean;
  created_at: string;
}

export const useSupabaseNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching notifications from Supabase...');
      
      // Utilisation de l'index optimisé pour les notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Limiter pour de meilleures performances

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }

      console.log('Notifications fetched successfully:', data?.length || 0);
      setNotifications(data || []);
      
      // Calculer le nombre de notifications non lues
      const unread = data?.filter(n => !n.read).length || 0;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotification = useCallback(async (
    userId: string,
    title: string,
    message: string,
    type?: string,
    referenceId?: string
  ): Promise<boolean> => {
    try {
      console.log('Creating notification in Supabase...', { userId, title, message, type, referenceId });
      
      const notificationData = {
        user_id: userId,
        title,
        message,
        type,
        reference_id: referenceId,
        read: false
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      console.log('Notification created successfully:', data);
      
      // Ajouter la nouvelle notification à la liste locale
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      return true;
    } catch (error) {
      console.error('Error in createNotification:', error);
      return false;
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      console.log('Marking notification as read...', notificationId);
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      console.log('Notification marked as read successfully');
      
      // Mettre à jour la liste locale
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Marking all notifications as read...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      console.log('All notifications marked as read successfully');
      
      // Mettre à jour la liste locale
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
      
      return true;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      return false;
    }
  }, []);

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupListener = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      console.log('Setting up real-time notifications listener...');
      
      channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${currentUser.id}`,
          },
          (payload) => {
            console.log('New notification received:', payload.new);
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();
    };

    setupListener();

    return () => {
      if (channel) {
        console.log('Cleaning up notifications listener...');
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead
  };
};
