// Generates t12-messages.html — Les Messages (Section B, 5 marks) — from messagedata.js.
//
//   node gen-message-slides.js
//
// Dual mode, like gen-letter-slides.js: run directly it writes the part file; require()d
// it exports the renderers, so an in-place patcher and the build can never diverge.
//
// It SELF-CHECKS before writing (the idiom from gen-nom-slides.js, which gen-letter-slides
// lacks): a bad build fails here rather than surfacing three gates later.
//
// Two structural rules keep this module exempt from the grammar schema in verify.js:
//   * no step is ever named "Description"  -> verify.js:37 never selects these stacks
//   * no step ever starts with "Usages"    -> verify.js gate 9 never demands a visual
// Both are asserted below, not merely intended.

const fs = require('fs');
const path = require('path');

const LS = require('./msg-lessons.js');
const RET = require('./retenir.js');
const CSSMOD = require('./msg-css.js');

const OUT = path.join(__dirname, 't12-messages.html');

const src = fs.readFileSync(path.join(__dirname, 'messagedata.js'), 'utf8');
const at = src.indexOf('MESSAGEDATA');
const DATA = JSON.parse(src.slice(src.indexOf('[', at), src.lastIndexOf(']') + 1));

const esc = v => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* Ids are already msg- prefixed in the data; this is the idempotent guard. */
const sid = id => (String(id).indexOf('msg-') === 0 ? String(id) : 'msg-' + id);

/* ------------------------------------------------------------------ *
 *  fitMessage — the height solver                                     *
 * ------------------------------------------------------------------ *
 * fitLetter() cannot be reused. Its loop starts at 34px and .let-paper clamps at 2rem
 * (32px), so a 40-word message saturates both: every message would render at an
 * identical 32px with ~45% of the card empty. The 17 real letters land at 17-26px, so
 * letters never exercised that ceiling and the bug was invisible there.
 *
 * This solver has a message-shaped budget: less chrome (no French subtitle line, no
 * toggle button) and a ceiling of 46px, matching the 2.9rem upper clamp in msg-css.js.
 * Raising one without the other silently reintroduces the same saturation.
 */
const FITM = {
  H: 1080,
  TEXTW: 1104,                       // .msg-paper max-width 1180 minus 2 x 38px padding
  CHROME: 56 + 54 + 44 + 96 + 60 + 150,  // topbar, hud, card padding, heading+ribbon,
                                     // paper padding, + the prompt box. The toggle is
                                     // absolutely positioned and the vocabulary moved to
                                     // its own slide, so neither is budgeted any more.
  LH: 1.5,
  MARGIN: 0.30,
  SAFETY: 0.90,                      // the model cannot be measured in a browser at build time
  MAXPX: 46,                         // == 2.9rem, the upper clamp in msg-css.js
  MINPX: 16
};

function fitMessage(F){
  const paras = F.paras || [], closing = F.closing || [];
  const blocks = 2 + paras.length + closing.length + 1;   // date, salutation, paras, closing, signature
  const chars = [F.date, F.salutation].concat(paras, closing, [F.signature]).join(' ').length;
  const avail = Math.round((FITM.H - FITM.CHROME) * FITM.SAFETY);
  for (let px = FITM.MAXPX; px >= FITM.MINPX; px--){
    const cpl = Math.floor(FITM.TEXTW / (px * 0.50));     // ~0.50em average character advance
    const lines = Math.ceil(chars / cpl) + blocks;        // wrapped lines + one per short block
    const h = lines * px * FITM.LH + blocks * px * FITM.MARGIN * 2;
    if (h <= avail) return { px, lines, h: Math.round(h), avail, vh: +(px / FITM.H * 100).toFixed(2) };
  }
  return { px: FITM.MINPX, lines: 0, h: 0, avail, vh: +(FITM.MINPX / FITM.H * 100).toFixed(2) };
}

/* ---------------- rendering ---------------- */

const TYPE_LABEL = {
  invitation:  ['Invitation',  'blue'],
  acceptation: ['Acceptance',  'green'],
  refus:       ['Refusal',     'gold'],
  annonce:     ['Announcement','purple']
};

function head(t, n, label){
  let h = '          <div class="slide-card">\n';
  h += '            <div class="flag-stripe"></div>\n';
  h += '            <div class="step-ribbon"><span class="sr-n">' + n + '</span> ' + esc(label) + '</div>\n';
  h += '            <h2 class="editable-field">' + esc(t.en.title) + '</h2>\n';
  return h;
}

function renderMessage(t, n){
  const F = t.message.fr, E = t.message.en || {};
  const fit = fitMessage(F);
  const type = TYPE_LABEL[t.type] || ['Message', ''];

  let h = head(t, n, t.fr.title);
  if ((t.message.en || {}).salutation)
    h += '            <button class="msg-toggle" type="button" aria-pressed="false">Show English</button>\n';
  h += '            <p class="msg-lead"><span class="ls-tag">' + esc(type[0]) + '</span>' +
       (t.draft ? ' <span class="msg-q-tag">drafted — awaiting review</span>' : '') + '</p>\n';

  h += '            <div class="box gold content-box msg-prompt">\n';
  h += '              <p class="msg-prompt-fr" lang="fr">' + esc(t.prompt.fr) + '</p>\n';
  h += '              <p class="msg-prompt-en">' + esc(t.prompt.en) + '</p>\n';
  h += '            </div>\n';

  h += '            <div class="msg-paper msg-fr" style="--msg-fs:' + fit.vh + 'vh">\n';
  h += '              <p class="msg-date">' + esc(F.date) + '</p>\n';
  h += '              <p class="msg-sal">' + esc(F.salutation) + '</p>\n';
  (F.paras || []).forEach(p => { h += '              <p class="msg-body">' + esc(p) + '</p>\n'; });
  (F.closing || []).forEach(c => { h += '              <p class="msg-close">' + esc(c) + '</p>\n'; });
  h += '              <p class="msg-sig">' + esc(F.signature) + '</p>\n';
  h += '            </div>\n';

  /* The English control is a pinned button, NOT the deck-wide .let-toggle: that one is
     owned by La Lettre and flipping it from here would change letter slides too. Being
     absolutely positioned it also costs no vertical space, which is part of what lets
     the message fit. */
  if (E.salutation){
    h += '            <div class="msg-paper msg-en" style="--msg-fs:' + fit.vh + 'vh">\n';
    h += '              <p class="msg-date">' + esc(E.date) + '</p>\n';
    h += '              <p class="msg-sal">' + esc(E.salutation) + '</p>\n';
    (E.paras || []).forEach(p => { h += '              <p class="msg-body">' + esc(p) + '</p>\n'; });
    (E.closing || []).forEach(c => { h += '              <p class="msg-close">' + esc(c) + '</p>\n'; });
    h += '              <p class="msg-sig">' + esc(E.signature) + '</p>\n';
    h += '            </div>\n';
  }

  /* Vocabulary now lives on its own follow-on slide (renderVocab) so it can never
     crowd the message. */

  h += '          </div>\n';
  return h;
}

/* One follow-on slide per message carrying just that message's phrases. Step name is
   neither "Description" (8-step rule) nor "Usages…" (visual gate). */
function renderVocab(t, n){
  let h = head(t, n, 'Vocabulaire — ' + t.fr.title);
  h += '            <p class="msg-lead"><span class="ls-tag">Vocabulaire</span></p>\n';
  h += '            <div class="ls-phrases">\n';
  t.vocab.forEach(v => {
    h += '              <div class="ls-phrase"><p class="ls-fr" lang="fr">' + esc(v[0]) +
         '</p><p class="ls-en">' + esc(v[1]) + '</p></div>\n';
  });
  h += '            </div>\n';
  h += '          </div>\n';
  return h;
}

function renderLessonSlide(t, n){
  const body = LS.renderMessageBody(t);
  if (body === null) return null;
  return head(t, n, t.en.title) + body + '          </div>\n';
}

/* The correction slides: retenir.js already turns « wrong » -> « right » pairs into
   colour-coded cards with a character-level diff. Collecting the notes from every
   message into two slides keeps one slide per message while still surfacing the
   corrections, which are the most valuable thing in the teacher's source file. */
function correctionSlides(letters){
  const notes = [];
  letters.forEach(t => (t.notes || []).forEach(nte => notes.push(nte)));
  const half = Math.ceil(notes.length / 2);
  return [notes.slice(0, half), notes.slice(half)].map((chunk, i) => {
    const inner = RET.renderRetenir({ notes: chunk });
    let h = '          <div class="slide-card">\n';
    h += '            <div class="flag-stripe"></div>\n';
    h += '            <div class="step-ribbon"><span class="sr-n">' + (i + 1) + '</span> Points to Remember</div>\n';
    h += '            <h2 class="editable-field">What Was Corrected — ' + (i + 1) + ' of 2</h2>\n';
    h += inner;
    h += '          </div>\n';
    return { id: 'msg-retenir-' + (i + 1), step: 'Points to Remember (' + (i + 1) + ')', body: h };
  });
}

/* ---------------- assemble ---------------- */

function build(){
  let out = '      <!-- ==================================================================\n' +
            '           TOPIC 12 — LES MESSAGES (Section B, 5 marks)\n' +
            '           GENERATED by gen-message-slides.js from messagedata.js — do not hand-edit.\n' +
            '           5 groups -> 5 stacks. No step is named "Description" and none starts\n' +
            '           with "Usages", so these stacks are exempt from the 8-step rule and\n' +
            '           from the usage-visual rule in verify.js. Both are asserted at build.\n' +
            '           =================================================================== -->\n';

  let slides = 0;
  const fits = [];

  DATA.forEach(g => {
    out += '\n      <section data-topic="messages" data-topic-name="Les Messages (Section B)" data-sub="' + esc(g.group) + '">\n\n';
    let n = 0;

    g.topics.forEach(t => {
      n++;
      if (t.kind === 'message'){
        fits.push({ id: t.id, fit: fitMessage(t.message.fr) });
        out += '        <section data-slide-id="' + esc(sid(t.id)) + '" data-step="' + esc(t.fr.title) + '"' +
               ' data-group="' + esc(t.lecon || 'Autres') + '"' +
               ' data-item="' + esc(t.en.title) + '">\n';
        out += renderMessage(t, n);
        out += '        </section>\n\n';
        if (t.vocab && t.vocab.length){
          out += '        <section data-slide-id="' + esc(sid(t.id)) + '-vocab" data-step="' +
                 esc('Vocabulaire — ' + t.fr.title) + '"' +
                 ' data-group="' + esc(t.lecon || 'Autres') + '"' +
                 ' data-item="' + esc(t.en.title) + '">\n';
          out += renderVocab(t, n);
          out += '        </section>\n\n';
          slides++;
        }
      } else {
        const body = renderLessonSlide(t, n);
        if (body === null) throw new Error('no layout for lesson id: ' + t.id);
        out += '        <section data-slide-id="' + esc(sid(t.id)) + '" data-step="' + esc(t.en.title) + '">\n';
        out += body;
        out += '        </section>\n\n';
      }
      slides++;
    });

    if (g.group === 'Model Messages'){
      correctionSlides(g.topics.filter(t => t.kind === 'message')).forEach(cs => {
        out += '        <section data-slide-id="' + esc(cs.id) + '" data-step="' + esc(cs.step) + '"' +
               ' data-group="Corrections" data-item="' + esc(cs.step) + '">\n';
        out += cs.body;
        out += '        </section>\n\n';
        slides++;
      });
    }

    out += '      </section>\n';
  });

  return { out, slides, fits };
}

/* ---------------- self-check, before anything is written ---------------- */

function selfCheck(out, slides){
  const bad = [];

  const ids = [...out.matchAll(/data-slide-id="([^"]*)"/g)].map(m => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) bad.push('duplicate data-slide-id: ' + [...new Set(dup)].join(', '));
  if (ids.some(i => i.indexOf('msg-') !== 0)) bad.push('a slide id is missing the msg- prefix');

  const steps = [...out.matchAll(/data-step="([^"]*)"/g)].map(m => m[1]);
  if (steps.indexOf('Description') !== -1)
    bad.push('a step is named "Description" — that would drag these stacks into the 8-step rule');
  const usage = steps.filter(s => /^Usages/.test(s));
  if (usage.length) bad.push('step starts with "Usages" (would demand an inline visual): ' + usage.join(', '));

  const opens = (out.match(/<section\b/g) || []).length;
  const closes = (out.match(/<\/section>/g) || []).length;
  if (opens !== closes) bad.push('<section> imbalance: ' + opens + ' open, ' + closes + ' close');

  const htmlIds = [...out.matchAll(/\sid="([^"]*)"/g)].map(m => m[1]);
  const dupHtml = htmlIds.filter((x, i) => htmlIds.indexOf(x) !== i);
  if (dupHtml.length) bad.push('duplicate html id= (verify.js gate 3): ' + [...new Set(dupHtml)].join(', '));

  const quizzes = (out.match(/class="quiz-container"/g) || []).length;
  const scores = (out.match(/class="score-display"/g) || []).length;
  const fills = (out.match(/class="quiz-progress-fill"/g) || []).length;
  if (quizzes !== scores || quizzes !== fills)
    bad.push('quiz markup incomplete: ' + quizzes + ' containers, ' + scores + ' score-display, ' + fills + ' progress-fill');

  const hex = out.match(/(?:fill|stroke)="#[0-9a-fA-F]{3,8}"/g);
  if (hex) bad.push('SVG uses literal hex (breaks 6 of 7 themes): ' + [...new Set(hex)].join(' '));

  [...out.matchAll(/<div class="question-row"([^>]*)>/g)].forEach(m => {
    if (!/^\s*data-answer="/.test(m[1])) bad.push('question-row: data-answer must be the FIRST attribute');
  });

  if (/https?:\/\//.test(out.replace(/xmlns="[^"]*"/g, '')))
    bad.push('an external URL leaked into the markup');

  return bad;
}

/* ---------------- run ---------------- */

const RUN_DIRECT = require.main === module;
if (RUN_DIRECT){
  const { out, slides, fits } = build();
  const bad = selfCheck(out, slides);
  if (bad.length){
    console.error('  SELF-CHECK FAILED — nothing written:');
    bad.forEach(b => console.error('    x ' + b));
    process.exit(1);
  }
  fs.writeFileSync(OUT, out);

  const px = fits.map(f => f.fit.px);
  const atCeiling = fits.filter(f => f.fit.px === FITM.MAXPX);
  console.log('  message slides generated:', slides, 'in', DATA.length, 'stacks ->', path.basename(OUT));
  console.log('  fitMessage              :', Math.min.apply(null, px) + '-' + Math.max.apply(null, px) + 'px',
              '(' + atCeiling.length + ' at the ' + FITM.MAXPX + 'px ceiling)');
  if (atCeiling.length === fits.length)
    console.log('  NOTE: every message hit the ceiling — the solver is not discriminating, raise MAXPX and the CSS clamp together');
}

module.exports = { renderMessage, renderLessonSlide, correctionSlides, fitMessage, FITM,
                   esc, sid, build, selfCheck, MESSAGE_CSS: CSSMOD.MESSAGE_CSS };
