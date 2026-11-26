import skillsJson from '../data/skills.json';
import categoriesJson from '../data/categories.json';
import tagsJson from '../data/tags.json';
import type { CategoryInfo, Skill, SourceType, TagInfo } from '../types/skill';

export const skills: Skill[] = skillsJson as Skill[];
export const categories: CategoryInfo[] = categoriesJson as CategoryInfo[];
export const tags: TagInfo[] = tagsJson as TagInfo[];

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}

export function getCategoryById(id: string): CategoryInfo | undefined {
  return categories.find((c) => c.id === id);
}

export const allAgents: string[] = Array.from(
  new Set(skills.flatMap((s) => s.compatible_agents))
).sort();

export const allSourceTypes: SourceType[] = Array.from(
  new Set(skills.map((s) => s.source_type))
).sort() as SourceType[];
