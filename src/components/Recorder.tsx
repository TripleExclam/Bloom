import { useRef, useEffect } from 'react';
import { useMediaStreams } from '../hooks/useMediaStreams';
import { useCanvasCompositor } from '../hooks/useCanvasCompositor';
import { useRecorder } from '../hooks/useRecorder';
import { Controls } from './Controls';

export function Recorder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const { 
    screenStream, 
    cameraStream, 
    startCamera, 
    startScreen, 
    stopAll,
    error 
  } = useMediaStreams();

  const { 
    isRecording, 
    recordedUrl, 
    startRecording, 
    stopRecording 
  } = useRecorder(canvasRef, screenStream, cameraStream);

  // Sync streams to video elements
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.onloadedmetadata = () => {
        screenVideoRef.current?.play().catch(e => console.error("Error playing screen video:", e));
      };
    }
  }, [screenStream]);

  useEffect(() => {
    if (cameraVideoRef.current && cameraStream) {
      cameraVideoRef.current.srcObject = cameraStream;
      cameraVideoRef.current.onloadedmetadata = () => {
        cameraVideoRef.current?.play().catch(e => console.error("Error playing camera video:", e));
      };
    }
  }, [cameraStream]);

  // Start compositor loop when we have screen share
  const isComposing = !!screenStream;
  useCanvasCompositor(canvasRef, screenVideoRef, cameraVideoRef, isComposing);

  const handleStop = () => {
    stopRecording();
    stopAll();
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      
      {/* Hidden Source Videos */}
      <video 
        ref={screenVideoRef} 
        muted 
        autoPlay 
        playsInline 
        className="hidden" 
      />
      <video 
        ref={cameraVideoRef} 
        muted 
        autoPlay 
        playsInline 
        className="hidden" 
      />

      {/* Main Preview */}
      <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
        {!screenStream && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <p>Start Camera and Screen Share to begin</p>
          </div>
        )}
        <canvas 
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-contain"
        />
        
        {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white rounded-full animate-pulse font-bold text-sm">
                <div className="w-2 h-2 bg-white rounded-full" />
                REC
            </div>
        )}
      </div>

      <Controls 
        isRecording={isRecording}
        hasCamera={!!cameraStream}
        hasScreen={!!screenStream}
        recordedUrl={recordedUrl}
        error={error}
        onStartCamera={startCamera}
        onStartScreen={startScreen}
        onStartRecording={startRecording}
        onStopRecording={handleStop}
      />
    </div>
  );
}
