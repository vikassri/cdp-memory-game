import React from 'react';
import { Trophy, Medal, Award, X } from 'lucide-react';
import { GameScore } from '../types/game';
import { getScoreRating } from '../utils/scoring';

interface WinnerPopupProps {
  winners: GameScore[];
  onClose: () => void;
}

export const WinnerPopup: React.FC<WinnerPopupProps> = ({ winners, onClose }) => {
  // Phone number reveal logic for each winner
  const [revealPhones, setRevealPhones] = React.useState<{[id: string]: boolean}>({});

  function getPhoneDisplay(id: string, phone: string) {
    return (
      <span className="inline-flex items-center gap-1">
        {revealPhones[id] ? phone : '••••••••••'}
        <button
          type="button"
          className="ml-1 text-slate-400 hover:text-slate-700 focus:outline-none"
          onClick={() => setRevealPhones(prev => ({ ...prev, [id]: !prev[id] }))}
          aria-label={revealPhones[id] ? 'Hide phone number' : 'Show phone number'}
        >
          {revealPhones[id]
            ? (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.175-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.125-2.175A9.96 9.96 0 0122 9c0 5.523-4.477 10-10 10a10.05 10.05 0 01-1.825-.125M4.22 4.22l15.56 15.56" /></svg>)
            : (<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.25 2.25A9.96 9.96 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 2.21.72 4.25 1.95 5.95M4.22 4.22l15.56 15.56" /></svg>)}
        </button>
      </span>
    );
  }
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={32} />;
      case 2: return <Medal className="text-gray-400" size={32} />;
      case 3: return <Award className="text-amber-600" size={32} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={32} />
              <div>
                <h2 className="text-2xl font-bold">🎉 Session Winners!</h2>
                <p className="text-yellow-100 text-sm">Congratulations to our session champions!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-yellow-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {winners.slice(0, 3).map((winner, index) => {
              const rank = index + 1;
              const rating = getScoreRating(winner.score);
              
              return (
                <div
                  key={winner.id}
                  className={`
                    p-6 rounded-xl border-2 text-center transform transition-all duration-300 hover:scale-105
                    ${rank === 1 ? 'border-orange-300 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg' : 
                      rank === 2 ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-400' :
                      'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-200'}
                  `}
                >
                  <div className="flex justify-center mb-3">
                    {getRankIcon(rank)}
                  </div>
                  
                  <div className={`text-lg font-bold mb-1 ${
                    rank === 1 ? 'text-black-700' :
                    rank === 2 ? 'text-gray-700' :
                    'text-gray-700'
                  }`}>
                    {rank === 1 ? '🥇 Champion' : rank === 2 ? '🥈 Runner-up' : '🥉 Third Place'}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{winner.player.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{winner.player.company}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {getPhoneDisplay(winner.id, winner.player.phone)}
                  </div>
                  
                  <div className="text-3xl font-bold text-slate-800 mb-2">{winner.score}</div>
                  <div className={`text-sm font-medium ${rating.color} mb-3`}>{rating.rating}</div>
                  
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>✅ {winner.matchedPairs}/8 matches</div>
                    <div>🎯 {winner.tilesRevealed} tiles revealed</div>
                    <div>{winner.completedGame ? '🏆 Completed' : '⏱️ Incomplete'}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-600 mb-4">
              These champions dominated the session with their exceptional memory skills!
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Awesome! 👏
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};