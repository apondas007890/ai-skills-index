---
id: anthropic-skills
name: Anthropic Official Skills
source: 'https://github.com/anthropics/skills'
author: anthropics
primary_category: agents
categories:
  - agents
  - coding
  - design
tags:
  - skill-md
  - skill-creator
  - frontend-design
  - routing-rules
  - reference-architecture
compatible_agents:
  - claude-code
  - codex
  - gemini-cli
status: excellent
quality: 9
security: verified
added: 2026-11-27T00:00:00.000Z
last_reviewed: 2026-11-27T00:00:00.000Z
source_type: github
license: Apache-2.0
install_command: ''
tested: false
featured: true
stars: 201014
last_pushed: '2026-11-16'
---
# Anthropic Official Skills

## Description

Official reference repository defining the open `SKILL.md` pattern, including `skill-creator`, `frontend-design`, and reusable templates for building and routing AI agent capabilities.

## What it does

Establishes the standard `SKILL.md` directory convention where frontmatter `description` acts as a routing trigger ("Use when...") and Markdown instructions guide agent execution.

## Best for

- Learning the canonical `SKILL.md` structure and routing-rule best practices
- Creating and iterating on custom agent skills via `skill-creator`
- Bootstrapping new skills from `skills/template/SKILL.md`

## Verdict

EXCELLENT — the foundational reference architecture for modern `SKILL.md`-based agent ecosystems.

## Limitations

- Primarily serves as a reference collection and template kit rather than a domain-specific tool.
- Documentation reviewed; not all example skills executed locally.

## Risk

Maintained by Anthropic under an open-source license; still inspect individual community forks before trusting them.

## Installation

Browse or clone `anthropics/skills` and copy desired `SKILL.md` folders into your agent's skills directory.

## Notes

Essential reference whenever authoring new skills for this library.
