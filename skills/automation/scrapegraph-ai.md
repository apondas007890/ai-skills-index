---
id: scrapegraph-ai
name: ScrapeGraphAI
source: https://github.com/scrapegraphai/scrapegraph-ai
author: ScrapeGraphAI
primary_category: automation
categories:
  - automation
  - research
  - agents
tags:
  - web-scraping
  - structured-extraction
  - llm-pipelines
  - python
  - data-collection
compatible_agents:
  - claude-code
  - codex
  - cursor
status: good
quality: 8
security: unverified
added: 2026-11-27
last_reviewed: 2026-11-27
source_type: github
license: MIT
install_command: "pip install scrapegraphai"
tested: false
featured: false
---

# ScrapeGraphAI

## Description

A Python web scraping library that uses LLM-powered graph pipelines to extract structured JSON data from websites and local documents (HTML, XML, JSON, Markdown) without brittle CSS or XPath selectors.

## What it does

Lets you describe the target schema or information you want in natural language, then runs modular scraping graphs over web pages or local files to output structured data resilient to layout changes.

## Best for

- Extracting structured metadata from diverse skill directories
- Converting messy HTML pages into normalized JSON records
- Building repeatable Python research and data-collection pipelines

## Verdict

GOOD — strong option for structured metadata extraction when scraping heterogeneous pages, provided an LLM backend (local or API) is configured.

## Limitations

- Typically requires an LLM provider (local Ollama or external API key) and Python dependencies.
- Repository documentation reviewed; not personally installed or tested.

## Risk

Requires executing Python scraping pipelines and potentially sending fetched page text to an LLM endpoint; verify data privacy and API key handling.

## Installation

`pip install scrapegraphai` (see `github.com/scrapegraphai/scrapegraph-ai` for Playwright and model backend setup).

## Notes

Keep as an optional structured-extraction helper rather than a required dependency for SkillAtlas.
