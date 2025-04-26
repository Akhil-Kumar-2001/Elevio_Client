'use client'

import { getSessions } from '@/app/service/tutor/tutorApi';
import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import { SessionInfo } from '@/types/types';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ScheduledSession = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [expanded, setExpanded] = useState<boolean>(true);
  const router = useRouter();

  // Sample data (for fallback if API fails)
  const sessionFallback: SessionInfo[] = [
    {
      _id: '1',
      studentName: 'John Doe',
      startTime: new Date('2025-04-23T14:00:00'),
      duration: 60,
      status: 'scheduled',
      roomId: 'room-1',
    },
    {
      _id: '2',
      studentName: 'Jane Smith',
      startTime: new Date('2025-04-23T15:30:00'),
      duration: 45,
      status: 'scheduled',
      roomId: 'room-2',
    },
  ];

  const fetchSessions = async () => {
    try {
      const response = await getSessions();
      if (response.success) {
        const convertedSessions = response.data.map((session: SessionInfo) => ({
          ...session,
          startTime: new Date(session.startTime),
        }));
        setSessions(convertedSessions);
      } else {
        setSessions(sessionFallback);
      }
    } catch (error) {
      console.log('Error while fetching Scheduled sessions:', error);
      setSessions(sessionFallback);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Modified canJoinSession to handle tutor-specific time window (10 minutes)
  const canJoinSession = (sessionStartTime: Date, durationMinutes: number, userRole: 'tutor' | 'student') => {
    if (!(sessionStartTime instanceof Date) || isNaN(sessionStartTime.getTime())) {
      console.error('Invalid session start time:', sessionStartTime);
      return false;
    }

    const sessionEndTime = new Date(sessionStartTime.getTime() + durationMinutes * 60000);
    const timeDiffStart = (sessionStartTime.getTime() - currentTime.getTime()) / (1000 * 60);
    const timeDiffEnd = (sessionEndTime.getTime() - currentTime.getTime()) / (1000 * 60);

    // Tutor can join 10 minutes before, student 5 minutes before
    const joinWindowMinutes = userRole === 'tutor' ? 10 : 5;
    return timeDiffStart <= joinWindowMinutes && timeDiffEnd >= 0;
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], options)}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${date.toLocaleTimeString([], options)}`;
    }
  };

  const getStatusColor = (status: string, startTime: Date, duration: number) => {
    if (status !== 'scheduled') return 'bg-gray-100 text-gray-800';

    const sessionEndTime = new Date(startTime.getTime() + duration * 60000);

    if (currentTime < startTime && (startTime.getTime() - currentTime.getTime()) <= 10 * 60 * 1000) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (currentTime >= startTime && currentTime <= sessionEndTime) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  const getSessionStatusText = (status: string, startTime: Date, duration: number) => {
    if (status !== 'scheduled') return status;

    const sessionEndTime = new Date(startTime.getTime() + duration * 60000);

    if (currentTime < startTime && (startTime.getTime() - currentTime.getTime()) <= 10 * 60 * 1000) {
      return 'Starting soon';
    } else if (currentTime >= startTime && currentTime <= sessionEndTime) {
      return 'In progress';
    } else {
      return 'Scheduled';
    }
  };

  const handleJoinSession = (sessionId: string) => {
    console.log('Navigating to session:', sessionId);
    router.push(`/tutor/video-chat/${sessionId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar />
      </div>

      <div className="flex flex-1 mt-16">
        <div className="fixed top-16 left-0 h-full z-10">
          <TutorSidebar expanded={expanded} setExpanded={setExpanded} />
        </div>

        <div
          className={`flex-1 p-6 transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'} mt-2`}
        >
          <h1 className="text-2xl font-semibold mb-8 text-gray-800">Scheduled Sessions</h1>

          {sessions.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-600">No scheduled sessions available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session, index) => {
                const statusColor = getStatusColor(session.status, session.startTime, session.duration);
                const statusText = getSessionStatusText(session.status, session.startTime, session.duration);
                const sessionEndTime = new Date(session.startTime.getTime() + session.duration * 60000);
                const isActive = currentTime >= session.startTime && currentTime <= sessionEndTime;
                const isUpcoming = currentTime < session.startTime;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-800">{session.studentName}</h2>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>

                    <div className="px-5 py-4">
                      <div className="flex items-center mb-3">
                        <svg
                          className="h-5 w-5 text-gray-500 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-700">{formatDate(session.startTime)}</span>
                      </div>

                      <div className="flex items-center mb-3">
                        <svg
                          className="h-5 w-5 text-gray-500 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-700">{session.duration} minutes</span>
                      </div>
                    </div>

                    <div className="px-5 pb-5">
                      {canJoinSession(session.startTime, session.duration, 'tutor') ? (
                        <button
                          className={`w-full py-2.5 rounded-md font-medium text-white ${
                            isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                          } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isActive ? 'focus:ring-green-500' : 'focus:ring-blue-500'
                          }`}
                          onClick={() => handleJoinSession(session._id)}
                        >
                          {isActive ? 'Join Now' : 'Join Soon'}
                        </button>
                      ) : (
                        <div className="flex items-center justify-center py-2.5">
                          <svg
                            className="h-5 w-5 text-gray-400 mr-2"
                            xmlns="http://www.w3.org/200ui0/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-gray-500 font-medium">
                            Available {isUpcoming ? 'soon' : 'next time'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduledSession;