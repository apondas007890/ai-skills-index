import React from 'react';

/**
 * Renders prose with:
 * 1. Styled inline `code` badges (removing raw literal backticks).
 * 2. Highlighted search query tokens (<mark>) for instant visual scanning.
 */
export function RichText({
  text,
  highlightQuery = '',
  className = '',
}: {
  text: string;
  highlightQuery?: string;
  className?: string;
}) {
  if (!text) return null;

  const tokens = highlightQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  const highlightMatches = (segment: string, keyPrefix: string): React.ReactNode => {
    if (tokens.length === 0) return segment;
    const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = segment.split(regex);

    return parts.map((part, idx) => {
      if (tokens.some((t) => part.toLowerCase() === t)) {
        return (
          <mark
            key={`${keyPrefix}-m-${idx}`}
            className="rounded-xs bg-amber-300/80 px-0.5 font-medium text-zinc-950 dark:bg-amber-400/30 dark:text-amber-200"
          >
            {part}
          </mark>
        );
      }
      return <React.Fragment key={`${keyPrefix}-t-${idx}`}>{part}</React.Fragment>;
    });
  };

  // Split by inline `code` spans first
  const codeParts = text.split(/(`[^`]+`)/g);

  return (
    <span className={className}>
      {codeParts.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          const inner = part.slice(1, -1);
          return (
            <code
              key={`c-${idx}`}
              className="mx-0.5 rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {highlightMatches(inner, `c-${idx}`)}
            </code>
          );
        }
        return (
          <React.Fragment key={`p-${idx}`}>
            {highlightMatches(part, `p-${idx}`)}
          </React.Fragment>
        );
      })}
    </span>
  );
}
