// The Question Papers module: CSS, markup and engine.
//
// Exported as strings, the same way topbar.js and msg-css.js are, so Phase 1's
// standalone lab (gen-papers-lab.js) and Phase 2's in-deck module share one
// source and cannot drift apart.
//
// Design rules this obeys, because the deck enforces them:
//   * Colour comes from the theme tokens defined on body.theme-* in b-style.html,
//     so all 7 themes keep working. Two deliberate exceptions, both about things
//     that must NOT follow the theme: the banner ground (#A66200, chosen so white
//     holds 4.81:1 -- var(--gold) would drop it to 1.7:1 on cyber), and the
//     illustration palette in papers-illustrations.js, which is artwork rather
//     than interface.
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
/* ---- the banner ----
   A fixed amber, not var(--gold): white on a true yellow is illegible (1.6:1,
   and 1.7:1 against the cyber theme gold). #A66200 holds white at 4.81:1 and
   renders identically under all seven themes, which is the point of hard-coding it. */
.pl-hero{
  margin:2px 0 12px; padding:20px 24px; border-radius:14px;
  background:#A66200; color:#fff;
  display:flex; align-items:center; flex-wrap:wrap; gap:12px;
}
.pl-hero h1{
  margin:0; color:#fff; text-wrap:balance; letter-spacing:-.01em;
  font-size:clamp(1.3rem, 3.2vw, 2rem); line-height:1.14;
}

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

/* ---- the persistent section nav ----
   Not a popover. It sits in the page between the banner and the rail, and
   choosing a topic never closes it: comparing two topics is one click each,
   which is the whole reason it stopped being a dropdown. */
.pl-nav{
  margin:0 0 10px; padding:10px; border-radius:14px;
  background:var(--card-bg); border:1px solid var(--card-border);
  box-shadow:0 6px 18px rgba(0,0,0,.06);
}
.pl-sec-row{ display:flex; flex-wrap:wrap; gap:8px; }
.pl-sec-btn{
  flex:1 1 190px; display:flex; align-items:center; gap:8px; cursor:pointer;
  font-family:var(--custom-heading-font); font-size:.84rem; font-weight:900;
  padding:10px 14px; border:1px solid var(--card-border); border-radius:11px;
  background:var(--highlight-bg); color:var(--heading-color); text-align:left;
  transition:background .18s ease, border-color .18s ease, color .18s ease;
}
.pl-sec-btn:hover{ border-color:var(--highlight-border); }
.pl-sec-btn.is-open{ background:var(--highlight-border); border-color:var(--highlight-border); color:#fff; }
.pl-sec-btn.is-open .pl-leaf-n{ color:#fff; }
/* the section whose questions are currently filtered, whether or not it is the
   expanded one -- the two states are independent and both need to be visible */
.pl-sec-btn.is-on{ box-shadow:inset 0 0 0 2px var(--green); }
.pl-sec-btn .pl-leaf-n{ margin-left:auto; }
.pl-sec-btn .pl-caret{ font-size:.64rem; opacity:.75; transition:transform .2s ease; }
.pl-sec-btn.is-open .pl-caret{ transform:rotate(90deg); }

.pl-nav-body{
  margin-top:10px; padding-top:10px; border-top:1px solid var(--card-border);
  display:grid; grid-template-columns:repeat(auto-fill, minmax(236px, 1fr)); gap:6px;
}
.pl-nav-body[hidden]{ display:none !important; }

.pl-leaf{
  width:100%; display:flex; align-items:baseline; gap:8px; cursor:pointer;
  font-family:inherit; font-size:.8rem; font-weight:700; text-align:left;
  padding:7px 10px; border:1px solid transparent; border-radius:9px;
  background:var(--highlight-bg); color:var(--text-main);
}
.pl-leaf:hover{ border-color:var(--highlight-border); }
.pl-leaf.is-on{ background:var(--highlight-border); color:#fff; border-color:var(--highlight-border); }
.pl-leaf.is-on .pl-leaf-marks, .pl-leaf.is-on .pl-leaf-n, .pl-leaf.is-on .pl-leaf-hint{ color:#fff; opacity:.85; }
.pl-leaf-n{ margin-left:auto; font-weight:800; font-size:.72rem; color:var(--text-muted); }
.pl-leaf-marks{ font-size:.7rem; font-weight:800; color:var(--gold); white-space:nowrap; }
.pl-leaf-hint{ display:block; font-size:.68rem; font-weight:600; color:var(--text-muted); margin-top:1px; }
.pl-leaf.is-legacy{ font-style:italic; }
.pl-leaf.is-empty{ opacity:.5; }

/* ---- Les Verbes: the label filters, the caret expands ----
   Two controls in one row, the way a tree widget behaves. Clicking the name
   isolates every verb question; clicking the chevron opens the tenses without
   touching the filter. */
.pl-leaf-wrap{ grid-column:1 / -1; }
.pl-verbs-row{ display:flex; align-items:stretch; border-radius:9px; background:var(--highlight-bg); }
.pl-verbs-row .pl-leaf{ border-radius:9px 0 0 9px; }
.pl-caret-btn{
  cursor:pointer; border:1px solid transparent; border-left:1px solid var(--card-border);
  background:transparent; color:var(--text-muted); padding:0 13px; border-radius:0 9px 9px 0;
  font-size:.7rem; line-height:1;
}
.pl-caret-btn:hover{ background:var(--card-bg); color:var(--heading-color); }
.pl-caret-btn .pl-caret{ display:inline-block; transition:transform .2s ease; }
.pl-caret-btn.is-open .pl-caret{ transform:rotate(90deg); }

/* the tenses, nested under Les Verbes */
.pl-tenses{ display:none; grid-template-columns:repeat(auto-fill, minmax(168px, 1fr)); gap:4px; padding:6px 4px 2px 20px; }
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
/* Resting state lowest 4.96:1 (sunrise). On hover the heading colour fills the pill;
   white on it measured 1.39:1 on cyber and 1.67:1 on slate, so the text takes the
   card colour instead -- lowest 4.69:1 (sunrise). */
.pl-learn:hover{ background:var(--heading-color); color:var(--card-bg); }
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

/* No separate narrow-screen widget any more: the button row simply wraps,
   which is why the drill-down rail could go. One filter UI, one state. */
@media (max-width: 820px){
  .pl-rail{ position:static; }
  .pl-sec-btn{ flex:1 1 142px; font-size:.76rem; padding:8px 11px; }
  .pl-nav-body{ grid-template-columns:1fr; }
  .pl-tenses{ grid-template-columns:repeat(auto-fill, minmax(146px, 1fr)); padding-left:10px; }
}
/* ---- answers ---- */
.pl-answer{
  margin:10px 0 0; padding:10px 12px; border-radius:10px;
  background:var(--sec-bg); border-left:4px solid var(--sec);
}
.pl-answer[hidden]{ display:none !important; }
.pl-answer-head{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:7px; }
.pl-answer-tag{
  font-family:var(--custom-heading-font); font-size:.6rem; font-weight:900;
  text-transform:uppercase; letter-spacing:.06em; padding:3px 8px; border-radius:999px;
}
/* The two tiers must never read alike: solid green for the official scheme, a
   dashed card-coloured chip for an answer modelled on its rules.
   Measured in all 7 themes on all four section grounds. These are small bold
   labels, so WCAG asks 4.5:1:
     officielle -- var(--card-bg) text on var(--green): lowest 4.69:1 (sunrise).
       White measured 1.74:1 on slate and 1.81:1 on cyber, where the green is
       light; the card colour turns dark or light with the theme.
     modele     -- var(--text-main) on a var(--card-bg) chip: lowest 9.65:1 (emerald). */
.pl-answer-tag.is-official{ background:var(--green); color:var(--card-bg); }
.pl-answer-tag.is-modele{ background:var(--card-bg); color:var(--text-main); border:1px dashed var(--card-border); }
.pl-answer-list{ list-style:none; margin:0; padding:0; display:grid; gap:5px; }
.pl-answer-list li{ display:flex; gap:8px; align-items:baseline; font-size:.86rem; line-height:1.5; }
.pl-ans-label{ font-weight:800; color:var(--sec); min-width:2.1em; }
.pl-ans-text{ flex:1; }
/* text-muted, not green: green measured 4.32:1 on sunrise. text-muted is lowest at
   4.72:1 (emerald) and keeps the citation quieter than the answer it cites. */
.pl-ans-src{
  display:inline-block; margin-left:7px; font-size:.62rem; font-weight:800;
  color:var(--text-muted); white-space:nowrap;
}
.pl-answer-text{ margin:0; font-size:.86rem; line-height:1.55; }
.pl-rubric{
  margin-top:9px; padding-top:8px; border-top:1px dashed var(--card-border);
  display:grid; gap:2px; font-size:.72rem; line-height:1.45; color:var(--text-muted);
}
.pl-rubric-head{
  font-family:var(--custom-heading-font); font-size:.63rem; font-weight:900;
  text-transform:uppercase; letter-spacing:.06em; color:var(--heading-color); margin-bottom:2px;
}
.pl-rubric-src{ margin-top:3px; font-weight:800; opacity:.75; }
/* the master toggle, at the right end of the sticky rail. Deliberately not
   position:fixed -- in the deck this page is a child of a scrolling .slide-card,
   and a fixed child escapes the card to float over every other slide. */
#plAllAns.is-on{ background:var(--green); border-color:var(--green); color:#fff; }
#plAllAns .pl-n{ opacity:.8; }

/* ---- the figure a Compréhension passage depends on ----
   Two kinds, and they must never look alike. .is-real is cropped from the
   original PDF and sits in a solid frame; .is-added is drawn by this app and
   wears a dashed frame plus a caption saying so. */
.pl-fig{ margin:0 0 16px; padding:10px; border-radius:12px; background:var(--sec-bg); }
.pl-fig img, .pl-fig svg{ display:block; width:100%; height:auto; border-radius:8px; }
.pl-fig.is-real{ border:1px solid var(--sec); }
.pl-fig.is-real img{ max-width:640px; margin:0 auto; background:#fff; }
.pl-fig.is-added{ border:2px dashed var(--sec); background:transparent; }
.pl-fig.is-added svg{ max-width:520px; margin:0 auto; }
.pl-fig figcaption{
  margin-top:8px; font-size:.7rem; font-weight:700; letter-spacing:.02em;
  color:var(--text-muted); display:flex; align-items:center; gap:6px; justify-content:center;
  text-align:center;
}
.pl-fig.is-added figcaption{ font-style:italic; }
.pl-fig-badge{
  font-family:var(--custom-heading-font); font-size:.6rem; font-weight:900;
  text-transform:uppercase; letter-spacing:.07em; padding:2px 7px; border-radius:999px;
  background:var(--sec); color:#fff; font-style:normal; white-space:nowrap;
}
.pl-fig.is-added .pl-fig-badge{ background:transparent; color:var(--sec); border:1px solid var(--sec); }

@media (prefers-reduced-motion: reduce){
  .pl-q, .pl-ring .pl-ring-fg{ transition:none !important; }
  .pl-q{ opacity:1; transform:none; }
}
@media print{
  .pl-rail, .pl-active{ display:none !important; }
  .pl-q{ opacity:1 !important; transform:none !important; break-inside:avoid; }
}
`;

/* ------------------------------------------------------------------ *
 *  MARKUP
 * ------------------------------------------------------------------ */
const { PHOTOS } = require('./papers-images.js');
const { ILLUS, CAPTION: ILLUS_CAPTION } = require('./papers-illustrations.js');
const { RUBRICS } = require('./paper-answers.js');
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const hasAnswer = q => !!(q.answer || (q.items || []).some(i => i.answer));

/* One answer box per question, laid out the way the marking scheme lays one out:
   the completed sentences in order, then the mark split where the task is open
   ended. Each answer says where it comes from -- the twelve the official scheme
   answers outright are badged and page-cited, the rest are labelled as modelled
   on its rules. The two must never read alike. */
function answerHTML(q){
  if (!hasAnswer(q)) return '';
  const rows = (q.items || []).filter(i => i.answer);
  /* A box can hold both tiers at once -- one item the scheme answers outright,
     its neighbours modelled on the scheme's rules. Show a tag for each tier that
     is actually present rather than picking one and misdescribing the other. */
  const tiers = rows.map(i => i.answerTier).concat(q.answer ? [q.answerTier] : []);
  const anyOfficial = tiers.indexOf('official') !== -1;
  const anyModele   = tiers.indexOf('official') === -1 || tiers.some(t => t !== 'official');
  const out = [];
  out.push('<div class="pl-answer" hidden>');
  out.push('<div class="pl-answer-head">');
  if (anyOfficial) out.push('<span class="pl-answer-tag is-official">Réponse officielle · barème 018/20</span>');
  if (anyModele)   out.push('<span class="pl-answer-tag is-modele">Réponse modèle (générée selon le barème CBSE)</span>');
  out.push('</div>');
  if (rows.length){
    out.push('<ul class="pl-answer-list">');
    rows.forEach(i => out.push('<li><span class="pl-ans-label">(' + esc(i.label) + ')</span>' +
      '<span class="pl-ans-text">' + esc(i.answer) +
      (i.answerTier === 'official' ?
        '<span class="pl-ans-src">barème 018/20, p.' + esc(i.answerPage) + '</span>' : '') +
      '</span></li>'));
    out.push('</ul>');
  }
  if (q.answer) out.push('<p class="pl-answer-text">' + esc(q.answer) + '</p>');
  const rub = q.answerRubric && RUBRICS[q.answerRubric];
  if (rub){
    out.push('<div class="pl-rubric"><span class="pl-rubric-head">Barème' +
      (rub.total ? ' · ' + rub.total + ' marks' : '') + '</span>' +
      rub.lines.map(l => '<span>' + esc(l) + '</span>').join('') +
      '<span class="pl-rubric-src">' + esc(rub.src) + '</span></div>');
  }
  out.push('</div>');
  return out.join('');
}

function qHTML(p, sec, q){
  /* data-topics carries the leaf AND every tense found in the question's items,
     because that is what the filter reads. Without the item tenses, choosing
     "Futur Simple" would match nothing -- the tense is a property of the item,
     not of the instruction. */
  const keys = new Set(q.topics.map(t => t.key));
  q.items.forEach(i => (i.topics || []).forEach(t => keys.add(t.key)));
  /* the section key too, so the nav's "Tout Grammaire" row filters to the whole
     section rather than matching nothing */
  q.topics.forEach(t => { if (t.group) keys.add(t.group); });

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

  out.push(answerHTML(q));

  out.push('<div class="pl-q-foot">');
  q.topics.forEach(t => out.push('<span class="pl-topic">' + esc(t.label) + '</span>'));
  /* The lesson that teaches this, where the deck has one (papers-taxonomy.js `deck`).
     The engine hands over navigation; in the lab the button only says where it goes. */
  const lesson = q.isContainer ? null : q.topics.find(t => t.deck);
  if (lesson) out.push('<button type="button" class="pl-learn" data-deck="' + esc(lesson.deck) + '"' +
    ' title="Open the lesson: ' + esc(lesson.label) + '">Learn this →</button>');
  if (!q.isContainer && q.marks) out.push('<button type="button" class="pl-done" aria-pressed="false">✓ Done</button>');
  if (hasAnswer(q)) out.push('<button type="button" class="pl-chip pl-show-answer">Voir la réponse</button>');
  if ((q.flags || []).indexOf('read-from-pdf') !== -1)
    out.push('<span class="pl-src" title="Not in the PDF text layer — read from page ' +
      esc(q.page) + ' of the original">read from the paper, p.' + esc(q.page) + '</span>');
  out.push('</div>');

  out.push('</article>');
  return out.join('');
}

/* A paper either prints a figure or it does not. Both cases render something, and
   the two are captioned in opposite directions so the difference is never subtle. */
function figHTML(paperId){
  const real = PHOTOS[paperId];
  if (real){
    return '<figure class="pl-fig is-real">' +
      '<img src="' + real.src + '" width="' + real.w + '" height="' + real.h + '"' +
      ' alt="' + esc(real.alt) + '" loading="lazy" decoding="async">' +
      '<figcaption><span class="pl-fig-badge">Document</span>' + esc(real.caption) + '</figcaption>' +
      '</figure>';
  }
  const add = ILLUS[paperId];
  if (!add) return '';
  return '<figure class="pl-fig is-added">' + add.svg +
    '<figcaption><span class="pl-fig-badge">Ajout</span>' + esc(ILLUS_CAPTION) + '</figcaption>' +
    '</figure>';
}

module.exports.HTML = function (papers){
  const out = [];
  papers.forEach(p => {
    out.push('<div class="pl-paper" role="region" aria-label="' + esc(p.badge) + '" data-paper="' + esc(p.id) + '" data-year="' + p.year + '">');
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
      /* the Compréhension passage's picture, real or plainly labelled as added */
      if (sec.id === 'A') out.push(figHTML(p.id));
      sec.questions.forEach(q => out.push(qHTML(p, sec, q)));
      out.push('</div>');
    });
    out.push('</div>');
  });
  return out.join('\n');
};

module.exports.qHTML = qHTML;

/* The whole page, shared by both hosts. The lab wraps it in its own chrome; the
   deck puts it inside a .slide-card. Neither keeps a copy of its own, so the two
   cannot drift -- check-papers.js compares the bytes. */
module.exports.PAGE = function (papers){
  return [
    '<div class="pl-page" id="plPage">',
    '<div class="pl-hero"><h1>CBSE Board Exam Question Papers</h1></div>',
    '<nav class="pl-nav" id="plNav" aria-label="Filtrer par section"></nav>',
    '<div class="pl-rail" id="plRail"></div>',
    '<div class="pl-active" id="plActive" hidden></div>',
    '<div id="plByPaper">',
    module.exports.HTML(papers),
    '</div>',
    '<div class="pl-empty" id="plEmpty" hidden>No question in these papers matches that topic.</div>',
    '</div>'
  ].join('\n');
};

/* The data, as plain assignments to window. The lab used to inline paperdata.js,
   whose top-level consts become global lexical bindings -- harmless on their own,
   a redeclaration error waiting to happen among a deck's many scripts. "</" is
   escaped so no question text can ever close the <script> it sits in. */
module.exports.DATA = function (papers, taxonomy, tenses){
  const j = v => JSON.stringify(v).replace(/<\//g, '<\\/');
  return 'window.PAPERS = ' + j(papers) + ';\n' +
         'window.TAXONOMY = ' + j(taxonomy) + ';\n' +
         'window.TENSES = ' + j(tenses) + ';';
};

/* ------------------------------------------------------------------ *
 *  ENGINE
 * ------------------------------------------------------------------ */
module.exports.JS = `
(function papersModule(){
  /* Nothing runs at load. A host calls activate(): the deck when the Papers slide
     is first current -- under Reveal's viewDistance the slide is display:none at
     page load, so nothing on it can be measured earlier -- and the lab once, with
     the window as its scroller. Everything that touches the page is wired in
     mount(), at the bottom. */
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  let PAPERS = [], TREE = [], TENSES = [];
  let page = null, qEls = [];
  let mounted = false, active = false;
  /* how "Learn this" reaches a lesson; the deck's engine hands it over in connect() */
  const host = { goTopic: null };

  const leafOf = k => { for (const g of TREE){ const l = g.leaves.find(x => x.key === k); if (l) return { g, l }; } return null; };
  const tenseOf = k => TENSES.find(t => t.key === k) || null;

  /* One filter, one menu. state.group is which section is expanded and is never
     cleared by choosing a topic -- that persistence is the requirement. state.key
     is what is filtered on: a group key, a leaf key or a tense key.
     (No backticks in this file's JS string -- it is itself a template literal.) */
  const CARET = '▶';
  const state = { key: null, group: 'grammaire', verbsOpen: false, papers: new Set() };

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
    renderNav();
    renderSidebar();
    countAnswers();
    paintAnswers();
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
    /* Deliberately does NOT close the menu. The nav is part of the page now, so
       comparing two topics is one click each instead of reopening a popover. */
    apply();
    scrollToEl(page);
  }

  /* ---------------- the persistent section nav ----------------
     One widget, always on screen. state.group is which section is expanded and
     survives every choice; state.key is the filter. Keeping them apart is what
     stops the menu vanishing when you use it. */
  function renderNav(){
    const nav = $('#plNav');
    if (!nav) return;
    const h = [];
    h.push('<div class="pl-sec-row">');
    TREE.forEach(g => {
      const total = g.leaves.reduce((n, l) => n + l.count, 0);
      h.push('<button type="button" class="pl-sec-btn' +
        (state.group === g.key ? ' is-open' : '') +
        (state.key === g.key ? ' is-on' : '') +
        '" data-g="' + g.key + '" aria-expanded="' + (state.group === g.key) + '">' +
        '<span class="pl-caret">' + CARET + '</span>' + g.label +
        '<span class="pl-leaf-n">' + total + '</span></button>');
    });
    h.push('</div>');

    const grp = TREE.find(x => x.key === state.group);
    h.push('<div class="pl-nav-body"' + (grp ? '' : ' hidden') + '>');
    if (grp){
      /* the section itself is a filter: everything in it, across all ten papers */
      h.push('<button type="button" class="pl-leaf' + (state.key === grp.key ? ' is-on' : '') +
        '" data-k="' + grp.key + '"><span>Tout ' + grp.label +
        '<span class="pl-leaf-hint">Toutes les questions de la section ' + grp.section + '</span></span>' +
        '<span class="pl-leaf-n">' + grp.leaves.reduce((n, l) => n + l.count, 0) + '</span></button>');
      grp.leaves.forEach(l => {
        if (l.tenses){
          h.push('<div class="pl-leaf-wrap' + (state.verbsOpen ? ' is-open' : '') + '">');
          h.push('<div class="pl-verbs-row">');
          /* the label filters ... */
          h.push('<button type="button" class="pl-leaf' + (state.key === l.key ? ' is-on' : '') +
            '" data-k="' + l.key + '"><span>' + l.label +
            '<span class="pl-leaf-hint">Toutes les questions de verbes, tous temps confondus</span></span>' +
            (l.marks ? '<span class="pl-leaf-marks">' + l.marks + ' marks</span>' : '') +
            '<span class="pl-leaf-n">' + l.count + '</span></button>');
          /* ... and the caret, a separate control, only expands */
          h.push('<button type="button" class="pl-caret-btn' + (state.verbsOpen ? ' is-open' : '') +
            '" data-verbs="1" aria-expanded="' + state.verbsOpen +
            '" aria-label="Afficher les temps"><span class="pl-caret">' + CARET + '</span></button>');
          h.push('</div>');
          h.push('<div class="pl-tenses">');
          TENSES.forEach(t => h.push('<button type="button" class="pl-tense' +
            (state.key === t.key ? ' is-on' : '') + (t.legacy ? ' is-legacy' : '') +
            (t.count ? '' : ' is-empty') + '" data-k="' + t.key + '"' +
            (t.count ? '' : ' aria-disabled="true"') + '>' + t.label +
            '<span class="pl-n">' + (t.count || '0') + '</span></button>'));
          h.push('</div></div>');
        } else {
          h.push('<button type="button" class="pl-leaf' + (state.key === l.key ? ' is-on' : '') +
            (l.legacy ? ' is-legacy' : '') + (l.count ? '' : ' is-empty') + '" data-k="' + l.key + '">' +
            '<span>' + l.label + (l.hint ? '<span class="pl-leaf-hint">' + l.hint + '</span>' : '') + '</span>' +
            (l.marks ? '<span class="pl-leaf-marks">' + l.marks + ' marks</span>' : '') +
            '<span class="pl-leaf-n">' + l.count + '</span></button>');
        }
      });
    }
    h.push('</div>');
    nav.innerHTML = h.join('');

    $$('.pl-sec-btn', nav).forEach(b => b.addEventListener('click', () => {
      state.group = (state.group === b.dataset.g) ? null : b.dataset.g;
      renderNav();
    }));
    $$('[data-verbs]', nav).forEach(b => b.addEventListener('click', ev => {
      ev.stopPropagation();
      state.verbsOpen = !state.verbsOpen;
      renderNav();
    }));
    $$('[data-k]', nav).forEach(b => b.addEventListener('click', () => choose(b.dataset.k)));
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
  /* The element that scrolls: the deck's .slide-card, handed in by activate(), or
     null in the lab, where the window scrolls. */
  let ROOT = null;
  /* Scroll ROOT itself instead of calling scrollIntoView. Inside Reveal that would
     also scroll the slides container -- overflow:hidden, but still scrollable from
     script -- and knock the whole deck out of alignment. The sticky rail is allowed
     for, so a target does not come to rest underneath it. */
  function scrollToEl(el){
    if (!el) return;
    if (!ROOT){ el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const rail = $('#plRail');
    const under = rail ? rail.offsetHeight + 10 : 0;
    const top = el.getBoundingClientRect().top - ROOT.getBoundingClientRect().top + ROOT.scrollTop - under;
    ROOT.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
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
    /* In the deck #sidebar belongs to the engine except while Papers is the
       current slide; the lab activates once and keeps it. */
    if (!active) return;
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
      scrollToEl(el);
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

  /* ---------------- answers ---------------- */
  let answersOpen = false;
  function paintAnswers(){
    const boxes = $$('.pl-q:not(.is-out) .pl-answer');
    boxes.forEach(b => { b.hidden = !answersOpen; });
    $$('.pl-show-answer').forEach(btn => {
      const box = btn.closest('.pl-q').querySelector('.pl-answer');
      btn.textContent = (box && !box.hidden) ? 'Masquer la réponse' : 'Voir la réponse';
    });
    const b = $('#plAllAns');
    if (b){
      b.classList.toggle('is-on', answersOpen);
      b.firstChild.nodeValue = answersOpen ? '☰ Masquer les réponses' : '☰ Réponses';
    }
  }
  /* how many of the questions now on screen actually carry an answer */
  function countAnswers(){
    const n = $$('.pl-q:not(.is-out)').filter(q => q.querySelector('.pl-answer')).length;
    const el = $('#plAnsN');
    if (el) el.textContent = n;
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
    h.push('<span class="pl-rail-sep"></span>');
    h.push('<div class="pl-ring"><svg viewBox="0 0 42 42" aria-hidden="true">' +
      '<circle class="pl-ring-bg" cx="21" cy="21" r="18"></circle>' +
      '<circle class="pl-ring-fg" id="plRingFg" cx="21" cy="21" r="18"></circle></svg>' +
      '<span class="pl-ring-txt" id="plRingTxt"></span></div>');
    h.push('<span class="pl-clock" id="plClock">—</span>');
    h.push('<button type="button" class="pl-chip" id="plClockBtn">▶ Exam mode</button>');
    h.push('<span class="pl-rail-sep"></span><span class="pl-rail-label" id="plCount"></span>');
    h.push('<button type="button" class="pl-chip" id="plAllAns">☰ Réponses<span class="pl-n" id="plAnsN"></span></button>');
    rail.innerHTML = h.join('');

    $$('[data-paper]', rail).forEach(b => b.addEventListener('click', () => {
      state.papers = new Set([b.dataset.paper]);
      $$('.pl-chip', $('#plYears')).forEach(x => x.classList.toggle('is-on', x === b));
      apply();
      const el = $('.pl-paper[data-paper="' + b.dataset.paper + '"]');
      scrollToEl(el);
    }));
    const all = $('[data-year="all"]', rail);
    if (all) all.addEventListener('click', () => {
      state.papers = new Set(PAPERS.map(p => p.id));
      $$('.pl-chip', $('#plYears')).forEach(x => x.classList.toggle('is-on', x === all));
      apply();
    });
    /* Follows the filter: it reveals answers on what is on screen, and nothing
       that the topic filter has taken out. */
    const aa = $('#plAllAns');
    if (aa) aa.addEventListener('click', () => {
      answersOpen = !answersOpen;
      paintAnswers();
    });
    const cb = $('#plClockBtn');
    if (cb) cb.addEventListener('click', () => (clockTimer ? stopClock() : startClock()));
  }

  /* ---------------- learn-this, answers, done ---------------- */
  function onClick(ev){
    const l = ev.target.closest && ev.target.closest('.pl-learn');
    if (l){
      const key = l.dataset.deck;
      if (host.goTopic) host.goTopic(key);
      else {
        l.textContent = 'Opens in the deck app';
        setTimeout(() => { l.textContent = 'Learn this →'; }, 1800);
      }
      return;
    }
    const a = ev.target.closest && ev.target.closest('.pl-show-answer');
    if (a){
      const box = a.closest('.pl-q').querySelector('.pl-answer');
      if (box){
        box.hidden = !box.hidden;
        a.textContent = box.hidden ? 'Voir la réponse' : 'Masquer la réponse';
      }
      return;
    }
    const d = ev.target.closest && ev.target.closest('.pl-done');
    if (d){
      const q = d.closest('.pl-q');
      if (done.has(q.id)) done.delete(q.id); else done.add(q.id);
      saveDone(); paintDone(); apply();
    }
  }

  /* ---------------- keyboard ----------------
     While the Papers slide is current, the scroll keys scroll its card. The deck's
     Reveal config asks wantsKey() before it handles a key and stands aside when the
     answer is yes; left and right still change slide. The lab has no ROOT, so it
     never claims a key and the browser scrolls the window as it always did. */
  /* keyCode first -- it is what Reveal reads, so on every real keyboard both sides
     agree -- and the key name as a fallback for input that reports no keyCode
     (some virtual keyboards and remote tools send none). Reveal ignores those
     events anyway, so claiming them takes nothing away from the deck. */
  const SCROLL_KEYS = { 32: 'page', 33: 'pageUp', 34: 'page', 35: 'end', 36: 'home', 38: 'up', 40: 'down' };
  const SCROLL_NAMES = { ' ': 'page', Spacebar: 'page', PageUp: 'pageUp', PageDown: 'page', End: 'end', Home: 'home', ArrowUp: 'up', ArrowDown: 'down' };
  const scrollKind = e => SCROLL_KEYS[e.keyCode] || SCROLL_NAMES[e.key] || null;
  function wantsKey(e){
    if (!active || !ROOT || !e) return false;
    if (e.altKey || e.ctrlKey || e.metaKey) return false;
    if (!scrollKind(e)) return false;
    const a = document.activeElement;
    if (a && (a.isContentEditable || a.tagName === 'INPUT' || a.tagName === 'SELECT' || a.tagName === 'TEXTAREA')) return false;
    /* Space on a focused button presses that button */
    const isSpace = e.keyCode === 32 || e.key === ' ' || e.key === 'Spacebar';
    if (isSpace && a && a.closest && a.closest('button, a, summary')) return false;
    return true;
  }
  function onKey(e){
    if (!wantsKey(e)) return;
    e.preventDefault();
    const k = scrollKind(e);
    const pageBy = ROOT.clientHeight * 0.85;
    if (k === 'home'){ ROOT.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (k === 'end'){ ROOT.scrollTo({ top: ROOT.scrollHeight, behavior: 'smooth' }); return; }
    const by = k === 'up' ? -60 : k === 'down' ? 60 : k === 'pageUp' ? -pageBy : (e.shiftKey ? -pageBy : pageBy);
    ROOT.scrollBy({ top: by, behavior: 'smooth' });
  }

  /* ---------------- mount: once, on the first activate() ---------------- */
  function mount(root){
    PAPERS = window.PAPERS || [];
    TREE   = window.TAXONOMY || [];
    TENSES = window.TENSES || [];
    page = $('#plPage');
    if (!PAPERS.length || !page) return false;
    ROOT = root || null;

    /* every question element, with its keys resolved once */
    qEls = $$('.pl-q').map(el => ({
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
    state.papers = new Set(PAPERS.map(p => p.id));

    /* Done ticks stored under an id that no longer exists are dropped. Before
       gen-papers.js was fixed, every split-out question in a paper shared one id,
       so a single tick credited all of them; this keeps such a tick from lingering.
       Ticks on real ids are untouched. */
    const live = new Set(qEls.map(q => q.el.id));
    const kept = [...done].filter(id => live.has(id));
    if (kept.length !== done.size){ done = new Set(kept); saveDone(); }

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    buildRail();
    paintDone();
    observe();
    mounted = true;
    return true;
  }

  window.PapersModule = {
    /* The deck calls this from updateHud() whenever Papers is the current slide;
       after the first call it only redraws the sidebar and re-sweeps. */
    activate(root){
      const first = !mounted;
      if (first && !mount(root)) return;
      active = true;
      if (first) apply();
      else { renderSidebar(); onScroll(); }
    },
    deactivate(){ active = false; },
    wantsKey: wantsKey,
    renderSidebar(){ renderSidebar(); },
    connect(o){ if (o && typeof o.goTopic === 'function') host.goTopic = o.goTopic; }
  };
})();
`;
