export type Gender = 'der' | 'die' | 'das';

export type Level = 'A1' | 'A2' | 'B1';

export interface Noun {
  id: string;
  word: string;
  gender: Gender;
  meaning: string; // Indonesian meaning
  level: Level;
  topic: string;
  tip?: string; // Mnemonic in Indonesian
  emoji?: string; // Visual illustration
}

export interface NounProgress {
  nounId: string;
  correctStreak: number;
  totalAttempts: number;
  lastSeenAt: number; // Timestamp
}

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  currentDayStreak: number;
  lastPlayDate: string; // YYYY-MM-DD
}

export interface AppSettings {
  selectedLevels: Level[];
}

export type ViewState = 'WELCOME' | 'GAME' | 'STATS' | 'NOUN_LIST' | 'SETTINGS';