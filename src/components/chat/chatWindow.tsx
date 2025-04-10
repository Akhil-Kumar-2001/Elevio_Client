'use client'

import React, { useEffect, useState } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import { UserMinimal } from '@/types/types';
import { getMessages, sendMessage } from '@/app/service/shared/chatService';
import useConversation from '@/store/useConversation';
import useListenMessages from '@/app/hooks/useLinstenMessageHook';
import { useSocketContext } from '@/context/SocketContext';

interface ExtendedUserMinimal extends UserMinimal {
  isOnline?: boolean;
}

interface Message {
  _id: string;
  message: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  imageUrl?: string;
}

interface ChatWindowProps {
  role: string;
  selectedUser: ExtendedUserMinimal | null;
  currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ role, selectedUser, currentUserId }) => {
  const { messages, setMessages } = useConversation();
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { onlineUser = [] } = useSocketContext() || {};

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  //calling the new message listening hook
  useListenMessages();

  // Handle image selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send message with optional image
  const handlesendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !selectedUser) return;

    try {
      setIsLoading(true);
      let imageUrl = '';

      // Upload image to Cloudinary if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('upload_preset', 'Chat_images'); // Replace with your preset

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, // Replace with your cloud name
          {
            method: 'POST',
            body: formData,
          }
        );

        const uploadData = await uploadResponse.json();
        if (!uploadData.secure_url) throw new Error('Image upload failed');
        imageUrl = uploadData.secure_url;
      }

      // Send message using your existing API call
      const response = await sendMessage(selectedUser._id, newMessage, role, imageUrl);

      if (response?.success) {
        const tempMessage: Message = {
          _id: response.data?._id || Date.now().toString(), // Use backend ID if available
          message: newMessage,
          createdAt: new Date().toISOString(),
          senderId: currentUserId,
          receiverId: selectedUser._id,
          ...(imageUrl && { imageUrl }),
        };

        setMessages([...messages, tempMessage]);
        setNewMessage('');
        setSelectedImage(null);
        setImagePreview(null);

        await handleGetMessages(); // Refresh messages
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages
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

  // Format timestamp
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date value:", timestamp);
        return "Invalid Date";
      }
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error("Error parsing timestamp:", error, "Value:", timestamp);
      return "Invalid Date";
    }
  };

  // Check if user is online
  const isUserOnline = (userId: string) => {
    return Array.isArray(onlineUser) && onlineUser.includes(userId);
  };

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      handleGetMessages();
    }
  }, [selectedUser]);

  // Scroll to bottom when messages update
  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  // Render empty state if no user selected
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
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
            <p className={`text-sm ${isUserOnline(selectedUser._id) ? 'text-green-500' : 'text-gray-500'}`}>
              {isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Message Display */}
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
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${isReceivedMessage
                      ? 'bg-white border border-gray-200'
                      : 'bg-indigo-600 text-white'
                    }`}
                >
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="Shared image"
                      className="max-w-full rounded-lg mb-2"
                    />
                  )}
                  {message.message && (
                    <p className={isReceivedMessage ? 'text-gray-900' : 'text-white'}>
                      {message.message}
                    </p>
                  )}
                  <p
                    className={`text-xs mt-1 ${isReceivedMessage ? 'text-gray-500' : 'text-indigo-200'
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

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        {imagePreview && (
          <div className="mb-4">
            <img src={imagePreview} alt="Preview" className="max-w-[200px] rounded-lg" />
            <button
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
              className="mt-2 text-sm text-red-500"
            >
              Remove Image
            </button>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <label className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200">
            <ImageIcon className="w-5 h-5 text-gray-600" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isLoading}
            />
          </label>
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
            className={`p-2 bg-indigo-600 text-white rounded-full transition-colors flex items-center justify-center relative ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            onClick={handlesendMessage}
            disabled={isLoading}
          >
            {isLoading && (
              <span className="absolute w-full h-full rounded-full border-4 border-indigo-600 border-t-purple-300 animate-spin"></span>
            )}
            <Send className="w-5 h-5 z-10" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;