
// Service for creating and managing notifications
export const useNotificationService = () => {
  // Helper function to create notification (mock for now)
  const createNotification = async (
    userId: string,
    title: string,
    content: string,
    type: string,
    referenceId: string
  ) => {
    // In a real implementation, this would create a notification in Supabase
    console.log('Creating notification:', { userId, title, content, type, referenceId });
    
    // Mock implementation - would be replaced with actual Supabase call
    // const { error } = await supabase.from('notifications').insert({
    //   user_id: userId,
    //   title,
    //   content,
    //   type,
    //   reference_id: referenceId,
    // });
    
    // if (error) throw error;
    return true;
  };

  // Get all notifications for a user (mock for now)
  const getUserNotifications = async (userId: string) => {
    // In a real implementation, this would fetch notifications from Supabase
    console.log('Fetching notifications for user:', userId);
    
    // Mock implementation - would be replaced with actual Supabase call
    // For demo users, return some mock notifications
    if (userId === 'client-demo-id') {
      return [
        {
          id: 'n1',
          user_id: 'client-demo-id',
          title: 'Demande approuvée',
          content: 'Votre demande de déménagement a été approuvée par un agent.',
          type: 'request_status',
          reference_id: '2',
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'n2',
          user_id: 'client-demo-id',
          title: 'Nouveau message',
          content: 'Vous avez reçu un nouveau message concernant votre demande.',
          type: 'message',
          reference_id: '2',
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
    } else if (userId === 'agent-demo-id') {
      return [
        {
          id: 'n3',
          user_id: 'agent-demo-id',
          title: 'Nouvelle demande',
          content: 'Une nouvelle demande de déménagement a été soumise.',
          type: 'new_request',
          reference_id: '4',
          read: false,
          created_at: new Date(Date.now() - 1800000).toISOString(),
        }
      ];
    }
    
    return [];
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    // In a real implementation, this would update the notification in Supabase
    console.log('Marking notification as read:', notificationId);
    
    // Mock implementation - would be replaced with actual Supabase call
    return true;
  };

  return {
    createNotification,
    getUserNotifications,
    markNotificationAsRead
  };
};
