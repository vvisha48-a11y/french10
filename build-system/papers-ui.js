// The Question Papers module: CSS, markup and engine.
//
// Exported as strings, the same way topbar.js and msg-css.js are, so Phase 1's
// standalone lab (gen-papers-lab.js) and Phase 2's in-deck module share one
// source and cannot drift apart.
//
// Design rules this obeys, because the deck enforces them:
//   * Not one literal colour. Every shade comes from the theme tokens defined on
//     body.theme-* in b-style.html, so all 7 themes keep working.
//   * The existing vocabulary is reused, never re-invented: .q-tag for the year
//     badge, .box/.gloss/.key-form for content, .sb-item for the sidebar rows.
//   * Everything new is prefixed .pl- and scoped, so removing the module removes
//     its styling completely.
//
// The filter is the CBSE syllabus, supplied as data by papers-taxonomy.js. It is
// deliberately NOT derived from what the questions happen to say: a student
// revises from the syllabus, so the syllabus is what the menu has to show --
// including a row that currently matches nothing.

/* ------------------------------------------------------------------ *
 *  CSS
 * ------------------------------------------------------------------ */
module.exports.CSS = `/* ===== QUESTION PAPERS ===== */
/* Per-section identity. --sec is the accent, --sec-bg the ground; both derive
   from theme tokens, so a dark theme darkens them with everything else. A flat
   fallback is declared first for engines without color-mix. */
.pl-section{ --sec:var(--heading-color); --sec-bg:var(--box-blue-bg); }
.pl-section[data-section="A"]{ --sec:var(--heading-color); --sec-bg:var(--box-blue-bg); }
.pl-section[data-section="B"]{ --sec:var(--gold);          --sec-bg:var(--box-gold-bg); }
.pl-section[data-section="C"]{ --sec:var(--green);         --sec-bg:var(--box-blue-bg); }
.pl-section[data-section="D"]{ --sec:var(--purple);        --sec-bg:var(--box-gold-bg); }
@supports (background: color-mix(in srgb, red 10%, white)){
  .pl-section[data-section="A"]{ --sec-bg:color-mix(in srgb, var(--heading-color) 7%, var(--card-bg)); }
  .pl-section[data-section="B"]{ --sec-bg:color-mix(in srgb, var(--gold) 9%, var(--card-bg)); }
  .pl-section[data-section="C"]{ --sec-bg:color-mix(in srgb, var(--green) 9%, var(--card-bg)); }
  .pl-section[data-section="D"]{ --sec-bg:color-mix(in srgb, var(--purple) 9%, var(--card-bg)); }
}

.pl-page{ width:100%; max-width:1040px; margin:0 auto; padding:0 4px 120px; text-align:left; }
.pl-hero{ padding:6px 2px 16px; text-align:center; }
.pl-hero h1{ margin:0 0 6px; }
.pl-hero .gloss{ margin:0 auto; max-width:64ch; }

/* ---- the sticky control rail ---- */
.pl-rail{
  position:sticky; top:0; z-index:20; margin:10px 0 18px; padding:10px 12px;
  background:var(--card-bg); border:1px solid var(--card-border); border-radius:16px;
  box-shadow:0 10px 30px rgba(0,0,0,.10);
  display:flex; flex-wrap:wrap; gap:10px 14px; align-items:center;
}
.pl-rail-label{
  font-family:var(--custom-heading-font); font-size:.66rem; font-weight:800;
  text-transform:uppercase; letter-spacing:.08em; color:var(--text-muted); margin-right:2px;
}
.pl-rail-sep{ flex:1 1 12px; }
.pl-rail-row{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; }

.pl-chip{
  font-family:inherit; font-size:.74rem; font-weight:700; cursor:pointer;
  padding:5px 10px; border-radius:999px; white-space:nowrap;
  background:var(--highlight-bg); color:var(--text-main);
  border:1px solid var(--card-border); transition:all .18s ease;
}
.pl-chip:hover{ border-color:var(--highlight-border); transform:translateY(-1px); }
.pl-chip.is-on{ background:var(--highlight-border); color:#fff; border-color:var(--highlight-border); }
.pl-chip .pl-n{ opacity:.72; font-weight:800; margin-left:5px; font-size:.68rem; }
.pl-chip.is-empty{ opacity:.45; }
.pl-chip.is-empty:hover{ transform:none; }

/* the marks ring: what you have ticked, against what is on screen */
.pl-ring{ display:flex; align-items:center; gap:8px; }
.pl-ring svg{ width:42px; height:42px; transform:rotate(-90deg); }
.pl-ring circle{ fill:none; stroke-width:5; }
.pl-ring .pl-ring-bg{ stroke:var(--card-border); }
.pl-ring .pl-ring-fg{ stroke:var(--green); stroke-linecap:round; transition:stroke-dashoffset .5s ease; }
.pl-ring-txt{ font-family:var(--custom-heading-font); font-size:.72rem; font-weight:800; line-height:1.25; }
.pl-ring-txt small{ display:block; font-size:.62rem; font-weight:700; color:var(--text-muted); }

.pl-clock{
  font-family:var(--custom-heading-font); font-size:.95rem; font-weight:900;
  padding:4px 10px; border-radius:10px; background:var(--highlight-bg);
  color:var(--heading-color); border:1px solid var(--card-border); min-width:78px; text-align:center;
}
.pl-clock.is-low{ color:var(--crimson); border-color:var(--crimson); }

/* ---- the syllabus panel (desktop) ---- */
.pl-filter{ position:relative; }
.pl-panel{
  position:absolute; top:calc(100% + 8px); left:0; z-index:60;
  width:min(560px, calc(100vw - 40px)); max-height:72vh; overflow-y:auto;
  background:var(--card-bg); border:1px solid var(--card-border); border-radius:16px;
  box-shadow:0 20px 56px rgba(0,0,0,.28); padding:8px;
}
.pl-panel[hidden]{ display:none !important; }
.pl-grp{ border-bottom:1px solid var(--card-border); }
.pl-grp:last-child{ border-bottom:0; }
.pl-grp-btn{
  width:100%; display:flex; align-items:center; gap:8px; cursor:pointer;
  font-family:var(--custom-heading-font); font-size:.84rem; font-weight:900;
  padding:9px 10px; border:0; border-radius:10px;
  background:transparent; color:var(--heading-color); text-align:left;
}
.pl-grp-btn:hover{ background:var(--highlight-bg); }
.pl-grp-btn .pl-caret{ margin-left:auto; font-size:.7rem; opacity:.7; transition:transform .2s ease; }
.pl-grp.is-open .pl-grp-btn .pl-caret{ transform:rotate(90deg); }
.pl-grp-body{ display:none; padding:0 4px 8px; }
.pl-grp.is-open .pl-grp-body{ display:block; }

.pl-leaf{
  width:100%; display:flex; align-items:baseline; gap:8px; cursor:pointer;
  font-family:inherit; font-size:.8rem; font-weight:700; text-align:left;
  padding:6px 10px; border:0; border-radius:9px; background:transparent; color:var(--text-main);
}
.pl-leaf:hover{ background:var(--highlight-bg); }
.pl-leaf.is-on{ background:var(--highlight-border); color:#fff; }
.pl-leaf.is-on .pl-leaf-marks, .pl-leaf.is-on .pl-leaf-n{ color:#fff; opacity:.85; }
.pl-leaf-n{ margin-left:auto; font-weight:800; font-size:.72rem; color:var(--text-muted); }
.pl-leaf-marks{ font-size:.7rem; font-weight:800; color:var(--gold); white-space:nowrap; }
.pl-leaf-hint{ display:block; font-size:.68rem; font-weight:600; color:var(--text-muted); margin-top:1px; }
.pl-leaf.is-legacy{ font-style:italic; }
.pl-leaf.is-empty{ opacity:.5; }

/* the tenses, nested under Les Verbes */
.pl-tenses{ display:none; grid-template-columns:repeat(auto-fill, minmax(158px, 1fr)); gap:4px; padding:4px 10px 8px 22px; }
.pl-leaf-wrap.is-open .pl-tenses{ display:grid; }
.pl-tense{
  display:flex; align-items:center; gap:6px; cursor:pointer;
  font-family:inherit; font-size:.76rem; font-weight:700; text-align:left;
  padding:5px 9px; border:1px solid var(--card-border); border-radius:8px;
  background:var(--box-blue-bg); color:var(--text-main);
}
.pl-tense:hover{ border-color:var(--green); }
.pl-tense.is-on{ background:var(--green); border-color:var(--green); color:#fff; }
.pl-tense .pl-n{ margin-left:auto; font-size:.68rem; font-weight:800; opacity:.7; }
.pl-tense.is-legacy{ font-style:italic; }
/* A tense on the syllabus that these papers never ask. Present and visibly
   empty, rather than missing -- the menu is the syllabus, not the corpus. */
.pl-tense.is-empty{ opacity:.45; }
.pl-tense.is-empty:hover{ border-color:var(--card-border); }

/* ---- the drill-down rail (narrow screens) ---- */
.pl-drill{ display:none; align-items:center; gap:6px; flex-wrap:wrap; }
.pl-crumb{
  font-size:.72rem; font-weight:800; color:var(--text-muted);
  display:inline-flex; align-items:center; gap:5px;
}
.pl-crumb b{ color:var(--heading-color); }

/* ---- the current filter, spelled out with its marks ---- */
.pl-active{
  display:flex; align-items:center; gap:10px; flex-wrap:wrap;
  margin:0 0 16px; padding:10px 14px; border-radius:12px;
  background:var(--highlight-bg); border:1px solid var(--card-border);
  border-left:4px solid var(--heading-color);
}
.pl-active[hidden]{ display:none !important; }
.pl-active h3{ margin:0; font-size:.96rem; }
.pl-active .pl-marks-big{
  font-size:.76rem; font-weight:900; color:#fff; background:var(--gold);
  padding:3px 10px; border-radius:999px; white-space:nowrap;
}
.pl-active .pl-n{ font-size:.74rem; font-weight:800; color:var(--text-muted); }
.pl-active .pl-clear{
  margin-left:auto; font-family:inherit; font-size:.72rem; font-weight:800; cursor:pointer;
  padding:3px 10px; border-radius:999px; background:var(--card-bg);
  color:var(--text-main); border:1px solid var(--card-border);
}

/* ---- a paper ---- */
.pl-paper{ margin:0 0 34px; }
.pl-paper-head{
  display:flex; flex-wrap:wrap; gap:8px 12px; align-items:center;
  padding:12px 16px; border-radius:16px 16px 4px 4px;
  background:var(--highlight-bg); border:1px solid var(--card-border); border-bottom:0;
}
.pl-paper-head h2{ margin:0; font-size:1.12rem; }
.pl-paper-meta{ font-size:.74rem; color:var(--text-muted); font-weight:700; }
.pl-paper-note{ flex:1 1 100%; margin:2px 0 0; font-size:.74rem; line-height:1.5; color:var(--text-muted); }

/* ---- a section ---- */
.pl-section{
  border:1px solid var(--card-border); border-top:0; background:var(--sec-bg);
  padding:14px 16px 18px; position:relative;
}
.pl-paper .pl-section:last-child{ border-radius:0 0 16px 16px; }
.pl-section::before{ content:''; position:absolute; left:0; top:0; bottom:0; width:4px; background:var(--sec); }
.pl-section-head{ display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin:0 0 12px; }
.pl-section-head h3{
  margin:0; font-size:.98rem; color:var(--sec);
  font-family:var(--custom-heading-font); font-weight:900;
  text-transform:uppercase; letter-spacing:.06em;
}
.pl-section-head .pl-sec-marks{
  font-size:.72rem; font-weight:800; color:#fff; background:var(--sec);
  padding:2px 9px; border-radius:999px;
}

/* ---- a question ---- */
.pl-q{
  background:var(--card-bg); border:1px solid var(--card-border); border-left:3px solid var(--sec);
  border-radius:12px; padding:12px 14px; margin:0 0 10px;
  transition:opacity .45s ease, transform .45s ease;
}
/* Visible by default; the script hides it to animate it in. The other way round
   means any failure of that script leaves an exam paper permanently blank. */
.pl-q.pl-pre{ opacity:0; transform:translateY(14px); }
.pl-q.is-in{ opacity:1; transform:none; }
.pl-q.is-head{ background:var(--highlight-bg); border-left-style:dashed; }
.pl-q.is-out{
  opacity:0; transform:scale(.985); max-height:0; padding-top:0; padding-bottom:0;
  margin-bottom:0; border-width:0; overflow:hidden;
  transition:opacity .2s ease, max-height .3s ease .05s, padding .3s ease .05s, margin .3s ease .05s;
}
.pl-q-top{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px; }
.pl-q-num{
  font-family:var(--custom-heading-font); font-weight:900; font-size:.82rem;
  color:var(--sec); background:var(--highlight-bg);
  padding:2px 8px; border-radius:7px; border:1px solid var(--card-border);
}
.pl-q-instr{ margin:0 0 8px; font-size:.92rem; line-height:1.55; font-weight:700; }
.pl-q.is-head .pl-q-instr{ font-weight:800; }
.pl-marks{
  font-size:.7rem; font-weight:800; color:var(--text-muted);
  border:1px dashed var(--card-border); padding:1px 7px; border-radius:6px;
}
.pl-choose{ font-size:.7rem; font-weight:800; color:var(--gold); }
.pl-alt{
  font-size:.66rem; font-weight:900; letter-spacing:.06em; text-transform:uppercase;
  color:#fff; background:var(--gold); padding:2px 7px; border-radius:6px;
}

.pl-items{ margin:0; padding:0 0 0 2px; list-style:none; }
.pl-item{
  display:flex; gap:9px; padding:4px 0; font-size:.88rem; line-height:1.55;
  border-top:1px dotted var(--card-border);
}
.pl-item:first-child{ border-top:0; }
.pl-item-label{ flex:none; min-width:2.1em; font-weight:800; color:var(--text-muted); font-size:.8rem; padding-top:1px; }
.pl-item-text{ flex:1 1 auto; }
.pl-item-tense{
  font-size:.66rem; font-weight:800; color:var(--green);
  border:1px solid var(--green); padding:0 6px; border-radius:999px;
  margin-left:6px; white-space:nowrap; vertical-align:1px;
}
.pl-item-tense.is-inferred::after{ content:' ?'; opacity:.8; }

.pl-q-foot{ display:flex; align-items:center; gap:7px; flex-wrap:wrap; margin-top:8px; }
.pl-topic{
  font-size:.68rem; font-weight:800; color:var(--text-muted);
  background:var(--highlight-bg); border:1px solid var(--card-border);
  padding:1px 7px; border-radius:999px;
}
.pl-src{
  font-size:.66rem; font-weight:700; color:var(--text-muted);
  border:1px dotted var(--card-border); padding:1px 6px; border-radius:5px;
}
.pl-learn{
  font-family:inherit; font-size:.72rem; font-weight:800; cursor:pointer;
  padding:3px 9px; border-radius:999px; white-space:nowrap;
  background:var(--card-bg); color:var(--heading-color);
  border:1px solid var(--heading-color); transition:all .16s ease;
}
.pl-learn:hover{ background:var(--heading-color); color:#fff; }
.pl-answer{
  margin:8px 0 0; padding:9px 11px; border-radius:9px;
  background:var(--box-gold-bg); border:1px solid var(--box-gold-border);
  font-size:.86rem; line-height:1.55;
}
.pl-answer[hidden]{ display:none !important; }

.pl-done{
  font-family:inherit; font-size:.72rem; font-weight:800; cursor:pointer;
  padding:3px 10px; border-radius:999px; white-space:nowrap;
  background:var(--card-bg); color:var(--text-muted);
  border:1px solid var(--card-border); transition:all .16s ease;
}
.pl-done:hover{ border-color:var(--green); color:var(--green); }
.pl-q.is-done{ border-left-color:var(--green); }
.pl-q.is-done .pl-done{ background:var(--green); border-color:var(--green); color:#fff; }
.pl-q.is-done .pl-q-instr{ opacity:.72; }

/* exam focus: everything but the section in view steps back */
body.pl-focus .pl-section{ transition:opacity .35s ease, filter .35s ease; }
body.pl-focus .pl-section:not(.is-current){ opacity:.34; filter:saturate(.5); }

/* sidebar rows, reusing the deck's own .sb-item */
.sb-item.pl-sb-sec{ font-weight:800; }

.pl-empty{
  margin:30px 0; padding:22px; text-align:center; border-radius:14px;
  background:var(--card-bg); border:1px dashed var(--card-border); color:var(--text-muted);
}
.pl-empty strong{ color:var(--text-main); }

@media (max-width: 820px){
  .pl-rail{ position:static; }
  .pl-panel{ display:none !important; }
  .pl-drill{ display:flex; }
  .pl-filter > .pl-chip{ display:none; }
}
@media (prefers-reduced-motion: reduce){
  .pl-q, .pl-ring .pl-ring-fg{ transition:none !important; }
  .pl-q{ opacity:1; transform:none; }
}
@media print{
  .pl-rail, .pl-active, .sidebar, .topbar{ display:none !important; }
  .pl-q{ opacity:1 !important; transform:none !important; break-inside:avoid; }
}
`;

/* ------------------------------------------------------------------ *
 *  MARKUP
 * ------------------------------------------------------------------ */
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function qHTML(p, sec, q){
  /* data-topics carries the leaf AND every tense found in the question's items,
     because that is what the filter reads. Without the item tenses, choosing
     "Futur Simple" would match nothing -- the tense is a property of the item,
     not of the instruction. */
  const keys = new Set(q.topics.map(t => t.key));
  q.items.forEach(i => (i.topics || []).forEach(t => keys.add(t.key)));

  const out = [];
  out.push('<article class="pl-q' + (q.isContainer ? ' is-head' : '') + '"' +
    ' id="' + esc(q.id) + '"' +
    ' data-paper="' + esc(p.id) + '" data-section="' + esc(sec.id) + '"' +
    ' data-group="Section ' + esc(sec.id) + '" data-item="' + esc(q.num) + '"' +
    ' data-topics="' + esc([...keys].join(' ')) + '"' +
    ' data-marks="' + (q.marks || 0) + '">');

  out.push('<div class="pl-q-top">');
  out.push('<span class="pl-q-num">' + esc(q.num) + '</span>');
  out.push('<span class="q-tag">' + esc(p.badge) + '</span>');
  if (q.isAlternative) out.push('<span class="pl-alt">ou</span>');
  if (q.marks) out.push('<span class="pl-marks">' + q.marks + (q.marks === 1 ? ' mark' : ' marks') +
    (q.tally ? ' · ' + esc(q.tally) : '') + '</span>');
  if (q.choose) out.push('<span class="pl-choose">any ' + q.choose + '</span>');
  out.push('</div>');

  if (q.instruction) out.push('<p class="pl-q-instr">' + esc(q.instruction) + '</p>');

  if (q.items.length){
    out.push('<ul class="pl-items">');
    q.items.forEach(it => {
      const tn = (it.topics || [])[0];
      out.push('<li class="pl-item"><span class="pl-item-label">(' + esc(it.label) + ')</span>' +
        '<span class="pl-item-text">' + esc(it.text) +
        (tn ? '<span class="pl-item-tense' + (tn.confidence === 'inferred' ? ' is-inferred' : '') +
              '" title="' + esc(
                tn.confidence === 'certain'  ? 'The paper names this tense' :
                tn.confidence === 'confirmed' ? 'Read from the sentence and confirmed by your teacher' :
                                                'Read from the sentence — not yet confirmed')
              + '">' + esc(tn.label) + '</span>' : '') +
        '</span></li>');
    });
    out.push('</ul>');
  }

  if (q.answer) out.push('<div class="pl-answer" hidden><strong>Réponse :</strong> ' + esc(q.answer) + '</div>');

  out.push('<div class="pl-q-foot">');
  q.topics.forEach(t => out.push('<span class="pl-topic">' + esc(t.label) + '</span>'));
  if (!q.isContainer && q.marks) out.push('<button type="button" class="pl-done" aria-pressed="false">✓ Done</button>');
  if (q.answer) out.push('<button type="button" class="pl-chip pl-show-answer">Show answer</button>');
  if ((q.flags || []).indexOf('read-from-pdf') !== -1)
    out.push('<span class="pl-src" title="Not in the PDF text layer — read from page ' +
      esc(q.page) + ' of the original">read from the paper, p.' + esc(q.page) + '</span>');
  out.push('</div>');

  out.push('</article>');
  return out.join('');
}

module.exports.HTML = function (papers){
  const out = [];
  papers.forEach(p => {
    out.push('<section class="pl-paper" data-paper="' + esc(p.id) + '" data-year="' + p.year + '">');
    out.push('<div class="pl-paper-head">');
    out.push('<h2>' + esc(p.badge) + '</h2>');
    out.push('<span class="pl-paper-meta">' + p.marks + ' marks · ' + esc(p.duration) +
      (p.series ? ' · ' + esc(p.series) : '') + (p.scope ? ' · ' + esc(p.scope) : '') + '</span>');
    if (p.note) out.push('<p class="pl-paper-note">' + esc(p.note) + '</p>');
    out.push('</div>');
    p.sections.forEach(sec => {
      out.push('<div class="pl-section" data-section="' + esc(sec.id) + '" data-paper="' + esc(p.id) + '">');
      out.push('<div class="pl-section-head"><h3>Section ' + esc(sec.id) + ' · ' + esc(sec.name) + '</h3>' +
        (sec.marks ? '<span class="pl-sec-marks">' + sec.marks + ' marks</span>' : '') + '</div>');
      sec.questions.forEach(q => out.push(qHTML(p, sec, q)));
      out.push('</div>');
    });
    out.push('</section>');
  });
  return out.join('\n');
};

module.exports.qHTML = qHTML;

/* ------------------------------------------------------------------ *
 *  ENGINE
 * ------------------------------------------------------------------ */
module.exports.JS = `
(function papersModule(){
  const PAPERS = window.PAPERS || [];
  const TREE   = window.TAXONOMY || [];
  const TENSES = window.TENSES || [];
  if (!PAPERS.length) return;
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const page = $('#plPage');
  if (!page) return;

  const leafOf = k => { for (const g of TREE){ const l = g.leaves.find(x => x.key === k); if (l) return { g, l }; } return null; };
  const tenseOf = k => TENSES.find(t => t.key === k) || null;

  /* every question element, with its keys resolved once */
  const qEls = $$('.pl-q').map(el => ({
    el,
    paper: el.dataset.paper,
    marks: Number(el.dataset.marks) || 0,
    keys: new Set((el.dataset.topics || '').split(' ').filter(Boolean)),
    isHead: el.classList.contains('is-head')
  }));
  PAPERS.forEach(p => p.sections.forEach(s => s.questions.forEach(q => {
    if (!q.isContainer) return;
    const head = qEls.find(x => x.el.id === q.id);
    if (!head) return;
    head.kids = qEls.filter(x => x.el.dataset.paper === p.id &&
      x.el.dataset.item && x.el.dataset.item.indexOf(q.num + '(') === 0);
  })));

  /* One filter, two ways of choosing it. state.key is a leaf or a tense; nothing
     else is ever filtered on, so the panel and the rail cannot disagree.
     (No backticks in this file's JS string -- it is itself a template literal.) */
  const state = { key: null, papers: new Set(PAPERS.map(p => p.id)) };

  /* ---------------- filtering ---------------- */
  function apply(){
    let shown = 0, marks = 0;
    qEls.forEach(q => {
      let on = state.papers.has(q.paper);
      if (on && state.key) on = q.keys.has(state.key);
      if (on && q.isHead && q.kids && q.kids.length)
        on = q.kids.some(k => state.papers.has(k.paper) && (!state.key || k.keys.has(state.key)));
      q.el.classList.toggle('is-out', !on);
      q.el.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on && !q.isHead){ shown++; marks += q.marks; }
    });
    $$('.pl-section').forEach(sec => { sec.hidden = !$$('.pl-q', sec).some(e => !e.classList.contains('is-out')); });
    $$('.pl-paper').forEach(pp => { pp.hidden = !$$('.pl-section', pp).some(s => !s.hidden); });

    const empty = $('#plEmpty');
    if (empty){
      empty.hidden = shown > 0;
      if (!shown && state.key){
        const t = tenseOf(state.key), lf = leafOf(state.key);
        const name = t ? t.label : (lf ? lf.l.label : state.key);
        empty.innerHTML = '<strong>' + name + '</strong> is on the syllabus, but none of these ten papers asks it.';
      }
    }
    setRing(marks);
    const c = $('#plCount');
    if (c) c.textContent = shown + (shown === 1 ? ' question' : ' questions');
    renderActive(shown);
    renderPanel();
    renderDrill();
    renderSidebar();
    onScroll();
  }

  /* ---------------- the filter, spelled out with its marks ---------------- */
  function renderActive(shown){
    const box = $('#plActive');
    if (!box) return;
    if (!state.key){ box.hidden = true; return; }
    const t = tenseOf(state.key), lf = leafOf(state.key);
    const label = t ? t.label : (lf ? lf.l.label : state.key);
    const group = t ? 'Grammaire · Les Verbes' : (lf ? lf.g.label : '');
    /* The marks a student should expect for this topic. Tenses do not carry their
       own allotment -- they are items inside a verbs question -- so Les Verbes'
       figure is shown for them. */
    const marks = t ? (leafOf('gr-verbes') || { l:{} }).l.marks : (lf ? lf.l.marks : null);
    const year  = t ? (leafOf('gr-verbes') || { l:{} }).l.marksYear : (lf ? lf.l.marksYear : null);
    box.hidden = false;
    box.innerHTML =
      '<h3>' + label + '</h3>' +
      (group ? '<span class="pl-n">' + group + '</span>' : '') +
      (marks ? '<span class="pl-marks-big">' + marks + ' marks' + (year ? ' · ' + year + ' pattern' : '') + '</span>' : '') +
      (function(){
        const np = new Set(qEls.filter(q => !q.isHead && !q.el.classList.contains('is-out'))
          .map(q => q.paper)).size;
        return '<span class="pl-n">' + shown + (shown === 1 ? ' question' : ' questions') +
               ' across ' + np + (np === 1 ? ' paper' : ' papers') + '</span>';
      })() +
      '<button type="button" class="pl-clear">Clear filter</button>';
    const c = $('.pl-clear', box);
    if (c) c.addEventListener('click', () => choose(null));
  }

  function choose(key){
    state.key = (state.key === key) ? null : key;
    apply();
    const p = $('#plPanel');
    if (p) p.hidden = true;
    page.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------- the syllabus panel ---------------- */
  let openGroup = 'grammaire', verbsOpen = false;
  function renderPanel(){
    const panel = $('#plPanel');
    if (!panel) return;
    const h = [];
    TREE.forEach(g => {
      const total = g.leaves.reduce((n, l) => n + l.count, 0);
      h.push('<div class="pl-grp' + (openGroup === g.key ? ' is-open' : '') + '" data-g="' + g.key + '">');
      h.push('<button type="button" class="pl-grp-btn" data-g="' + g.key + '">' + g.label +
        '<span class="pl-leaf-n">' + total + '</span><span class="pl-caret">▶</span></button>');
      h.push('<div class="pl-grp-body">');
      g.leaves.forEach(l => {
        const on = state.key === l.key;
        if (l.tenses){
          h.push('<div class="pl-leaf-wrap' + (verbsOpen ? ' is-open' : '') + '">');
          h.push('<button type="button" class="pl-leaf' + (on ? ' is-on' : '') + '" data-verbs="1" data-k="' + l.key + '">' +
            l.label + (l.marks ? '<span class="pl-leaf-marks">' + l.marks + ' marks</span>' : '') +
            '<span class="pl-leaf-n">' + l.count + '</span><span class="pl-caret">▶</span></button>');
          h.push('<div class="pl-tenses">');
          TENSES.forEach(t => h.push('<button type="button" class="pl-tense' +
            (state.key === t.key ? ' is-on' : '') + (t.legacy ? ' is-legacy' : '') +
            (t.count ? '' : ' is-empty') + '" data-k="' + t.key + '"' +
            (t.count ? '' : ' aria-disabled="true"') + '>' + t.label +
            '<span class="pl-n">' + (t.count || '0') + '</span></button>'));
          h.push('</div></div>');
        } else {
          h.push('<button type="button" class="pl-leaf' + (on ? ' is-on' : '') +
            (l.legacy ? ' is-legacy' : '') + (l.count ? '' : ' is-empty') + '" data-k="' + l.key + '">' +
            '<span>' + l.label + (l.hint ? '<span class="pl-leaf-hint">' + l.hint + '</span>' : '') + '</span>' +
            (l.marks ? '<span class="pl-leaf-marks">' + l.marks + ' marks</span>' : '') +
            '<span class="pl-leaf-n">' + l.count + '</span></button>');
        }
      });
      h.push('</div></div>');
    });
    panel.innerHTML = h.join('');

    $$('.pl-grp-btn', panel).forEach(b => b.addEventListener('click', () => {
      openGroup = (openGroup === b.dataset.g) ? null : b.dataset.g;
      renderPanel();
    }));
    $$('[data-verbs]', panel).forEach(b => b.addEventListener('click', ev => {
      /* clicking Les Verbes expands its tenses rather than filtering to all of
         them at once, which is the whole point of the nesting */
      ev.stopPropagation();
      verbsOpen = !verbsOpen;
      renderPanel();
    }));
    $$('.pl-leaf[data-k]:not([data-verbs]), .pl-tense[data-k]', panel).forEach(b =>
      b.addEventListener('click', () => choose(b.dataset.k)));
  }

  /* ---------------- the drill-down rail ---------------- */
  let drillLevel = null;   // null | group key | 'verbs'
  function renderDrill(){
    const box = $('#plDrill');
    if (!box) return;
    const h = [];
    if (!drillLevel){
      h.push('<span class="pl-crumb">Filtrer</span>');
      TREE.forEach(g => h.push('<button type="button" class="pl-chip" data-lvl="' + g.key + '">' +
        g.label + '<span class="pl-n">' + g.leaves.reduce((n, l) => n + l.count, 0) + '</span></button>'));
    } else if (drillLevel === 'verbs'){
      h.push('<button type="button" class="pl-chip" data-lvl="grammaire">‹</button>');
      h.push('<span class="pl-crumb">Grammaire › <b>Les Verbes</b></span>');
      TENSES.forEach(t => h.push('<button type="button" class="pl-chip' +
        (state.key === t.key ? ' is-on' : '') + (t.count ? '' : ' is-empty') +
        '" data-k="' + t.key + '">' + t.label + '<span class="pl-n">' + (t.count || '0') + '</span></button>'));
    } else {
      const g = TREE.find(x => x.key === drillLevel);
      h.push('<button type="button" class="pl-chip" data-lvl="">‹</button>');
      h.push('<span class="pl-crumb"><b>' + (g ? g.label : '') + '</b></span>');
      (g ? g.leaves : []).forEach(l => {
        if (l.tenses) h.push('<button type="button" class="pl-chip" data-lvl="verbs">' + l.label + ' ▸</button>');
        else h.push('<button type="button" class="pl-chip' + (state.key === l.key ? ' is-on' : '') +
          (l.count ? '' : ' is-empty') + '" data-k="' + l.key + '">' + l.label +
          '<span class="pl-n">' + l.count + '</span></button>');
      });
    }
    box.innerHTML = h.join('');
    $$('[data-lvl]', box).forEach(b => b.addEventListener('click', () => {
      drillLevel = b.dataset.lvl || null; renderDrill();
    }));
    $$('[data-k]', box).forEach(b => b.addEventListener('click', () => choose(b.dataset.k)));
  }

  /* ---------------- the marks budget ---------------- */
  const DONE_KEY = 'cbse_fr_master_paper_done';
  let done = new Set();
  try { done = new Set(JSON.parse(localStorage.getItem(DONE_KEY) || '[]')); } catch (e){}
  const saveDone = () => { try { localStorage.setItem(DONE_KEY, JSON.stringify([...done])); } catch (e){} };

  const RING = 2 * Math.PI * 18;
  function setRing(shownMarks){
    let doneMarks = 0;
    qEls.forEach(q => {
      if (q.isHead || q.el.classList.contains('is-out')) return;
      if (done.has(q.el.id)) doneMarks += q.marks;
    });
    const pct = shownMarks ? Math.min(1, doneMarks / shownMarks) : 0;
    const fg = $('#plRingFg');
    if (fg){ fg.style.strokeDasharray = RING; fg.style.strokeDashoffset = RING * (1 - pct); }
    const t = $('#plRingTxt');
    if (t) t.innerHTML = doneMarks + ' <small>of ' + shownMarks + ' marks done</small>';
  }
  function paintDone(){
    qEls.forEach(q => {
      const on = done.has(q.el.id);
      q.el.classList.toggle('is-done', on);
      const b = q.el.querySelector('.pl-done');
      if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------------- reveal on scroll ----------------
     A sweep, not an IntersectionObserver: IO only reports elements whose state it
     saw change, so jumping down the page left skipped questions stuck invisible,
     and it does not run at all in a tab the browser has stopped painting. */
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pending = [];
  function scroller(el){
    for (let n = el.parentElement; n; n = n.parentElement){
      const ov = getComputedStyle(n).overflowY;
      if ((ov === 'auto' || ov === 'scroll') && n.scrollHeight > n.clientHeight + 4) return n;
    }
    return null;
  }
  const ROOT = scroller(page);
  function viewport(){
    if (!ROOT) return { top: 0, bottom: innerHeight };
    const r = ROOT.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom };
  }
  function sweep(){
    if (!pending.length) return;
    const v = viewport();
    const line = v.bottom - (v.bottom - v.top) * 0.06;
    let n = 0;
    pending = pending.filter(el => {
      if (el.classList.contains('is-out')) return true;
      if (el.getBoundingClientRect().top > line) return true;
      el.style.transitionDelay = REDUCED ? '0ms' : Math.min(n++, 6) * 55 + 'ms';
      el.classList.remove('pl-pre');
      el.classList.add('is-in');
      return false;
    });
  }
  let current = null;
  function markCurrent(){
    const v = viewport();
    let best = null, bestArea = 0;
    $$('.pl-section').forEach(s => {
      if (s.hidden) return;
      const r = s.getBoundingClientRect();
      const area = Math.min(r.bottom, v.bottom) - Math.max(r.top, v.top);
      if (area > bestArea){ bestArea = area; best = s; }
    });
    if (!best || bestArea <= 0 || best === current) return;
    if (current) current.classList.remove('is-current');
    current = best; current.classList.add('is-current');
    const id = current.dataset.paper + '|' + current.dataset.section;
    $$('.sb-item.pl-sb-sec').forEach(b => b.classList.toggle('active', b.dataset.sec === id));
  }
  let raf = 0;
  function onScroll(){
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; sweep(); markCurrent(); });
  }
  function observe(){
    pending = $$('.pl-q');
    pending.forEach(el => el.classList.add('pl-pre'));
    (ROOT || window).addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    sweep(); markCurrent();
    setTimeout(() => { sweep(); markCurrent(); }, 120);
  }

  /* ---------------- the sidebar: unchanged, the deck's own rows ---------------- */
  function renderSidebar(){
    const sb = $('#sidebar');
    if (!sb) return;
    const h = ['<div class="sb-title">Question Papers</div>'];
    PAPERS.forEach(p => {
      if (!state.papers.has(p.id)) return;
      const pe = $('.pl-paper[data-paper="' + p.id + '"]');
      if (pe && pe.hidden) return;
      h.push('<button class="sb-item" data-jump="' + p.id + '">' + p.badge + '</button>');
      p.sections.forEach(s => {
        const se = $('.pl-section[data-paper="' + p.id + '"][data-section="' + s.id + '"]');
        if (!se || se.hidden) return;
        const n = se.querySelectorAll('.pl-q:not(.is-out)').length;
        h.push('<button class="sb-item step pl-sb-sec" data-sec="' + p.id + '|' + s.id +
          '" data-jump="' + p.id + '|' + s.id + '">' + s.id + ' · ' + s.name +
          ' <span class="pl-n">' + n + '</span></button>');
      });
    });
    sb.innerHTML = h.join('');
    $$('[data-jump]', sb).forEach(b => b.addEventListener('click', () => {
      const parts = b.dataset.jump.split('|');
      const el = parts.length > 1
        ? $('.pl-section[data-paper="' + parts[0] + '"][data-section="' + parts[1] + '"]')
        : $('.pl-paper[data-paper="' + parts[0] + '"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  /* ---------------- the exam clock ---------------- */
  let clockLeft = 0, clockTimer = null;
  function fmt(s){
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(x).padStart(2, '0');
  }
  function tickClock(){
    const el = $('#plClock');
    if (!el) return;
    el.textContent = fmt(clockLeft);
    el.classList.toggle('is-low', clockLeft <= 300);
    if (clockLeft <= 0){ stopClock(); el.textContent = 'temps écoulé'; return; }
    clockLeft--;
  }
  function startClock(){
    const ids = [...state.papers];
    const p = PAPERS.find(x => x.id === ids[0]) || PAPERS[0];
    clockLeft = (/2\\s*hour/.test(p.duration) ? 2 : 3) * 3600;
    clearInterval(clockTimer);
    clockTimer = setInterval(tickClock, 1000);
    tickClock();
    document.body.classList.add('pl-focus');
    const b = $('#plClockBtn');
    if (b){ b.classList.add('is-on'); b.textContent = '■ Stop'; }
  }
  function stopClock(){
    clearInterval(clockTimer); clockTimer = null;
    document.body.classList.remove('pl-focus');
    const b = $('#plClockBtn');
    if (b){ b.classList.remove('is-on'); b.textContent = '▶ Exam mode'; }
    const el = $('#plClock'); if (el) el.classList.remove('is-low');
  }

  /* ---------------- the rail ---------------- */
  function buildRail(){
    const rail = $('#plRail');
    if (!rail) return;
    const h = [];
    h.push('<span class="pl-rail-label">Year</span><span class="pl-rail-row" id="plYears">');
    h.push('<button type="button" class="pl-chip is-on" data-year="all">All</button>');
    PAPERS.forEach(p => h.push('<button type="button" class="pl-chip" data-paper="' + p.id + '">' +
      p.year + (p.variant !== 'Annual' ? ' ' + p.variant.replace(' marks', 'm') : '') + '</button>'));
    h.push('</span><span class="pl-rail-sep"></span>');
    h.push('<span class="pl-filter"><button type="button" class="pl-chip" id="plFilterBtn">☰ Filtrer par sujet</button>' +
           '<div class="pl-panel" id="plPanel" hidden></div>' +
           '<span class="pl-drill" id="plDrill"></span></span>');
    h.push('<span class="pl-rail-sep"></span>');
    h.push('<div class="pl-ring"><svg viewBox="0 0 42 42" aria-hidden="true">' +
      '<circle class="pl-ring-bg" cx="21" cy="21" r="18"></circle>' +
      '<circle class="pl-ring-fg" id="plRingFg" cx="21" cy="21" r="18"></circle></svg>' +
      '<span class="pl-ring-txt" id="plRingTxt"></span></div>');
    h.push('<span class="pl-clock" id="plClock">—</span>');
    h.push('<button type="button" class="pl-chip" id="plClockBtn">▶ Exam mode</button>');
    h.push('<span class="pl-rail-sep"></span><span class="pl-rail-label" id="plCount"></span>');
    rail.innerHTML = h.join('');

    $$('[data-paper]', rail).forEach(b => b.addEventListener('click', () => {
      state.papers = new Set([b.dataset.paper]);
      $$('.pl-chip', $('#plYears')).forEach(x => x.classList.toggle('is-on', x === b));
      apply();
      const el = $('.pl-paper[data-paper="' + b.dataset.paper + '"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    const all = $('[data-year="all"]', rail);
    if (all) all.addEventListener('click', () => {
      state.papers = new Set(PAPERS.map(p => p.id));
      $$('.pl-chip', $('#plYears')).forEach(x => x.classList.toggle('is-on', x === all));
      apply();
    });
    const fb = $('#plFilterBtn');
    if (fb) fb.addEventListener('click', ev => {
      ev.stopPropagation();
      const p = $('#plPanel');
      if (p) p.hidden = !p.hidden;
    });
    document.addEventListener('click', ev => {
      const p = $('#plPanel');
      if (p && !p.hidden && !ev.target.closest('.pl-filter')) p.hidden = true;
    });
    const cb = $('#plClockBtn');
    if (cb) cb.addEventListener('click', () => (clockTimer ? stopClock() : startClock()));
  }

  /* ---------------- learn-this, answers, done ---------------- */
  document.addEventListener('click', ev => {
    const l = ev.target.closest && ev.target.closest('.pl-learn');
    if (l){
      const key = l.dataset.deck;
      if (window.Deck && window.topicByKey && window.topicByKey[key]){
        const t = window.topicByKey[key];
        if (t.indices && t.indices.length) window.Deck.slide(t.indices[0], 0);
      } else {
        l.textContent = 'opens ' + key + ' in the app';
        setTimeout(() => { l.textContent = 'Learn this →'; }, 1800);
      }
      return;
    }
    const a = ev.target.closest && ev.target.closest('.pl-show-answer');
    if (a){
      const box = a.closest('.pl-q').querySelector('.pl-answer');
      if (box){ box.hidden = !box.hidden; a.textContent = box.hidden ? 'Show answer' : 'Hide answer'; }
      return;
    }
    const d = ev.target.closest && ev.target.closest('.pl-done');
    if (d){
      const q = d.closest('.pl-q');
      if (done.has(q.id)) done.delete(q.id); else done.add(q.id);
      saveDone(); paintDone(); apply();
    }
  });

  buildRail();
  paintDone();
  observe();
  apply();
})();
`;
