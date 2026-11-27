<div align="center">

# SkillAtlas

**Curated discovery engine and evaluation index for 1,094+ AI agent skills (`SKILL.md` modules, workflows, and skill collections) — skills only, no courses or unrelated tools.**

[![Live on Cloudflare Workers](https://img.shields.io/badge/Live-Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://skillatlas.apondas007890.workers.dev/)
[![Live on GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://apondas007890.github.io/ai-skills-index/)
[![Indexed Skills](https://img.shields.io/badge/Skills-1%2C094%2B%20Verified-2563EB?style=for-the-badge)](https://skillatlas.apondas007890.workers.dev/explore)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

[**Open Catalog**](https://skillatlas.apondas007890.workers.dev/) · [**Browse & Filter**](https://skillatlas.apondas007890.workers.dev/explore) · [**Submit a Skill**](https://skillatlas.apondas007890.workers.dev/submit) · [**GitHub Mirror**](https://apondas007890.github.io/ai-skills-index/)

</div>

---

## What is SkillAtlas?

Finding reliable AI agent skills across GitHub bookmarks, `SKILL.md` repos, and MCP directories wastes time — and installing unvetted skills blindly is a security risk.

**SkillAtlas** brings **1,094+ verified AI agent skill repositories** into one fast, searchable static catalog:
- **Verified against GitHub:** Non-archived, non-forked repositories with live star counts, SPDX licenses, and recent activity dates.
- **Evaluated for selection:** Every skill includes a quality score (`1–10`), status (`Excellent`, `Good`, `Promising`, `Needs Review`, `Risky`), compatible AI tools, and plain-English capabilities so you can pick the right skill in seconds.
- **Zero database, zero backend:** Every entry lives as a Markdown file in [`skills/`](skills/), compiled to static JSON and deployed automatically to **Cloudflare Workers** and **GitHub Pages**.

---

## Live Deployments

| Host | URL | Best For |
| --- | --- | --- |
| **Cloudflare Workers** | [**skillatlas.apondas007890.workers.dev**](https://skillatlas.apondas007890.workers.dev/) | Clean root URLs, edge caching, SPA routing |
| **GitHub Pages** | [**apondas007890.github.io/ai-skills-index**](https://apondas007890.github.io/ai-skills-index/) | Open-source mirror with daily automated star sync |

---

## Supported AI Coding Agents (12)

Filter skills by tool compatibility across:
`claude-code` · `gemini-cli` · `codex` · `cursor` · `github-copilot` · `windsurf` · `cline` · `opencode` · `kiro` · `antigravity` · `roo-code` · `aider`

---

## Categories (14)

| Category | What You'll Find |
| --- | --- |
| **Coding & Development** | Engineering workflows, TDD, debugging, code review, refactoring, architecture |
| **AI & Agents** | Multi-agent orchestration, prompt engineering, memory, RAG, skill directories |
| **MCP Servers & Tools** | Model Context Protocol servers, API bridges, database & browser connectors |
| **Security & Auditing** | Skill vetting, static analysis, AppSec, smart-contract auditing, OSINT |
| **DevOps & Cloud** | Kubernetes, Docker, Terraform, CI/CD, observability |
| **UI/UX & Design** | Design systems, anti-slop rules, accessibility, Figma, typography |
| **Automation & Scraping** | Browser automation, web scraping, crawling, workflow engines |
| **Research & Science** | Deep research, academic papers, data analysis, benchmarks |
| **Image & Video** | Video editing, Remotion motion graphics, image generation, 3D |
| **YouTube & Content** | Video scripts, hooks, thumbnails, titles, Shorts, channel growth |
| **Audio & Music** | Voice synthesis, transcription, audio editing, podcasting |
| **Business & Marketing** | SEO, AEO, product management, finance, sales |
| **Productivity & Docs** | Planning, technical writing, notes, resumes, knowledge bases |
| **Other** | Cross-domain or experimental utilities |

---

## Submit a Skill

Have a useful `SKILL.md` repo, MCP server, or AI tool URL?

1. Visit the [**Submit Skill**](https://skillatlas.apondas007890.workers.dev/submit) page.
2. Paste any valid URL (GitHub repos are verified live for stars, license, and status), enter a name and short description.
3. Click **Submit Skill** to save a local draft and open a pre-filled GitHub Issue for security review and indexing.

---

## Security & Verification

- **Automated Screening:** Every push runs [`scripts/security-check.mjs`](scripts/security-check.mjs) across all skill files plus `npm audit --audit-level=moderate`.
- **Pre-Install Caution:** Before running third-party `SKILL.md` scripts or MCP servers locally, inspect them with [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) or audit their permissions manually.
- **Daily Star Sync:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) refreshes GitHub star counts and repo activity daily at 06:00 UTC.

---

<details>
<summary>Maintainer CLI Reference</summary>

```bash
npm install && npm --prefix website install
npm run validate      # Validate all skill Markdown frontmatter & sections
npm run security      # Scan skill files for risky patterns + npm audit
npm run sync:stars    # Refresh GitHub stars & repo activity
npm run build         # Validate, build JSON index, and compile website
```

</details>

## License

[MIT](LICENSE) — see [CONTRIBUTING.md](CONTRIBUTING.md) to add or evaluate skills.
