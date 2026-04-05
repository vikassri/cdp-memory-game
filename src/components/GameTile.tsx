import React from 'react';
import { ClouderaService } from '../data/clouderaServices';

interface GameTileProps {
  service: ClouderaService;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  type: 'name' | 'description';
  disabled: boolean;
}

export const GameTile: React.FC<GameTileProps> = ({
  service,
  isFlipped,
  isMatched,
  onClick,
  type,
  disabled
}) => {
  const getRandomColor = () => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-orange-600 to-purple-900',
    ];
    return colors[1];
  };

  const getClouderaColor = () => {
    return 'from-orange-500 to-red-500';
  };

  return (
    <div
      className={`
        relative w-full h-32 cursor-pointer
        
        ${isMatched ? '' : ''}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      <div
        className={`
          absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
      >
        {/* Front face (hidden) */}
        <div
          className={`
            absolute inset-0 w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 
            rounded-lg shadow-md border-2 border-slate-300 backface-hidden
            flex items-center justify-center
          `}
        >
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm font-medium text-slate-600">Click to reveal</p>
          </div>
        </div>

        {/* Back face (content) */}
        <div
          className={`
            absolute inset-0 w-full h-full bg-gradient-to-br ${isMatched ? getClouderaColor() : getRandomColor()}
            rounded-lg shadow-lg border-2 border-white/20 backface-hidden rotate-y-180
            flex flex-col items-center justify-center p-4 text-white
            ${isMatched ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
          `}
        >
          <div className="text-center">
            <div className="text-lg font-semibold mb-1 opacity-80 tracking-wide">
              {service.category}
            </div>
            {type === 'name' ? (
              <h3 className="text-sm font-bold leading-tight">{service.name}</h3>
            ) : (
              <p className="text-sm font-bold leading-tight">{service.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};