---
id: skill-spector
name: NVIDIA SkillSpector
source: 'https://github.com/NVIDIA/SkillSpector'
author: NVIDIA
primary_category: mcp
categories:
  - coding
  - agents
  - mcp
tags:
  - security-scanner
  - prompt-injection
  - yara
  - static-analysis
  - mcp-security
  - supply-chain
compatible_agents:
  - claude-code
  - codex
  - cursor
  - gemini-cli
status: excellent
quality: 9
security: verified
added: 2026-11-27T00:00:00.000Z
last_reviewed: 2026-11-27T00:00:00.000Z
source_type: github
license: Apache-2.0
stars: 27801
last_pushed: '2026-11-25'
install_command: ''
tested: false
featured: true
---
# NVIDIA SkillSpector

## Description

Open-source security scanner by NVIDIA that audits third-party AI agent skills, `SKILL.md` repos, and `MCP` servers for prompt injection, data exfiltration, and malicious code before installation.

## What it does

Combines fast static analysis (AST inspection, regex, `YARA` rules, taint tracking, and `OSV.dev` vulnerability checks) with an optional LLM semantic evaluation layer to catch hidden risks and reduce false positives.

## Best for

- Auditing untrusted `SKILL.md` or `MCP` servers before adding them to your environment
- Detecting prompt injection, hidden exfiltration, or dangerous `eval`/`exec` patterns
- Integrating automated skill security gates via `skillspector-action` in GitHub Actions

## Verdict

EXCELLENT — essential security guardrail for anyone collecting and testing third-party AI skills.

## Limitations

- Optional LLM semantic layer requires configuring a model endpoint.
- Public repository documentation reviewed; CLI not personally executed in this workspace.

## Risk

Security auditing tool by NVIDIA (`Apache-2.0`); safe to inspect and run in CI/local environments.

## Installation

See `NVIDIA/SkillSpector` on GitHub for CLI and `skillspector-action` setup instructions.

## Notes

Great companion to this library's `security` audit workflow before marking any skill `verified`.
