# AI Skills Index — SkillAtlas

Personal AI Skills Library, Evaluation Knowledge Base, and Static Discovery Engine.

This repository is the single source of truth for every AI agent skill, prompt framework, MCP server, and automation tool I discover, investigate, evaluate, and keep for future projects. No external database, no backend, no paid search API — just structured Markdown files, automated validation, and a fast static website (**SkillAtlas**) deployed on GitHub Pages.

## Quick Navigation

- [Repository Structure](#repository-structure)
- [Classification System](#classification-system)
- [Categories](#categories)
- [Adding & Evaluating Skills](#adding--evaluating-skills)
- [How Search Works](#how-search-works)
- [Running Locally](#running-locally)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Security Considerations](#security-considerations)

## Repository Structure

```text
ai-skills-index/
├── .github/workflows/
│   └── deploy.yml              # Validates skills, builds index, deploys to GitHub Pages
├── data/
│   ├── categories-config.json  # Category definitions & subcategories
│   ├── skills.json             # Generated searchable index (from skills/*.md)
│   ├── categories.json         # Generated category counts
│   ├── tags.json               # Generated tag counts
│   └── sources.json            # Generated source-type counts
├── inbox/
│   ├── README.md               # Inbox workflow guide
│   └── inbox.md                # Drop candidate skill URLs here to investigate
├── scripts/
│   ├── skill-parser.mjs        # Shared Markdown/YAML frontmatter parser
│   ├── validate-skills.mjs     # Schema, duplicate, URL, and date validator
│   └── build-index.mjs         # Builds JSON index + related skills graph
├── skills/
│   ├── coding/                 # Coding & Development skills
│   ├── design/                 # UI/UX & Design skills
│   ├── automation/             # Automation & Scraping skills
│   ├── research/               # Research & Discovery skills
│   └── ...                     # Other category folders
├── templates/
│   └── skill-template.md       # Standard Markdown + YAML template
├── website/                    # SkillAtlas React + Vite + TypeScript + Tailwind app
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

## Classification System

Every skill is evaluated on evidence (source code, `SKILL.md`, documentation, dependencies, maintenance, and risks) rather than stars alone:

| Status | Meaning |
| --- | --- |
| `excellent` | Exceptionally useful, high-quality, well-designed, worth prioritizing |
| `good` | Useful, practical, reasonably reliable, worth keeping |
| `promising` | Interesting potential, not yet sufficiently tested or mature |
| `experimental` | Unusual, innovative, early-stage, useful for experimentation |
| `neutral` | Not bad, usefulness depends heavily on the specific use case |
| `needs-review` | Insufficient evidence, incomplete docs, or questionable claims |
| `bad` | Low-quality, broken, redundant, or misleading |
| `risky` | Security concerns, suspicious instructions, or dangerous permissions |
| `archived` | Outdated, abandoned, or retained for historical reference |

## Categories

- `coding` — Coding & Development
- `design` — UI/UX & Design
- `youtube` — YouTube & Content Creation
- `agents` — AI & Agents
- `image-video` — Image & Video
- `audio-music` — Audio & Music
- `research` — Research
- `automation` — Automation
- `business` — Business & Marketing
- `productivity` — Productivity
- `other` — Other

## Adding & Evaluating Skills

1. **Direct via Agent**: Paste one or more URLs in chat and ask *"Investigate these skills and add the good ones to my library."*
2. **Via Inbox**: Add URLs to [inbox/inbox.md](inbox/inbox.md) and ask *"Process the inbox."*
3. **Manually**: Copy [templates/skill-template.md](templates/skill-template.md) to `skills/<primary_category>/<skill-id>.md`, fill in the metadata and factual evaluation, and run:

```bash
npm run validate
npm run build:index
```

## How Search Works

SkillAtlas runs 100% client-side in the browser using `website/src/lib/search.ts`:

- Weighted token + fuzzy subsequence matching across skill name, tags, categories, compatible agents, `best_for`, description, verdict, and personal notes.
- Multi-facet filtering by category, classification status, compatible agent, source type, and tags.
- Instant keyboard shortcuts: press `/` or `Ctrl+K` (`Cmd+K` on macOS) anywhere to jump to search.

## Running Locally

```bash
# 1. Install root and website dependencies
npm install
npm --prefix website install

# 2. Validate skill entries and build the JSON index
npm run validate
npm run build:index

# 3. Start the local dev server
npm run dev
```

To run a full production build:

```bash
npm run build
```

## Deploying to GitHub Pages

1. Push this repository (`main` branch) to `https://github.com/apondas007890/ai-skills-index`.
2. In GitHub: **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Every push to `main` automatically runs `npm run build` (validating all skills, rebuilding the index, compiling TypeScript/Vite) and publishes `website/dist` to GitHub Pages.

## Security Considerations

- Entries marked `security: unverified` or `tested: false` have not been executed locally.
- Always inspect `SKILL.md` instructions, MCP server permissions, and external scripts before installing them into your agent environment.
- Optional research tools (such as Scrapling MCP, ScrapeGraphAI, or Agent-Reach) are never required by the static website.
