export interface Player {
  id: string;
  name: string;
  company: string;
  phone: string;
  timestamp: number;
}

export interface GameScore {
  id: string;
  player: Player;
  score: number;
  tilesRevealed: number;
  matchedPairs: number;
  timeRemaining: number;
  completedGame: boolean;
  gameDate: string;
}

export interface ClouderaService {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface GameCard {
  id: string;
  service: ClouderaService;
  type: 'name' | 'description';
  isFlipped: boolean;
  isMatched: false;
}

export interface AppSettings {
  enableNotifications: boolean;
  showAnalytics: boolean;
}

export interface AnalyticsData {
  totalPlayers: number;
  totalGames: number;
  averageScore: number;
  completionRate: number;
  dailyStats: DailyStats[];
  categoryPerformance: CategoryStats[];
  playerActivity: PlayerActivityStats[];
  companyStats: CompanyStats[];
  topPerformers: TopPerformerStats[];
  gameMetrics: GameMetrics;
}

export interface CompanyStats {
  company: string;
  playerCount: number;
  totalGames: number;
  averageScore: number;
  completionRate: number;
  bestScore: number;
  bestPlayer: string;
}

export interface TopPerformerStats {
  name: string;
  company: string;
  bestScore: number;
  totalGames: number;
  averageScore: number;
  completionRate: number;
}

export interface GameMetrics {
  averageGameDuration: number;
  averageTilesRevealed: number;
  mostDifficultCategory: string;
  easiestCategory: string;
  peakPlayTime: string;
  totalPlayTime: number;
}

export interface DailyStats {
  date: string;
  newPlayers: number;
  gamesPlayed: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface CategoryStats {
  category: string;
  correctMatches: number;
  totalAttempts: number;
  accuracy: number;
}

export interface PlayerActivityStats {
  hour: number;
  playerCount: number;
  averageScore: number;
}