import React from 'react';
import {  MicOff, VideoOff } from 'lucide-react';

interface VideoContainerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMain: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  userName: string;
  className?: string;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  videoRef, 
  isMuted,
  isVideoOff,
  userName,
  className = ''
}) => {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={userName === "You"} // Always mute local video to prevent feedback
        className={`h-full w-full object-cover ${
          isVideoOff ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Video off indicator */}
      {isVideoOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-700">
              <span className="text-2xl font-medium text-white">
                {userName.charAt(0)}
              </span>
            </div>
            <span className="mt-3 text-white">{userName}</span>
          </div>
        </div>
      )}

      {/* User name and status indicators */}
      <div className="absolute bottom-0 left-0 flex items-center p-4">
        <span className="mr-2 text-sm font-medium text-white">{userName}</span>
        
        {/* Status indicators */}
        <div className="flex items-center space-x-2">
          {isMuted && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
              <MicOff size={14} className="text-white" />
            </div>
          )}
          {isVideoOff && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
              <VideoOff size={14} className="text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;