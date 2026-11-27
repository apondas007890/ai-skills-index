import type { SecurityLevel, SkillStatus } from '../types/skill';

export const REPO_GITHUB_URL = 'https://github.com/apondas007890/ai-skills-index';

export const STATUS_META: Record<
  SkillStatus,
  {
    label: string;
    shortLabel: string;
    description: string;
    badgeClass: string;
    dotClass: string;
    borderAccentClass: string;
  }
> = {
  excellent: {
    label: 'Excellent',
    shortLabel: 'Excellent',
    description: 'Exceptionally useful, high-quality, and worth prioritizing.',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    borderAccentClass: 'border-t-emerald-500',
  },
  good: {
    label: 'Good',
    shortLabel: 'Good',
    description: 'Useful, practical, reasonably reliable, and worth keeping.',
    badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    dotClass: 'bg-teal-400',
    borderAccentClass: 'border-t-teal-500',
  },
  promising: {
    label: 'Promising',
    shortLabel: 'Promising',
    description: 'Interesting potential, but not yet sufficiently tested or mature.',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-400',
    borderAccentClass: 'border-t-amber-500',
  },
  experimental: {
    label: 'Experimental',
    shortLabel: 'Experimental',
    description: 'Unusual, innovative, early-stage, or useful for experimentation.',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    dotClass: 'bg-sky-400',
    borderAccentClass: 'border-t-sky-500',
  },
  neutral: {
    label: 'Neutral',
    shortLabel: 'Neutral',
    description: 'Usefulness depends heavily on the specific use case.',
    badgeClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
    dotClass: 'bg-zinc-400',
    borderAccentClass: 'border-t-zinc-500',
  },
  'needs-review': {
    label: 'Needs Review',
    shortLabel: 'Needs Review',
    description: 'Insufficient evidence, incomplete docs, or questionable claims.',
    badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    dotClass: 'bg-orange-400',
    borderAccentClass: 'border-t-orange-500',
  },
  bad: {
    label: 'Bad',
    shortLabel: 'Bad',
    description: 'Low-quality, broken, redundant, or not useful.',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    borderAccentClass: 'border-t-rose-500',
  },
  risky: {
    label: 'Risky',
    shortLabel: 'Risky',
    description: 'Security concerns, suspicious instructions, or dangerous permissions.',
    badgeClass: 'bg-red-500/15 text-red-400 border-red-500/40',
    dotClass: 'bg-red-400',
    borderAccentClass: 'border-t-red-500',
  },
  archived: {
    label: 'Archived',
    shortLabel: 'Archived',
    description: 'Outdated, abandoned, or retained for historical reference.',
    badgeClass: 'bg-zinc-500/8 text-zinc-500 border-zinc-500/20',
    dotClass: 'bg-zinc-500',
    borderAccentClass: 'border-t-zinc-600',
  },
};

export const SECURITY_META: Record<
  SecurityLevel,
  { label: string; badgeClass: string }
> = {
  verified: {
    label: 'Verified Safe',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  unverified: {
    label: 'Unverified',
    badgeClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
  },
  caution: {
    label: 'Caution',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  risky: {
    label: 'Risky',
    badgeClass: 'bg-red-500/15 text-red-400 border-red-500/40',
  },
};
