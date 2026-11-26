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
        className={`animate-fade-up group min-w-0 flex flex-col gap-3 rounded-lg border border-zinc-200 border-l-4 ${statusMeta.borderAccentClass} bg-white p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-[#141417] dark:hover:border-zinc-600 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/skill/${skill.id}`}
              className="text-base font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
            >
              <RichText text={skill.name} highlightQuery={highlightQuery} />
            </Link>
            <StatusBadge status={skill.status} size="xs" />
            {skill.stars !== null && (
              <span
                title={`${skill.stars.toLocaleString()} GitHub stars`}
                className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <Star className="h-3 w-3 text-amber-500" />
                {formatStars(skill.stars)}
              </span>
            )}
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {skill.quality}/10
            </span>
          </div>

          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            <RichText text={skill.description} highlightQuery={highlightQuery} />
          </p>

          {skill.best_for.length > 0 && (
            <p className="flex items-start gap-1.5 text-xs text-zinc-700 dark:text-zinc-300">
              <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Best for:</span>
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
            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Source
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Link
            to={`/skill/${skill.id}`}
            className="inline-flex items-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-500 dark:hover:text-white"
          >
            Inspect
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`animate-fade-up group min-w-0 flex h-full flex-col justify-between rounded-lg border border-zinc-200 border-l-4 ${statusMeta.borderAccentClass} bg-white p-4 transition-all duration-150 hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:bg-[#141417] dark:hover:border-zinc-600`}
    >
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/skill/${skill.id}`}
              className="block truncate text-base font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
            >
              <RichText text={skill.name} highlightQuery={highlightQuery} />
            </Link>
            <p className="mt-0.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              @{skill.author}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {skill.stars !== null && (
              <span
                title={`${skill.stars.toLocaleString()} GitHub stars`}
                className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <Star className="h-3 w-3 text-amber-500" />
                {formatStars(skill.stars)}
              </span>
            )}
            <span
              title="Evaluation quality score"
              className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {skill.quality}/10
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={skill.status} size="xs" />
          {primaryCat && (
            <Link
              to={`/category/${primaryCat.id}`}
              className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <CategoryIcon name={primaryCat.icon} className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
              {primaryCat.name}
            </Link>
          )}
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          <RichText text={skill.description} highlightQuery={highlightQuery} />
        </p>

        {skill.best_for.length > 0 && (
          <div className="mt-3 rounded-md border border-zinc-200/80 bg-zinc-50 px-2.5 py-1.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/80">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Best for:{' '}
            </span>
            <span className="text-zinc-600 dark:text-zinc-300">
              <RichText text={skill.best_for[0]} highlightQuery={highlightQuery} />
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              to={`/explore?tag=${encodeURIComponent(tag)}`}
              className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              #<RichText text={tag} highlightQuery={highlightQuery} />
            </Link>
          ))}
          {skill.tags.length > 3 && (
            <span className="px-1 py-0.5 font-mono text-[11px] text-zinc-400">
              +{skill.tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            {skill.compatible_agents.slice(0, 2).join(', ')}
            {skill.compatible_agents.length > 2
              ? ` +${skill.compatible_agents.length - 2}`
              : ''}
          </span>
          <div className="flex shrink-0 items-center gap-2.5">
            <a
              href={skill.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              GitHub
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <Link
              to={`/skill/${skill.id}`}
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Details →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
