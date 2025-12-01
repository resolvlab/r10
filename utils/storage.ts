import { NounProgress, UserStats, AppSettings } from '../types';

const PROGRESS_KEY = 'kartubahasa_noun_progress';
const STATS_KEY = 'kartubahasa_user_stats';
const SETTINGS_KEY = 'kartubahasa_settings';

// Default initial stats
const INITIAL_STATS: UserStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  currentDayStreak: 0,
  lastPlayDate: '',
};

// Default settings (All levels enabled)
const DEFAULT_SETTINGS: AppSettings = {
  selectedLevels: ['A1', 'A2', 'B1']
};

export const getProgressMap = (): Record<string, NounProgress> => {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to load progress", e);
    return {};
  }
};

export const saveNounProgress = (nounId: string, isCorrect: boolean) => {
  const map = getProgressMap();
  const now = Date.now();
  const existing = map[nounId] || {
    nounId,
    correctStreak: 0,
    totalAttempts: 0,
    lastSeenAt: 0,
  };

  const newProgress: NounProgress = {
    ...existing,
    totalAttempts: existing.totalAttempts + 1,
    correctStreak: isCorrect ? existing.correctStreak + 1 : 0, // Reset streak on wrong
    lastSeenAt: now,
  };

  map[nounId] = newProgress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
};

export const getUserStats = (): UserStats => {
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : INITIAL_STATS;
  } catch (e) {
    return INITIAL_STATS;
  }
};

export const updateUserStats = (isCorrect: boolean) => {
  const stats = getUserStats();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  let newStreak = stats.currentDayStreak;
  
  // Logic for streak calculation
  if (stats.lastPlayDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (stats.lastPlayDate === yesterdayStr) {
      // Played yesterday, increment streak
      newStreak += 1;
    } else {
      // Skipped a day or new user, reset streak to 1 (for today)
      newStreak = 1;
    }
  }

  const newStats: UserStats = {
    totalAnswered: stats.totalAnswered + 1,
    totalCorrect: isCorrect ? stats.totalCorrect + 1 : stats.totalCorrect,
    currentDayStreak: newStreak,
    lastPlayDate: today,
  };

  localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  return newStats;
};

export const getAppSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveAppSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};