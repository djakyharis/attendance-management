import { useEffect, useRef, useState } from 'react';

export default function CameraScanner() {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const isMounted = useRef(true);

  const streamRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (isMounted.current && videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setStreamActive(true);
      } else {
        // If unmounted before stream is assigned, stop it immediately
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access denied or unavailable.");
      setStreamActive(false);
    }
  };

  const stopCamera = (isManual = false) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    if (isManual) {
      setError("Camera turned off manually.");
    }
  };

  const toggleCamera = () => {
    if (streamActive) {
      stopCamera(true);
    } else {
      startCamera();
      setIsCheckedIn(false); // Reset check-in status when restarting
    }
  };

  const handleCheckIn = () => {
    if (!streamActive) return;
    setIsCheckedIn(true);
    // Automatically stop camera after successful check-in
    setTimeout(() => {
      stopCamera(true);
      setError(null); // Clear manual turn off message since this is a success state
    }, 1500);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera(false);
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

          {/* Video Stream or Success Overlay */}
          {isCheckedIn ? (
            <div className="text-center z-40 bg-surface-container-lowest w-full h-full flex flex-col justify-center items-center absolute inset-0">
              <span className="material-symbols-outlined text-[64px] text-tertiary mb-4 animate-pulse">check_circle</span>
              <h2 className="font-headline-md text-headline-md text-tertiary tracking-tight mb-2">IDENTITY VERIFIED</h2>
              <p className="font-code-inline text-sm text-on-surface-variant">Attendance logged successfully at {new Date().toLocaleTimeString()}</p>
            </div>
          ) : error ? (
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
        <button 
          onClick={toggleCamera}
          className="bg-transparent border border-secondary text-secondary font-label-md text-label-md py-3 px-6 rounded hover:bg-secondary/10 transition-colors uppercase tracking-wider cursor-pointer"
        >
          {streamActive || isCheckedIn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
        <button
          onClick={handleCheckIn}
          className={`font-label-md text-label-md py-3 px-8 rounded uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${streamActive && !error && !isCheckedIn ? 'bg-primary-container text-on-primary-container hover:bg-primary-container/80 shadow-[0_0_15px_rgba(203,166,247,0.3)]' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-50'}`}
          disabled={!streamActive || error || isCheckedIn}
        >
          <span className="material-symbols-outlined text-[18px]">fingerprint</span>
          {isCheckedIn ? 'Verified' : 'Check In Now'}
        </button>
      </div>
    </div>
  );
}
