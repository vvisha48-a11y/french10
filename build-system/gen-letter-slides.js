// Generate t11-lettre.html — La Lettre (Section B) as ordinary Reveal.js slides,
// exactly like every other topic in the deck.
//
// letterdata.js stays the single source of truth; this bakes it into static
// slides so the 88 KB LETTERDATA runtime block is no longer shipped.
// Diagrams come from lm-visuals.js (build-time module, not shipped as code).
//
// 5 groups -> 5 horizontal stacks; 1 topic -> 1 slide (35 slides).
// No step is named "Description", so these stacks stay exempt from the
// 8-step rule in verify.js.
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 't11-lettre.html');
const VISUALS = require('./lm-visuals.js');
const RET = require('./retenir.js');
const LS = require('./lessons.js');

let src = fs.readFileSync(path.join(__dirname, 'letterdata.js'), 'utf8');
const DATA = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']') + 1));

/* HTML-escape for text nodes and attributes. */
const esc = v => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const LETTER_CSS = "/* ============ MODEL LETTERS — 4-slide split, sized to fill ============\n   Each letter is spread over Sujet / Lettre / Vocabulaire / Banque so nothing\n   scrolls. Type scales with the viewport so the longest letter still fits while\n   short ones simply look more generous. */\n.let-slide{ justify-content:flex-start; }\n.let-title{ margin-bottom:2px; }\n.let-focus{\n  width:100%; max-width:1100px; margin:auto; min-width:0;\n  display:flex; flex-direction:column; justify-content:center;\n}\n\n/* 1 — le sujet */\n.let-prompt{ text-align:left; padding:clamp(14px,2vw,26px) clamp(16px,2.4vw,32px); }\n.let-prompt-fr{\n  font-size:clamp(1.15rem,1.75vw,1.75rem); line-height:1.5;\n  font-style:normal; font-weight:600; color:var(--text-main);\n}\n.let-prompt .gloss{ font-size:clamp(.95rem,1.15vw,1.2rem); margin-top:8px; }\n.let-next{ margin-top:14px; text-align:center; color:var(--text-muted); font-size:.85rem; font-style:italic; }\n\n/* 2 — la lettre modèle, alone on the slide and as large as it can be */\n.let-paper{\n  width:100%; max-width:none; margin:0; text-align:left;\n  padding:clamp(12px,1.4vw,22px) clamp(14px,1.6vw,26px);\n}\n.let-paper .example-text{\n  font-size:clamp(1rem, var(--let-fs,1.9vh), 2rem); line-height:1.45;\n  font-style:normal; margin:.34em 0; color:var(--text-main);\n}\n.let-paper .gloss{ font-size:clamp(.68rem, calc(var(--let-fs,1.9vh) * .8), 1.4rem); margin:.1em 0 .5em; }\n/* English on: a second, smaller solved size, and the chrome gives up its room */\nbody.letter-en .let-paper .example-text{ font-size:clamp(.68rem, var(--let-fs-en,1.4vh), 2rem); }\nbody.letter-en .let-paper .gloss{ font-size:clamp(.62rem, calc(var(--let-fs-en,1.4vh) * .8), 1.3rem); }\nbody.letter-en .let-title, body.letter-en .let-sub{ display:none; }\n/* letter slides only — never the global .slide-card */\n.let-slide{ overflow:hidden; }\n.let-date{ text-align:right; color:var(--gold); font-weight:600; }\n.let-sal{ font-weight:800; color:var(--heading-color); }\n.let-close, .let-sig{ text-align:right; }\n.let-sig{ font-weight:800; color:var(--heading-color); }\n\n/* 3 & 4 — vocabulary, phrase bank, notes */\n.let-vocab .let-table{ max-width:900px; margin:0 auto; }\n.let-table td{\n  font-size:clamp(.95rem,1.2vw,1.3rem); padding:clamp(4px,.6vw,10px) clamp(8px,1vw,16px);\n  vertical-align:top; line-height:1.4;\n}\n.let-table td:first-child{ font-weight:600; color:var(--text-main); }\n.let-table td.gloss{ color:var(--text-muted); }\n.let-h{\n  margin:6px 0 8px; font-weight:800; color:var(--heading-color);\n  font-size:clamp(.95rem,1.15vw,1.2rem);\n}\n.let-note{ margin:.4em 0; font-size:clamp(.88rem,1.05vw,1.1rem); line-height:1.45; text-align:left; }\n\n@media (max-width:1100px){\n  .let-cols{ grid-template-columns:1fr; }\n  .let-paper .example-text{ font-size:clamp(.95rem, var(--let-fs,1.9vh), 1.25rem); }\n}\n@media print{\n  .let-paper, .let-focus{ max-width:100% !important; }\n  .let-paper .example-text, .let-paper .gloss, .let-table td, .let-note{ font-size:11pt !important; }\n  .let-next{ display:none !important; }\n}";

/* Letter ids already start with 'let-'; lesson ids do not. Avoid let-let-... */
const sid = id => (String(id).indexOf('let-') === 0 ? String(id) : 'let-' + id);

/* A French line with its English underneath, hidden until the toggle is pressed. */
const pair = (fr, en, cls) =>
  '                <p class="' + (cls || 'example-text') + '">' + esc(fr) + '</p>\n' +
  (en ? '                <p class="gloss let-en">' + esc(en) + '</p>\n' : '');

const table = (label, rows) => {
  if (!rows || !rows.length) return '';
  let h = '                <p class="let-h">' + esc(label) + '</p>\n';
  h += '                <table class="subj-table let-table"><tbody>\n';
  rows.forEach(r => {
    h += '                  <tr><td lang="fr">' + esc(r[0]) + '</td><td class="gloss">' + esc(r[1]) + '</td></tr>\n';
  });
  return h + '                </tbody></table>\n';
};

const slugCount = {};
function stepName(t){
  // the ribbon label — English, short, and unique within its stack
  let s = t.en.title;
  if (t.kind === 'letter' && t.lecon) s = t.lecon + ' — ' + s;
  slugCount[s] = (slugCount[s] || 0) + 1;
  return slugCount[s] > 1 ? s + ' (' + slugCount[s] + ')' : s;
}

function head(t, n){
  let h = '          <div class="slide-card">\n';
  h += '            <div class="flag-stripe"></div>\n';
  h += '            <div class="step-ribbon"><span class="sr-n">' + n + '</span> ' + esc(t.en.title) + '</div>\n';
  h += '            <button class="let-toggle" type="button" aria-pressed="false">Show English</button>\n';
  h += '            <h2 class="editable-field">' + esc(t.en.title) + '</h2>\n';
  h += '            <p class="let-sub" lang="fr">' + esc(t.fr.title) + '</p>\n';
  return h;
}

function box(t){
  if (!t.box) return '';
  const tone = (t.box.tone === 'warn' || t.box.tone === 'trap') ? 'gold' : 'blue';
  return '            <div class="box ' + tone + ' content-box">\n' +
         pair(t.box.fr, t.box.en, 'example-text') +
         '            </div>\n';
}

function quizBlock(t){
  if (!t.quiz || !t.quiz.length) return '';
  let h = '              <div class="quiz-container">\n';
  h += '                <div class="quiz-progress-bar"><div class="quiz-progress-fill"></div></div>\n';
  t.quiz.forEach((q, i) => {
    const correct = q.options[q.answer];
    h += '                <div class="question-row" data-answer="' + esc(correct) + '">\n';
    h += '                  <p class="q-text">' + (i + 1) + '. ' + esc(q.q.en || q.q.fr) +
         '<span class="gloss" lang="fr"> ' + esc(q.q.fr) + '</span></p>\n';
    h += '                  <div class="options">' +
         q.options.map(o => '<button class="option-btn">' + esc(o) + '</button>').join('') +
         '</div>\n';
    h += '                </div>\n';
  });
  h += '                <div class="score-display">0 / ' + t.quiz.length + '</div>\n';
  h += '              </div>\n';
  return h;
}

function renderLesson(t, n){
  /* Visual layout (English explanations, French only for what is being taught).
     Falls back to the original prose renderer for any slide not yet redesigned. */
  const LETTERS = (DATA.find(x => x.group === 'Model Letters') || {}).topics || [];
  const visual = LS.renderLessonBody(t, LETTERS);
  if (visual !== null){
    let v = '          <div class="slide-card ls-slide">\n';
    v += '            <div class="flag-stripe"></div>\n';
    v += '            <div class="step-ribbon"><span class="sr-n">' + n + '</span> ' + esc(t.en.title) + '</div>\n';
    v += '            <h2 class="editable-field">' + esc(t.en.title) + '</h2>\n';
    v += visual;
    v += quizBlock(t);
    v += '          </div>\n';
    return v;
  }

  let h = head(t, n);
  h += '            <div class="let-body">\n';

  if (t.visual && VISUALS[t.visual]){
    h += '              <figure class="let-fig">' + VISUALS[t.visual]() + '</figure>\n';
  }

  h += '              <div class="box blue content-box">\n';
  (t.fr.paras || []).forEach((p, i) => { h += pair(p, (t.en.paras || [])[i]); });
  h += '              </div>\n';

  if (t.compare && t.compare.rows && t.compare.rows.length){
    h += '              <table class="subj-table let-table"><tbody>\n';
    h += '                <tr><th></th><th>✅ correct</th><th>❌ incorrect</th></tr>\n';
    t.compare.rows.forEach(r => {
      h += '                <tr><td class="gloss">' + esc(r.aspect.fr) + '</td>' +
           '<td><span class="highlight hl-verb">' + esc(r.good) + '</span></td>' +
           '<td><span class="highlight hl-neg">' + esc(r.bad) + '</span></td></tr>\n';
      if (r.why) h += '                <tr><td></td><td colspan="2" class="gloss">' + esc(r.why.fr) +
           '<span class="let-en"> — ' + esc(r.why.en) + '</span></td></tr>\n';
    });
    h += '              </tbody></table>\n';
  }

  if (t.quiz && t.quiz.length){
    h += '              <div class="quiz-container">\n';
    h += '                <div class="quiz-progress-bar"><div class="quiz-progress-fill"></div></div>\n';
    t.quiz.forEach((q, i) => {
      const correct = q.options[q.answer];
      h += '                <div class="question-row" data-answer="' + esc(correct) + '">\n';
      h += '                  <p class="q-text">' + (i + 1) + '. ' + esc(q.q.fr) +
           '<span class="gloss let-en"> ' + esc(q.q.en) + '</span></p>\n';
      h += '                  <div class="options">' +
           q.options.map(o => '<button class="option-btn">' + esc(o) + '</button>').join('') +
           '</div>\n';
      h += '                </div>\n';
    });
    h += '                <div class="score-display">0 / ' + t.quiz.length + '</div>\n';
    h += '              </div>\n';
  }

  h += '            </div>\n';
  h += box(t);
  h += '          </div>\n';
  return h;
}

/* A model letter is split across FOUR slides so nothing scrolls and the type can
   be large enough to read from the back of a room:
     1 Le sujet   2 La lettre modèle   3 Le vocabulaire clé   4 La banque + À retenir
   Every piece of the source data is carried over; nothing is summarised or dropped. */
/* Solve for the largest font at which a letter's wrapped text still fits the card.
   Reference viewport 1920x1080 (the classroom projector). Budget:
     1080 − topbar 56 − hud 54 − card padding 44 − heading block 122 − box padding 56
   Width is the full card interior now that .let-paper no longer caps at 1080px.
   Exported so verify-e-file.js can re-run the same maths as a build gate. */
/* SAFETY is deliberate headroom. The model estimates character advance and chrome
   heights, and it cannot be checked in a browser from here, so sizing to a full
   100% of the available height would turn any small estimation error straight into
   the scrollbar this change exists to remove. 0.90 costs ~2px of type and buys a
   10% error budget. */
const FIT = { H: 1080, TEXTW: 1276, CHROME: 56 + 54 + 44 + 122 + 56, LH: 1.45, MARGIN: 0.34, SAFETY: 0.90 };
function fitLetter(F){
  const paras = F.paras || [], closing = F.closing || [];
  const blocks = 2 + paras.length + closing.length + 1;   // date, salutation, paras, closing, signature
  const chars = [F.date, F.salutation].concat(paras, closing, [F.signature]).join(' ').length;
  const avail = Math.round((FIT.H - FIT.CHROME) * FIT.SAFETY);
  for (let px = 34; px >= 13; px--){
    const cpl = Math.floor(FIT.TEXTW / (px * 0.50));      // ~0.50em average character advance
    const lines = Math.ceil(chars / cpl) + blocks;        // wrapped lines + one per short block
    const h = lines * px * FIT.LH + blocks * px * FIT.MARGIN * 2;
    if (h <= avail) return { px, lines, h: Math.round(h), avail, vh: +(px / FIT.H * 100).toFixed(2) };
  }
  return { px: 13, lines: 0, h: 0, avail, vh: +(13 / FIT.H * 100).toFixed(2) };
}

/* The size to use when English shows underneath every French line.
   Models BOTH languages: 2x the blocks (each French line gains an English
   sibling with its own margins), FR+EN characters, English at 0.8x the French
   size. The title and subtitle are hidden in this state, so their ~122px comes
   back into the budget.
   Floored at 13px: the user accepted that the longest letters fall under the
   16px legibility floor rather than give up the under-the-line layout. */
function fitLetterEn(F, E){
  const paras = F.paras || [], closing = F.closing || [];
  const blocks = 2 + paras.length + closing.length + 1;
  const frChars = [F.date, F.salutation].concat(paras, closing, [F.signature]).join(' ').length;
  const eParas = (E && E.paras) || [], eClosing = (E && E.closing) || [];
  const enChars = [(E && E.date) || '', (E && E.salutation) || '']
    .concat(eParas, eClosing, [(E && E.signature) || '']).join(' ').length;
  const avail = Math.round((FIT.H - (FIT.CHROME - 122)) * FIT.SAFETY);
  for (let px = 34; px >= 13; px--){
    const enPx = px * 0.8;
    const frLines = Math.ceil(frChars / Math.floor(FIT.TEXTW / (px * 0.50))) + blocks;
    const enLines = Math.ceil(enChars / Math.floor(FIT.TEXTW / (enPx * 0.50))) + blocks;
    const h = frLines * px * FIT.LH + blocks * px * FIT.MARGIN * 2
            + enLines * enPx * FIT.LH + blocks * enPx * FIT.MARGIN * 2;
    if (h <= avail) return { px, h: Math.round(h), avail, vh: +(px / FIT.H * 100).toFixed(2) };
  }
  return { px: 13, h: 0, avail, vh: +(13 / FIT.H * 100).toFixed(2) };
}

function letterHead(t, n, part, label){
  let h = '          <div class="slide-card let-slide">\n';
  h += '            <div class="flag-stripe"></div>\n';
  h += '            <div class="step-ribbon"><span class="sr-n">' + n + '.' + part + '</span> ' + esc(label) + '</div>\n';
  h += '            <button class="let-toggle" type="button" aria-pressed="false">Show English</button>\n';
  h += '            <h2 class="editable-field let-title">' + esc(t.en.title) + '</h2>\n';
  h += '            <p class="let-sub" lang="fr">' + esc(t.fr.title) + '</p>\n';
  return h;
}

function renderLetter(t, n){
  const F = t.letter.fr, E = t.letter.en || {};
  const parts = [];

  /* 1 — le sujet: the exam question itself, set large and centred */
  let a = letterHead(t, n, 1, 'Le sujet');
  a += '            <div class="let-focus">\n';
  a += '              <p class="let-h">Le sujet à l&#39;examen' +
       (t.years || []).map(y => ' <span class="q-tag">' + esc(y) + '</span>').join('') + '</p>\n';
  a += '              <div class="box gold content-box let-prompt">\n';
  a += pair(t.prompt.fr, t.prompt.en, 'example-text let-prompt-fr');
  a += '              </div>\n';
  a += '              <p class="let-next">→ la lettre modèle suit</p>\n';
  a += '            </div>\n';
  a += '          </div>\n';
  parts.push({ suffix: 'sujet', step: 'Le sujet', body: a });

  /* 2 — la lettre modèle: alone on the slide, box filling the full card width, and
     sized to ITS OWN length. Scrolling is a HEIGHT problem, so the size is solved
     against available height (in vh) rather than driven by vw. See fitLetter(). */
  const fit = fitLetter(F);
  let b = letterHead(t, n, 2, 'La lettre modèle');
  const fitEn = fitLetterEn(F, E);
  b += '            <div class="box blue content-box let-letter let-paper" style="--let-fs:' + fit.vh + 'vh; --let-fs-en:' + fitEn.vh + 'vh">\n';
  b += pair(F.date, E.date, 'example-text let-date');
  b += pair(F.salutation, E.salutation, 'example-text let-sal');
  (F.paras || []).forEach((p, i) => { b += pair(p, (E.paras || [])[i], 'example-text let-para'); });
  (F.closing || []).forEach((c, i) => { b += pair(c, (E.closing || [])[i], 'example-text let-close'); });
  b += pair(F.signature, E.signature, 'example-text let-sig');
  b += '            </div>\n';
  b += '          </div>\n';
  parts.push({ suffix: 'lettre', step: 'La lettre modèle', body: b });

  /* 3 — le vocabulaire clé */
  let c = letterHead(t, n, 3, 'Le vocabulaire clé');
  c += '            <div class="let-focus let-vocab">\n';
  c += table('Le vocabulaire clé', t.vocab);
  c += '            </div>\n';
  c += '          </div>\n';
  parts.push({ suffix: 'vocab', step: 'Le vocabulaire clé', body: c });

  /* 4 — la banque de phrases + à retenir (notes stay visible) */
  let d = letterHead(t, n, 4, 'La banque de phrases');
  d += '            <div class="two-columns let-cols">\n';
  d += '              <div class="let-side">\n';
  d += table('La banque de phrases', t.bank);
  d += '              </div>\n';
  // the notes moved to their own À retenir slide (below), so the bank gets the room
  d += '            </div>\n';
  d += box(t);
  d += '          </div>\n';
  parts.push({ suffix: 'bank', step: 'La banque de phrases', body: d });

  /* 5 — à retenir: the same notes, typed into colour-coded cards. Corrections
     become a strike-through / bold-green comparison table with the changed
     letters marked; Ajouts, ATTENTION and translation notes get their own cards. */
  const rt = RET.renderRetenir(t);
  if (rt){
    let e2 = letterHead(t, n, 5, 'Points to Remember');
    e2 += rt;
    e2 += '          </div>\n';
    parts.push({ suffix: 'retenir', step: 'Points to Remember', body: e2 });
  }

  return parts;
}

/* Only build the part file when run directly. When require()d (by
   split-letters-in-file.js) we just export the renderer. */
const RUN_DIRECT = require.main === module;

/* ---------------- assemble ---------------- */
if (RUN_DIRECT) {
let out = '      <!-- ==================================================================\n' +
          '           TOPIC 11 — LA LETTRE (Section B)\n' +
          '           GENERATED by gen-letter-slides.js from letterdata.js — do not hand-edit.\n' +
          '           5 groups -> 5 stacks, 1 topic -> 1 slide. No "Description" step, so\n' +
          '           these stacks are exempt from the 8-step rule in verify.js.\n' +
          '           =================================================================== -->\n';

let slides = 0;
DATA.forEach(g => {
  out += '\n      <section data-topic="lettre" data-topic-name="La Lettre (Section B)" data-sub="' + esc(g.group) + '">\n\n';
  g.topics.forEach((t, i) => {
    if (t.kind === 'letter'){
      renderLetter(t, i + 1).forEach(p => {
        // data-group / data-item drive the sidebar accordion (Chapter -> Letter -> parts).
        // Explicit attributes rather than parsing data-step, whose label already
        // contains an em-dash and would break on any title that also has one.
        out += '        <section data-slide-id="' + esc(sid(t.id)) + '-' + p.suffix +
               '" data-step="' + esc(t.lecon ? t.lecon + ' — ' + p.step : p.step) + '"' +
               ' data-group="' + esc(t.lecon || 'Autres') + '"' +
               ' data-item="' + esc(t.en.title) + '">\n';
        out += p.body;
        out += '        </section>\n\n';
        slides++;
      });
    } else {
      out += '        <section data-slide-id="' + esc(sid(t.id)) + '" data-step="' + esc(stepName(t)) + '">\n';
      out += renderLesson(t, i + 1);
      out += '        </section>\n\n';
      slides++;
    }
  });
  out += '      </section>\n';
});

fs.writeFileSync(OUT, out);
console.log('  letter slides generated:', slides, 'in', DATA.length, 'stacks ->', path.basename(OUT));
}

/* shared with split-letters-in-file.js so there is ONE renderer */
// LETTER_CSS carries the À retenir rules too, so both patch targets get them
// One CSS bundle: letters + À retenir cards + the instructional-slide components.
// Both patch targets consume this, so they can never get a partial stylesheet.
module.exports = {
  renderLetter, renderLesson, esc, sid, fitLetter, FIT,
  LETTER_CSS: LETTER_CSS + '\n' + RET.RETENIR_CSS + '\n' + LS.LESSON_CSS, fitLetterEn };
