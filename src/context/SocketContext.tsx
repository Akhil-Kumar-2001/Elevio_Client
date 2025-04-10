'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import userAuthStore from "@/store/userAuthStore";
import tutorAuthStore from "@/store/tutorAuthStore";
import adminAuthStore from "@/store/adminAuthStore";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface SocketContextType {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  onlineUser: any[]; // Consider typing this as UserMinimal[] or a specific user type
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const tutor = tutorAuthStore();
  const student = userAuthStore();
  const admin = adminAuthStore();
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [onlineUser, setOnlineUser] = useState<any[]>([]);
  const userId = tutor.user?.id || student.user?.id || admin.user?.id;
  useEffect(() => {
    if (!userId) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setOnlineUser([]);
      }
      return;
    }

    const socketInstance = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      query: { userId },
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("getOnlineUser", (users) => {
      console.log("Online users:", users);
      setOnlineUser(users);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
