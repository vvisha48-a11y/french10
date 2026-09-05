// CSS for Les Messages. Its own module, like retenir.js exports RETENIR_CSS, so the
// generator and any in-place patcher import one string and cannot ship a partial sheet.
//
// Only classes prefixed msg- are defined here. Everything shared (.ls-*, .rt-*, .box,
// .slide-card, .quiz-container) already ships in b-style.html and is reused untouched.
//
// Colours are theme variables only. A literal hex would look right in theme-classic and
// wrong in the other six.

module.exports.MESSAGE_CSS = `/* ===== LES MESSAGES ===== */
.msg-lead{ font-size:clamp(.95rem,1.9vh,1.25rem); color:var(--text-muted); margin:0 0 clamp(8px,1.2vh,14px); text-align:center; }

/* The message paper has its OWN scale. A message is 30-50 words where a letter is 80+,
   so it is set far larger; --msg-fs is solved per slide by fitMessage() and the upper
   clamp is 2.9rem, not the letter's 2rem, or every message would hit the ceiling and
   render identically with half the card empty. */
.msg-paper{
  width:100%; max-width:1180px; margin:0 auto; text-align:left;
  background:var(--box-blue-bg); border:2px solid var(--card-border);
  border-left:6px solid var(--heading-color); border-radius:14px;
  padding:clamp(14px,2.2vh,30px) clamp(18px,2.4vw,38px);
  /* min-height:0 + flex:0 1 auto made this the ONLY shrinkable item on the card, so the
     whole flex shrink landed here: the paper collapsed under its own text, which then
     spilled (overflow:visible) over everything below it. */
  min-width:0; min-height:auto; flex:0 0 auto;
}
.msg-paper p{ margin:0 0 clamp(6px,.9vh,12px); line-height:1.5;
  font-size:clamp(1rem, var(--msg-fs,2.6vh), 2.9rem); }
.msg-date{ text-align:right; color:var(--crimson); font-weight:700; }
.msg-sal { color:var(--purple); font-weight:700; }
.msg-body{ color:var(--text-main); }
.msg-close{ color:var(--green); font-weight:700; margin-top:clamp(8px,1.2vh,16px) !important; }
.msg-sig { color:var(--gold); font-weight:800; }
.msg-paper-sample{ background:var(--card-bg); border-left-color:var(--crimson); }

/* --- WIDGET 1: type switcher. Radio + :checked siblings, no JS. --- */
.msg-switch{ width:100%; max-width:1180px; margin:0 auto; min-width:0; }
.msg-sw-in{ position:absolute; opacity:0; pointer-events:none; width:0; height:0; }
.msg-sw-tabs{ display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-bottom:clamp(10px,1.4vh,16px); }
.msg-sw-tab{
  padding:clamp(7px,1vh,11px) clamp(14px,1.6vw,24px); border-radius:999px; cursor:pointer;
  border:2px solid var(--card-border); background:var(--card-bg); color:var(--text-main);
  font-weight:700; font-size:clamp(.85rem,1.7vh,1.1rem); transition:all .18s ease;
}
.msg-sw-tab:hover{ border-color:var(--heading-color); transform:translateY(-1px); }
.msg-sw-panel{ display:none; animation:msgFade .28s ease; }
#msgsw-inv:checked ~ .msg-sw-panel.msg-sw-inv,
#msgsw-acc:checked ~ .msg-sw-panel.msg-sw-acc,
#msgsw-ref:checked ~ .msg-sw-panel.msg-sw-ref{ display:block; }
#msgsw-inv:checked ~ .msg-sw-tabs label[for="msgsw-inv"],
#msgsw-acc:checked ~ .msg-sw-tabs label[for="msgsw-acc"],
#msgsw-ref:checked ~ .msg-sw-tabs label[for="msgsw-ref"]{
  background:var(--heading-color); border-color:var(--heading-color); color:#fff;
}
@keyframes msgFade{ from{ opacity:0; transform:translateY(6px); } to{ opacity:1; transform:none; } }
.msg-fix{ opacity:.55; }
.msg-var{ background:var(--box-gold-bg); border-radius:6px; padding:2px 8px; }
.msg-key{ margin-top:clamp(8px,1.2vh,14px); font-size:clamp(.8rem,1.5vh,1rem); color:var(--text-muted); text-align:center; }
.msg-k{ display:inline-block; width:14px; height:14px; border-radius:4px; vertical-align:-2px; margin-right:4px; }
.msg-k-fix{ background:var(--card-border); }
.msg-k-var{ background:var(--box-gold-bg); border:1px solid var(--gold); }

/* --- WIDGET 2: hotspots. Checkbox + :checked sibling, no JS. --- */
.msg-hot{ width:100%; max-width:1100px; margin:0 auto; text-align:left; min-width:0; }
.msg-hot-in{ position:absolute; opacity:0; pointer-events:none; width:0; height:0; }
.msg-hot-row{ margin-bottom:clamp(6px,.9vh,10px); }
.msg-hot-line{
  display:block; cursor:pointer; border-radius:9px; padding:clamp(6px,.9vh,11px) clamp(10px,1.2vw,16px);
  border:2px dashed var(--card-border); background:var(--card-bg);
  font-size:clamp(.95rem,2vh,1.5rem); transition:all .18s ease;
}
.msg-hot-line:hover{ border-color:var(--heading-color); background:var(--highlight-bg); }
.msg-hot-line::after{ content:' \\2304'; color:var(--text-muted); font-size:.8em; }
.msg-hot-why{
  display:none; margin:6px 0 0; padding:clamp(8px,1.1vh,13px) clamp(12px,1.4vw,18px);
  background:var(--box-blue-bg); border-left:4px solid var(--heading-color); border-radius:0 9px 9px 0;
  font-size:clamp(.85rem,1.7vh,1.15rem); color:var(--text-main);
}
.msg-hot-in:checked + .msg-hot-row .msg-hot-why{ display:block; animation:msgFade .22s ease; }
.msg-hot-in:checked + .msg-hot-row .msg-hot-line{ border-style:solid; border-color:var(--heading-color); }
.msg-hot-in:checked + .msg-hot-row .msg-hot-line::after{ content:' \\2303'; }

/* --- WIDGET 3: message builder. The only widget that needs the engine. --- */
.msg-build{ width:100%; max-width:1100px; margin:0 auto; min-width:0; }
.msg-build-pool{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:clamp(10px,1.4vh,16px); }
.msg-chip{
  padding:clamp(7px,1vh,11px) clamp(12px,1.4vw,18px); border-radius:10px; cursor:pointer;
  border:2px solid var(--card-border); background:var(--card-bg); color:var(--text-main);
  font-family:inherit; font-size:clamp(.85rem,1.7vh,1.1rem); text-align:left; transition:all .18s ease;
}
.msg-chip:hover{ border-color:var(--heading-color); transform:translateY(-2px); }
.msg-chip.used{ opacity:.32; pointer-events:none; }
.msg-build-slots{ list-style:none; counter-reset:msgslot; padding:0; margin:0; text-align:left; }
.msg-build-slots li{
  counter-increment:msgslot; position:relative; margin-bottom:6px; border-radius:9px;
  padding:clamp(7px,1vh,11px) clamp(12px,1.4vw,18px) clamp(7px,1vh,11px) 44px;
  border:2px solid var(--card-border); background:var(--card-bg);
  font-size:clamp(.85rem,1.7vh,1.1rem);
}
.msg-build-slots li::before{
  content:counter(msgslot); position:absolute; left:12px; top:50%; transform:translateY(-50%);
  width:22px; height:22px; border-radius:50%; background:var(--heading-color); color:#fff;
  font-size:.78rem; font-weight:800; display:flex; align-items:center; justify-content:center;
}
.msg-build-slots li.ok{ border-color:var(--green); background:var(--box-blue-bg); }
.msg-build-slots li.no{ border-color:var(--crimson); }
.msg-build-msg{ margin-top:10px; font-weight:700; min-height:1.4em; font-size:clamp(.85rem,1.7vh,1.1rem); }
.msg-build-msg.ok{ color:var(--green); }
.msg-build-msg.no{ color:var(--crimson); }

/* --- practice prompts --- */
.msg-prompt{ width:100%; max-width:1100px; margin:0 auto clamp(10px,1.4vh,16px); text-align:left; }
.msg-q-tag{
  display:inline-block; margin:0 0 8px; padding:3px 12px; border-radius:999px;
  background:var(--gold); color:#fff; font-size:clamp(.68rem,1.3vh,.85rem);
  font-weight:800; text-transform:uppercase; letter-spacing:.04em;
}
.msg-prompt-fr{ margin:0 0 6px; font-size:clamp(1rem,2.1vh,1.5rem); font-weight:700; color:var(--text-main); }
.msg-prompt-en{ margin:0; font-size:clamp(.85rem,1.7vh,1.15rem); color:var(--text-muted); font-style:italic; }
/* Pinned English toggle. Deliberately its own class and its own body flag —
   .let-toggle / body.letter-en belong to La Lettre and must not be touched. */
.msg-toggle{
  position:absolute; top:14px; right:18px; z-index:3;
  min-height:32px; padding:5px 16px; cursor:pointer; border-radius:999px;
  border:2px solid var(--heading-color); background:var(--card-bg);
  color:var(--heading-color); font-family:inherit; font-weight:700;
  font-size:clamp(.72rem,1.4vh,.9rem); white-space:nowrap;
}
.msg-toggle:hover{ background:var(--box-blue-bg); }
.msg-toggle:focus-visible{ outline:2px solid var(--crimson); outline-offset:2px; }
.msg-toggle[aria-pressed="true"]{ background:var(--heading-color); color:var(--card-bg); }
.msg-en{ display:none; }
body.messages-en .msg-en{ display:block; }
/* The English paper REPLACES the French one rather than stacking under it: the
   size solver budgets the card for a single paper, so showing both overflows. */
body.messages-en .msg-fr{ display:none; }
@media print{ .msg-toggle{ display:none !important; }
  /* on paper both are wanted; page breaks make the height moot */
  .msg-en{ display:block !important; } .msg-fr{ display:block !important; } }
.msg-reveal{ width:100%; max-width:1100px; margin:0 auto clamp(10px,1.4vh,16px); text-align:left; }
.msg-reveal summary{
  cursor:pointer; padding:clamp(7px,1vh,11px) clamp(14px,1.6vw,22px); border-radius:10px;
  border:2px solid var(--heading-color); background:var(--card-bg); color:var(--heading-color);
  font-weight:800; font-size:clamp(.85rem,1.7vh,1.1rem); list-style:none;
}
.msg-reveal summary::-webkit-details-marker{ display:none; }
.msg-reveal summary::before{ content:'\\25B8  '; }
.msg-reveal[open] summary::before{ content:'\\25BE  '; }
.msg-reveal[open] summary{ margin-bottom:10px; background:var(--heading-color); color:#fff; }

/* --- WIDGET 4: mark-scheme simulator. Checkbox reveal, no JS. --- */
.msg-mark{ width:100%; max-width:1100px; margin:0 auto; text-align:left; min-width:0; }
.msg-mk-in{ position:absolute; opacity:0; pointer-events:none; width:0; height:0; }
.msg-mk-row{ margin-bottom:6px; }
.msg-mk-crit{
  display:block; cursor:pointer; border-radius:9px; padding:clamp(7px,1vh,11px) clamp(12px,1.4vw,18px);
  border:2px solid var(--card-border); background:var(--card-bg);
  font-size:clamp(.85rem,1.7vh,1.1rem); font-weight:700; transition:all .18s ease;
}
.msg-mk-crit:hover{ border-color:var(--gold); }
.msg-mk-why{
  display:none; margin:6px 0 0; padding:clamp(8px,1.1vh,13px) clamp(12px,1.4vw,18px);
  background:var(--box-gold-bg); border-radius:9px;
  font-size:clamp(.85rem,1.7vh,1.1rem); color:var(--text-main);
}
.msg-mk-in:checked + .msg-mk-row .msg-mk-why{ display:block; animation:msgFade .22s ease; }
.msg-mk-got{ margin-right:8px; display:inline-block; padding:2px 10px; border-radius:999px;
  font-size:.8em; font-weight:800; background:var(--card-border); color:var(--text-main); }
.msg-mk-got.good{ background:var(--green); color:#fff; }
.msg-mk-got.mid { background:var(--gold); color:#fff; }
.msg-mk-got.low { background:var(--crimson); color:#fff; }

@media (max-width:1100px){
  .msg-sw-tabs{ flex-direction:column; }
  .msg-build-pool{ flex-direction:column; }
}
/* ===== END LES MESSAGES ===== */
`;
