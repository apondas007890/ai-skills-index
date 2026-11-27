import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Star } from 'lucide-react';
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
        className={`animate-fade-up surface-card group min-w-0 flex flex-col gap-3 rounded-xl border-t-2 ${statusMeta.borderAccentClass} p-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/skill/${skill.id}`}
              className="text-[15px] font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400"
            >
              <RichText text={skill.name} highlightQuery={highlightQuery} />
            </Link>
            <StatusBadge status={skill.status} size="xs" />
            {skill.stars !== null && (
              <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Star className="h-3 w-3 text-amber-500" />
                {formatStars(skill.stars)}
              </span>
            )}
            <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {skill.quality}/10
            </span>
          </div>

          <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            <RichText text={skill.description} highlightQuery={highlightQuery} />
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          <a
            href={skill.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            GitHub
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Link
            to={`/skill/${skill.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-blue-500 dark:hover:text-white"
          >
            Details
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`animate-fade-up surface-card group min-w-0 flex h-full flex-col justify-between rounded-xl border-t-2 ${statusMeta.borderAccentClass} overflow-hidden`}
    >
      <div className="min-w-0 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/skill/${skill.id}`}
              className="block truncate text-[15px] font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400"
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
                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <Star className="h-3 w-3 text-amber-500" />
                {formatStars(skill.stars)}
              </span>
            )}
            <span
              title="Evaluation quality score"
              className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {skill.quality}/10
            </span>
            <a
              href={skill.source}
              target="_blank"
              rel="noopener noreferrer"
              title="Open GitHub repository"
              aria-label={`Open ${skill.name} on GitHub`}
              className="inline-flex items-center gap-0.5 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              Git
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={skill.status} size="xs" />
          {primaryCat && (
            <Link
              to={`/category/${primaryCat.id}`}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white"
            >
              <CategoryIcon name={primaryCat.icon} className="h-3 w-3" />
              {primaryCat.name}
            </Link>
          )}
        </div>

        <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          <RichText text={skill.description} highlightQuery={highlightQuery} />
        </p>
      </div>

      <div className="border-t border-zinc-100 px-4 py-3 dark:border-zinc-800/80">
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              to={`/explore?tag=${encodeURIComponent(tag)}`}
              className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            >
              #{tag}
            </Link>
          ))}
          {skill.tags.length > 3 && (
            <span className="px-1 py-0.5 font-mono text-[11px] text-zinc-400">
              +{skill.tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              {skill.compatible_agents.slice(0, 2).join(', ')}
              {skill.compatible_agents.length > 2
                ? ` +${skill.compatible_agents.length - 2}`
                : ''}
            </span>
            {skill.license && skill.license !== 'Unknown' && (
              <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {skill.license}
              </span>
            )}
          </div>

          <Link
            to={`/skill/${skill.id}`}
            className="inline-flex shrink-0 items-center gap-0.5 text-[12px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Details
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
