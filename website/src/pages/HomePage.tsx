import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Layers,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { categories, skills, tags } from '../lib/data';
import { filterAndSortSkills } from '../lib/search';
import { CategoryIcon } from '../components/CategoryIcon';
import { SkillCard } from '../components/SkillCard';

export function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const liveMatches = useMemo(() => {
    if (!query.trim()) return [];
    return filterAndSortSkills(skills, { query, sort: 'relevance' }).slice(0, 6);
  }, [query]);

  const stats = useMemo(() => {
    const excellentCount = skills.filter((s) => s.status === 'excellent').length;
    const goodCount = skills.filter((s) => s.status === 'good').length;
    const promisingCount = skills.filter(
      (s) => s.status === 'promising' || s.status === 'experimental'
    ).length;
    const reviewCount = skills.filter((s) => s.status === 'needs-review').length;
    const activeCategories = categories.filter((c) => c.count > 0).length;
    return {
      total: skills.length,
      excellentCount,
      goodCount,
      promisingCount,
      reviewCount,
      activeCategories,
    };
  }, []);

  const excellentSkills = useMemo(
    () =>
      skills
        .filter((s) => s.status === 'excellent')
        .sort((a, b) => b.quality - a.quality)
        .slice(0, 6),
    []
  );

  const goodSkills = useMemo(
    () =>
      skills
        .filter((s) => s.status === 'good')
        .sort((a, b) => b.quality - a.quality)
        .slice(0, 6),
    []
  );

  const promisingSkills = useMemo(
    () =>
      skills
        .filter((s) => s.status === 'promising' || s.status === 'experimental')
        .sort((a, b) => b.quality - a.quality)
        .slice(0, 6),
    []
  );

  const recentSkills = useMemo(
    () =>
      [...skills]
        .sort((a, b) => b.last_reviewed.localeCompare(a.last_reviewed))
        .slice(0, 6),
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/explore?q=${encodeURIComponent(trimmed)}` : '/explore');
  };

  return (
    <div className="space-y-10">
      {/* Compact Tool-First Command Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800 dark:border-teal-800/70 dark:bg-teal-950/60 dark:text-teal-300">
              <Layers className="h-3.5 w-3.5" />
              Personal AI Skills Knowledge Base
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Find, evaluate, and organize AI agent skills.
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A curated, Git-backed library of inspected skills, workflows, and MCP tools.
              Search by capability, tag, category, or compatible agent.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                {stats.total}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Skills</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.excellentCount + stats.goodCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Verified Good+</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
                {stats.promisingCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Promising</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="font-mono text-xl font-bold text-teal-600 dark:text-teal-400">
                {stats.activeCategories}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Active Categories</div>
            </div>
          </div>
        </div>

        {/* Primary Search Box */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'anti-bloat', 'scraping', 'ui', 'claude-code', 'mcp'..."
              aria-label="Search SkillAtlas"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-28 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-teal-400"
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
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Instant matches for <span className="font-mono text-slate-900 dark:text-white">"{query}"</span>
              </span>
              <Link
                to={`/explore?q=${encodeURIComponent(query.trim())}`}
                className="inline-flex items-center gap-1 font-medium text-teal-600 hover:underline dark:text-teal-400"
              >
                Open in Explore <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {liveMatches.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {liveMatches.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No skills matched "{query}". Try another keyword or browse categories below.
              </p>
            )}
          </div>
        )}

        {/* Popular Tags */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Top tags:
            </span>
            {tags.slice(0, 10).map((t) => (
              <Link
                key={t.tag}
                to={`/explore?tag=${encodeURIComponent(t.tag)}`}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600 transition-colors hover:border-teal-500/40 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-teal-300"
              >
                #{t.tag} ({t.count})
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick Category Navigation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Categories
          </h2>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Browse all skills <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className={`group flex items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                cat.count > 0
                  ? 'border-slate-200 bg-white hover:border-teal-500/50 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-teal-400/40'
                  : 'border-slate-200/70 bg-slate-50/70 opacity-75 hover:opacity-100 dark:border-slate-800/60 dark:bg-slate-900/30'
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-teal-600 transition-colors group-hover:bg-teal-50 dark:bg-slate-800 dark:text-teal-400 dark:group-hover:bg-teal-950/60">
                <CategoryIcon name={cat.icon} className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {cat.name}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {cat.count}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Excellent Skills */}
      {excellentSkills.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Excellent Skills
              </h2>
            </div>
            <Link
              to="/explore?status=excellent"
              className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {excellentSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {/* Good Skills */}
      {goodSkills.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Good &amp; Practical
            </h2>
            <Link
              to="/explore?status=good"
              className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goodSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {/* Promising & Experimental */}
      {promisingSkills.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Promising &amp; Experimental
              </h2>
            </div>
            <Link
              to="/explore?status=promising"
              className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promisingSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Reviewed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recently Updated
            </h2>
          </div>
          <Link
            to="/explore?sort=reviewed"
            className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Sort by recent
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </div>
  );
}
