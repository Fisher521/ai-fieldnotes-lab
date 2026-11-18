import { weeks, lessons, sources, terms, byId } from './content.js';
import { playbooks, studioPresets, studioToggleMeta, defaultEvalChecks, trends2026 } from './playbooks.js';
import { dailyPath16, systemSynthesisLayers, missionTracks, missions, getMissionDrill } from './missions.js';

const STORAGE_KEY = 'ai_fieldnotes_learning_v1';
const DEFAULT_BASICS = ['w1d1', 'w1d2', 'w1d3', 'w1d4', 'w1d5', 'w2d1'];
const $= (q) => document.querySelector(q);

let state = readState();
let cardIndex = 0;
let cardBack = false;
let toastTimer;
let openTranslations = new Set();
let openSymptoms = new Set(['sym1', 'seo1']);
let notesTab = 'notes';
let activePlaybook = playbooks[0].id;
let studioTab = 'agents';
let toolkitSub = 'cards'; // 'cards' | 'studio' | 'playbooks' | 'curriculum' | 'notes'

// Ephemeral 4-step lesson session state
let sess = {
  id: null,
  step: 1,
  s1Picked: null,
  wbOrder: [],
  wbShuffled: [],
  wbChecked: false,
  wbCorrect: false
};

let activeVoiceRec = null;
let isRecordingVoice = false;

function readState() {
  try {
    return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'));
  } catch {
    return normalize(null);
  }
}

function normalize(d) {
  const x = d && typeof d === 'object' ? d : {};
  const preset = studioPresets[x.studioPreset] ? x.studioPreset : 'youchina';
  const defFlags = studioPresets[preset].flags;
  const f = x.studioFlags && typeof x.studioFlags === 'object' ? x.studioFlags : {};
  const hasSavedCompleted = Array.isArray(x.completed);
  return {
    completed: hasSavedCompleted ? x.completed.filter((v) => typeof v === 'string') : [...DEFAULT_BASICS],
    quiz: x.quiz && typeof x.quiz === 'object' ? x.quiz : {},
    drafts: x.drafts && typeof x.drafts === 'object' ? x.drafts : {},
    notes: x.notes && typeof x.notes === 'object' ? x.notes : {},
    labs: Array.isArray(x.labs) ? x.labs.filter((v) => typeof v === 'string') : [],
    learned: Array.isArray(x.learned) ? x.learned.filter((v) => typeof v === 'string') : [],
    langMode: ['en_zh', 'en', 'zh'].includes(x.langMode) ? x.langMode : 'en_zh',
    showAllTr: Boolean(x.showAllTr),
    studioPreset: preset,
    studioName: typeof x.studioName === 'string' ? x.studioName : studioPresets[preset].name_en,
    studioGoal: typeof x.studioGoal === 'string' ? x.studioGoal : studioPresets[preset].goal_en,
    studioFlags: {
      fixedFlow: f.fixedFlow !== undefined ? Boolean(f.fixedFlow) : defFlags.fixedFlow,
      highFactRisk: f.highFactRisk !== undefined ? Boolean(f.highFactRisk) : defFlags.highFactRisk,
      writeActions: f.writeActions !== undefined ? Boolean(f.writeActions) : defFlags.writeActions,
      multilingual: f.multilingual !== undefined ? Boolean(f.multilingual) : defFlags.multilingual,
      untrustedWeb: f.untrustedWeb !== undefined ? Boolean(f.untrustedWeb) : defFlags.untrustedWeb,
      aiCoding: f.aiCoding !== undefined ? Boolean(f.aiCoding) : defFlags.aiCoding
    },
    evalChecks: Array.isArray(x.evalChecks) ? x.evalChecks.filter((v) => typeof v === 'string') : [],
    customEvals: Array.isArray(x.customEvals)
      ? x.customEvals.filter((v) => v && typeof v.id === 'string' && typeof v.text === 'string')
      : [],
    missionDrafts: x.missionDrafts && typeof x.missionDrafts === 'object' ? x.missionDrafts : {},
    missionEvals: x.missionEvals && typeof x.missionEvals === 'object' ? x.missionEvals : {},
    completedMissions: Array.isArray(x.completedMissions) ? x.completedMissions.filter((v) => typeof v === 'string') : []
  };
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    notice(t('Cannot save locally. Export JSON backup.', '无法保存本地记录，请导出备份'));
  }
}

function e(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function isZh() { return state.langMode === 'zh'; }
function isEnZh() { return state.langMode === 'en_zh'; }
function t(en, zh) { return isZh() ? (zh || en) : (en || zh); }
function percentage(n, d) { return d ? Math.round((n / d) * 100) : 0; }
function bar(n) { return '<div class="micro-progress"><i style="width:' + n + '%"></i></div>'; }

function notice(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function currentRoute() {
  const h = (location.hash || '#/missions').replace(/^#\/?/, '');
  const a = h.split('/').filter(Boolean);
  return { view: a[0] || 'missions', arg: a[1] };
}

function navigate(p) { location.hash = '#/' + p; }

function nextDailyEntry() {
  return dailyPath16.find((d) => !state.completedMissions.includes(d.id)) || dailyPath16[0];
}

function dayEntryFor(id) {
  return dailyPath16.find((d) => d.id === id) || dailyPath16[0];
}

function initSession(missionId) {
  const m = missions.find((x) => x.id === missionId) || missions[0];
  const drill = getMissionDrill(m);
  const indexed = drill.chunks.map((text, idx) => ({ idx, text }));
  // Deterministic shuffle so Step 2 always presents an interactive ordering puzzle
  const shuffled = [...indexed].sort((a, b) => ((a.idx * 7 + m.id.charCodeAt(1)) % 11) - ((b.idx * 7 + m.id.charCodeAt(1)) % 11));
  if (shuffled.length > 1 && shuffled.every((x, i) => x.idx === i)) {
    shuffled.reverse();
  }
  sess = {
    id: m.id,
    step: 1,
    s1Picked: null,
    wbOrder: [],
    wbShuffled: shuffled,
    wbChecked: false,
    wbCorrect: false
  };
}

function evaluateMission(m, draft) {
  const txt = String(draft || '').toLowerCase();
  const hits = m.rubric.map((rule) => rule.keywords.some((kw) => txt.includes(kw.toLowerCase())));
  const score = hits.filter(Boolean).length;
  return { score, total: m.rubric.length, hits, ts: new Date().toISOString() };
}

function buildBilingualConfirmation(m, draft, evRec) {
  const hitRules = m.rubric.filter((_, i) => evRec.hits[i]);
  const missRules = m.rubric.filter((_, i) => !evRec.hits[i]);
  const enConfirm = hitRules.length
    ? 'Clean English Intent: For "' + m.title_en.replace(/^\d+\.\d+\s*·\s*/, '') + '", your plan covers ' + hitRules.map((x) => x.pillar_en).join('; ') + '.' +
      (missRules.length ? ' Also tighten: ' + missRules.map((x) => x.pillar_en).join(' & ') + '.' : ' All 4 pillars nailed!')
    : 'Clean English Intent: Good start ("' + draft.slice(0, 120) + (draft.length > 120 ? '…' : '') + '"). Anchor it around the 4 engineering pillars below.';
  const zhConfirm = hitRules.length
    ? '中文意图确认：针对「' + m.title_zh.replace(/^\d+\.\d+\s*·\s*/, '') + '」，你已抓住 ' + hitRules.map((x) => x.pillar_zh).join('、') + '。' +
      (missRules.length ? '建议补充：' + missRules.map((x) => x.pillar_zh).join('、') + '。' : '4 个工程要点全命中！')
    : '中文意图确认：已记录你的思路，对照下面 4 条维度补全即可。';
  return { enConfirm, zhConfirm };
}

function buildCoachingPacket(m, draft, evRec) {
  const missed = evRec
    ? m.rubric.filter((_, i) => !evRec.hits[i]).map((r) => '- ' + r.pillar_en + ': ' + r.miss_en).join('\n')
    : 'Not yet evaluated in app.';
  return `Coach me on this real project task (${m.macPath}):
[Mission]: ${m.title_en}
[Situation]: ${m.scenario_en}

[My Thought]:
${draft || '(No draft yet)'}

[Rubric Check (${evRec ? evRec.score + '/' + evRec.total : 'pending'})]:
${missed || 'All 4 pillars hit!'}

Please critique any blind spots and give me crisp Principal Engineer English to direct Cursor/Claude/Codex.`;
}

// SCREEN 1: Duolingo Winding Path (#/missions)
function renderPath() {
  const todayEntry = nextDailyEntry();
  const units = [
    { num: 1, cls: '', layerIdx: 0, days: dailyPath16.slice(0, 4), name_en: 'Truth, Facts & RAG', name_zh: '数据底座与防幻觉', desc_en: 'Stop invented prices, empty page skeletons & ungrounded GEO claims', desc_zh: '解决价格编造、苏州空骨架与缺数展示' },
    { num: 2, cls: 'u2', layerIdx: 1, days: dailyPath16.slice(4, 8), name_en: 'Context, Tools & Memory', name_zh: '上下文、工具与记忆', desc_en: '5-file cold starts, prompt injection defense & resumable checkpoints', desc_zh: '冷启动瘦身、网页防注入、断点续跑与 MCP' },
    { num: 3, cls: 'u3', layerIdx: 2, days: dailyPath16.slice(8, 12), name_en: 'Workflows & Multi-Agent', name_zh: '工作流与多智能体', desc_en: 'Model tier routing, safe parallel worktrees & 6-locale scaling', desc_zh: '按判断派活、防 Worktree 踩坑、6 语种复用' },
    { num: 4, cls: 'u4', layerIdx: 3, days: dailyPath16.slice(12, 16), name_en: 'Harness, Trace & Evals', name_zh: '护栏、日志与回归门禁', desc_en: 'Signal bounds, delete locks, fallback ladders & Golden Evals', desc_zh: '信号边界、防误删红线、Trace 与 15 题回归' }
  ];

  const offsets = ['', 'off-l', '', 'off-r'];

  return units.map((u) => {
    const unitDone = u.days.filter((d) => state.completedMissions.includes(d.id)).length;
    const layer = systemSynthesisLayers[u.layerIdx];
    const allDone = unitDone === u.days.length;

    return (
      '<section class="duo-unit">' +
        '<div class="duo-banner ' + u.cls + '">' +
          '<div>' +
            '<div class="u-num">UNIT ' + u.num + ' · DAYS ' + u.days[0].day + '–' + u.days[u.days.length - 1].day + '</div>' +
            '<h2>' + e(t(u.name_en, u.name_zh)) + (isEnZh() ? ' · ' + e(u.name_zh) : '') + '</h2>' +
            '<p>' + e(t(u.desc_en, u.desc_zh)) + '</p>' +
          '</div>' +
          '<span class="u-count">' + unitDone + '/' + u.days.length + '</span>' +
        '</div>' +
        '<div class="duo-trail">' +
          u.days.map((d, idx) => {
            const m = missions.find((x) => x.id === d.id);
            const done = state.completedMissions.includes(d.id);
            const isToday = d.id === todayEntry.id && !done;
            const nodeCls = done ? 'done' : (isToday ? 'current' : '');
            const shortTitle = (m ? t(m.title_en, m.title_zh) : '').replace(/^\d+\.\d+\s*·\s*/, '');
            const subZh = m ? m.title_zh.replace(/^\d+\.\d+\s*·\s*/, '') : '';
            return (
              '<div class="duo-node-wrap ' + offsets[idx % 4] + '">' +
                (isToday ? '<div class="duo-start-bubble">' + e(t('START · DAY ' + d.day, '从这里开始 · Day ' + d.day)) + '</div>' : '') +
                '<button type="button" class="duo-node ' + nodeCls + '" data-open-session="' + d.id + '" aria-label="Day ' + d.day + '">' +
                  (done ? '✓' : (isToday ? '★' : d.day)) +
                '</button>' +
                '<div class="duo-node-label">Day ' + d.day + ' · ' + e(shortTitle) + '</div>' +
                (isEnZh() ? '<div class="duo-node-sub">' + e(subZh) + '</div>' : '') +
              '</div>'
            );
          }).join('') +
        '</div>' +
        '<div class="duo-chest ' + (allDone ? 'lit' : '') + '">' +
          '<div>' +
            '<strong>' + (allDone ? '🎁 ' + e(t('Layer ' + layer.num + ' Unlocked!', '第 ' + layer.num + ' 层系统拼图已集齐')) : '🧱 ' + e(t('Unlocks System Layer ' + layer.num, '通关解锁：系统第 ' + layer.num + ' 层'))) + '</strong>' +
            '<div class="small muted">' + e(t(layer.title_en, layer.title_zh)) + '</div>' +
          '</div>' +
          '<a class="button ghost tiny" href="#/map">' + e(t('System Tree ↗', '看系统图 ↗')) + '</a>' +
        '</div>' +
      '</section>'
    );
  }).join('');
}

// SCREEN 2: Full-Screen 4-Step Interactive Card Session (#/session/<id>)
function renderSession(missionId) {
  if (!sess.id || (missionId && sess.id !== missionId)) {
    initSession(missionId || nextDailyEntry().id);
  }
  const m = missions.find((x) => x.id === sess.id) || missions[0];
  const dInfo = dayEntryFor(m.id);
  const drill = getMissionDrill(m);
  const synLayer = systemSynthesisLayers.find((ly) => ly.missions.includes(m.id)) || systemSynthesisLayers[0];
  const draft = state.missionDrafts[m.id] || '';
  const evalRec = state.missionEvals[m.id];

  let bodyHtml = '';

  const plainTerms = drill.terms_plain || (m.vocab || []).map(([en, zh, desc]) => [en, zh, desc]);
  const peekGlossary =
    '<details class="term-peek"><summary>📖 ' + e(t('Forgot a term? Tap for plain analogies', '忘记哪个专业词？点此看大白话解释')) + '</summary>' +
      '<div class="plain-term-list" style="margin:8px 0">' +
        plainTerms.map(([en, zh, desc]) =>
          '<div class="plain-term-card"><div class="plain-term-head"><strong>' + e(en) + '</strong><span>' + e(zh) + '</span></div><p>' + e(desc) + '</p></div>'
        ).join('') +
      '</div>' +
    '</details>';

  if (sess.step === 1) {
    bodyHtml =
      '<div class="step-card">' +
        '<div class="step-tag">DAY ' + dInfo.day + ' · STEP 1/4 · ' + e(t('PLAIN-LANGUAGE TERMS FIRST', '先用大白话搞懂今天 3 个词')) + '</div>' +
        '<h1 class="step-title">' + e(t('Know These 3 Words Before We Start', '先花 30 秒看懂这三个词，后面做题零障碍')) + '</h1>' +
        '<p class="small muted" style="margin:0">' + e(t('No coding jargon—just everyday analogies for today’s task.', '不背代码定义，只记住它们在日常业务里相当于什么：')) + '</p>' +
        '<div class="plain-term-list">' +
          plainTerms.map(([en, zh, desc]) =>
            '<div class="plain-term-card">' +
              '<div class="plain-term-head"><strong>' + e(en) + '</strong><span>' + e(zh) + '</span></div>' +
              '<p>' + e(desc) + '</p>' +
            '</div>'
          ).join('') +
        '</div>' +
        '<button type="button" class="button primary full" data-session-next="2">' + e(t('Got It! Try Real Case →', '看懂了，去处理今日真实事故 →')) + '</button>' +
      '</div>';
  } else if (sess.step === 2) {
    const picked = sess.s1Picked;
    const isAnswered = picked !== null;
    const isCorrect = picked === drill.answer;
    const opts = isZh() ? drill.options_zh : drill.options_en;
    const altOpts = isZh() ? drill.options_en : drill.options_zh;

    bodyHtml =
      '<div class="step-card">' +
        '<div class="step-tag">DAY ' + dInfo.day + ' · STEP 2/4 · ' + e(t('REAL CASE INTUITION CHECK', '真实项目事故 2 选 1')) + '</div>' +
        '<h1 class="step-title">' + e(t(m.title_en, m.title_zh).replace(/^\d+\.\d+\s*·\s*/, '')) + '</h1>' +
        '<p class="step-body">' + e(t(m.scenario_en, m.scenario_zh)) + '</p>' +
        (isEnZh() ? '<p class="step-zh">' + e(m.scenario_zh) + '</p>' : '') +
        peekGlossary +
        '<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line)">' +
          '<strong style="font-size:15px;display:block">' + e(t(drill.q_en, drill.q_zh)) + '</strong>' +
          (isEnZh() ? '<div class="step-zh" style="margin-top:4px">' + e(drill.q_zh) + '</div>' : '') +
        '</div>' +
        '<div class="choice-stack">' +
          opts.map((opt, i) => {
            let cls = '';
            if (isAnswered) {
              if (i === drill.answer) cls = 'ok';
              else if (i === picked) cls = 'bad';
            }
            return (
              '<button type="button" class="choice-btn ' + cls + '" data-s1-choice="' + i + '" ' + (isAnswered ? 'disabled' : '') + '>' +
                e(opt) +
                (isEnZh() ? '<small>' + e(altOpts[i]) + '</small>' : '') +
              '</button>'
            );
          }).join('') +
        '</div>' +
        (isAnswered
          ? '<div class="feedback-drawer ' + (isCorrect ? 'ok' : 'bad') + '">' +
              '<strong>' + (isCorrect ? '✓ ' + e(t('Spot on!', '判断精准！')) : '✕ ' + e(t('Watch out!', '差点踩坑！'))) + '</strong>' +
              '<div>' + e(t(drill.why_en, drill.why_zh)) + '</div>' +
              (isEnZh() ? '<div class="step-zh" style="color:inherit;opacity:.85">' + e(drill.why_zh) + '</div>' : '') +
              '<button type="button" class="button primary full" style="margin-top:12px" data-session-next="3">' + e(t('Continue to English Builder →', '下一步：拼英文指令 + 语音跟练 →')) + '</button>' +
            '</div>'
          : '') +
      '</div>';
  } else if (sess.step === 3) {
    const placedItems = sess.wbOrder.map((idx) => drill.chunks[idx]);
    const targetSentence = drill.chunks.join(' ');
    const chunksZh = drill.chunks_zh || drill.chunks.map(() => '');
    const conf = evalRec ? buildBilingualConfirmation(m, draft, evalRec) : null;

    bodyHtml =
      '<div class="step-card">' +
        '<div class="step-tag">DAY ' + dInfo.day + ' · STEP 3/4 · ' + e(t('BILINGUAL COMMAND + VOICE', '带中文提示拼英文 + 语音拍板')) + '</div>' +
        '<h1 class="step-title">' + e(drill.zh_prompt) + '</h1>' +
        '<p class="small muted" style="margin:0">' + e(t('Every chip shows its plain Chinese meaning below. Tap them in order:', '每个英文词块下面都附了大白话中文意思，按顺序点选拼好：')) + '</p>' +
        peekGlossary +
        '<div class="word-slot" id="word-slot">' +
          (placedItems.length
            ? sess.wbOrder.map((origIdx, pos) =>
                '<button type="button" class="chip-token placed" data-wb-remove="' + pos + '">' +
                  '<span>' + e(drill.chunks[origIdx]) + '</span>' +
                  (chunksZh[origIdx] ? '<small>' + e(chunksZh[origIdx]) + '</small>' : '') +
                '</button>'
              ).join('')
            : '<span class="small muted">' + e(t('Tap phrase chips below…', '点下方词块填入这里…')) + '</span>') +
        '</div>' +
        '<div class="word-bank">' +
          sess.wbShuffled.map((item) => {
            const used = sess.wbOrder.includes(item.idx);
            return (
              '<button type="button" class="chip-token ' + (used ? 'used' : '') + '" data-wb-add="' + item.idx + '">' +
                '<span>' + e(item.text) + '</span>' +
                (chunksZh[item.idx] ? '<small>' + e(chunksZh[item.idx]) + '</small>' : '') +
              '</button>'
            );
          }).join('') +
        '</div>' +
        '<div class="h-stack">' +
          (!sess.wbChecked
            ? '<button type="button" class="button primary" data-wb-check="1">' + e(t('Check Sentence', '检查拼句')) + '</button>' +
              '<button type="button" class="button secondary tiny" data-wb-fill="1">💡 ' + e(t('Auto-Assemble', '一键拼好')) + '</button>' +
              '<button type="button" class="button ghost tiny" data-wb-clear="1">' + e(t('Clear', '清空')) + '</button>'
            : '') +
        '</div>' +
        (sess.wbChecked
          ? '<div class="feedback-drawer ' + (sess.wbCorrect ? 'ok' : 'bad') + '">' +
              '<strong>' + (sess.wbCorrect ? '✓ ' + e(t('Great English command!', '拼句正确！')) : e(t('Target phrasing:', '推荐地道英文：'))) + '</strong>' +
              '<div><code>' + e(targetSentence) + '</code></div>' +
            '</div>'
          : '') +
        '<div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--line)">' +
          '<strong style="font-size:14.5px;display:block">' + e(t('Now speak or type your own call (optional or read above aloud):', '试着用英文说一遍你的判断（可直接跟读上面这句，或说出自己的想法）：')) + '</strong>' +
          '<div class="voice-row">' +
            '<button type="button" class="voice-btn ' + (isRecordingVoice ? 'recording' : '') + '" data-voice-mission="' + m.id + '">' +
              (isRecordingVoice ? '🔴 ' + e(t('Listening (EN)... Tap to Stop', '正在听写… 点击停止')) : '🎙 ' + e(t('Speak in English', '点击说英文'))) +
            '</button>' +
            '<span class="small muted">' + e(t('Or tap chips / iPhone mic', '或点下方快捷短语 / 手机语音')) + '</span>' +
          '</div>' +
          '<div class="starter-chips">' +
            m.prompts_en.map((sp) =>
              '<button type="button" class="starter-chip" data-starter-text="' + e(sp) + '">+ ' + e(sp) + '</button>'
            ).join('') +
          '</div>' +
          '<textarea id="mission-draft" class="coach-textarea" data-mission-draft="' + m.id + '" placeholder="' + e(t('Speak or type English here...', '在这里用英文语音输入或打字...')) + '">' + e(draft) + '</textarea>' +
          '<div class="h-stack" style="margin-top:10px">' +
            '<button type="button" class="button primary" data-eval-mission="' + m.id + '">⚡ ' + e(t('Check & Confirm (EN + 中文)', '评估并看中英确认')) + '</button>' +
            '<button type="button" class="button secondary tiny" data-session-next="4">' + e(t('Skip to System Summary →', '直接进入体系总结 →')) + '</button>' +
          '</div>' +
          (evalRec && conf
            ? '<div style="margin-top:12px">' +
                '<div class="confirm-card">' +
                  '<div><strong>English Confirmation:</strong> ' + e(conf.enConfirm) + '</div>' +
                  '<div style="margin-top:5px;color:#47584e"><strong>中文确认：</strong>' + e(conf.zhConfirm) + '</div>' +
                '</div>' +
                '<div class="pillar-list">' +
                  m.rubric.map((rule, idx) => {
                    const hit = Boolean(evalRec.hits[idx]);
                    return (
                      '<div class="pillar-row ' + (hit ? 'hit' : 'miss') + '">' +
                        '<strong>' + (hit ? '✓ ' : '⚠️ ') + e(rule.pillar_en) + ' · ' + e(rule.pillar_zh) + '</strong>' +
                        '<div>' + e(hit ? rule.hit_en : rule.miss_en) + '</div>' +
                        '<div class="small" style="opacity:.85;margin-top:3px">' + e(hit ? rule.hit_zh : rule.miss_zh) + '</div>' +
                      '</div>'
                    );
                  }).join('') +
                '</div>' +
                '<div class="h-stack">' +
                  '<button type="button" class="button primary full" data-session-next="4">' + e(t('Continue to System Blueprint →', '下一步：把本关装进系统大图 →')) + '</button>' +
                  '<button type="button" class="button secondary tiny" data-copy-mission-packet="' + m.id + '">📋 ' + e(t('Copy Coaching Packet', '复制发给 AI 对练')) + '</button>' +
                '</div>' +
              '</div>'
            : '') +
        '</div>' +
      '</div>';
  } else {
    const refLesson = lessons.find((x) => x.week === m.weekRef) || lessons[0];
    bodyHtml =
      '<div class="victory-card">' +
        '<div class="victory-badge">✓</div>' +
        '<h1 class="step-title">Day ' + dInfo.day + ' ' + e(t('Complete & Synthesized!', '通关！看看它落在系统哪一层')) + '</h1>' +
        '<div class="mini-system-grid">' +
          systemSynthesisLayers.map((ly) => {
            const lit = ly.id === synLayer.id;
            return (
              '<div class="mini-layer-box ' + (lit ? 'lit' : '') + '">' +
                (lit ? '★ ' : '') + 'Layer ' + ly.num + ' · ' + e(t(ly.title_en, ly.title_zh).replace(/^第.*层\s*·\s*/, '')) +
              '</div>'
            );
          }).join('') +
        '</div>' +
        '<div class="causal-chain">' +
          '<div><strong>1. ' + e(t('Upstream', '上游来源')) + '：</strong>' + e((drill.sys_up_zh || '').replace(/^上游：/, '')) + '</div>' +
          '<div><strong>2. ' + e(t('Today’s Gate', '今日守门')) + '：</strong>' + e((drill.sys_role_zh || '').replace(/^本关卡口：/, '')) + '</div>' +
          '<div><strong>3. ' + e(t('Downstream Impact', '下游结果')) + '：</strong>' + e((drill.sys_down_zh || '').replace(/^下游：/, '')) + '</div>' +
        '</div>' +
        '<div class="synthesis-card">' +
          '<strong style="display:block;color:#23465d;margin-bottom:4px">🧱 ' + e(t('Universal Rule Unlocked:', '沉淀为跨项目通用铁律：')) + '</strong>' +
          '<div>' + e(t(synLayer.law_en, synLayer.law_zh)) + '</div>' +
          (isEnZh() ? '<div class="step-zh">' + e(synLayer.law_zh) + '</div>' : '') +
        '</div>' +
        '<details class="deepdive-details" open>' +
          '<summary>📚 ' + e(t('Systematic Concept Sheet: Week ' + refLesson.week + ' — ' + refLesson.title_en, '体系化精读讲义：第 ' + refLesson.week + ' 周 — ' + refLesson.title)) + '</summary>' +
          refLesson.sections.slice(0, 3).map((secItem) =>
            '<div class="deepdive-sec">' +
              '<strong>' + e(t(secItem.title_en, secItem.title)) + '</strong>' +
              '<p style="margin:4px 0 0">' + e(t(secItem.body_en, secItem.body)) + '</p>' +
              (isEnZh() ? '<div class="step-zh">' + e(secItem.body) + '</div>' : '') +
            '</div>'
          ).join('') +
        '</details>' +
        '<button type="button" class="button primary full" data-finish-session="' + m.id + '">✓ ' + e(t('Finish & Unlock Next Day →', '完成打卡并解锁下一天 →')) + '</button>' +
      '</div>';
  }

  return (
    '<div class="session-top">' +
      '<button type="button" class="session-close" data-exit-session="1" aria-label="Back to Path">✕</button>' +
      '<div class="seg-bar">' +
        [1, 2, 3, 4].map((s) => '<div class="seg-item ' + (s <= sess.step ? 'filled' : '') + '"></div>').join('') +
      '</div>' +
      '<span class="session-step-lbl">' + sess.step + ' / 4</span>' +
    '</div>' +
    bodyHtml
  );
}

// SCREEN 3: Living 4-Layer System Architecture Tree (#/map)
function renderMap() {
  const synthDone = state.completedMissions.length;
  const synthPct = percentage(synthDone, missions.length);

  return (
    '<div class="page-head">' +
      '<h1>' + e(t('Your 4-Layer System Tree', '4 层系统拼图（散点归宗）')) + '</h1>' +
      '<p>' + e(t('Every daily node you complete snaps into one of these 4 universal layers and unlocks reusable commands.', '每在闯关里通关 1 天，对应的系统层级节点就会自动点亮，沉淀为跨项目通用铁律。')) + '</p>' +
    '</div>' +
    '<div class="card">' +
      '<div class="between"><strong>' + e(t('System Synthesis', '体系点亮进度')) + '</strong><span class="pill">' + synthDone + ' / ' + missions.length + ' (' + synthPct + '%)</span></div>' +
      '<div style="margin-top:10px">' + bar(synthPct) + '</div>' +
    '</div>' +
    systemSynthesisLayers.map((layer) => {
      const layerMissions = layer.missions.map((id) => missions.find((x) => x.id === id)).filter(Boolean);
      const layerDone = layerMissions.filter((m) => state.completedMissions.includes(m.id)).length;
      const unlockedCmds = layerMissions
        .filter((m) => state.completedMissions.includes(m.id) || state.missionEvals[m.id])
        .map((m) => m.english_polish[0]);

      return (
        '<div class="map-layer">' +
          '<div class="between">' +
            '<div class="map-head" style="margin-bottom:4px">' +
              '<div class="map-index">' + e(layer.num) + '</div>' +
              '<div><h3>' + e(t(layer.title_en, layer.title_zh)) + '</h3><p>' + e(t(layer.sub_en, layer.sub_zh)) + '</p></div>' +
            '</div>' +
            '<span class="pill ' + (layerDone === layerMissions.length ? '' : 'gold') + '">' + layerDone + '/' + layerMissions.length + '</span>' +
          '</div>' +
          '<div class="layer-law">' +
            '<strong>' + e(t(layer.law_en, layer.law_zh)) + '</strong>' +
            (isEnZh() ? '<div class="step-zh" style="margin-top:4px">' + e(layer.law_zh) + '</div>' : '') +
          '</div>' +
          '<div class="layer-missions">' +
            layerMissions.map((m) => {
              const done = state.completedMissions.includes(m.id);
              const dInfo = dayEntryFor(m.id);
              return (
                '<button type="button" class="layer-chip ' + (done ? 'done' : '') + '" data-open-session="' + m.id + '">' +
                  '<span>' + (done ? '✓' : '○') + '</span>' +
                  '<span>Day ' + dInfo.day + ' · ' + e(t(m.title_en, m.title_zh).replace(/^\d+\.\d+\s*·\s*/, '')) + '</span>' +
                '</button>'
              );
            }).join('') +
          '</div>' +
          (unlockedCmds.length
            ? '<div class="unlocked-box"><strong>' + e(t('Unlocked Commands:', '已解锁指挥金句：')) + '</strong> ' + unlockedCmds.map((c) => e(c)).join(' · ') + '</div>'
            : '') +
        '</div>'
      );
    }).join('')
  );
}

// SCREEN 4: Toolkit (Segmented Sub-tabs for Flashcards, Project Studio, Playbooks, Reference Library, Notes)
function toolkitSubnav(active) {
  const tabs = [
    ['cards', t('Terms (34)', '术语卡 (34)')],
    ['studio', t('Project Studio', '项目工坊')],
    ['playbooks', t('Playbooks', '实战速查')],
    ['curriculum', t('10-Week Ref', '10周参考')],
    ['notes', t('Notes & Mistakes', '笔记与错题')]
  ];
  return (
    '<div class="subnav-pills">' +
      tabs.map(([id, lbl]) =>
        '<button type="button" class="subnav-pill ' + (active === id ? 'active' : '') + '" data-toolkit-tab="' + id + '">' + e(lbl) + '</button>'
      ).join('') +
    '</div>'
  );
}

function renderCards() {
  cardIndex = Math.min(cardIndex, terms.length - 1);
  const tItem = terms[cardIndex];
  const learned = state.learned.includes(tItem[0]);
  const [enTerm, zhName, zhExp, zhAnalogy, enDef, enEx] = tItem;

  return (
    '<div class="cards-layout">' +
      '<div role="button" tabindex="0" class="flashcard" data-flip="true">' +
        '<span class="pill" style="background:rgba(255,255,255,.15);color:#fff">CARD ' + (cardIndex + 1) + ' / ' + terms.length + '</span>' +
        (cardBack
          ? '<div class="fc-explain"><strong>' + e(enTerm) + ' · ' + e(zhName) + '</strong><br/>' + e(t(enDef, zhExp)) + '</div>' +
            (enEx ? '<div class="fc-example">' + e(enEx) + '</div>' : '') +
            '<div class="small" style="margin-top:10px;opacity:.85">' + e(zhExp) + ' · ' + e(zhAnalogy) + '</div>'
          : '<h2>' + e(enTerm) + '</h2><h3>' + e(isZh() ? zhName : zhName + ' · ' + t('Tap to flip', '点击翻面')) + '</h3>') +
        '<span class="flip-hint">' + e(t('Tap card to flip', '点击翻面')) + '</span>' +
      '</div>' +
      '<div class="h-stack" style="justify-content:center">' +
        '<button class="button secondary tiny" data-card="prev">← ' + e(t('Prev', '上一张')) + '</button>' +
        '<button class="button ' + (learned ? 'secondary' : 'primary') + ' tiny" data-learned="' + e(enTerm) + '">' + (learned ? '✓ ' + e(t('Mastered', '已掌握')) : e(t('Mark Mastered', '标记掌握'))) + '</button>' +
        '<button class="button secondary tiny" data-card="next">' + e(t('Next', '下一张')) + ' →</button>' +
      '</div>' +
      '<div class="card">' +
        '<div class="between" style="margin-bottom:8px"><strong>' + e(t('All 34 Terms', '全部 34 个术语')) + '</strong><span class="pill">' + state.learned.length + '/' + terms.length + '</span></div>' +
        '<div class="term-list">' +
          terms.map((term, i) =>
            '<button class="term-line ' + (i === cardIndex ? 'active' : '') + '" data-card-index="' + i + '">' +
              '<span>' + e(term[0]) + '</span>' +
              (state.learned.includes(term[0]) ? '<span>✓</span>' : '') +
            '</button>'
          ).join('') +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function buildStudioPrescription() {
  const f = state.studioFlags;
  const name = state.studioName || 'My AI Project';
  const goal = state.studioGoal || 'Deliver reliable grounded output.';
  const pattern = f.fixedFlow
    ? t('80% Deterministic Workflow + 20% Bounded LLM + Critic Gate', '80% 确定性流 + 20% 受控模型 + Critic 质检')
    : t('Bounded Single Agent Loop (max_steps = 5) + Critic Gate', '受控单 Agent 循环（max_steps <= 5）+ Critic 质检');
  const warnings = [];
  if (f.fixedFlow) warnings.push(t('Do NOT use multi-agent chat loops for fixed pipelines.', '固定主干禁止拆成群聊式 Multi-Agent。'));
  if (f.highFactRisk) warnings.push(t('Require official_url + last_verified_at; refuse missing facts.', '每条事实带来源与核实日期，缺失即拒答。'));
  if (f.writeActions) warnings.push(t('Enforce idempotency key (slug/request_id) + draft mode.', '写操作加幂等键并默认仅推草稿箱。'));
  if (f.multilingual) warnings.push(t('Generate all locales directly from one evidence_pack.json.', '所有语种并行读取同一份 evidence_pack。'));
  if (f.untrustedWeb) warnings.push(t('Isolate scraped web text inside <untrusted_source> tags.', '抓取的网页正文用 <untrusted_source> 隔离。'));
  if (f.aiCoding) warnings.push(t('Lock schemas in AGENTS.md and re-run Golden Evals on every edit.', '用 AGENTS.md 锁死结构，每次改完必跑金标准回归。'));

  const agentsMd = `# AGENTS.md — ${name}\n## Goal\n${goal}\n\n## Core Guardrails\n- Pattern: ${f.fixedFlow ? '80% Deterministic Workflow + 20% Bounded LLM' : 'Bounded Agent Loop (max_steps=5)'}\n- Context: Pass ONLY task_state.json + relevant verified chunks.\n${f.highFactRisk ? '- Grounding: Every claim needs official_url + last_verified_at.' : ''}\n${f.writeActions ? '- Writes: Require idempotency key + status=draft + human sign-off.' : ''}`;
  const schemasJson = JSON.stringify({
    task_state: { project: name, stage: 'drafting', max_steps: f.fixedFlow ? 1 : 5 },
    evidence_pack: [{ claim_id: 'c1', verified_fact: '...', official_url: 'https://...', last_verified_at: '2026-11-18' }],
    critic_verdict: { pass: false, unverified_claims: [], rewrite_target: 'section_2' }
  }, null, 2);
  const kickoffPrompt = `Act as my AI Systems Engineer for "${name}".\nGoal: ${goal}\nConstraints:\n- Pattern: ${pattern}\n- Propose MVP vertical slice + 10 Golden Eval edge cases before writing code.`;

  return { pattern, warnings, agentsMd, schemasJson, kickoffPrompt };
}

function renderStudio() {
  const rx = buildStudioPrescription();
  const allChecks = [...defaultEvalChecks.map((x) => ({ id: x.id, text: t(x.en, x.zh) })), ...state.customEvals];
  const passedCount = allChecks.filter((c) => state.evalChecks.includes(c.id)).length;
  const activeArtifact = studioTab === 'schemas' ? rx.schemasJson : (studioTab === 'prompt' ? rx.kickoffPrompt : rx.agentsMd);

  return (
    '<div class="studio-grid">' +
      '<div class="h-stack">' +
        Object.values(studioPresets).map((p) =>
          '<button type="button" class="subnav-pill ' + (state.studioPreset === p.id ? 'active' : '') + '" data-studio-preset="' + p.id + '">' + e(t(p.name_en, p.name_zh)) + '</button>'
        ).join('') +
      '</div>' +
      '<div class="card">' +
        '<label class="small muted">' + e(t('Project Name', '项目名称')) + '<input class="studio-input" id="studio-name" value="' + e(state.studioName) + '"/></label>' +
        '<label class="small muted" style="display:block;margin-top:8px">' + e(t('Core Goal', '核心目标')) + '<input class="studio-input" id="studio-goal" value="' + e(state.studioGoal) + '"/></label>' +
        '<div class="toggle-list">' +
          studioToggleMeta.map((m) => {
            const on = Boolean(state.studioFlags[m.key]);
            return (
              '<button type="button" class="toggle-chip ' + (on ? 'on' : '') + '" data-studio-flag="' + m.key + '">' +
                '<span class="toggle-dot">' + (on ? '✓' : '') + '</span>' +
                '<span>' + e(t(m.label_en, m.label_zh)) + '</span>' +
              '</button>'
            );
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="card">' +
        '<strong>⚡ ' + e(rx.pattern) + '</strong>' +
        '<p class="small muted" style="margin:6px 0 12px">' + rx.warnings.map((w) => '• ' + e(w)).join('<br/>') + '</p>' +
        '<div class="between">' +
          '<div class="h-stack">' +
            '<button type="button" class="button ' + (studioTab === 'agents' ? 'primary' : 'secondary') + ' tiny" data-studio-tab="agents">AGENTS.md</button>' +
            '<button type="button" class="button ' + (studioTab === 'schemas' ? 'primary' : 'secondary') + ' tiny" data-studio-tab="schemas">Schemas</button>' +
            '<button type="button" class="button ' + (studioTab === 'prompt' ? 'primary' : 'secondary') + ' tiny" data-studio-tab="prompt">Prompt</button>' +
          '</div>' +
          '<button type="button" class="button secondary tiny" data-copy-text="' + e(activeArtifact) + '">' + e(t('Copy', '复制')) + '</button>' +
        '</div>' +
        '<pre class="snippet-box">' + e(activeArtifact) + '</pre>' +
      '</div>' +
      '<div class="card">' +
        '<div class="between"><strong>' + e(t('Golden Eval Checklist', '项目上线前验收打卡表')) + '</strong><span class="pill">' + passedCount + '/' + allChecks.length + '</span></div>' +
        '<div class="eval-list">' +
          allChecks.map((item) => {
            const checked = state.evalChecks.includes(item.id);
            return '<div class="eval-item ' + (checked ? 'checked' : '') + '" role="button" tabindex="0" data-eval-check="' + e(item.id) + '"><span class="toggle-dot">' + (checked ? '✓' : '') + '</span><span>' + e(item.text) + '</span></div>';
          }).join('') +
        '</div>' +
        '<div class="eval-add-row">' +
          '<input id="custom-eval-input" placeholder="' + e(t('Add custom check...', '添加专属验收项...')) + '"/>' +
          '<button type="button" class="button primary tiny" id="add-custom-eval">+ ' + e(t('Add', '添加')) + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="trap-grid">' +
        trends2026.map((tr) =>
          '<div class="trap-card">' +
            '<div class="trap-bad"><strong>' + e(tr.tag) + ' · ' + e(t('OLD', '旧做法')) + '</strong><br/>' + e(t(tr.old_en, tr.old_zh)) + '</div>' +
            '<div class="trap-good"><strong>' + e(t('2026 STANDARD', '2026 标准')) + '</strong><br/>' + e(t(tr.now_en, tr.now_zh)) + '</div>' +
          '</div>'
        ).join('') +
      '</div>' +
    '</div>'
  );
}

function renderPlaybooks(arg) {
  if (arg && playbooks.some((p) => p.id === arg)) activePlaybook = arg;
  const pb = playbooks.find((p) => p.id === activePlaybook) || playbooks[0];

  return (
    '<div>' +
      '<div class="h-stack" style="margin-bottom:12px">' +
        playbooks.map((p) =>
          '<button type="button" class="subnav-pill ' + (p.id === pb.id ? 'active' : '') + '" data-playbook="' + p.id + '">' +
            e(p.id === 'youchina-agent' ? t('YouChina Agent Fix', 'YouChina 破局') : t('SEO / GEO Pipeline', 'SEO/GEO 自动化')) +
          '</button>'
        ).join('') +
      '</div>' +
      '<div class="card">' +
        '<h2 style="margin:0 0 8px;font-size:18px">' + e(t(pb.title_en, pb.title_zh)) + '</h2>' +
        '<p class="small muted" style="margin:0 0 12px">' + e(t(pb.subtitle_en, pb.subtitle_zh)) + '</p>' +
        '<div class="symptom-list">' +
          pb.symptoms.map((sym) => {
            const isOpen = openSymptoms.has(sym.id);
            return (
              '<div class="symptom-card">' +
                '<button type="button" class="symptom-btn" data-symptom="' + sym.id + '"><span>' + (isOpen ? '▾ ' : '▸ ') + e(t(sym.label_en, sym.label_zh)) + '</span></button>' +
                (isOpen ? '<div class="symptom-body"><strong>' + e(t(sym.root_en, sym.root_zh)) + '</strong><br/>' + e(t(sym.fix_en, sym.fix_zh)) + '</div>' : '') +
              '</div>'
            );
          }).join('') +
        '</div>' +
        (pb.extra
          ? '<div class="pb-table-wrap"><table class="pb-table"><thead><tr>' +
              pb.extra.columns.map((c) => '<th>' + e(c) + '</th>').join('') +
            '</tr></thead><tbody>' +
              pb.extra.rows.map((r) => '<tr>' + r.map((cell) => '<td>' + e(cell) + '</td>').join('') + '</tr>').join('') +
            '</tbody></table></div>'
          : '') +
        '<div class="h-stack" style="margin-top:12px">' +
          '<button type="button" class="button primary tiny" data-copy-text="' + e(isZh() ? pb.prompt_zh : pb.prompt_en) + '">' + e(t('Copy Playbook Prompt', '一键复制实战指令')) + '</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function renderCurriculum() {
  return (
    '<div>' +
      '<div class="inline-notice">' + e(t('Optional Reference Library: Week 1–2 basics are already skipped by default. Open any week below to review fundamentals.', '备查参考库：W01–W02 基础默认已跳过，需要补某个底层概念时点开对应周次即可。')) + '</div>' +
      '<div class="week-grid">' +
        weeks.map((w) => {
          const ls = lessons.filter((x) => x.week === w.n);
          const count = ls.filter((l) => state.completed.includes(l.id)).length;
          return (
            '<button class="week-card" data-route="week/' + w.n + '">' +
              '<div class="between"><span class="small muted">WEEK ' + String(w.n).padStart(2, '0') + '</span><span class="pill">' + count + '/' + ls.length + '</span></div>' +
              '<h3>' + e(t(w.title_en, w.title)) + '</h3>' +
              '<p>' + e(t(w.desc_en, w.desc)) + '</p>' +
              bar(percentage(count, ls.length)) +
            '</button>'
          );
        }).join('') +
      '</div>' +
      '<div class="card" style="margin-top:14px">' +
        '<strong>' + e(t('Official References', '官方一手参考资料')) + '</strong>' +
        '<div class="resource-list" style="margin-top:10px">' +
          sources.map((s, i) =>
            '<div class="resource-item"><div class="resource-icon">' + (i + 1) + '</div><div class="info"><h3>' + e(s.title) + '</h3><p>' + e(s.org) + ' · ' + e(t(s.note_en, s.note)) + '</p></div><a href="' + e(s.url) + '" target="_blank" rel="noopener noreferrer">↗</a></div>'
          ).join('') +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function renderWeek(n) {
  const w = weeks.find((x) => x.n === n);
  if (!w) return renderCurriculum();
  const ls = lessons.filter((x) => x.week === n);
  return (
    '<div>' +
      '<div style="margin-bottom:12px"><a class="small muted" href="#/curriculum">← ' + e(t('Back to 10-Week Library', '返回 10 周参考库')) + '</a></div>' +
      '<div class="page-head"><h1>W' + String(n).padStart(2, '0') + ' · ' + e(t(w.title_en, w.title)) + '</h1><p>' + e(t(w.desc_en, w.desc)) + '</p></div>' +
      '<div class="resource-list">' +
        ls.map((l) =>
          '<div class="resource-item"><div class="resource-icon">' + l.day + '</div><div class="info"><h3>' + e(t(l.title_en, l.title)) + '</h3><p>' + e(t(l.summary_en, l.summary)) + '</p></div><a href="#/lesson/' + l.id + '">' + e(t('Open', '查看')) + ' ↗</a></div>'
        ).join('') +
      '</div>' +
    '</div>'
  );
}

function renderLesson(l) {
  const done = state.completed.includes(l.id);
  const doneQuiz = state.quiz[l.id];
  const drafts = state.drafts[l.id] || {};
  return (
    '<div>' +
      '<div class="between" style="margin-bottom:12px"><a class="small muted" href="#/week/' + l.week + '">← Week ' + l.week + '</a><a class="button primary tiny" href="#/missions">🧭 ' + e(t('Back to Path', '回闯关路径')) + '</a></div>' +
      '<div class="card">' +
        '<h1 style="margin:0 0 8px;font-size:22px">' + e(t(l.title_en, l.title)) + '</h1>' +
        '<p class="small muted">' + e(t(l.summary_en, l.summary)) + '</p>' +
        l.sections.map((s, i) =>
          '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line)">' +
            '<h3 style="margin:0 0 6px;font-size:15px">' + e(t(s.title_en, s.title)) + '</h3>' +
            '<p style="margin:0;font-size:13.5px;line-height:1.7">' + e(t(s.body_en, s.body)) + '</p>' +
            (isEnZh() ? '<div class="step-zh">' + e(s.body) + '</div>' : '') +
          '</div>'
        ).join('') +
      '</div>' +
      '<div class="card">' +
        '<h3 style="margin:0 0 10px;font-size:15px">' + e(t('Quick Self-Check', '课后快测')) + '</h3>' +
        l.quiz.map((q, i) => {
          const opts = isZh() ? q.options : (q.options_en || q.options);
          return (
            '<div style="margin-bottom:14px">' +
              '<div style="font-weight:700;font-size:13.5px;margin-bottom:8px">' + (i + 1) + '. ' + e(t(q.q_en, q.q)) + '</div>' +
              opts.map((opt, j) =>
                '<label style="display:flex;gap:8px;padding:7px 9px;border:1px solid var(--line);border-radius:9px;margin-bottom:5px;font-size:13px">' +
                  '<input type="radio" name="quiz-' + e(l.id) + '-' + i + '" value="' + j + '" data-quiz="' + e(l.id) + '" data-q="' + i + '" ' + (Number(drafts[i]) === j && drafts[i] !== undefined ? 'checked' : '') + ' ' + (doneQuiz ? 'disabled' : '') + '/>' +
                  '<span>' + e(opt) + '</span>' +
                '</label>'
              ).join('') +
              (doneQuiz ? '<div class="small" style="margin-top:5px;color:' + (Number(doneQuiz.answers[i]) === q.answer ? 'var(--green)' : 'var(--red)') + '">' + e(t(q.why_en, q.why)) + '</div>' : '') +
            '</div>'
          );
        }).join('') +
        (doneQuiz
          ? '<div class="between"><span class="pill">' + doneQuiz.score + '/' + doneQuiz.total + '</span><button class="button secondary tiny" data-retake="' + l.id + '">' + e(t('Retake', '重练')) + '</button></div>'
          : '<button class="button primary tiny" data-grade="' + l.id + '">' + e(t('Submit Quiz', '提交答案')) + '</button>') +
      '</div>' +
      '<div class="card">' +
        '<textarea id="lesson-notes" class="notes-area" data-note="' + l.id + '" placeholder="' + e(t('Notes...', '写笔记...')) + '">' + e(state.notes[l.id] || '') + '</textarea>' +
        '<div class="h-stack" style="margin-top:10px"><button class="button ' + (done ? 'secondary' : 'primary') + ' tiny" data-complete="' + l.id + '">' + (done ? '✓ ' + e(t('Completed', '已完成')) : e(t('Mark Complete', '标记完成'))) + '</button></div>' +
      '</div>' +
    '</div>'
  );
}

function getMistakes() {
  const items = [];
  for (const l of lessons) {
    const rec = state.quiz[l.id];
    if (!rec || !rec.answers) continue;
    l.quiz.forEach((q, idx) => {
      const picked = Number(rec.answers[idx]);
      if (Number.isFinite(picked) && picked !== q.answer) items.push({ lesson: l, qIndex: idx, q, picked });
    });
  }
  return items;
}

function renderNotes() {
  const entries = lessons.filter((l) => (state.notes[l.id] || '').trim());
  const mistakes = getMistakes();
  return (
    '<div>' +
      '<div class="h-stack" style="margin-bottom:12px">' +
        '<button type="button" class="subnav-pill ' + (notesTab === 'notes' ? 'active' : '') + '" data-notes-tab="notes">' + e(t('Notes', '笔记')) + ' (' + entries.length + ')</button>' +
        '<button type="button" class="subnav-pill ' + (notesTab === 'mistakes' ? 'active' : '') + '" data-notes-tab="mistakes">' + e(t('Mistakes', '错题本')) + ' (' + mistakes.length + ')</button>' +
      '</div>' +
      (notesTab === 'mistakes'
        ? (mistakes.length
            ? mistakes.map((m) => '<div class="mistake-card"><div class="between"><span class="pill red">W' + m.lesson.week + '</span><a class="small" href="#/lesson/' + m.lesson.id + '">' + e(t('Retry ↗', '重练 ↗')) + '</a></div><h4 style="margin:8px 0 4px">' + e(t(m.q.q_en, m.q.q)) + '</h4><p class="small muted" style="margin:0">' + e(t(m.q.why_en, m.q.why)) + '</p></div>').join('')
            : '<div class="empty-state">' + e(t('Zero mistakes yet.', '目前没有错题')) + '</div>')
        : (entries.length
            ? entries.map((l) => '<div class="note-card"><div class="between"><strong>' + e(t(l.title_en, l.title)) + '</strong><a class="small" href="#/lesson/' + l.id + '">' + e(t('Edit ↗', '编辑 ↗')) + '</a></div><p class="small muted" style="margin:6px 0 0">' + e(state.notes[l.id]) + '</p></div>').join('')
            : '<div class="empty-state">' + e(t('No lesson notes yet.', '还没有笔记')) + '</div>')) +
    '</div>'
  );
}

function renderToolkit(sub, overrideInner) {
  if (['cards', 'studio', 'playbooks', 'curriculum', 'notes'].includes(sub)) toolkitSub = sub;
  let inner = overrideInner || '';
  if (!inner) {
    if (toolkitSub === 'studio') inner = renderStudio();
    else if (toolkitSub === 'playbooks') inner = renderPlaybooks();
    else if (toolkitSub === 'curriculum') inner = renderCurriculum();
    else if (toolkitSub === 'notes') inner = renderNotes();
    else inner = renderCards();
  }

  return (
    '<div class="page-head"><h1>' + e(t('Builder Toolkit', '实战工具箱与词卡')) + '</h1></div>' +
    toolkitSubnav(toolkitSub) +
    inner
  );
}

function updateChromeTexts() {
  const badge = $('#streak-badge');
  if (badge) badge.textContent = '🔥 ' + state.completedMissions.length + '/16';

  const navLabels = {
    missions: t('Path', '闯关'),
    map: t('System', '体系'),
    toolkit: t('Toolkit', '工具')
  };
  document.querySelectorAll('#bottom-tabs [data-nav]').forEach((a) => {
    const sm = a.querySelector('small');
    if (sm && navLabels[a.dataset.nav]) sm.textContent = navLabels[a.dataset.nav];
  });
  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === state.langMode);
  });

  const mh = $('#modal-header-content');
  if (mh) {
    mh.innerHTML = '<h2>' + e(t('Backup & Restore', '备份与恢复进度')) + '</h2><p>' + e(t('Export JSON to sync between Mac and iPhone.', '导出 JSON 即可在 Mac 与 iPhone 之间同步进度。')) + '</p>';
  }
}

function render() {
  const route = currentRoute();
  let html = '';
  let activeBottom = 'missions';
  let isSession = false;
  let isWide = false;

  if (route.view === 'session') {
    isSession = true;
    html = renderSession(route.arg);
  } else if (route.view === 'map') {
    activeBottom = 'map';
    isWide = true;
    html = renderMap();
  } else if (route.view === 'toolkit' || ['cards', 'studio', 'playbooks', 'curriculum', 'notes'].includes(route.view)) {
    activeBottom = 'toolkit';
    isWide = true;
    html = renderToolkit(route.view === 'toolkit' ? (route.arg || toolkitSub) : route.view);
  } else if (route.view === 'week') {
    activeBottom = 'toolkit';
    isWide = true;
    html = renderToolkit('curriculum', renderWeek(Number(route.arg)));
  } else if (route.view === 'lesson' && byId[route.arg]) {
    activeBottom = 'toolkit';
    isWide = true;
    html = renderToolkit('curriculum', renderLesson(byId[route.arg]));
  } else {
    activeBottom = 'missions';
    html = renderPath();
  }

  document.body.classList.toggle('in-session', isSession);
  document.body.classList.toggle('wide-view', isWide);

  updateChromeTexts();
  $('#app').innerHTML = html;

  document.querySelectorAll('#bottom-tabs [data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === activeBottom);
  });
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => notice(t('Copied!', '已复制'))).catch(() => legacyCopy(text));
  } else legacyCopy(text);
}

function legacyCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); notice(t('Copied!', '已复制')); } catch {}
  ta.remove();
}

function toggleArr(arr, id) {
  const idx = arr.indexOf(id);
  if (idx < 0) arr.push(id);
  else arr.splice(idx, 1);
}

function toggleVoiceInput(mid) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    $('#mission-draft')?.focus();
    notice(t('Tap your iPhone keyboard 🎙 mic to dictate English!', '请点手机输入法 🎙 麦克风直接语音转英文'));
    return;
  }
  if (isRecordingVoice && activeVoiceRec) {
    isRecordingVoice = false;
    try { activeVoiceRec.stop(); } catch {}
    render();
    return;
  }
  const rec = new SR();
  rec.lang = 'en-US';
  rec.continuous = true;
  rec.interimResults = false;
  activeVoiceRec = rec;
  isRecordingVoice = true;
  render();

  rec.onresult = (event) => {
    let spoken = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) spoken += event.results[i][0].transcript + ' ';
    }
    const clean = spoken.trim();
    if (!clean) return;
    const prev = (state.missionDrafts[mid] || '').trim();
    const next = prev ? prev + ' ' + clean : clean;
    state.missionDrafts[mid] = next;
    save();
    const ta = $('#mission-draft');
    if (ta) ta.value = next;
  };
  rec.onerror = () => {
    isRecordingVoice = false;
    activeVoiceRec = null;
    render();
    notice(t('Use iPhone keyboard 🎙 mic or type below.', '请用手机键盘 🎙 听写或直接输入'));
  };
  rec.onend = () => { isRecordingVoice = false; activeVoiceRec = null; render(); };
  try { rec.start(); } catch { isRecordingVoice = false; activeVoiceRec = null; render(); }
}

document.addEventListener('click', (ev) => {
  const b = ev.target.closest('button,[data-flip],[data-eval-check]');
  if (!b) return;

  if (b.dataset.lang) { state.langMode = b.dataset.lang; save(); render(); return; }
  if (b.dataset.openSession) {
    initSession(b.dataset.openSession);
    navigate('session/' + b.dataset.openSession);
    render();
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  if (b.dataset.exitSession) { navigate('missions'); render(); return; }
  if (b.dataset.s1Choice !== undefined) {
    sess.s1Picked = Number(b.dataset.s1Choice);
    render();
    return;
  }
  if (b.dataset.sessionNext) {
    sess.step = Number(b.dataset.sessionNext);
    render();
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  if (b.dataset.wbAdd !== undefined) {
    const idx = Number(b.dataset.wbAdd);
    if (!sess.wbOrder.includes(idx)) sess.wbOrder.push(idx);
    render();
    return;
  }
  if (b.dataset.wbRemove !== undefined) {
    sess.wbOrder.splice(Number(b.dataset.wbRemove), 1);
    render();
    return;
  }
  if (b.dataset.wbFill) {
    const m = missions.find((x) => x.id === sess.id);
    const drill = getMissionDrill(m);
    sess.wbOrder = drill.chunks.map((_, i) => i);
    render();
    return;
  }
  if (b.dataset.wbClear) {
    sess.wbOrder = [];
    sess.wbChecked = false;
    render();
    return;
  }
  if (b.dataset.wbCheck) {
    const m = missions.find((x) => x.id === sess.id);
    const drill = getMissionDrill(m);
    const built = sess.wbOrder.map((i) => drill.chunks[i]).join(' ');
    sess.wbChecked = true;
    sess.wbCorrect = built === drill.chunks.join(' ');
    render();
    return;
  }
  if (b.dataset.voiceMission) { toggleVoiceInput(b.dataset.voiceMission); return; }
  if (b.dataset.starterText) {
    const ta = $('#mission-draft');
    const mid = ta?.dataset.missionDraft || sess.id;
    const prev = (state.missionDrafts[mid] || '').trim();
    const next = prev ? prev + ' ' + b.dataset.starterText : b.dataset.starterText;
    state.missionDrafts[mid] = next;
    save();
    if (ta) { ta.value = next; ta.focus(); }
    return;
  }
  if (b.dataset.evalMission) {
    const mid = b.dataset.evalMission;
    const mObj = missions.find((x) => x.id === mid);
    const draftTxt = (state.missionDrafts[mid] || '').trim();
    if (!draftTxt) { notice(t('Speak or tap a starter chip first!', '请先说英文或点快捷短语')); return; }
    if (mObj) {
      state.missionEvals[mid] = evaluateMission(mObj, draftTxt);
      save();
      render();
    }
    return;
  }
  if (b.dataset.copyMissionPacket) {
    const mid = b.dataset.copyMissionPacket;
    const mObj = missions.find((x) => x.id === mid);
    if (mObj) copyText(buildCoachingPacket(mObj, state.missionDrafts[mid] || '', state.missionEvals[mid]));
    return;
  }
  if (b.dataset.finishSession) {
    const mid = b.dataset.finishSession;
    if (!state.completedMissions.includes(mid)) state.completedMissions.push(mid);
    save();
    navigate('missions');
    render();
    notice(t('Day ' + dayEntryFor(mid).day + ' Complete! 🔥', 'Day ' + dayEntryFor(mid).day + ' 通关！🔥'));
    return;
  }
  if (b.dataset.toolkitTab) {
    toolkitSub = b.dataset.toolkitTab;
    navigate('toolkit/' + toolkitSub);
    render();
    return;
  }
  if (b.dataset.playbook) { activePlaybook = b.dataset.playbook; render(); return; }
  if (b.dataset.symptom) {
    const sid = b.dataset.symptom;
    if (openSymptoms.has(sid)) openSymptoms.delete(sid);
    else openSymptoms.add(sid);
    render();
    return;
  }
  if (b.dataset.studioPreset) {
    const p = studioPresets[b.dataset.studioPreset];
    if (p) {
      state.studioPreset = p.id;
      state.studioName = t(p.name_en, p.name_zh);
      state.studioGoal = t(p.goal_en, p.goal_zh);
      state.studioFlags = { ...p.flags };
      save();
      render();
    }
    return;
  }
  if (b.dataset.studioFlag) { state.studioFlags[b.dataset.studioFlag] = !state.studioFlags[b.dataset.studioFlag]; save(); render(); return; }
  if (b.dataset.studioTab) { studioTab = b.dataset.studioTab; render(); return; }
  if (b.dataset.evalCheck) { toggleArr(state.evalChecks, b.dataset.evalCheck); save(); render(); return; }
  if (b.id === 'add-custom-eval') {
    const inp = $('#custom-eval-input');
    const txt = (inp?.value || '').trim();
    if (!txt) return;
    state.customEvals.push({ id: 'cev-' + Date.now(), text: txt });
    save();
    render();
    return;
  }
  if (b.dataset.notesTab) { notesTab = b.dataset.notesTab; render(); return; }
  if (b.dataset.copyText) { copyText(b.dataset.copyText); return; }
  if (b.dataset.route) { navigate(b.dataset.route); render(); return; }
  if (b.dataset.card) { cardIndex = (cardIndex + (b.dataset.card === 'next' ? 1 : -1) + terms.length) % terms.length; cardBack = false; render(); return; }
  if (b.dataset.cardIndex) { cardIndex = Number(b.dataset.cardIndex); cardBack = false; render(); return; }
  if (b.dataset.flip) { cardBack = !cardBack; render(); return; }
  if (b.dataset.learned) { toggleArr(state.learned, b.dataset.learned); save(); render(); return; }
  if (b.dataset.complete) { toggleArr(state.completed, b.dataset.complete); save(); render(); return; }
  if (b.dataset.grade) {
    const l = byId[b.dataset.grade];
    const d = state.drafts[l.id] || {};
    if (l.quiz.some((_, i) => d[i] === undefined)) { notice(t('Answer all questions first', '请先答完所有题')); return; }
    const score = l.quiz.reduce((s, q, i) => s + (Number(d[i]) === q.answer ? 1 : 0), 0);
    state.quiz[l.id] = { score, total: l.quiz.length, answers: { ...d } };
    save();
    render();
    return;
  }
  if (b.dataset.retake) { delete state.quiz[b.dataset.retake]; delete state.drafts[b.dataset.retake]; save(); render(); return; }
  if (b.id === 'open-data') { $('#data-dialog').showModal(); return; }
  if (b.id === 'export-data') {
    const data = JSON.stringify({ app: 'AI Fieldnotes', version: 1, exported_at: new Date().toISOString(), state }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-fieldnotes-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    notice(t('Backup downloaded', '备份已下载'));
    return;
  }
  if (b.id === 'import-data') { $('#import-file').click(); return; }
});

document.addEventListener('change', (ev) => {
  const input = ev.target;
  if (input.dataset.quiz) {
    const id = input.dataset.quiz;
    if (!state.drafts[id]) state.drafts[id] = {};
    state.drafts[id][input.dataset.q] = Number(input.value);
    save();
    return;
  }
  if (input.id === 'import-file') {
    const file = input.files && input.files[0];
    if (!file) return;
    file.text().then((txt) => {
      const obj = JSON.parse(txt);
      if (obj.app !== 'AI Fieldnotes' || obj.version !== 1 || !obj.state) throw Error('Invalid format');
      state = normalize(obj.state);
      save();
      $('#data-dialog').close();
      render();
      notice(t('Backup imported', '已导入进度'));
    }).catch((err) => notice(err.message)).finally(() => { input.value = ''; });
  }
});

document.addEventListener('input', (ev) => {
  if (ev.target.dataset.note) { state.notes[ev.target.dataset.note] = ev.target.value; save(); return; }
  if (ev.target.dataset.missionDraft) { state.missionDrafts[ev.target.dataset.missionDraft] = ev.target.value; save(); return; }
  if (ev.target.id === 'studio-name' || ev.target.id === 'studio-goal') {
    if (ev.target.id === 'studio-name') state.studioName = ev.target.value;
    if (ev.target.id === 'studio-goal') state.studioGoal = ev.target.value;
    save();
    const rx = buildStudioPrescription();
    const activeArtifact = studioTab === 'schemas' ? rx.schemasJson : (studioTab === 'prompt' ? rx.kickoffPrompt : rx.agentsMd);
    const box = $('.snippet-box');
    if (box) box.textContent = activeArtifact;
  }
});

window.addEventListener('hashchange', () => { render(); window.scrollTo({ top: 0, behavior: 'instant' }); });

render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').then((reg) => reg.update()).catch(() => {}));
}
