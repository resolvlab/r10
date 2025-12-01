import { Noun } from '../types';

const TOPIC_EMOJI_MAP: Record<string, string> = {
  'rumah': '🏠',        // House
  'belanja': '🛒',      // Shopping/Groceries
  'kota': '🏙️',        // City
  'kesehatan': '🏥',    // Health
  'pekerjaan': '💼',    // Work
  'kampus': '🎓',       // Campus/Education
  'alam': '🌿',         // Nature
  'orang': '👤',        // People
  'waktu': '⏳',        // Time
  'umum': '💡',         // General/Abstract (Idea)
};

/**
 * Returns the most relevant emoji for a noun.
 * Priority:
 * 1. Specific emoji assigned to the noun.
 * 2. Default emoji for the noun's topic.
 * 3. Generic sparkle ✨ fallback.
 */
export const getVisualForNoun = (noun: Noun): string => {
  // Use specific emoji if available and valid
  if (noun.emoji && noun.emoji.trim() !== '') {
    return noun.emoji;
  }
  
  // Fallback to topic emoji
  const topicKey = noun.topic.toLowerCase();
  return TOPIC_EMOJI_MAP[topicKey] || '✨';
};