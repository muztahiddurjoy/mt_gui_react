import { useEffect, useRef, useState } from 'react';
import Peer, { Instance, SignalData } from 'simple-peer';

interface WebRTCStatus {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  message: string;
}

const FeedContainer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Instance | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionState, setConnectionState] = useState<WebRTCStatus>({
    status: 'connecting',
    message: 'Connecting to stream...'
  });

  // Status colors for UI
  const statusColors = {
    connecting: 'bg-yellow-500',
    connected: 'bg-green-500',
    disconnected: 'bg-red-500',
    error: 'bg-red-500'
  };

  useEffect(() => {
    const initWebRTC = async () => {
      try {
        // Connect to signaling server
        wsRef.current = new WebSocket('ws://your-signaling-server.com');
        
        wsRef.current.onopen = () => {
          setConnectionState({
            status: 'connecting',
            message: 'Negotiating WebRTC connection...'
          });
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionState({
            status: 'error',
            message: 'Signaling server connection failed'
          });
        };

        // Create peer connection
        const peer = new Peer({
          initiator: false,
          trickle: false,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              // Add your TURN servers if needed
            ]
          }
        }) as Instance;

        peerRef.current = peer;

        // Handle signaling data
        peer.on('signal', (data: SignalData) => {
          wsRef.current?.send(JSON.stringify(data));
        });

        // Handle incoming stream
        peer.on('stream', (stream: MediaStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setConnectionState({
              status: 'connected',
              message: 'Stream active'
            });
          }
        });

        // Handle WebSocket messages
        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'offer') {
            peer.signal(data);
          } else if (data.candidate) {
            peer.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        };

        peer.on('error', (err: Error) => {
          console.error('Peer error:', err);
          setConnectionState({
            status: 'error',
            message: `Connection error: ${err.message}`
          });
        });

        peer.on('close', () => {
          setConnectionState({
            status: 'disconnected',
            message: 'Stream ended'
          });
        });

      } catch (err) {
        const error = err as Error;
        console.error('WebRTC init error:', error);
        setConnectionState({
          status: 'error',
          message: `Initialization failed: ${error.message}`
        });
      }
    };

    initWebRTC();

    return () => {
      // Cleanup function
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="bg-primary/20 rounded-md p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className='text-sm'>Stream Status</p>
          <div className={`rounded-sm px-2 py-1 text-xs bg-white/20 ml-2 flex items-center gap-1`}>
            <div className={`h-[10px] w-[10px] rounded-full ${statusColors[connectionState.status]}`}></div>
            {connectionState.message}
          </div>
        </div>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-h-[70vh] bg-black/50 rounded-md mt-2 aspect-video"
      />

      {connectionState.status === 'error' && (
        <button 
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default FeedContainer;