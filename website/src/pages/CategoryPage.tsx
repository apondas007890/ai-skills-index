import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Search } from 'lucide-react';
import { getCategoryById, skills } from '../lib/data';
import { filterAndSortSkills, type SortOption } from '../lib/search';
import { CategoryIcon } from '../components/CategoryIcon';
import { SkillCard } from '../components/SkillCard';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? getCategoryById(categoryId) : undefined;
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('quality');
  const [visibleCount, setVisibleCount] = useState(36);

  const matchingSkills = useMemo(() => {
    if (!category) return [];
    return filterAndSortSkills(skills, {
      query,
      categories: [category.id],
      sort,
    });
  }, [category, query, sort]);

  if (!category) {
    return (
      <div className="surface-card rounded-2xl p-10 text-center">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Category not found</h1>
        <Link
          to="/explore"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link to="/" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
          Catalog
        </Link>
        <span>/</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-200">{category.name}</span>
      </div>

      <section className="surface-card rounded-2xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800/60 dark:bg-blue-950/50 dark:text-blue-400">
              <CategoryIcon name={category.icon} className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {category.name}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
                {category.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {category.subcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setQuery(sub)}
                    className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <span className="surface-subtle shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {matchingSkills.length} skill(s)
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(36);
              }}
              placeholder={`Search within ${category.name}...`}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort category skills"
              className="appearance-none rounded-xl border border-zinc-200 bg-white py-2.5 pl-3.5 pr-9 text-xs font-medium text-zinc-700 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="quality">Sort: Quality Score</option>
              <option value="stars">Sort: GitHub Stars</option>
              <option value="reviewed">Sort: Last Reviewed</option>
              <option value="added">Sort: Recently Added</option>
              <option value="name">Sort: Name</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>
      </section>

      {matchingSkills.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchingSkills.slice(0, visibleCount).map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
          {matchingSkills.length > visibleCount && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 36)}
                className="surface-card rounded-xl px-6 py-2.5 text-[13px] font-semibold text-zinc-800 hover:border-blue-500 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400"
              >
                Show more ({(matchingSkills.length - visibleCount).toLocaleString()} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="surface-card rounded-2xl p-10 text-center">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            No skills in this category match your filter yet.
          </p>
        </div>
      )}
    </div>
  );
}
