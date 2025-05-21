
import React, { useState, useEffect, useRef, useCallback } from "react";
import VideoContainer from "./videoContainer";
import CallControls from "./callControls";
import ConnectionStatus from "./connectionStatus";
import { io, Socket } from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import userAuthStore from "@/store/userAuthStore";
import tutorAuthStore from "@/store/tutorAuthStore";
import { toast } from "react-toastify";

interface VideoCallInterfaceProps {
  role: "tutor" | "student";
}

const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({ role }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isLocalVideoMain, setIsLocalVideoMain] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [showRetry, setShowRetry] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<number | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const { sessionId } = useParams();
  const router = useRouter();
  const authStore = role === "student" ? userAuthStore : tutorAuthStore;
  const userId = authStore.getState().user?.id;

  const checkDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideo = devices.some((device) => device.kind === "videoinput");
      const hasAudio = devices.some((device) => device.kind === "audioinput");
      if (!hasVideo) {
        toast.error("No camera detected. Please connect a camera to enable video.");
        setVideoError(true);
        setIsVideoOn(false);
      }
      if (!hasAudio) {
        toast.error("No microphone detected. Please connect a microphone to enable audio.");
      }
      return { hasVideo, hasAudio };
    } catch (error) {
      console.error("Error enumerating devices:", error);
      toast.error("Unable to detect devices. Please check your hardware and permissions.");
      return { hasVideo: false, hasAudio: false };
    }
  };

  const startMedia = useCallback(async () => {
    try {
      const { hasVideo, hasAudio } = await checkDevices();
      if (!hasVideo && !hasAudio) {
        toast.error("No camera or microphone available. Please connect a device to proceed.", {
          autoClose: false,
          onClose: () => setShowRetry(true),
        });
        return;
      }

      let stream: MediaStream;
      if (hasVideo && hasAudio) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } else if (hasAudio) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setVideoError(true);
        setIsVideoOn(false);
        toast.info("No camera detected. Proceeding with audio-only.", { autoClose: false });
      } else {
        toast.error("No audio device available. Please connect a microphone to proceed.", {
          autoClose: false,
          onClose: () => setShowRetry(true),
        });
        return;
      }

      // Stop any existing tracks to prevent duplicates
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to peer connection only if not already added
      if (peerConnectionRef.current) {
        const existingSenders = peerConnectionRef.current.getSenders();
        const existingTrackIds = existingSenders.map((sender) => sender.track?.id);

        stream.getTracks().forEach((track) => {
          if (!existingTrackIds.includes(track.id)) {
            peerConnectionRef.current?.addTrack(track, stream);
            console.log(`Added track to peer connection: ${track.kind}`);
          } else {
            console.log(`Track already added to peer connection: ${track.kind}`);
          }
        });
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      if ((error as Error).name === "NotReadableError") {
        toast.error(
          "Camera or microphone is in use by another application. Please close other apps and try again.",
          { autoClose: false, onClose: () => setShowRetry(true) }
        );
      } else if ((error as Error).name === "NotAllowedError") {
        toast.error("Please grant permission to access your camera and microphone.", {
          autoClose: false,
          onClose: () => setShowRetry(true),
        });
        setVideoError(true);
        setIsVideoOn(false);
      } else if ((error as Error).name === "NotFoundError") {
        toast.error("No camera or microphone found. Please connect a device and try again.", {
          autoClose: false,
          onClose: () => setShowRetry(true),
        });
      } else {
        toast.error("Failed to access camera or microphone. Please check your device settings.", {
          autoClose: false,
          onClose: () => setShowRetry(true),
        });
      }

      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        localStreamRef.current = audioStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = audioStream;
        }
        if (peerConnectionRef.current) {
          const existingSenders = peerConnectionRef.current.getSenders();
          const existingTrackIds = existingSenders.map((sender) => sender.track?.id);

          audioStream.getTracks().forEach((track) => {
            if (!existingTrackIds.includes(track.id)) {
              peerConnectionRef.current?.addTrack(track, audioStream);
              console.log(`Added audio-only track to peer connection: ${track.kind}`);
            } else {
              console.log(`Audio track already added to peer connection: ${track.kind}`);
            }
          });
        }
        setVideoError(true);
        setIsVideoOn(false);
        toast.info("Proceeding with audio-only due to video access issue.", { autoClose: false });
      } catch (audioError) {
        console.error("Error accessing audio fallback:", audioError);
        toast.error("Unable to access audio. Please check your device and permissions.", {
          autoClose: false,
          onClose: () => setShowRetry(true),
        });
      }
    }
  }, []); // Empty dependencies since checkDevices is stable

  const endCall = () => {
    console.log("Call ended. Triggered by:", new Error().stack);
    console.log("Ending call...");
    setIsConnected(false);
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    const localStream = localStreamRef.current;
    const remoteStream = remoteVideoRef.current?.srcObject as MediaStream;
    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    peerConnectionRef.current?.close();
    socketRef.current?.emit("end-session", { sessionId });
  };

  const handleEndCallButton = () => {
    endCall();
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  // 1. Socket.IO Initialization
  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      query: { userId },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
    });
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      toast.error("Failed to connect to the server. Please try again.");
    });
    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current.emit("join-session", { sessionId, userId, role });

    socketRef.current.on("user-joined", async ({ role: otherRole }) => {
      if (role === "tutor" && otherRole === "student") {
        try {
          console.log("Student joined, creating offer...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const offer = await peerConnectionRef.current?.createOffer();
          await peerConnectionRef.current?.setLocalDescription(offer);
          console.log("Offer created and set:", offer);
          socketRef.current?.emit("offer", { sessionId, offer, fromUserId: userId });
        } catch (error) {
          console.error("Error creating offer:", error);
          toast.error("Failed to create offer. Please try again.");
        }
      }
    });

    socketRef.current.on("offer", async ({ offer }) => {
      if (role === "student" && peerConnectionRef.current) {
        try {
          console.log("Received offer from tutor:", offer);
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          console.log("Answer created and set:", answer);
          socketRef.current?.emit("answer", { sessionId, answer, fromUserId: userId });
        } catch (error) {
          console.error("Error handling offer:", error);
          toast.error("Failed to handle offer. Please try again.");
        }
      }
    });

    socketRef.current.on("answer", async ({ answer }) => {
      if (role === "tutor" && peerConnectionRef.current) {
        try {
          console.log("Received answer from student:", answer);
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          console.log("Remote description set successfully");
        } catch (error) {
          console.error("Error handling answer:", error);
          toast.error("Failed to handle answer. Please try again.");
        }
      }
    });

    socketRef.current.on("ice-candidate", async ({ candidate }) => {
      if (peerConnectionRef.current) {
        try {
          console.log("Received ICE candidate:", candidate);
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("ICE candidate added successfully");
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
          toast.error("Failed to add ICE candidate. Please try again.");
        }
      }
    });

    socketRef.current.on("session-ended", () => {
      console.log("Session ended event received");
      endCall();
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [sessionId, userId, role]);

  // 2. WebRTC and Media Setup
  useEffect(() => {
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          sessionId,
          candidate: event.candidate,
          fromUserId: userId,
        });
        console.log("Sent ICE candidate:", event.candidate);
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind, event.streams[0]);
      if (remoteVideoRef.current) {
        const remoteStream = event.streams[0];
        if (remoteStream.getTracks().length > 0) {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
          console.log("Remote stream assigned to video element");
        } else {
          console.warn("No tracks in remote stream");
        }
      }
    };

    peerConnectionRef.current.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", peerConnectionRef.current?.iceConnectionState);
      if (peerConnectionRef.current?.iceConnectionState === "connected") {
        setIsConnected(true);
      }
    };

    peerConnectionRef.current.onsignalingstatechange = () => {
      console.log("Signaling state:", peerConnectionRef.current?.signalingState);
    };

    startMedia();

    return () => {
      const localStream = localStreamRef.current;
      localStream?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
    };
  }, [sessionId, userId, startMedia]);

  // 3. Call Duration Timer
  useEffect(() => {
    durationIntervalRef.current = window.setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // 4. Controls Visibility Handler
  useEffect(() => {
    const handleMouseMovement = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMovement);
    window.addEventListener("click", handleMouseMovement);
    handleMouseMovement();

    return () => {
      window.removeEventListener("mousemove", handleMouseMovement);
      window.removeEventListener("click", handleMouseMovement);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // 5. StrictMode and Cleanup Handling
  useEffect(() => {
    console.log("Main effect running");
    let isInitialMount = true;

    return () => {
      console.log("Cleanup running, isInitialMount:", isInitialMount);
      if (isInitialMount) {
        isInitialMount = false;
        console.log("Skipping actual cleanup due to StrictMode");
        return;
      }

      const isRerender = document.visibilityState !== "hidden";
      if (isRerender) {
        console.log("This appears to be a re-render, not stopping the call");
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
      } else {
        console.log("Component is truly unmounting, ending call");
        endCall();
      }
    };
  }, [sessionId, userId, role]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    const stream = localVideoRef.current?.srcObject as MediaStream;
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !isMuted;
    });
  };

  const toggleVideo = () => {
    if (videoError) {
      toast.warn("Video is unavailable due to earlier error. Please retry accessing the camera.");
      return;
    }
    setIsVideoOn((prev) => !prev);
    const stream = localVideoRef.current?.srcObject as MediaStream;
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !isVideoOn;
    });
  };

  const swapVideos = () => {
    setIsLocalVideoMain((prev) => !prev);
  };

  const retryMediaAccess = async () => {
    setShowRetry(false);
    const localStream = localStreamRef.current;
    localStream?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;

    const senders = peerConnectionRef.current?.getSenders() || [];
    senders.forEach((sender) => peerConnectionRef.current?.removeTrack(sender));

    await startMedia();
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
      onDoubleClick={swapVideos}
    >
      <div className="h-full w-full">
        <VideoContainer
          videoRef={isLocalVideoMain ? localVideoRef : remoteVideoRef}
          isMain={true}
          isMuted={isLocalVideoMain ? isMuted : false}
          isVideoOff={isLocalVideoMain ? !isVideoOn : false}
          userName={isLocalVideoMain ? "You" : role === "tutor" ? "Student" : "Tutor"}
        />
      </div>
      <div
        className="absolute bottom-24 right-8 z-10 w-1/4 max-w-xs transition-all duration-300 ease-in-out md:bottom-32 md:right-8 lg:w-1/5"
        onClick={swapVideos}
      >
        <VideoContainer
          videoRef={isLocalVideoMain ? remoteVideoRef : localVideoRef}
          isMain={false}
          isMuted={isLocalVideoMain ? false : isMuted}
          isVideoOff={isLocalVideoMain ? false : !isVideoOn}
          userName={isLocalVideoMain ? (role === "tutor" ? "Student" : "Tutor") : "You"}
          className="shadow-xl rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 py-6 transition-opacity duration-300 ease-in-out bg-gradient-to-t from-black/80 to-transparent ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto">
          <ConnectionStatus isConnected={isConnected} duration={callDuration} />
          <CallControls
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onEndCall={handleEndCallButton}
          />
          {showRetry && (
            <button
              onClick={retryMediaAccess}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry Camera Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallInterface;