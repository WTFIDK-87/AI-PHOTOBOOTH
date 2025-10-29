
import React from 'react';
import { CameraIcon, DownloadIcon } from './icons';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  aiImage: string | null;
  isRunning: boolean;
  error: string | null;
  narrative: string | null;
  countdown: number | null;
  onDownload: () => void;
  flash: boolean;
}

const ViewPanel: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`rounded-lg overflow-hidden shadow-xl flex flex-col h-full ${className}`} style={{ backgroundColor: '#4A5D62', border: '1px solid #727272' }}>
        <h2 className="text-center text-lg font-semibold py-2 border-b" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: '#727272' }}>{title}</h2>
        <div className="flex-grow flex items-center justify-center relative w-full h-full min-h-[200px] aspect-video">
            {children}
        </div>
    </div>
);

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; ariaLabel: string }> = ({ onClick, children, ariaLabel }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#35D3CB] transition-all"
    >
      {children}
    </button>
);


const CameraView: React.FC<CameraViewProps> = ({ videoRef, aiImage, isRunning, error, narrative, countdown, onDownload, flash }) => {
    const showCountdown = countdown !== null && countdown > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mx-auto p-4">
            <ViewPanel title="Live Feed">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" aria-label="Live camera feed" />
                {flash && <div className="absolute inset-0 bg-white animate-flash" />}
                {!isRunning && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-gray-400">
                        <CameraIcon className="w-16 h-16 mb-4"/>
                        <p>Camera is off</p>
                    </div>
                )}
                {showCountdown && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                        <p className="text-9xl font-bold text-white animate-pop-in">{countdown}</p>
                    </div>
                )}
            </ViewPanel>

            <ViewPanel title="AI Transformed" className="relative">
                 {error && (
                    <div className="absolute inset-0 flex items-center justify-center p-4 text-center" style={{backgroundColor: 'rgba(239, 69, 76, 0.5)'}}>
                        <p className="font-semibold text-white">{error}</p>
                    </div>
                 )}
                
                {aiImage && !error && (
                    <>
                        <img src={aiImage} alt="AI Transformed View" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 flex gap-2">
                           <ActionButton onClick={onDownload} ariaLabel="Download Image">
                                <DownloadIcon className="w-5 h-5" />
                           </ActionButton>
                        </div>
                    </>
                )}

                {!aiImage && !error && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-gray-400">
                        <CameraIcon className="w-16 h-16 mb-4 opacity-50"/>
                        <p>AI view will appear here</p>
                    </div>
                )}

                {narrative && !error && (
                    <div 
                        key={narrative}
                        className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-center backdrop-blur-sm border-t border-gray-700/50 animate-fade-in"
                    >
                        <p className="text-sm italic text-white font-serif">"{narrative}"</p>
                    </div>
                )}
            </ViewPanel>
        </div>
    );
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  @keyframes popIn {
    0% { transform: scale(0.5); opacity: 0; }
    80% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-pop-in {
      animation: popIn 0.5s ease-out forwards;
  }
  @keyframes flash {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
  .animate-flash {
      animation: flash 0.3s ease-out forwards;
      pointer-events: none;
  }
`;
document.head.appendChild(style);


export default CameraView;