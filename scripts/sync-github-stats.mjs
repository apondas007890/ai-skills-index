import fs from 'node:fs';
import matter from 'gray-matter';
import { collectSkillFiles } from './skill-parser.mjs';

const files = collectSkillFiles();
const token = process.env.GITHUB_TOKEN || '';

function extractGithubRepo(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    if (url.hostname !== 'github.com') return null;
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return `${parts[0]}/${parts[1].replace(/\.git$/, '')}`;
  } catch {
    return null;
  }
}

let updated = 0;
for (const filePath of files) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const repo = extractGithubRepo(parsed.data.source);
  if (!repo) continue;

  try {
    const headers = { 'User-Agent': 'SkillAtlas-Sync' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) {
      console.warn(`Skipped ${repo}: HTTP ${res.status}`);
      continue;
    }
    const info = await res.json();
    parsed.data.stars = info.stargazers_count ?? parsed.data.stars ?? null;
    if (info.pushed_at) {
      parsed.data.last_pushed = info.pushed_at.slice(0, 10);
    }
    if (info.license?.spdx_id && info.license.spdx_id !== 'NOASSERTION') {
      parsed.data.license = info.license.spdx_id;
    }
    const nextContent = matter.stringify(parsed.content.trimStart(), parsed.data);
    fs.writeFileSync(filePath, nextContent);
    updated++;
    console.log(`Synced ${repo}: ${parsed.data.stars} stars`);
  } catch (err) {
    console.warn(`Failed ${repo}: ${err.message}`);
  }
}

console.log(`Synced GitHub stats for ${updated} skill(s).`);
