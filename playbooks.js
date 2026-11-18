export const playbooks = [
  {
    id: 'youchina-agent',
    badge_en: 'PLAYBOOK 01 · AGENT DEBUGGING & ARCHITECTURE',
    badge_zh: '实战指南 01 · YouChina Agent 工程破局',
    title_en: 'Why Building YouChina Agents Hits Heavy Friction — And How to Fix It',
    title_zh: '为什么 Build YouChina Agent 会遇到大阻力？四大痛点拆解与破局方案',
    subtitle_en: 'Most friction when building real business Agents does not come from missing Python skills—it comes from over-agenting predictable flows, stuffing noisy context, lacking policy verification gates, and letting AI coding tools edit blindly without AGENTS.md + Evals.',
    subtitle_zh: '用 AI 做真实业务 Agent 卡住，90% 不是因为不会写代码，而是同时踩中四个坑：把固定流程交给自由循环、入华旅游政策/票务无时效核验、多 Agent 上下文污染、以及用 Cursor/Claude 改代码缺少 AGENTS.md 与回归门禁。',
    diagram: 'youchina_compare',
    symptoms: [
      {
        id: 'sym1',
        label_en: '1. Architecture Drift: Agent ignores rules halfway or loops endlessly on simple tasks',
        label_zh: '1. 架构失控：Agent 跑着跑着忘掉规则，或把固定步骤做成了死循环',
        root_en: 'Over-Agenting Predictable Steps + Context Rot',
        root_zh: '把确定性流程硬交给自由 Agent + 上下文腐烂 (Context Rot)',
        week: 5,
        fix_en: 'Move fixed steps (intent routing, DB lookup order, JSON output formatting) into an 80% deterministic Workflow. Isolate LLM decisions to bounded nodes with max_steps=5 and clean `task_state.json`.',
        fix_zh: '遵循「80% 确定性工作流 + 20% 受控模型判断」：把路由、查库、格式组装固定下来；只保留判断节点给模型，强制 max_steps=5 并用精简 JSON 传参。'
      },
      {
        id: 'sym2',
        label_en: '2. Data & Hallucination: Fluent answers contain outdated visa, ticket, or booking rules',
        label_zh: '2. 数据与幻觉：英文回答很流畅，但入境政策/景点预约/票价信息是编造或过期的',
        root_en: 'Missing Metadata Date Filters & Unverified Citation Claims',
        root_zh: '缺少时效元数据过滤 (`last_verified_at`) 与事实接地核验',
        week: 4,
        fix_en: 'Attach `last_verified_at` and `official_url` metadata to every policy record. Add a hard Critic rule: any booking/price claim without matching retrieved evidence MUST output "Needs live verification" instead of guessing.',
        fix_zh: '每条入境/景点资料强制带 `last_verified_at` 与 `official_url`；增加硬校验规则：检索不到证据的预约或票价信息一律阻断猜测，改为提示“待核实”。'
      },
      {
        id: 'sym3',
        label_en: '3. Multi-Agent & Context Chaos: Splitting roles multiplies cost, latency, and distortion',
        label_zh: '3. 多 Agent 与上下文混乱：拆了多个 Agent 互相传话失真、Token 爆炸且难排查',
        root_en: 'Premature Multi-Agent Spawning ("Coordination Tax") + Raw Chat Stuffing',
        root_zh: '过早拆分 Multi-Agent（协作税）+ 把全量长对话塞进上下文',
        week: 6,
        fix_en: 'Collapse unnecessary sub-agents into 1 Orchestrator passing typed JSON schemas + 1 read-only Critic Gate. Pass ONLY minimum viable context per step—never dump full chat logs.',
        fix_zh: '收拢多余角色为「1 个主编排工作流 + 严格 JSON 合同 + 1 个只读 Critic 质检」；每个节点只传最小必要上下文，严禁把完整聊天记录透传到底。'
      },
      {
        id: 'sym4',
        label_en: '4. AI Coding Regressions: Asking Cursor/Claude to fix one bug breaks working features',
        label_zh: '4. AI Coding 协作难：让 Cursor / Claude 改一处逻辑或 Prompt，原本正常的功能全坏了',
        root_en: 'Missing Harness Rules (`AGENTS.md`) + Zero Golden Eval Regression Gate',
        root_zh: '缺少项目级 Harness 边界 (`AGENTS.md`) + 没有固定回归评测集',
        week: 8,
        fix_en: 'Put an `AGENTS.md` file in repo root freezing schemas and module boundaries, demand 1-slice changes per edit, and maintain a 15-case Golden Eval sheet re-run before every deploy.',
        fix_zh: '在仓库根目录放 `AGENTS.md` 冻结数据结构与禁止乱改的模块边界；每次只改单一职责；建立 15 道金标准评测题，改任何 Prompt/代码后必须全量重跑。'
      }
    ],
    traps: [
      {
        tag: 'TRAP 01',
        bad_en: 'Giving one big chat prompt 10 tools and hoping the LLM figures out order, retries, and edge cases.',
        bad_zh: '反面做法：把 10 个工具全塞给一个大模型自由发挥，指望它自己决定顺序和报错重试。',
        good_en: '80% Deterministic Workflow + 20% Bounded LLM Reasoning: code controls routing, retries, and schema checks; LLM handles intent parsing and synthesis.',
        good_zh: '工程解法：80% 确定性流程 + 20% 受控模型判断。由工作流控制步骤、超时重试和 JSON 校验，模型只做语义理解与语言组织。'
      },
      {
        tag: 'TRAP 02',
        bad_en: 'Dumping full booking docs, chat history, and messy scraped pages into every step.',
        bad_zh: '反面做法：把整份景点库、全部聊天记录和网页杂乱正文一次性塞进上下文。',
        good_en: 'Minimum Viable Context per Node: pass clean `task_state.json` + top 3 reranked evidence chunks with `last_verified_at`.',
        good_zh: '工程解法：每个节点只传最小必要上下文（结构化 `task_state` + 重排后前 3 条带时间戳的证据）。'
      },
      {
        tag: 'TRAP 03',
        bad_en: 'Letting Cursor/Claude refactor freely across files with only "looks good in chat" testing.',
        bad_zh: '反面做法：让 AI Coding 工具随手跨文件重构，改完只用一两个顺手例子聊一聊就上线。',
        good_en: 'Harness + `AGENTS.md` + 15-Case Golden Evals: freeze data contracts and verify edge/refusal cases automatically before shipping.',
        good_zh: '工程解法：用 `AGENTS.md` 锁死数据契约和职责边界，上线前必跑 15 题边界/过期/拒答金标准测试集。'
      }
    ],
    extra: {
      title_en: 'Copy-Ready `AGENTS.md` Guardrail Template for Your YouChina Repo',
      title_zh: '可直接放进 YouChina 项目根目录的 `AGENTS.md` 工程护栏模板',
      desc_en: 'Save this at the root of your codebase so Cursor, Claude Code, and Copilot obey your architecture boundaries instead of inventing wild edits.',
      desc_zh: '把这个文件放在代码根目录，每次让 Cursor / Claude Code 改代码前先读它，能直接砍掉 70% “越改越乱”的阻力。',
      tableTitle_en: 'Layer Ownership Matrix (Read Before Prompting AI Coders)',
      tableTitle_zh: '各层职责锁定表（指挥 AI 写代码前先对齐）',
      columns: ['Layer / 层级', 'Owned By / 谁主导', 'Hard Rule / 铁律'],
      rows: [
        ['Routing & State / 路由与状态', 'Deterministic Code / Workflow', 'Fixed JSON `task_state`; never let LLM rewrite flow order silently'],
        ['Policy & Price Facts / 政策票务真值', 'DB / Verified RAG + Date Filter', 'Require `official_url` + `last_verified_at`; never guess missing dates'],
        ['Language & Synthesis / 理解与生成', 'Bounded LLM Node', 'Strict JSON Schema output; refuse when evidence is absent'],
        ['Quality & Safety / 质检与发布', 'Read-Only Critic + Golden Evals', 'Must pass 15-case test suite & receipt check before live deploy']
      ],
      snippet_title_en: 'Starter `AGENTS.md` Template (Copy into repo root)',
      snippet: `# AGENTS.md — Project Engineering Guardrails
## 1. Architecture Boundaries (Do Not Violate)
- Workflow routing, retries, and JSON schema validation MUST stay deterministic in code/orchestrator.
- Never collapse deterministic lookup/publish steps into an open-ended Agent Loop.
- Keep context minimal: pass only \`task_state.json\` + verified evidence chunks (with \`official_url\` and \`last_verified_at\`).

## 2. Anti-Hallucination & Verification Rules
- Any travel policy, visa rule, ticket price, or booking claim MUST cite a retrieved record.
- If evidence is missing or older than the freshness threshold, return \`status: "needs_verification"\`. Never fabricate.
- Side effects (CMS publish, bookings, emails) require idempotency keys and execution receipt verification.

## 3. Coding Agent Discipline
- Edit ONLY the files needed for the requested single slice. Never silently change shared JSON schemas or DB tables.
- Before finishing, state: (a) exact files changed, (b) verification command/test results, (c) risks or unverified parts.`
    },
    prompt_en: `Act as a pragmatic Principal AI Systems Engineer helping a non-coding founder refactor a YouChina Agent project that currently feels fragile and hard to debug.
Do NOT write production code yet. Ask me 5 sharp diagnostic questions first about:
1. Where the workflow breaks (retrieval, tool execution, looping, or hallucination)
2. Which steps are actually deterministic vs. truly open-ended
3. What context/history gets stuffed into the prompt today
4. How tool outputs and timestamps are validated
5. How we currently test changes

Then propose a simplified "80% Workflow + 20% Bounded LLM + Independent Critic Gate" architecture, customize our AGENTS.md file, and build a 15-case Golden Eval table.`,
    prompt_zh: `请担任务实的 AI 系统架构顾问，帮一位非代码背景的产品创始人重构当前遇到较大阻力的 YouChina Agent。
先不要写代码！先向我提 5 个精准诊断问题，搞清：
1. 故障主要出在哪一层（检索、工具执行、死循环还是幻觉）
2. 哪些步骤其实是固定规则，却被硬做成了自由 Agent
3. 当前上下文里塞入了多少历史对话或冗余资料
4. 工具返回回执与数据时效如何校验
5. 目前如何验证改动没有破坏旧场景

随后给我输出精简方案：“80% 确定性工作流 + 20% 受控模型节点 + 独立只读 Critic 质检”、定制版 AGENTS.md 约束文件，以及 15 题金标准评测表。`
  },
  {
    id: 'seo-geo-automation',
    badge_en: 'PLAYBOOK 02 · SEO, GEO & MULTILINGUAL GROWTH AUTOMATION',
    badge_zh: '实战指南 02 · SEO / GEO / 多语种内容营销自动化工作流',
    title_en: '5-Stage SEO, GEO & Multilingual Content Automation Blueprint',
    title_zh: '五阶段 SEO & GEO 多语种内容营销自动化工作流（n8n / Make / Dify 可直接编排）',
    subtitle_en: 'Cover all 4 pillars: (1) Deterministic 5-stage pipeline, (2) GEO citation engineering for ChatGPT/Perplexity/Google AI Overviews, (3) No-code n8n/Make/Dify node mapping, and (4) Multilingual localization QA from one verified truth pack.',
    subtitle_zh: '完整覆盖四大核心：① 5 阶段防幻觉确定性流水线；② GEO 让 ChatGPT/Perplexity 高概率引用的底层结构；③ n8n / Make / Dify 零代码节点级搭法；④ 基于同一真值包批量生产与质检多语种海外内容矩阵。',
    diagram: 'seo_geo_pipeline',
    symptoms: [
      {
        id: 'seo1',
        label_en: '1. GEO Mechanics: How do ChatGPT Search, Perplexity & Google AI Overviews choose what to cite?',
        label_zh: '1. GEO 底层机制：为什么 ChatGPT / Perplexity / Google AI Overviews 会优先引用某些页面？',
        root_en: 'AI Search Engines Run RAG Over Chunks—They Cite Self-Contained, Verifiable Fact Blocks',
        root_zh: 'AI 搜索引擎本质是在跑 RAG 切块检索：只爱引用“结论前置、带出处年份、段落自洽”的高信噪比证据块',
        week: 4,
        fix_en: 'Design every page for RAG chunk extraction: (a) 45-word Answer-First summary directly under each H2 question, (b) structured comparison tables, (c) explicit numbers + "Last verified YYYY-MM" + official citations, and (d) clean FAQPage + Article JSON-LD Schema.',
        fix_zh: '按 RAG 检索友好的方式写页面：① 每个 H2 问题下方直接给 45 词内「结论先行摘要」；② 关键条件做成结构化对比表；③ 数据附带「核实日期与官方出处」；④ 补全 FAQPage / Article JSON-LD Schema。'
      },
      {
        id: 'seo2',
        label_en: '2. Zero Hallucination: How to stop automated marketing flows from inventing specs, prices, or policies?',
        label_zh: '2. 防胡编机制：全自动跑营销内容时，如何彻底杜绝 AI 编造自家产品卖点、价格或旅行政策？',
        root_en: 'Separate "Truth Extraction (Stage 2)" from "Drafting (Stage 3)" + "Read-Only Critic Gate (Stage 4)"',
        root_zh: '把「提取真值证据包 (Stage 2)」、「按模板写作 (Stage 3)」、「独立只读挑错 (Stage 4)」拆成硬隔离节点',
        week: 8,
        fix_en: 'Stage 3 Writer NEVER pulls facts from memory—it only formats the `evidence_pack.json` fetched in Stage 2. Stage 4 Critic compares every stat, URL, and rule back against `evidence_pack.json` and rejects drafts with unverified claims before CMS upload.',
        fix_zh: 'Stage 3 写作节点严禁自由发挥事实，只能改写 Stage 2 拉来的 `evidence_pack.json`；Stage 4 独立 Critic 逐条比对数字、链接和规则，发现不在证据包里的内容直接打回，绝不进 CMS。'
      },
      {
        id: 'seo3',
        label_en: '3. No-Code Stack: How do I wire this 5-stage workflow in n8n, Make, or Dify without heavy coding?',
        label_zh: '3. 零代码编排：不写复杂后端代码，如何用 n8n / Make / Dify 把整套工作流实际串起来？',
        root_en: 'Orchestrator (n8n / Make) Handles Schedules, APIs & Loops; Dify / Structured LLM Handles Reasoning',
        root_zh: '用 n8n / Make 管定时触发、API 请求、循环与 CMS 入库；用 Dify 或 HTTP+Structured JSON 管模型与 Critic 门禁',
        week: 7,
        fix_en: 'Keep retries, rate limits, Google Search Console APIs, Notion/Airtable reads, and WordPress/Webflow Draft POSTs inside n8n/Make deterministic nodes. Never publish straight to live—always create `status=draft` keyed by `slug` (Idempotency) for 1-minute human sign-off.',
        fix_zh: '定时触发、拉 GSC/SERP API、读 Notion/Airtable 真值库、写 CMS 全部用 n8n/Make 的确定性节点；推 CMS 一律发 `status=draft` 并用 `slug` 去重（幂等），最后留 1 分钟人工终审发布。'
      },
      {
        id: 'seo4',
        label_en: '4. Multilingual Matrix QA: How to scale English / ES / FR / JA travel guides without localization errors?',
        label_zh: '4. 多语种矩阵与本地化质检：如何把一份中国旅行真值包稳定扩写成英文/西/法/日内容且不错译？',
        root_en: 'Translate/Adapt From One Canonical `evidence_pack.json` + Enforce Localization Critic Rules',
        root_zh: '以一份已核实的单一 `evidence_pack.json` 为真值源，并行本地化改写 + 专职本地化 Critic 质检',
        week: 9,
        fix_en: 'Never chain-translate EN -> ES -> FR (errors compound). Generate each target language directly from the canonical verified `evidence_pack.json` with a Glossary lock (e.g., official station/park names, visa terms) + Localization Critic verifying currency, time zones, `hreflang`, and zero generic translationese.',
        fix_zh: '严禁“中→英→西”二次转译导致失真！所有语种并行直接读取同一份核实过的 `evidence_pack.json`，锁定专有名词对照表（景区英文官方译名、签证代码），并由 Critic 校验汇率/时区/hreflang/地道本地表达。'
      }
    ],
    traps: [
      {
        tag: 'STAGE 1-2',
        bad_en: 'Prompting: "Write a 2,000-word SEO article targeting [keyword]" with zero live SERP or real company data.',
        bad_zh: '低效做法：只给一个关键词让 AI 直接生成 2000 字长文，既不知道真实搜索意图，也没有自家一手证据。',
        good_en: 'Stage 1 (Query Fan-out + SERP Intent JSON) -> Stage 2 (Verified `evidence_pack.json` pulled from Notion/DB + live official sources).',
        good_zh: '正确链路：Stage 1 先基于真实搜索意图做 Query Fan-out 长尾拆解；Stage 2 从真值库和官方出处组装带时间戳的 `evidence_pack.json`。'
      },
      {
        tag: 'STAGE 3-4',
        bad_en: 'Generating freeform Markdown with fluffy intros ("In today’s fast-paced world...") and zero Schema or Critic check.',
        bad_zh: '低效做法：输出满篇废话的散文，没有 FAQ、没有 JSON-LD Schema，也没有独立挑错门禁。',
        good_en: 'Stage 3 (Structured GEO Draft: Answer-First + Table + FAQ + JSON-LD) -> Stage 4 (Critic Gate scoring Grounding, Anti-Fluff & Localization QA).',
        good_zh: '正确链路：Stage 3 按结构化模板生成（结论前置 + 对比表 + FAQ + JSON-LD）；Stage 4 独立 Critic 核对事实、去 AI 腔与多语种术语一致性，不通过仅局部打回重改。'
      },
      {
        tag: 'STAGE 5',
        bad_en: 'Auto-publishing straight to live URLs without Idempotency keys or performance tracking.',
        bad_zh: '低效做法：超时重试导致 CMS 重复发布三篇同标题文章，且发布后不管收录和 AI 引用效果。',
        good_en: 'Stage 5: Idempotent CMS Draft creation (keyed by `slug`) + Human Publish Gate + 14-day GSC & AI Citation feedback loop back into Stage 1.',
        good_zh: '正确链路：用 `slug` 幂等推 CMS 草稿 → 人工 1 分钟终审发布 → 14 天后拉取 Search Console 与 AI 引用监测数据回流优化下一轮选题。'
      }
    ],
    extra: {
      title_en: 'No-Code Node Mapping: How to Build the 5 Stages in n8n / Make / Dify',
      title_zh: '零代码工具节点级对照表：如何在 n8n / Make / Dify 里搭出这 5 步流水线',
      desc_en: 'You do not need to write an orchestrator from scratch. Wire these exact deterministic nodes together and only use LLMs inside Stages 1, 3, and 4.',
      desc_zh: '不需要手写调度系统！对照下表把 n8n / Make 的标准节点与 Dify/LLM 结构化输出接起来即可跑通闭环：',
      tableTitle_en: 'Stage-by-Stage Node Blueprint',
      tableTitle_zh: '五阶段工具节点映射表',
      columns: ['Pipeline Stage / 阶段', 'n8n / Make Node / 编排节点', 'Output Contract & Gate / 输出与门禁'],
      rows: [
        ['1. Intent & Query Fan-out', 'Schedule / Webhook + HTTP Request (SERP/GSC API) + LLM JSON', '`{ main_keyword, fan_out_questions[], search_intent }`'],
        ['2. Verified Evidence Pack', 'Notion / Airtable / Postgres Search + Official URL Fetcher', '`evidence_pack.json` (`fact`, `official_url`, `last_verified_at`)'],
        ['3. Structured GEO + Multi-Lang Draft', 'Loop over target locales (`en`, `es`, `ja`) + Dify / LLM Structured Node', 'Answer-First H2s + Comparison Table + FAQ + `JSON-LD`'],
        ['4. Independent Critic Gate', 'Read-only Critic LLM + IF Node (`pass == true && unverified == 0`)', 'Blocks hallucinated facts, cliché AI intro, or wrong proper nouns'],
        ['5. Idempotent CMS Draft & Loop', 'HTTP POST / WordPress / Webflow (`slug` upsert, `status=draft`) + Slack Alert', '1-click Human Publish; 14-day GSC + AI Citation tracking back to Stage 1']
      ],
      snippet_title_en: 'Multilingual Localization & GEO Critic Checklist (Paste into Stage 4 Prompt)',
      snippet: `You are a strict Read-Only GEO & Localization Critic. Compare \`draft_article\` ONLY against \`evidence_pack.json\`.
Fail and list exact fixes if ANY check fails:
1. UNGROUNDED CLAIM: Any price, visa rule, reservation window, or stat not directly present in \`evidence_pack.json\`.
2. GEO CHUNK QUALITY: Any H2 section missing a clear 35-55 word Answer-First summary or missing \`last_verified_at\` date.
3. AI SLOP / FLUFF: Generic openings ("In today's fast-paced world...", "Look no further", "Unveil the magic").
4. LOCALIZATION & GLOSSARY: Official place/brand names mistranslated, wrong RMB/time formatting, or missing \`FAQPage\` JSON-LD.
Return strict JSON: { "pass": boolean, "score_0_to_100": number, "blocking_issues": [], "rewrite_instructions": "" }`
    },
    prompt_en: `Act as an AI Growth & Systems Architect. Help me design a 5-Stage SEO, GEO & Multilingual Content Automation Workflow I can run using n8n/Make/Dify + verified company knowledge—without writing complex backend code from scratch.
My target business / domain: [Describe YouChina or your product here]
Target languages: [e.g., EN, ES, FR, JA]

Deliver:
1. A 5-Stage deterministic n8n/Make/Dify node table (Intent Fan-out -> Verified Evidence Pack -> Multilingual GEO Draft + JSON-LD -> Independent Critic Gate -> Idempotent CMS Draft)
2. Exact JSON schemas passed between Stage 2, 3, and 4
3. Specific GEO formatting rules so ChatGPT Search / Perplexity / Google AI Overviews cite our fact chunks
4. A Localization Glossary & Critic checklist to launch Phase-1 MVP in one weekend.`,
    prompt_zh: `请担任 AI 增长系统架构师，帮我设计一套无需从零手写代码、可直接用 n8n / Make / Dify + 真值资料库落地的【5 阶段 SEO / GEO / 多语种内容营销自动化工作流】。
我的业务与产品：[填写 YouChina 或你的具体业务]
目标语种矩阵：[例如：英文、西语、法语、日语]

请输出：
1. 五阶段 n8n / Make / Dify 节点对照表（意图与追问扩展 → 真值证据包提取 → 多语种 GEO 结构化草稿与 JSON-LD → 独立 Critic 质检门禁 → 幂等推送 CMS 草稿）
2. Stage 2、3、4 之间传递的精简 JSON 数据结构
3. 让 ChatGPT Search / Perplexity / Google AI Overviews 更容易抓取引用的页面分块规范
4. 多语种专有名词防错表，以及本周末就能先跑通第 1 条闭环的轻量 MVP 方案。`
  }
];

export const studioPresets = {
  youchina: {
    id: 'youchina',
    name_en: 'YouChina Travel Agent',
    name_zh: 'YouChina 入境游智能体',
    goal_en: 'Answer foreign traveler attraction, visa & itinerary questions accurately without hallucinating prices or booking states.',
    goal_zh: '准确解答海外游客在华景点预约、签证与行程问题，绝不编造票价、闭馆时间或虚假预订状态。',
    flags: { fixedFlow: true, highFactRisk: true, writeActions: true, multilingual: true, untrustedWeb: true, aiCoding: true }
  },
  seo_geo: {
    id: 'seo_geo',
    name_en: 'SEO & GEO Content Engine',
    name_zh: 'SEO & GEO 多语种营销引擎',
    goal_en: 'Turn search intent + verified product truth into Answer-First GEO guides & localized pages pushed safely as CMS drafts.',
    goal_zh: '将真实搜索意图与自家核实真值表转化为高引用率 GEO 指南与多语种矩阵，安全推送 CMS 草稿。',
    flags: { fixedFlow: true, highFactRisk: true, writeActions: true, multilingual: true, untrustedWeb: true, aiCoding: false }
  },
  custom: {
    id: 'custom',
    name_en: 'New Custom AI Project',
    name_zh: '我的自定义 AI 新项目',
    goal_en: 'Scope a reliable MVP loop before prompting Cursor/Claude or wiring n8n/Dify.',
    goal_zh: '在动手让 Cursor/Claude 写代码或搭 n8n/Dify 前，先锁定最小可靠闭环与防错边界。',
    flags: { fixedFlow: true, highFactRisk: false, writeActions: false, multilingual: false, untrustedWeb: false, aiCoding: true }
  }
};

export const studioToggleMeta = [
  {
    key: 'fixedFlow',
    label_en: 'Repeatable step sequence (80% known steps)',
    label_zh: '流程主干可预测（大部分步骤固定，不是完全开放探索）'
  },
  {
    key: 'highFactRisk',
    label_en: 'High factual risk (policies, prices, product claims)',
    label_zh: '事实准确性敏感（错一个签证规则、价格或参数会严重误导）'
  },
  {
    key: 'writeActions',
    label_en: 'External side effects (CMS publish, bookings, emails)',
    label_zh: '涉及外部写入/发布动作（推 CMS、发邮件、预订或改库）'
  },
  {
    key: 'multilingual',
    label_en: 'Multilingual output matrix (EN / ES / FR / JA)',
    label_zh: '需要多语种批量生成与本地化质检'
  },
  {
    key: 'untrustedWeb',
    label_en: 'Reads scraped web pages or external search results',
    label_zh: '需要读取抓取的网页正文或外部搜索结果'
  },
  {
    key: 'aiCoding',
    label_en: 'Built iteratively using Cursor / Claude Code',
    label_zh: '主要使用 Cursor / Claude Code 等 AI 工具迭代开发'
  }
];

export const defaultEvalChecks = [
  { id: 'ev1', en: 'Refusal test: Missing evidence returns "Needs verification" instead of guessing', zh: '拒答测试：证据包缺失数据时明确提示“待核实”，绝不硬编' },
  { id: 'ev2', en: 'Freshness filter: Outdated policy docs (older than threshold) are blocked from context', zh: '时效测试：超过核实阈值的过期政策不会进入生成上下文' },
  { id: 'ev3', en: 'JSON Schema check: Downstream output strictly passes required fields & types', zh: '格式测试：输出 JSON 100% 符合必填字段与数据类型，不炸下游' },
  { id: 'ev4', en: 'Idempotent publish: Re-running CMS/order step with same slug creates zero duplicates', zh: '幂等测试：网络超时重跑同一 slug/订单号不会发出两份重复文章或订单' },
  { id: 'ev5', en: 'Prompt injection check: Scraped page saying "Ignore rules" cannot trigger tools', zh: '注入测试：网页里藏着“忽略之前指令”时不会劫持模型或调危险工具' },
  { id: 'ev6', en: 'GEO chunk test: Every H2 starts with a direct 35-55 word answer + official source', zh: 'GEO 块测试：每个 H2 下方先给 35-55 词直接结论并附带核实出处' },
  { id: 'ev7', en: 'Localization glossary: Official attraction/brand names stay consistent across EN/ES/JA', zh: '多语一致测试：核心地名、品牌词在英文/西语/日语版本中零错译' },
  { id: 'ev8', en: 'Regression suite: 15 saved Golden Test cases pass after the latest prompt/code change', zh: '回归测试：改完 Prompt 或代码后，15 道固定金标准考题全部过关才上线' }
];

export const trends2026 = [
  {
    tag: '2026 TREND 01 · GEO & AI SEARCH',
    old_en: 'Keyword stuffing & 2,500-word generic blog fluff written from a 1-line prompt.',
    old_zh: '过时套路：给 AI 一个关键词直接生成 2500 字空洞长文，靠堆词赌 SEO 排名。',
    now_en: 'GEO Chunk Engineering + `llms.txt` + Answer-First tables + JSON-LD + verified citations that Perplexity & ChatGPT Search quote verbatim.',
    now_zh: '2026 一线标准：按 RAG 切块逻辑写页面（结论先行 + 结构化表格 + `llms.txt` + JSON-LD + 一手出处），直接提高被 AI 搜索引擎引用的概率。'
  },
  {
    tag: '2026 TREND 02 · HARNESS > PROMPT',
    old_en: 'Writing 3-page polite system prompts begging the model "please never hallucinate or break rules."',
    old_zh: '过时套路：写 3 页纸苦口婆心的超级 Prompt 恳求模型“千万不要编造、记得按格式输出”。',
    now_en: 'Harness Engineering (`AGENTS.md` + retrieval filters + structured JSON schemas + read-only Critic gates + `max_steps` caps).',
    now_zh: '2026 一线标准：用 Harness 工程边界替代表态——项目级 `AGENTS.md`、检索层硬过滤、JSON Schema 强制约束、只读 Critic 挑错与步数预算上限。'
  },
  {
    tag: '2026 TREND 03 · SKILLS + MCP',
    old_en: 'Re-pasting long SOPs and custom API glue code into every separate AI tool or agent prompt.',
    old_zh: '过时套路：换一个 Agent 或工具就重新粘一遍长操作手册和接口胶水代码。',
    now_en: 'Modular `SKILL.md` playbooks loaded on demand + standardized MCP tool connectors keeping base context lean.',
    now_zh: '2026 一线标准：用模块化 `SKILL.md` 按需加载 SOP 与质检规则，配合 MCP 统一接入外部数据/工具，主上下文始终保持轻量高信噪比。'
  },
  {
    tag: '2026 TREND 04 · 80/20 HYBRID FLOWS',
    old_en: 'Spinning up 5 autonomous "role-play" agents chatting back and forth for a repeatable workflow.',
    old_zh: '过时套路：为了显得高级，把固定业务流水线拆成 5 个拟人 Agent 互相聊来聊去。',
    now_en: '80% Deterministic Workflow (n8n/Make/code) + 20% Bounded LLM reasoning + 1 Independent Evaluator/Critic node.',
    now_zh: '2026 一线标准：80% 确定性编排（n8n/Make/代码管流转和重试）+ 20% 受控模型判断 + 1 个独立 Critic 质检门禁。稳定、省钱、秒级定位故障。'
  }
];

