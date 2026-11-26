import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, Zap } from 'lucide-react';
import type { Skill } from '../types/skill';
import { STATUS_META } from '../lib/constants';
import { getCategoryById } from '../lib/data';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { RichText } from './RichText';

export function formatStars(stars: number | null): string {
  if (stars === null || stars === undefined) return '';
  if (stars >= 1000) return `${(stars / 1000).toFixed(stars >= 10000 ? 0 : 1)}k`;
  return String(stars);
}

export function SkillCard({
  skill,
  view = 'grid',
  highlightQuery = '',
}: {
  skill: Skill;
  view?: 'grid' | 'list';
  highlightQuery?: string;
}) {
  const primaryCat = getCategoryById(skill.primary_category);
  const statusMeta = STATUS_META[skill.status] || STATUS_META['needs-review'];

  if (view === 'list') {
    return (
      <article
        className={`group min-w-0 flex flex-col gap-3 rounded-2xl border border-slate-200/90 border-l-4 ${statusMeta.borderAccentClass} bg-white p-4 shadow-xs transition-all hover:border-teal-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/75 dark:hover:border-teal-400/40 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/skill/${skill.id}`}
              className="text-base font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400"
            >
              <RichText text={skill.name} highlightQuery={highlightQuery} />
            </Link>
            <StatusBadge status={skill.status} size="xs" />
            {skill.stars !== null && (
              <span
                title={`${skill.stars.toLocaleString()} GitHub stars`}
                className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-300"
              >
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {formatStars(skill.stars)}
              </span>
            )}
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {skill.quality}/10
            </span>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <RichText text={skill.description} highlightQuery={highlightQuery} />
          </p>

          {skill.best_for.length > 0 && (
            <p className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-500" />
              <span className="font-semibold text-teal-700 dark:text-teal-300">Best for:</span>
              <span className="truncate">
                <RichText text={skill.best_for[0]} highlightQuery={highlightQuery} />
              </span>
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          <a
            href={skill.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Source
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Link
            to={`/skill/${skill.id}`}
            className="inline-flex items-center rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
          >
            Inspect
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`animate-fade-up group min-w-0 flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 border-l-4 ${statusMeta.borderAccentClass} bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 dark:border-slate-800 dark:bg-slate-900/75 dark:hover:border-teal-400/40`}
    >
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/skill/${skill.id}`}
              className="block truncate text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400"
            >
              <RichText text={skill.name} highlightQuery={highlightQuery} />
            </Link>
            <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              @{skill.author}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {skill.stars !== null && (
              <span
                title={`${skill.stars.toLocaleString()} GitHub stars`}
                className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-300"
              >
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {formatStars(skill.stars)}
              </span>
            )}
            <span
              title="Evaluation quality score"
              className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {skill.quality}/10
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={skill.status} size="xs" />
          {primaryCat && (
            <Link
              to={`/category/${primaryCat.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 transition-colors hover:border-teal-500/40 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-teal-300"
            >
              <CategoryIcon name={primaryCat.icon} className="h-3 w-3 text-teal-600 dark:text-teal-400" />
              {primaryCat.name}
            </Link>
          )}
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
          <RichText text={skill.description} highlightQuery={highlightQuery} />
        </p>

        {skill.best_for.length > 0 && (
          <div className="mt-3 rounded-xl border border-teal-500/20 bg-teal-500/5 px-3 py-2 text-xs dark:border-teal-400/15 dark:bg-teal-400/5">
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              Best for:{' '}
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              <RichText text={skill.best_for[0]} highlightQuery={highlightQuery} />
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              to={`/explore?tag=${encodeURIComponent(tag)}`}
              className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600 transition-colors hover:bg-teal-500/10 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-teal-300"
            >
              #<RichText text={tag} highlightQuery={highlightQuery} />
            </Link>
          ))}
          {skill.tags.length > 3 && (
            <span className="px-1 py-0.5 font-mono text-[11px] text-slate-400">
              +{skill.tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <span className="truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
            {skill.compatible_agents.slice(0, 2).join(', ')}
            {skill.compatible_agents.length > 2
              ? ` +${skill.compatible_agents.length - 2}`
              : ''}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={skill.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
            >
              GitHub
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <Link
              to={`/skill/${skill.id}`}
              className="font-semibold text-teal-600 hover:underline dark:text-teal-400"
            >
              Details →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
