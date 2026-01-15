import { 
  Camera, 
  Monitor, 
  CircleDot, 
  Square, 
  Download, 
  AlertCircle 
} from 'lucide-react';

interface ControlsProps {
  isRecording: boolean;
  hasCamera: boolean;
  hasScreen: boolean;
  recordedUrl: string | null;
  error: string | null;
  onStartCamera: () => void;
  onStartScreen: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function Controls({
  isRecording,
  hasCamera,
  hasScreen,
  recordedUrl,
  error,
  onStartCamera,
  onStartScreen,
  onStartRecording,
  onStopRecording,
}: ControlsProps) {
  
  const canRecord = hasCamera && hasScreen && !isRecording;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gray-900/90 text-white flex flex-col items-center gap-4 backdrop-blur-sm z-50">
      
      {error && (
        <div className="bg-red-500/20 text-red-200 px-4 py-2 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Setup Buttons */}
        {!isRecording && (
            <>
                <button
                onClick={onStartCamera}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hasCamera ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                >
                <Camera size={20} />
                {hasCamera ? 'Camera Ready' : 'Enable Camera'}
                </button>

                <button
                onClick={onStartScreen}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hasScreen ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                >
                <Monitor size={20} />
                {hasScreen ? 'Screen Ready' : 'Share Screen'}
                </button>
            </>
        )}

        {/* Recording Controls */}
        {canRecord && (
          <button
            onClick={onStartRecording}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-bold animate-pulse"
          >
            <CircleDot size={20} />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={onStopRecording}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 font-bold border-2 border-red-500"
          >
            <Square size={20} fill="currentColor" />
            Stop Recording
          </button>
        )}
      </div>
        
      {/* Post-Recording */}
      {recordedUrl && !isRecording && (
        <a
          href={recordedUrl}
          download="recording.webm"
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold mt-2"
        >
          <Download size={20} />
          Download Recording
        </a>
      )}
    </div>
  );
}
