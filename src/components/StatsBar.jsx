const STATS = [
  {
    key: 'seen',
    label: 'Vistas',
    icon: '◎',
    color: '#818cf8',
    activeBg: 'rgba(99,102,241,0.18)',
    activeBorder: 'rgba(99,102,241,0.5)',
    activeGlow: 'rgba(99,102,241,0.3)',
    idleBg: 'rgba(255,255,255,0.02)',
    idleBorder: 'rgba(255,255,255,0.05)',
  },
  {
    key: 'known',
    label: 'Aprendidas',
    icon: '✓',
    color: '#34d399',
    activeBg: 'rgba(52,211,153,0.15)',
    activeBorder: 'rgba(52,211,153,0.5)',
    activeGlow: 'rgba(52,211,153,0.25)',
    idleBg: 'rgba(255,255,255,0.02)',
    idleBorder: 'rgba(255,255,255,0.05)',
  },
  {
    key: 'practice',
    label: 'Practicar',
    icon: '↻',
    color: '#fbbf24',
    activeBg: 'rgba(251,191,36,0.15)',
    activeBorder: 'rgba(251,191,36,0.5)',
    activeGlow: 'rgba(251,191,36,0.2)',
    idleBg: 'rgba(255,255,255,0.02)',
    idleBorder: 'rgba(255,255,255,0.05)',
  },
];

export function StatsBar({ seenCount, knownCount, practiceCount, activeFilter, onFilterChange }) {
  const values = { seen: seenCount, known: knownCount, practice: practiceCount };
  const anyFilterActive = activeFilter !== null;

  return (
    <div className="flex gap-2">
      {STATS.map((stat) => {
        const count     = values[stat.key];
        const isActive  = activeFilter === stat.key;
        const isDimmed  = anyFilterActive && !isActive;
        const hasData   = count > 0;

        return (
          <button
            key={stat.key}
            onClick={() => onFilterChange(isActive ? null : stat.key)}
            disabled={!hasData}
            className="flex-1 flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-200 focus:outline-none disabled:cursor-default"
            style={{
              background: isActive
                ? stat.activeBg
                : isDimmed
                ? 'rgba(255,255,255,0.015)'
                : hasData
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(255,255,255,0.02)',
              border: `1px solid ${
                isActive
                  ? stat.activeBorder
                  : isDimmed
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(255,255,255,0.07)'
              }`,
              boxShadow: isActive ? `0 0 20px ${stat.activeGlow}` : 'none',
              transform: isActive ? 'translateY(-1px)' : 'none',
              opacity: isDimmed ? 0.45 : 1,
            }}
          >
            {/* Icon */}
            <span
              className="text-xs font-bold mb-0.5 leading-none"
              style={{ color: isActive ? stat.color : hasData ? stat.color : '#1e293b' }}
            >
              {stat.icon}
            </span>

            {/* Count */}
            <span
              className="text-lg font-bold leading-none"
              style={{ color: isActive ? stat.color : hasData ? '#cbd5e1' : '#334155' }}
            >
              {count}
            </span>

            {/* Label */}
            <span
              className="text-[10px] font-medium mt-1 leading-none"
              style={{ color: isActive ? stat.color : '#475569' }}
            >
              {stat.label}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <span
                className="w-1 h-1 rounded-full mt-1.5"
                style={{ background: stat.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
