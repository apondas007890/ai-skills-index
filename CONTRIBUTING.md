# Contributing & Maintenance Guide

This repository is a personal, curated AI Skills Library backed by human-readable Markdown files and a static React catalog (**SkillAtlas**).

## Adding a Skill

1. Copy `templates/skill-template.md` into `skills/<primary_category>/<skill-id>.md`.
2. Fill in the YAML frontmatter and Markdown sections using factual, inspected evidence.
3. Never claim a skill was personally tested unless you actually ran it (`tested: true`).
4. Run validation, security check, and index generation:
   ```bash
   npm run validate
   npm run security
   npm run build:index
   ```

## Pre-Install Security Policy

- Always run `npm run security` after adding or updating npm packages.
- Before executing third-party `SKILL.md` repositories or MCP servers locally, scan them with [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) or manually inspect their instructions, scripts, and network/file permissions.
- Keep `tested: false` and `security: unverified` unless you have personally verified the skill.

## Valid Classifications (`status`)

- `excellent` — Exceptionally useful, high-quality, well-designed, prioritize
- `good` — Useful, practical, reliable, worth keeping
- `promising` — Interesting potential, not yet sufficiently tested or mature
- `experimental` — Unusual, innovative, early-stage, good for experimentation
- `neutral` — Usefulness depends heavily on the specific use case
- `needs-review` — Insufficient evidence, incomplete docs, or questionable claims
- `bad` — Low quality, broken, redundant, or misleading
- `risky` — Security concerns, suspicious instructions, or dangerous permissions
- `archived` — Outdated, abandoned, or retained for historical reference

## Valid Primary Categories

`coding`, `design`, `youtube`, `agents`, `image-video`, `audio-music`, `research`, `automation`, `business`, `productivity`, `other`

## Commit Convention

Use conventional commits grouped by feature:

- `feat: ...`
- `fix: ...`
- `docs: ...`
- `chore: ...`
- `refactor: ...`
