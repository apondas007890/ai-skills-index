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
import { SkillCard, formatStars } from '../components/SkillCard';
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
      <div className="glass rounded-3xl p-10 text-center">
        <h1 className="text-xl font-bold text-white">Skill not found</h1>
        <Link
          to="/explore"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Browse
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
          .filter((s) => s.id !== skill.id && s.primary_category === skill.primary_category)
          .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-white/40">
        <Link to="/" className="hover:text-amber-400 transition-colors">
          Catalog
        </Link>
        <span>/</span>
        {primaryCat && (
          <>
            <Link
              to={`/category/${primaryCat.id}`}
              className="hover:text-amber-400 transition-colors"
            >
              {primaryCat.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-medium text-white/80">{skill.name}</span>
      </nav>

      {/* Header & Actions */}
      <section className="glass-strong rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {skill.name}
              </h1>
              <StatusBadge status={skill.status} />
              {skill.stars !== null && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-400">
                  <Star className="h-3.5 w-3.5" />
                  {formatStars(skill.stars)}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.1] bg-white/[0.06] px-2.5 py-0.5 font-mono text-xs font-semibold text-white/80">
                {skill.quality}/10
              </span>
            </div>

            <p className="max-w-3xl text-[15px] leading-relaxed text-white/60">
              <RichText text={skill.description} />
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={skill.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 text-xs font-semibold text-amber-400 transition-all hover:bg-amber-500/25"
            >
              Open Source
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={() => copyText('link', window.location.href)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
            >
              {copiedKey === 'link' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey === 'link' ? 'Copied Link' : 'Copy Link'}
            </button>

            <button
              type="button"
              onClick={() => copyText('name', skill.name)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
            >
              {copiedKey === 'name' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey === 'name' ? 'Copied Name' : 'Copy Name'}
            </button>

            {skill.install_command && (
              <button
                type="button"
                onClick={() => copyText('install', skill.install_command)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 font-mono text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
              >
                {copiedKey === 'install' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Terminal className="h-3.5 w-3.5" />}
                {copiedKey === 'install' ? 'Copied Command' : 'Copy Install'}
              </button>
            )}

            <a
              href={`${REPO_GITHUB_URL}/blob/main/${skill.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
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
          <div className="glass rounded-3xl p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
              What it does
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-white/70">
              <RichText text={skill.what_it_does} />
            </p>

            <h2 className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-white/35">
              Best for
            </h2>
            <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-white/70">
              {skill.best_for.map((item) => (
                <li key={item}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-white/35">
              Evaluation Verdict
            </h2>
            <p className="mt-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] p-4 text-sm font-medium text-white/90">
              <RichText text={skill.verdict} />
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="glass rounded-3xl p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
                Limitations
              </h2>
              {skill.limitations.length > 0 ? (
                <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-white/55">
                  {skill.limitations.map((lim) => (
                    <li key={lim}>
                      <RichText text={lim} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2.5 text-sm text-white/35">None recorded.</p>
              )}
            </div>

            <div className="glass rounded-3xl p-5">
              <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/35">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                Risk &amp; Security
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-white/55">
                <RichText text={skill.risk || 'Review instructions before installing.'} />
              </p>
            </div>
          </div>

          {(skill.installation || skill.notes) && (
            <div className="glass rounded-3xl p-6">
              {skill.installation && (
                <div>
                  <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
                    Installation
                  </h2>
                  <p className="mt-2.5 text-sm text-white/70">
                    <RichText text={skill.installation} />
                  </p>
                </div>
              )}
              {skill.notes && (
                <div className={skill.installation ? 'mt-5 border-t border-white/[0.06] pt-5' : ''}>
                  <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/35">
                    Personal Notes
                  </h2>
                  <p className="mt-2.5 text-sm text-white/70">
                    <RichText text={skill.notes} />
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metadata Sidebar */}
        <aside className="space-y-4">
          <div className="glass rounded-3xl p-5">
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Metadata
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-white/40">Author</dt>
                <dd className="font-mono font-medium text-white/85">{skill.author}</dd>
              </div>
              {skill.stars !== null && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-white/40">GitHub Stars</dt>
                  <dd className="font-mono font-semibold text-amber-400">
                    ★ {skill.stars.toLocaleString()}
                  </dd>
                </div>
              )}
              {skill.last_pushed && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-white/40">Repo Activity</dt>
                  <dd className="font-mono text-xs text-white/75">{skill.last_pushed}</dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <dt className="text-white/40">Security</dt>
                <dd>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${securityMeta.badgeClass}`}>
                    <Shield className="h-3 w-3" />
                    {securityMeta.label}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-white/40">Tested</dt>
                <dd className="font-mono text-xs text-white/75">
                  {skill.tested ? 'Yes (Verified)' : 'Not personally tested'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-white/40">License</dt>
                <dd className="font-mono text-xs text-white/75">{skill.license}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-white/40">Source Type</dt>
                <dd className="font-mono text-xs text-white/75">{skill.source_type}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-white/40">Added</dt>
                <dd className="font-mono text-xs text-white/75">{skill.added}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-white/40">Last Reviewed</dt>
                <dd className="font-mono text-xs text-white/75">{skill.last_reviewed}</dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-white/[0.06] pt-4">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Categories
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skill.categories.map((catId) => {
                  const cat = getCategoryById(catId);
                  return (
                    <Link
                      key={catId}
                      to={`/category/${catId}`}
                      className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/70 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
                    >
                      {cat && <CategoryIcon name={cat.icon} className="h-3 w-3" />}
                      {cat ? cat.name : catId}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Compatible Agents
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skill.compatible_agents.map((ag) => (
                  <Link
                    key={ag}
                    to={`/explore?agent=${encodeURIComponent(ag)}`}
                    className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 font-mono text-xs text-white/60 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
                  >
                    {ag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Tags
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skill.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/explore?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-white/[0.04] px-2.5 py-0.5 font-mono text-xs text-white/45 hover:bg-white/[0.08] hover:text-white/80 transition-colors"
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
          <h2 className="text-lg font-semibold text-white">Related Skills</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {fallbackRelated.map((rel) => (
              <SkillCard key={rel.id} skill={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
