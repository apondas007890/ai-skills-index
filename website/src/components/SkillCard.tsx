import { Link } from 'react-router-dom';
import { ArrowUpRight, Star } from 'lucide-react';
import type { Skill } from '../types/skill';
import { getCategoryById } from '../lib/data';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';

export function SkillCard({
  skill,
  view = 'grid',
}: {
  skill: Skill;
  view?: 'grid' | 'list';
}) {
  const primaryCat = getCategoryById(skill.primary_category);

  if (view === 'list') {
    return (
      <article className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal-500/50 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-teal-400/40 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/skill/${skill.id}`}
              className="text-base font-semibold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-400"
            >
              {skill.name}
            </Link>
            <StatusBadge status={skill.status} size="xs" />
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Star className="h-3 w-3 text-amber-500" />
              {skill.quality}/10
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {skill.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {primaryCat && (
              <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <CategoryIcon name={primaryCat.icon} className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                {primaryCat.name}
              </span>
            )}
            <span aria-hidden="true">·</span>
            <span className="font-mono">@{skill.author}</span>
            <div className="flex flex-wrap gap-1">
              {skill.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          <a
            href={skill.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Source
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Link
            to={`/skill/${skill.id}`}
            className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-teal-400"
          >
            Inspect
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-teal-500/50 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-teal-400/40">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/skill/${skill.id}`}
              className="block truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-400"
            >
              {skill.name}
            </Link>
            <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">
              by {skill.author}
            </p>
          </div>
          <span
            title="Quality score"
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Star className="h-3 w-3 text-amber-500" />
            {skill.quality}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={skill.status} size="xs" />
          {primaryCat && (
            <Link
              to={`/category/${primaryCat.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 transition-colors hover:border-teal-500/40 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-teal-300"
            >
              <CategoryIcon name={primaryCat.icon} className="h-3 w-3" />
              {primaryCat.name}
            </Link>
          )}
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {skill.description}
        </p>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              to={`/explore?tag=${encodeURIComponent(tag)}`}
              className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-teal-950/60 dark:hover:text-teal-300"
            >
              #{tag}
            </Link>
          ))}
          {skill.tags.length > 3 && (
            <span className="px-1 py-0.5 font-mono text-[11px] text-slate-400">
              +{skill.tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="truncate font-mono text-[11px]">
            {skill.compatible_agents.slice(0, 2).join(', ')}
            {skill.compatible_agents.length > 2
              ? ` +${skill.compatible_agents.length - 2}`
              : ''}
          </span>
          <a
            href={skill.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 font-medium text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
          >
            Source
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
