import { GameScore } from '../types/game';
import { getCurrentWindowScores } from './database';
import { getSettings } from './settings';
import { format, subHours } from 'date-fns';
import { supabase } from '../lib/supabase';

export class WinnerAnnouncementService {
  private intervalId: NodeJS.Timeout | null = null;
  private lastAnnouncementTime: Date | null = null;
  private onWinnerAnnouncement?: (winners: GameScore[]) => void;

  start() {
    this.stop(); // Clear any existing interval
    
    const settings = getSettings();
    if (settings.winnerAnnouncementInterval === 'disabled' || !settings.enableNotifications) {
      return;
    }

    const intervalMs = this.getIntervalMs(settings.winnerAnnouncementInterval);
    
    // Check immediately on start
    this.checkAndAnnounceWinner();
    
    // Set up recurring checks
    this.intervalId = setInterval(() => {
      this.checkAndAnnounceWinner();
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setWinnerCallback(callback: (winners: GameScore[]) => void) {
    this.onWinnerAnnouncement = callback;
  }
  private getIntervalMs(interval: 'hourly' | 'every2hours'): number {
    switch (interval) {
      case 'hourly': return 60 * 60 * 1000; // 1 hour
      case 'every2hours': return 2 * 60 * 60 * 1000; // 2 hours
      default: return 60 * 60 * 1000;
    }
  }

  private async checkAndAnnounceWinner() {
    try {
      const settings = getSettings();
      const now = new Date();
      
      // Determine the time window based on settings
      const hoursBack = settings.winnerAnnouncementInterval === 'hourly' ? 1 : 2;
      
      // Skip if we've already announced for this window
      const currentHour = now.getHours();
      const lastHour = this.lastAnnouncementTime ? this.lastAnnouncementTime.getHours() : -1;
      
      if (hoursBack === 1 && currentHour === lastHour) {
        return;
      }
      
      if (hoursBack === 2 && this.lastAnnouncementTime) {
        const hoursSinceLastAnnouncement = (now.getTime() - this.lastAnnouncementTime.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastAnnouncement < 2) {
          return;
        }
      }

      // Get scores from the previous time window (not current)
      const previousWindowStart = subHours(now, hoursBack * 2);
      const previousWindowEnd = subHours(now, hoursBack);
      
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .gte('created_at', previousWindowStart.toISOString())
        .lt('created_at', previousWindowEnd.toISOString())
        .order('score', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const recentScores = data.map(score => ({
        id: score.id,
        player: {
          id: score.player_id,
          name: score.player_name,
          company: score.player_company,
          timestamp: 0
        },
        score: score.score,
        tilesRevealed: score.tiles_revealed,
        matchedPairs: score.matched_pairs,
        timeRemaining: score.time_remaining,
        completedGame: score.completed_game,
        gameDate: score.created_at
      }));

      if (recentScores.length === 0) {
        return;
      }

      // Get top 3 winners
      const top3Winners = recentScores.slice(0, 3);

      this.announceWinners(top3Winners, hoursBack);
      this.lastAnnouncementTime = now;
      
    } catch (error) {
      console.error('Error checking for winner:', error);
    }
  }

  private announceWinners(winners: GameScore[], hoursBack: number) {
    const timeWindow = hoursBack === 1 ? 'past hour' : 'past 2 hours';
    
    if (winners.length === 0) return;
    
    const winner = winners[0];
    const message = `🏆 Winner Alert! ${winner.player.name} from ${winner.player.company} achieved the highest score of ${winner.score} points in the ${timeWindow}!`;
    
    // Show browser notification if supported and permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Cloudera | Evolve25 New York | AI Bar Game Winner!', {
        body: message,
        icon: '/vite.svg',
        badge: '/vite.svg'
      });
    }
    
    // Show in-app notification
    this.showInAppNotification(message);
    
    // Call the winner callback for popup
    if (this.onWinnerAnnouncement) {
      this.onWinnerAnnouncement(winners);
    }
    
    console.log('Winner announcement:', message);
  }

  private showInAppNotification(message: string) {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-2xl">🏆</div>
        <div>
          <div class="font-bold text-sm mb-1">Winner Announcement!</div>
          <div class="text-xs opacity-90">${message}</div>
        </div>
        <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 10000);
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
}

export const winnerAnnouncementService = new WinnerAnnouncementService();