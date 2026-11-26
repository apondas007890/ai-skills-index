import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Edit3,
  Shield,
  Star,
  Terminal,
} from 'lucide-react';
import { getCategoryById, getSkillById, skills } from '../lib/data';
import { REPO_GITHUB_URL, SECURITY_META } from '../lib/constants';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryIcon } from '../components/CategoryIcon';
import { SkillCard } from '../components/SkillCard';
import { RichText } from '../components/RichText';

export function SkillDetailPage() {
  const { skillId } = useParams<{ skillId: string }>();
  const skill = skillId ? getSkillById(skillId) : undefined;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  if (!skill) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Skill not found
        </h1>
        <Link
          to="/explore"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>
      </div>
    );
  }

  const primaryCat = getCategoryById(skill.primary_category);
  const securityMeta = SECURITY_META[skill.security];
  const related = skill.related_skills
    .map((id) => getSkillById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const fallbackRelated =
    related.length > 0
      ? related
      : skills
          .filter(
            (s) => s.id !== skill.id && s.primary_category === skill.primary_category
          )
          .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-teal-600 dark:hover:text-teal-400">
          Library
        </Link>
        <span>/</span>
        {primaryCat && (
          <>
            <Link
              to={`/category/${primaryCat.id}`}
              className="hover:text-teal-600 dark:hover:text-teal-400"
            >
              {primaryCat.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-medium text-slate-900 dark:text-slate-200">
          {skill.name}
        </span>
      </nav>

      {/* Header & Actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {skill.name}
              </h1>
              <StatusBadge status={skill.status} />
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                {skill.quality}/10
              </span>
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              <RichText text={skill.description} />
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={skill.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
            >
              Open Source
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={() => copyText('link', window.location.href)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copiedKey === 'link' ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copiedKey === 'link' ? 'Copied Link' : 'Copy Link'}
            </button>

            <button
              type="button"
              onClick={() => copyText('name', skill.name)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copiedKey === 'name' ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copiedKey === 'name' ? 'Copied Name' : 'Copy Name'}
            </button>

            {skill.install_command && (
              <button
                type="button"
                onClick={() => copyText('install', skill.install_command)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {copiedKey === 'install' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Terminal className="h-3.5 w-3.5" />
                )}
                {copiedKey === 'install' ? 'Copied Command' : 'Copy Install'}
              </button>
            )}

            <a
              href={`${REPO_GITHUB_URL}/blob/main/${skill.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Entry
            </a>
          </div>
        </div>
      </section>

      {/* Main Content + Metadata Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              What it does
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <RichText text={skill.what_it_does} />
            </p>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Best for
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              {skill.best_for.map((item) => (
                <li key={item}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Evaluation Verdict
            </h2>
            <p className="mt-2 rounded-lg border border-teal-500/25 bg-teal-50/50 p-3.5 text-sm font-medium text-zinc-900 dark:border-teal-400/20 dark:bg-teal-950/20 dark:text-zinc-100">
              <RichText text={skill.verdict} />
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#111114]">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Limitations
              </h2>
              {skill.limitations.length > 0 ? (
                <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                  {skill.limitations.map((lim) => (
                    <li key={lim}>
                      <RichText text={lim} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">None recorded.</p>
              )}
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#111114]">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Risk &amp; Security
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                <RichText text={skill.risk || 'Review instructions before installing.'} />
              </p>
            </div>
          </div>

          {(skill.installation || skill.notes) && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-[#111114]">
              {skill.installation && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Installation
                  </h2>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <RichText text={skill.installation} />
                  </p>
                </div>
              )}
              {skill.notes && (
                <div className={skill.installation ? 'mt-5 border-t border-zinc-100 pt-5 dark:border-zinc-800' : ''}>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Personal Notes
                  </h2>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <RichText text={skill.notes} />
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metadata Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Metadata
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">Author</dt>
                <dd className="font-mono font-medium text-slate-900 dark:text-slate-100">
                  {skill.author}
                </dd>
              </div>
              {skill.stars !== null && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">GitHub Stars</dt>
                  <dd className="font-mono font-semibold text-teal-700 dark:text-teal-400">
                    ★ {skill.stars.toLocaleString()}
                  </dd>
                </div>
              )}
              {skill.last_pushed && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">Repo Activity</dt>
                  <dd className="font-mono text-xs text-slate-800 dark:text-slate-200">
                    {skill.last_pushed}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">Security</dt>
                <dd>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${securityMeta.badgeClass}`}
                  >
                    <Shield className="h-3 w-3" />
                    {securityMeta.label}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">Tested</dt>
                <dd className="font-mono text-xs text-slate-800 dark:text-slate-200">
                  {skill.tested ? 'Yes (Verified)' : 'Not personally tested'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">License</dt>
                <dd className="font-mono text-xs text-slate-800 dark:text-slate-200">
                  {skill.license}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">Source Type</dt>
                <dd className="font-mono text-xs text-slate-800 dark:text-slate-200">
                  {skill.source_type}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">Added</dt>
                <dd className="font-mono text-xs text-slate-800 dark:text-slate-200">
                  {skill.added}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">Last Reviewed</dt>
                <dd className="font-mono text-xs text-slate-800 dark:text-slate-200">
                  {skill.last_reviewed}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Categories
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skill.categories.map((catId) => {
                  const cat = getCategoryById(catId);
                  return (
                    <Link
                      key={catId}
                      to={`/category/${catId}`}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 hover:border-teal-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {cat && <CategoryIcon name={cat.icon} className="h-3 w-3" />}
                      {cat ? cat.name : catId}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Compatible Agents
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skill.compatible_agents.map((ag) => (
                  <Link
                    key={ag}
                    to={`/explore?agent=${encodeURIComponent(ag)}`}
                    className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {ag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tags
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skill.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/explore?tag=${encodeURIComponent(tag)}`}
                    className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-400"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Skills */}
      {fallbackRelated.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Related Skills
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackRelated.map((rel) => (
              <SkillCard key={rel.id} skill={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
