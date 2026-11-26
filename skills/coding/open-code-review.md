---
id: open-code-review
name: Alibaba Open Code Review
source: 'https://github.com/alibaba/open-code-review'
author: alibaba
primary_category: coding
categories:
  - coding
  - agents
tags:
  - code-review
  - security
  - static-analysis
  - pr-review
  - enterprise
compatible_agents:
  - claude-code
  - codex
  - cursor
status: good
quality: 8
security: unverified
added: 2026-11-27T00:00:00.000Z
last_reviewed: 2026-11-27T00:00:00.000Z
source_type: github
license: Apache-2.0
stars: 56630
last_pushed: '2026-11-26'
install_command: ''
tested: false
featured: false
---
# Alibaba Open Code Review

## Description

An enterprise-grade hybrid code review system combining deterministic static pipelines with LLM agent skills for precise line-level PR feedback and security checks.

## What it does

Runs deterministic diff/AST checks alongside modular agent skills to catch bugs, style violations, and security issues directly on pull requests.

## Best for

- Automated pull request review and security gating
- Combining deterministic linters with LLM reasoning
- Large team code-review workflows

## Verdict

GOOD — strong hybrid architecture (`56k+` stars, `Apache-2.0`, actively maintained) that avoids pure-LLM review noise.

## Limitations

- Heavier setup than lightweight prompt-only review skills like `ponytail`.
- Repository summary reviewed; not personally deployed.

## Risk

Apache-2.0 open-source project; review CI/CD webhook tokens and LLM provider configuration.

## Installation

See `alibaba/open-code-review` on GitHub for CLI and CI setup.

## Notes

Discovered via `github.com/topics/agent-skills`.
