import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Github, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { REPO_GITHUB_URL } from '../lib/constants';
import { skills } from '../lib/data';

/** Crisp geometric architectural mark for SkillAtlas */
function SkillAtlasLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" className="fill-zinc-900 dark:fill-zinc-100" />
      <path
        d="M9.5 11.75L16 8L22.5 11.75V20.25L16 24L9.5 20.25V11.75Z"
        strokeWidth="1.65"
        className="stroke-white dark:stroke-zinc-900"
      />
      <path
        d="M16 8V16M16 16L22.5 11.75M16 16L9.5 11.75M16 16V24"
        stroke="#2563EB"
        strokeWidth="1.65"
      />
      <circle cx="16" cy="16" r="2.1" className="fill-white dark:fill-zinc-900" />
    </svg>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('skillatlas-theme');
    if (saved) return saved === 'dark';
    return true;
  });
  const [quickQuery, setQuickQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Only show the navbar quick-search on detail/category subpages so Catalog & Browse never show duplicate search bars
  const hasPageSearch =
    location.pathname === '/' ||
    location.pathname === '/home' ||
    location.pathname === '/explore';

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('skillatlas-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('skillatlas-theme', 'light');
    }
  }, [dark]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const isInput =
        t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isInput)) {
        const pageSearch = document.querySelector<HTMLInputElement>('main input[type="search"]');
        const target = searchInputRef.current || pageSearch;
        if (target) {
          e.preventDefault();
          target.focus();
          target.select();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quickQuery.trim();
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
    setMobileMenuOpen(false);
    setQuickQuery('');
  };

  return (
    <div className="relative flex min-h-dvh w-full max-w-full flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-[#0a0b0e]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
            >
              <SkillAtlasLogo className="h-7 w-7 shrink-0" />
              <span className="text-[15px] font-bold">SkillAtlas</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive || location.pathname === '/home'
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                  }`
                }
              >
                <BookOpen className="h-3.5 w-3.5" />
                Catalog
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                  }`
                }
              >
                <Compass className="h-3.5 w-3.5" />
                Browse
                <span className="ml-0.5 rounded-md bg-zinc-200/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {skills.length}
                </span>
              </NavLink>
            </nav>
          </div>

          {!hasPageSearch && (
            <form onSubmit={handleSearch} className="hidden max-w-sm flex-1 md:flex" role="search">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Jump to skill, agent, or tag..."
                  aria-label="Quick search"
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-10 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500"
                />
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
                  /
                </kbd>
              </div>
            </form>
          )}

          <div className="flex items-center gap-2">
            <a
              href={REPO_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:inline-flex"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 md:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-zinc-200 bg-white px-4 pb-4 pt-3 md:hidden dark:border-zinc-800 dark:bg-[#0a0b0e]">
            {!hasPageSearch && (
              <form onSubmit={handleSearch} role="search" className="mb-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="Search skills..."
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </form>
            )}
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <BookOpen className="h-4 w-4" />
                Catalog
              </Link>
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Compass className="h-4 w-4" />
                Browse All ({skills.length})
              </Link>
              <a
                href={REPO_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>

      <footer className="border-t border-zinc-200 bg-white py-5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-[#0a0b0e] dark:text-zinc-400">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-6">
          <p>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">SkillAtlas</span>
            {' '}— Curated AI Skills Index &amp; Evaluation Knowledge Base
          </p>
          <p className="font-mono">
            Press <kbd className="rounded border border-zinc-300 px-1 py-0.5 dark:border-zinc-700">/</kbd> or{' '}
            <kbd className="rounded border border-zinc-300 px-1 py-0.5 dark:border-zinc-700">Ctrl+K</kbd> to focus search
          </p>
        </div>
      </footer>
    </div>
  );
}
