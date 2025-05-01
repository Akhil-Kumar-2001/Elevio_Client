import { useSocketContext } from "@/context/SocketContext";
import useConversation from "@/store/useConversation";
import { Message } from "@/types/types";
import { useEffect } from "react";

const useListenDeleteMessages = () => {
  // Avoid direct destructuring to handle null case
  const socketContext = useSocketContext();
  const socket = socketContext?.socket;

  const { 
    getMessages, 
    setMessages, 
    selectedConversation 
  } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleDeleteMessage = (deletedMessages: Message[]) => {
      if (!selectedConversation) return;
      
      const conversationId = selectedConversation._id;
      console.log("Received deleted messages:", deletedMessages);
      
      // Get current messages for the active conversation
      const currentMessages = getMessages(conversationId);
      console.log("Current messages from the store:", currentMessages);

      if (!currentMessages || currentMessages.length === 0) return;

      // Create a new array with updated messages
      const updatedMessages = currentMessages.map((message) => {
        const deletedMessage = deletedMessages.find((delMsg) => delMsg._id === message._id);
        return deletedMessage || message;
      });

      // Update the store with the new messages array for this conversation
      setMessages(conversationId, updatedMessages);
    };

    socket.on("deleteMessage", handleDeleteMessage);

    // Cleanup
    return () => {
      socket.off("deleteMessage", handleDeleteMessage);
    };
  }, [socket, selectedConversation, getMessages, setMessages]);

  return null;
};

export default useListenDeleteMessages;