import { NOUNS } from '../data/nouns';
import { Noun } from '../types';
import { getProgressMap, getAppSettings } from './storage';

/**
 * Selects the next noun to display based on weighted probability.
 * Nouns with lower streaks or not seen recently have higher weight.
 * Only selects nouns from the active levels defined in settings.
 */
export const getNextNoun = (lastNounId?: string): Noun => {
  const progressMap = getProgressMap();
  const settings = getAppSettings();
  
  const allowedLevels = new Set(settings.selectedLevels);
  
  // Filter nouns based on allowed levels
  let candidateNouns = NOUNS.filter(n => allowedLevels.has(n.level));

  // Fallback to A1 if no levels are selected or list is empty (should not happen via UI)
  if (candidateNouns.length === 0) {
    candidateNouns = NOUNS.filter(n => n.level === 'A1');
  }

  // Filter out the last noun to prevent immediate repeats if possible
  const pool = candidateNouns.length > 1 
    ? candidateNouns.filter(n => n.id !== lastNounId) 
    : candidateNouns;

  // Calculate weight for each noun
  // Weight = 1 / (streak + 1)
  // Streak 0 = Weight 1
  // Streak 1 = Weight 0.5
  // Streak 4 = Weight 0.2
  // If never seen, treat as Streak 0 but boost slightly to introduce new words
  
  const weightedPool = pool.map(noun => {
    const stats = progressMap[noun.id];
    let weight = 1;

    if (!stats) {
      // New word. Give it a high weight to ensure new content appears.
      weight = 2; 
    } else {
      // Existing word.
      // Factor 1: Inverse of streak.
      weight = 1 / (stats.correctStreak + 1);

      // Factor 2: Time decay (optional simple version).
      // If we haven't seen it in a while, boost weight slightly.
      const hoursSinceLastSeen = (Date.now() - stats.lastSeenAt) / (1000 * 60 * 60);
      if (hoursSinceLastSeen > 24) {
        weight *= 1.5;
      }
    }
    return { noun, weight };
  });

  // Weighted random selection
  const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of weightedPool) {
    random -= item.weight;
    if (random <= 0) {
      return item.noun;
    }
  }

  // Fallback
  return pool[Math.floor(Math.random() * pool.length)];
};