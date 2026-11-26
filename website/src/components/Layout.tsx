import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Github,
  Home,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { REPO_GITHUB_URL } from '../lib/constants';
import { skills } from '../lib/data';

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
    <div className="relative flex min-h-screen w-full max-w-full flex-col overflow-x-hidden">
      {/* Subtle Top Spotlight Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,rgba(20,184,166,0.16),transparent)] dark:bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,rgba(45,212,191,0.14),transparent)]"
      />

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#07090F]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-sm shadow-teal-500/25">
                <Sparkles className="h-4 w-4" />
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
                      ? 'bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'
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
                      ? 'bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white'
                  }`
                }
              >
                <Compass className="h-4 w-4" />
                Explore
                <span className="ml-0.5 rounded-full bg-slate-200/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
                placeholder="Quick search skills, tags, agents..."
                aria-label="Search skills"
                className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-1.5 pl-9 pr-14 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:focus:border-teal-400 dark:focus:bg-slate-900"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                /
              </kbd>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <a
              href={REPO_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 sm:inline-flex"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search + Drawer */}
        <div className="border-t border-slate-200/70 px-4 py-2.5 md:hidden dark:border-slate-800/70">
          <form onSubmit={handleSearchSubmit} role="search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search skills, tags, agents..."
                aria-label="Search skills"
                className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </form>

          {mobileMenuOpen && (
            <nav className="mt-2 flex flex-col gap-1 border-t border-slate-200/70 pt-2 dark:border-slate-800">
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

      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>

      <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-xs text-slate-500 dark:border-slate-800/80 dark:bg-[#07090F]/80 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-6">
          <p>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              SkillAtlas
            </span>{' '}
            — Personal AI Skills Library &amp; Discovery Engine. Git-backed, static, zero database.
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
