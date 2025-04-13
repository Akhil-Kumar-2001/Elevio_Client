import { create } from 'zustand';
import { Message, UserMinimal } from '@/types/types';

interface ConversationState {
  messages: Message[];
  selectedConversation: UserMinimal | null;
  lastMessageMeta: { senderId: string; receiverId: string; message: string } | null;
  unreadCounts: { [key: string]: number };
  setMessages: (messages: Message[]) => void;
  setSelectedConversation: (user: UserMinimal | null) => void;
  setLastMessageMeta: (meta: { senderId: string; receiverId: string; message: string } | null) => void;
  incrementUnreadCount: (userId: string) => void;
  resetUnreadCount: (userId: string) => void;
  updateUnreadCount: (userId: string, count: number) => void;
}

const useConversation = create<ConversationState>((set) => ({
  messages: [],
  selectedConversation: null,
  lastMessageMeta: null,
  unreadCounts: {},
  setMessages: (messages) => set({ messages }),
  setSelectedConversation: (user) => set({ selectedConversation: user }),
  setLastMessageMeta: (meta) => set({ lastMessageMeta: meta }),
  incrementUnreadCount: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),
  resetUnreadCount: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: 0,
      },
    })),
  updateUnreadCount: (userId, count) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: count,
      },
    })),
}));

export default useConversation;