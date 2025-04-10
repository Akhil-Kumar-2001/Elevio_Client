import { create } from "zustand";
import { UserMinimal } from "@/types/types";

interface Message {
  _id: string;
  message: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  imageUrl?: string;
}

interface ConversationState {
  selectedConversation: UserMinimal | null;
  setSelectedConversation: (selectedConversation: UserMinimal | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;