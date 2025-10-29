import React, { useRef } from 'react';
import { PlayIcon, StopIcon, UploadIcon } from './icons';

type Mode = 'prompt' | 'director' | 'background';

interface BackgroundImage {
  data: string;
  mimeType: string;
  name: string;
}
interface ControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isRunning: boolean;
  handleStartStop: () => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  backgroundImage: BackgroundImage | null;
  handleBackgroundImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ModeButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ label, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      backgroundColor: isActive ? '#319899' : '#4A5D62', // Teal for active, Stormy Gray for inactive
    }}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors text-white ${
      isActive ? 'shadow-md' : 'hover:bg-opacity-80'
    } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#35D3CB]`} // Turquoise focus ring
  >
    {label}
  </button>
);

const Controls: React.FC<ControlsProps> = ({ 
  prompt, 
  setPrompt, 
  isRunning, 
  handleStartStop, 
  mode, 
  setMode,
  backgroundImage,
  handleBackgroundImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 backdrop-blur-sm rounded-lg shadow-lg space-y-4" style={{ backgroundColor: 'rgba(74, 93, 98, 0.5)', border: '1px solid #727272' }}>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <ModeButton label="Manual Prompt" isActive={mode === 'prompt'} onClick={() => setMode('prompt')} disabled={isRunning} />
        <ModeButton label="One Frame Story" isActive={mode === 'director'} onClick={() => setMode('director')} disabled={isRunning} />
        <ModeButton label="Background Swap" isActive={mode === 'background'} onClick={() => setMode('background')} disabled={isRunning} />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-grow w-full">
            {mode === 'background' ? (
                <div className="flex items-center gap-4 p-2 rounded-md" style={{ backgroundColor: '#4A5D62' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageUpload}
                        ref={fileInputRef}
                        className="hidden"
                        aria-hidden="true"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isRunning}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors text-white bg-[#319899] hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-[#35D3CB]"
                    >
                        <UploadIcon className="w-5 h-5" />
                        Upload Background
                    </button>
                    {backgroundImage && (
                        <div className="flex items-center gap-2 min-w-0">
                           <img src={`data:${backgroundImage.mimeType};base64,${backgroundImage.data}`} alt="Background preview" className="w-10 h-10 object-cover rounded" />
                           <p className="text-xs text-gray-300 truncate" title={backgroundImage.name}>{backgroundImage.name}</p>
                        </div>
                    )}
                </div>
            ) : (
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                        mode === 'prompt' 
                        ? "e.g., make it a vibrant cartoon" 
                        : "Enter a theme, e.g., 'a forgotten memory'"
                    }
                    style={{
                        backgroundColor: '#4A5D62', // Stormy Gray
                        borderColor: '#727272' // Slate
                    }}
                    className="w-full px-4 py-3 text-white rounded-md border transition-shadow duration-200 focus:ring-2 focus:ring-[#35D3CB] focus:border-[#35D3CB]" // Turquoise focus
                    disabled={isRunning}
                    aria-label="AI transformation prompt"
                />
            )}
        </div>

        <button
          onClick={handleStartStop}
          disabled={isRunning || (mode === 'background' ? !backgroundImage : !prompt.trim())}
          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 font-semibold text-white rounded-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#ED9C2C]"
          style={{ 
            background: isRunning 
              ? 'linear-gradient(to right, #EF454C, #D93D43)' // Persimmon gradient
              : 'linear-gradient(to right, #ED9C2C, #D9822B)', // Marigold gradient
            boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)'
          }}
          aria-live="polite"
        >
          {isRunning ? (
            <>
              <StopIcon className="w-6 h-6 mr-2 transition-transform group-hover:scale-110" />
              Stop
            </>
          ) : (
            <>
              <PlayIcon className="w-6 h-6 mr-2 transition-transform group-hover:scale-110" />
              Start
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;
