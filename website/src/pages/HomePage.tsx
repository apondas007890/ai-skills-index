import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Sparkles, Star } from 'lucide-react';
import { categories, skills, tags } from '../lib/data';
import { filterAndSortSkills } from '../lib/search';
import { CategoryIcon } from '../components/CategoryIcon';
import { SkillCard } from '../components/SkillCard';

type ShelfTab = 'all' | 'excellent' | 'good' | 'promising' | 'stars';

export function HomePage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ShelfTab>('all');
  const [quickCat, setQuickCat] = useState<string>('all');
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
    const totalStars = skills.reduce((sum, s) => sum + (s.stars ?? 0), 0);
    return {
      total: skills.length,
      excellentCount,
      goodCount,
      promisingCount,
      activeCategories,
      totalStars,
    };
  }, []);

  const shelfSkills = useMemo(() => {
    let list = [...skills];
    if (quickCat !== 'all') {
      list = list.filter((s) => s.categories.includes(quickCat));
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
        return list.sort((a, b) => b.quality - a.quality || (b.stars ?? 0) - (a.stars ?? 0));
    }
  }, [activeTab, quickCat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/explore?q=${encodeURIComponent(trimmed)}` : '/explore');
  };

  return (
    <div className="min-w-0 space-y-8">
      {/* Spotlight Command Header */}
      <section className="animate-fade-up rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
              <Sparkles className="h-3.5 w-3.5" />
              Curated AI Skills Knowledge Base
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Discover, inspect &amp; organize AI agent skills.
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Every skill is inspected for real capabilities,{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">security</span>, and{' '}
              <span className="font-semibold text-amber-600 dark:text-amber-400">GitHub stars</span> — searchable in milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                {stats.total}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Skills</div>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5">
              <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {stats.excellentCount + stats.goodCount}
              </div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                Good &amp; Excellent
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3.5 py-2.5">
              <div className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                {(stats.totalStars / 1000).toFixed(0)}k+
              </div>
              <div className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                GitHub Stars
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="font-mono text-lg font-bold text-teal-600 dark:text-teal-400">
                {stats.activeCategories}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Categories</div>
            </div>
          </div>
        </div>

        {/* Instant Search Input */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills by name, capability, tag, or agent (e.g. 'video', 'security', 'scraping', 'youtube')..."
              aria-label="Search SkillAtlas"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-28 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:bg-slate-900"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              Search
            </button>
          </div>
        </form>

        {/* Live Search Preview */}
        {query.trim() && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 dark:border-amber-400/20 dark:bg-slate-950/90">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Found <span className="font-mono font-bold">{liveMatches.length}</span> match(es) for{' '}
                <span className="rounded bg-amber-300/50 px-1.5 py-0.5 font-mono text-slate-900 dark:bg-amber-400/20 dark:text-amber-200">
                  {query}
                </span>
              </span>
              <Link
                to={`/explore?q=${encodeURIComponent(query.trim())}`}
                className="inline-flex items-center gap-1 font-semibold text-teal-600 hover:underline dark:text-teal-400"
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
              <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No skills matched "{query}". Try another keyword or clear the search box.
              </p>
            )}
          </div>
        )}

        {/* Quick Tag Pills */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Popular:
            </span>
            {tags.slice(0, 10).map((t) => (
              <Link
                key={t.tag}
                to={`/explore?tag=${encodeURIComponent(t.tag)}`}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[11px] text-slate-600 transition-colors hover:border-teal-500/50 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-teal-300"
              >
                #{t.tag} ({t.count})
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 1-Click Category Filter Bar */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Browse by Category
          </h2>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400"
          >
            Advanced filters <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setQuickCat('all')}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
              quickCat === 'all'
                ? 'border-teal-500 bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
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
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  quickCat === cat.id
                    ? 'border-teal-500 bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-teal-500/40 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <CategoryIcon name={cat.icon} className="h-3.5 w-3.5" />
                {cat.name}
                <span className="font-mono opacity-75">{cat.count}</span>
              </button>
            ))}
        </div>
      </section>

      {/* Interactive Tabbed Library Grid */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
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
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400"
          >
            <Star className="h-3.5 w-3.5 text-amber-500" />
            Open full Explorer
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shelfSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </div>
  );
}
