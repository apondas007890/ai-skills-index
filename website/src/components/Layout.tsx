import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Github,
  Home,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { REPO_GITHUB_URL } from '../lib/constants';
import { skills } from '../lib/data';

export function Layout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('skillatlas-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [quickQuery, setQuickQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isInput)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickQuery.trim();
    navigate(trimmed ? `/explore?q=${encodeURIComponent(trimmed)}` : '/explore');
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#0B0F17]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 font-mono text-sm font-bold text-white dark:bg-teal-500 dark:text-slate-950">
                SA
              </span>
              <span className="text-base">SkillAtlas</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
                  }`
                }
              >
                <Home className="h-4 w-4" />
                Library
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
                  }`
                }
              >
                <Compass className="h-4 w-4" />
                Explore
                <span className="ml-0.5 rounded bg-slate-200/80 px-1.5 py-0.2 font-mono text-[11px] text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {skills.length}
                </span>
              </NavLink>
            </nav>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 max-w-md md:block"
            role="search"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search skills, tags, agents..."
                aria-label="Search skills"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-14 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:bg-slate-950"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                /
              </kbd>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <a
              href={REPO_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline-flex"
            >
              <Github className="h-4 w-4" />
              Repo
            </a>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden dark:border-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search + Drawer */}
        <div className="border-t border-slate-100 px-4 py-2.5 md:hidden dark:border-slate-800/80">
          <form onSubmit={handleSearchSubmit} role="search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search skills, tags, agents..."
                aria-label="Search skills"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </form>

          {mobileMenuOpen && (
            <nav className="mt-2 flex flex-col gap-1 border-t border-slate-100 pt-2 dark:border-slate-800">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Library
              </Link>
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Explore All ({skills.length})
              </Link>
              <a
                href={REPO_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                GitHub Repository
              </a>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 dark:border-slate-800 dark:bg-[#0B0F17] dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-6">
          <p>
            <span className="font-semibold text-slate-700 dark:text-slate-300">SkillAtlas</span>{' '}
            — Personal AI Skills Library &amp; Evaluation Index. Git-backed, static, zero database.
          </p>
          <p className="font-mono">
            Press <kbd className="rounded border border-slate-300 px-1 dark:border-slate-700">/</kbd> or{' '}
            <kbd className="rounded border border-slate-300 px-1 dark:border-slate-700">Ctrl+K</kbd> to search
          </p>
        </div>
      </footer>
    </div>
  );
}
