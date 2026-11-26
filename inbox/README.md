# Skill Inbox

Drop candidate AI skill URLs into `inbox/inbox.md` to queue them for investigation, evaluation, and categorization.

## Format

```markdown
# Skills to investigate

- https://github.com/example/skill-one
- https://github.com/example/skill-two — optional context or why you saved it
```

## Workflow

When you ask your AI agent to **"process the inbox"**:

1. Every URL in `inbox/inbox.md` is inspected (README, `SKILL.md`, source code, license, dependencies, maintenance).
2. Each skill is evaluated honestly using the classification system (`excellent`, `good`, `promising`, `experimental`, `neutral`, `needs-review`, `bad`, `risky`, `archived`).
3. Duplicate URLs or IDs already in `skills/` are detected and skipped or updated.
4. Worthwhile skills are written as Markdown files in `skills/<primary_category>/<id>.md`.
5. `npm run validate && npm run build:index` regenerates `data/skills.json`, `data/categories.json`, `data/tags.json`, and `data/sources.json`.
6. Processed links are removed from `inbox/inbox.md` (or moved to a `Rejected` section if you want to remember why a link was skipped).
