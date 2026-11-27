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

/** Agent color dot map */
const AGENT_COLORS: Record<string, string> = {
  'claude-code': 'bg-orange-400',
  'cline':       'bg-yellow-400',
  'codex':       'bg-green-400',
  'cursor':      'bg-purple-400',
  'gemini-cli':  'bg-blue-400',
  'kiro':        'bg-red-400',
  'opencode':    'bg-teal-400',
  'windsurf':    'bg-cyan-400',
};

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

  /* ── List view ── */
  if (view === 'list') {
    return (
      <article className={`animate-fade-up card-lift glass group min-w-0 flex flex-col gap-3 rounded-2xl border-l-2 ${statusMeta.borderAccentClass} p-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/skill/${skill.id}`}
              className="text-base font-semibold text-white/90 transition-colors group-hover:text-amber-400"
            >
              <RichText text={skill.name} highlightQuery={highlightQuery} />
            </Link>
            <StatusBadge status={skill.status} size="xs" />
            {skill.stars !== null && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-400">
                <Star className="h-3 w-3" />
                {formatStars(skill.stars)}
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/50">
              {skill.quality}/10
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-white/50">
            <RichText text={skill.description} highlightQuery={highlightQuery} />
          </p>
          {skill.best_for.length > 0 && (
            <p className="flex items-start gap-1.5 text-xs text-white/50">
              <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              <span className="font-semibold text-white/70">Best for:</span>
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
            className="inline-flex items-center gap-1 rounded-xl border border-white/[0.1] px-3 py-1.5 text-[11px] font-medium text-white/50 transition-colors hover:border-white/20 hover:text-white"
          >
            Source <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Link
            to={`/skill/${skill.id}`}
            className="inline-flex items-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-400 transition-all hover:bg-amber-500/20"
          >
            Inspect
          </Link>
        </div>
      </article>
    );
  }

  /* ── Grid view ── */
  return (
    <article
      className={`animate-fade-up card-lift glass group min-w-0 flex h-full flex-col justify-between rounded-2xl border-t-2 ${statusMeta.borderAccentClass} overflow-hidden`}
    >
      {/* Top content */}
      <div className="min-w-0 p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/skill/${skill.id}`}
              className="block truncate text-[15px] font-semibold tracking-tight text-white/90 transition-colors group-hover:text-amber-400"
            >
              <RichText text={skill.name} highlightQuery={highlightQuery} />
            </Link>
            <p className="mt-0.5 font-mono text-[11px] text-white/30">@{skill.author}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {skill.stars !== null && (
              <span
                title={`${skill.stars.toLocaleString()} GitHub stars`}
                className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-2 py-0.5 font-mono text-[11px] text-amber-400"
              >
                <Star className="h-3 w-3" />
                {formatStars(skill.stars)}
              </span>
            )}
            <span
              title="Quality score"
              className="rounded-full border border-white/[0.1] bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] text-white/50"
            >
              {skill.quality}/10
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={skill.status} size="xs" />
          {primaryCat && (
            <Link
              to={`/category/${primaryCat.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/50 transition-colors hover:border-white/20 hover:text-white/80"
            >
              <CategoryIcon name={primaryCat.icon} className="h-3 w-3" />
              {primaryCat.name}
            </Link>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 text-[13px] leading-relaxed text-white/50 line-clamp-3">
          <RichText text={skill.description} highlightQuery={highlightQuery} />
        </p>

        {/* Best for callout */}
        {skill.best_for.length > 0 && (
          <div className="mt-3 flex items-start gap-1.5 rounded-xl border border-amber-500/[0.12] bg-amber-500/[0.06] px-2.5 py-2 text-[12px]">
            <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            <div>
              <span className="font-semibold text-amber-400/80">Best for: </span>
              <span className="text-white/50">
                <RichText text={skill.best_for[0]} highlightQuery={highlightQuery} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] p-4 pt-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              to={`/explore?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] text-white/35 transition-colors hover:bg-white/[0.1] hover:text-white/70"
            >
              #<RichText text={tag} highlightQuery={highlightQuery} />
            </Link>
          ))}
          {skill.tags.length > 3 && (
            <span className="px-1 py-0.5 font-mono text-[11px] text-white/25">
              +{skill.tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          {/* Agent dots */}
          <div className="flex items-center gap-1">
            {skill.compatible_agents.slice(0, 4).map((agent) => (
              <span
                key={agent}
                title={agent}
                className={`h-2 w-2 rounded-full ${AGENT_COLORS[agent] ?? 'bg-white/20'}`}
              />
            ))}
            {skill.compatible_agents.length > 4 && (
              <span className="font-mono text-[10px] text-white/25">
                +{skill.compatible_agents.length - 4}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3 text-[12px]">
            <a
              href={skill.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-white/35 transition-colors hover:text-white/70"
            >
              GitHub <ArrowUpRight className="h-3 w-3" />
            </a>
            <Link
              to={`/skill/${skill.id}`}
              className="font-semibold text-amber-400/80 transition-colors hover:text-amber-400"
            >
              Details →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
