'use client'
import React, { useState } from 'react';
import ChatSidebar from '@/components/chat/chatSidebar';
import ChatWindow from '@/components/chat/chatWindow';
import Navbar from '@/components/student/navbar';
import { UserMinimal } from '@/types/types';
import useAuthStore from '@/store/userAuthStore';


const Chat = () => {
  const { user } = useAuthStore()
  const userId = user?.id as string
  const [selectedUser, setSelectedUser] = useState<UserMinimal | null>(null);


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="h-screen flex pt-18">
        <ChatSidebar
          role={"Student"}
          onSelectUser={setSelectedUser}
          selectedUserId={selectedUser?._id}
        />
        <ChatWindow role={"Student"} selectedUser={selectedUser} currentUserId={userId} />
      </div>
    </div>
  );
}

export default Chat;

