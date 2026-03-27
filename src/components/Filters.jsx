const SECTION_PALETTE = {
  all:          { active: '#6366f1', glow: 'rgba(99,102,241,0.35)',  gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  Introducción: { active: '#60a5fa', glow: 'rgba(96,165,250,0.3)',   gradient: null },
  Patrones:     { active: '#a78bfa', glow: 'rgba(167,139,250,0.3)',  gradient: null },
  Resiliencia:  { active: '#f87171', glow: 'rgba(248,113,113,0.28)', gradient: null },
  Performance:  { active: '#fbbf24', glow: 'rgba(251,191,36,0.28)',  gradient: null },
  Diseño:       { active: '#34d399', glow: 'rgba(52,211,153,0.28)',  gradient: null },
  APIs:         { active: '#4ade80', glow: 'rgba(74,222,128,0.28)',  gradient: null },
};
const DEFAULT_PALETTE = { active: '#94a3b8', glow: 'rgba(148,163,184,0.25)', gradient: null };

export function Filters({ sections, activeSection, onSelect }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[11px] text-slate-700 font-medium uppercase tracking-[0.15em] px-1">
        Sección
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {sections.map((section) => {
          const isActive = section === activeSection;
          const palette = SECTION_PALETTE[section] ?? DEFAULT_PALETTE;
          const label = section === 'all' ? '✦ Todas' : section;

          return (
            <button
              key={section}
              onClick={() => onSelect(section)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none"
              style={{
                background: isActive
                  ? palette.gradient ?? `${palette.active}22`
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${
                  isActive
                    ? palette.gradient ? 'transparent' : `${palette.active}44`
                    : 'rgba(255,255,255,0.07)'
                }`,
                color: isActive ? (palette.gradient ? '#fff' : palette.active) : '#475569',
                boxShadow: isActive ? `0 2px 16px ${palette.glow}` : 'none',
                transform: isActive ? 'translateY(-1px)' : 'none',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
