import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { collectSkillFiles, parseSkillFile } from './skill-parser.mjs';

const SUSPICIOUS_PATTERNS = [
  { name: 'curl-pipe-shell', regex: /curl\s+[^\n]*\|\s*(sh|bash)/i },
  { name: 'wget-pipe-shell', regex: /wget\s+[^\n]*\|\s*(sh|bash)/i },
  { name: 'powershell-iex', regex: /iex\s*\(\s*(irm|invoke-webrequest)/i },
];

console.log('1. Checking skill Markdown files for risky install commands...');
const files = collectSkillFiles();
const warnings = [];

for (const filePath of files) {
  const { relPath, frontmatter: fm } = parseSkillFile(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');

  if (fm.install_command) {
    for (const pat of SUSPICIOUS_PATTERNS) {
      if (pat.regex.test(fm.install_command)) {
        warnings.push(`${relPath}: install_command matches ${pat.name}`);
      }
    }
  }

  if (fm.status === 'risky' && fm.security !== 'risky') {
    warnings.push(`${relPath}: status is "risky" but security is "${fm.security}"`);
  }

  if (fm.security === 'verified' && !raw.includes('http')) {
    warnings.push(`${relPath}: marked verified without source link`);
  }
}

if (warnings.length > 0) {
  console.error('Security check warnings:');
  for (const w of warnings) console.error(`  - ${w}`);
  process.exit(1);
}
console.log(`   Checked ${files.length} skill file(s): 0 suspicious patterns.`);

console.log('2. Running npm audit on root and website...');
try {
  execSync('npm audit --audit-level=moderate', { stdio: 'inherit' });
  execSync('npm --prefix website audit --audit-level=moderate', { stdio: 'inherit' });
} catch {
  console.error('npm audit found moderate or higher vulnerabilities.');
  process.exit(1);
}

console.log('Security check passed.');
