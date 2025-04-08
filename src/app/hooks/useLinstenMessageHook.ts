
import { useSocketContext } from "@/context/SocketContext";
import useConversation from "@/store/useConversation";
import { useEffect } from "react";

const useListenMessages = () => {
  // Avoid direct destructuring to handle null case
  const socketContext = useSocketContext();
  const socket = socketContext?.socket; // Safely access socket

  // Fix typo: Use 'messages' instead of 'message'
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    if (!socket) return; // Guard against null/undefined socket

    const handleNewMessage = (newMessage: Message) => {
        console.log("Received new message:", newMessage); // Debug log
      setMessages([...messages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, messages, setMessages]);

  return null; // Optional: This hook doesn't need to return anything
};

export default useListenMessages;

// Define Message interface (if not already imported elsewhere)
interface Message {
  _id: string;
  message: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
}