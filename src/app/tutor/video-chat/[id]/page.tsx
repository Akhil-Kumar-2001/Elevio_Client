'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import VideoLayout from '@/components/videochat/VideoLayout';
import { useParams, useRouter } from 'next/navigation';
import { useSocketContext } from '@/context/SocketContext';
import tutorAuthStore from '@/store/tutorAuthStore';
import { toast } from 'react-toastify';
import { getSessionDetails, updateSessionStatus } from '@/app/service/tutor/tutorApi';
import { debounce } from 'lodash';
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

const TutorVideoChat = () => {
  const params = useParams();
  const router = useRouter();
  const { socket } = useSocketContext() || {};
  const [sessionState, setSessionState] = useState<{
    data: SessionDetails | null;
    isLoading: boolean;
    error: string | null;
  }>({
    data: null,
    isLoading: true,
    error: null,
  });
  const { user } = tutorAuthStore();
  const sessionId = params?.id as string;

  const stableUser = useMemo(() => user, [user?.id]);
  const stableSessionId = useMemo(() => sessionId, [sessionId]);

  const handleSessionUpdate = useCallback(
    debounce((data) => {
      if (data.sessionId === stableSessionId) {
        setSessionState((prev) => ({
          ...prev,
          data: prev.data ? { ...prev.data, status: data.status } : null,
        }));
        if (data.status === 'completed' || data.status === 'cancelled') {
          toast.info('Session has ended');
          router.push("/tutor/sessions");
        }
      }
    }, 100),
    [stableSessionId, router]
  );

  useEffect(() => {
    console.log('Socket instance in TutorVideoChat:', socket);
    let isMounted = true;

    if (!stableSessionId || !stableUser) {
      if (isMounted) setSessionState({ data: null, isLoading: false, error: 'Invalid session or user not authenticated' });
      return;
    }

    const fetchSessionDetails = async () => {
      const cachedSession = localStorage.getItem(`session_${stableSessionId}`);
      if (cachedSession) {
        try {
          const parsedSession = JSON.parse(cachedSession);
          if (isMounted) setSessionState({ data: parsedSession, isLoading: false, error: null });
          return;
        } catch (err) {
          console.error('Error parsing cached session:', err);
        }
      }

      try {
        const response = await getSessionDetails(stableSessionId);
        if (response.success) {
          const session = response.data;

          if (session.tutorId !== stableUser.id) {
            if (isMounted) setSessionState({ data: null, isLoading: false, error: 'You are not authorized to join this session' });
            return;
          }

          const now = new Date();
          const startTime = new Date(session.startTime);
          const endTime = new Date(startTime.getTime() + session.duration * 60 * 1000);
          const tenMinutesBefore = new Date(startTime.getTime() - 10 * 60 * 1000);

          if (now < tenMinutesBefore) {
            if (isMounted) setSessionState({ data: null, isLoading: false, error: 'Session join window not yet open (starts 10 minutes before)' });
            return;
          }

          if (now > endTime || session.status === 'completed' || session.status === 'cancelled') {
            if (isMounted) setSessionState({ data: null, isLoading: false, error: 'This session has already ended or been cancelled' });
            return;
          }

          if (session.status === 'scheduled' && now >= startTime) {
            await updateSessionStatus(session._id, 'active');
            session.status = 'active';
          }

          localStorage.setItem(`session_${stableSessionId}`, JSON.stringify(session));
          if (isMounted) setSessionState({ data: session, isLoading: false, error: null });
        } else {
          if (isMounted) setSessionState({ data: null, isLoading: false, error: 'Failed to load session details' });
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        if (isMounted) setSessionState({ data: null, isLoading: false, error: 'Failed to load session details' });
      }
    };

    fetchSessionDetails();

    if (socket) {
      socket.on('session-updated', handleSessionUpdate);
      socket.on('call-ended', () => {
        toast.info('Call has been ended by the student');
        router.push("/tutor/sessions");
      });

      return () => {
        socket.off('session-updated', handleSessionUpdate);
        socket.off('call-ended');
        isMounted = false;
      };
    }
  }, [stableSessionId, stableUser, socket, handleSessionUpdate]);

  // useEffect(() => {
  //   return () => {
  //     if (sessionState.data && sessionState.data.status === 'active') {
  //       updateSessionStatus(sessionId, 'completed').catch((err) =>
  //         console.error('Error updating session status:', err)
  //       );
  //     }
  //   };
  // }, [sessionId, sessionState.data]);

  const { data: sessionData, isLoading, error } = sessionState;

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
          onClick={() => router.push("/tutor/sessions")}
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
      <VideoCallInterface role={"tutor"} />
    </div>

  );
};

export default TutorVideoChat;