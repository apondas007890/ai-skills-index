import fs from 'node:fs';
import path from 'node:path';
import {
  collectSkillFiles,
  DATA_DIR,
  loadCategoriesConfig,
  parseSkillFile,
  WEBSITE_DATA_DIR,
} from './skill-parser.mjs';

const categoriesConfig = loadCategoriesConfig();
const files = collectSkillFiles();
const parsedSkills = files.map(parseSkillFile);

const baseSkills = parsedSkills.map(({ relPath, frontmatter: fm, sections }) => ({
  id: fm.id,
  name: fm.name,
  source: fm.source,
  author: fm.author,
  primary_category: fm.primary_category,
  categories: fm.categories,
  tags: fm.tags,
  compatible_agents: fm.compatible_agents,
  status: fm.status,
  quality: fm.quality,
  security: fm.security,
  added: fm.added,
  last_reviewed: fm.last_reviewed,
  source_type: fm.source_type,
  license: fm.license || 'unknown',
  stars: typeof fm.stars === 'number' ? fm.stars : null,
  last_pushed: fm.last_pushed ? String(fm.last_pushed).slice(0, 10) : '',
  install_command: fm.install_command || '',
  tested: Boolean(fm.tested),
  featured: Boolean(fm.featured),
  file_path: relPath,
  description: sections.description,
  what_it_does: sections.whatItDoes,
  best_for: sections.bestFor,
  verdict: sections.verdict,
  limitations: sections.limitations.length > 0 ? sections.limitations : sections.limitationsRaw ? [sections.limitationsRaw] : [],
  risk: sections.risk,
  installation: sections.installation,
  notes: sections.notes,
}));

// Compute related skills via shared categories, tags, and compatible agents
const skillsWithRelations = baseSkills.map((skill) => {
  const scored = baseSkills
    .filter((other) => other.id !== skill.id)
    .map((other) => {
      let score = 0;
      if (other.primary_category === skill.primary_category) score += 3;
      for (const cat of other.categories) {
        if (skill.categories.includes(cat)) score += 2;
      }
      for (const tag of other.tags) {
        if (skill.tags.includes(tag)) score += 2;
      }
      for (const agent of other.compatible_agents) {
        if (skill.compatible_agents.includes(agent)) score += 0.5;
      }
      return { id: other.id, score };
    })
    .filter((item) => item.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.id);

  return {
    ...skill,
    related_skills: scored,
  };
});

// Build categories summary
const categoriesIndex = categoriesConfig.map((cat) => {
  const count = skillsWithRelations.filter((s) => s.categories.includes(cat.id)).length;
  const primaryCount = skillsWithRelations.filter((s) => s.primary_category === cat.id).length;
  return {
    ...cat,
    count,
    primary_count: primaryCount,
  };
});

// Build tags summary
const tagCounts = new Map();
for (const skill of skillsWithRelations) {
  for (const tag of skill.tags) {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }
}
const tagsIndex = Array.from(tagCounts.entries())
  .map(([tag, count]) => ({ tag, count }))
  .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

// Build sources summary
const sourceCounts = new Map();
for (const skill of skillsWithRelations) {
  sourceCounts.set(skill.source_type, (sourceCounts.get(skill.source_type) || 0) + 1);
}
const sourcesIndex = Array.from(sourceCounts.entries())
  .map(([source_type, count]) => ({ source_type, count }))
  .sort((a, b) => b.count - a.count);

function writeJsonOutputs(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'skills.json'), JSON.stringify(skillsWithRelations, null, 2) + '\n');
  fs.writeFileSync(path.join(targetDir, 'categories.json'), JSON.stringify(categoriesIndex, null, 2) + '\n');
  fs.writeFileSync(path.join(targetDir, 'tags.json'), JSON.stringify(tagsIndex, null, 2) + '\n');
  fs.writeFileSync(path.join(targetDir, 'sources.json'), JSON.stringify(sourcesIndex, null, 2) + '\n');
}

writeJsonOutputs(DATA_DIR);
writeJsonOutputs(WEBSITE_DATA_DIR);

console.log(`Built index for ${skillsWithRelations.length} skill(s), ${tagsIndex.length} tag(s), and ${categoriesIndex.length} categories.`);
