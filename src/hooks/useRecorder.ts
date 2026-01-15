import { useState, useCallback, useRef } from 'react';

export function useRecorder(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  screenStream: MediaStream | null,
  cameraStream: MediaStream | null
) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(() => {
    if (!canvasRef.current) return;
    
    // Cleanup previous recording
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
    }
    chunksRef.current = [];

    // 1. Get Video Stream from Canvas
    const canvasStream = canvasRef.current.captureStream(30);
    if (!canvasStream) {
        console.error("Canvas stream is null");
        return;
    }
    
    // 2. Mix Audio
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const dest = audioContext.createMediaStreamDestination();
    
    // Add Screen Audio
    if (screenStream && screenStream.getAudioTracks().length > 0) {
        const source = audioContext.createMediaStreamSource(screenStream);
        // Gain node to control volume if needed, skipping for now
        source.connect(dest);
    }
    
    // Add Mic Audio
    if (cameraStream && cameraStream.getAudioTracks().length > 0) {
        const source = audioContext.createMediaStreamSource(cameraStream);
        source.connect(dest);
    }
    
    // Combine
    const mixedAudioTrack = dest.stream.getAudioTracks()[0];
    if (mixedAudioTrack) {
        canvasStream.addTrack(mixedAudioTrack);
    }
    
    // 3. Start Recorder
    try {
        const recorder = new MediaRecorder(canvasStream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setRecordedUrl(url);
            setIsRecording(false);
            
            // Cleanup AudioContext
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        };

        recorder.start(1000); // Collect chunks every second
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        
    } catch (e) {
        console.error("Failed to create MediaRecorder:", e);
    }

  }, [canvasRef, screenStream, cameraStream, recordedUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    isRecording,
    recordedUrl,
    startRecording,
    stopRecording
  };
}
