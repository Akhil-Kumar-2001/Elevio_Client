'use client';

import { getNotifications, getTutor, readNotification } from "@/app/service/tutor/tutorApi";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/tutorAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from '@/app/utils/relativeTimeFormat';
import useNotification from "@/store/notificationStore";
import useListenNotification from "@/app/hooks/useListenNotificationHook";

const Navbar = () => {
  interface TutorType {
    _id: string;
    username: string;
    email: string;
    status: number;
    role: string;
    createdAt: string;
    profile?: {
      profilePicture?: string;
    };
  }

  // Initialize live notification listener
  useListenNotification();

  const router = useRouter();
  const [tutor, setTutor] = useState<TutorType | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [demo, setDemo] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Use Zustand store for notifications
  const { notifications, setNotifications } = useNotification();
  const unreadNotifications = notifications.filter(n => !n.isRead).length; // Compute dynamically

  const { user } = useAuthStore();
  const tutorId = user?.id;

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      if (response.data && Array.isArray(response.data)) {
        setNotifications(response.data); // Set initial notifications
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchTutorDetails = async () => {
    try {
      if (!tutorId) {
        console.log("Tutor ID is missing! User may not be authenticated.");
        return;
      }

      const response = await getTutor(tutorId);
      setTutor(response.data);
      const verificationStatus = response.data.isVerified;

      if (verificationStatus === "not_verified") {
        router.push("/tutor/verification");
      } else if (verificationStatus === "pending") {
        router.push("/tutor/pending-page");
      } else {
        router.push("/tutor/profile");
      }
    } catch (error) {
      console.log("Failed to fetch tutor details:", error);
    }
  };

  const getImageTutor = async () => {
    if (!tutorId) {
      console.log("Tutor ID is missing! User may not be authenticated.");
      return;
    }
    try {
      const response = await getTutor(tutorId);
      setImage(response.data.profile?.profilePicture || null);
      setDemo(response.data.username.charAt(0).toUpperCase());
    } catch (error) {
      console.error("Failed to fetch profile image:", error);
    }
  };

  // Toggle notification panel
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      await readNotification(id);
      setNotifications(
        notifications.map(notification =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Handle clicking on a notification
  const handleNotificationItemClick = (id: string) => {
    markAsRead(id);
    // Add navigation logic here if needed
  };

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showNotifications && !target.closest('.notification-panel') && !target.closest('.notification-icon')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Fetch initial data
  useEffect(() => {
    if (tutorId) {
      fetchNotifications();
      getImageTutor();
    }
  }, [tutorId]);

  return (
    <nav className="w-full flex items-center justify-between px-12 py-3 border-b border-gray-200 bg-white">
      {/* Logo on the left */}
      <div className="flex items-center">
        <Link href="/tutor/dashboard">
          <h1 className="font-bold text-black text-2xl">Elevio</h1>
        </Link>
      </div>

      {/* Notifications and Profile on the Right */}
      <div className="flex items-center gap-4">
        {/* Notification Icon with Badge */}
        <div className="relative cursor-pointer notification-icon" onClick={handleNotificationClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 hover:text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadNotifications > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </div>
          )}
        </div>

        {/* Notification Panel */}
        {showNotifications && (
          <div className="absolute top-16 right-12 w-96 bg-white rounded-lg shadow-xl z-50 notification-panel">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-black text-lg">Notifications</h2>
                <div className="flex items-center">
                  {/* <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button> */}
                  <button className="ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex mt-2">
                <button className="mr-2 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                  Important
                </button>
                {/* <button className="px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                  All notifications
                </button> */}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications to display
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationItemClick(notification._id)}
                    className={`flex p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-start ml-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile Picture */}
        <div className="flex items-center cursor-pointer" onClick={fetchTutorDetails}>
          {image ? (
            <Image
              src={image}
              alt="Tutor Profile"
              width={36}
              height={36}
              className="rounded-full w-9 h-9 object-cover"
            />
          ) : (
            <div className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold">
              {demo || ""}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;