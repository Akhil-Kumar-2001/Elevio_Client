'use client'

import React, { createContext, useContext, useState, useRef } from 'react';
import { useSocketContext } from '@/context/SocketContext';

interface WebRTCContextType {
  startCall: (roomId: string, initiator: boolean) => Promise<void>;
  endCall: () => void;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callError: string | null;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [callError, setCallError] = useState<string | null>(null);
  const { socket } = useSocketContext() || { socket: null };
  const roomId = useRef<string | null>(null);

  const setupLocalStream = async () => {
    try {
      if (localStream) {
        console.log('Local stream already exists');
        return localStream;
      }

      console.log('Requesting camera and microphone access...');
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log('Available devices:', devices);
      const videoDevice = devices.find((device) => device.kind === 'videoinput' && device.label.includes('OBS'));
      const constraints = videoDevice
        ? { video: { deviceId: { exact: videoDevice.deviceId } }, audio: true }
        : { video: true, audio: true };

      console.log('Attempting to get user media with:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Successfully acquired media stream:', stream.getTracks());
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      let errorMsg = 'Could not access camera or microphone';
      if (error instanceof Error) {
        if (error.name === 'NotReadableError') {
          errorMsg = 'Camera is in use by another tab or application. Please use a virtual camera (e.g., OBS) or test on separate devices.';
        } else if (error.message.includes('Permission denied')) {
          errorMsg = 'Camera or microphone permission denied. Please allow access.';
        } else {
          errorMsg = error.message || 'An unexpected error occurred.';
        }
      }
      setCallError(errorMsg);
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        console.log('Falling back to audio-only stream:', audioStream.getTracks());
        setLocalStream(audioStream);
        return audioStream;
      } catch (audioError) {
        console.error('Failed to acquire audio-only stream:', audioError);
        throw audioError;
      }
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
      ],
    });

    if (localStream) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    } else {
      console.log('No local stream available to add to peer connection');
    }

    pc.ontrack = (event) => {
      console.log('Received remote track:', event.track);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socket && roomId.current) {
        socket.emit('ice-candidate', { roomId: roomId.current, candidate: event.candidate });
        console.log('Sent ICE candidate:', event.candidate);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'failed') {
        setCallError('Connection failed. Please try again.');
        pc.restartIce();
      }
    };

    pc.onsignalingstatechange = () => {
      console.log('Signaling state:', pc.signalingState);
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'failed') {
        setCallError('Connection failed. Please try again.');
      }
    };

    return pc;
  };

  const startCall = async (roomIdParam: string, initiator: boolean) => {
    if (!socket) {
      setCallError('Socket not connected');
      return;
    }

    if (roomId.current) {
      console.log(`Already in room ${roomId.current}, not rejoining`);
      return;
    }

    roomId.current = roomIdParam;
    console.log(`Starting call for room: ${roomIdParam}, initiator: ${initiator}`);

    try {
      const stream = await setupLocalStream();
      setLocalStream(stream);

      socket.emit('join-room', { roomId: roomIdParam });

      if (initiator) {
        socket.once('user-joined', async ({ userId }) => {
          console.log(`User ${userId} joined room ${roomIdParam}, proceeding with offer`);
          const pc = createPeerConnection();
          setPeerConnection(pc);

          stream.getTracks().forEach((track) => pc.addTrack(track, stream));
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { offer, roomId: roomIdParam });
        });
      } else {
        const pc = createPeerConnection();
        setPeerConnection(pc);

        socket.once('offer', async ({ offer }) => {
          console.log('Received offer for room:', roomIdParam);
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { answer, roomId: roomIdParam });
        });

        socket.on('answer', async ({ answer }) => {
          if (!pc) return;
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log('Set remote answer:', answer);
        });

        socket.on('ice-candidate', async ({ candidate }) => {
          if (!pc) return;
          await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
          console.log('Added ICE candidate:', candidate);
        });

        socket.on('user-left', ({ userId }) => {
          console.log(`User ${userId} left room ${roomIdParam}`);
          setCallError('The other user has left the call.');
          endCall();
        });
      }
    } catch (error) {
      console.error('Error in startCall:', error);
      setCallError('Failed to start call');
    }
  };

  const endCall = () => {
    console.log(`Ending call for room: ${roomId.current}`);
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    if (socket && roomId.current) {
      socket.emit('leave-room', roomId.current);
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
    }
    roomId.current = null;
    setCallError(null);
    console.log('Cleaning up WebRTC resources');
  };

  return (
    <WebRTCContext.Provider value={{ startCall, endCall, localStream, remoteStream, callError }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};