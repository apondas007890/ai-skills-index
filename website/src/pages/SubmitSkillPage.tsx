import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { skills } from '../lib/data';
import { REPO_GITHUB_URL } from '../lib/constants';

export function SubmitSkillPage() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifiedInfo, setVerifiedInfo] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedIssueUrl, setSubmittedIssueUrl] = useState<string | null>(null);
  const [needsFallback, setNeedsFallback] = useState(false);

  const parseValidUrl = (raw: string): URL | null => {
    try {
      const parsed = new URL(raw.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const parseGitHubRepo = (parsed: URL): { owner: string; repo: string } | null => {
    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') };
  };

  const handleVerify = async () => {
    setVerifyError(null);
    setVerifiedInfo(null);

    const parsed = parseValidUrl(url);
    if (!parsed) {
      setVerifyError('Enter a valid URL starting with https:// or http://');
      return;
    }

    const normalized = url.trim().replace(/\/+$/, '').toLowerCase();
    const duplicate = skills.find((s) => s.source.replace(/\/+$/, '').toLowerCase() === normalized);
    if (duplicate) {
      setVerifyError(`Already indexed as "${duplicate.name}".`);
      return;
    }

    const gh = parseGitHubRepo(parsed);
    if (!gh) {
      setVerifiedInfo(`Valid URL (${parsed.hostname}) — ready to submit for review.`);
      if (!name.trim()) {
        const seg = parsed.pathname.split('/').filter(Boolean).pop() || parsed.hostname;
        setName(seg.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
      }
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${gh.owner}/${gh.repo}`);
      if (!res.ok) {
        setVerifyError(
          res.status === 404
            ? 'GitHub repository not found (404) or private.'
            : `GitHub returned HTTP ${res.status}.`
        );
        return;
      }
      const data = await res.json();
      if (data.archived) {
        setVerifyError('This repository is archived on GitHub.');
        return;
      }

      const stars = typeof data.stargazers_count === 'number' ? data.stargazers_count : 0;
      const license = data.license?.spdx_id || 'Unknown';
      setVerifiedInfo(`Verified GitHub: ${data.full_name} (★ ${stars.toLocaleString()}, ${license})`);

      if (!name.trim()) {
        setName(
          String(data.name || gh.repo)
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
        );
      }
      if (!description.trim() && data.description) {
        setDescription(String(data.description));
      }
    } catch {
      setVerifyError('Network error while checking GitHub. You can still submit the URL.');
    } finally {
      setVerifying(false);
    }
  };

  const isFormValid =
    Boolean(parseValidUrl(url)) &&
    name.trim().length >= 1 &&
    description.trim().length >= 1;

  const issueTitle = `[Skill Submission] ${name.trim() || 'New Skill'}`;
  const issueBody = [
    `### Skill Submission`,
    `- **URL:** ${url.trim()}`,
    `- **Name:** ${name.trim()}`,
    verifiedInfo ? `- **Verification:** ${verifiedInfo}` : '',
    ``,
    `### Short Description`,
    description.trim(),
  ]
    .filter(Boolean)
    .join('\n');

  const githubIssueUrl = `${REPO_GITHUB_URL}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmittedIssueUrl(null);
    setNeedsFallback(false);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          name: name.trim(),
          description: description.trim(),
          verifiedInfo: verifiedInfo || '',
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Static host without Worker API (e.g. GitHub Pages)
        setNeedsFallback(true);
        return;
      }

      const data = await res.json();
      if (res.ok && data.ok) {
        setSubmittedIssueUrl(data.issueUrl || `${REPO_GITHUB_URL}/issues`);
        setUrl('');
        setName('');
        setDescription('');
        setVerifiedInfo(null);
      } else if (data.fallback) {
        setNeedsFallback(true);
      } else {
        setSubmitError(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setNeedsFallback(true);
    } finally {
      setSubmitting(false);
    }
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
          Paste any skill URL (GitHub repo, docs, or web tool), name, and a short description. Submissions are queued for security verification before appearing in the catalog.
        </p>

        {submittedIssueUrl && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="inline-flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Submitted! Your skill is saved and queued for review.
            </span>
            <a
              href={submittedIssueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold underline"
            >
              View submission <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="skill-url"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Skill URL *
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="skill-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setVerifyError(null);
                  setVerifiedInfo(null);
                }}
                placeholder="https://github.com/owner/repo or https://..."
                className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 font-mono text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || !url.trim()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                {verifying ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" />
                )}
                Verify URL
              </button>
            </div>

            {verifyError && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {verifyError}
              </p>
            )}

            {verifiedInfo && (
              <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{verifiedInfo}</span>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="skill-name"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Skill name *
            </label>
            <input
              id="skill-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Superpowers"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
          </div>

          <div>
            <label
              htmlFor="skill-desc"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Short description (1–3 sentences) *
            </label>
            <textarea
              id="skill-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this skill do, and why is it useful?"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
          </div>

          {submitError && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {submitError}
            </p>
          )}

          {needsFallback && (
            <div className="surface-subtle flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300">
              <span>Direct API submission is not active on this host yet — submit via GitHub instead:</span>
              <a
                href={githubIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Open GitHub submission <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
            >
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {submitting ? 'Submitting…' : 'Submit Skill'}
            </button>

            {!isFormValid && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Enter a valid URL, name, and short description to submit.
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
