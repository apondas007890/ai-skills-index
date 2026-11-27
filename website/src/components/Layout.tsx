import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Github, Menu, Moon, Search, Sun, Telescope, X } from 'lucide-react';
import { REPO_GITHUB_URL } from '../lib/constants';
import { skills } from '../lib/data';

/** Premium SVG compass logo */
function SkillAtlasLogo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Outer ring glow */}
      <circle cx="18" cy="18" r="17" stroke="url(#ring)" strokeWidth="1" strokeOpacity="0.5" />
      {/* Inner circle */}
      <circle cx="18" cy="18" r="13" fill="url(#bg)" />
      {/* North needle */}
      <path d="M18 7L20.3 16H15.7L18 7Z" fill="url(#goldNeedle)" />
      {/* South needle */}
      <path d="M18 29L15.7 20H20.3L18 29Z" fill="rgba(255,255,255,0.18)" />
      {/* West/East ticks */}
      <circle cx="8"  cy="18" r="1" fill="rgba(255,255,255,0.15)" />
      <circle cx="28" cy="18" r="1" fill="rgba(255,255,255,0.15)" />
      {/* Center jewel */}
      <circle cx="18" cy="18" r="2.5" fill="url(#jewel)" />
      <circle cx="18" cy="18" r="1"   fill="rgba(255,255,255,0.9)" />
      {/* Spark */}
      <path d="M28 5l.7 1.6L30.3 7.3l-1.6.7L28 9.6l-.7-1.6L25.7 7.3l1.6-.7L28 5Z" fill="#F59E0B" />
      <defs>
        <radialGradient id="bg" cx="30%" cy="25%" r="85%">
          <stop offset="0%"   stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0d0d16" />
        </radialGradient>
        <linearGradient id="goldNeedle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <radialGradient id="jewel" cx="35%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
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
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add('dark'); localStorage.setItem('skillatlas-theme', 'dark'); }
    else       { root.classList.remove('dark'); localStorage.setItem('skillatlas-theme', 'light'); }
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const isInput = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isInput)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
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
    <div className="bg-mesh relative flex min-h-dvh w-full max-w-full flex-col overflow-x-hidden">
      {/* ── Header ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/[0.06] bg-[#080810]/80 backdrop-blur-2xl shadow-2xl shadow-black/40'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="group flex items-center gap-2.5 font-semibold tracking-tight text-white"
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                <SkillAtlasLogo className="h-8 w-8 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              </span>
              <span className="text-[15px] text-white/90 group-hover:text-white transition-colors">
                SkillAtlas
              </span>
            </Link>

            <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner'
                      : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                  }`
                }
              >
                <BookOpen className="h-3.5 w-3.5" />
                Catalog
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner'
                      : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                  }`
                }
              >
                <Telescope className="h-3.5 w-3.5" />
                Browse
                <span className="ml-0.5 rounded-full bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                  {skills.length}
                </span>
              </NavLink>
            </nav>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-sm md:flex" role="search">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
              <input
                ref={searchInputRef}
                type="search"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search skills, agents, tags..."
                aria-label="Quick search"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] py-1.5 pl-9 pr-12 text-[13px] text-white/80 placeholder:text-white/25 backdrop-blur-sm transition-all duration-200 focus:border-amber-500/40 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-amber-500/20"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-white/[0.1] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-white/30">
                /
              </kbd>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={REPO_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-white/70 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.1] hover:text-white sm:inline-flex"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? 'Light mode' : 'Dark mode'}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-white/50 transition-all duration-200 hover:border-white/16 hover:bg-white/[0.1] hover:text-white"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-white/50 transition-all md:hidden hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="animate-fade-in border-t border-white/[0.06] bg-[#080810]/90 backdrop-blur-2xl px-4 pb-4 pt-3 md:hidden">
            <form onSubmit={handleSearch} role="search" className="mb-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="search"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Search skills..."
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] py-2 pl-9 pr-3 text-[13px] text-white/80 placeholder:text-white/25 focus:border-amber-500/40 focus:outline-none"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {[
                { to: '/', icon: <BookOpen className="h-4 w-4" />, label: 'Catalog' },
                { to: '/explore', icon: <Telescope className="h-4 w-4" />, label: `Browse All (${skills.length})` },
              ].map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  {icon}{label}
                </Link>
              ))}
              <a
                href={REPO_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-10">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-6 text-[12px] text-white/30">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-6">
          <p>
            <span className="font-semibold text-white/60">SkillAtlas</span>
            {' '}— Personal AI Skills Library &amp; Discovery Engine
          </p>
          <p className="font-mono">
            Press <kbd className="rounded border border-white/10 px-1 py-0.5">/</kbd> or{' '}
            <kbd className="rounded border border-white/10 px-1 py-0.5">Ctrl K</kbd> to search
          </p>
        </div>
      </footer>
    </div>
  );
}
