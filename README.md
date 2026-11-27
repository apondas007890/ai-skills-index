# SkillAtlas — Personal AI Skills Index

**Live Website:** [https://apondas007890.github.io/ai-skills-index/](https://apondas007890.github.io/ai-skills-index/)

A personal, Git-backed knowledge base and static discovery website for collecting, evaluating, categorizing, and searching AI agent skills (`SKILL.md` modules, MCP servers, and workflow tools) across `claude-code`, `gemini-cli`, `codex`, `cursor`, `cline`, `kiro`, `opencode`, and `windsurf`.

No external database. No backend server. Every skill is stored as a human-readable Markdown file under `skills/`, validated by automated scripts, enriched with live GitHub star counts, indexed into static JSON, and published to GitHub Pages.

## What This Solves

- **Stop losing useful skills** across bookmarks, GitHub stars, and social posts.
- **Know what a skill actually does** with concise 1–3 sentence descriptions, `What it does`, `Best for`, `Limitations`, and `Risk` notes.
- **Evaluate before trusting**: Every entry carries an evidence-based classification (`excellent`, `good`, `promising`, `experimental`, `neutral`, `needs-review`, `bad`, `risky`, `archived`) and security status (`verified`, `unverified`, `caution`, `risky`).
- **Find anything in seconds**: Client-side weighted + fuzzy search across names, descriptions, tags, categories, compatible agents, and personal notes.

## Quick Start (Online — Zero Local Setup)

1. Push `main` to `https://github.com/apondas007890/ai-skills-index`.
2. In GitHub: **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Every push or web edit on `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which validates all skills, builds the JSON index, compiles the Vite + React site, and deploys to GitHub Pages.

## Running Locally

```bash
# Install dependencies
npm install
npm --prefix website install

# Validate skill metadata, run security audit, and build JSON index
npm run validate
npm run security
npm run build:index

# Start local dev server
npm run dev
```

To create a production build:

```bash
npm run build
```

## Repository Layout

```text
ai-skills-index/
├── .github/workflows/
│   └── deploy.yml              # Validate + build + GitHub Pages deploy
├── data/
│   ├── categories-config.json  # 11 canonical categories & subcategories
│   ├── skills.json             # Generated searchable index
│   ├── categories.json         # Generated category counts
│   ├── tags.json               # Generated tag counts
│   └── sources.json            # Generated source-type counts
├── inbox/
│   ├── README.md               # Inbox processing instructions
│   └── inbox.md                # Drop candidate URLs here for review
├── scripts/
│   ├── skill-parser.mjs        # Shared frontmatter & section parser
│   ├── validate-skills.mjs     # Schema, duplicate, URL, and date checks
│   ├── security-check.mjs      # Skill safety + npm audit gate
│   ├── sync-github-stats.mjs   # Syncs GitHub stars, licenses, and push dates
│   └── build-index.mjs         # Generates JSON index + related skills
├── skills/
│   ├── agents/                 # Agent frameworks & skill directories
│   ├── automation/             # Scrapers, MCP tools, workflow automation
│   ├── business/               # Product, SEO, marketing
│   ├── coding/                 # Engineering, TDD, code review, security
│   ├── design/                 # UI/UX, anti-slop systems, typography
│   ├── image-video/            # Programmatic video, Remotion, storyboarding
│   ├── other/                  # Niche or cross-domain tools
│   ├── research/               # Web research & scientific skills
│   └── youtube/                # Scripts, hooks, thumbnails, packaging
├── templates/
│   └── skill-template.md       # Standard skill entry template
├── website/                    # SkillAtlas React + TypeScript + Tailwind SPA
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

## Security & Pre-Install Policy

- **Never install blindly**: Check any new npm dependency with `npm run security` (`npm audit --audit-level=moderate`).
- **Audit third-party skills**: Before executing or trusting third-party `SKILL.md` repos or MCP servers, inspect them with [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) (or review their `SKILL.md`, scripts, and permissions manually).
- **Minimal dependencies**: Keep root and `website/` dependencies lean and remove unused build artifacts or packages.

## License

[MIT](LICENSE)
