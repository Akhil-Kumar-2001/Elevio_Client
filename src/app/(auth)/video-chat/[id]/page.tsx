'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocketContext } from '@/context/SocketContext';
import userAuthStore from '@/store/userAuthStore';
import { toast } from 'react-toastify';
import { getSessionDetails, updateSessionStatus } from '@/app/service/user/userApi';
import VideoCallInterface from '@/components/videochat/videoCallInterface';

interface SessionDetails {
  _id: string;
  tutorId: string;
  studentId: string;
  roomId: string;
  startTime: string;
  duration: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

const StudentVideoChat = () => {
  const params = useParams();
  const router = useRouter();
  const { socket } = useSocketContext() || {};
  const [sessionData, setSessionData] = useState<SessionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = userAuthStore();
  const sessionId = params?.id as string;

  useEffect(() => {
    console.log('Socket instance in StudentVideoChat:', socket);
    if (!sessionId || !user) {
      setError('Invalid session or user not authenticated');
      setIsLoading(false);
      return;
    }

    const fetchSessionDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getSessionDetails(sessionId);

        if (response.success) {
          const session = response.data;

          if (session.studentId !== user.id) {
            setError('You are not authorized to join this session');
            return;
          }

          const now = new Date();
          const startTime = new Date(session.startTime);
          const endTime = new Date(startTime.getTime() + session.duration * 60 * 1000);
          const fiveMinutesBefore = new Date(startTime.getTime() - 5 * 60 * 1000);

          if (now < fiveMinutesBefore) {
            setError('Session join window not yet open (starts 5 minutes before)');
            return;
          }

          if (now > endTime || session.status === 'completed' || session.status === 'cancelled') {
            setError('This session has already ended or been cancelled');
            return;
          }

          if (session.status === 'scheduled' && now >= startTime) {
            await updateSessionStatus(session._id, 'active');
            session.status = 'active';
          }

          setSessionData(session);
        } else {
          setError('Failed to load session details');
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to load session details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionDetails();

    if (socket) {
      socket.on('session-updated', (data) => {
        if (data.sessionId === sessionId) {
          setSessionData((prev) => (prev ? { ...prev, status: data.status } : null));
          if (data.status === 'completed' || data.status === 'cancelled') {
            toast.info('Session has ended');
            router.push('/home');
          }
        }
      });

      socket.on('call-ended', () => {
        toast.info('Call has been ended by the tutor');
        router.push('/home');
      });

      return () => {
        socket.off('session-updated');
        socket.off('call-ended');
      };
    }
  }, [sessionId, user, socket, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900">
        <div className="text-white text-xl mb-4">{error}</div>
        <button
          onClick={() => router.push(`/profile/${user?.id}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Session not found</div>
      </div>
    );
  }

  return (
      <div className="h-screen">
        <VideoCallInterface role={"student"} />
      </div>
  );
};

export default StudentVideoChat;