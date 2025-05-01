import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import ControlButton from './controlButtons';

interface CallControlsProps {
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  isMuted,
  isVideoOn,
  onToggleMute,
  onToggleVideo,
  onEndCall,
}) => {
  return (
    <div className="flex items-center justify-center space-x-3 md:space-x-4">
      <ControlButton
        onClick={onToggleMute}
        active={!isMuted}
        activeColor="bg-gray-700 hover:bg-gray-600"
        inactiveColor="bg-red-500 hover:bg-red-600"
        tooltip={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <MicOff size={24} className="text-white" />
        ) : (
          <Mic size={24} className="text-white" />
        )}
      </ControlButton>

      <ControlButton
        onClick={onToggleVideo}
        active={isVideoOn}
        activeColor="bg-gray-700 hover:bg-gray-600"
        inactiveColor="bg-red-500 hover:bg-red-600"
        tooltip={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
      >
        {isVideoOn ? (
          <Video size={24} className="text-white" />
        ) : (
          <VideoOff size={24} className="text-white" />
        )}
      </ControlButton>

      {/* <ControlButton
        onClick={() => {}}
        active={true}
        activeColor="bg-gray-700 hover:bg-gray-600"
        tooltip="Share screen"
      >
        <Share size={24} className="text-white" />
      </ControlButton> */}

      <ControlButton
        onClick={onEndCall}
        active={true}
        activeColor="bg-red-600 hover:bg-red-700"
        tooltip="End call"
        className="px-2"
      >
        <PhoneOff size={24} className="text-white" />
      </ControlButton>
    </div>
  );
};

export default CallControls;