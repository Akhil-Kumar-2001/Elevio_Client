import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  duration: number;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, duration }) => {
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="flex items-center rounded-full bg-black/30 px-4 py-2">
        {isConnected ? (
          <>
            <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-white">Connected</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm font-medium text-white">{formatDuration(duration)}</span>
          </>
        ) : (
          <>
            <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium text-white">Connecting...</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;