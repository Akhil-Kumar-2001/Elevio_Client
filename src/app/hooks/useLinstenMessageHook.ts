
import { useSocketContext } from "@/context/SocketContext";
import useConversation from "@/store/useConversation";
import { Message } from "@/types/types";
import { useEffect } from "react";

const useListenMessages = () => {
  // Avoid direct destructuring to handle null case
  const socketContext = useSocketContext();
  const socket = socketContext?.socket; 

  const { messages, setMessages } = useConversation();

  useEffect(() => {
    if (!socket) return; 

    const handleNewMessage = (newMessage: Message) => {
        console.log("Received new message:", newMessage); 
      setMessages([...messages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, messages, setMessages]);

  return null; 
};

export default useListenMessages;

