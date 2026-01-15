import { useEffect, useRef } from 'react';

export function useCanvasCompositor(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  screenVideoRef: React.RefObject<HTMLVideoElement | null>,
  cameraVideoRef: React.RefObject<HTMLVideoElement | null>,
  isActive: boolean
) {
  const requestRef = useRef<number>(0);
  
  const draw = () => {
    const canvas = canvasRef.current;
    const screenVideo = screenVideoRef.current;
    const cameraVideo = cameraVideoRef.current;

    if (!canvas || !screenVideo) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw Screen (Background)
    if (screenVideo.readyState >= 2) {
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
    } else {
        // Placeholder if screen not ready
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Waiting for screen share...', canvas.width / 2, canvas.height / 2);
    }

    // 2. Draw Camera Bubble (Overlay)
    if (cameraVideo && cameraVideo.readyState >= 2) {
        const bubbleSize = 300; // Diameter
        const padding = 50;
        const x = canvas.width - bubbleSize - padding; // Bottom Right
        const y = canvas.height - bubbleSize - padding;
        const radius = bubbleSize / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw video centered in the circle
        // We might need to crop the camera video to be square first to avoid squashing
        // Simple approach: drawImage with cover-like aspect ratio logic is complex in canvas.
        // Easiest: just draw the video centered and scaled to cover the circle.
        
        const vidW = cameraVideo.videoWidth;
        const vidH = cameraVideo.videoHeight;
        const aspect = vidW / vidH;
        
        let drawW = bubbleSize;
        let drawH = bubbleSize;
        let offX = 0;
        let offY = 0;

        if (aspect > 1) {
            // Landscape source
            drawH = bubbleSize;
            drawW = bubbleSize * aspect;
            offX = -(drawW - bubbleSize) / 2;
        } else {
            // Portrait source
            drawW = bubbleSize;
            drawH = bubbleSize / aspect;
            offY = -(drawH - bubbleSize) / 2;
        }

        ctx.drawImage(cameraVideo, x + offX, y + offY, drawW, drawH);
        
        // Add a border
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';
        ctx.stroke();

        ctx.restore();
    }

    requestRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(draw);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive]);
}
