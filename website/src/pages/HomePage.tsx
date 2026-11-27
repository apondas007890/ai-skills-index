import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { allAgents, categories, skills, tags } from '../lib/data';
import { filterAndSortSkills } from '../lib/search';
import { usePageSeo } from '../lib/seo';
import { CategoryIcon } from '../components/CategoryIcon';
import { SkillCard } from '../components/SkillCard';

type ShelfTab = 'all' | 'excellent' | 'good' | 'promising' | 'stars';

const AGENT_ACCENT: Record<string, { active: string; idle: string; dot: string }> = {
  'claude-code': {
    active: 'border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-500/70 dark:bg-orange-950/60 dark:text-orange-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-orange-700 dark:hover:text-orange-300',
    dot: 'bg-orange-500',
  },
  cline: {
    active: 'border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-500/70 dark:bg-amber-950/60 dark:text-amber-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-amber-300 hover:text-amber-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-amber-700 dark:hover:text-amber-300',
    dot: 'bg-amber-500',
  },
  codex: {
    active: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500/70 dark:bg-emerald-950/60 dark:text-emerald-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-emerald-700 dark:hover:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  cursor: {
    active: 'border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-500/70 dark:bg-violet-950/60 dark:text-violet-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-violet-300 hover:text-violet-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-violet-700 dark:hover:text-violet-300',
    dot: 'bg-violet-500',
  },
  'gemini-cli': {
    active: 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500/70 dark:bg-blue-950/60 dark:text-blue-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-blue-300 hover:text-blue-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-blue-700 dark:hover:text-blue-300',
    dot: 'bg-blue-500',
  },
  kiro: {
    active: 'border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-500/70 dark:bg-rose-950/60 dark:text-rose-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-rose-300 hover:text-rose-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-rose-700 dark:hover:text-rose-300',
    dot: 'bg-rose-500',
  },
  opencode: {
    active: 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-500/70 dark:bg-teal-950/60 dark:text-teal-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-teal-300 hover:text-teal-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-teal-700 dark:hover:text-teal-300',
    dot: 'bg-teal-500',
  },
  windsurf: {
    active: 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-500/70 dark:bg-cyan-950/60 dark:text-cyan-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-cyan-300 hover:text-cyan-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-cyan-700 dark:hover:text-cyan-300',
    dot: 'bg-cyan-500',
  },
  'github-copilot': {
    active: 'border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-500/70 dark:bg-sky-950/60 dark:text-sky-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-sky-300 hover:text-sky-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-sky-700 dark:hover:text-sky-300',
    dot: 'bg-sky-500',
  },
  antigravity: {
    active: 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500/70 dark:bg-indigo-950/60 dark:text-indigo-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-indigo-300 hover:text-indigo-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300',
    dot: 'bg-indigo-500',
  },
  'roo-code': {
    active: 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-500/70 dark:bg-fuchsia-950/60 dark:text-fuchsia-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-fuchsia-300 hover:text-fuchsia-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-fuchsia-700 dark:hover:text-fuchsia-300',
    dot: 'bg-fuchsia-500',
  },
  aider: {
    active: 'border-lime-500 bg-lime-50 text-lime-700 dark:border-lime-500/70 dark:bg-lime-950/60 dark:text-lime-300',
    idle: 'border-zinc-200 bg-white text-zinc-600 hover:border-lime-300 hover:text-lime-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-lime-700 dark:hover:text-lime-300',
    dot: 'bg-lime-500',
  },
};

export function HomePage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ShelfTab>('all');
  const [quickCat, setQuickCat] = useState<string>('all');
  const [quickAgent, setQuickAgent] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();

  usePageSeo({
    title: 'SkillAtlas — Curated AI Skills Index',
    description: `Browse ${skills.length.toLocaleString()} curated AI agent skills across ${categories.length} categories for ${allAgents.length} coding agents including claude-code, gemini-cli, codex, and cursor.`,
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SkillAtlas — Curated AI Skills Index',
      url: 'https://skillatlas.apondas007890.workers.dev/',
      description: `Curated directory of ${skills.length} AI agent skills, SKILL.md modules, and MCP servers.`,
      numberOfItems: skills.length,
    },
  });

  const liveMatches = useMemo(() => {
    if (!query.trim()) return [];
    return filterAndSortSkills(skills, { query, sort: 'relevance' });
  }, [query]);

  const stats = useMemo(() => {
    const excellentCount = skills.filter((s) => s.status === 'excellent').length;
    const goodCount = skills.filter((s) => s.status === 'good').length;
    const promisingCount = skills.filter(
      (s) => s.status === 'promising' || s.status === 'experimental'
    ).length;
    const activeCategories = categories.filter((c) => c.count > 0).length;
    return {
      total: skills.length,
      excellentCount,
      goodCount,
      promisingCount,
      activeCategories,
    };
  }, []);

  const shelfSkills = useMemo(() => {
    let list = [...skills];
    if (quickCat !== 'all') list = list.filter((s) => s.categories.includes(quickCat));
    if (quickAgent !== 'all') list = list.filter((s) => s.compatible_agents.includes(quickAgent));
    switch (activeTab) {
      case 'excellent':
        return list.filter((s) => s.status === 'excellent').sort((a, b) => b.quality - a.quality || (b.stars ?? 0) - (a.stars ?? 0));
      case 'good':
        return list.filter((s) => s.status === 'good').sort((a, b) => b.quality - a.quality || (b.stars ?? 0) - (a.stars ?? 0));
      case 'promising':
        return list.filter((s) => s.status === 'promising' || s.status === 'experimental').sort((a, b) => b.quality - a.quality || (b.stars ?? 0) - (a.stars ?? 0));
      case 'stars':
        return list.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
      default:
        return list.sort((a, b) => b.quality - a.quality || (b.stars ?? 0) - (a.stars ?? 0));
    }
  }, [activeTab, quickCat, quickAgent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Open Editorial Header — no nested stat cards inside a hero card */}
      <section className="animate-fade-up border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-1.5">
            <h1 className="min-w-0 break-words text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              AI Skills Directory
            </h1>
            <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              Verified <code className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">SKILL.md</code> repositories, MCP servers, and coding workflows indexed by quality, star count, and tool compatibility.
            </p>
          </div>

          <dl className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Skills</dt>
              <dd className="font-mono text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                {stats.total.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Good &amp; Best</dt>
              <dd className="font-mono text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {(stats.excellentCount + stats.goodCount).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">Categories</dt>
              <dd className="font-mono text-lg font-bold tabular-nums text-blue-600 dark:text-blue-400">
                {stats.activeCategories}
              </dd>
            </div>
          </dl>
        </div>

        {/* Primary Search Bar (single search bar on this page) */}
        <form onSubmit={handleSubmit} className="relative mt-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills by name, URL, capability, tag, or AI tool (e.g. 'security', 'gemini-cli', 'mcp')..."
            aria-label="Search SkillAtlas"
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-24 text-[14px] text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-blue-500 dark:hover:text-white"
          >
            Search
          </button>
        </form>

        {/* Quick Tag Pills */}
        {tags.length > 0 && !query.trim() && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Popular tags:
            </span>
            {tags.slice(0, 8).map((t) => (
              <Link
                key={t.tag}
                to={`/explore?tag=${encodeURIComponent(t.tag)}`}
                className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
              >
                #{t.tag} <span className="opacity-60">({t.count})</span>
              </Link>
            ))}
          </div>
        )}

        {/* Live Search Preview */}
        {query.trim() && (
          <div className="surface-subtle mt-4 rounded-xl p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-zinc-600 dark:text-zinc-300">
                Found <span className="font-mono font-bold text-zinc-900 dark:text-white">{liveMatches.length}</span> match(es) for{' '}
                <span className="rounded bg-amber-200/70 px-1.5 py-0.5 font-mono font-semibold text-zinc-900 dark:bg-amber-500/20 dark:text-amber-200">
                  {query}
                </span>
              </span>
              <Link
                to={`/explore?q=${encodeURIComponent(query.trim())}`}
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Open in Browse <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {liveMatches.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {liveMatches.slice(0, 6).map((skill) => (
                  <SkillCard key={skill.id} skill={skill} highlightQuery={query} />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
                No skills matched "{query}". Try a different keyword.
              </p>
            )}
          </div>
        )}
      </section>

      {/* AI Tool & Category Filters */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            <span className="mr-1 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <Bot className="h-3.5 w-3.5" /> Agent:
            </span>
            <button
              type="button"
              onClick={() => {
                setQuickAgent('all');
                setVisibleCount(12);
              }}
              className={`shrink-0 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
                quickAgent === 'all'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              All Tools
            </button>
            {allAgents.map((agent) => {
              const accent = AGENT_ACCENT[agent] ?? {
                active: 'border-blue-600 bg-blue-50 text-blue-700',
                idle: 'border-zinc-200 bg-white text-zinc-600',
                dot: 'bg-zinc-400',
              };
              const isSelected = quickAgent === agent;
              return (
                <button
                  key={agent}
                  type="button"
                  onClick={() => {
                    setQuickAgent(isSelected ? 'all' : agent);
                    setVisibleCount(12);
                  }}
                  className={`inline-flex shrink-0 items-center rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors ${
                    isSelected ? accent.active : accent.idle
                  }`}
                >
                  {agent}
                </button>
              );
            })}
          </div>

          <Link
            to="/explore"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> All filters
          </Link>
        </div>

        {/* Category pills */}
        <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button
            type="button"
            onClick={() => {
              setQuickCat('all');
              setVisibleCount(12);
            }}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              quickCat === 'all'
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            All Categories ({skills.length})
          </button>
          {categories
            .filter((c) => c.count > 0)
            .map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setQuickCat(cat.id === quickCat ? 'all' : cat.id);
                  setVisibleCount(12);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  quickCat === cat.id
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                <CategoryIcon name={cat.icon} className="h-3.5 w-3.5 opacity-80" />
                {cat.name}
                <span className="font-mono opacity-60">{cat.count}</span>
              </button>
            ))}
        </div>
      </section>

      {/* Skill Grid */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 border-b border-zinc-200 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: `All (${shelfSkills.length})`, icon: null },
                { id: 'excellent', label: `Excellent (${stats.excellentCount})`, icon: null },
                { id: 'good', label: `Good (${stats.goodCount})`, icon: null },
                { id: 'promising', label: `Promising (${stats.promisingCount})`, icon: null },
                { id: 'stars', label: 'Most Starred', icon: <Star className="h-3.5 w-3.5 text-amber-500" /> },
              ] as { id: ShelfTab; label: string; icon: React.ReactNode }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setVisibleCount(36);
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {(quickCat !== 'all' || quickAgent !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setQuickCat('all');
                setQuickAgent('all');
                setVisibleCount(36);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              <X className="h-3.5 w-3.5" /> Reset quick filters
            </button>
          )}
        </div>

        {shelfSkills.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shelfSkills.slice(0, visibleCount).map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
            {shelfSkills.length > visibleCount && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 12)}
                  className="surface-card rounded-xl px-5 py-2.5 text-[13px] font-semibold text-zinc-800 hover:border-blue-500 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400"
                >
                  Show 12 more ({(shelfSkills.length - visibleCount).toLocaleString()} remaining)
                </button>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-blue-500 dark:hover:text-white"
                >
                  Browse all {skills.length.toLocaleString()} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="surface-card rounded-2xl p-10 text-center">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              No skills match this combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuickCat('all');
                setQuickAgent('all');
                setActiveTab('all');
              }}
              className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Show all skills
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
