import { useLocalStorage } from './useLocalStorage';

/**
 * Tracks per-card learning status ('known' | 'practice' | null)
 * and a global set of seen card IDs.
 * Both are persisted to localStorage.
 */
export function useCardStatus() {
  const [statuses, setStatuses] = useLocalStorage('archcards-statuses', {});
  const [seenIds, setSeenIds] = useLocalStorage('archcards-seen', []);

  /** Return 'known' | 'practice' | null for a given card id */
  const getStatus = (cardId) => statuses[String(cardId)] ?? null;

  /**
   * Set status for a card. Calling with the same status toggles it off.
   * e.g. setStatus(1, 'known') again → removes 'known' from card 1
   */
  const setStatus = (cardId, status) => {
    setStatuses((prev) => {
      const key = String(cardId);
      if (prev[key] === status) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: status };
    });
  };

  /** Record that a card was shown to the user */
  const markSeen = (cardId) => {
    const key = String(cardId);
    setSeenIds((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const knownCount    = Object.values(statuses).filter((s) => s === 'known').length;
  const practiceCount = Object.values(statuses).filter((s) => s === 'practice').length;
  const seenCount     = seenIds.length;

  // Raw ID arrays — consumed by App to build allowedIds for useFlashcards
  const knownIds    = Object.entries(statuses).filter(([, s]) => s === 'known').map(([id]) => id);
  const practiceIds = Object.entries(statuses).filter(([, s]) => s === 'practice').map(([id]) => id);

  return {
    getStatus, setStatus, markSeen,
    seenCount, knownCount, practiceCount,
    seenIds, knownIds, practiceIds,
  };
}
