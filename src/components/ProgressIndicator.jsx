export function ProgressIndicator({ current, total }) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-2 px-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-700 font-medium uppercase tracking-[0.15em]">
          Progreso
        </span>
        <span className="text-xs text-slate-500 font-semibold tabular-nums">
          {current}
          <span className="text-slate-700 mx-1">/</span>
          {total}
        </span>
      </div>

      <div
        className="h-[3px] w-full rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.7)',
          }}
        />
      </div>
    </div>
  );
}
