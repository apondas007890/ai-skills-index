import path from 'node:path';
import {
  collectSkillFiles,
  loadCategoriesConfig,
  parseSkillFile,
  VALID_SECURITY,
  VALID_SOURCE_TYPES,
  VALID_STATUSES,
} from './skill-parser.mjs';

const categories = loadCategoriesConfig();
const validCategoryIds = new Set(categories.map((c) => c.id));
const files = collectSkillFiles();

if (files.length === 0) {
  console.error('Validation failed: no skill Markdown files found in skills/.');
  process.exit(1);
}

const errors = [];
const seenIds = new Map();
const seenSources = new Map();
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const idRegex = /^[a-z0-9-]+$/;

for (const filePath of files) {
  let parsed;
  try {
    parsed = parseSkillFile(filePath);
  } catch (err) {
    errors.push(`${filePath}: failed to parse frontmatter/markdown (${err.message})`);
    continue;
  }

  const { frontmatter: fm, sections, relPath } = parsed;
  const addErr = (msg) => errors.push(`${relPath}: ${msg}`);

  if (!fm.id || typeof fm.id !== 'string' || !idRegex.test(fm.id)) {
    addErr('invalid or missing "id" (must match ^[a-z0-9-]+$)');
  } else {
    if (seenIds.has(fm.id)) {
      addErr(`duplicate id "${fm.id}" (already defined in ${seenIds.get(fm.id)})`);
    } else {
      seenIds.set(fm.id, relPath);
    }
    const expectedFilename = `${fm.id}.md`;
    if (path.basename(filePath) !== expectedFilename) {
      addErr(`filename "${path.basename(filePath)}" must match id "${expectedFilename}"`);
    }
  }

  if (!fm.name || typeof fm.name !== 'string') {
    addErr('missing "name"');
  }

  if (!fm.source || typeof fm.source !== 'string') {
    addErr('missing "source" URL');
  } else {
    try {
      const url = new URL(fm.source);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        addErr(`source URL must be http/https: ${fm.source}`);
      }
      const normalized = fm.source.replace(/\/+$/, '').toLowerCase();
      if (seenSources.has(normalized)) {
        addErr(`duplicate source URL "${fm.source}" (already in ${seenSources.get(normalized)})`);
      } else {
        seenSources.set(normalized, relPath);
      }
    } catch {
      addErr(`invalid source URL: ${fm.source}`);
    }
  }

  if (!fm.author || typeof fm.author !== 'string') {
    addErr('missing "author"');
  }

  if (!fm.primary_category || !validCategoryIds.has(fm.primary_category)) {
    addErr(`invalid "primary_category": ${fm.primary_category}`);
  } else {
    const parentFolder = path.basename(path.dirname(filePath));
    if (parentFolder !== fm.primary_category) {
      addErr(`file must live under skills/${fm.primary_category}/ (currently in ${parentFolder}/)`);
    }
  }

  if (!Array.isArray(fm.categories) || fm.categories.length === 0) {
    addErr('"categories" must be a non-empty array');
  } else {
    for (const cat of fm.categories) {
      if (!validCategoryIds.has(cat)) {
        addErr(`unknown category "${cat}" in categories`);
      }
    }
    if (fm.primary_category && !fm.categories.includes(fm.primary_category)) {
      addErr(`"categories" must include primary_category "${fm.primary_category}"`);
    }
  }

  if (!Array.isArray(fm.tags) || fm.tags.length === 0) {
    addErr('"tags" must be a non-empty array');
  }

  if (!Array.isArray(fm.compatible_agents) || fm.compatible_agents.length === 0) {
    addErr('"compatible_agents" must be a non-empty array');
  }

  if (!VALID_STATUSES.includes(fm.status)) {
    addErr(`invalid "status": ${fm.status}`);
  }

  if (typeof fm.quality !== 'number' || fm.quality < 1 || fm.quality > 10) {
    addErr(`"quality" must be a number between 1 and 10 (got ${fm.quality})`);
  }

  if (!VALID_SECURITY.includes(fm.security)) {
    addErr(`invalid "security": ${fm.security}`);
  }

  if (!dateRegex.test(fm.added)) {
    addErr(`invalid "added" date (expected YYYY-MM-DD, got "${fm.added}")`);
  }

  if (!dateRegex.test(fm.last_reviewed)) {
    addErr(`invalid "last_reviewed" date (expected YYYY-MM-DD, got "${fm.last_reviewed}")`);
  }

  if (!VALID_SOURCE_TYPES.includes(fm.source_type)) {
    addErr(`invalid "source_type": ${fm.source_type}`);
  }

  if (typeof fm.tested !== 'boolean') {
    addErr('"tested" must be a boolean');
  }

  if (typeof fm.featured !== 'boolean') {
    addErr('"featured" must be a boolean');
  }

  if (!sections.description) addErr('missing "## Description" section');
  if (!sections.whatItDoes) addErr('missing "## What it does" section');
  if (sections.bestFor.length === 0 && !sections.bestForRaw) addErr('missing "## Best for" section');
  if (!sections.verdict) addErr('missing "## Verdict" section');
}

if (errors.length > 0) {
  console.error(`\nValidation failed with ${errors.length} error(s):\n`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(`Validated ${files.length} skill(s) successfully.`);
