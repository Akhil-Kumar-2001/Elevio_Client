import { create } from "zustand";

interface Notification {
  _id: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface NotificationState {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

const useNotification = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
}));

export default useNotification;