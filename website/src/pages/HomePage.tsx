import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Search, SlidersHorizontal } from 'lucide-react';
import { allAgents, categories, skills, tags } from '../lib/data';
import { filterAndSortSkills } from '../lib/search';
import { CategoryIcon } from '../components/CategoryIcon';
import { SkillCard } from '../components/SkillCard';

type ShelfTab = 'all' | 'excellent' | 'good' | 'promising' | 'stars';

export function HomePage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ShelfTab>('all');
  const [quickCat, setQuickCat] = useState<string>('all');
  const [quickAgent, setQuickAgent] = useState<string>('all');
  const navigate = useNavigate();

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
    if (quickCat !== 'all') {
      list = list.filter((s) => s.categories.includes(quickCat));
    }
    if (quickAgent !== 'all') {
      list = list.filter((s) => s.compatible_agents.includes(quickAgent));
    }
    switch (activeTab) {
      case 'excellent':
        return list
          .filter((s) => s.status === 'excellent')
          .sort((a, b) => b.quality - a.quality);
      case 'good':
        return list
          .filter((s) => s.status === 'good')
          .sort((a, b) => b.quality - a.quality);
      case 'promising':
        return list
          .filter((s) => s.status === 'promising' || s.status === 'experimental')
          .sort((a, b) => b.quality - a.quality);
      case 'stars':
        return list.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
      case 'all':
      default:
        return list.sort(
          (a, b) => b.quality - a.quality || (b.stars ?? 0) - (a.stars ?? 0)
        );
    }
  }, [activeTab, quickCat, quickAgent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/explore?q=${encodeURIComponent(trimmed)}` : '/explore');
  };

  return (
    <div className="min-w-0 space-y-7">
      {/* Clean Editorial Command Header */}
      <section className="animate-fade-up rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-[#141417]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
              Personal AI Skills Library
            </h1>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Search evaluated `SKILL.md` modules, MCP servers, and video/coding tools by
              capability, category, or AI coding agent.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3.5 py-2 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="font-mono text-lg font-bold text-zinc-900 dark:text-white">
                {stats.total}
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Total Skills</div>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3.5 py-2 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {stats.excellentCount + stats.goodCount}
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Good &amp; Best</div>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3.5 py-2 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                {stats.activeCategories}
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Categories</div>
            </div>
          </div>
        </div>

        {/* Instant Search Input */}
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills by name, capability, tag, or AI tool (e.g. 'video', 'security', 'gemini-cli', 'claude-code')..."
              aria-label="Search SkillAtlas"
              className="w-full rounded-md border border-zinc-300 bg-zinc-50 py-2.5 pl-10 pr-24 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-500 dark:hover:text-white"
            >
              Search
            </button>
          </div>
        </form>

        {/* Live Search Preview */}
        {query.trim() && (
          <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-50/40 p-4 dark:border-amber-400/20 dark:bg-zinc-950/80">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                Found <span className="font-mono font-bold">{liveMatches.length}</span> match(es) for{' '}
                <span className="rounded bg-amber-300/60 px-1.5 py-0.5 font-mono text-zinc-900 dark:bg-amber-400/20 dark:text-amber-200">
                  {query}
                </span>
              </span>
              <Link
                to={`/explore?q=${encodeURIComponent(query.trim())}`}
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Open in Explore <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {liveMatches.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {liveMatches.slice(0, 6).map((skill) => (
                  <SkillCard key={skill.id} skill={skill} highlightQuery={query} />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No skills matched "{query}". Try another keyword or clear the search box.
              </p>
            )}
          </div>
        )}

        {/* Quick Tag Pills */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Tags:
            </span>
            {tags.slice(0, 10).map((t) => (
              <Link
                key={t.tag}
                to={`/explore?tag=${encodeURIComponent(t.tag)}`}
                className="rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                #{t.tag} ({t.count})
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 1-Click AI Tool (Agent) & Category Filters */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <Bot className="h-3.5 w-3.5" />
              AI Tool:
            </span>
            <button
              type="button"
              onClick={() => setQuickAgent('all')}
              className={`rounded-md border px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                quickAgent === 'all'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-[#141417] dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              All Tools
            </button>
            {allAgents.map((agent) => (
              <button
                key={agent}
                type="button"
                onClick={() => setQuickAgent(agent === quickAgent ? 'all' : agent)}
                className={`rounded-md border px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                  quickAgent === agent
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-[#141417] dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                {agent}
              </button>
            ))}
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            All filters
          </Link>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setQuickCat('all')}
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
              quickCat === 'all'
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-[#141417] dark:text-zinc-300 dark:hover:bg-zinc-800'
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
                onClick={() => setQuickCat(cat.id === quickCat ? 'all' : cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  quickCat === cat.id
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-[#141417] dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                <CategoryIcon name={cat.icon} className="h-3.5 w-3.5" />
                {cat.name}
                <span className="font-mono opacity-70">{cat.count}</span>
              </button>
            ))}
        </div>
      </section>

      {/* Interactive Tabbed Library Grid */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 border-b border-zinc-200 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: `All (${shelfSkills.length})` },
                { id: 'excellent', label: `Excellent (${stats.excellentCount})` },
                { id: 'good', label: `Good (${stats.goodCount})` },
                { id: 'promising', label: `Promising (${stats.promisingCount})` },
                { id: 'stars', label: 'Most Starred' },
              ] as { id: ShelfTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
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
              }}
              className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Reset quick filters
            </button>
          )}
        </div>

        {shelfSkills.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shelfSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-[#141417]">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              No skills match this category + AI tool combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuickCat('all');
                setQuickAgent('all');
                setActiveTab('all');
              }}
              className="mt-3 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-zinc-950"
            >
              Show all skills
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
