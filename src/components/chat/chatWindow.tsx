
import React, { useEffect, useRef, useState } from 'react';
import { Send, Image as ImageIcon, Trash2, CheckSquare, Calendar } from 'lucide-react';
import { SessionData, UserMinimal } from '@/types/types';
import { getMessages as fetchMessagesFromAPI, sendMessage, deleteMessages, markMessagesAsRead } from '@/app/service/shared/chatService';
import { createSession } from '@/app/service/shared/chatService';
import useConversation from '@/store/useConversation';
import useListenMessages from '@/app/hooks/useLinstenMessageHook';
import { useSocketContext } from '@/context/SocketContext';
import useListenDeleteMessages from '@/app/hooks/useListenDeletedHook';

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
  isDeleted?: boolean;
  isRead?: boolean;
}

interface ChatWindowProps {
  role: string;
  selectedUser: ExtendedUserMinimal | null;
  currentUserId: string;
}

interface ScheduleForm {
  date: string;
  startTime: string;
  duration: number;
}

const CloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'your-cloud-name';

const ChatWindow: React.FC<ChatWindowProps> = ({ role, selectedUser, currentUserId }) => {
  const { 
    getMessages, 
    setMessages, 
    addMessage,
    setLastMessageMeta, 
    resetUnreadCount, 
    selectedConversation 
  } = useConversation();
  
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    date: '',
    startTime: '',
    duration: 30,
  });
  const { onlineUser = [] } = useSocketContext() || {};

  const conversationId = selectedUser?._id;
  const messages = conversationId ? getMessages(conversationId) : [];

  const inputRef = useRef<HTMLInputElement>(null);

  useListenMessages();
  useListenDeleteMessages();

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

  const handleSelectMessage = (messageId: string) => {
    const message = messages.find((msg) => msg._id === messageId);
    if (message && message.senderId === currentUserId && !message.isDeleted) {
      if (selectedMessageIds.includes(messageId)) {
        setSelectedMessageIds(selectedMessageIds.filter((id) => id !== messageId));
      } else {
        setSelectedMessageIds([...selectedMessageIds, messageId]);
      }
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || role !== 'Tutor') return;

    try {
      setIsLoading(true);
      
      // Combine date and time
      const startTime = new Date(`${scheduleForm.date}T${scheduleForm.startTime}`);
      
      const sessionData: SessionData = {
        tutorId: currentUserId,
        studentId: selectedUser._id,
        startTime,
        duration: scheduleForm.duration,
        roomId: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'scheduled',
      };

      const result = await createSession(sessionData);

      if (result.success) {
        // Send a message notification about the scheduled session
        await sendMessage(
          selectedUser._id,
          `Session scheduled for ${startTime.toLocaleString()} (${scheduleForm.duration} minutes)`,
          role,
          ''
        );

        setIsScheduleModalOpen(false);
        setScheduleForm({
          date: '',
          startTime: '',
          duration: 30,
        });
        
        // Refresh messages to show the notification
        await handleGetMessages();
      } else {
        throw new Error(result.message || 'Failed to schedule session');
      }
    } catch (error) {
      console.error('Error scheduling session:', error);
      // alert('Failed to schedule session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlesendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !selectedUser) return;
    try {
      setIsLoading(true);
      let imageUrl = '';

      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('upload_preset', 'Chat_images');

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${CloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const uploadData = await uploadResponse.json();
        if (!uploadData.secure_url) throw new Error('Image upload failed');
        imageUrl = uploadData.secure_url;
      }

      setLastMessageMeta({
        senderId: currentUserId,
        receiverId: selectedUser._id,
        message: newMessage || (imageUrl ? '[Image]' : ''),
      });

      const response = await sendMessage(selectedUser._id, newMessage, role, imageUrl);

      if (response?.success) {
        const tempMessage: Message = {
          _id: response.data?._id || Date.now().toString(),
          message: newMessage,
          createdAt: new Date().toISOString(),
          senderId: currentUserId,
          receiverId: selectedUser._id,
          ...(imageUrl && { imageUrl }),
          isDeleted: false,
          isRead: false,
        };

        addMessage(selectedUser._id, tempMessage);
        setNewMessage('');
        setSelectedImage(null);
        setImagePreview(null);

        await handleGetMessages();
        if (inputRef.current) {
          inputRef.current.focus();
        }
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

  const handleDeleteMessages = async () => {
    if (selectedMessageIds.length === 0 || !selectedUser) return;

    try {
      setIsLoading(true);
      const response = await deleteMessages(selectedUser._id, selectedMessageIds, role);

      if (response?.success) {
        setSelectedMessageIds([]);
        setIsSelecting(false);
        await handleGetMessages();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        throw new Error('Failed to delete messages');
      }
    } catch (error) {
      console.error('Error deleting messages:', error);
      alert('Failed to delete messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMessages = async () => {
    if (!selectedUser) return;

    try {
      setIsLoading(true);
      const response = await fetchMessagesFromAPI(selectedUser._id, role);
      if (response.success && Array.isArray(response.data)) {
        setMessages(selectedUser._id, response.data);
        await markMessagesAsRead(selectedUser._id, role);
        resetUnreadCount(selectedUser._id);
      }
    } catch (error) {
      console.error('Error getting messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', timestamp);
        return 'Invalid Date';
      }
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error parsing timestamp:', error, 'Value:', timestamp);
      return 'Invalid Date';
    }
  };

  const isUserOnline = (userId: string) => {
    return Array.isArray(onlineUser) && onlineUser.includes(userId);
  };

  useEffect(() => {
    if (inputRef.current && selectedUser) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      handleGetMessages();
    }
  }, [selectedUser]);

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
            <h3 className="text-lg font-semibold text-gray-900">{selectedUser.username}</h3>
            <p
              className={`text-sm ${isUserOnline(selectedUser._id) ? 'text-green-500' : 'text-gray-500'}`}
            >
              {isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isSelecting ? (
            <>
              <button
                onClick={handleDeleteMessages}
                className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading || selectedMessageIds.length === 0}
                title="Delete selected messages"
              >
                <Trash2 className="w-5 h-5" />
                {selectedMessageIds.length > 0 && (
                  <span className="ml-2 text-sm">{selectedMessageIds.length}</span>
                )}
              </button>
              <button
                onClick={() => {
                  setIsSelecting(false);
                  setSelectedMessageIds([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSelecting(true)}
              className="p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
              title="Select messages"
            >
              <CheckSquare className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div
        id="message-container"
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50"
      >
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
            const isDeleted = message.isDeleted || false;

            return (
              <div
                key={message._id}
                className={`flex ${isReceivedMessage ? 'justify-start' : 'justify-end'} items-center`}
              >
                {isSelecting && !isDeleted && message.senderId === currentUserId && (
                  <input
                    type="checkbox"
                    checked={selectedMessageIds.includes(message._id)}
                    onChange={() => handleSelectMessage(message._id)}
                    className="mr-2"
                  />
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isReceivedMessage ? 'bg-white border border-gray-200' : 'bg-indigo-600 text-white'
                  } ${isDeleted ? 'opacity-50' : ''}`}
                >
                  {isDeleted ? (
                    <p className={isReceivedMessage ? 'text-gray-500 italic' : 'text-white italic'}>
                      Message is deleted
                    </p>
                  ) : (
                    <>
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
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <p
                      className={`text-xs mt-1 ${isReceivedMessage ? 'text-gray-500' : 'text-indigo-200'}`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

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
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlesendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border text-gray-700 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          {role === 'Tutor' && (
            <button
              className="p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
              onClick={() => setIsScheduleModalOpen(true)}
              disabled={isLoading}
              title="Schedule a session"
            >
              <Calendar className="w-5 h-5" />
            </button>
          )}
          <button
            className={`p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center relative ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
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

      {/* Schedule Session Modal (Only for tutors) */}
      {role === 'Tutor' && isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-black mb-4">Schedule a Session</h2>
            <form onSubmit={handleScheduleSession}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={scheduleForm.startTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={scheduleForm.duration}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;