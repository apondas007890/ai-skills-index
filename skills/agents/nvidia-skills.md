---
id: nvidia-skills
name: NVIDIA Official Agent Skills
source: 'https://github.com/NVIDIA/skills'
author: NVIDIA
primary_category: agents
categories:
  - agents
  - coding
  - research
tags:
  - nvidia
  - cuda
  - robotics
  - rag
  - skill-md
  - enterprise
compatible_agents:
  - claude-code
  - codex
  - cursor
  - kiro
status: good
quality: 8
security: verified
added: 2026-11-27T00:00:00.000Z
last_reviewed: 2026-11-27T00:00:00.000Z
source_type: github
license: Apache-2.0
stars: 4167
last_pushed: '2026-11-26'
install_command: npx skills add nvidia/skills --skill nvidia-skill-finder --yes
tested: false
featured: false
---
# NVIDIA Official Agent Skills

## Description

NVIDIA's official portable `SKILL.md` catalog teaching AI coding agents how to work with `CUDA-X` libraries (`cuDF`, `cuOpt`), Isaac robotics, and `RAG` blueprints.

## What it does

Syncs daily from NVIDIA product teams and provides cryptographically signed skill cards (`skill.oms.sig`) installable individually via `npx skills add` or discovered via `nvidia-skill-finder`.

## Best for

- Working with NVIDIA `CUDA-X`, `cuDF`, `cuOpt`, or Isaac simulation workflows
- Learning enterprise-grade skill signing and provenance (`SkillEvaluator` / `SkillSpector`)
- Discovering domain-specific GPU programming skills via `nvidia-skill-finder`

## Verdict

GOOD — high-trust, officially maintained skill catalog with strong provenance, though specialized for NVIDIA's GPU/robotics ecosystem.

## Limitations

- Most skills target NVIDIA hardware/software stacks (`CUDA`, `Isaac`, `cuOpt`).
- Repository documentation reviewed; not personally executed.

## Risk

Officially maintained by NVIDIA (`Apache-2.0`) with cryptographic signatures (`skill.oms.sig`).

## Installation

`npx skills add nvidia/skills --skill nvidia-skill-finder --yes`

## Notes

Pairs directly with `NVIDIA/SkillSpector` for security verification.
