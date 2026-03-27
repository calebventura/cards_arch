import { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { CardCarousel } from './components/CardCarousel';
import { FilterDropdown } from './components/FilterDropdown';
import { StatsBar } from './components/StatsBar';
import { useFlashcards } from './hooks/useFlashcards';
import { useCardStatus } from './hooks/useCardStatus';

/* ── Empty state when a filter returns zero cards ─────── */
function EmptyState({ statusFilter, onClear }) {
  const messages = {
    seen:     { icon: '◎', text: 'Aún no has visto ninguna tarjeta.' },
    known:    { icon: '✓', text: 'Todavía no has marcado ninguna como aprendida.' },
    practice: { icon: '↻', text: 'No tienes tarjetas marcadas para practicar.' },
  };
  const msg = messages[statusFilter] ?? { icon: '?', text: 'Sin resultados.' };

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16 px-6 rounded-2xl text-center"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <span className="text-4xl" style={{ opacity: 0.3 }}>{msg.icon}</span>
      <p className="text-sm text-slate-500">{msg.text}</p>
      <button
        onClick={onClear}
        className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors focus:outline-none"
        style={{
          background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.3)',
          color: '#a5b4fc',
        }}
      >
        Ver todas las tarjetas
      </button>
    </div>
  );
}

/* ── App ──────────────────────────────────────────────── */
export default function App() {
  const [statusFilter, setStatusFilter] = useState(null); // null | 'seen' | 'known' | 'practice'

  const {
    getStatus, setStatus, markSeen,
    seenCount, knownCount, practiceCount,
    seenIds, knownIds, practiceIds,
  } = useCardStatus();

  // Derive the allowedIds array from the active status filter
  const allowedIds = useMemo(() => {
    if (statusFilter === null)       return null;
    if (statusFilter === 'seen')     return seenIds;
    if (statusFilter === 'known')    return knownIds;
    if (statusFilter === 'practice') return practiceIds;
    return null;
  }, [statusFilter, seenIds, knownIds, practiceIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    currentCard,
    currentIndex,
    totalCards,
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
    canGoPrev,
  } = useFlashcards({ allowedIds, statusFilter });

  // Mark each card as "seen" the moment it becomes the current card
  useEffect(() => {
    if (currentCard?.id != null) markSeen(currentCard.id);
  }, [currentCard?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const cardStatus = currentCard ? getStatus(currentCard.id) : null;

  const handleFilterChange = (key) => {
    setStatusFilter(key);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-5 pt-2">
        <FilterDropdown
          sections={sections}
          activeSection={activeSection}
          onSelect={(section) => { setSection(section); setStatusFilter(null); }}
        />

        <StatsBar
          seenCount={seenCount}
          knownCount={knownCount}
          practiceCount={practiceCount}
          activeFilter={statusFilter}
          onFilterChange={handleFilterChange}
        />

        {totalCards === 0 ? (
          <EmptyState
            statusFilter={statusFilter}
            onClear={() => setStatusFilter(null)}
          />
        ) : (
          <CardCarousel
            currentCard={currentCard}
            currentIndex={currentIndex}
            totalCards={totalCards}
            isRevealed={isRevealed}
            direction={direction}
            shuffle={shuffle}
            goNext={goNext}
            goPrev={goPrev}
            reveal={reveal}
            hide={hide}
            toggleShuffle={toggleShuffle}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
            cardStatus={cardStatus}
            onSetStatus={setStatus}
          />
        )}
      </div>
    </Layout>
  );
}
