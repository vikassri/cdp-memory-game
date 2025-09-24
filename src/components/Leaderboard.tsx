import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Clock, Target, User, Building, Download, Trash2, PhoneCallIcon } from 'lucide-react';
import { GameScore } from '../types/game';
import { getScoreRating, sortLeaderboard } from '../utils/scoring';
import { getCurrentSessionScores, getDailyScores, clearCurrentSession } from '../utils/database';
import { exportLeaderboardToCSV } from '../utils/csvExport';
import { WinnerPopup } from './WinnerPopup';

interface LeaderboardProps {
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  const handleRevealPhone = (id: string) => {
    setRevealedPhones(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const [sessionScores, setSessionScores] = useState<GameScore[]>([]);
  const [dailyScores, setDailyScores] = useState<GameScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'session' | 'daily'>('session');
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [winners, setWinners] = useState<GameScore[]>([]);

  useEffect(() => {

    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      setIsLoading(true);
      const [sessionGameScores, dailyGameScores] = await Promise.all([
        getCurrentSessionScores(),
        getDailyScores()
      ]);
      setSessionScores(sortLeaderboard(sessionGameScores));
      setDailyScores(sortLeaderboard(dailyGameScores));
    } catch (err) {
      console.error('Error fetching scores:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSession = () => {
    if (sessionScores.length === 0) return;
    
    // Show top 3 winners before clearing
    const top3 = sessionScores.slice(0, 3);
    setWinners(top3);
    setShowWinnerPopup(true);
  };

  const handleWinnerPopupClose = () => {
    setShowWinnerPopup(false);
    // Clear the session after showing winners
    clearCurrentSession();
    setSessionScores([]);
    // Refresh scores to start fresh
    fetchScores();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={20} />;
      case 2: return <Medal className="text-gray-400" size={20} />;
      case 3: return <Award className="text-amber-600" size={20} />;
      default: return <span className="text-slate-500 font-bold text-sm">#{rank}</span>;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExportCSV = () => {
    const scoresToExport = activeTab === 'session' ? sessionScores : dailyScores;
    exportLeaderboardToCSV(scoresToExport);
  };

  const currentScores = activeTab === 'session' ? sessionScores : dailyScores;
  const top3Session = sessionScores.slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={28} />
              <div>
                <h2 className="text-2xl font-bold">
                  Leaderboard
                </h2>
                <p className="text-blue-100 text-sm">
                  {activeTab === 'session' 
                    ? 'Current session leaderboard'
                    : 'Today\'s complete leaderboard'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'session' && sessionScores.length > 0 && (
                <button
                  onClick={handleClearSession}
                  className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Clear Session
                </button>
              )}
              {currentScores.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              )}
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Tab Navigation */}
          <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('session')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'session'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Current Session
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'daily'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Daily Leaderboard
            </button>
          </div>

          {/* Session Top 3 Highlight */}
          {activeTab === 'session' && top3Session.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Current Session Champions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3Session.map((score, index) => {
                  const rank = index + 1;
                  const rating = getScoreRating(score.score);
                  
                  return (
                    <div
                      key={score.id}
                      className={`
                        p-4 rounded-xl border-2 text-center
                        ${rank === 1 ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100' : 
                          rank === 2 ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100' :
                          'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100'}
                      `}
                    >
                      <div className="flex justify-center mb-2">
                        {getRankIcon(rank)}
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">{score.player.name}</h4>
                      <p className="text-sm text-slate-600 mb-2">{score.player.company}</p>
                      <div className="text-2xl font-bold text-slate-800 mb-1">{score.score}</div>
                      <div className={`text-xs font-medium ${rating.color}`}>{rating.rating}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Trophy className="text-red-300 mx-auto mb-4" size={48} />
              <p className="text-red-500 text-lg">Error loading leaderboard</p>
              <p className="text-gray-400">{error}</p>
            </div>
          ) : currentScores.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-500 text-lg">
                {activeTab === 'session' 
                  ? 'No scores in current session!'
                  : 'No scores today!'
                }
              </p>
              <p className="text-gray-400">
                {activeTab === 'session'
                  ? 'Be the first to play in this session.'
                  : 'Be the first to play today.'
                }
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {activeTab === 'session' 
                  ? 'All Session Scores'
                  : 'Complete Daily Rankings'
                }
              </h3>
              <div className="space-y-4">
              {currentScores.map((score, index) => {
                const rank = index + 1;
                const rating = getScoreRating(score.score);
                
                return (
                  <div
                    key={score.id}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md
                      ${activeTab === 'session' && rank <= 3 ? 
                        rank === 1 ? 'border-yellow-200 bg-yellow-50' : 
                        rank === 2 ? 'border-gray-200 bg-gray-50' :
                        'border-amber-200 bg-amber-50' :
                        'border-slate-200 bg-white'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10">
                          {getRankIcon(rank)}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User size={16} className="text-slate-500" />
                            <span className="font-semibold text-slate-800">{score.player.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Building size={14} />
                            <span>{score.player.company}</span>
                            <PhoneCallIcon size={14} />
                            <span>
                              {revealedPhones[score.id]
                                ? score.player.phone
                                : '••••••••••'}
                            </span>
                            <button
                              type="button"
                              className="ml-2 text-slate-400 hover:text-slate-700 focus:outline-none"
                              onClick={() => handleRevealPhone(score.id)}
                              aria-label={revealedPhones[score.id] ? 'Hide phone number' : 'Show phone number'}
                            >
                              {revealedPhones[score.id]
                                ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.175-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.125-2.175A9.96 9.96 0 0122 9c0 5.523-4.477 10-10 10a10.05 10.05 0 01-1.825-.125M4.22 4.22l15.56 15.56" />
                                    </svg>
                                  )
                                : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.25 2.25A9.96 9.96 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 2.21.72 4.25 1.95 5.95M4.22 4.22l15.56 15.56" />
                                    </svg>
                                  )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800 mb-1">
                          {score.score}
                        </div>
                        <div className={`text-sm font-medium ${rating.color}`}>
                          {rating.rating}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="text-green-600" size={16} />
                        <span className="text-slate-600">
                          {score.matchedPairs}/8 matches
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="text-blue-600" size={16} />
                        <span className="text-slate-600">
                          {formatTime(score.timeRemaining)} left
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-slate-600">
                          {score.tilesRevealed} tiles
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${score.completedGame ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <span className="text-slate-600">
                          {score.completedGame ? 'Completed' : 'Incomplete'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-400">
                      Played on {new Date(score.gameDate).toLocaleDateString()} at {new Date(score.gameDate).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>

        {/* Winner Popup */}
        {showWinnerPopup && (
          <WinnerPopup
            winners={winners}
            onClose={handleWinnerPopupClose}
          />
        )}
      </div>
    </div>
  );
};