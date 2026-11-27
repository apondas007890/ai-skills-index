import type { Skill, SkillStatus, SourceType } from '../types/skill';

export type SortOption =
  | 'quality'
  | 'stars'
  | 'added'
  | 'reviewed'
  | 'name'
  | 'relevance';

export interface SearchFilters {
  query?: string;
  categories?: string[];
  statuses?: SkillStatus[];
  agents?: string[];
  tags?: string[];
  sourceTypes?: SourceType[];
  sort?: SortOption;
}

function fuzzySubsequenceScore(text: string, query: string): number {
  if (!query || !text) return 0;
  let qi = 0;
  let consecutive = 0;
  let score = 0;

  for (let ti = 0; ti < text.length && qi < query.length; ti++) {
    if (text[ti] === query[qi]) {
      consecutive++;
      score += 1 + consecutive * 0.5;
      qi++;
    } else {
      consecutive = 0;
    }
  }

  return qi === query.length ? score : 0;
}

const INTENT_SYNONYMS: Record<string, string[]> = {
  sql: ['database', 'query', 'postgres', 'sqlite', 'analytics'],
  database: ['sql', 'postgres', 'sqlite', 'data'],
  frontend: ['ui', 'ux', 'design', 'react', 'css', 'tailwind', 'layout'],
  ui: ['frontend', 'ux', 'design', 'component', 'accessibility'],
  website: ['frontend', 'web', 'landing', 'ui', 'html'],
  bug: ['debug', 'debugging', 'fix', 'error', 'test'],
  bugs: ['debug', 'debugging', 'fix', 'error', 'test'],
  review: ['audit', 'critique', 'lint', 'code-review', 'quality'],
  scrape: ['scraping', 'crawler', 'crawl', 'browser', 'playwright'],
  scraping: ['scrape', 'crawler', 'crawl', 'browser'],
  video: ['remotion', 'animation', 'motion', 'ffmpeg', 'youtube'],
  test: ['tdd', 'testing', 'eval', 'qa'],
};

export function scoreSkillMatch(skill: Skill, rawQuery: string): number {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return 1;

  const tokens = query.split(/\s+/).filter(Boolean);
  const name = skill.name.toLowerCase();
  const id = skill.id.toLowerCase();
  const source = skill.source.toLowerCase();
  const author = skill.author.toLowerCase();
  const desc = skill.description.toLowerCase();
  const what = skill.what_it_does.toLowerCase();
  const verdict = skill.verdict.toLowerCase();
  const notes = skill.notes.toLowerCase();
  const bestFor = skill.best_for.join(' ').toLowerCase();
  const tags = skill.tags.join(' ').toLowerCase();
  const cats = skill.categories.join(' ').toLowerCase();
  const agents = skill.compatible_agents.join(' ').toLowerCase();

  let totalScore = 0;

  for (const token of tokens) {
    let tokenScore = 0;

    if (name === token || id === token) tokenScore += 60;
    else if (name.startsWith(token) || id.startsWith(token)) tokenScore += 40;
    else if (name.includes(token)) tokenScore += 28;

    if (source.includes(token)) tokenScore += 35;

    if (skill.tags.some((t) => t.toLowerCase() === token)) tokenScore += 26;
    else if (tags.includes(token)) tokenScore += 16;

    if (skill.categories.some((c) => c.toLowerCase() === token)) tokenScore += 22;
    else if (cats.includes(token)) tokenScore += 12;

    if (agents.includes(token)) tokenScore += 14;
    if (bestFor.includes(token)) tokenScore += 12;
    if (desc.includes(token)) tokenScore += 10;
    if (what.includes(token)) tokenScore += 8;
    if (verdict.includes(token)) tokenScore += 6;
    if (notes.includes(token)) tokenScore += 5;
    if (author.includes(token)) tokenScore += 5;

    if (tokenScore === 0) {
      const synonyms = INTENT_SYNONYMS[token];
      if (synonyms) {
        for (const syn of synonyms) {
          if (name.includes(syn) || tags.includes(syn) || desc.includes(syn) || what.includes(syn)) {
            tokenScore += 11;
            break;
          }
        }
      }
    }

    if (tokenScore === 0) {
      // Fallback to fuzzy subsequence match on name and tags
      const fuzzyName = fuzzySubsequenceScore(name, token);
      const fuzzyTag = fuzzySubsequenceScore(tags, token);
      if (fuzzyName >= token.length * 1.4) {
        tokenScore += Math.min(12, fuzzyName);
      } else if (fuzzyTag >= token.length * 1.4) {
        tokenScore += Math.min(8, fuzzyTag);
      }
    }

    if (tokenScore === 0) {
      return 0; // Every search token must match at least one field
    }

    totalScore += tokenScore;
  }

  // Slight boost for featured & higher quality on ties
  return totalScore + skill.quality * 0.15 + (skill.featured ? 0.5 : 0);
}

export function filterAndSortSkills(
  skills: Skill[],
  filters: SearchFilters
): Skill[] {
  const {
    query = '',
    categories = [],
    statuses = [],
    agents = [],
    tags = [],
    sourceTypes = [],
    sort = query.trim() ? 'relevance' : 'quality',
  } = filters;

  const trimmedQuery = query.trim();

  const matched = skills
    .map((skill) => {
      if (
        categories.length > 0 &&
        !categories.some((cat) => skill.categories.includes(cat))
      ) {
        return null;
      }

      if (statuses.length > 0 && !statuses.includes(skill.status)) {
        return null;
      }

      if (
        agents.length > 0 &&
        !agents.some((ag) => skill.compatible_agents.includes(ag))
      ) {
        return null;
      }

      if (tags.length > 0 && !tags.some((t) => skill.tags.includes(t))) {
        return null;
      }

      if (sourceTypes.length > 0 && !sourceTypes.includes(skill.source_type)) {
        return null;
      }

      const relevance = scoreSkillMatch(skill, trimmedQuery);
      if (trimmedQuery && relevance <= 0) {
        return null;
      }

      return { skill, relevance };
    })
    .filter((item): item is { skill: Skill; relevance: number } => item !== null);

  matched.sort((a, b) => {
    switch (sort) {
      case 'relevance':
        if (b.relevance !== a.relevance) return b.relevance - a.relevance;
        return b.skill.quality - a.skill.quality;
      case 'quality':
        if (b.skill.quality !== a.skill.quality) {
          return b.skill.quality - a.skill.quality;
        }
        return (b.skill.stars ?? 0) - (a.skill.stars ?? 0);
      case 'stars':
        return (b.skill.stars ?? -1) - (a.skill.stars ?? -1);
      case 'added':
        return b.skill.added.localeCompare(a.skill.added);
      case 'reviewed':
        return b.skill.last_reviewed.localeCompare(a.skill.last_reviewed);
      case 'name':
        return a.skill.name.localeCompare(b.skill.name);
      default:
        return 0;
    }
  });

  return matched.map((m) => m.skill);
}
