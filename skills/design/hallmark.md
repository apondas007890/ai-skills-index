---
id: hallmark
name: Hallmark
source: 'https://github.com/nutlope/hallmark'
author: nutlope
primary_category: design
categories:
  - design
  - coding
tags:
  - ui
  - ux
  - anti-slop
  - design-system
  - visual-linting
  - typography
compatible_agents:
  - claude-code
  - codex
  - cursor
  - opencode
status: excellent
quality: 9
security: unverified
added: 2026-11-27T00:00:00.000Z
last_reviewed: 2026-11-27T00:00:00.000Z
source_type: github
license: MIT
stars: 61617
last_pushed: '2026-11-11'
install_command: npx skills add nutlope/hallmark -g
tested: false
featured: true
---
# Hallmark

## Description

A purpose-built UI/UX design skill by Nutlope that replaces generic AI "template slop" with curated visual themes, intentional typography, and automated browser linting (`sloplint`).

## What it does

Provides structured modes including `/hallmark redesign`, `/hallmark audit`, and `Study` alongside dozens of visual themes and Puppeteer-based multi-viewport checks to catch layout flaws and AI UI clichés.

## Best for

- Redesigning existing web apps with cohesive typography and deliberate color systems
- Running `/hallmark audit` to catch generic AI UI anti-patterns
- Extracting design DNA from reference URLs or screenshots

## Verdict

EXCELLENT — pairs strong thematic design craft with automated browser-level visual linting (`sloplint`).

## Limitations

- Automated `sloplint` checks require a local Node/Puppeteer browser environment.
- Public repository documentation reviewed; not personally executed via CLI.

## Risk

MIT-licensed skill package; review skill prompts and scripts before running globally.

## Installation

`npx skills add nutlope/hallmark -g`

## Notes

Used alongside `AntiSlopUI` to guide SkillAtlas's visual redesign (editorial typography, crisp surfaces, and semantic highlighters).
