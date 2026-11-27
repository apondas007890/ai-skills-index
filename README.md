# SkillAtlas — Curated AI Skills Index

**Browse Live:** [**apondas007890.github.io/ai-skills-index**](https://apondas007890.github.io/ai-skills-index/)

SkillAtlas is an open, Git-backed directory and evaluation index for **1,337+ verified AI agent skills** (`SKILL.md` modules, MCP servers, security tools, and coding workflows) across **14 categories** and **12 AI coding agents**.

---

## Why SkillAtlas?

- **Verified Repositories Only:** Every entry is checked against GitHub for existence, non-archived status, license, live star counts, and recent activity.
- **Evaluated & Categorized:** Skills are scored (`1–10`), classified (`Excellent`, `Good`, `Promising`, `Needs Review`, `Risky`), and organized into 14 focused categories.
- **Multi-Agent Compatibility:** Filter instantly across `claude-code`, `gemini-cli`, `codex`, `cursor`, `github-copilot`, `windsurf`, `cline`, `opencode`, `kiro`, `antigravity`, `roo-code`, and `aider`.
- **Zero-Database Static Architecture:** Everything lives as human-readable Markdown in `skills/`, indexed to static JSON and published automatically to GitHub Pages.

---

## Categories (14)

| Category | Focus |
| --- | --- |
| **Coding & Development** | Frontend, backend, TDD, debugging, code review, architecture |
| **AI & Agents** | Agent frameworks, multi-agent orchestration, RAG, skill directories |
| **MCP Servers & Tools** | Model Context Protocol servers, API bridges, database/browser connectors |
| **Security & Auditing** | Skill vetting, static analysis, smart-contract & AppSec auditing |
| **DevOps & Cloud** | Kubernetes, Docker, Terraform, CI/CD, observability |
| **UI/UX & Design** | Design systems, accessibility, Figma, anti-generic UI rules |
| **Automation & Scraping** | Browser automation, web scraping, crawling, workflow engines |
| **Research & Science** | Deep research, academic papers, data analysis, benchmarks |
| **Image & Video** | Video editing, Remotion motion graphics, image generation, 3D |
| **YouTube & Content** | Video scripts, thumbnails, titles, Shorts, channel growth |
| **Audio & Music** | Voice synthesis, transcription, audio editing, podcasting |
| **Business & Marketing** | SEO, AEO, product management, finance, sales |
| **Productivity & Docs** | Planning, writing, resumes, personal knowledge workflows |
| **Other** | Cross-domain or experimental utilities |

---

## Submit a Skill

Want to add a skill to the index?

1. Open the [**Submit Skill**](https://apondas007890.github.io/ai-skills-index/submit) page on the website.
2. Paste a GitHub repository URL (`https://github.com/owner/repo`) and click **Verify URL** — the form checks GitHub live for stars, license, and status.
3. Choose a category, compatible agents, and a short 1–3 sentence description, then click **Submit via GitHub Issue**.

---

## Security & Quality Policy

- **Pre-Index Inspection:** Every skill and dependency is screened with `scripts/security-check.mjs` and `npm audit --audit-level=moderate`.
- **Third-Party Skill Caution:** Before running external `SKILL.md` scripts or MCP servers in production, inspect them with [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) or review their permissions manually.
- **Automated Daily Sync:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) syncs live GitHub star counts and repository activity daily at 06:00 UTC and redeploys on every push to `main`.

---

<details>
<summary>Maintainer CLI Reference (for repository contributors)</summary>

```bash
npm install && npm --prefix website install
npm run validate      # Validate all skill Markdown frontmatter & sections
npm run security      # Scan skill files for risky patterns + npm audit
npm run sync:stars    # Refresh GitHub stars & repo activity
npm run build         # Validate, build JSON index, and compile website
```

</details>

## License

[MIT](LICENSE)
