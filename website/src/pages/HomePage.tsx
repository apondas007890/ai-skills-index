import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Search, SlidersHorizontal, Sparkles, Star, TrendingUp } from 'lucide-react';
import { allAgents, categories, skills, tags } from '../lib/data';
import { filterAndSortSkills } from '../lib/search';
import { CategoryIcon } from '../components/CategoryIcon';
import { SkillCard } from '../components/SkillCard';

type ShelfTab = 'all' | 'excellent' | 'good' | 'promising' | 'stars';

/** Agent accent colors for the filter row */
const AGENT_ACCENT: Record<string, { active: string; idle: string }> = {
  'claude-code': { active: 'border-orange-500/60 bg-orange-500/15 text-orange-400', idle: 'border-orange-500/20 text-orange-400/60 hover:border-orange-500/40 hover:text-orange-400' },
  'cline':       { active: 'border-yellow-500/60 bg-yellow-500/15 text-yellow-400', idle: 'border-yellow-500/20 text-yellow-400/60 hover:border-yellow-500/40 hover:text-yellow-400' },
  'codex':       { active: 'border-green-500/60 bg-green-500/15 text-green-400',    idle: 'border-green-500/20 text-green-400/60 hover:border-green-500/40 hover:text-green-400'   },
  'cursor':      { active: 'border-purple-500/60 bg-purple-500/15 text-purple-400', idle: 'border-purple-500/20 text-purple-400/60 hover:border-purple-500/40 hover:text-purple-400' },
  'gemini-cli':  { active: 'border-blue-500/60 bg-blue-500/15 text-blue-400',       idle: 'border-blue-500/20 text-blue-400/60 hover:border-blue-500/40 hover:text-blue-400'      },
  'kiro':        { active: 'border-red-500/60 bg-red-500/15 text-red-400',           idle: 'border-red-500/20 text-red-400/60 hover:border-red-500/40 hover:text-red-400'          },
  'opencode':    { active: 'border-teal-500/60 bg-teal-500/15 text-teal-400',        idle: 'border-teal-500/20 text-teal-400/60 hover:border-teal-500/40 hover:text-teal-400'     },
  'windsurf':    { active: 'border-cyan-500/60 bg-cyan-500/15 text-cyan-400',        idle: 'border-cyan-500/20 text-cyan-400/60 hover:border-cyan-500/40 hover:text-cyan-400'     },
};

export function HomePage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ShelfTab>('all');
  const [quickCat, setQuickCat] = useState<string>('all');
  const [quickAgent, setQuickAgent] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(36);
  const navigate = useNavigate();

  const liveMatches = useMemo(() => {
    if (!query.trim()) return [];
    return filterAndSortSkills(skills, { query, sort: 'relevance' });
  }, [query]);

  const stats = useMemo(() => {
    const excellentCount = skills.filter((s) => s.status === 'excellent').length;
    const goodCount      = skills.filter((s) => s.status === 'good').length;
    const promisingCount = skills.filter((s) => s.status === 'promising' || s.status === 'experimental').length;
    const activeCategories = categories.filter((c) => c.count > 0).length;
    return { total: skills.length, excellentCount, goodCount, promisingCount, activeCategories };
  }, []);

  const shelfSkills = useMemo(() => {
    let list = [...skills];
    if (quickCat   !== 'all') list = list.filter((s) => s.categories.includes(quickCat));
    if (quickAgent !== 'all') list = list.filter((s) => s.compatible_agents.includes(quickAgent));
    switch (activeTab) {
      case 'excellent': return list.filter((s) => s.status === 'excellent').sort((a, b) => b.quality - a.quality);
      case 'good':      return list.filter((s) => s.status === 'good').sort((a, b) => b.quality - a.quality);
      case 'promising': return list.filter((s) => s.status === 'promising' || s.status === 'experimental').sort((a, b) => b.quality - a.quality);
      case 'stars':     return list.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
      default:          return list.sort((a, b) => b.quality - a.quality || (b.stars ?? 0) - (a.stars ?? 0));
    }
  }, [activeTab, quickCat, quickAgent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
  };

  return (
    <div className="min-w-0 space-y-8">

      {/* ── Hero Section ── */}
      <section className="animate-fade-up relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 shadow-2xl shadow-black/40 sm:p-8 backdrop-blur-xl">
        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-amber-500/8 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.2s' }} />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left copy */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-400">
              <Sparkles className="h-3 w-3" />
              AI Skills Discovery Engine
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Personal AI{' '}
              <span className="shimmer-text">Skills Library</span>
            </h1>
            <p className="text-[14px] leading-relaxed text-white/50">
              Curated <code className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-white/70">SKILL.md</code> modules, MCP servers, and coding tools — evaluated by quality, compatibility, and real-world usefulness.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 lg:min-w-[220px]">
            {[
              { value: stats.total, label: 'Total Skills', color: 'text-white' },
              { value: stats.excellentCount + stats.goodCount, label: 'Good & Best', color: 'text-emerald-400' },
              { value: stats.activeCategories, label: 'Categories', color: 'text-blue-400' },
            ].map(({ value, label, color }) => (
              <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-3 text-center backdrop-blur-sm">
                <div className={`font-mono text-xl font-bold ${color}`}>{value}</div>
                <div className="mt-0.5 text-[10px] text-white/35">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="relative mt-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, capability, tag, or AI tool — e.g. 'security', 'gemini-cli', 'mcp'..."
            aria-label="Search SkillAtlas"
            className="w-full rounded-2xl border border-white/[0.1] bg-white/[0.06] py-3.5 pl-11 pr-28 text-[14px] text-white/80 placeholder:text-white/25 backdrop-blur-sm transition-all duration-200 focus:border-amber-500/40 focus:bg-white/[0.09] focus:outline-none focus:ring-1 focus:ring-amber-500/20"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl border border-amber-500/30 bg-amber-500/15 px-4 py-2 text-[13px] font-semibold text-amber-400 transition-all hover:bg-amber-500/25 hover:border-amber-500/50"
          >
            Search
          </button>
        </form>

        {/* Quick tag pills */}
        {tags.length > 0 && !query.trim() && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/25">Tags:</span>
            {tags.slice(0, 10).map((t) => (
              <Link
                key={t.tag}
                to={`/explore?tag=${encodeURIComponent(t.tag)}`}
                className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-white/35 transition-colors hover:border-white/15 hover:text-white/70"
              >
                #{t.tag} <span className="text-white/20">({t.count})</span>
              </Link>
            ))}
          </div>
        )}

        {/* Live search preview */}
        {query.trim() && (
          <div className="mt-4 animate-scale-in rounded-2xl border border-amber-500/15 bg-amber-500/[0.05] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px]">
              <span className="text-white/60">
                Found <span className="font-mono font-bold text-white">{liveMatches.length}</span> match(es) for{' '}
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-amber-400">
                  {query}
                </span>
              </span>
              <Link
                to={`/explore?q=${encodeURIComponent(query.trim())}`}
                className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300"
              >
                Open in Browse <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {liveMatches.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {liveMatches.slice(0, 6).map((skill) => (
                  <SkillCard key={skill.id} skill={skill} highlightQuery={query} />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-[13px] text-white/40">
                No skills matched "{query}". Try a different keyword.
              </p>
            )}
          </div>
        )}
      </section>

      {/* ── Filter Row ── */}
      <section className="space-y-3">
        {/* AI Tool pills */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white/30">
              <Bot className="h-3 w-3" /> Agent:
            </span>
            <button
              type="button"
              onClick={() => setQuickAgent('all')}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold transition-all ${
                quickAgent === 'all'
                  ? 'border-white/30 bg-white/15 text-white shadow-sm'
                  : 'border-white/[0.1] text-white/40 hover:border-white/20 hover:text-white/70'
              }`}
            >
              All Tools
            </button>
            {allAgents.map((agent) => {
              const accent = AGENT_ACCENT[agent] ?? { active: 'border-white/30 bg-white/10 text-white', idle: 'border-white/10 text-white/40 hover:text-white/70' };
              return (
                <button
                  key={agent}
                  type="button"
                  onClick={() => setQuickAgent(agent === quickAgent ? 'all' : agent)}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] font-medium transition-all ${
                    quickAgent === agent ? accent.active : accent.idle
                  }`}
                >
                  {agent}
                </button>
              );
            })}
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/40 hover:text-white/80 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> All filters
          </Link>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setQuickCat('all')}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-semibold transition-all ${
              quickCat === 'all'
                ? 'border-white/25 bg-white/12 text-white shadow'
                : 'border-white/[0.08] text-white/40 hover:border-white/16 hover:text-white/70'
            }`}
          >
            All Categories ({skills.length})
          </button>
          {categories.filter((c) => c.count > 0).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setQuickCat(cat.id === quickCat ? 'all' : cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-semibold transition-all ${
                quickCat === cat.id
                  ? 'border-white/25 bg-white/12 text-white shadow'
                  : 'border-white/[0.08] text-white/40 hover:border-white/16 hover:text-white/70'
              }`}
            >
              <CategoryIcon name={cat.icon} className="h-3.5 w-3.5 opacity-70" />
              {cat.name}
              <span className="font-mono opacity-50">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Skill Grid ── */}
      <section className="space-y-4">
        {/* Tab bar */}
        <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all',       label: `All (${shelfSkills.length})`,         icon: null },
                { id: 'excellent', label: `Excellent (${stats.excellentCount})`,  icon: <Sparkles className="h-3.5 w-3.5" /> },
                { id: 'good',      label: `Good (${stats.goodCount})`,            icon: null },
                { id: 'promising', label: `Promising (${stats.promisingCount})`,  icon: null },
                { id: 'stars',     label: 'Most Starred',                          icon: <Star className="h-3.5 w-3.5" /> },
              ] as { id: ShelfTab; label: string; icon: React.ReactNode }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/12 text-white border border-white/20 shadow-sm'
                    : 'text-white/40 hover:bg-white/[0.05] hover:text-white/70'
                }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          {(quickCat !== 'all' || quickAgent !== 'all') && (
            <button
              type="button"
              onClick={() => { setQuickCat('all'); setQuickAgent('all'); }}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-amber-400/70 hover:text-amber-400 transition-colors"
            >
              <TrendingUp className="h-3.5 w-3.5" /> Reset filters
            </button>
          )}
        </div>

        {shelfSkills.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
              {shelfSkills.slice(0, visibleCount).map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
            {shelfSkills.length > visibleCount && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 36)}
                  className="glass rounded-2xl px-6 py-2.5 text-[13px] font-semibold text-white/80 transition-all hover:border-amber-500/40 hover:text-amber-400"
                >
                  Show more ({shelfSkills.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="glass rounded-3xl p-10 text-center">
            <p className="text-[14px] font-medium text-white/60">
              No skills match this combination.
            </p>
            <button
              type="button"
              onClick={() => { setQuickCat('all'); setQuickAgent('all'); setActiveTab('all'); }}
              className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[12px] font-semibold text-amber-400 hover:bg-amber-500/20 transition-all"
            >
              Show all skills
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
