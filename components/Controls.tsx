import React from 'react';

export type SpookyMode = 'pumpkin' | 'haunting' | 'costume';

interface ControlsProps {
  onModeSelect: (mode: SpookyMode) => void;
  isRunning: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onModeSelect, isRunning }) => {
  const modes: { id: SpookyMode; label: string; emoji: string }[] = [
    { id: 'pumpkin', label: 'PUMPKIN ME!', emoji: '🎃' },
    { id: 'haunting', label: 'Haunting', emoji: '👻' },
    { id: 'costume', label: 'Costume', emoji: '🧛' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 backdrop-blur-sm rounded-lg shadow-lg" style={{ backgroundColor: 'rgba(26, 26, 26, 0.7)', border: '1px solid #4a4a4a' }}>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeSelect(mode.id)}
            disabled={isRunning}
            style={{ fontFamily: "'Creepster', cursive", letterSpacing: '2px' }}
            className="text-xl sm:text-2xl px-6 py-3 font-bold text-white rounded-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-500 bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1"
            aria-label={`Activate ${mode.label} mode`}
          >
            <span className="mr-2">{mode.emoji}</span>
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Controls;
