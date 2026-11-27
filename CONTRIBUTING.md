# Contributing to SkillAtlas

Thank you for helping keep **SkillAtlas** accurate, safe, and genuinely useful for choosing AI agent skills.

## Quickest Way to Contribute (No Setup Required)

1. Open the live [**Submit Skill**](https://skillatlas.apondas007890.workers.dev/submit) page.
2. Paste the repository or tool URL, click **Verify URL**, enter a name and a clear 1–3 sentence description of what it does and when to use it.
3. Click **Submit Skill** to open a pre-filled GitHub Issue.

---

## Adding a Skill via Pull Request

1. Copy [`templates/skill-template.md`](templates/skill-template.md) to `skills/<primary_category>/<skill-id>.md`.
2. Fill in the YAML frontmatter and Markdown sections using factual, inspected evidence (never invent metrics or claim `tested: true` unless you personally ran it).
3. Run the validation, security, and build checks before opening a PR:
   ```bash
   npm run validate
   npm run security
   npm run build
   ```

---

## Security & Quality Rules

- **Verify before indexing:** Confirm the repository exists, is not archived, and has a valid `http://` or `https://` source URL.
- **Audit third-party skills:** Before marking a skill `security: verified`, inspect its `SKILL.md`, scripts, and permissions using [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) or a manual review. Default new entries to `security: unverified`.
- **Dependency hygiene:** Always run `npm run security` (`npm audit --audit-level=moderate`) after adding or updating any package.

---

## Schema Reference

### Valid Primary Categories (14)

`coding` · `agents` · `mcp` · `security` · `devops` · `design` · `automation` · `research` · `image-video` · `youtube` · `audio-music` · `business` · `productivity` · `other`

### Valid Agents (`compatible_agents`)

`claude-code` · `gemini-cli` · `codex` · `cursor` · `github-copilot` · `windsurf` · `cline` · `opencode` · `kiro` · `antigravity` · `roo-code` · `aider`

### Classifications (`status`)

| Status | Meaning |
| --- | --- |
| `excellent` | Exceptionally useful, well-documented, high-signal |
| `good` | Practical, reliable, worth keeping |
| `promising` | Interesting potential, still maturing |
| `experimental` | Early-stage or experimental |
| `neutral` | Situational usefulness |
| `needs-review` | Insufficient evidence or unclear documentation |
| `bad` | Low-quality, broken, or redundant |
| `risky` | Security concerns or dangerous permissions |
| `archived` | Outdated or unmaintained |

---

## Commit Convention

Use conventional commits: `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`, `refactor: ...`.
