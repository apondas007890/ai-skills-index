import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { allAgents, allSourceTypes, categories, skills, tags } from '../lib/data';
import { STATUS_META } from '../lib/constants';
import { filterAndSortSkills, type SortOption } from '../lib/search';
import type { SkillStatus, SourceType } from '../types/skill';
import { SkillCard } from '../components/SkillCard';

const STATUS_ORDER: SkillStatus[] = [
  'excellent', 'good', 'promising', 'experimental', 'neutral', 'needs-review', 'bad', 'risky', 'archived',
];

const AGENT_DOT: Record<string, string> = {
  'claude-code': 'bg-orange-400', 'cline': 'bg-yellow-400', 'codex': 'bg-green-400',
  'cursor': 'bg-purple-400', 'gemini-cli': 'bg-blue-400', 'kiro': 'bg-red-400',
  'opencode': 'bg-teal-400', 'windsurf': 'bg-cyan-400',
};
const AGENT_ACTIVE: Record<string, string> = {
  'claude-code': 'border-orange-500/60 bg-orange-500/15 text-orange-400',
  'cline':       'border-yellow-500/60 bg-yellow-500/15 text-yellow-400',
  'codex':       'border-green-500/60 bg-green-500/15 text-green-400',
  'cursor':      'border-purple-500/60 bg-purple-500/15 text-purple-400',
  'gemini-cli':  'border-blue-500/60 bg-blue-500/15 text-blue-400',
  'kiro':        'border-red-500/60 bg-red-500/15 text-red-400',
  'opencode':    'border-teal-500/60 bg-teal-500/15 text-teal-400',
  'windsurf':    'border-cyan-500/60 bg-cyan-500/15 text-cyan-400',
};

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery]                     = useState(() => searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => { const c = searchParams.get('category'); return c ? c.split(',').filter(Boolean) : []; });
  const [selectedStatuses, setSelectedStatuses]     = useState<SkillStatus[]>(() => { const s = searchParams.get('status'); return s ? (s.split(',').filter(Boolean) as SkillStatus[]) : []; });
  const [selectedAgents, setSelectedAgents]         = useState<string[]>(() => { const a = searchParams.get('agent'); return a ? a.split(',').filter(Boolean) : []; });
  const [selectedTags, setSelectedTags]             = useState<string[]>(() => { const t = searchParams.get('tag'); return t ? t.split(',').filter(Boolean) : []; });
  const [selectedSources, setSelectedSources]       = useState<SourceType[]>([]);
  const [sort, setSort]   = useState<SortOption>(() => (searchParams.get('sort') as SortOption) || 'quality');
  const [view, setView]   = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    const urlTag = searchParams.get('tag');
    const urlStatus = searchParams.get('status');
    const urlCat = searchParams.get('category');
    const urlSort = searchParams.get('sort') as SortOption | null;
    setQuery(urlQ);
    if (urlTag)    setSelectedTags(urlTag.split(',').filter(Boolean));
    if (urlStatus) setSelectedStatuses(urlStatus.split(',').filter(Boolean) as SkillStatus[]);
    if (urlCat)    setSelectedCategories(urlCat.split(',').filter(Boolean));
    if (urlSort)   setSort(urlSort);
  }, [searchParams]);

  const results = useMemo(
    () => filterAndSortSkills(skills, {
      query, categories: selectedCategories, statuses: selectedStatuses,
      agents: selectedAgents, tags: selectedTags, sourceTypes: selectedSources,
      sort: query.trim() && sort === 'quality' ? 'relevance' : sort,
    }),
    [query, selectedCategories, selectedStatuses, selectedAgents, selectedTags, selectedSources, sort]
  );

  const activeFilterCount =
    selectedCategories.length + selectedStatuses.length + selectedAgents.length +
    selectedTags.length + selectedSources.length + (query.trim() ? 1 : 0);

  const clearFilters = () => {
    setQuery(''); setSelectedCategories([]); setSelectedStatuses([]);
    setSelectedAgents([]); setSelectedTags([]); setSelectedSources([]);
    setSort('quality'); setSearchParams({});
  };

  const toggleItem = <T extends string>(list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  /* ── Sidebar panel ── */
  const FilterPanel = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">Categories</h3>
        <div className="space-y-1">
          {categories.filter((c) => c.count > 0).map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 text-[13px] text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white/90">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleItem(selectedCategories, setSelectedCategories, cat.id)}
                  className="h-3.5 w-3.5 rounded border-white/20 accent-amber-500"
                />
                <span className="truncate">{cat.name}</span>
              </span>
              <span className="font-mono text-[11px] text-white/25">{cat.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div>
        <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">Quality</h3>
        <div className="space-y-1">
          {STATUS_ORDER.map((status) => {
            const count = skills.filter((s) => s.status === status).length;
            if (count === 0 && !selectedStatuses.includes(status)) return null;
            const meta = STATUS_META[status];
            return (
              <label key={status} className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-1.5 text-[13px] text-white/60 hover:bg-white/[0.05] hover:text-white/90 transition-colors">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() => toggleItem(selectedStatuses, setSelectedStatuses, status)}
                    className="h-3.5 w-3.5 rounded border-white/20 accent-amber-500"
                  />
                  <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
                  <span>{meta.label}</span>
                </span>
                <span className="font-mono text-[11px] text-white/25">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Compatible Agents — colored pill toggles */}
      <div>
        <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">Compatible Agents</h3>
        <div className="flex flex-wrap gap-1.5">
          {allAgents.map((agent) => {
            const active = selectedAgents.includes(agent);
            const activeClass = AGENT_ACTIVE[agent] ?? 'border-white/30 bg-white/10 text-white';
            const idleClass = 'border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/70';
            return (
              <button
                key={agent}
                type="button"
                onClick={() => toggleItem(selectedAgents, setSelectedAgents, agent)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium transition-all ${active ? activeClass : idleClass}`}
              >
                <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${AGENT_DOT[agent] ?? 'bg-white/30'}`} />
                {agent}
              </button>
            );
          })}
        </div>
      </div>

      {/* Source Type */}
      <div>
        <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">Source Type</h3>
        <div className="flex flex-wrap gap-1.5">
          {allSourceTypes.map((st) => {
            const active = selectedSources.includes(st);
            return (
              <button
                key={st}
                type="button"
                onClick={() => toggleItem(selectedSources, setSelectedSources, st)}
                className={`rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all ${
                  active
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                    : 'border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/70'
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
        <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">Tags</h3>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 20).map((t) => {
            const active = selectedTags.includes(t.tag);
            return (
              <button
                key={t.tag}
                type="button"
                onClick={() => toggleItem(selectedTags, setSelectedTags, t.tag)}
                className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] transition-all ${
                  active
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                    : 'bg-white/[0.04] text-white/35 hover:bg-white/[0.08] hover:text-white/70 border border-transparent'
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
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Browse Skills</h1>
          <p className="mt-1 text-[13px] text-white/40">
            Showing <span className="font-mono font-semibold text-white">{results.length}</span> of{' '}
            <span className="font-mono text-white/60">{skills.length}</span> curated skills
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-[12px] font-medium text-white/60 lg:hidden hover:border-white/20 hover:text-white transition-all"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-amber-500/20 px-1.5 font-mono text-[10px] text-amber-400">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort skills"
            className="rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-[12px] font-medium text-white/60 focus:border-amber-500/40 focus:outline-none backdrop-blur-sm"
          >
            <option value="quality">Sort: Quality Score</option>
            <option value="stars">Sort: GitHub Stars</option>
            <option value="relevance">Sort: Relevance</option>
            <option value="reviewed">Sort: Last Reviewed</option>
            <option value="added">Sort: Recently Added</option>
            <option value="name">Sort: Name A–Z</option>
          </select>

          <div className="inline-flex rounded-xl border border-white/[0.1] bg-white/[0.04] p-0.5">
            <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`rounded-lg p-1.5 transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/70'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setView('list')} aria-label="List view" className={`rounded-lg p-1.5 transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/70'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-xl border border-white/[0.1] px-2.5 py-2 text-[12px] font-medium text-white/40 hover:border-white/20 hover:text-white/80 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[240px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden min-w-0 lg:block">{FilterPanel}</aside>

        {/* Main content */}
        <div className="min-w-0 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, description, tag, or keyword..."
              aria-label="Filter skills"
              className="w-full rounded-2xl border border-white/[0.1] bg-white/[0.05] py-2.5 pl-10 pr-4 text-[13px] text-white/80 placeholder:text-white/25 backdrop-blur-sm focus:border-amber-500/40 focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-amber-500/15 transition-all"
            />
          </div>

          {results.length > 0 ? (
            <div className={view === 'grid' ? 'grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3 stagger' : 'flex min-w-0 flex-col gap-3'}>
              {results.map((skill) => (
                <SkillCard key={skill.id} skill={skill} view={view} highlightQuery={query} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl p-10 text-center">
              <p className="text-[15px] font-semibold text-white/80">No matching skills found</p>
              <p className="mt-1 text-[13px] text-white/40">Try broadening your search or clearing filters.</p>
              <button type="button" onClick={clearFilters} className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[12px] font-semibold text-amber-400 hover:bg-amber-500/20 transition-all">
                <RotateCcw className="h-3.5 w-3.5" /> Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto border-l border-white/[0.08] bg-[#0d0d1a] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-[14px] font-semibold text-white/80">Filters</span>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close" className="rounded-lg p-1 text-white/40 hover:bg-white/[0.08] hover:text-white transition-colors">
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
