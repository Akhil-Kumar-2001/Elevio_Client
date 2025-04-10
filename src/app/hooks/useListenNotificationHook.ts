import { useSocketContext } from "@/context/SocketContext";
import useNotification from "@/store/notificationStore";
import { useEffect } from "react";

interface Notification {
  _id: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

const useListenNotification = () => {
  const socketContext = useSocketContext();
  const socket = socketContext?.socket;

  const { notifications, setNotifications } = useNotification();

useEffect(() => {
    if (!socket) {
      console.log("Socket not connected");
      return;
    }
  
    const handleNewNotification = (newNotification: Notification) => {
      console.log("Received new notification from socket:", newNotification);
      console.log("Current notifications before update:", notifications);
      setNotifications([ newNotification,...notifications]);
      console.log("Notifications after update:", [ newNotification,...notifications]);
    };

    
  
    socket.on("newNotification", handleNewNotification);
  
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, notifications, setNotifications]);

  return null;
};

export default useListenNotification;