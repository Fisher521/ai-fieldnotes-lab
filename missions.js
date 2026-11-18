export const missionTracks = [
  {
    id: 'factcell',
    badge: 'TRACK 01 · YOUCHINA GROUNDING',
    title_en: 'YouChina Factcell & Signals',
    title_zh: 'YouChina 真值底座与信号',
    desc_en: 'Stop AI from typing unverified rules or hitting empty page skeletons. Master RAG grounding, authority maps, and signal bounds.',
    desc_zh: '解决景点/签证规则编造与空骨架页面问题：掌握 Factcell 底座、权威映射与边界信号。'
  },
  {
    id: 'multiagent',
    badge: 'TRACK 02 · MULTI-AGENT CLI',
    title_en: 'Worktrees & Quota Ladders',
    title_zh: '多智能体协作与 Worktree',
    desc_en: 'Run Codex (Plan/Audit) + Grok/Cursor (Execute) without wiping claims, stalling on 402 quotas, or burning tokens.',
    desc_zh: '管好 Codex 规划审计 + Grok/Cursor 执行：防工作区事故、防 402 断档、省 Token。'
  },
  {
    id: 'growthos',
    badge: 'TRACK 03 · GROWTH OS',
    title_en: 'Context & 6-Locale Matrix',
    title_zh: '上下文压缩与 6 语种矩阵',
    desc_en: 'Cold-start fast from 5 compact state files, ship WeChat/DiDi/Amap across 6 locales cleanly, and lock owner redlines.',
    desc_zh: '5 个精简文件冷启动、复用 6 语种方案（不膨胀到 16 语）、用 Hook 与审批日志防误删。'
  },
  {
    id: 'alub2b',
    badge: 'TRACK 04 · ALUMINUM B2B',
    title_en: 'SEO / GEO & Display-Gap',
    title_zh: 'Aluminum B2B 搜索意图与 GEO',
    desc_en: 'Route buyer vs. distributor intent, enforce NULL-hides-UI display rules, and replace mock /llms-full.txt data.',
    desc_zh: '区分进口采购与本地验真意图、落实缺数隐藏规则、打造真实证据驱动的 /llms-full.txt。'
  }
];

const r = (pillar_en, pillar_zh, keywords, hit_en, hit_zh, miss_en, miss_zh) => ({
  pillar_en, pillar_zh, keywords, hit_en, hit_zh, miss_en, miss_zh
});

export const missions = [
  {
    id: 'm1_1',
    track: 'factcell',
    weekRef: 4,
    macPath: '/Users/fisher/Desktop/Youchina/AGENTS.md · Suzhou Lesson',
    title_en: '1.1 · The Suzhou Empty-Skeleton Trap',
    title_zh: '1.1 · 为什么苏州页面数据全过却还是空骨架？',
    scenario_en: 'You are launching a new "Suzhou Things-to-Do & Dining" page on YouChina. Every data card passes validation, yet the live page renders an empty skeleton because the foundation lacked a dining authority rule and a precheck blocker was downgraded and bypassed.',
    scenario_zh: '你要在 YouChina 上线“苏州吃喝玩乐”页面。所有单项数据卡都测试通过了，结果页面一渲染却是空骨架——因为底座缺了 dining 权威规则，且预检阻断器被降级放行。',
    concept_en: 'In RAG/Data pipelines, content generation depends on Schema + Authority Rules + Binding Support ("Foundation Gap Check") BEFORE collecting or writing copy. Passing local card checks without end-to-end binding produces silent empty states.',
    concept_zh: '在数据驱动的 AI 系统里，Schema、权威源映射和前端 Slot 绑定能力必须先于文案写作就位。只测单卡、不做端到端 Foundation Gap Check，就会出现静默空页面。',
    vocab: [
      ['Foundation Gap Check', '底座缺口预检', 'Auditing schema, authority rules, and UI bindings BEFORE collecting facts or writing copy.'],
      ['Precheck Blocker', '前置硬阻断', 'A deterministic check that halts the pipeline rather than downgrading a missing capability to a warning.'],
      ['End-to-End Binding', '端到端绑定', 'Verifying that stored cells actually emit into page slots and judge() passes cleanly.']
    ],
    prompts_en: [
      'Before writing copy, run a foundation gap check on schema, authority-map, and bindings.',
      'Upgrade the foundation first and keep precheck blockers strict—never downgrade failures.',
      'Verify with real commands that emit-slots and land() actually render the dining section.'
    ],
    rubric: [
      r(
        'Foundation Before Copy', '先底座后文案',
        ['gap', 'foundation', 'schema', 'authority', 'binding', 'before', 'first', '底座', '先查', '映射', '绑定', '缺口'],
        'You rightly prioritized checking schema, authority-map, and slot bindings BEFORE writing copy.',
        '抓准了核心：写文案前先查底座（Schema、权威映射与绑定能力）。',
        'Ask explicitly for a Foundation Gap Check (`authority-map.json`, schema, bindings) before any content collection or drafting begins.',
        '漏掉了关键顺序：动笔写内容前必须先做底座缺口检查（`authority-map.json`、Schema 和 Slot 绑定）。'
      ),
      r(
        'Strict Blocker Discipline', '严禁降级放行',
        ['block', 'halt', 'stop', 'downgrade', 'strict', 'fail', 'gate', '阻断', '拦截', '降级', '放行', '卡住'],
        'Smart call keeping precheck blockers strict instead of bypassing warnings.',
        '守住了红线：前置校验失败必须硬拦截，不能降级放行。',
        'Specify that missing authority rules must HALT the run as a hard blocker—never downgrade a blocker just to ship.',
        '需要补上一条：缺权威规则属于硬阻断错误，绝不能为了赶进度把它降级成警告放过去。'
      ),
      r(
        'End-to-End Verification', '端到端实测输出',
        ['land', 'reconcile', 'emit', 'command', 'output', 'render', 'test', '实测', '命令', '渲染', '输出', '验收'],
        'Good engineering habit: verifying actual slot emission / rendered output, not just card unit checks.',
        '好习惯：要求用真实命令和页面渲染结果验收，而不是只看局部卡片。',
        'Require a real command check (`emit-slots.mjs`, `land()`, `reconcile.mjs`) proving the page actually renders.',
        '别忘了规定验收命令（如 `emit-slots` 和 `reconcile` FAIL 0），确认页面真能渲染出内容。'
      ),
      r(
        'Upgrade Order', '先升级系统再填数据',
        ['upgrade', 'fix', 'add', 'lib-claims', 'regression', '升级', '补齐', '回归'],
        'Clear upgrade sequencing: fix the shared foundation + regression tests, then ingest city cells.',
        '顺序清晰：先升级共享底座并加回归测试，再填城市数据。',
        'Note that when a gap is found, you upgrade the shared foundation + regression tests FIRST, then collect cells.',
        '发现缺口时要先升级公共底座并锁定回归测试，不能硬往旧壳子里塞新数据。'
      )
    ],
    gold_en: 'Stop all copywriting. Run a Foundation Gap Check with real command output to verify schema, authority-map.json, lib-claims.mjs, and slot bindings support dining. Keep precheck blockers hard (zero downgrades). Upgrade the foundation + locked regression tests first, then collect cells and close with reconcile.mjs at FAIL 0.',
    gold_zh: '立即叫停写文案。先跑底座缺口检查，核实 Schema、authority-map.json、lib-claims.mjs 与前端 Slot 是否支持餐饮类目；严禁降级前置阻断器。先升级底座与回归测试，再填数据并以 reconcile FAIL 0 收口。',
    english_polish: [
      '"Before drafting any city copy, run a foundation gap check across schema, authority-map, and slot bindings."',
      '"Keep the precheck as a hard blocker—do not downgrade missing authority rules to ship an empty skeleton."',
      '"Show me the exact command and raw output proving `emit-slots` and `reconcile` pass at FAIL 0."'
    ]
  },
  {
    id: 'm1_2',
    track: 'factcell',
    weekRef: 3,
    macPath: '/Users/fisher/Desktop/Youchina/data/facts/ & emit-slots.mjs',
    title_en: '1.2 · Factcell vs. Hand-Typed Copy',
    title_zh: '1.2 · 为什么禁止 AI 在页面里手写价格与政策？',
    scenario_en: 'An AI agent building a Shanghai transit guide suggests saving 20 minutes by typing metro ticket prices and airport transfer hours directly inside the TSX page component instead of routing through `data/facts/` and `.agentflow/boards/factcell/INBOX.md`.',
    scenario_zh: '负责上海交通页的 Agent 想省 20 分钟，提议直接在网页 TSX 代码里手写地铁票价和机场大巴时间，绕开 `data/facts/` 与 `factcell/INBOX.md`。',
    concept_en: 'Separating "Data Truth Storage" (Factcell cells with source, status, expiry) from "UI Rendering" (slots) guarantees single-source updates, auditable citations, and zero stale copy scattered across JSX files.',
    concept_zh: '把“真值存储（带来源、状态、过期时间的数据单元）”与“页面渲染模板”分离，才能保证一处更新全站同步、每句话可追溯，避免旧价格散落在代码里。',
    vocab: [
      ['Single Source of Truth', '单一真值源', 'Every price, hour, or policy lives in ONE structured fact store—never hardcoded into UI pages.'],
      ['Slot Emission', '插槽注入', 'Programmatically feeding verified fact cells into page placeholders (`emit-slots.mjs`).'],
      ['Scope Routing', '跨角色派单边界', 'Page agents request missing facts via `INBOX.md`; the Factcell owner delivers verified bindings.']
    ],
    prompts_en: [
      'Reject hand-typed facts in TSX—route every price and hour through data/facts/ cells.',
      'Write the missing fact request to factcell/INBOX.md so Factcell delivers verified bindings.',
      'Include source, status, and expiry on each cell and verify via reconcile.mjs.'
    ],
    rubric: [
      r(
        'Reject Hardcoding Facts', '拒绝硬编码事实',
        ['reject', 'never', 'no', 'hand', 'hardcod', 'tsx', 'factcell', 'data/facts', '拒绝', '不要', '手写', '写死', '真值'],
        'Right call blocking hardcoded prices/hours inside UI components.',
        '判断准确：坚决不允许把价格、时间硬编码在页面组件里。',
        'Explicitly reject typing prices or hours directly in TSX—every fact must pass through Factcell first.',
        '必须明确否决在组件里手写事实，所有价格和规则只能来自 Factcell。'
      ),
      r(
        'Role Routing via INBOX', '按职责边界向 INBOX 提需求',
        ['inbox', 'route', 'wait', 'owner', 'request', '边界', '分工', '派单', '提单'],
        'Great multi-session discipline: page builders request missing cells via `INBOX.md` instead of self-collecting.',
        '分工意识很强：页面负责人向 `INBOX.md` 提数据需求，不越界自己凑数据。',
        'Route the fact request to `.agentflow/boards/factcell/INBOX.md` rather than letting the page agent scrape facts itself.',
        '指出应把缺的数据写进 `factcell/INBOX.md` 由专职 Factcell 会话交付，不让页面 Agent 自采自写。'
      ),
      r(
        'Cell Metadata (Source & Expiry)', '单元元数据（来源与有效期）',
        ['source', 'expiry', 'status', 'date', 'verif', '来源', '过期', '有效期', '状态'],
        'You caught why Factcell beats raw text: every cell tracks source, status, and expiry.',
        '点中了精髓：Factcell 之所以可靠，是因为每个单元带来源、状态和过期时间。',
        'Specify that Factcell cells carry source URL, verification status, and expiry date so stale rules get flagged.',
        '补上 Factcell 单元必须自带出处链接、核实状态与过期时间，避免半年后变成死数据。'
      ),
      r(
        'Binding & Slot Pipeline', '绑定与 Slot 校验',
        ['slot', 'emit', 'bind', 'reconcile', '注入', '绑定', '对账'],
        'Clean pipeline focus: wire via `emit-slots.mjs` and close with `reconcile.mjs`.',
        '链路意识到位：通过 `emit-slots` 注入并用 `reconcile` 闭环核对。',
        'Mention wiring the delivered cell into the page through generated slots and verifying with `reconcile.mjs`.',
        '加上交付后通过 `emit-slots` 注入页面，并用 `reconcile` 对账核验。'
      )
    ],
    gold_en: 'Reject hand-typing facts into TSX. Route the missing Shanghai metro/airport facts to `.agentflow/boards/factcell/INBOX.md` so the Factcell owner supplies verified cells (with source, status, expiry) and bindings. Wire them via `emit-slots.mjs` and verify with `reconcile.mjs` at FAIL 0.',
    gold_zh: '否决在 TSX 里手写票价。让页面负责人把缺少的上海交通事实写入 `factcell/INBOX.md`，等 Factcell 会话交付带出处、状态与有效期的单元及绑定后，通过 `emit-slots.mjs` 注入并用 `reconcile.mjs` FAIL 0 验收。',
    english_polish: [
      '"Do not hardcode prices or hours in page copy—route every fact through `data/facts/` first."',
      '"Log the missing items in `factcell/INBOX.md` and wait for verified bindings rather than self-serving."',
      '"Every fact cell needs a source, verification status, and expiry before `emit-slots` renders it."'
    ]
  },
  {
    id: 'm1_3',
    track: 'factcell',
    weekRef: 8,
    macPath: '/Users/fisher/Desktop/Youchina/.claude/skills/traveler-intel/SKILL.md',
    title_en: '1.3 · Bounded Traveler Intel Signals',
    title_zh: '1.3 · 如何把网友零散踩坑帖变成可信产品提示？',
    scenario_en: 'Travelers on Reddit complain: "WeChat Pay froze my Visa card at Beijing subway gate!" An agent wants to write "Warning: Visa cards fail on Beijing subways" across the guide. How should Traveler Intel structure and bound this?',
    scenario_zh: 'Reddit 上有游客吐槽：“北京地铁刷绑定了 Visa 卡的微信支付被风控拦截了！”Agent 想直接在攻略里写：“警告：北京地铁无法使用 Visa 卡。” 作为产品负责人，你会怎么约束它？',
    concept_en: 'Anecdotal user tips are noisy signals, not universal policy. Grounding them in `supported_claim` vs. `must_not_claim` boundaries prevents a single traveler hiccup from turning into false product advice.',
    concept_zh: '单个游客吐槽只是“体验信号”，不是通用官方政策。用 `supported_claim`（支持说多宽）与 `must_not_claim`（绝不能夸大说什么）划清边界，才能既真实提醒又不出误导事故。',
    vocab: [
      ['Supported vs. Must-Not Claim', '可主张 vs 禁越界边界', 'Explicit scope bounds preventing anecdotes from over-generalizing into false rules.'],
      ['Attributed & Dated Signal', '带出处和日期的信号', 'Storing `signal_id` + date so arrival friction tips stay traceable and time-bounded.'],
      ['Judgment Gate (`land()`)', '准入判定闸门', 'Automated verification checking that rendered copy never exceeds what the cited signal supports.']
    ],
    prompts_en: [
      'Aggregate this under traveler-intel `_signals` first—never type tips straight onto a page.',
      'Define both `supported_claim` (risk-control edge case) and `must_not_claim` (do not say Visa never works).',
      'Cite the dated `signal_id` from a cell and verify wording passes `land()`.'
    ],
    rubric: [
      r(
        'Signal Aggregation Layer', '先入信号库而非直写页面',
        ['signal', '_signals', 'aggregate', 'intel', 'collect', 'skill', '信号', '归集', '入库', '不直写'],
        'Correct: route raw posts into `data/facts/_signals/` via the traveler-intel skill first.',
        '到位：先通过 traveler-intel 归集进 `_signals`，不直接在正文里摘抄贴子。',
        'Store and aggregate traveler complaints under `data/facts/_signals/` first—never type them straight onto pages.',
        '必须先经 traveler-intel 归集成 `_signals` 数据记录，不能让 Agent 直接往页面文案里写。'
      ),
      r(
        'Scope Bounding (`must_not_claim`)', '严禁以偏概全 (`must_not_claim`)',
        ['must_not', 'scope', 'general', 'only', 'single', 'edge', 'bound', '夸大', '以偏概全', '风控', '禁', '边界'],
        'Sharp catch: one risk-control freeze cannot claim Visa fails everywhere on subways.',
        '敏锐抓住了陷阱：单个风控案例绝不能说成“所有 Visa 都不能坐北京地铁”。',
        'Explicitly pair `supported_claim` ("Some foreign cards trigger risk checks on first transit swipe") with `must_not_claim` ("Never claim Visa cards are unsupported").',
        '明确要求同时写清 `supported_claim`（部分外卡首次过闸可能触发风控）和 `must_not_claim`（绝不能写不支持 Visa）。'
      ),
      r(
        'Attribution & Freshness', '引用编号与时效日期',
        ['date', 'signal_id', 'attribut', 'cit', 'time', '日期', '编号', '出处', '引用'],
        'Good traceability: cite `signal_id` and date so old app bugs do not stay live forever.',
        '可追溯意识好：带 `signal_id` 和日期，方便以后过期下线。',
        'Ensure the tip is dated and cited by `signal_id` from a fact cell.',
        '要求信号必须附带 `signal_id` 与观察日期，方便后续随政策变化复核。'
      ),
      r(
        'Automated Claim Gate', '机审边界把关',
        ['land', 'check', 'gate', 'judge', 'verify', '核验', '检查', '闸门'],
        'Strong guardrail mindset: `land()` verifies copy never outruns signal scope.',
        '有门禁思维：最终用 `land()` 校验页面用词没有超出信号支持范围。',
        'Verify with `land()` so automated checks block over-wide wording before deploy.',
        '加上 `land()` 自动裁判检查，确保上线前卡掉越界措辞。'
      )
    ],
    gold_en: 'Never type that blanket claim onto the guide. Route the post through `.claude/skills/traveler-intel/SKILL.md` into `data/facts/_signals/` with a dated `signal_id`. Set `supported_claim` to "Some travelers report first-time foreign card risk holds; keep backup payment ready" and `must_not_claim` to "Visa cards do not work on Beijing subways." Cite `signal_id` from a cell and verify with `land()`.',
    gold_zh: '绝不直接写进页面。先按 traveler-intel 规范沉淀到 `data/facts/_signals/`，标明观察日期与 `signal_id`：`supported_claim` 写“部分外卡首次过闸可能触发风控，建议备好备用支付”；`must_not_claim` 锁死“禁止声称北京地铁不支持 Visa”。通过 cell 引用并经 `land()` 校验。',
    english_polish: [
      '"Treat that Reddit post as an anecdotal signal, not a blanket policy rule."',
      '"Log it in `_signals` with a narrow `supported_claim` and an explicit `must_not_claim` guardrail."',
      '"Verify with `land()` that our copy never generalizes a single edge case."'
    ]
  },
  {
    id: 'm2_1',
    track: 'multiagent',
    weekRef: 6,
    macPath: '/Users/fisher/Desktop/Youchina/AGENTS.md & aluminum-b2b/AGENTS.md',
    title_en: '2.1 · Codex Plan/Audit vs. Grok/Cursor Execution',
    title_zh: '2.1 · 怎么合理拆活：别让最强模型干重体力活',
    scenario_en: 'You need to convert 120 verified city JSON cells into English/Spanish/Japanese slots, wire them into Next.js pages, and audit that zero unverified claims leaked. If you let your top reasoning model (Codex/Opus) do everything itself, you hit quota limits mid-job.',
    scenario_zh: '你需要把 120 条已核实城市 JSON 转译成英/西/日三语 Slot、接进 Next.js 页面，并审计确保零未验证数据泄露。如果全让最贵的最强模型一个人从头干到尾，干一半额度就爆了。',
    concept_en: 'Match model tier to judgment complexity: strongest model owns architecture specs (PLAN) & independent acceptance (AUDIT); Coding CLI (Grok/Cursor) executes in isolated worktrees; lightweight models handle bulk translation.',
    concept_zh: '按“需要多少判断力”分配模型档位，而不是按任务字数：顶级模型只做 Plan（写清工单）和 Audit（看原始证据验收）；工程实现交给 Grok/Cursor 在独立 worktree 完成；机械批量转换用轻量模型。',
    vocab: [
      ['Judgment-Tier Routing', '按判断难度分级路由', 'Reserve expensive reasoning models for ambiguous plans & audits; delegate deterministic wiring.'],
      ['Tight Work Order', '高确定性派工单', 'Clear inputs, allowed files, and 1-command acceptance criteria so cheaper executors succeed.'],
      ['Independent Audit', '独立审计', 'Never trust an executor’s self-report—inspect raw command output and diff yourself.']
    ],
    prompts_en: [
      'Split into Plan/Audit (top model), Coding/Wiring (Grok or Cursor CLI in worktree), and Bulk Translation (lightweight model).',
      'Write a tight work order with frozen schemas and exact target paths before dispatching.',
      'Audit raw command outputs and diff—never let the planning model take over coding mid-run.'
    ],
    rubric: [
      r(
        'Plan/Audit vs. Execution Split', 'Plan/Audit 与实现分离',
        ['codex', 'plan', 'audit', 'grok', 'cursor', 'delegate', 'split', '分离', '外包', '规划', '审计', '执行'],
        'Spot-on orchestration: top reasoning stays on planning & auditing; implementation goes to Grok/Cursor CLI.',
        '分工非常到位：强模型稳住 Plan 和 Audit，写代码接线交给 Grok/Cursor CLI。',
        'Explicitly separate Plan/Audit (top model) from substantive coding/wiring (Grok/Cursor CLI)—do not let the planner rewrite code directly.',
        '需明确把 Plan/Audit（最强模型）与写代码接线（Grok/Cursor CLI）拆开，不能让规划模型亲自下场写大段代码。'
      ),
      r(
        'Bulk Mechanical Tier', '机械转换交轻量模型',
        ['haiku', 'sonnet', 'light', 'cheap', 'translat', 'bulk', '机械', '翻译', '轻量', '便宜'],
        'Great token economics: route bulk 3-language conversion to a fast/cheap tier.',
        '省 Token 关键：批量机械翻译交给轻量高速档，不浪费高阶额度。',
        'Assign bulk mechanical translation across EN/ES/JA to a lightweight model tier rather than a flagship reasoning model.',
        '指出 120 条批量机械翻译应交给轻量模型档，别拿顶级推理额度去跑流水线翻译。'
      ),
      r(
        'Tight Work Order & Worktree', '明确工单与独立 Worktree',
        ['worktree', 'order', 'brief', 'scope', 'path', 'contract', '工单', '契约', '副本', '范围'],
        'Solid safety setup: bounded work order + isolated worktree prevents dirty collisions.',
        '安全边界清晰：靠明确工单和独立 worktree 隔离并行修改。',
        'Include a tight work order (allowed paths + frozen schemas) executed inside an isolated worktree.',
        '加上“先写清楚文件白名单的工单，再在独立 worktree 里执行”，避免互相踩文件。'
      ),
      r(
        'Raw Evidence Acceptance', '独立核验原始输出',
        ['raw', 'command', 'output', 'verify', 'diff', 'check', '原始', '命令', '验收', '证据'],
        'Right verification mindset: audit raw outputs and diffs, never trust "I tested it" summaries.',
        '验收不省关键证据：亲自看真实命令原始输出与 diff，不轻信执行器口头汇报。',
        'Require raw command outputs and diffs for final audit—never accept an executor’s summary without evidence.',
        '补上独立审计不能只听执行器说“已通过”，必须核对真实命令的原始输出与 diff。'
      )
    ],
    gold_en: 'Split by judgment cost: (1) Top model writes a tight work order specifying target paths and acceptance checks; (2) lightweight model runs bulk EN/ES/JA translation on the approved cells; (3) Grok/Cursor CLI wires slots inside an isolated worktree; (4) Top model audits the git diff and raw `reconcile.mjs` output directly.',
    gold_zh: '按判断难度拆活：① 顶级模型只写清晰工单（指定文件白名单与验收命令）；② 轻量模型跑 120 条机械三语转换；③ Grok/Cursor CLI 在独立 worktree 完成接线；④ 顶级模型查看 git diff 与 `reconcile` 原始输出做独立终审。',
    english_polish: [
      '"Keep the flagship model strictly on Planning and Auditing; delegate deterministic wiring to Cursor/Grok CLI."',
      '"Route bulk 3-language conversion to a fast tier with a tight schema contract."',
      '"Hand me the exact acceptance command and its raw output—never just a pass summary."'
    ]
  },
  {
    id: 'm2_2',
    track: 'multiagent',
    weekRef: 1,
    macPath: '/Users/fisher/Desktop/Youchina/AGENTS.md · Four Ways to Break Work',
    title_en: '2.2 · Preventing the 4 Parallel Worktree Disasters',
    title_zh: '2.2 · 平行跑多个 Agent 时最致命的 4 个 Git/安装炸弹',
    scenario_en: 'Two agents work in separate Git worktrees on YouChina. Agent A runs `pnpm install` to test its branch, while Agent B compares against local `main` and runs `git checkout -- new-claims.json || git clean -fd new-claims.json`. Within 30 seconds, B deletes 65 untracked claims and freezes A’s dev server.',
    scenario_zh: '两个 Agent 同时在独立 worktree 开发 YouChina。A 直接跑了 `pnpm install`；B 对着本地 `main` 对比分支后，运行了 `git checkout -- new-claims.json || git clean -fd new-claims.json`。30 秒内，65 条新采的未追踪数据被彻底清空，A 的进程也卡死了。',
    concept_en: 'Git worktrees share workspace/store hazards unless isolated cleanly: `pnpm install` wipes sibling `node_modules`, local `main` goes stale behind `origin/*`, and `git checkout -- || git clean -fd` destroys untracked files.',
    concept_zh: '多 Worktree 并行时环境并非完全绝缘：不加限制的 `pnpm install` 会清掉兄弟目录依赖、本地 `main` 往往落后远端、而给未追踪文件串接 `git clean` 会永久销毁辛苦收集的数据。',
    vocab: [
      ['`--ignore-workspace`', '忽略工作区根目录', 'Prevents `pnpm install` in one worktree from nuking sibling worktrees’ `node_modules`.'],
      ['Compare vs. `origin/*`', '永远对齐远端分支', 'Local `main` lags behind; stale baselines cause agents to delete "unwired" protections.'],
      ['Mutate a Copy', '绝不原地运行破坏性清理', 'Never chain `git checkout -- || git clean -fd` on untracked data; test or reset on copies.']
    ],
    prompts_en: [
      'Always use `pnpm install --ignore-workspace` (plus copying the native SWC binary) in worktrees.',
      'Compare branches against `origin/main`, never a stale local branch name.',
      'Never chain `git clean -fd` behind `git checkout --` on untracked files; work on a copy instead.'
    ],
    rubric: [
      r(
        'Workspace Dependency Isolation', '隔离 Worktree 依赖安装',
        ['ignore-workspace', 'pnpm', 'node_modules', 'swc', 'ditto', 'sibling', '依赖', '工作区', '隔离'],
        'Great catch: `--ignore-workspace` + copying `@next/swc` protects sibling worktrees from frozen installs.',
        '防爆第一条命中：用 `--ignore-workspace` 并拷贝 SWC 原生二进制，避免清掉兄弟环境。',
        'Flag `pnpm install --ignore-workspace` (and copying native `@next/swc`) so one worktree never wipes another’s `node_modules`.',
        '要指出 worktree 装包必须加 `--ignore-workspace`（并同步复制 `@next/swc`），否则会拆掉并行会话的依赖。'
      ),
      r(
        'Origin Baseline Truth', '对照 origin/* 远端基准',
        ['origin', 'remote', 'stale', 'fetch', 'branch', '远端', '落后', '基准'],
        'Sharp catch: always diff against `origin/main` so stale local branches never mislead audits.',
        '防爆第二条命中：永远和 `origin/*` 对比，防止拿过期本地分支误判代码未接线。',
        'Require comparing against `origin/*` (after fetching), never stale local `main`.',
        '强调必须对比 `origin/*` 而不是本地 `main`，否则会把别人新加的保护逻辑误当死代码删掉。'
      ),
      r(
        'No Destructive Clean Chains', '禁连破坏性 Git 清理命令',
        ['clean', 'untracked', 'copy', 'destroy', 'delete', 'delet', '清理', '副本', '未追踪', '销毁'],
        'Vital safety rule: never chain `git clean -fd` behind `git checkout --`; mutate copies instead.',
        '保命红线记牢了：严禁把 `git clean -fd` 串在后面，动文件一律改副本。',
        'Ban chaining `git checkout -- || git clean -fd`—`checkout` fails on untracked files, triggering irreversible `clean`. Mutate a copy instead.',
        '明确禁用 `git checkout -- || git clean -fd` 连写，因为未追踪文件必触发 `clean` 导致数据永久丢失。'
      ),
      r(
        'Real Baseline Probe', '拒绝廉价假探针',
        ['probe', 'grep', 'raw', 'baseline', 'command', '探针', '原始', '实测'],
        'Smart verification awareness: run real checks on the live baseline, not misleading `grep -c` guesses.',
        '补齐第 4 坑：不用 `grep -c` 之类廉价探针糊弄，跑真实基线检查。',
        'Bonus defense: avoid cheap single probes like `grep -c`; run real checks and inspect raw command output.',
        '顺带提醒第 4 条铁律：别用 `grep -c` 这种假探针，要跑真实基线检查看原始输出。'
      )
    ],
    gold_en: 'Fix all 3 hazards in AGENTS.md/work orders: (1) Install inside worktrees ONLY with `pnpm install --ignore-workspace` and copy native `@next/swc-darwin-arm64`; (2) Always `git fetch` and diff against `origin/*`, never local `main`; (3) Ban `git checkout -- || git clean -fd` completely—operate on copies so untracked claim ledgers can never be wiped.',
    gold_zh: '把三大防爆铁律写死进派工单：① worktree 内装包必须加 `--ignore-workspace` 并拷贝 `@next/swc` 二进制；② 一律先 fetch 再跟 `origin/*` 比对，不看本地旧 `main`；③ 严禁 `git checkout -- || git clean -fd` 连写，涉及清理一律先改副本保护未追踪资产。',
    english_polish: [
      '"Always pass `--ignore-workspace` in worktrees so `pnpm` never wipes a sibling session’s `node_modules`."',
      '"Diff against `origin/main`, not local `main`—stale baselines cause false deletions."',
      '"Never chain `git clean -fd` on untracked files; mutate a copy so claims cannot be wiped."'
    ]
  },
  {
    id: 'm2_3',
    track: 'multiagent',
    weekRef: 9,
    macPath: '/Users/fisher/Desktop/Youchina/AGENTS.md & aluminum-b2b/AGENTS.md',
    title_en: '2.3 · Quota Ladders & Real Acceptance Probes',
    title_zh: '2.3 · 执行器遇到 402 断档 & 如何用一行命令真验收',
    scenario_en: 'Halfway through a batch page rewrite, your primary Grok CLI executor hits `402 Payment Required` (out of quota). Meanwhile, a subagent reports "All fields exist!" because it ran `grep -c` on a single page and got a positive number.',
    scenario_zh: '批量改页面刚跑一半，主力 Grok CLI 突然报错 `402 Payment Required` 额度耗尽。同时另一个 subagent 汇报“全部页面字段已核验通过！”，其实它只在一个页面文件上跑了句 `grep -c`。',
    concept_en: 'Resilient orchestration routes around quota depletion via pre-approved fallback ladders without silently lowering quality bars—and proves completion with 1-command deterministic checks on raw baseline output, never cheap counts.',
    concept_zh: '靠谱的多 Agent 系统不能因为一个模型报 402 就停摆或让规划模型硬上，也不该因为执行器降档就降低验收标准；验收必须拿真实命令原始输出说话，绝不信单点 `grep -c`。',
    vocab: [
      ['Model Fallback Ladder', '模型阶梯降级路由', 'Pre-defined chain (Grok -> alternate Grok/Sonnet) when hit by quota limits, without relaxing acceptance.'],
      ['Quota Probe Trap', '额度探针陷阱', 'A 1-token ping proves an API is alive, NOT that it has quota for an hour-long run.'],
      ['Cheap Probe Fallacy', '廉价探针幻觉', '`grep -c` counts lines, not verified fields; one page does not prove site-wide health.']
    ],
    prompts_en: [
      'Route mid-run 402 failures down the approved model ladder—never let the planner silently code or relax tests.',
      'Reject the single-page `grep -c` claim; demand the site-wide check command and raw output.',
      'Keep acceptance strict regardless of which executor finished the work.'
    ],
    rubric: [
      r(
        'Ladder Re-Dispatch on 402', '402 断档走模型阶梯重派',
        ['ladder', 'fallback', 're-dispatch', '402', 'quota', 'sonnet', 'model', '阶梯', '切换', '备选', '重派', '额度'],
        'Clean recovery: handle `402` by re-dispatching down the approved fallback ladder, not stalling.',
        '处理果断：遇 402 走预置备选模型阶梯继续跑，不卡死项目。',
        'Re-dispatch down the approved fallback ladder (e.g., secondary Grok model or Sonnet) instead of stalling or letting Codex write bulk code.',
        '指出遇到 402 应按预置模型阶梯重新派单（切备选模型或 Sonnet），不要干等，也别让规划模型代写。'
      ),
      r(
        'Never Downgrade Acceptance', '执行降档但验收绝不降档',
        ['same', 'strict', 'never lower', 'downgrade', 'accept', 'bar', 'quality', '标准', '不降', '严格', '验收'],
        'Crucial principle: a cheaper executor never buys a cheaper acceptance bar.',
        '原则很硬：执行模型可以降档，验收门槛一分不能降。',
        'State clearly that using a fallback executor never relaxes the final acceptance criteria.',
        '强调哪怕换了更轻量的执行模型，最终验收门槛也绝不打折。'
      ),
      r(
        'Expose `grep -c` Fallacy', '戳穿 `grep -c` 假阳性',
        ['grep', 'single', 'one page', 'site', 'sample', 'false', '探针', '单页', '假', '行数'],
        'Sharp audit instinct: `grep -c` and 1-page checks prove nothing across a multi-page site.',
        '审计眼很毒：单页 `grep -c` 只数行数且不能代表全站。',
        'Reject the `grep -c` result—counting lines on 1 page proves neither field validity nor site-wide coverage.',
        '当场打回单页 `grep -c` 报告——只看一页的行数证明不了字段真有效，更代表不了全站。'
      ),
      r(
        'Command + Raw Output Deliverable', '要求命令加原始回执',
        ['raw', 'command', 'output', 'reconcile', 'audit', 'script', '原始', '命令', '脚本', '全站'],
        'Great rule: deliverable = exact verification command + raw stdout.',
        '交付闭环：要求附带完整校验命令和真实原始终端输出。',
        'Demand one real verification command covering all target pages plus its raw output.',
        '要求重新跑全站校验脚本，并贴出完整命令与未裁剪的原始输出。'
      )
    ],
    gold_en: 'On `402 Payment Required`, re-dispatch the bounded work order down the approved model ladder (next Grok model -> Sonnet) without letting the planner take over coding or lowering the quality bar. Reject the `grep -c` claim immediately—a line count on one page proves nothing. Require the full multi-page verification command and its raw stdout.',
    gold_zh: '遇到 402 额度不足，按预置阶梯把工单重派给备选 Grok 或 Sonnet 继续执行，规划模型不代写、验收标准不放水。同时立刻打回 `grep -c` 假报告——单页行数毫无说服力，必须重跑全站校验命令并交出完整原始输出。',
    english_polish: [
      '"A `402` error means re-dispatch down the model ladder—never stall or relax acceptance criteria."',
      '"Reject that single-page `grep -c` check; one page does not represent the site."',
      '"Every deliverable needs one verification command and its complete raw output."'
    ]
  },
  {
    id: 'm3_1',
    track: 'growthos',
    weekRef: 3,
    macPath: '/Users/fisher/Desktop/Youchina/docs/growth/ & AGENTS.md',
    title_en: '3.1 · Cold-Start Context Compaction (5 Files Rule)',
    title_zh: '3.1 · 为什么新会话绝对不能翻旧聊天记录，只读 5 个精简文件？',
    scenario_en: 'You start a fresh Cursor/Claude session to resume YouChina SEO execution. There are 40 old `.md` strategy memos, legacy `chinaready-*` docs, and 20,000-row CSVs. If the AI reads chat history or loads everything, it wastes tokens and follows outdated 2025 strategy.',
    scenario_zh: '你新开一个 Cursor/Claude 会话继续跑 YouChina SEO。磁盘里有 40 份旧战略文档、`chinaready-*` 原型和上万行 CSV。如果让 AI 读长聊天记录或全盘扫描，不仅极其费钱，还会把去年过时战略当真。',
    concept_en: 'Context Compaction + Source Hierarchy: startup loads ONLY 5 compact state/index files (`current-cc-task.md`, `youchina-routine-state.json`, `youchina-memory-index.json`, `youchina-cc-context-lite`, `docs/seo/README.md`), filtering large data files strictly by active module.',
    concept_zh: '上下文工程的核心是“冷启动瘦身 + 真值层级”：每次开工只喂 5 个状态与索引文件，大 CSV 按当前模块切片过滤再读，旧原型文件明确标为过期废止。',
    vocab: [
      ['Startup Read Pack', '冷启动最小读包', 'Loading 4–5 small index/state files so every new agent session wakes up fast and clean.'],
      ['Source of Truth Override', '真值覆盖优先级', 'Explicit rule that `docs/seo/` overrides legacy `docs/growth/chinaready-*` files.'],
      ['Module-Filtered Loading', '按模块切片按需读取', 'Never load 20,000 rows into context—filter CSV/JSON by the active module first.']
    ],
    prompts_en: [
      'Load ONLY the 5 compact startup files (`current-cc-task.md`, `routine-state.json`, `memory-index.json`, `context-lite`, `docs/seo/README.md`).',
      'Ignore old chat history and legacy `chinaready-*` files; `docs/seo/` wins.',
      'Filter large CSV/JSON files strictly to the active module before reading.'
    ],
    rubric: [
      r(
        'Minimal 5-File Startup', '精简 5 文件冷启动',
        ['5', 'five', 'compact', 'startup', 'current-cc-task', 'routine-state', 'memory-index', 'context-lite', '精简', '启动', '索引', '状态文件'],
        'Disciplined cold-start: load only the 5 compact state/index files.',
        '冷启动非常干净：只吃那 5 个精简任务与索引文件。',
        'Restrict startup reads strictly to the 5 compact state/index files (`current-cc-task.md`, `youchina-routine-state.json`, etc.).',
        '规定开局只准读 5 个精简状态/索引文件（如 `current-cc-task.md` 和 `routine-state.json`）。'
      ),
      r(
        'Ignore Legacy & Chat Bloat', '屏蔽旧聊天与过时原型',
        ['chat', 'history', 'legacy', 'chinaready', 'outdated', 'docs/seo', 'override', 'wins', '旧', '聊天记录', '过时', '覆盖'],
        'Great context hygiene: block old chat transcripts and `chinaready-*`; enforce `docs/seo/` as SOT.',
        '防污染到位：明确禁用旧聊天记录与 `chinaready-*`，以 `docs/seo/` 为准。',
        'Explicitly block old chat history and legacy `chinaready-*` docs—state that `docs/seo/` wins as source of truth.',
        '必须点出禁止读长聊天记录和旧 `chinaready-*` 原型，确立 `docs/seo/` 的真值优先级。'
      ),
      r(
        'Filter Large Data by Module', '大数据按模块切片',
        ['filter', 'module', 'csv', 'json', 'slice', 'only', '过滤', '按模块', '切片', '不要全读'],
        'Smart Context Engineering: filter CSV/JSON by active module rather than stuffing entire tables.',
        '防爆窗技巧命中：大 CSV/JSON 必须先按当前模块过滤再进上下文。',
        'Require filtering large CSV/JSON files for the active module only before loading rows into context.',
        '加上“读大 CSV/JSON 前必须按当前活跃模块过滤切片”，别把几万行硬塞进上下文。'
      ),
      r(
        'Resume Incomplete Task First', '断点续做不重开',
        ['resume', 'incomplete', 'active', 'continue', '续做', '恢复', '未完成'],
        'Consistent workflow continuity: resume active incomplete tasks from `routine-state.json` first.',
        '连续性强：从 `routine-state.json` 恢复未完成任务，不另起炉灶。',
        'Mention resuming any incomplete active task from `youchina-routine-state.json` before starting new tasks.',
        '顺带加上：说“继续”时优先从 `routine-state.json` 接回未完任务，别重头再开新坑。'
      )
    ],
    gold_en: 'Keep startup lean: load ONLY the 5 compact Growth OS files (`current-cc-task.md`, `youchina-cc-context-lite`, `youchina-routine-state.json`, `youchina-memory-index.json`, `docs/seo/README.md`). Ignore chat history and legacy `chinaready-*` prototypes (`docs/seo/` wins), resume any active incomplete task first, and filter CSV/JSON strictly by active module.',
    gold_zh: '严控开局上下文：只加载 5 个精简状态与索引文件（`current-cc-task.md`、`context-lite`、`routine-state.json`、`memory-index.json`、`docs/seo/README.md`）。不翻聊天历史、不碰旧 `chinaready-*`（`docs/seo/` 优先），优先恢复未完成任务，读大表前先按模块过滤。',
    english_polish: [
      '"At session startup, read only the 5 compact state and index files—skip chat history."',
      '"Ignore legacy `chinaready-*` docs; `docs/seo/` is our single source of truth."',
      '"Filter large CSVs strictly by the active module before injecting anything into context."'
    ]
  },
  {
    id: 'm3_2',
    track: 'growthos',
    weekRef: 7,
    macPath: '/Users/fisher/Desktop/Youchina/AGENTS.md · Apps & 6-Locale Rule',
    title_en: '3.2 · 6-Locale Matrix & Reusing Method Checkpoints',
    title_zh: '3.2 · WeChat / DiDi / Amap 多语种扩张：怎么复用又不让工程失控？',
    scenario_en: 'You already proved and accepted the WeChat English/6-locale page (`en/fr/ja/de/es/ko` + `en-my`). Now an AI builder starts building DiDi and Amap guides, proposes adding 10 more languages (16 total) as a launch blocker, and wants to redesign the UI layout from scratch.',
    scenario_zh: '你已经验收通过了 WeChat 页面的 6 国语言版（外加 `en-my` 英语市场变体）。现在要做 DiDi 和 Amap 页面，AI 提议顺便扩到 16 种语言并设成上线门槛，还打算顺手重新设计一套全新页面布局。',
    concept_en: 'Reuse proven Skills/Method Checkpoints rather than rebuilding design from zero, and keep release gates tightly scoped: treat market variants (`en-my`) as variants—not new language gates—and expand locales only after core 6-locale loops pass.',
    concept_zh: '成熟产品线靠“方法论检查点 (Method Checkpoint)”横向复制，不重造 UI 轮子；上线门禁必须锁死在已验证的 6 语种核心圈，切忌把非核心语种膨胀成上线阻断器。',
    vocab: [
      ['Method Checkpoint', '可复用方法检查点', 'Saving validated page logic, error fixes, and release lessons so subsequent apps ship 3x faster.'],
      ['Release Gate Bloat', '上线门禁膨胀', 'Turning nice-to-have 16-language coverage into a blocker that stalls real launch.'],
      ['Market Variant vs. Language', '市场变体 vs 独立语种', 'Treating `en-my` as an English variant reusing accepted logic rather than a 7th translation pipeline.']
    ],
    prompts_en: [
      'Reuse the accepted WeChat design and Method Checkpoint—do not rebuild UI from scratch.',
      'Keep DiDi/Amap strictly scoped to the 6 core locales (`en/fr/ja/de/es/ko`); block 16-locale gate bloat.',
      'Treat `en-my` as an English variant and log workflow fixes into the shared playbook.'
    ],
    rubric: [
      r(
        'Reuse Accepted Design/Checkpoint', '复用已验收设计与方法',
        ['reuse', 'checkpoint', 'wechat', 'redesign', 'design', 'logic', 'preserve', '复用', '重做', '检查点', '保留'],
        'Great restraint: reuse the accepted WeChat design & Method Checkpoint instead of rebuilding.',
        '抓准了效率核心：直接复用已验收的 WeChat 页面架构与 Method Checkpoint，不重复造轮子。',
        'Instruct the AI to reuse the accepted WeChat design, page logic, and Method Checkpoint—never rebuild UI from scratch.',
        '叫停重新设计布局！明确要求横向复用已验收的 WeChat 结构逻辑与 Method Checkpoint。'
      ),
      r(
        'Cap Release Gate at 6 Locales', '上线门槛锁死 6 语种',
        ['6', 'six', '16', 'sixteen', 'scope', 'gate', 'block', 'en/fr', '六', '6', '16', '十六', '膨胀', '门槛'],
        'Smart scope control: lock DiDi/Amap release gates to the 6 proven locales, rejecting 16-locale bloat.',
        '范围控制极佳：把 DiDi/Amap 上线门禁锁死在 6 语种，拒绝 16 语种拖垮上线节奏。',
        'Reject making 16 languages a release gate—cap DiDi and Amap strictly within the 6 core locales (`en/fr/ja/de/es/ko`).',
        '明确砍掉 16 语种上线门槛，把 DiDi 和 Amap 严格收在已验证的 6 国语言之内。'
      ),
      r(
        'Variant Distinction (`en-my`)', '分清语言与地区变体',
        ['en-my', 'variant', 'seventh', 'english', '变体', '第七'],
        'Clean taxonomy: `en-my` is an English market variant, not a 7th language stack.',
        '分类清晰：`en-my` 只是英语市场变体，不单独按第 7 种语言增加维护成本。',
        'Clarify that `en-my` is an English market variant, not a separate 7th core language.',
        '点出 `en-my` 是英语区域变体而非第 7 种语言，避免误算工作量。'
      ),
      r(
        'Capture Playbook Lessons', '沉淀失败与修复经验',
        ['record', 'log', 'lesson', 'failure', 'playbook', 'workflow', '记录', '复盘', '沉淀'],
        'Good Skill-building habit: record real failures & fixes as you go into a reusable playbook.',
        '有 Skill 沉淀意识：把踩坑和修法随手记下来，跑通后固化成可复用 Playbook。',
        'Record workflow fixes and quality lessons while building DiDi/Amap to consolidate into a reusable playbook after launch.',
        '加上“边做 DiDi/Amap 边记录踩坑与修法”，上线后就能打包成可复用的 Skill/Playbook。'
      )
    ],
    gold_en: 'Stop the redesign and reject the 16-language gate. Reuse the accepted WeChat page logic and Method Checkpoint for DiDi and Amap, keeping their release gate strictly within the 6 core locales (`en/fr/ja/de/es/ko`, treating `en-my` as an English variant). Log failures, root causes, and fixes during execution to harden the reusable post-launch playbook.',
    gold_zh: '叫停重新设计与 16 语种上线门槛！DiDi 与 Amap 直接复用已验收的 WeChat 设计和 Method Checkpoint，上线门禁严格控制在 6 语种（`en-my` 按英语变体处理）。过程中同步记录失败原因与修法，上线后沉淀为标准化 Playbook。',
    english_polish: [
      '"Reuse the accepted WeChat design and Method Checkpoint—do not rebuild page logic from scratch."',
      '"Keep DiDi and Amap strictly within the 6 core locales; never let 16 languages become a release blocker."',
      '"Treat `en-my` as an English market variant, not a seventh translation pipeline."'
    ]
  },
  {
    id: 'm3_3',
    track: 'growthos',
    weekRef: 8,
    macPath: '/Users/fisher/Desktop/Youchina/docs/growth/youchina-hook-registry.json',
    title_en: '3.3 · Hook Registry & Destructive Action Locks',
    title_zh: '3.3 · 日常口头指令防走偏 & 严禁 AI 擅自删档',
    scenario_en: 'When you type quickly on iPhone: "continue" or "clean up those 12 duplicate draft docs and old pages so the repo feels tidy," an enthusiastic coding agent immediately proposes running `rm -rf` on old strategy folders and rewriting routine state.',
    scenario_zh: '你在手机上随口发一句：“继续，顺便把那十几个看着重复的旧文档和草稿页删掉清理干净。” 热情过头的 AI 马上准备跑 `rm -rf` 删目录并改写状态文件。',
    concept_en: 'Casual owner messages map to deterministic routes via `hook-registry.json`, while destructive actions (delete/archive/deploy/paid calls) are hard-locked behind explicit approval logs (`youchina-owner-approval-log.json`).',
    concept_zh: '日常口语指令通过 `hook-registry` 映射到确定路由（“继续”=恢复当前未完任务）；而删除、归档、付费调用、提交上线等高危动作必须在 Harness 层硬锁死，未见授权记录只报告候选列表并等待批准。',
    vocab: [
      ['Intent-to-Route Registry', '口语路由映射表', 'Translating casual phrases ("continue") deterministically to exact state/runbooks without rewriting prompts.'],
      ['Candidate-and-Wait Gate', '列清单等待确认', 'Proposing candidates for deletion/archive without ever executing irreversible `rm` commands autonomously.'],
      ['Approval Ledger', '审批红线账本', 'Persisted JSON log verifying explicit founder sign-off before destructive or external write actions.']
    ],
    prompts_en: [
      'Map "continue" to `youchina-routine-state.json` via `youchina-hook-registry.json` to resume active work.',
      'Block all `rm` / archive / rewrite actions—report the candidate list and wait for approval log entry.',
      'Archive rather than hard-delete unless explicit approval is logged.'
    ],
    rubric: [
      r(
        'Hook Registry Resume', '口语映射与断点恢复',
        ['hook', 'registry', 'routine', 'continue', 'resume', 'state', '映射', '恢复', '继续', '状态'],
        'Smooth operational control: map "continue" via `hook-registry.json` to resume `routine-state.json` first.',
        '调度清晰：用 `hook-registry` 把口头“继续”精准路由到未完任务恢复。',
        'Map casual "continue" via `youchina-hook-registry.json` to resume the active incomplete task in `routine-state.json`.',
        '指出“继续”应通过 `youchina-hook-registry.json` 自动接回 `routine-state.json` 里的未完任务。'
      ),
      r(
        'Hard Block Destructive Delete', '硬锁死自主删除行为',
        ['never delete', 'block', 'stop', 'rm', 'approval', 'log', 'forbidden', '禁止', '删', '批准', '红线', '锁'],
        'Critical Harness safety: block autonomous deletion/rewriting without logged founder approval.',
        '守住保命红线：严禁任何未经审批记录的删除或覆盖操作。',
        'Enforce the hard redline: NEVER delete, archive, or permanently rewrite files without recorded Fisher approval in `youchina-owner-approval-log.json`.',
        '用 Harness 红线彻底拦截擅自删除/归档——必须检查 `owner-approval-log.json` 里是否有明确批准。'
      ),
      r(
        'Report Candidates & Wait', '先给候选清单等确认',
        ['candidate', 'list', 'wait', 'confirm', 'report', '候选', '清单', '等', '确认'],
        'Right Human-in-the-loop pattern: output candidate paths + reason, then pause.',
        '人机协同标准动作：列出候选删除清单与理由，然后停下来等人拍板。',
        'Require the agent to report the deletion candidate list with reasons and WAIT—never act on a casual cleanup wish.',
        '要求 Agent 只交出“待清理候选清单与风险说明”并停下来等待，不能把随口一句清理当成删库指令。'
      ),
      r(
        'Archive Over Hard-Delete', '优先归档而非物理销毁',
        ['archive', 'backup', 'copy', 'move', '归档', '备份', '保留'],
        'Safe fallback: prefer archiving polluted context over irreversible hard deletion.',
        '稳妥习惯：旧文件优先归档隔离，尽量不做不可逆硬删除。',
        'Prefer archiving stale context into an archive folder rather than permanently deleting history.',
        '建议优先采用归档隔离旧上下文，避免误删后续需要的原始证据。'
      )
    ],
    gold_en: 'Two deterministic rules trigger here: (1) Route "continue" via `youchina-hook-registry.json` to resume the active task in `youchina-routine-state.json`; (2) Hard-block any deletion or archiving—without an explicit entry in `youchina-owner-approval-log.json`, the agent must only list cleanup candidates, explain why, and wait (preferring archiving over hard delete).',
    gold_zh: '同时触发两条确定性规范：① 按 `hook-registry.json` 把“继续”路由到 `routine-state.json` 恢复当前未完任务；② 触发防误删红线——在未查到 `owner-approval-log.json` 正式授权前，绝不允许删档或归档，只准列清单汇报候选并等待拍板。',
    english_polish: [
      '"Route casual phrases through `hook-registry.json` and resume active state before touching anything new."',
      '"Do not execute any delete or archive autonomously—give me the candidate list and wait for explicit approval."',
      '"Archive stale context cleanly instead of running irreversible deletes."'
    ]
  },
  {
    id: 'm4_1',
    track: 'alub2b',
    weekRef: 6,
    macPath: '/Users/fisher/Desktop/aluminum-b2b/AGENTS.md · Upgrade Priorities',
    title_en: '4.1 · Search Intent Routing (Product Leaf vs. Brand Check)',
    title_zh: '4.1 · Aluminum B2B SEO 怎么避免做错流量意图？',
    scenario_en: 'Your SEO agent suggests targeting high-volume English keyword "aluminum extrusion supplier" AND building a Vietnamese container-import funnel for "nhôm Xingfa nhập khẩu". Why do both fail commercial intent, and how should pages route instead?',
    scenario_zh: 'SEO Agent 建议主攻高搜索量的英文词 `aluminum extrusion supplier`，还想给越南词 `nhôm Xingfa nhập khẩu` 搭一套整柜直采询盘漏斗。为什么这两个方向都会跑偏，应该怎么改？',
    concept_en: 'High-intent B2B SEO & GEO wins by matching real SERP intent (China/import buyer vs. US domestic vs. local brand authenticity verification) rather than chasing raw keyword volume or batch pSEO pages.',
    concept_zh: 'B2B SEO/GEO 不能只看词表搜索量，必须先按真实搜索意图分流（美国本土词 vs 中国采购词、直接进口 vs 本地品牌真伪核验），并死磕单页深度转化而非铺量薄页（thin pSEO）。',
    vocab: [
      ['SERP Intent Mismatch', '搜索意图错配', 'Naked `aluminum extrusion supplier` belongs to US domestic buyers; China-sourcing pages must target import/China intent.'],
      ['Product Leaf vs. Thin pSEO', '深度产品转化页 vs 批量水页', 'Proving conversion on one evidence-rich Product Leaf (shortlist + RFQ) before scaling hubs.'],
      ['Gate vs. Direct Leak', '门槛筛选与询盘门禁', 'Turning supplier contacts into shortlist/compare/RFQ workflows rather than public phone/email dumps.']
    ],
    prompts_en: [
      'Avoid naked US-domestic `aluminum extrusion supplier`; target China/import/supplier intent.',
      'Rework Vietnamese `nhôm Xingfa` as brand verification / distributor guidance, not direct import.',
      'Prove one high-signal Product Leaf with shortlist + RFQ before scaling hubs or pSEO.'
    ],
    rubric: [
      r(
        'Reject Naked Domestic SERP', '避开美国本土裸词竞争',
        ['domestic', 'china', 'import', 'naked', 'us', 'extrusion', '本土', '中国', '进口', '裸词'],
        'Sharp SERP judgment: drop naked US-domestic terms and target China/import/supplier intent.',
        '关键词判断精准：避开美国本土卖家盘踞的裸词，主攻带 China/import 意图的采购词。',
        'Explain that naked `aluminum extrusion supplier` is a US domestic SERP—target China/import/supplier intent instead.',
        '指出纯 `aluminum extrusion supplier` 是美国本土内销 SERP，必须加上 China / import / supplier 采购限定词。'
      ),
      r(
        'Reframe Vietnamese Xingfa Intent', '重定义越南 Xingfa 为验真意图',
        ['xingfa', 'vietnam', 'verif', 'origin', 'distributor', 'retail', '越南', '验真', '真伪', '零售', '经销'],
        'Exact local market insight: Vietnamese `nhôm Xingfa` is local retail & origin verification, not direct factory container import.',
        '本地市场洞察准确：越南 `nhôm Xingfa` 用户主要在找正品溯源与当地安装经销，不是整柜直采。',
        'Rework `/vi/products/nhom-xingfa` as Brand Verification / distributor guidance rather than direct container import.',
        '把越南 `nhôm Xingfa` 页面改定位为“品牌真伪验证与本地经销商指引”，不要硬推整柜进口。'
      ),
      r(
        'Product Leaf Before pSEO', '先跑通单张高转化产品叶页',
        ['leaf', 'shortlist', 'rfq', 'thin', 'pseo', 'hub', 'batch', '叶页', '候选单', '询盘', '薄页'],
        'Disciplined growth sequence: prove Product Leaf shortlist + RFQ first; ban thin batch pSEO.',
        '增长节奏稳健：先打透高证据产品叶页 + Shortlist + RFQ，严禁铺大量低质薄页。',
        'Focus P0 on proving one Product Leaf with real shortlist/RFQ conversion rather than batching thin pSEO pages.',
        '强调优先打穿一个带 Shortlist 与 RFQ 的高质量 Product Leaf，严禁批量铺低质量 pSEO 页面。'
      ),
      r(
        'Protect Supplier Contact Info', '用门禁保护供应商联系信息',
        ['phone', 'email', 'url', 'gate', 'expose', 'public', '联系', '电话', '邮箱', '门禁', '隐藏'],
        'Strong business moat: keep phone/email/URL behind shortlist, compare, and RFQ gates.',
        '护城河意识好：不把供应商电话邮箱直接晒在公网，统一走 Shortlist/RFQ 门禁。',
        'Keep supplier phone, email, and official URL behind shortlist/compare/RFQ gates—never expose raw contacts publicly.',
        '补充业务红线：默认不公开晒供应商电话、邮箱或官网链接，引导走选型对比与 RFQ 门禁。'
      )
    ],
    gold_en: 'Drop naked `aluminum extrusion supplier` (US domestic SERP) and pivot to China/import buyer intent on `/en/products/aluminum-extrusion-profiles` with real evidence cards, shortlist, and structured RFQ (demand collection, not brokerage guarantee). Reframe Vietnamese `nhôm Xingfa` as Brand Verification / origin & distributor guidance. Prove the Product Leaf before scaling hubs or touching batch pSEO.',
    gold_zh: '放弃竞争不过且意图不符的裸词 `aluminum extrusion supplier`，改打带 China/import 意图的采购叶页，用证据卡+选型清单+结构化 RFQ 验证转化（定位为需求收集与引荐）。同时把越南 `nhôm Xingfa` 改为品牌溯源与当地经销指导；绝不先铺薄 pSEO。',
    english_polish: [
      '"Do not target naked domestic keywords—optimize for China/import buyer intent with shortlist + RFQ."',
      '"Reframe Vietnamese `nhôm Xingfa` around origin verification and distributor guidance, not direct import."',
      '"Prove conversion on one evidence-backed Product Leaf before building navigation hubs or thin pSEO."'
    ]
  },
  {
    id: 'm4_2',
    track: 'alub2b',
    weekRef: 1,
    macPath: '/Users/fisher/Desktop/aluminum-b2b/AGENTS.md · Display-Gap Policy',
    title_en: '4.2 · Buyer Display-Gap Policy (`NULL` in DB vs. Hide on UI)',
    title_zh: '4.2 · 缺 MOQ、缺交期或没海关数据时，前台该显示什么？',
    scenario_en: 'In `lvb2b_local` (694 suppliers), 200 factories lack verified MOQ and lead-time data, and the customs shipment table is currently empty. An AI frontend builder renders `"MOQ: 0"`, `"Lead Time: Unverified / 待核实"`, `"Verified Supplier ✓"`, and a footer disclaimer to fill empty grid cards.',
    scenario_zh: '本地库 `lvb2b_local`（694 家供应商）里有 200 家缺少 MOQ 和交期数据，且海关出口表目前还是空的。AI 写前端时为了卡片对齐，自动渲染出了 `MOQ: 0`、`交期：待核实`、`Verified 徽章` 和一行免责声明占位。',
    concept_en: 'Separate internal data honesty (`NULL` in database—never turn missing into `0`) from clean buyer UI (`omit missing blocks completely`—no "unverified", "—", `0`, or apology disclaimers; never show "Verified" or customs stats without real third-party/table backing).',
    concept_zh: '把“内部数据诚实度”与“买家界面洁净度”彻底分开：数据库里缺失必须如实记 `NULL`（绝不写成 0）；前台界面则采取“整块缺数就整块不渲染”，不吐出 `待核实`/`未知`/`—`/`0` 或免责声明，更不能无证挂 `Verified` 和虚假海关数据。',
    vocab: [
      ['Internal NULL vs. UI Omit', '库内 NULL 与前台不渲染', 'Keep `NULL` accurately in SQL/JSON for internal tracking; hide missing sections completely on the buyer UI.'],
      ['Zero Placeholder Rule', '零占位符铁律', 'Never render `"unverified"`, `"pending"`, `"—"`, `"0"`, or disclaimer filler on customer cards.'],
      ['Evidence-Backed Badge', '有据可依的徽章红线', 'Ban `"Verified"` badges and customs claims unless backed by real audits/non-empty shipment rows.']
    ],
    prompts_en: [
      'Keep missing MOQ/lead-time as `NULL` in `lvb2b_local`—never write `0` or invent estimates.',
      'Hide missing fields/blocks completely on buyer UI: zero `unverified`, `pending`, `—`, `0`, or disclaimers.',
      'Remove the fake `Verified` badge and any customs shipment claims while the customs table is empty.'
    ],
    rubric: [
      r(
        'Keep NULL in Database (Never 0)', '库内保持 NULL 不写成 0',
        ['null', 'sql', 'db', 'database', 'internal', 'lvb2b', '0', '数据库', '空值', '不写0', '诚实'],
        'Accurate data architecture: preserve `NULL` internally in `lvb2b_local`, never convert missing values to `0`.',
        '数据口径严谨：库内缺失原样保持 `NULL`，绝不篡改写成 `0`。',
        'Keep missing values strictly as `NULL` inside `lvb2b_local`—never write missing MOQ/lead time as `0` or invent estimates.',
        '指出数据库里缺失项必须如实存 `NULL`，绝不能填 `0` 或瞎猜均值。'
      ),
      r(
        'Hide Missing Blocks on Buyer UI', '买家界面缺数则整块隐藏',
        ['hide', 'omit', 'render', 'empty', 'placeholder', 'unverified', 'pending', '隐藏', '不渲染', '待核实', '占位'],
        'Exact display-gap execution: hide missing blocks cleanly with zero `unverified`, `—`, or disclaimer clutter.',
        '完全符合 Display-Gap 规则：缺数就整块不渲染，消除 `待核实`、`—` 与免责补位文字。',
        'Enforce the Display-Gap UI policy: if a field or block is missing, hide the block completely—zero `unverified`, `pending`, `—`, `0`, or disclaimers.',
        '明确前台执行“缺数即整块不渲染”，不出现 `待核实`、`—`、`0` 或免责声明占位。'
      ),
      r(
        'Strip Fake Verified & Customs', '严禁无证挂 Verified 与虚假海关数据',
        ['verified', 'customs', 'audit', 'certificate', 'empty', 'badge', '徽章', '海关', '认证', '证据'],
        'Crucial trust protection: remove `Verified` badges and customs shipment claims when evidence/table is empty.',
        '信任红线守得好：无第三方认证不挂 `Verified`，海关表空着就绝不写出口出货证明。',
        'Strip `"Verified"` badges (no third-party audit exists) and block customs/export claims while the customs table is empty.',
        '同时打掉虚假 `Verified` 徽章（无真实第三方审厂依据）以及基于空海关表的出货声明。'
      ),
      r(
        'Founder Pre-Ship Review', '上线前先跟负责人过目',
        ['fisher', 'review', 'check', 'before', 'qa', '过一遍', '确认', '验收'],
        'Good governance: review display-gap changes with Fisher before pushing live.',
        '流程合规：Display-Gap 改动上线前与你过一遍后再发布。',
        'Include a pre-ship visual review + `display-gap-policy` scan before pushing UI changes to production.',
        '补充：此类 Display-Gap 改动上线前先走扫描并跟你过一遍确认。'
      )
    ],
    gold_en: 'Reject that UI immediately. Keep missing MOQ/lead-time as `NULL` in `lvb2b_local` (never `0` or invented averages). On the buyer frontend, apply the Display-Gap Policy: omit missing blocks completely—no `"unverified"`, `"—"`, `"0"`, or disclaimer filler. Strip `"Verified"` badges and all customs claims until real third-party certificates and non-empty customs rows exist.',
    gold_zh: '立刻打回该前端实现。数据层 `lvb2b_local` 如实保留 `NULL`（绝不写 0 或编造均值）；买家前台严格执行 Display-Gap：缺数据就整块隐藏不渲染，禁止 `待核实`、`—`、`0` 与免责补位。在没有真实审厂证书和非空海关数据前，全面拿掉 `Verified` 徽章与海关证明话术。',
    english_polish: [
      '"Keep missing fields as `NULL` in the database—never rewrite missing MOQ as `0`."',
      '"On the buyer UI, omit missing blocks cleanly instead of showing `unverified`, `—`, or filler disclaimers."',
      '"Remove `Verified` badges and export claims unless backed by real audits and non-empty tables."'
    ]
  },
  {
    id: 'm4_3',
    track: 'alub2b',
    weekRef: 4,
    macPath: '/Users/fisher/Desktop/aluminum-b2b/AGENTS.md · /llms-full.txt & Supplier Cards',
    title_en: '4.3 · GEO `/llms-full.txt` & Real Supplier Evidence',
    title_zh: '4.3 · 修复 `/llms-full.txt` 假数据，打造被 AI 引擎引用的供应证据',
    scenario_en: 'You discover `/llms-full.txt` on Aluminum B2B still serves mock supplier profiles from an old prototype—yet ChatGPT Search, Claude, and Perplexity crawl `/llms-full.txt` to understand your site! Also, the sales team wants to display factory/trading inference without USCC or site evidence.',
    scenario_zh: '你检查发现 Aluminum B2B 站点的 `/llms-full.txt` 里竟然还放着早期原型的假供应商数据——而 ChatGPT Search、Claude 和 Perplexity 正是通过它抓取全站上下文！同时有人想不查工商统一社会信用代码（USCC）就直接标“源头工厂”。',
    concept_en: 'GEO starts with machine-readable truth: `/llms-full.txt` and evidence cards must emit ONLY real verified database rows (`lvb2b_local`: 694 suppliers, 7,755 products) with sourced attributes (USCC, factory/trading inference, English/multilingual site, sourced certifications)—never mock prototype text.',
    concept_zh: 'GEO 时代，`/llms-full.txt` 就是给大模型看的“全站招股说明书”。放假数据等于主动教 AI 搜索引擎胡说八道；必须与 `lvb2b_local` 真值库打通，每张能力卡标注 USCC、工贸判定依据、语种站与有出处认证，同时绝不泄露直接联系方式。',
    vocab: [
      ['`/llms-full.txt` Grounding', '大模型全站上下文入口真实化', 'Replacing prototype placeholder text with live DB-emitted facts so AI search engines cite real capabilities.'],
      ['Sourced Inference', '有据可查的工贸判定', 'Backing factory vs. trading company labels with USCC & registration scope rather than guessing.'],
      ['Stale Count Hygiene', '历史数据口径清理', 'Using verified live counts (`694` suppliers / `7,755` products) instead of stale cached numbers (`683` / `4,526`).']
    ],
    prompts_en: [
      'Replace all mock data in `/llms-full.txt` using verified `lvb2b_local` DB rows (`694` suppliers / `7,755` products).',
      'Require USCC, product fit, multilingual site status, and sourced certifications on evidence cards—never invent factory status.',
      'Ensure `/llms-full.txt` omits direct supplier phones/emails and respects Display-Gap NULL rules.'
    ],
    rubric: [
      r(
        'Purge Mock Data in /llms-full.txt', '清除 /llms-full.txt 假数据',
        ['llms', 'mock', 'replace', 'real', 'db', 'lvb2b', '694', '7755', '7,755', '假', '替换', '真值'],
        'Essential GEO fix: generate `/llms-full.txt` straight from verified `lvb2b_local` truth, zero mock leftovers.',
        'GEO 关键动作命中：用 `lvb2b_local` 真实记录动态生成 `/llms-full.txt`，清除原型假数据。',
        'Replace mock supplier data in `/llms-full.txt` immediately with verified facts emitted from `lvb2b_local` (current truth: 694 suppliers / 7,755 products).',
        '必须立刻替换 `/llms-full.txt` 里的原型假数据，改为从 `lvb2b_local`（694 供应商 / 7,755 产品）真值库生成。'
      ),
      r(
        'USCC & Sourced Evidence Cards', 'USCC 与有据认证卡',
        ['uscc', 'factory', 'trading', 'cert', 'evidence', 'sourced', 'credit', '工商', '工贸', '认证', '依据'],
        'Solid evidence rigor: back factory/trading claims with USCC & sourced certifications.',
        '证据意识扎实：工贸判断靠 USCC 营业范围与有出处认证，不靠瞎猜。',
        'Anchor supplier evidence cards on USCC, factory/trading inference rationale, English/multilingual website, and sourced certifications.',
        '能力证据卡必须写清：产品匹配度、USCC 依据与工贸判断逻辑、外语网站状态以及有来源出处的认证。'
      ),
      r(
        'No Public Contact Exposure', '不在 llms.txt 暴露直连方式',
        ['phone', 'email', 'url', 'rfq', 'shortlist', 'gate', 'expose', '电话', '邮箱', '暴露', '询盘'],
        'Smart security boundary: keep raw phones/emails/URLs out of public `/llms-full.txt`; route buyers to shortlist/RFQ.',
        '风控到位：不在公开 `/llms-full.txt` 里裸露工厂电话邮箱，引导进入 Shortlist/RFQ 转化。',
        'Keep supplier phones, emails, and direct URLs OUT of `/llms-full.txt`—point AI engines to your shortlist/RFQ entry.',
        '注意 `/llms-full.txt` 同样遵守不暴露供应商电话/邮箱/官网 URL 红线，引导 AI 把流量转给你的 RFQ 入口。'
      ),
      r(
        'Avoid Stale Historical Numbers', '禁用过时历史统计口径',
        ['stale', '683', '4526', '4,526', 'count', 'fresh', '过时', '旧数字', '口径'],
        'Sharp data hygiene: block stale counts (`683`, `4,526`) from leaking into GEO summaries.',
        '口径严谨：清理掉历史旧数（如 683 或 4526），全站只认当前实盘计数。',
        'Audit out stale historical counts (`683`, `4,526`, `213`) so AI search engines never quote conflicting stats.',
        '提醒全站排查过时数字（如 683、4526），避免 AI 搜索引擎抓到前后矛盾的统计口径。'
      )
    ],
    gold_en: 'Treat `/llms-full.txt` as a first-class GEO surface: purge all mock prototype profiles and emit structured summaries straight from verified `lvb2b_local` records (694 suppliers / 7,755 products—zero stale counts). Show product fit, USCC-backed factory/trading inference, site language signals, and sourced certifications—while keeping direct phones/emails out and routing inquiries into shortlist/RFQ.',
    gold_zh: '把 `/llms-full.txt` 当作最高优先级的 GEO 入口：彻底清空原型假数据，由 `lvb2b_local` 真值库动态输出（认准 694 家供应商 / 7,755 条产品，剔除旧口径）。证据卡展示产品匹配、USCC 工贸推断、多语站与有出处认证；严禁在公开文本暴露电话邮箱，全部导流进 Shortlist/RFQ。',
    english_polish: [
      '"`/llms-full.txt` feeds AI search engines directly—purge all mock profiles and emit from verified `lvb2b_local` rows."',
      '"Back factory-vs-trading labels with USCC scope and sourced certifications—never guess."',
      '"Keep raw supplier contacts out of `/llms-full.txt`; route AI-referred buyers straight to shortlist and RFQ."'
    ]
  }
];
