import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { getCategoryById, skills } from '../lib/data';
import { filterAndSortSkills, type SortOption } from '../lib/search';
import { CategoryIcon } from '../components/CategoryIcon';
import { SkillCard } from '../components/SkillCard';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? getCategoryById(categoryId) : undefined;
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('quality');

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
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Category not found
        </h1>
        <Link
          to="/explore"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-teal-600 dark:hover:text-teal-400">
          Library
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-slate-200">{category.name}</span>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              <CategoryIcon name={category.icon} className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                {category.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {category.subcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setQuery(sub)}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 hover:border-teal-500/40 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {matchingSkills.length} skill(s)
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search within ${category.name}...`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort category skills"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="quality">Sort: Quality Score</option>
            <option value="reviewed">Sort: Last Reviewed</option>
            <option value="added">Sort: Recently Added</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </section>

      {matchingSkills.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matchingSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            No skills in this category match your filter yet.
          </p>
        </div>
      )}
    </div>
  );
}
