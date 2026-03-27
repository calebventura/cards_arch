export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="px-5 pt-10 pb-5 flex items-center justify-between max-w-lg mx-auto w-full">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Arch<span className="text-indigo-400">Cards</span>
          </h1>
          <p className="text-[11px] text-slate-600 mt-0.5 font-medium tracking-[0.12em] uppercase">
            Technical English · Software Architecture
          </p>
        </div>

        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold text-indigo-300 select-none"
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          EN
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-6 max-w-lg mx-auto w-full">{children}</main>

      {/* Footer hint */}
      <footer className="pb-8 text-center max-w-lg mx-auto w-full">
        <p className="text-[10px] text-slate-800 font-medium tracking-[0.18em] uppercase select-none">
          Swipe or use ← → arrow keys
        </p>
      </footer>
    </div>
  );
}
