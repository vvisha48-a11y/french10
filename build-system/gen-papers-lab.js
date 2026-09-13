// Build papers-lab.html -- the Phase 1 standalone page.
//
//   node gen-papers-lab.js
//
// The point of assembling it rather than hand-writing it: the stylesheet is
// lifted VERBATIM out of b-style.html, so the lab cannot drift from the real
// app's design language. If a token changes in the deck, it changes here on the
// next run. The module's own CSS, page markup, data script and engine come from
// papers-ui.js -- the same strings gen-papers-slide.js puts into the deck.
const fs = require('fs');
const path = require('path');

const SP  = __dirname;
const UI  = require('./papers-ui.js');
const OUT = 'C:/claude/10 th/papers-lab.html';

/* ---- the deck's own stylesheet, taken from between its <style> tags ---- */
const bstyle = fs.readFileSync(path.join(SP, 'b-style.html'), 'utf8');
const open = bstyle.indexOf('<style>');
const close = bstyle.indexOf('</style>', open);
if (open < 0 || close < 0){ console.error('b-style.html: could not find the app stylesheet'); process.exit(1); }
const APP_CSS = bstyle.slice(open + 7, close);
if (APP_CSS.indexOf('--heading-color') === -1){
  console.error('b-style.html: the extracted block does not look like the theme stylesheet');
  process.exit(1);
}

/* ---- the papers ---- */
const dataFile = path.join(SP, 'paperdata.js');
if (!fs.existsSync(dataFile)){ console.error('paperdata.js missing -- run gen-papers.js first'); process.exit(1); }
const { PAPERS, TAXONOMY, TENSES } = require(dataFile);
/* The data goes in through UI.DATA(): plain window assignments, byte-for-byte the
   script the deck ships. */

const THEMES = ['classic','cyber','slate','sunrise','emerald','purple','minimal'];

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CBSE Board Exam Question Papers</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
${APP_CSS}
${UI.CSS}
/* ---- lab shell only. In the deck this is a slide inside .reveal-shell, so
        none of the following ships in Phase 2. ----

   b-style.html line 104 pins html and body to 100vw/100vh with overflow:hidden,
   which is exactly right for a fixed-viewport presentation and fatal for a page
   the reader has to scroll: the wheel did nothing. The lab undoes it here.
   In the deck itself nothing needs undoing -- .slide-card is already
   overflow-y:auto, so the module scrolls inside its own slide. */
html, body{ width:auto; height:auto; overflow:visible; }
body{
  margin:0; min-height:100vh; background:var(--bg-gradient); background-attachment:fixed;
  color:var(--text-main); font-family:var(--custom-font-family);
  padding-top:var(--topbar-h);
}
.pl-shell{ padding:18px 16px 0; margin-right:var(--sidebar-w); }
/* The lab's header is position:fixed, so the sticky rail has to stop below it.
   Inside the deck the module scrolls within .slide-card, which starts under the
   header already, and the module's own top:0 is correct there. */
.pl-rail{ top:calc(var(--topbar-h) + 10px); }
body.sidebar-hidden .pl-shell{ margin-right:0; }
.pl-lab-note{
  max-width:1040px; margin:0 auto 14px; padding:9px 14px; border-radius:12px;
  font-size:.76rem; line-height:1.55; color:var(--text-muted);
  background:var(--card-bg); border:1px dashed var(--card-border);
}
@media (max-width: 820px){ .pl-shell{ margin-right:0; } .sidebar{ display:none; } }
</style>
</head>
<body class="theme-classic">

<header class="topbar">
  <span class="brand" style="font-family:var(--custom-heading-font); font-weight:900; color:var(--heading-color);">🇫🇷 Question Papers</span>
  <span class="tb-spacer"></span>
  <label class="tb-btn" style="display:flex; gap:6px; align-items:center;">
    Theme
    <select id="themeSel" style="font:inherit; background:transparent; color:inherit; border:0;">
      ${THEMES.map((t, i) => '<option value="' + t + '"' + (i ? '' : ' selected') + '>' + t + '</option>').join('\n      ')}
    </select>
  </label>
  <button class="tb-btn" id="sidebarBtn" type="button" title="Show / hide sidebar" aria-label="Show / hide sidebar" aria-controls="sidebar" aria-expanded="true">
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M15 4v16" stroke="currentColor" stroke-width="2"/>
      <rect class="sb-glyph-panel" x="15" y="4" width="6" height="16" rx="1" fill="currentColor"/>
    </svg>
  </button>
</header>

<aside class="sidebar" id="sidebar"></aside>

<div class="pl-shell">
  <p class="pl-lab-note"><strong>Phase 1 lab.</strong> The stylesheet is lifted verbatim from
  <code>b-style.html</code>, so this is the app's real design language, not a copy of it.
  Switch themes above to check all seven.</p>

${UI.PAGE(PAPERS)}
</div>

<script>
${UI.DATA(PAPERS, TAXONOMY, TENSES)}
</script>
<script>
/* lab-only chrome: theme switching and the sidebar toggle, so the module can be
   reviewed in every theme without the deck's engine present */
(function lab(){
  const sel = document.getElementById('themeSel');
  /* The artifact frame supplies its own <body>, so the theme class that the lab
     page carries in its markup is not there. Applying it at startup keeps both
     copies looking the same -- and if the reader's system asks for dark, open on
     one of the deck's own dark themes rather than forcing a white page on them.
     The deck's 7 themes stay the single source of colour either way. */
  /* indexOf, not a regex: this whole script is emitted from inside a template
     literal, where a "\\b" is read as a backspace escape long before it ever
     becomes a word boundary -- so the test never matched and the page ended up
     wearing two theme classes at once. */
  if (document.body.className.indexOf('theme-') === -1){
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    const start = dark ? 'slate' : (sel.value || 'classic');
    sel.value = start;
    document.body.classList.add('theme-' + start);
  }
  sel.addEventListener('change', () => {
    document.body.className = 'theme-' + sel.value;
  });
  document.getElementById('sidebarBtn').addEventListener('click', () => {
    const hidden = document.body.classList.toggle('sidebar-hidden');
    document.getElementById('sidebarBtn').setAttribute('aria-expanded', hidden ? 'false' : 'true');
  });
})();
</script>
<script>
${UI.JS}
</script>
<script>
/* In the deck the engine calls this when the Papers slide is current. The lab has
   no deck, so it activates once; null means the window is the scroller. */
window.PapersModule.activate(null);
</script>
</body>
</html>
`;

fs.writeFileSync(OUT, html);

/* ---- the same page as an Artifact ----
   claude.ai wraps an artifact in its own doctype/head/body, so that skeleton is
   stripped here rather than duplicated. The font <link> becomes an @import
   because there is no head of our own to put it in; fonts.googleapis.com is on
   the allowed list either way, and every family already declares a fallback. */
const ART = 'C:/claude/10 th/papers-artifact.html';
const body = html
  .slice(html.indexOf('<body'), html.lastIndexOf('</body>'))
  .replace(/^<body[^>]*>/, '');
const head = html.slice(html.indexOf('<style>') + 7, html.indexOf('</style>'));
const art = [
  '<title>CBSE Board Exam Question Papers</title>',
  '<style>',
  "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');",
  head,
  '/* the artifact frame supplies <body>, so the theme class goes on the root */',
  ':root{ color-scheme:light; }',
  '</style>',
  body
].join('\n');
fs.writeFileSync(ART, art);
console.log('  artifact copy    : ' + ART + '  (' + (art.length / 1024).toFixed(0) + ' KB)');
const qs = PAPERS.reduce((n, p) => n + p.sections.reduce((m, s) => m + s.questions.length, 0), 0);
console.log('  papers-lab.html  : ' + OUT);
console.log('  size             : ' + (html.length / 1024).toFixed(0) + ' KB');
console.log('  stylesheet       : ' + (APP_CSS.length / 1024).toFixed(0) + ' KB lifted verbatim from b-style.html');
console.log('  module css/js    : ' + (UI.CSS.length / 1024).toFixed(1) + ' KB / ' + (UI.JS.length / 1024).toFixed(1) + ' KB');
console.log('  papers rendered  : ' + PAPERS.length + ', ' + qs + ' question blocks');
console.log('  themes to test   : ' + THEMES.join(', '));
