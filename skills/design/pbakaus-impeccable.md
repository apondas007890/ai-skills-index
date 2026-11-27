---
id: pbakaus-impeccable
name: Impeccable
source: 'https://github.com/pbakaus/impeccable'
author: pbakaus
primary_category: design
categories:
  - design
  - agents
tags:
  - agent-skills
  - frontend-design
  - anti-slop
  - accessibility
  - typography
compatible_agents:
  - claude-code
  - codex
  - cursor
  - gemini-cli
status: excellent
quality: 9
security: unverified
added: '2026-11-27'
last_reviewed: '2026-11-27'
source_type: github
license: Apache-2.0
stars: 117527
last_pushed: '2026-11-26'
install_command: 'npx impeccable install'
tested: false
featured: true
---
# Impeccable

## Description

Gives AI coding agents a structured frontend design workflow to critique interfaces, audit accessibility and responsiveness, steer visual polish (`bolder`, `quieter`, `polish`), and catch generic AI UI patterns before shipping.

## What it does

Equips coding agents with targeted UI/UX commands (`critique`, `audit`, `polish`, `bolder`, `quieter`, `harden`), project design-context setup (`PRODUCT.md` and `DESIGN.md`), and deterministic anti-slop checks that flag cramped spacing, skipped headings, and layout flaws without needing an external LLM API key.

## Best for

- Refining existing UI components, landing pages, and dashboards with coding agents
- Running structured usability critiques and accessibility/responsive audits before release
- Capturing a consistent `DESIGN.md` style guide for your project
- Not meant for backend services, database pipelines, or non-UI engineering tasks

## Verdict

EXCELLENT — comprehensive frontend design vocabulary and deterministic quality checks backed by active maintenance (Apache-2.0).

## Limitations

- Focused strictly on frontend UI/UX and design systems; not useful for backend-only projects.
- Metadata and public documentation reviewed; inspect `SKILL.md` and any CLI/browser hooks before running locally.

## Risk

Apache-2.0 repository; review `SKILL.md`, scripts, and local browser-hook permissions (for example with `NVIDIA/SkillSpector`) before installing globally.

## Installation

Run `npx impeccable install` or inspect the `SKILL.md` modules directly in https://github.com/pbakaus/impeccable.
