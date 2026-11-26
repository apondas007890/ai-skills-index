---
id: superpowers
name: Superpowers
source: 'https://github.com/obra/superpowers'
author: obra
primary_category: coding
categories:
  - coding
  - agents
tags:
  - tdd
  - systematic-debugging
  - brainstorming
  - planning
  - workflow
  - agent-discipline
compatible_agents:
  - claude-code
  - codex
  - cursor
  - gemini-cli
status: excellent
quality: 9
security: unverified
added: 2026-11-27T00:00:00.000Z
last_reviewed: 2026-11-27T00:00:00.000Z
source_type: github
license: MIT
install_command: ''
tested: false
featured: true
stars: 327436
last_pushed: '2026-11-26'
---
# Superpowers

## Description

An agentic software engineering framework that enforces `TDD`, `systematic-debugging`, `brainstorming`, and `writing-plans` through composable `SKILL.md` modules so coding agents work like disciplined engineers.

## What it does

Bootstraps agents with a `using-superpowers` routing discipline that requires checking and following structured `SKILL.md` workflows before writing code or answering implementation questions.

## Best for

- Enforcing test-driven development and root-cause debugging
- Breaking complex features into explicit `writing-plans` and `executing-plans` steps
- Authoring new skills with `writing-skills` TDD checks

## Verdict

EXCELLENT — one of the most structured, battle-tested agent workflow skill suites for serious software engineering.

## Limitations

- Adds workflow overhead for trivial one-line edits unless scoped appropriately.
- Public repository documentation reviewed; not personally executed as a standalone plugin.

## Risk

Pure Markdown skill instructions and workflow rules; review bootstrap hooks before enabling globally.

## Installation

See the `obra/superpowers` GitHub repository for plugin/skill installation instructions.

## Notes

Pair with `ponytail` to combine disciplined TDD/debugging workflows with minimal-code restraint.
