# AI Fieldnotes · AI Engineering Learning Lab

A bilingual (`EN+译` / `EN` / `中文`) static learning workspace designed for non-coding **AI-native Product Builders** who want engineering judgment around RAG, Agents, Workflows, Harness Engineering, and Evals—directly applied to real products like **YouChina Agents** and **SEO / GEO Content Automation**.

## Features

- **10-Week Curriculum**: Full 5-lesson Week 1 (`w1d1`–`w1d5`) + focused Module Guides for Weeks 2–10 (`w2d1`–`w10d1`), preserving original lesson IDs for localStorage compatibility.
- **3-Way Language Switcher (`EN+译` / `EN` / `中文`)**: Default `EN+译` lets you read authentic English engineering phrasing first, click `译 / 中文` on any block (or expand all) to check Chinese meaning, and study key English engineering phrases per lesson.
- **Builder Playbooks (`#/playbooks`)**:
  1. **YouChina Agent Friction & Refactor**: Interactive 4-symptom diagnoser (Architecture drift, Policy/Ticket hallucination, Multi-agent context rot, AI Coding regressions), layer ownership table, copy-ready `AGENTS.md` template, and refactoring prompts.
  2. **SEO, GEO & Multilingual Automation Blueprint**: 5-stage anti-hallucination workflow, GEO chunking rules for AI search citations, node-by-node **n8n / Make / Dify** mapping table, and multilingual localization Critic checklist.
- **34 Bilingual Flashcards**, **7 Inline Architecture Diagrams**, **Interactive Quizzes + Mistake Notebook (`错题复盘本`)**, **Auto-Saving Field Notes**, and **JSON Export/Import**.

## Local Development

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Deployment

Pure static files with relative `./` asset paths and zero build dependencies—ready for **Cloudflare Pages**, **GitHub Pages**, or **Vercel**.
