import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowUpRight, CheckCircle2, Copy, Check, Loader2, ShieldCheck } from 'lucide-react';
import { categories, skills } from '../lib/data';
import { REPO_GITHUB_URL } from '../lib/constants';

const ALL_AGENTS = [
  'claude-code',
  'gemini-cli',
  'codex',
  'cursor',
  'github-copilot',
  'windsurf',
  'cline',
  'opencode',
  'kiro',
  'antigravity',
  'roo-code',
  'aider',
];

interface VerifiedRepo {
  fullName: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  license: string;
  pushedAt: string;
}

export function SubmitSkillPage() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('agents');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['claude-code', 'gemini-cli', 'codex', 'cursor']);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifiedRepo, setVerifiedRepo] = useState<VerifiedRepo | null>(null);
  const [copied, setCopied] = useState(false);

  const parseGitHubRepo = (raw: string): { owner: string; repo: string } | null => {
    try {
      const parsed = new URL(raw.trim());
      if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') return null;
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length < 2) return null;
      return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') };
    } catch {
      return null;
    }
  };

  const handleVerify = async () => {
    setVerifyError(null);
    setVerifiedRepo(null);

    const parsed = parseGitHubRepo(url);
    if (!parsed) {
      setVerifyError('Enter a valid GitHub repository URL (e.g. https://github.com/owner/repo).');
      return;
    }

    const normalized = `https://github.com/${parsed.owner}/${parsed.repo}`.toLowerCase();
    const duplicate = skills.find((s) => s.source.replace(/\/+$/, '').toLowerCase() === normalized);
    if (duplicate) {
      setVerifyError(`Already indexed as "${duplicate.name}".`);
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
      if (!res.ok) {
        setVerifyError(res.status === 404 ? 'Repository not found (404) or private.' : `GitHub returned HTTP ${res.status}.`);
        return;
      }
      const data = await res.json();
      if (data.archived) {
        setVerifyError('This repository is archived on GitHub.');
        return;
      }

      const info: VerifiedRepo = {
        fullName: data.full_name,
        name: data.name,
        owner: data.owner?.login || parsed.owner,
        description: data.description || '',
        stars: data.stargazers_count ?? 0,
        license: data.license?.spdx_id || 'Unknown',
        pushedAt: data.pushed_at ? String(data.pushed_at).slice(0, 10) : '',
      };
      setVerifiedRepo(info);
      if (!name.trim()) {
        setName(info.name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
      }
      if (!description.trim() && info.description) {
        setDescription(info.description);
      }
    } catch {
      setVerifyError('Network error while checking GitHub. You can still submit the URL manually.');
    } finally {
      setVerifying(false);
    }
  };

  const toggleAgent = (agent: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]
    );
  };

  const isFormValid =
    Boolean(parseGitHubRepo(url)) &&
    name.trim().length >= 2 &&
    description.trim().length >= 12 &&
    selectedAgents.length > 0;

  const issueTitle = `[Skill Submission] ${name.trim() || 'New Skill'}`;
  const issueBody = [
    `### Skill Submission`,
    `- **GitHub URL:** ${url.trim()}`,
    `- **Name:** ${name.trim()}`,
    `- **Category:** ${category}`,
    `- **Compatible Agents:** ${selectedAgents.join(', ')}`,
    verifiedRepo ? `- **Verified Stars:** ${verifiedRepo.stars.toLocaleString()} (${verifiedRepo.license})` : '',
    ``,
    `### Short Description`,
    description.trim(),
  ]
    .filter(Boolean)
    .join('\n');

  const githubIssueUrl = `${REPO_GITHUB_URL}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;

  const copyPayload = () => {
    navigator.clipboard.writeText(issueBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-up">
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
          Catalog
        </Link>
        <span>/</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-200">Submit Skill</span>
      </div>

      <section className="surface-card rounded-2xl p-6 sm:p-7">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Submit an AI Skill
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Add one GitHub repository at a time. We verify the repository URL live via GitHub before you submit it for security review and indexing.
        </p>

        <div className="mt-6 space-y-5">
          {/* GitHub URL + Verify */}
          <div>
            <label htmlFor="skill-url" className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              GitHub Repository URL *
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="skill-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setVerifyError(null);
                  setVerifiedRepo(null);
                }}
                placeholder="https://github.com/owner/repo"
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || !url.trim()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                {verifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                Verify URL
              </button>
            </div>

            {verifyError && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {verifyError}
              </p>
            )}

            {verifiedRepo && (
              <div className="mt-2.5 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified: {verifiedRepo.fullName}
                </span>
                <span className="font-mono">★ {verifiedRepo.stars.toLocaleString()}</span>
                <span className="font-mono">{verifiedRepo.license}</span>
                {verifiedRepo.pushedAt && <span className="font-mono">Updated {verifiedRepo.pushedAt}</span>}
              </div>
            )}
          </div>

          {/* Skill Name */}
          <div>
            <label htmlFor="skill-name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Skill Name *
            </label>
            <input
              id="skill-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Superpowers"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="skill-cat" className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Primary Category *
            </label>
            <select
              id="skill-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Compatible Agents */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Compatible AI Agents *
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ALL_AGENTS.map((agent) => {
                const active = selectedAgents.includes(agent);
                return (
                  <button
                    key={agent}
                    type="button"
                    onClick={() => toggleAgent(agent)}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors ${
                      active
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                    }`}
                  >
                    {agent}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="skill-desc" className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Short Description (1–3 sentences) *
            </label>
            <textarea
              id="skill-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this skill do, and why is it useful?"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <a
              href={isFormValid ? githubIssueUrl : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!isFormValid}
              onClick={(e) => {
                if (!isFormValid) e.preventDefault();
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold transition-colors ${
                isFormValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
              }`}
            >
              Submit via GitHub Issue
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={copyPayload}
              disabled={!isFormValid}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied Details' : 'Copy Details'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
