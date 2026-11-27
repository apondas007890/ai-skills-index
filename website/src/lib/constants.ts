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
    badgeClass:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/70',
    dotClass: 'bg-emerald-500',
    borderAccentClass: 'border-t-emerald-500',
  },
  good: {
    label: 'Good',
    shortLabel: 'Good',
    description: 'Useful, practical, reasonably reliable, and worth keeping.',
    badgeClass:
      'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/70',
    dotClass: 'bg-teal-500',
    borderAccentClass: 'border-t-teal-500',
  },
  promising: {
    label: 'Promising',
    shortLabel: 'Promising',
    description: 'Interesting potential, but not yet sufficiently tested or mature.',
    badgeClass:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/70',
    dotClass: 'bg-amber-500',
    borderAccentClass: 'border-t-amber-500',
  },
  experimental: {
    label: 'Experimental',
    shortLabel: 'Experimental',
    description: 'Unusual, innovative, early-stage, or useful for experimentation.',
    badgeClass:
      'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/70',
    dotClass: 'bg-sky-500',
    borderAccentClass: 'border-t-sky-500',
  },
  neutral: {
    label: 'Neutral',
    shortLabel: 'Neutral',
    description: 'Usefulness depends heavily on the specific use case.',
    badgeClass:
      'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/70 dark:text-zinc-300 dark:border-zinc-700',
    dotClass: 'bg-zinc-400',
    borderAccentClass: 'border-t-zinc-400',
  },
  'needs-review': {
    label: 'Needs Review',
    shortLabel: 'Needs Review',
    description: 'Insufficient evidence, incomplete docs, or questionable claims.',
    badgeClass:
      'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/70',
    dotClass: 'bg-orange-500',
    borderAccentClass: 'border-t-orange-500',
  },
  bad: {
    label: 'Bad',
    shortLabel: 'Bad',
    description: 'Low-quality, broken, redundant, or not useful.',
    badgeClass:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/70',
    dotClass: 'bg-rose-500',
    borderAccentClass: 'border-t-rose-500',
  },
  risky: {
    label: 'Risky',
    shortLabel: 'Risky',
    description: 'Security concerns, suspicious instructions, or dangerous permissions.',
    badgeClass:
      'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800',
    dotClass: 'bg-red-600',
    borderAccentClass: 'border-t-red-600',
  },
  archived: {
    label: 'Archived',
    shortLabel: 'Archived',
    description: 'Outdated, abandoned, or retained for historical reference.',
    badgeClass:
      'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700',
    dotClass: 'bg-zinc-400',
    borderAccentClass: 'border-t-zinc-500',
  },
};

export const SECURITY_META: Record<
  SecurityLevel,
  { label: string; badgeClass: string }
> = {
  verified: {
    label: 'Verified Safe',
    badgeClass:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/70',
  },
  unverified: {
    label: 'Unverified',
    badgeClass:
      'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/70 dark:text-zinc-300 dark:border-zinc-700',
  },
  caution: {
    label: 'Caution',
    badgeClass:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/70',
  },
  risky: {
    label: 'Risky',
    badgeClass:
      'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800',
  },
};
