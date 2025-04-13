import { useEffect } from 'react';
import { useSocketContext } from '@/context/SocketContext';
import useConversation from '@/store/useConversation';
import useStudentAuthStore from '@/store/userAuthStore';
import useTutorAuthStore from '@/store/tutorAuthStore';
import { Message } from '@/types/types';

const useListenMessages = () => {
  const { socket } = useSocketContext() || {};
  const { 
    addMessage,
    selectedConversation, 
    incrementUnreadCount,
    setLastMessageMeta
  } = useConversation();
  
  const studentUser = useStudentAuthStore((state) => state.user);
  const tutorUser = useTutorAuthStore((state) => state.user);
  
  const currentUserId = studentUser?.id || tutorUser?.id;

  useEffect(() => {
    if (!socket || !currentUserId) return;
  
    const handleNewMessage = (newMessage:Message) => {
      // Update last message meta for sidebar update
      setLastMessageMeta({
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        message: newMessage.message || (newMessage.imageUrl ? '[Image]' : ''),
      });
  
      const otherUserId = newMessage.senderId === currentUserId 
        ? newMessage.receiverId 
        : newMessage.senderId;

      if (newMessage.senderId !== currentUserId && 
          selectedConversation?._id !== newMessage.senderId) {
        incrementUnreadCount(newMessage.senderId);
      }
      addMessage(otherUserId, newMessage);
    };
  
    socket.on('newMessage', handleNewMessage);
  
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, currentUserId, selectedConversation, addMessage, incrementUnreadCount, setLastMessageMeta]);
};

export default useListenMessages;