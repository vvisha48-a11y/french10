// Top bar redesign: SVG shield logo, Grammar/Letters nav, hamburger utility menu.
//
// Shared by the build-system patch and the monolith patch so both get identical code.
//
//   [Shield] [Grammar ▾] [Letters] [Search] [Pick Student] ···· [Teacher] [☰] [⚙]
//
// The six utility buttons are MOVED into the hamburger, never recreated: their ids
// and the engine handlers bound to them stay exactly as they were, which is what
// keeps check-refs.js green.

/* The old header, matched verbatim so the patch fails loudly if it ever changes. */
module.exports.OLD_HEADER = `<header class="topbar">
  <span class="brand">🇫🇷 French Grammar — Class 10</span>

  <div class="topic-menu-wrap">
    <button class="tb-btn" id="topicMenuBtn" title="Choose a grammar topic">📚 Topics ▾</button>
    <div class="topic-menu" id="topicMenu"></div>
  </div>

  <button class="tb-btn" id="searchBtn" title="Search a rule (Ctrl+K)">🔍 Search</button>
  <button class="tb-btn" id="pickStudentBtn" title="Pick a random student">🎲 Pick Student</button>

  <span class="tb-spacer"></span>

  <button class="tb-btn" id="modeBtn" title="Switch Teacher / Student (T)">👩‍🏫 Teacher</button>
  <button class="tb-btn" id="lightBtn" title="Light / Dark (L)">🌙</button>
  <button class="tb-btn" id="soundBtn" title="Turn sound on">🔇</button>
  <button class="tb-btn" id="projectorBtn" title="Projector / Fullscreen mode (P)">📺</button>
  <button class="tb-btn" id="printBtn" title="Print this topic">🖨️</button>
  <button class="tb-btn" id="sidebarBtn" title="Show / hide the menu">📑</button>
  <button class="tb-btn" id="shortcutsBtn" title="Keyboard shortcuts (?)">⌨️</button>
  <button class="tb-btn" id="settingsBtn" title="Customization (S)">⚙️</button>
</header>`;

/* The tricolore is a national flag, so its colours are literal hex on purpose —
   they must not re-tint with the theme. Everything else in the deck uses variables. */
const LOGO = `<svg class="brand-logo" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grammaire Française — Classe 10">
      <title>Grammaire Française — Classe 10</title>
      <defs>
        <clipPath id="brandInner">
          <path d="M28 30 Q28 20 40 20 L160 20 Q172 20 172 30 L172 140 Q172 190 100 222 Q28 190 28 140 Z"/>
        </clipPath>
        <path id="brandArc" d="M42 150 A 58 58 0 0 0 158 150"/>
      </defs>

      <!-- gold shield -->
      <path d="M20 24 Q20 10 36 10 L164 10 Q180 10 180 24 L180 142 Q180 198 100 234 Q20 198 20 142 Z" fill="#ffffff" stroke="#C9A227" stroke-width="9"/>

      <!-- tricolore panel inside -->
      <g clip-path="url(#brandInner)">
        <rect x="28" y="20" width="48" height="210" fill="#1B3B8F"/>
        <rect x="76" y="20" width="48" height="210" fill="#ffffff"/>
        <rect x="124" y="20" width="48" height="210" fill="#E4222E"/>
        <circle cx="100" cy="150" r="62" fill="#ffffff"/>
      </g>

      <!-- 10 -->
      <text x="100" y="86" text-anchor="middle" font-family="Outfit, Segoe UI, sans-serif" font-weight="900" font-size="52" fill="#1B3B8F">10</text>

      <!-- Eiffel Tower -->
      <path d="M100 96 L94 132 M100 96 L106 132 M96 112 L104 112 M91 132 L109 132" fill="none" stroke="#C9A227" stroke-width="3" stroke-linecap="round"/>

      <!-- laurel wreath -->
      <path d="M56 132 Q44 158 60 184 Q66 190 72 192" fill="none" stroke="#C9A227" stroke-width="4" stroke-linecap="round"/>
      <path d="M144 132 Q156 158 140 184 Q134 190 128 192" fill="none" stroke="#C9A227" stroke-width="4" stroke-linecap="round"/>
      <g fill="#C9A227">
        <ellipse cx="52" cy="142" rx="7" ry="4" transform="rotate(-35 52 142)"/>
        <ellipse cx="48" cy="158" rx="7" ry="4" transform="rotate(-15 48 158)"/>
        <ellipse cx="50" cy="174" rx="7" ry="4" transform="rotate(15 50 174)"/>
        <ellipse cx="60" cy="188" rx="7" ry="4" transform="rotate(40 60 188)"/>
        <ellipse cx="148" cy="142" rx="7" ry="4" transform="rotate(35 148 142)"/>
        <ellipse cx="152" cy="158" rx="7" ry="4" transform="rotate(15 152 158)"/>
        <ellipse cx="150" cy="174" rx="7" ry="4" transform="rotate(-15 150 174)"/>
        <ellipse cx="140" cy="188" rx="7" ry="4" transform="rotate(-40 140 188)"/>
      </g>
      <path d="M84 196 Q100 204 116 196" fill="none" stroke="#C9A227" stroke-width="3.5" stroke-linecap="round"/>

      <!-- open book -->
      <path d="M66 142 L98 150 L98 188 L66 180 Z" fill="#1B3B8F"/>
      <path d="M134 142 L102 150 L102 188 L134 180 Z" fill="#E4222E"/>
      <path d="M70 140 L98 148 L98 184 L70 176 Z" fill="#ffffff" stroke="#1B3B8F" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M130 140 L102 148 L102 184 L130 176 Z" fill="#ffffff" stroke="#1B3B8F" stroke-width="2.5" stroke-linejoin="round"/>
      <g stroke="#C9A227" stroke-width="1.6" stroke-linecap="round">
        <path d="M76 150 L92 154 M76 158 L92 162 M76 166 L92 170"/>
        <path d="M124 150 L108 154 M124 158 L108 162 M124 166 L108 170"/>
      </g>

      <!-- quill -->
      <path d="M132 112 Q116 132 106 158 Q118 152 128 140 Q136 128 132 112 Z" fill="#1B3B8F"/>
      <path d="M106 158 L100 172" stroke="#1B3B8F" stroke-width="3" stroke-linecap="round"/>

      <!-- curved wordmark -->
      <text font-family="Outfit, Segoe UI, sans-serif" font-weight="800" font-size="15" fill="#1B3B8F" letter-spacing="1">
        <textPath href="#brandArc" startOffset="50%" text-anchor="middle">GRAMMAIRE FRANÇAISE</textPath>
      </text>
      <text x="100" y="216" text-anchor="middle" font-family="Outfit, Segoe UI, sans-serif" font-weight="800" font-size="13" fill="#1B3B8F" letter-spacing="1">CLASSE 10</text>
    </svg>`;

module.exports.NEW_HEADER = `<header class="topbar">
  <span class="brand">
    ${LOGO}
  </span>

  <div class="topic-menu-wrap">
    <button class="tb-btn" id="topicMenuBtn" title="Choose a grammar topic">📚 Grammar ▾</button>
    <div class="topic-menu" id="topicMenu"></div>
  </div>

  <button class="tb-btn" id="lettersBtn" title="Go to La Lettre (Section B)">✉️ Letters</button>
  <button class="tb-btn" id="messagesBtn" title="Go to Les Messages (Section B)">💬 Messages</button>
  <button class="tb-btn" id="searchBtn" title="Search a rule (Ctrl+K)">🔍 Search</button>
  <button class="tb-btn" id="pickStudentBtn" title="Pick a random student">🎲 Pick Student</button>

  <span class="tb-spacer"></span>

  <button class="tb-btn" id="modeBtn" title="Switch Teacher / Student (T)">👩‍🏫 Teacher</button>

  <div class="util-wrap">
    <button class="tb-btn" id="utilBtn" title="More tools" aria-expanded="false">☰</button>
    <div class="util-menu" id="utilMenu">
      <button class="tb-btn util-item" id="lightBtn" title="Light / Dark (L)">🌙 <span>Light / Dark</span></button>
      <button class="tb-btn util-item" id="soundBtn" title="Turn sound on">🔇 <span>Sound</span></button>
      <button class="tb-btn util-item" id="projectorBtn" title="Projector / Fullscreen mode (P)">📺 <span>Projector mode</span></button>
      <button class="tb-btn util-item" id="printBtn" title="Print this topic">🖨️ <span>Print this topic</span></button>
      <button class="tb-btn util-item" id="sidebarBtn" title="Show / hide the menu">📑 <span>Show / hide sidebar</span></button>
      <button class="tb-btn util-item" id="shortcutsBtn" title="Keyboard shortcuts (?)">⌨️ <span>Keyboard shortcuts</span></button>
    </div>
  </div>

  <button class="tb-btn" id="settingsBtn" title="Customization (S)">⚙️</button>
</header>`;

/* Engine additions. Appended after the existing topbar wiring so the six moved
   buttons keep the handlers they already have. */
module.exports.JS = `
/* ---- top bar: Letters shortcut + hamburger utility menu ---- */
if ($('#lettersBtn')) $('#lettersBtn').onclick = () => {
  const t = topicByKey['lettre'];
  if (t && t.indices && t.indices.length) Deck.slide(t.indices[0], 0);
};
if ($('#messagesBtn')) $('#messagesBtn').onclick = () => {
  const t = topicByKey['messages'];
  if (t && t.indices && t.indices.length) Deck.slide(t.indices[0], 0);
};
if ($('#utilBtn')) $('#utilBtn').onclick = e => {
  e.stopPropagation();
  const m = $('#utilMenu');
  const open = m.classList.toggle('open');
  $('#utilBtn').setAttribute('aria-expanded', open ? 'true' : 'false');
};
/* these are one-shot actions, so close the menu once one is used */
$$('#utilMenu .util-item').forEach(b => b.addEventListener('click', () => {
  setTimeout(() => {
    $('#utilMenu').classList.remove('open');
    $('#utilBtn').setAttribute('aria-expanded', 'false');
  }, 0);
}));
document.addEventListener('click', e => {
  if (!e.target.closest('#utilMenu') && !e.target.closest('#utilBtn')){
    const m = $('#utilMenu');
    if (m) m.classList.remove('open');
    const b = $('#utilBtn');
    if (b) b.setAttribute('aria-expanded', 'false');
  }
});
`;

module.exports.CSS = `/* ===== TOP BAR: logo + hamburger ===== */
.brand{ display:flex; align-items:center; flex:none; }
.brand-logo{ height:32px; width:auto; display:block; }

.util-wrap{ position:relative; }
.util-menu{
  position:absolute; top:calc(100% + 8px); right:0; width:250px; max-height:70vh; overflow-y:auto;
  background:var(--card-bg); border:1px solid var(--card-border); border-radius:14px;
  box-shadow:0 18px 50px rgba(0,0,0,.3); padding:8px; z-index:50;
  opacity:0; visibility:hidden; transform:translateY(-8px); transition:all .2s ease;
  display:flex; flex-direction:column; gap:4px;
}
.util-menu.open{ opacity:1; visibility:visible; transform:translateY(0); }
.util-item{ width:100%; justify-content:flex-start; text-align:left; display:flex; align-items:center; gap:10px; }
.util-item > span{ font-size:.86rem; }
@media print{ .util-menu, .util-wrap{ display:none !important; } }
`;
