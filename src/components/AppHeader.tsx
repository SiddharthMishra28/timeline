export function AppHeader({ title, showSearch = true }: { title: string, showSearch?: boolean }) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
        {showSearch && (
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            {/* Search icon placeholder or handled by BottomNav */}
          </button>
        )}
      </div>
    </header>
  );
}
