import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { skills } from '../lib/data';
import { REPO_GITHUB_URL } from '../lib/constants';

interface SavedSubmission {
  id: string;
  url: string;
  name: string;
  description: string;
  verifiedLabel: string;
  savedAt: string;
}

const STORAGE_KEY = 'skillatlas-submissions';

export function SubmitSkillPage() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifiedInfo, setVerifiedInfo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [submissions, setSubmissions] = useState<SavedSubmission[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedSubmission[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // ignore storage quota errors
    }
  }, [submissions]);

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
      // Non-GitHub URL (docs, web app, directory)
      setVerifiedInfo(`Valid URL (${parsed.hostname}) — ready to submit for review`);
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

  const handleSaveLocally = () => {
    if (!isFormValid) return;
    const entry: SavedSubmission = {
      id: `${Date.now()}`,
      url: url.trim(),
      name: name.trim(),
      description: description.trim(),
      verifiedLabel: verifiedInfo || 'Pending review',
      savedAt: new Date().toISOString().slice(0, 10),
    };
    setSubmissions((prev) => [entry, ...prev]);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

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
          Paste any skill URL (GitHub repo, docs, or web tool), name, and a short description. Category and agent compatibility are assigned during review.
        </p>

        <div className="mt-6 space-y-5">
          {/* Skill URL + Verify */}
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
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
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

          {/* Skill Name */}
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
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
          </div>

          {/* Short Description */}
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
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex flex-wrap items-center gap-2.5 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                if (!isFormValid) return;
                handleSaveLocally();
                window.open(githubIssueUrl, '_blank', 'noopener,noreferrer');
              }}
              disabled={!isFormValid}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
            >
              Submit Skill
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleSaveLocally}
              disabled={!isFormValid}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {savedNotice ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : null}
              {savedNotice ? 'Saved Locally' : 'Save Draft'}
            </button>

            <button
              type="button"
              onClick={copyPayload}
              disabled={!isFormValid}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            {!isFormValid && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Enter a valid URL, name, and short description to submit.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Saved Local Submissions */}
      {submissions.length > 0 && (
        <section className="surface-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Saved Drafts ({submissions.length})
            </h2>
            <button
              type="button"
              onClick={() => setSubmissions([])}
              className="text-xs font-medium text-zinc-500 hover:text-rose-600 dark:text-zinc-400"
            >
              Clear all
            </button>
          </div>
          <div className="mt-3 space-y-2.5">
            {submissions.map((item) => (
              <div
                key={item.id}
                className="surface-subtle flex items-start justify-between gap-3 rounded-xl p-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400">{item.savedAt}</span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate font-mono text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {item.url}
                  </a>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmissions((prev) => prev.filter((x) => x.id !== item.id))}
                  aria-label={`Remove ${item.name}`}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-rose-600 dark:hover:bg-zinc-800"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
