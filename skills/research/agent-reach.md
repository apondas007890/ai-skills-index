---
id: agent-reach
name: Agent-Reach
source: https://github.com/Panniantong/agent-reach
author: Panniantong
primary_category: research
categories:
  - research
  - automation
  - agents
tags:
  - web-research
  - social-search
  - github-discovery
  - youtube-search
  - mcp
  - cli
compatible_agents:
  - claude-code
  - codex
  - cursor
status: promising
quality: 8
security: caution
added: 2026-11-27
last_reviewed: 2026-11-27
source_type: github
license: MIT
stars: 115047
last_pushed: 2026-11-24
install_command: "npx skills add Panniantong/Agent-Reach@agent-reach"
tested: false
featured: true
---

# Agent-Reach

## Description

A unified CLI and MCP capability layer that gives AI agents zero-API-fee access to read and search GitHub, YouTube, Reddit, Twitter/X, Bilibili, and other platforms through bundled scrapers and public endpoints.

## What it does

Standardizes multi-platform web and social search behind a single `agent-reach` JSON CLI and MCP server, including a `agent-reach doctor` diagnostic command to verify and repair underlying toolchains.

## Best for

- Discovering emerging AI skills across GitHub, Reddit, and YouTube
- Researching developer discussions without paying for multiple platform APIs
- Giving coding agents unified search across social and video platforms

## Verdict

PROMISING — high discovery value for finding new skills across GitHub and social discussions without paid API keys, though multi-platform scrapers require careful maintenance and trust review.

## Limitations

- Relies on third-party scrapers and public endpoints that can break when platforms change.
- Some platforms may require local browser cookies or extra CLI tools.
- Documentation reviewed; not personally installed or tested.

## Risk

Caution advised: bundles multiple external scrapers and may use local cookies for authenticated platforms. Inspect `~/.agent-reach/` configuration and source scripts before granting access to sensitive accounts.

## Installation

`npx skills add Panniantong/Agent-Reach@agent-reach` (verify source repository before running).

## Notes

Ideal candidate for autonomous skill discovery workflows ("find new skills for YouTube / Codex / UI").
