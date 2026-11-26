export type SkillStatus =
  | 'excellent'
  | 'good'
  | 'promising'
  | 'experimental'
  | 'neutral'
  | 'needs-review'
  | 'bad'
  | 'risky'
  | 'archived';

export type SecurityLevel = 'verified' | 'unverified' | 'caution' | 'risky';

export type SourceType =
  | 'github'
  | 'website'
  | 'docs'
  | 'blog'
  | 'directory'
  | 'social'
  | 'other';

export interface Skill {
  id: string;
  name: string;
  source: string;
  author: string;
  primary_category: string;
  categories: string[];
  tags: string[];
  compatible_agents: string[];
  status: SkillStatus;
  quality: number;
  security: SecurityLevel;
  added: string;
  last_reviewed: string;
  source_type: SourceType;
  license: string;
  install_command: string;
  tested: boolean;
  featured: boolean;
  file_path: string;
  description: string;
  what_it_does: string;
  best_for: string[];
  verdict: string;
  limitations: string[];
  risk: string;
  installation: string;
  notes: string;
  related_skills: string[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: string[];
  count: number;
  primary_count: number;
}

export interface TagInfo {
  tag: string;
  count: number;
}
