import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Github,
  Menu,
  Moon,
  Search,
  Telescope,
  Sun,
  X,
} from 'lucide-react';
import { REPO_GITHUB_URL } from '../lib/constants';
import { skills } from '../lib/data';

/** Inline SVG logo for SkillAtlas — compass needle with spark */
function SkillAtlasLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background */}
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-zinc-900 dark:text-white" />
      {/* Compass circle */}
      <circle cx="16" cy="16" r="8.5" stroke="white" strokeOpacity="0.18" strokeWidth="1" className="dark:stroke-zinc-900" />
      {/* North needle – amber/gold */}
      <path d="M16 7.5L18 15H14L16 7.5Z" fill="#F59E0B" />
      {/* South needle – white dim */}
      <path d="M16 24.5L14 17H18L16 24.5Z" fill="white" fillOpacity="0.35" className="dark:fill-zinc-900" />
      {/* Center dot */}
      <circle cx="16" cy="16" r="1.75" fill="white" className="dark:fill-zinc-900" />
      {/* Spark / star top-right */}
      <path d="M24 6l.6 1.4L26 8l-1.4.6L24 10l-.6-1.4L22 8l1.4-.6L24 6Z" fill="#F59E0B" />
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
    setQuickQuery('');
  };

  return (
    <div className="relative flex min-h-screen w-full max-w-full flex-col overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-[#0C0C0E]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          {/* Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold tracking-tight text-zinc-900 dark:text-white"
            >
              <SkillAtlasLogo className="h-7 w-7 flex-shrink-0" />
              <span className="text-base">SkillAtlas</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white'
                  }`
                }
              >
                <BookOpen className="h-4 w-4" />
                Catalog
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white'
                  }`
                }
              >
                <Telescope className="h-4 w-4" />
                Browse
                <span className="ml-0.5 rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {skills.length}
                </span>
              </NavLink>
            </nav>
          </div>

          {/* Desktop search — only shown on md+ screens */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 max-w-md md:flex"
            role="search"
          >
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search skills, tags, agents..."
                aria-label="Quick search"
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-14 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
                /
              </kbd>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href={REPO_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:inline-flex"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 md:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer — no search bar here, just nav links */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-200/80 px-4 pb-3 pt-2 md:hidden dark:border-zinc-800">
            {/* Mobile search */}
            <form onSubmit={handleSearchSubmit} role="search" className="mb-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Search skills..."
                  aria-label="Search skills"
                  className="w-full rounded-md border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1 border-t border-zinc-200 pt-2 dark:border-zinc-800">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <BookOpen className="h-4 w-4" />
                Catalog
              </Link>
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Telescope className="h-4 w-4" />
                Browse All ({skills.length})
              </Link>
              <a
                href={REPO_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>

      <footer className="border-t border-zinc-200 bg-white py-5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-[#0C0C0E] dark:text-zinc-400">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-6">
          <p>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              SkillAtlas
            </span>{' '}
            — Personal AI Skills Library &amp; Discovery Engine.
          </p>
          <p className="font-mono">
            Press <kbd className="rounded border border-zinc-300 px-1 dark:border-zinc-700">/</kbd> or{' '}
            <kbd className="rounded border border-zinc-300 px-1 dark:border-zinc-700">Ctrl+K</kbd> to search
          </p>
        </div>
      </footer>
    </div>
  );
}
