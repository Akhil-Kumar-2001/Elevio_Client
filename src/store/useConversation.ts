import { create } from 'zustand';
import { Message, UserMinimal } from '@/types/types';

interface ConversationState {
  // Store messages by conversation ID
  messagesByConversation: { [conversationId: string]: Message[] };
  selectedConversation: UserMinimal | null;
  lastMessageMeta: { senderId: string; receiverId: string; message: string } | null;
  unreadCounts: { [key: string]: number };
  
  // Updated methods
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  getMessages: (conversationId: string) => Message[];
  setSelectedConversation: (user: UserMinimal | null) => void;
  setLastMessageMeta: (meta: { senderId: string; receiverId: string; message: string } | null) => void;
  incrementUnreadCount: (userId: string) => void;
  resetUnreadCount: (userId: string) => void;
  updateUnreadCount: (userId: string, count: number) => void;
}

const useConversation = create<ConversationState>((set, get) => ({
  messagesByConversation: {},
  selectedConversation: null,
  lastMessageMeta: null,
  unreadCounts: {},
  
  setMessages: (conversationId, messages) => 
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages
      }
    })),
  
  addMessage: (conversationId, message) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [
          ...(state.messagesByConversation[conversationId] || []),
          message
        ]
      }
    })),
  
  getMessages: (conversationId) => {
    return get().messagesByConversation[conversationId] || [];
  },
  
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