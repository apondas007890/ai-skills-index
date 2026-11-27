---
id: shenli-ramet
name: Ramet
source: 'https://github.com/shenli/ramet'
author: shenli
primary_category: mcp
categories:
  - coding
  - agents
  - mcp
tags:
  - agent-infrastructure
  - agents
  - evaluation
  - filesystem
  - golang
compatible_agents:
  - claude-code
  - codex
  - cursor
  - gemini-cli
status: promising
quality: 6
security: unverified
added: '2026-11-27'
last_reviewed: '2026-11-27'
source_type: github
license: Apache-2.0
stars: 6
last_pushed: '2026-11-20'
install_command: ''
tested: false
featured: false
---
# Ramet

## Description

Persistent, forkable workspaces for AI agents. Git-aware snapshots, verified resets, and control over what survives across sessions.

## What it does

Provides Model Context Protocol (MCP) server integrations or external tool connectors for AI agents. Focused on `agent-infrastructure`, `agents`, `evaluation`, `filesystem` and designed to work with claude-code, codex, cursor, gemini-cli.

## Best for

- **Primary goal:** Persistent, forkable workspaces for AI agents. Git-aware snapshots, verified resets, and control over what survives across sessions.
- **Works with:** claude-code, codex, cursor, gemini-cli
- **Key topics:** agent-infrastructure, agents, evaluation, filesystem, golang

## Verdict

PROMISING — 6 GitHub stars (Apache-2.0 license). Review the repository README and `SKILL.md` before adding to your workspace.

## Limitations

- Automated index entry; verify exact install flags and required API keys in the upstream repository.

## Risk

Inspect `SKILL.md`, scripts, and permissions (for example with `NVIDIA/SkillSpector`) before running in production or sensitive workspaces.

## Installation

See the upstream repository for setup instructions: https://github.com/shenli/ramet
