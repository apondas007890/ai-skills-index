---
id: agentplugins-agent-plugins-spec
name: Agent Plugins Spec
source: 'https://github.com/agentplugins/agent-plugins-spec'
author: agentplugins
primary_category: mcp
categories:
  - agents
  - mcp
tags:
  - agent-plugins
  - agent-skills
  - ai-agents
  - mcp
  - specification
compatible_agents:
  - claude-code
  - codex
  - cursor
  - gemini-cli
status: good
quality: 8
security: unverified
added: '2026-11-27'
last_reviewed: '2026-11-27'
source_type: github
license: Unknown
stars: 1484
last_pushed: '2026-11-20'
install_command: ''
tested: false
featured: false
---
# Agent Plugins Spec

## Description

Agent Plugins — An open standard for packaging agent extensions as distributable plugins

## What it does

Provides Model Context Protocol (MCP) server integrations or external tool connectors for AI agents. Focused on `agent-plugins`, `agent-skills`, `ai-agents`, `mcp` and designed to work with claude-code, codex, cursor, gemini-cli.

## Best for

- **Primary goal:** Agent Plugins — An open standard for packaging agent extensions as distributable plugins
- **Works with:** claude-code, codex, cursor, gemini-cli
- **Key topics:** agent-plugins, agent-skills, ai-agents, mcp, specification

## Verdict

GOOD — 1,484 GitHub stars (Unknown license). Review the repository README and `SKILL.md` before adding to your workspace.

## Limitations

- Automated index entry; verify exact install flags and required API keys in the upstream repository.

## Risk

Inspect `SKILL.md`, scripts, and permissions (for example with `NVIDIA/SkillSpector`) before running in production or sensitive workspaces.

## Installation

See the upstream repository for setup instructions: https://github.com/agentplugins/agent-plugins-spec
