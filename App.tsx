
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Controls from './components/Controls';
import CameraView from './components/CameraView';
import { transformImage, replaceBackground } from './services/geminiService';

type Mode = 'prompt' | 'director' | 'background';

interface BackgroundImage {
  data: string;
  mimeType: string;
  name: string;
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [mode, setMode] = useState<Mode>('prompt');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [narrative, setNarrative] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<BackgroundImage | null>(null);


  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownIntervalId = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (countdownIntervalId.current) {
      clearInterval(countdownIntervalId.current);
      countdownIntervalId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
    setIsRunning(false);
    setIsLoading(false);
    setCountdown(null);
  }, []);


  const processFrame = useCallback(async () => {
    const isReadyForProcessing = mode === 'background' ? backgroundImage : prompt.trim();
    if (!videoRef.current || !canvasRef.current || !isReadyForProcessing) {
      stopCamera();
      return;
    }

    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        stopCamera();
        return;
    }
    
    setIsLoading(true);
    setCountdown(0); 
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const mimeType = 'image/jpeg';
      const imageDataUrl = canvas.toDataURL(mimeType);
      const base64Data = imageDataUrl.split(',')[1];
      
      try {
        let result;
        if (mode === 'background' && backgroundImage) {
            result = await replaceBackground(base64Data, mimeType, backgroundImage.data, backgroundImage.mimeType);
            setNarrative(null); // No narrative for this mode
        } else {
            let apiPrompt = prompt;
            if (mode === 'director') {
                apiPrompt = `Theme: "${prompt}". Task 1: Transform the image to match this theme. Task 2: Write a short, funny, 1-2 sentence story for the transformed image.`;
            }
            result = await transformImage(base64Data, mimeType, apiPrompt);

            if (mode === 'director' && result.narrative) {
              setNarrative(result.narrative);
            } else {
              setNarrative(null);
            }
        }

        if (result.imageUrl) {
          setAiImage(result.imageUrl);
          setError(null);
        } else {
            setError("try it again!");
        }

      } catch (e: any) {
        setError(e.message || 'Failed to process frame. Please try again.');
        setNarrative(null);
        console.error(e);
      }
    }
    
    stopCamera();

  }, [prompt, mode, stopCamera, backgroundImage]);

  const startCaptureSequence = async () => {
    try {
      setError(null);
      setAiImage(null);
      setNarrative(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsRunning(true);

        setCountdown(3);
        countdownIntervalId.current = window.setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    if(countdownIntervalId.current) clearInterval(countdownIntervalId.current);
                    processFrame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };


  const handleStartStop = () => {
    if (isRunning) {
      stopCamera();
    } else {
      if (mode === 'background' && !backgroundImage) {
        setError("Please upload a background image first.");
        return;
      }
      if (mode !== 'background' && !prompt.trim()){
        setError("Please enter a prompt first.");
        return;
      }
      startCaptureSequence();
    }
  };

  const handleDownload = () => {
    if (!aiImage) return;
    const link = document.createElement('a');
    link.href = aiImage;
    link.download = `ai-transformed-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit
          setError("Background image size should be less than 4MB.");
          return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        const base64Data = result.split(',')[1];
        setBackgroundImage({
          data: base64Data,
          mimeType: file.type,
          name: file.name,
        });
      };
      reader.onerror = () => {
        setError("Failed to read the background image file.");
      }
      reader.readAsDataURL(file);
    }
  };
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
        stopCamera();
    }
  }, [stopCamera]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6">
            <header className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#35D3CB] to-[#319899]">
                    Real-Time SG Camera
                </h1>
                <p className="mt-2 text-lg" style={{ color: '#727272' }}>Transform your reality</p>
            </header>
            
            <CameraView
                videoRef={videoRef}
                aiImage={aiImage}
                isRunning={isRunning}
                error={error}
                narrative={narrative}
                countdown={countdown}
                onDownload={handleDownload}
                flash={flash}
            />

            <div className="w-full max-w-4xl mx-auto mt-4 flex flex-col items-center gap-4">
              <Controls 
                  prompt={prompt}
                  setPrompt={setPrompt}
                  isRunning={isRunning}
                  handleStartStop={handleStartStop}
                  mode={mode}
                  setMode={setMode}
                  backgroundImage={backgroundImage}
                  handleBackgroundImageUpload={handleBackgroundImageUpload}
              />
              {isLoading && (
                <div className="flex items-center gap-3 animate-pulse" style={{ color: '#35D3CB' }}>
                    <div className="w-5 h-5 border-2 border-t-[#35D3CB] border-gray-600 rounded-full animate-spin"></div>
                    <span>{mode === 'background' ? 'AI is replacing the background...' : 'AI is transforming your photo...'}</span>
                </div>
              )}
            </div>

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    </div>
  );
};

export default App;
