import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, LayoutGrid, List, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { allAgents, allSourceTypes, categories, skills, tags } from '../lib/data';
import { SECURITY_META, STATUS_META } from '../lib/constants';
import { filterAndSortSkills, type SortOption } from '../lib/search';
import type { SecurityLevel, SkillStatus, SourceType } from '../types/skill';
import { SkillCard } from '../components/SkillCard';

const STATUS_ORDER: SkillStatus[] = [
  'excellent', 'good', 'promising', 'experimental', 'neutral', 'needs-review', 'bad', 'risky', 'archived',
];

const AGENT_ACTIVE: Record<string, string> = {
  'claude-code': 'border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-500/70 dark:bg-orange-950/60 dark:text-orange-300',
  'gemini-cli': 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500/70 dark:bg-blue-950/60 dark:text-blue-300',
  codex: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500/70 dark:bg-emerald-950/60 dark:text-emerald-300',
  cursor: 'border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-500/70 dark:bg-violet-950/60 dark:text-violet-300',
  'github-copilot': 'border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-500/70 dark:bg-sky-950/60 dark:text-sky-300',
  windsurf: 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-500/70 dark:bg-cyan-950/60 dark:text-cyan-300',
  cline: 'border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-500/70 dark:bg-amber-950/60 dark:text-amber-300',
  opencode: 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-500/70 dark:bg-teal-950/60 dark:text-teal-300',
  kiro: 'border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-500/70 dark:bg-rose-950/60 dark:text-rose-300',
  antigravity: 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500/70 dark:bg-indigo-950/60 dark:text-indigo-300',
  'roo-code': 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-500/70 dark:bg-fuchsia-950/60 dark:text-fuchsia-300',
  aider: 'border-lime-500 bg-lime-50 text-lime-700 dark:border-lime-500/70 dark:bg-lime-950/60 dark:text-lime-300',
};

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const c = searchParams.get('category');
    return c ? c.split(',').filter(Boolean) : [];
  });
  const [selectedStatuses, setSelectedStatuses] = useState<SkillStatus[]>(() => {
    const s = searchParams.get('status');
    return s ? (s.split(',').filter(Boolean) as SkillStatus[]) : [];
  });
  const [selectedSecurity, setSelectedSecurity] = useState<SecurityLevel[]>(() => {
    const sec = searchParams.get('security');
    return sec ? (sec.split(',').filter(Boolean) as SecurityLevel[]) : [];
  });
  const [selectedAgents, setSelectedAgents] = useState<string[]>(() => {
    const a = searchParams.get('agent');
    return a ? a.split(',').filter(Boolean) : [];
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const t = searchParams.get('tag');
    return t ? t.split(',').filter(Boolean) : [];
  });
  const [selectedSources, setSelectedSources] = useState<SourceType[]>([]);
  const [sort, setSort] = useState<SortOption>(() => (searchParams.get('sort') as SortOption) || 'quality');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(() => {
    const n = Number(searchParams.get('n'));
    return Number.isFinite(n) && n >= 36 ? n : 36;
  });

  // Persist current filters & loaded count into URL so Back navigation restores exact state
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    if (selectedCategories.length) next.set('category', selectedCategories.join(','));
    if (selectedStatuses.length) next.set('status', selectedStatuses.join(','));
    if (selectedSecurity.length) next.set('security', selectedSecurity.join(','));
    if (selectedAgents.length) next.set('agent', selectedAgents.join(','));
    if (selectedTags.length) next.set('tag', selectedTags.join(','));
    if (sort !== 'quality') next.set('sort', sort);
    if (visibleCount > 36) next.set('n', String(visibleCount));
    setSearchParams(next, { replace: true });
  }, [query, selectedCategories, selectedStatuses, selectedSecurity, selectedAgents, selectedTags, sort, visibleCount, setSearchParams]);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileFiltersOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileFiltersOpen]);

  // Save & restore scroll position when navigating to/from skill detail pages
  useEffect(() => {
    const savedY = sessionStorage.getItem('skillatlas-explore-scroll');
    if (savedY) {
      const y = Number(savedY);
      if (Number.isFinite(y) && y > 0) {
        requestAnimationFrame(() => window.scrollTo(0, y));
      }
    }
    const onScroll = () => {
      sessionStorage.setItem('skillatlas-explore-scroll', String(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const results = useMemo(
    () =>
      filterAndSortSkills(skills, {
        query,
        categories: selectedCategories,
        statuses: selectedStatuses,
        securityLevels: selectedSecurity,
        agents: selectedAgents,
        tags: selectedTags,
        sourceTypes: selectedSources,
        sort: query.trim() && sort === 'quality' ? 'relevance' : sort,
      }),
    [query, selectedCategories, selectedStatuses, selectedSecurity, selectedAgents, selectedTags, selectedSources, sort]
  );

  const activeFilterCount =
    selectedCategories.length +
    selectedStatuses.length +
    selectedSecurity.length +
    selectedAgents.length +
    selectedTags.length +
    selectedSources.length +
    (query.trim() ? 1 : 0);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSelectedSecurity([]);
    setSelectedAgents([]);
    setSelectedTags([]);
    setSelectedSources([]);
    setSort('quality');
    setVisibleCount(36);
    setSearchParams({});
  };

  const toggleItem = <T extends string>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    item: T
  ) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
    setVisibleCount(36);
  };

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Categories
        </h3>
        <div className="space-y-1">
          {categories
            .filter((c) => c.count > 0)
            .map((cat) => (
              <label
                key={cat.id}
                className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-[13px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/70"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleItem(selectedCategories, setSelectedCategories, cat.id)}
                    className="h-3.5 w-3.5 rounded border-zinc-300 accent-blue-600 dark:border-zinc-700"
                  />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-mono text-[11px] text-zinc-400">{cat.count}</span>
              </label>
            ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Quality
        </h3>
        <div className="space-y-1">
          {STATUS_ORDER.map((status) => {
            const count = skills.filter((s) => s.status === status).length;
            if (count === 0 && !selectedStatuses.includes(status)) return null;
            const meta = STATUS_META[status];
            return (
              <label
                key={status}
                className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-[13px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/70"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() => toggleItem(selectedStatuses, setSelectedStatuses, status)}
                    className="h-3.5 w-3.5 rounded border-zinc-300 accent-blue-600 dark:border-zinc-700"
                  />
                  <span>{meta.label}</span>
                </span>
                <span className="font-mono text-[11px] text-zinc-400">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Security review
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {(['verified', 'unverified', 'caution', 'risky'] as SecurityLevel[]).map((sec) => {
            const active = selectedSecurity.includes(sec);
            const meta = SECURITY_META[sec];
            return (
              <button
                key={sec}
                type="button"
                onClick={() => toggleItem(selectedSecurity, setSelectedSecurity, sec)}
                aria-pressed={active}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Compatible agents
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {allAgents.map((agent) => {
            const active = selectedAgents.includes(agent);
            const activeClass = AGENT_ACTIVE[agent] ?? 'border-blue-600 bg-blue-50 text-blue-700';
            const idleClass =
              'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200';
            return (
              <button
                key={agent}
                type="button"
                onClick={() => toggleItem(selectedAgents, setSelectedAgents, agent)}
                aria-pressed={active}
                className={`inline-flex items-center rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors ${
                  active ? activeClass : idleClass
                }`}
              >
                {agent}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Source type
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {allSourceTypes.map((st) => {
            const active = selectedSources.includes(st);
            return (
              <button
                key={st}
                type="button"
                onClick={() => toggleItem(selectedSources, setSelectedSources, st)}
                className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Tags
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 20).map((t) => {
            const active = selectedTags.includes(t.tag);
            return (
              <button
                key={t.tag}
                type="button"
                onClick={() => toggleItem(selectedTags, setSelectedTags, t.tag)}
                className={`rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors ${
                  active
                    ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500 dark:text-white'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                #{t.tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Browse Skills
          </h1>
          <p aria-live="polite" className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
            Showing <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{results.length.toLocaleString()}</span> of{' '}
            <span className="font-mono">{skills.length.toLocaleString()}</span> curated skills
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 lg:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-600 px-1.5 font-mono text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort skills"
              className="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-zinc-700 focus:border-blue-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="quality">Sort: Quality Score</option>
              <option value="stars">Sort: GitHub Stars</option>
              <option value="relevance">Sort: Relevance</option>
              <option value="reviewed">Sort: Last Reviewed</option>
              <option value="added">Sort: Recently Added</option>
              <option value="name">Sort: Name A–Z</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>

          <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-label="Grid view"
              className={`rounded-md p-1.5 transition-colors ${
                view === 'grid'
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-label="List view"
              className={`rounded-md p-1.5 transition-colors ${
                view === 'list'
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden min-w-0 lg:block">{FilterPanel}</aside>

        <div className="min-w-0 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(36);
              }}
              placeholder="Filter by name, URL, description, tag, or keyword..."
              aria-label="Filter skills"
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedCategories.map((catId) => (
                <button
                  key={`chip-cat-${catId}`}
                  type="button"
                  onClick={() => toggleItem(selectedCategories, setSelectedCategories, catId)}
                  className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                >
                  {categories.find((c) => c.id === catId)?.name || catId}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {selectedStatuses.map((st) => (
                <button
                  key={`chip-st-${st}`}
                  type="button"
                  onClick={() => toggleItem(selectedStatuses, setSelectedStatuses, st)}
                  className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                >
                  {STATUS_META[st]?.label || st}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {selectedAgents.map((ag) => (
                <button
                  key={`chip-ag-${ag}`}
                  type="button"
                  onClick={() => toggleItem(selectedAgents, setSelectedAgents, ag)}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  {ag}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {selectedTags.map((tg) => (
                <button
                  key={`chip-tg-${tg}`}
                  type="button"
                  onClick={() => toggleItem(selectedTags, setSelectedTags, tg)}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  #{tg}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {results.length > 0 ? (
            <>
              <div
                className={
                  view === 'grid'
                    ? 'grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3'
                    : 'flex min-w-0 flex-col gap-3'
                }
              >
                {results.slice(0, visibleCount).map((skill) => (
                  <SkillCard key={skill.id} skill={skill} view={view} highlightQuery={query} />
                ))}
              </div>
              {results.length > visibleCount && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + 36)}
                    className="surface-card rounded-xl px-6 py-2.5 text-[13px] font-semibold text-zinc-800 hover:border-blue-500 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400"
                  >
                    Show more ({(results.length - visibleCount).toLocaleString()} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="surface-card rounded-2xl p-10 text-center">
              <p className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                No matching skills found
              </p>
              <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                Try broadening your search or clearing active filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto border-l border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-[#12141a]">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
