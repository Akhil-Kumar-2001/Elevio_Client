'use client'

import React, { useEffect } from 'react';
import { Send } from 'lucide-react';
import { UserMinimal } from '@/types/types';
import { getMessages, sendMessage } from '@/app/service/shared/chatService';
import useConversation from '@/store/useConversation';
import useListenMessages from '@/app/hooks/useLinstenMessageHook';
import { useSocketContext } from '@/context/SocketContext'; // Add this import

// Extend the existing UserMinimal type
interface ExtendedUserMinimal extends UserMinimal {
  isOnline?: boolean;
}

interface Message {
  _id: string;
  message: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
}

interface ChatWindowProps {
  role: string;
  selectedUser: ExtendedUserMinimal | null;
  currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ role, selectedUser, currentUserId }) => {
  const { messages, setMessages } = useConversation();
  const [newMessage, setNewMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { onlineUser = [] } = useSocketContext() || {}; // Access onlineUser from socket context

  useListenMessages();

  const handlesendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      setIsLoading(true);
      await sendMessage(selectedUser._id, newMessage, role);
      
      const tempMessage: Message = {
        _id: Date.now().toString(),
        message: newMessage,
        createdAt: new Date().toISOString(),
        senderId: currentUserId,
        receiverId: selectedUser._id
      };
      
      setMessages([...messages, tempMessage]);
      setNewMessage('');
      
      handleGetMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMessages = async () => {
    if (!selectedUser) return;
    
    try {
      setIsLoading(true);
      const response = await getMessages(selectedUser._id, role);
      console.log("messages in the component", response);
      
      if (response.success && Array.isArray(response.data)) {
        setMessages(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date value:", timestamp);
        return "Invalid Date";
      }
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error("Error parsing timestamp:", error, "Value:", timestamp);
      return "Invalid Date";
    }
  };

  // Check if the selected user is online
  const isUserOnline = (userId: string) => {
    return Array.isArray(onlineUser) && onlineUser.includes(userId);
  };

  useEffect(() => {
    if (selectedUser) {
      handleGetMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={selectedUser.profilePicture || '/default-avatar.png'}
            alt={selectedUser.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedUser.username}
            </h3>
            <p className={`text-sm ${
              isUserOnline(selectedUser._id) ? 'text-green-500' : 'text-gray-500'
            }`}>
              {isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div id="message-container" className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center py-4">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center py-4">
            <p className="text-gray-500">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isReceivedMessage = message.receiverId === currentUserId;
            
            return (
              <div
                key={message._id}
                className={`flex ${isReceivedMessage ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isReceivedMessage
                      ? 'bg-white border border-gray-200'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  <p className={isReceivedMessage ? 'text-gray-900' : 'text-white'}>
                    {message.message}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isReceivedMessage ? 'text-gray-500' : 'text-indigo-200'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlesendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border text-gray-700 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            className={`p-2 bg-indigo-600 text-white rounded-full transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
            onClick={handlesendMessage}
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;