import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const ROOT_DIR = path.resolve(import.meta.dirname, '..');
export const SKILLS_DIR = path.join(ROOT_DIR, 'skills');
export const DATA_DIR = path.join(ROOT_DIR, 'data');
export const WEBSITE_DATA_DIR = path.join(ROOT_DIR, 'website', 'src', 'data');

export const VALID_STATUSES = [
  'excellent',
  'good',
  'promising',
  'experimental',
  'neutral',
  'needs-review',
  'bad',
  'risky',
  'archived',
];

export const VALID_SECURITY = ['verified', 'unverified', 'caution', 'risky'];

export const VALID_SOURCE_TYPES = [
  'github',
  'website',
  'docs',
  'blog',
  'directory',
  'social',
  'other',
];

export function loadCategoriesConfig() {
  const raw = fs.readFileSync(path.join(DATA_DIR, 'categories-config.json'), 'utf8');
  return JSON.parse(raw);
}

export function collectSkillFiles(dir = SKILLS_DIR) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSkillFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md') {
      files.push(fullPath);
    }
  }
  return files.sort();
}

export function parseSections(markdownBody) {
  const sections = {};
  const lines = markdownBody.split(/\r?\n/);
  let currentKey = null;
  let buffer = [];

  const flush = () => {
    if (currentKey) {
      sections[currentKey] = buffer.join('\n').trim();
    }
    buffer = [];
  };

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      flush();
      currentKey = match[1].trim().toLowerCase();
    } else if (currentKey) {
      buffer.push(line);
    }
  }
  flush();

  const toList = (text) =>
    (text || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.startsWith('- ') || l.startsWith('* '))
      .map((l) => l.replace(/^[-*]\s+/, '').trim());

  return {
    description: sections['description'] || '',
    whatItDoes: sections['what it does'] || '',
    bestFor: toList(sections['best for']),
    bestForRaw: sections['best for'] || '',
    verdict: sections['verdict'] || '',
    limitations: toList(sections['limitations']),
    limitationsRaw: sections['limitations'] || '',
    risk: sections['risk'] || '',
    installation: sections['installation'] || '',
    notes: sections['notes'] || '',
  };
}

export function parseSkillFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  const sections = parseSections(content);

  const normalizeDate = (val) => {
    if (val instanceof Date) return val.toISOString().slice(0, 10);
    return val ? String(val).trim() : '';
  };

  return {
    filePath,
    relPath,
    frontmatter: {
      ...data,
      added: normalizeDate(data.added),
      last_reviewed: normalizeDate(data.last_reviewed),
    },
    sections,
    body: content.trim(),
  };
}
