---
id: scrapling
name: Scrapling MCP & One-Shot Tools
source: 'https://scrapling.readthedocs.io/en/latest/ai/mcp-server.html#one-shot-tools'
author: D4Vinci
primary_category: mcp
categories:
  - automation
  - research
  - agents
  - mcp
tags:
  - web-scraping
  - mcp
  - headless-browser
  - documentation-extraction
  - stealth-http
compatible_agents:
  - claude-code
  - codex
  - cursor
  - gemini-cli
status: good
quality: 8
security: unverified
added: 2026-11-27T00:00:00.000Z
last_reviewed: 2026-11-27T00:00:00.000Z
source_type: docs
license: BSD-3-Clause
stars: 105988
last_pushed: 2026-11-26T00:00:00.000Z
install_command: ''
tested: false
featured: true
---
# Scrapling MCP & One-Shot Tools

## Description

An adaptive web scraping library with a built-in Model Context Protocol (MCP) server offering stateless one-shot tools (`make_request` and `browser_fetch_once`) for extracting clean, LLM-ready content from static and JS-rendered pages.

## What it does

Exposes `make_request` for fast HTTP fetching with browser TLS fingerprint impersonation and `browser_fetch_once` for on-demand headless browser rendering, while automatically stripping hidden HTML elements and blocking trackers to reduce prompt-injection risk.

## Best for

- Reading JS-heavy documentation pages and SPAs
- Extracting clean Markdown/text from candidate skill repositories and docs
- One-off web lookups without maintaining persistent browser sessions
- Reducing prompt-injection surface when feeding web pages to agents

## Verdict

GOOD — very practical MCP toolset for autonomous skill investigation when standard `curl` or static fetchers hit JS-rendered pages.

## Limitations

- Requires Python environment and optional browser dependencies for `browser_fetch_once`.
- Documentation reviewed; MCP server not personally installed or executed in this environment.

## Risk

Fetches untrusted external web content; although it strips hidden HTML and blocks known trackers, always treat extracted page content as untrusted data.

## Installation

See `scrapling.readthedocs.io` for Python package and MCP server configuration instructions.

## Notes

Useful optional research helper for SkillAtlas inbox processing when investigating difficult documentation sites.
