import { useState, useCallback } from 'react';

export interface MediaStreams {
  cameraStream: MediaStream | null;
  screenStream: MediaStream | null;
}

export function useMediaStreams() {
  const [streams, setStreams] = useState<MediaStreams>({
    cameraStream: null,
    screenStream: null,
  });
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true, // We need mic audio
      });
      setStreams((prev) => ({ ...prev, cameraStream: stream }));
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera/microphone. Please check permissions.');
    }
  }, []);

  const startScreen = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor', // Prefer monitor sharing
        },
        audio: true, // Attempt to capture system audio
      });
      setStreams((prev) => ({ ...prev, screenStream: stream }));
      
      // If user stops screen share from browser UI, we should know
      stream.getVideoTracks()[0].onended = () => {
         setStreams(prev => ({ ...prev, screenStream: null }));
      };

    } catch (err) {
      console.error('Error accessing screen:', err);
      // Don't set global error if user cancelled selection
      if (err instanceof DOMException && err.name !== 'NotAllowedError') {
         setError('Failed to share screen.');
      }
    }
  }, []);

  const stopAll = useCallback(() => {
    streams.cameraStream?.getTracks().forEach((track) => track.stop());
    streams.screenStream?.getTracks().forEach((track) => track.stop());
    setStreams({ cameraStream: null, screenStream: null });
  }, [streams]);

  return {
    ...streams,
    startCamera,
    startScreen,
    stopAll,
    error,
  };
}
