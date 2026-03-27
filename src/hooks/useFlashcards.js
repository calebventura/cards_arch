import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import data from '../data/flashcards.json';

const ALL = 'all';

/**
 * Central state machine for the flashcard app.
 *
 * Options:
 *   allowedIds  — when set, only cards whose id is in this array are shown
 *   statusFilter — string key that identifies the current filter type;
 *                  history resets whenever this changes
 */
export function useFlashcards({ allowedIds = null, statusFilter = null } = {}) {
  const [saved, setSaved] = useLocalStorage('archcards-state', {
    activeSection: ALL,
    startIndex: 0,
  });

  const [activeSection, setActiveSection] = useState(saved.activeSection);
  const [isRevealed, setIsRevealed] = useState(false);
  const [direction, setDirection]   = useState('initial');
  const [shuffle, setShuffle]       = useState(false);

  const [navHistory, setNavHistory] = useState(() => {
    const section = saved.activeSection;
    const initial = section === ALL ? data : data.filter((c) => c.section === section);
    const safe = Math.min(Math.max(0, saved.startIndex), Math.max(0, initial.length - 1));
    return [safe];
  });
  const [historyPos, setHistoryPos] = useState(0);

  /* ── Derived ────────────────────────────────────────── */
  const sections = useMemo(
    () => [ALL, ...new Set(data.map((c) => c.section))],
    [],
  );

  const cards = useMemo(() => {
    let result =
      activeSection === ALL ? data : data.filter((c) => c.section === activeSection);
    if (allowedIds !== null) {
      const idSet = new Set(allowedIds.map(String));
      result = result.filter((c) => idSet.has(String(c.id)));
    }
    return result;
  }, [activeSection, allowedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentIndex = Math.min(
    navHistory[historyPos] ?? 0,
    Math.max(0, cards.length - 1),
  );
  const currentCard = cards[currentIndex] ?? null;

  /* ── Reset history when the status filter type changes ── */
  const prevStatusFilter = useRef(statusFilter);
  useEffect(() => {
    if (prevStatusFilter.current === statusFilter) return;
    prevStatusFilter.current = statusFilter;
    setNavHistory([0]);
    setHistoryPos(0);
    setIsRevealed(false);
    setDirection('initial');
  }); // runs every render but only triggers when statusFilter actually differs

  /* ── Helpers ────────────────────────────────────────── */
  const persist = useCallback(
    (section, index) => setSaved({ activeSection: section, startIndex: index }),
    [setSaved],
  );

  const getShuffleNext = useCallback(() => {
    if (cards.length <= 1) return null;
    const visited   = new Set(navHistory);
    const unvisited = cards.map((_, i) => i).filter((i) => !visited.has(i));
    const pool =
      unvisited.length > 0
        ? unvisited
        : cards.map((_, i) => i).filter((i) => i !== currentIndex);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [cards, navHistory, currentIndex]);

  /* ── Actions ────────────────────────────────────────── */
  const goNext = useCallback(() => {
    if (historyPos < navHistory.length - 1) {
      const newPos = historyPos + 1;
      setHistoryPos(newPos);
      setDirection('next');
      setIsRevealed(false);
      persist(activeSection, navHistory[newPos]);
      return;
    }
    let nextIdx;
    if (shuffle) {
      nextIdx = getShuffleNext();
      if (nextIdx === null) return;
    } else {
      if (currentIndex >= cards.length - 1) return;
      nextIdx = currentIndex + 1;
    }
    const newHistory = [...navHistory, nextIdx];
    setNavHistory(newHistory);
    setHistoryPos(newHistory.length - 1);
    setDirection('next');
    setIsRevealed(false);
    persist(activeSection, nextIdx);
  }, [
    historyPos, navHistory, shuffle, currentIndex,
    cards.length, activeSection, persist, getShuffleNext,
  ]);

  const goPrev = useCallback(() => {
    if (historyPos <= 0) return;
    const newPos = historyPos - 1;
    setHistoryPos(newPos);
    setDirection('prev');
    setIsRevealed(false);
    persist(activeSection, navHistory[newPos]);
  }, [historyPos, navHistory, activeSection, persist]);

  const setSection = useCallback(
    (section) => {
      setActiveSection(section);
      setNavHistory([0]);
      setHistoryPos(0);
      setIsRevealed(false);
      setDirection('initial');
      persist(section, 0);
    },
    [persist],
  );

  const reveal        = useCallback(() => setIsRevealed(true), []);
  const hide          = useCallback(() => setIsRevealed(false), []);
  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  const canGoNext =
    historyPos < navHistory.length - 1
      ? true
      : shuffle
      ? cards.length > 1
      : currentIndex < cards.length - 1;

  return {
    cards,
    currentCard,
    currentIndex,
    totalCards: cards.length,
    isRevealed,
    direction,
    sections,
    activeSection,
    shuffle,
    goNext,
    goPrev,
    setSection,
    reveal,
    hide,
    toggleShuffle,
    canGoNext,
    canGoPrev: historyPos > 0,
  };
}
