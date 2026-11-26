import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  allAgents,
  allSourceTypes,
  categories,
  skills,
  tags,
} from '../lib/data';
import { STATUS_META } from '../lib/constants';
import { filterAndSortSkills, type SortOption } from '../lib/search';
import type { SkillStatus, SourceType } from '../types/skill';
import { SkillCard } from '../components/SkillCard';

const STATUS_ORDER: SkillStatus[] = [
  'excellent',
  'good',
  'promising',
  'experimental',
  'neutral',
  'needs-review',
  'bad',
  'risky',
  'archived',
];

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
  const [selectedAgents, setSelectedAgents] = useState<string[]>(() => {
    const a = searchParams.get('agent');
    return a ? a.split(',').filter(Boolean) : [];
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const t = searchParams.get('tag');
    return t ? t.split(',').filter(Boolean) : [];
  });
  const [selectedSources, setSelectedSources] = useState<SourceType[]>([]);
  const [sort, setSort] = useState<SortOption>(
    () => (searchParams.get('sort') as SortOption) || 'quality'
  );
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL query params if user navigates via header search or tag links
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    const urlTag = searchParams.get('tag');
    const urlStatus = searchParams.get('status');
    const urlCat = searchParams.get('category');
    const urlSort = searchParams.get('sort') as SortOption | null;

    setQuery(urlQ);
    if (urlTag) setSelectedTags(urlTag.split(',').filter(Boolean));
    if (urlStatus) setSelectedStatuses(urlStatus.split(',').filter(Boolean) as SkillStatus[]);
    if (urlCat) setSelectedCategories(urlCat.split(',').filter(Boolean));
    if (urlSort) setSort(urlSort);
  }, [searchParams]);

  const results = useMemo(
    () =>
      filterAndSortSkills(skills, {
        query,
        categories: selectedCategories,
        statuses: selectedStatuses,
        agents: selectedAgents,
        tags: selectedTags,
        sourceTypes: selectedSources,
        sort: query.trim() && sort === 'quality' ? 'relevance' : sort,
      }),
    [
      query,
      selectedCategories,
      selectedStatuses,
      selectedAgents,
      selectedTags,
      selectedSources,
      sort,
    ]
  );

  const activeFilterCount =
    selectedCategories.length +
    selectedStatuses.length +
    selectedAgents.length +
    selectedTags.length +
    selectedSources.length +
    (query.trim() ? 1 : 0);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSelectedAgents([]);
    setSelectedTags([]);
    setSelectedSources([]);
    setSort('quality');
    setSearchParams({});
  };

  const toggleItem = <T extends string>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    item: T
  ) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const FilterPanel = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Categories
        </h3>
        <div className="space-y-1.5">
          {categories
            .filter((c) => c.count > 0)
            .map((cat) => (
              <label
                key={cat.id}
                className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() =>
                      toggleItem(selectedCategories, setSelectedCategories, cat.id)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-mono text-xs text-slate-400">{cat.count}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Classification */}
      <div>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Classification
        </h3>
        <div className="space-y-1.5">
          {STATUS_ORDER.map((status) => {
            const count = skills.filter((s) => s.status === status).length;
            if (count === 0 && !selectedStatuses.includes(status)) return null;
            const meta = STATUS_META[status];
            return (
              <label
                key={status}
                className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() =>
                      toggleItem(selectedStatuses, setSelectedStatuses, status)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                  <span>{meta.label}</span>
                </span>
                <span className="font-mono text-xs text-slate-400">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Compatible Agents */}
      <div>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Compatible Agents
        </h3>
        <div className="space-y-1.5">
          {allAgents.map((agent) => (
            <label
              key={agent}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
            >
              <input
                type="checkbox"
                checked={selectedAgents.includes(agent)}
                onChange={() => toggleItem(selectedAgents, setSelectedAgents, agent)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="font-mono text-xs">{agent}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Source Type */}
      <div>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Source Type
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {allSourceTypes.map((st) => {
            const active = selectedSources.includes(st);
            return (
              <button
                key={st}
                type="button"
                onClick={() => toggleItem(selectedSources, setSelectedSources, st)}
                className={`rounded-md border px-2 py-1 font-mono text-xs transition-colors ${
                  active
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Tags
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 18).map((t) => {
            const active = selectedTags.includes(t.tag);
            return (
              <button
                key={t.tag}
                type="button"
                onClick={() => toggleItem(selectedTags, setSelectedTags, t.tag)}
                className={`rounded px-2 py-0.5 font-mono text-[11px] transition-colors ${
                  active
                    ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
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
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Explore Skills
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-mono font-semibold">{results.length}</span> of{' '}
            <span className="font-mono">{skills.length}</span> curated skills.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-teal-600 px-1.5 py-0.2 font-mono text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort skills"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="quality">Sort: Quality Score</option>
            <option value="relevance">Sort: Relevance</option>
            <option value="reviewed">Sort: Last Reviewed</option>
            <option value="added">Sort: Recently Added</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>

          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-label="Grid view"
              className={`rounded-md p-1.5 ${
                view === 'grid'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-label="List view"
              className={`rounded-md p-1.5 ${
                view === 'list'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">{FilterPanel}</aside>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, description, tag, keyword, or notes..."
              aria-label="Filter skills"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {results.length > 0 ? (
            <div
              className={
                view === 'grid'
                  ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
                  : 'flex flex-col gap-3'
              }
            >
              {results.map((skill) => (
                <SkillCard key={skill.id} skill={skill} view={view} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                No matching skills found
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try broadening your search terms or clearing active filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Filters
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
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
