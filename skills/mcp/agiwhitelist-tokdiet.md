---
id: agiwhitelist-tokdiet
name: Tokdiet
source: 'https://github.com/agiwhitelist/tokdiet'
author: agiwhitelist
primary_category: mcp
categories:
  - coding
  - agents
  - mcp
tags:
  - ai-gateway
  - anthropic
  - ccusage
  - claude-code
  - cli
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
license: MIT
stars: 30
last_pushed: '2026-06-18'
install_command: ''
tested: false
featured: false
---
# Tokdiet

## Description

Local streaming reverse proxy between AI coding agents (Claude Code, Cursor, Codex) and model APIs (Anthropic, OpenAI, Gemini, MiniMax). Meters every token + USD cost, compacts bloated context to cut pay-per-token API spend, and runs shadow-eval to prove quality held. ccusage-style metering + live local dashboard.

## What it does

Provides Model Context Protocol (MCP) server integrations or external tool connectors for AI agents. Focused on `ai-gateway`, `anthropic`, `ccusage`, `claude-code` and designed to work with claude-code, codex, cursor, gemini-cli.

## Best for

- **Primary goal:** Local streaming reverse proxy between AI coding agents (Claude Code, Cursor, Codex) and model APIs (Anthropic, OpenAI, Gemini, MiniMax). Meters every token + USD cost, compacts bloated context to cut pay-per-token API spend, and runs shadow-eval to prove quality held. ccusage-style metering + live local dashboard.
- **Works with:** claude-code, codex, cursor, gemini-cli
- **Key topics:** ai-gateway, anthropic, ccusage, claude-code, cli

## Verdict

PROMISING — 30 GitHub stars (MIT license). Review the repository README and `SKILL.md` before adding to your workspace.

## Limitations

- Automated index entry; verify exact install flags and required API keys in the upstream repository.

## Risk

Inspect `SKILL.md`, scripts, and permissions (for example with `NVIDIA/SkillSpector`) before running in production or sensitive workspaces.

## Installation

See the upstream repository for setup instructions: https://github.com/agiwhitelist/tokdiet
