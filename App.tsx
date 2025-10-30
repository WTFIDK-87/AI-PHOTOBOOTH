import React, { useState, useRef, useCallback, useEffect } from 'react';
import Controls, { SpookyMode } from './components/Controls';
import CameraView from './components/CameraView';
import ImageModal from './components/ImageModal';
import { transformImage } from './services/geminiService';
import { playCountdownTick, playBooSound } from './services/audioService';

const App: React.FC = () => {
  const [mode, setMode] = useState<SpookyMode | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState<boolean>(false);
  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


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
    setMode(null);
  }, []);

  const processFrame = useCallback(async (currentMode: SpookyMode) => {
    if (!videoRef.current || !canvasRef.current || !currentMode) {
      stopCamera();
      return;
    }

    playBooSound();
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn("Video not ready, stopping camera.");
        stopCamera();
        return;
    }
    
    setIsLoading(true);
    setCountdown(null); 
    
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
        let prompt = '';
        switch(currentMode) {
            case 'pumpkin':
                prompt = 'Turn every human in the photo into a pumpkin-headed person. The background should remain realistic.';
                break;
            case 'haunting':
                prompt = 'Place the humans in the photo into a spooky, haunted graveyard scene at night, with bats and mist.';
                break;
            case 'costume':
                prompt = 'Give each human in the photo a classic Halloween costume, like a vampire, mummy, or Frankenstein\'s monster. Make it look realistic.';
                break;
        }

        const result = await transformImage(base64Data, mimeType, prompt);

        if (result.imageUrl) {
          setAiImage(result.imageUrl);
          setGallery(prev => [result.imageUrl, ...prev]);
          setError(null);
        } else {
            setError("The spirits failed to create an image. Please try again.");
        }

      } catch (e: any) {
        setError(e.message || 'Failed to process frame. Please try again.');
        console.error(e);
      }
    }
    
    stopCamera();

  }, [stopCamera]);

  const startCaptureSequence = async (selectedMode: SpookyMode) => {
    try {
      setError(null);
      setAiImage(null);
      setMode(selectedMode);

      const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsRunning(true);

        let count = 3;
        setCountdown(count);
        playCountdownTick();

        countdownIntervalId.current = window.setInterval(() => {
          count--;
          if (count > 0) {
            setCountdown(count);
            playCountdownTick();
          } else {
            if (countdownIntervalId.current) {
              clearInterval(countdownIntervalId.current);
              countdownIntervalId.current = null;
            }
            processFrame(selectedMode);
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to get media stream:", err);
      setError("Could not access camera. Please check permissions and try again.");
      stopCamera();
    }
  };

  useEffect(() => {
    // Cleanup camera stream on component unmount
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('/haunted-house.webp')", opacity: 0.3, filter: 'blur(3px)'}}></div>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        <header className="w-full text-center p-4 z-10">
            <h1 className="text-6xl md:text-8xl font-bold" style={{fontFamily: "'Creepster', cursive", color: '#e53e3e', textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>
              <span style={{color: '#7CFC00'}}>S</span>omething <span style={{color: '#7CFC00'}}>G</span>houlish
            </h1>
            <p className="text-lg md:text-2xl text-orange-400 mt-2" style={{fontFamily: "'Creepster', cursive", letterSpacing: '2px'}}>Transform yourself into a Halloween nightmare!</p>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center w-full z-10">
            <CameraView 
                videoRef={videoRef}
                aiImage={aiImage}
                isRunning={isRunning}
                error={error}
                countdown={countdown}
                onDownload={() => {
                    if (aiImage) {
                        const link = document.createElement('a');
                        link.href = aiImage;
                        link.download = 'something-ghoulish.jpeg';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }}
                flash={flash}
            />
            
            {gallery.length > 0 && (
                <section className="w-full max-w-6xl mx-auto p-4 mt-6">
                    <h2 className="text-4xl text-center mb-4 text-orange-400" style={{fontFamily: "'Creepster', cursive", letterSpacing: '2px'}}>
                        Ghoulish Gallery
                    </h2>
                    <div 
                        className="flex gap-4 overflow-x-auto pb-4" 
                        style={{ 
                            scrollbarWidth: 'thin', 
                            scrollbarColor: '#4a4a4a #1a1a1a'
                        }}
                    >
                        {gallery.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(img)}
                                className="flex-shrink-0 w-32 h-32 rounded-md overflow-hidden border-2 border-gray-700 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 transition-all duration-200 transform hover:scale-105"
                                aria-label={`View image ${index + 1}`}
                            >
                                <img src={img} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </main>

        <footer className="w-full z-10 p-4">
            <Controls onModeSelect={startCaptureSequence} isRunning={isRunning || isLoading} />
        </footer>
        
        {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default App;