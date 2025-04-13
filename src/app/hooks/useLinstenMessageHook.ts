import { useSocketContext } from '@/context/SocketContext';
import useConversation from '@/store/useConversation';
import { Message } from '@/types/types';
import { useEffect } from 'react';

const useListenMessages = () => {
  const socketContext = useSocketContext();
  const socket = socketContext?.socket;
  const {
    messages,
    setMessages,
    selectedConversation,
    setLastMessageMeta,
    incrementUnreadCount,
    updateUnreadCount,
    unreadCounts,
  } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      console.log('Received new message:', newMessage);
      setMessages([...messages, newMessage]);
      setLastMessageMeta({
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        message: newMessage.message || (newMessage.imageUrl ? '[Image]' : ''),
      });

      if (selectedConversation?._id !== newMessage.senderId) {
        incrementUnreadCount(newMessage.senderId);
      }
    };

    const handleMessagesRead = ({
      senderId,
      receiverId,
      unreadCount,
    }: {
      senderId: string;
      receiverId: string;
      unreadCount: number;
    }) => {
      console.log('Messages read for:', receiverId, 'Unread count:', unreadCount);
      updateUnreadCount(receiverId, unreadCount);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [
    socket,
    messages,
    setMessages,
    setLastMessageMeta,
    selectedConversation,
    incrementUnreadCount,
    updateUnreadCount,
    unreadCounts,
  ]);

  return null;
};

export default useListenMessages;