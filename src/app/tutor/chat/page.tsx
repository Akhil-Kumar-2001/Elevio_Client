'use client'
import React, { useState } from 'react';
import ChatSidebar from '@/components/chat/chatSidebar';
import ChatWindow from '@/components/chat/chatWindow';
import { UserMinimal } from '@/types/types';
import Navbar from '@/components/tutor/navbar';
import useAuthStore from '@/store/tutorAuthStore';

const Chat = () => {
  const { user } = useAuthStore();
  const tutorId = user?.id as string;
  const [selectedUser, setSelectedUser] = useState<UserMinimal | null>(null);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-grow overflow-hidden mt-14"> {/* Adjust 64px based on your navbar height */}
        <ChatSidebar
          role="Tutor"
          onSelectUser={setSelectedUser}
          selectedUserId={selectedUser?._id}
        />
        <ChatWindow role="Tutor" selectedUser={selectedUser} currentUserId={tutorId} />
      </div>
    </div>
  );
};

export default Chat;