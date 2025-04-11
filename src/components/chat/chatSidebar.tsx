import React, { useEffect, useState } from 'react';
import { Users, Circle, Search } from 'lucide-react';
import useStudentAuthStore from '@/store/userAuthStore';
import useTutorAuthStore from '@/store/tutorAuthStore';
import { UserMinimal } from '@/types/types';
import { getChats } from '@/app/service/shared/chatService';
import { useSocketContext } from '@/context/SocketContext';

interface ChatSidebarProps {
  role: 'Tutor' | 'Student';
  onSelectUser: (user: UserMinimal) => void;
  selectedUserId?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ role, onSelectUser, selectedUserId }) => {
  const [users, setUsers] = useState<UserMinimal[]>([]);
  const studentUser = useStudentAuthStore((state) => state.user);
  const tutorUser = useTutorAuthStore((state) => state.user);
  const { onlineUser = [] } = useSocketContext() || {};

  const userId = role === 'Student' ? studentUser?.id : tutorUser?.id;

  const fetchChats = async() => {
    try {
      const response = await getChats(role);
      if(response) {
        setUsers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchChats();
  }, [userId]);

  const isUserOnline = (userId: string) => {
    console.log("online users",onlineUser)
    return Array.isArray(onlineUser) && onlineUser.includes(userId);
  };

  return (
    <div className="w-80 bg-white h-full border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 mt-2 ">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {users.map((user, index) => (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className={`flex items-center p-4 cursor-pointer transition-colors ${
              selectedUserId === user._id
                ? 'bg-indigo-50'
                : 'hover:bg-gray-50'
            } ${index !== users.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div className="relative">
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0">
                <Circle
                  fill={isUserOnline(user._id) ? '#10B981' : '#9CA3AF'}
                  className={`w-3 h-3 ${
                    isUserOnline(user._id) ? 'text-emerald-500' : 'text-gray-400'
                  }`}
                />
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col w-full">
                  <p className="text-base font-medium text-gray-900 truncate">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {user.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;