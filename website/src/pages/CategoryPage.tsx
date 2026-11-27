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
      <div className="glass rounded-3xl p-10 text-center">
        <h1 className="text-xl font-bold text-white">Category not found</h1>
        <Link
          to="/explore"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Link to="/" className="hover:text-amber-400 transition-colors">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-white/80">{category.name}</span>
      </div>

      <section className="glass rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <CategoryIcon name={category.icon} className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{category.name}</h1>
              <p className="mt-1 max-w-2xl text-sm text-white/50">{category.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {category.subcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setQuery(sub)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/50 transition-colors hover:border-amber-500/40 hover:text-amber-400"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1 font-mono text-xs font-semibold text-white/70">
            {matchingSkills.length} skill(s)
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search within ${category.name}...`}
              className="w-full rounded-2xl border border-white/[0.1] bg-white/[0.05] py-2.5 pl-10 pr-4 text-sm text-white/80 placeholder:text-white/25 focus:border-amber-500/40 focus:bg-white/[0.08] focus:outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort category skills"
            className="rounded-2xl border border-white/[0.1] bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-white/70 focus:border-amber-500/40 focus:outline-none"
          >
            <option value="quality">Sort: Quality Score</option>
            <option value="stars">Sort: GitHub Stars</option>
            <option value="reviewed">Sort: Last Reviewed</option>
            <option value="added">Sort: Recently Added</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </section>

      {matchingSkills.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {matchingSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-sm font-medium text-white/50">
            No skills in this category match your filter yet.
          </p>
        </div>
      )}
    </div>
  );
}
