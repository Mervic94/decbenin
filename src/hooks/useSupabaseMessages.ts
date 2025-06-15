
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types';
import { toast } from 'sonner';

export const useSupabaseMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Récupérer les messages d'une demande
  const fetchMessages = async (requestId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          request_id,
          user_id,
          sender_id,
          recipient_id,
          content,
          created_at,
          read,
          is_system
        `)
        .eq('request_id', requestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Fetch sender profiles separately
      const messagesWithProfiles: Message[] = [];
      
      for (const message of data || []) {
        let profiles = null;
        
        if (message.sender_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', message.sender_id)
            .single();
          
          profiles = profileData;
        }
        
        messagesWithProfiles.push({
          ...message,
          profiles
        });
      }
      
      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un message
  const sendMessage = async (requestId: string, content: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('messages')
        .insert({
          request_id: requestId,
          user_id: user.id,
          sender_id: user.id,
          content
        });

      if (error) throw error;
      
      toast.success('Message envoyé');
      await fetchMessages(requestId);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      return false;
    }
  };

  return {
    messages,
    loading,
    fetchMessages,
    sendMessage
  };
};
