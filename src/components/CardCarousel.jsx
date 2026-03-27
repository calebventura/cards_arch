import { useEffect } from 'react';
import { Flashcard } from './Flashcard';
import { ProgressIndicator } from './ProgressIndicator';
import { useSwipe } from '../hooks/useSwipe';

/* ── Nav button ───────────────────────────────────────── */
function NavButton({ onClick, disabled, variant, children }) {
  const isNext = variant === 'next';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed"
      style={{
        background: disabled
          ? 'transparent'
          : isNext
          ? 'rgba(99,102,241,0.12)'
          : 'rgba(255,255,255,0.05)',
        border: `1px solid ${
          disabled
            ? 'rgba(255,255,255,0.05)'
            : isNext
            ? 'rgba(99,102,241,0.3)'
            : 'rgba(255,255,255,0.12)'
        }`,
        color: disabled ? '#1e293b' : isNext ? '#a5b4fc' : '#94a3b8',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
    >
      {children}
    </button>
  );
}

/* ── Shuffle toggle button ────────────────────────────── */
function ShuffleButton({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={active ? 'Modo aleatorio activo — click para desactivar' : 'Activar orden aleatorio'}
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none"
      style={{
        background: active ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.09)'}`,
        color: active ? '#a5b4fc' : '#475569',
        boxShadow: active ? '0 0 16px rgba(99,102,241,0.25)' : 'none',
      }}
    >
      <span style={{ fontSize: '14px' }}>⇄</span>
      <span>{active ? 'Aleatorio' : 'Orden'}</span>
    </button>
  );
}

/* ── Dot indicators ───────────────────────────────────── */
function DotIndicators({ total, current }) {
  if (total > 12) return null;
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? '16px' : '5px',
            height: '5px',
            background:
              i === current
                ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                : 'rgba(255,255,255,0.12)',
            boxShadow: i === current ? '0 0 8px rgba(99,102,241,0.5)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

/* ── CardCarousel ─────────────────────────────────────── */
export function CardCarousel({
  currentCard,
  currentIndex,
  totalCards,
  isRevealed,
  direction,
  shuffle,
  goNext,
  goPrev,
  reveal,
  hide,
  toggleShuffle,
  canGoNext,
  canGoPrev,
  cardStatus,
  onSetStatus,
}) {
  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if ((e.key === ' ' || e.key === 'Enter') && !isRevealed) {
        e.preventDefault();
        reveal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, reveal, isRevealed]);

  const animClass =
    direction === 'prev'
      ? 'anim-slide-left'
      : direction === 'next'
      ? 'anim-slide-right'
      : 'anim-fade-scale';

  return (
    <div className="flex flex-col gap-4">
      {/* Shuffle toggle + Progress */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <ProgressIndicator current={currentIndex + 1} total={totalCards} />
        </div>
        <ShuffleButton active={shuffle} onClick={toggleShuffle} />
      </div>

      {/* Swipe area */}
      <div
        {...swipeHandlers}
        className="cursor-grab active:cursor-grabbing select-none"
      >
        <div key={currentCard?.id} className={animClass}>
          <Flashcard
            card={currentCard}
            isRevealed={isRevealed}
            onReveal={reveal}
            onHide={hide}
            cardStatus={cardStatus}
            onSetStatus={onSetStatus}
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between mt-1 px-1">
        <NavButton onClick={goPrev} disabled={!canGoPrev} variant="prev">
          ← Anterior
        </NavButton>

        <DotIndicators total={totalCards} current={currentIndex} />

        <NavButton onClick={goNext} disabled={!canGoNext} variant="next">
          Siguiente →
        </NavButton>
      </div>
    </div>
  );
}
