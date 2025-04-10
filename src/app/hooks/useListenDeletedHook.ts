
import { useSocketContext } from "@/context/SocketContext";
import useConversation from "@/store/useConversation";
import { Message } from "@/types/types";
import { useEffect } from "react";

const useListenDeleteMessages = () => {
  // Avoid direct destructuring to handle null case
  const socketContext = useSocketContext();
  const socket = socketContext?.socket;

  const { messages, setMessages } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleDeleteMessage = (deletedMessages: Message[]) => {
      console.log("Received deleted messages:", deletedMessages);
      console.log("Current messages from the store:", messages);

      // Create a new array with updated messages
      const updatedMessages = messages.map((message) => {
        const deletedMessage = deletedMessages.find((delMsg) => delMsg._id === message._id);
        return deletedMessage || message;
      });

      // Update the store with the new messages array
      setMessages(updatedMessages);
    };

    socket.on("deleteMessage", handleDeleteMessage);

    // Cleanup
    return () => {
      socket.off("deleteMessage", handleDeleteMessage);
    };
  }, [socket, messages, setMessages]);

  return null;
};

export default useListenDeleteMessages;


