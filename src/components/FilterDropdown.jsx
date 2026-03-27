import { useState, useRef, useEffect } from 'react';

const SECTION_PALETTE = {
  all:          { color: '#a5b4fc', dot: '#6366f1' },
  Introducción: { color: '#93c5fd', dot: '#3b82f6' },
  Patrones:     { color: '#c4b5fd', dot: '#8b5cf6' },
  Resiliencia:  { color: '#fca5a5', dot: '#ef4444' },
  Performance:  { color: '#fde68a', dot: '#f59e0b' },
  Diseño:       { color: '#6ee7b7', dot: '#10b981' },
  APIs:         { color: '#86efac', dot: '#22c55e'  },
};
const DEFAULT_PALETTE = { color: '#94a3b8', dot: '#475569' };

function getLabel(section) {
  return section === 'all' ? 'Todas las secciones' : section;
}

export function FilterDropdown({ sections, activeSection, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click / touch
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  const activePalette = SECTION_PALETTE[activeSection] ?? DEFAULT_PALETTE;

  return (
    <div ref={ref} className="relative" style={{ zIndex: 50 }}>
      <p className="text-[11px] text-slate-600 font-medium uppercase tracking-[0.15em] px-1 mb-1.5">
        Sección
      </p>

      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl focus:outline-none transition-all duration-200 select-none"
        style={{
          background: open
            ? 'rgba(99,102,241,0.1)'
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
        }}
      >
        {/* Left: dot + label */}
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: activePalette.dot, boxShadow: `0 0 6px ${activePalette.dot}` }}
          />
          <span className="text-sm font-medium" style={{ color: activePalette.color }}>
            {getLabel(activeSection)}
          </span>
        </div>

        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            color: '#4b5563',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0,
          }}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          top: 'calc(100% + 8px)',
          borderRadius: '14px',
          background: 'rgba(13,13,28,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          // Animate open/close
          maxHeight: open ? `${sections.length * 52}px` : '0px',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.98)',
          transition: 'max-height 0.28s ease, opacity 0.22s ease, transform 0.22s ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {sections.map((section, i) => {
          const palette = SECTION_PALETTE[section] ?? DEFAULT_PALETTE;
          const isActive = section === activeSection;
          const isLast = i === sections.length - 1;

          return (
            <button
              key={section}
              onClick={() => { onSelect(section); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors duration-150 focus:outline-none"
              style={{
                background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isActive
                  ? 'rgba(99,102,241,0.12)'
                  : 'transparent';
              }}
            >
              {/* Dot */}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: isActive ? palette.dot : 'rgba(255,255,255,0.15)',
                  boxShadow: isActive ? `0 0 6px ${palette.dot}` : 'none',
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
              />

              {/* Label */}
              <span
                className="text-sm font-medium flex-1"
                style={{ color: isActive ? palette.color : '#64748b' }}
              >
                {getLabel(section)}
              </span>

              {/* Check */}
              {isActive && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ color: palette.color, flexShrink: 0 }}
                >
                  <path
                    d="M2.5 7l3.5 3.5 5.5-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
