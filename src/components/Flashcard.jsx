/* ── Section badge colors ─────────────────────────────── */
const SECTION_STYLES = {
  Introducción: { bg: 'rgba(96,165,250,0.15)',  color: '#93c5fd', border: 'rgba(96,165,250,0.3)'  },
  Patrones:     { bg: 'rgba(167,139,250,0.15)', color: '#c4b5fd', border: 'rgba(167,139,250,0.3)' },
  Resiliencia:  { bg: 'rgba(248,113,113,0.12)', color: '#fca5a5', border: 'rgba(248,113,113,0.28)' },
  Performance:  { bg: 'rgba(251,191,36,0.12)',  color: '#fde68a', border: 'rgba(251,191,36,0.28)'  },
  Diseño:       { bg: 'rgba(52,211,153,0.12)',  color: '#6ee7b7', border: 'rgba(52,211,153,0.28)'  },
  APIs:         { bg: 'rgba(74,222,128,0.12)',  color: '#86efac', border: 'rgba(74,222,128,0.28)'  },
};
const DEFAULT_SECTION = {
  bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: 'rgba(99,102,241,0.3)',
};

function SectionBadge({ section }) {
  const s = SECTION_STYLES[section] ?? DEFAULT_SECTION;
  return (
    <span
      className="text-[11px] font-semibold px-2.5 py-1 rounded-full leading-none"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {section}
    </span>
  );
}

/* ── Status action buttons ────────────────────────────── */
function StatusButtons({ cardId, status, onSetStatus }) {
  const isKnown    = status === 'known';
  const isPractice = status === 'practice';

  return (
    <div className="flex gap-2">
      <button
        onClick={(e) => { e.stopPropagation(); onSetStatus(cardId, 'known'); }}
        className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none"
        style={{
          background: isKnown ? 'rgba(52,211,153,0.18)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isKnown ? 'rgba(52,211,153,0.45)' : 'rgba(255,255,255,0.09)'}`,
          color: isKnown ? '#34d399' : '#4b5563',
          boxShadow: isKnown ? '0 0 14px rgba(52,211,153,0.2)' : 'none',
        }}
      >
        ✓ Lo sé
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onSetStatus(cardId, 'practice'); }}
        className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none"
        style={{
          background: isPractice ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isPractice ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.09)'}`,
          color: isPractice ? '#fbbf24' : '#4b5563',
          boxShadow: isPractice ? '0 0 14px rgba(251,191,36,0.15)' : 'none',
        }}
      >
        ↻ Practicar
      </button>
    </div>
  );
}

/* ── Reveal button ────────────────────────────────────── */
function RevealButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="reveal-btn w-full py-4 rounded-xl font-semibold text-sm text-white focus:outline-none select-none"
      style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        boxShadow: '0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow =
          '0 8px 32px rgba(99,102,241,0.55), inset 0 1px 0 rgba(255,255,255,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
      }}
    >
      Reveal meaning ✦
    </button>
  );
}

/* ── Main Flashcard ───────────────────────────────────── */
export function Flashcard({ card, isRevealed, onReveal, onHide, cardStatus, onSetStatus }) {
  if (!card) return null;

  return (
    <div style={{ perspective: '1200px', minHeight: '480px' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '480px',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ══════════ FRONT — English ══════════ */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-6 rounded-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background:
              'linear-gradient(160deg, rgba(18,18,40,0.98) 0%, rgba(11,11,26,0.99) 100%)',
            border: '1px solid rgba(99,102,241,0.18)',
            boxShadow:
              '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between">
            <SectionBadge section={card.section} />
            <span className="text-xs font-mono" style={{ color: '#374151' }}>
              #{String(card.id).padStart(2, '0')}
            </span>
          </div>

          {/* English phrase */}
          <div className="flex-1 flex items-center justify-center py-6 px-2">
            <p className="text-xl font-medium text-white text-center leading-relaxed">
              &ldquo;{card.english}&rdquo;
            </p>
          </div>

          {/* Context */}
          <div className="mb-4 text-center">
            <span className="text-xs" style={{ color: '#4b5563' }}>Contexto: </span>
            <span className="text-xs" style={{ color: '#6b7280' }}>{card.context}</span>
          </div>

          {/* Status + Reveal */}
          <div className="space-y-2.5">
            <StatusButtons
              cardId={card.id}
              status={cardStatus}
              onSetStatus={onSetStatus}
            />
            <RevealButton onClick={onReveal} />
          </div>
        </div>

        {/* ══════════ BACK — Spanish ══════════ */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-6 rounded-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background:
              'linear-gradient(160deg, rgba(30,18,72,0.97) 0%, rgba(14,8,38,0.99) 100%)',
            border: '1px solid rgba(139,92,246,0.28)',
            boxShadow:
              '0 24px 64px rgba(0,0,0,0.6), 0 0 56px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between">
            <SectionBadge section={card.section} />
            {/* "Ver original" button */}
            <button
              onClick={onHide}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-150 focus:outline-none"
              style={{ color: '#6366f1' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#a5b4fc')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6366f1')}
            >
              ← Ver original
            </button>
          </div>

          {/* Spanish translation */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-3 px-2">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'rgba(139,92,246,0.65)' }}
            >
              Traducción
            </p>
            <p className="text-xl font-medium text-white text-center leading-relaxed">
              &ldquo;{card.spanish}&rdquo;
            </p>
          </div>

          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-1.5 justify-center">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#64748b',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Status buttons */}
          <StatusButtons
            cardId={card.id}
            status={cardStatus}
            onSetStatus={onSetStatus}
          />
        </div>
      </div>
    </div>
  );
}
