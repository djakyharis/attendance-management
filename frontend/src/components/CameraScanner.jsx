import { useEffect, useRef, useState } from 'react';

export default function CameraScanner() {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let currentStream = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Jika komponen sudah tertutup saat user baru memberikan izin
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          currentStream = stream;
          setStreamActive(true);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error accessing camera:", err);
          setError("Camera access denied or unavailable.");
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      // Safety net:
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-gutter">
      {/* Camera Frame Panel */}
      <div className="bg-surface-container border border-outline-variant rounded p-1">
        <div className="border border-outline-variant border-dashed p-4 relative h-[400px] flex items-center justify-center bg-surface-container-lowest overflow-hidden group">
          
          {/* Scanner Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent w-full h-[15%] opacity-0 group-hover:opacity-100 group-hover:animate-scan pointer-events-none z-30"></div>
          
          {/* Cyberpunk corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary z-30"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary z-30"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary z-30"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary z-30"></div>
          
          {/* Video Stream */}
          {error ? (
             <div className="text-center z-20 text-error bg-surface-container-lowest w-full h-full flex flex-col justify-center items-center absolute inset-0">
                <span className="material-symbols-outlined text-[48px] mb-4">videocam_off</span>
                <p className="font-code-inline text-sm">{error}</p>
             </div>
          ) : (
            <>
              {!streamActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest z-20">
                  <div className="animate-pulse text-primary font-code-inline text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin">settings</span>
                    INITIALIZING CAMERA...
                  </div>
                </div>
              )}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            </>
          )}
        </div>
      </div>
      
      {/* Action Area */}
      <div className="flex justify-end gap-4">
        <button className="bg-transparent border border-secondary text-secondary font-label-md text-label-md py-3 px-6 rounded hover:bg-secondary/10 transition-colors uppercase tracking-wider cursor-pointer">
          Cancel
        </button>
        <button 
          className={`font-label-md text-label-md py-3 px-8 rounded uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${streamActive && !error ? 'bg-primary-container text-on-primary-container hover:bg-primary-container/80' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-50'}`} 
          disabled={!streamActive || error}
        >
          <span className="material-symbols-outlined text-[18px]">fingerprint</span>
          Check In Now
        </button>
      </div>
    </div>
  );
}
