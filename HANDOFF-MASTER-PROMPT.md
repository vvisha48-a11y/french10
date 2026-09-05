# Master Grammar App — Project Handoff & Implementation Master Prompt

> Paste this whole document into the new Claude project window as the first message.
> It describes the REAL, current state of the codebase and the work that genuinely remains.

---

## ⚠️ READ THIS FIRST — Reality Check

The person handing this off originally drafted a "13-point roadmap." **11 of those 13 points are already fully built and verified.** If you treat them as TODOs you will duplicate working code (a second Pick-a-Student, a second timeline, a second Conjugation Lab) and break the app. Part 2 below marks each point **✅ DONE** or **⬜ REMAINING**. Build only the REMAINING ones.

**The app is NOT edited as a monolith.** `master-grammar-app.html` is ~1.72 MB of assembled output. You must edit the *modular source parts* in `C:/claude/10 th/build-system/` and re-run `build.sh`. Hand-editing the 1.72 MB file is how the engine gets broken.

**Browser access has been unavailable this whole project.** Everything has been verified statically with a Node harness (see §6). Assume you also cannot open a browser; lean on the harness, and ask the user to eyeball anything interactive.

---

# PART 1 — CODEBASE ARCHITECTURE & STRICT INVARIANTS (what exists)

## 1.1 Files & authoritative metrics

- **Output:** `C:/claude/10 th/master-grammar-app.html` — **1.72 MB**, self-contained, offline-capable single file.
- **Build system:** `C:/claude/10 th/build-system/` — 35 files: the modular HTML/CSS/JS parts, `build.sh`, `verbdata.js`, and 5 Node verifier scripts. **This is the source of truth. Edit here, never the output.**
- **Splice source:** `C:/claude/10 th/Les Verbes - Tous les Temps.html` (224 KB) — the original deck. `build.sh` extracts **line 17** (minified Reveal.js CSS) and **line 869** (minified Reveal.js JS bundle) from it. Do not delete or reorder that file.

Authoritative counts (from `node verify.js`, not memory):

| Metric | Value |
|---|---|
| Slides (`data-slide-id`) | **446** |
| Horizontal stacks (`data-sub`) | **63** |
| Grammar sub-topics in the strict 8-slide format | **49** |
| MCQ questions | **254** (all answerable — verified) |
| Fill-in-the-blank inputs | **328** |
| Quiz containers | **112** |
| PYQ (past-year) tags | **59** |
| Conjugation Lab dataset | **500 verbs × 10 tenses = 28,405 forms** |

Topic order in the deck (12 topics):
`Timeline of Tenses → Les Verbes → Le Subjonctif → La Négation → Les Pronoms Personnels → Les Pronoms Relatifs → Discours Direct/Indirect → Trouvez la Question → Les Possessifs → Les Démonstratifs → Conjugation Lab → Révision Mixte`

## 1.2 How the file is assembled (`build.sh`)

Concatenation order (each part is a file in `build-system/`):
```
a-head.html                 # <!doctype>, <head>, Google Fonts, async GSAP+Lucide loaders, <style>
  + line 17 of Les Verbes deck   # Reveal.js CSS (minified)
b-style.html                # all app CSS + <body> + top bar + sidebar + modals + <div class="slides" id="slidesRoot">
  + CONTENT PARTS in order:
      t0-timeline.html
      c1..c4-verbes.html  t-nom.html  c5-verbes.html      (Les Verbes + Nominalisation)
      t2/t2b-subjonctif  t3a/t3b-negation  t4/t4b-pronoms
      t5/t5b-relatifs  t6/t6b-discours  t7/t7b-question
      t8-possessifs  t9-demonstratifs  t-conjlab  t10-revision
  + <script>verbdata.js</script>   # const VERBS500 = {...}  (its own script block, 466 KB)
d-mid.html                  # closes .slides, HUD bar, opens <script>
  + line 869 of Les Verbes deck    # Reveal.js JS bundle (minified, raw)
e-engine.html               # </script><script> ... the whole custom engine IIFE ... </script></body></html>
```
Result: **3 `<script>` blocks** — (1) `VERBS500` data, (2) Reveal.js library, (3) the engine IIFE.

To rebuild: `cd "C:/claude/10 th/build-system" && bash build.sh`. It is already self-contained (`SP` points at `build-system/`).

To regenerate the verb data from the book: `node extract-verbs.js` (reads `../new plan/verbs.md`, writes `verbdata.js`). Only needed if the verb set changes.

## 1.3 The strict 8-slide sub-topic schema (49 sub-topics obey this)

Every grammar sub-topic is one horizontal `<section data-topic="X" data-topic-name="…" data-sub="…">` containing **exactly 8 vertical** `<section data-slide-id="…" data-step="…">` in this fixed order:

`1 Description → 2 Formation | 3 Exceptions → 4 Pièges | 5 Exemples → 6 En contexte | 7 Pratique QCM → 8 Pratique à compléter`

`verify.js` enforces this order across all 49 and will fail the build if a new sub-topic breaks it. Topic openers, the timeline, the lab, and revision are deliberately NOT 8-step and are exempt (they have no `Description` step).

## 1.4 Slide structure (Reveal.js two-axis)

- Horizontal `<section>` = a sub-topic stack; its vertical `<section>` children = the 8 steps.
- `data-topic` / `data-topic-name` drive the Topics dropdown + sidebar; `data-sub` labels the stack; `data-step` labels each slide; `data-slide-id` is the unique key.
- Reveal runs `embedded:true`, `hash:false` (we sync the URL ourselves, guarded), `viewDistance:2`. Init is wrapped so a Reveal promise rejection cannot kill the UI.
- Content lives in `<div class="slide-card">`; step-by-step reveal uses Reveal `.fragment`.

## 1.5 The quiz & scoring engine (in `e-engine.html`)

**Everything is namespaced per widget — there are NO page-global widget IDs.** This is the core invariant that lets 112 quizzes coexist.

- **`initQuizContainer(container)`** runs once per `.quiz-container`, holding its own `score`/`answered` in closure. Scores are independent between containers.
- **MCQ:** `<div class="question-row" data-answer="…">` with `.option-btn` children. Correct/incorrect resolved by `norm()`-comparing button text to `data-answer`.
- **Fill-in:** `<input class="fib-input" data-answer="accepted|forms">` + `.fib-verdict`. Multiple accepted answers split on `|`.
- **Accent-tolerant checking:** `norm(s)` lowercases, `NFD`-normalises and strips combining marks (é→e, à→a), normalises apostrophes/space. So `etudiions` matches `étudiions`.
- **Pass threshold** is proportional (`score/total ≥ 0.7`) → confetti + fireworks + Web-Audio chime.
- Accent helper row (`.accent-key`) inserts é è ê à ç… at the caret for laptop users.
- Teacher/Student mode gates widgets via `body.mode-teacher` / `mode-student` + `.teacher-only` / `.student-only`.

Other engine subsystems (all namespaced, all guarded with try/catch in `boot()`): `initConjLab`, `initSpeedDrill`, `initTimeline`, `injectAudioButtons` (Web-Speech click-to-hear on `.example-text`), `spinPick` (Pick-a-Student), `printTopic`/`printBook`, `toggleProjector`, `updateStepHint`, delegated flip-card + hint-toggle handlers. localStorage prefix: **`cbse_fr_master_`**.

## 1.6 DOM & CSS conventions you must follow

- **Component vocabulary (reuse, don't reinvent):** `.slide-card`, `.box.blue/.gold/.green/.red`, `.two-columns`/`.three-columns`, `.subj-table`, `.formula-pipeline`+`.f-box`, `.highlight` role colours (`.hl-subject` navy, `.hl-neg` crimson, `.hl-verb` green, `.hl-aux` gold, `.hl-pronoun` purple), `.key-form`, `.example-text` + `.gloss`, `.step-ribbon`, `.quiz-container`, `.flip-card`, `.clue`/`.hint-btn`/`.hint-box`, `.cj-*` (lab), `.drill-*` (speed drill), `.tl-*` (timeline), `.pick-*` (randomizer).
- **Formula-lab / timeline JSON** lives in single-quoted `data-*` attributes; escape every apostrophe as `&#39;` (a raw `'` ends the attribute). Parsing is wrapped in try/catch so a bad attribute degrades gracefully.
- **Colour code is fixed and identical across all topics:** subject `#002395`, negation `#ED2939`, verb `#047857`, auxiliary `#D97706`, pronoun `#7e22ce`. Dark themes lighten these via `body.theme-cyber/.theme-slate` overrides.
- **6 themes** (default `theme-slate`), 7 fonts, font-scale, all via the ⚙ settings panel + localStorage. Never set a colour only inside a media/theme block.
- **Section-tag balance** matters: `build.sh`-assembled output must have balanced `<section>`/`</section>` inside `#slidesRoot`. `verify.js` checks this.

## 1.7 INVARIANT RULE (do not violate)

> **Additive only.** No existing `data-slide-id`, engine DOM lookup (`$('#…')`), CSS class the engine queries, `data-answer`, or scoring closure may be removed, renamed, or restructured. New features get **new** IDs/classes/stacks. After ANY change, the full verification harness (§6) must still pass: `verify.js` zero problems, `check-refs.js` zero missing, `check-verbs.js` zero mismatches, and both script blocks pass `node --check`.

---

# PART 2 — THE 13-POINT ROADMAP: DONE vs REMAINING

### ✅ 1. Pick-a-Student randomizer — **DONE**
Nav button `#pickStudentBtn` → modal with **Class 10E / 10J**, the two **real 38-name rosters** in a `ROSTERS` object (edit there to change names), 1.5 s cycling animation → celebratory badge + confetti + chime. Fully working.

### ✅ 2. Interactive Tense Timeline hero — **DONE**
First topic. 8 nodes PQP→PC/Imparfait→Passé Récent→Présent→Futur Proche→Futur Simple→Futur Antérieur, Conditional + Subjunctive mood overlays, verb switch (manger/partir), formation badges, click-to-focus detail, Web-Speech audio, GSAP flourish with CSS fallback. Plus an always-works "at a glance" fallback slide.

### ⬜ 3. "Usages & Real-World Context" slides — **REMAINING (primary task)**
NOT built. Add 1–3 usage/context slides per topic: curated real-world imagery + memory-anchor diagrams (Négation "sandwich", Pronoun "train", Imparfait-vs-PC "film scene", Direct→Indirect speech bubbles). **Constraints agreed with the user:** the Unsplash *Source API is discontinued* — use **curated specific `images.unsplash.com/photo-…` / Wikimedia hotlinks WITH an inline-SVG fallback**, never dynamic random URLs. Because classroom wifi is "flaky/unknown," the **teaching diagrams must be inline SVG** (always render); photos are the enhancement layer only.

### 🟡 4. 100% Exceptions & Board Pièges coverage — **PARTIALLY DONE / audit remaining**
Every one of the 49 sub-topics already has a dedicated **step-4 "Pièges"** slide. What's NOT done: a systematic audit confirming 100% coverage of the specific edge cases (invariable participles like *coûté/valu*, `Elle s'est lavé les mains`, partitive du/de la/des→de except after être, `ce qui/ce que/ce dont`, `auquel/desquels`). Do this as an audit-and-fill pass, not a rebuild.

### ✅ 5. English UI + French examples — **DONE**
All chrome (top bar, HUD, shortcuts, settings, toasts, sidebar) is English. Grammar content keeps English explanations + French examples. (Sub-topic French labels like "Le Présent" are intentionally kept as the grammatical terms.)

### ✅ 6. Clue-word Révision Mixte — **DONE**
Two CBSE-strict slides in Révision Mixte: tense names removed, time-indicator clues highlighted as gold `.clue` pills, per-question **💡 Hint** toggle explaining the deduction in English.

### ✅ 7. La Nominalisation — **DONE**
5-slide module under Les Verbes (between c4 and c5): suffix rules (-tion/-ment/-age/-ure/-ée), gender patterns, zero-suffix irregulars, CBSE headline transformations, practice drill.

### ✅ 8. Conjugation Lab — **DONE (now with the full 500 verbs)**
Its own topic. Family filter (8 families), search by French **or** English, **all 10 tenses shown at once** per verb, algorithmic stem/ending colour-split (`prenn[ent]` vs `pren[ons]`), CBSE Speed Drill (context clue + subject + infinitive, no tense named, accent-tolerant, optional 30 s timer). Dataset = **500 verbs generated from `new plan/verbs.md`** (69 model tables → 28,405 forms), cross-checked 0-mismatch against a hand-verified table; several source-book typos were caught and corrected in `extract-verbs.js`.

### ✅ 9. Print-to-A4 engine — **DONE**
`@page A4` + density rules; **Print this topic** and **Print complete workbook** buttons (in ⚙ settings); UI stripped; clean page breaks; the lab prints as a 2-column verb sheet.

### ✅ 10. Clicker step-by-step reveal — **DONE**
Reveal `.fragment` stepping; ArrowRight/Left, PageDown/Up, Space all advance fragments then slides; on-screen Back/Next buttons + a live "N more reveals" hint.

### ✅ 11. Projector / Fullscreen mode — **DONE**
`#projectorBtn` + `P` key → `requestFullscreen()` + `body.projector-mode` with `clamp()` fluid typography, chrome hidden, content centered.

### ✅ 12. Online-mode assets — **DONE (as progressive enhancement)**
Google Fonts, GSAP, Lucide load **async + guarded**: timeline animates in pure CSS if GSAP fails, icons fall back to emoji, Web-Speech is browser-built-in. Nothing external can break a live lesson. (This was a deliberate resilience choice over hard CDN dependence.)

### ✅ 13. Pre-flight consultation — **ALREADY HAPPENED**
The consultation + approvals for images/animation/connectivity were completed earlier. Do NOT re-run it — but DO still confirm the specific image sources for point 3 before mass-adding them.

**Net: your real remaining work is #3 (usage/context slides + SVG diagrams) and #4 (exceptions audit).** Everything else is built and verified — extend, don't rebuild.

---

# PART 3 — HOW TO WORK IN THIS CODEBASE

## Workflow
1. Edit the relevant part file in `C:/claude/10 th/build-system/` (new content usually = a new `t-*.html` part added to `build.sh`'s `PARTS` array, or CSS in `b-style.html`, or JS in `e-engine.html`).
2. New content sub-topics must follow the §1.3 eight-step order (or be openers/tools exempt from it).
3. New engine code: additive functions, new IDs/classes, guard with try/catch, wire in `boot()`.
4. `bash build.sh` to reassemble.
5. Run the full harness (§6). All must pass before delivering.
6. Deliver the rebuilt `master-grammar-app.html`; ask the user to open it in Chrome and eyeball new interactive bits (you can't).

## §6 — Verification harness (run every one after every change)
```
cd "C:/claude/10 th/build-system"
bash build.sh
# syntax of both script blocks:
node -e "const fs=require('fs');const h=fs.readFileSync('C:/claude/10 th/master-grammar-app.html','utf8');const i=h.lastIndexOf('<script>'),j=h.lastIndexOf('</script>');fs.writeFileSync('engine-extract.js',h.slice(i+8,j));const m=h.match(/<script>\\s*(const VERBS500 = [\\s\\S]*?;)\\s*<\\/script>/);fs.writeFileSync('vd-extract.js',m[1]);"
node --check engine-extract.js      # engine syntax
node --check vd-extract.js          # verb data syntax
node verify.js                      # structure: 49 sub-topics conform, MCQs answerable, tags balanced -> "PROBLEMS: none"
node check-refs.js                  # every engine DOM lookup resolves -> "missing: none"
node check-lab.js                   # lab/drill DOM hooks + curated data -> "PROBLEMS: none"
node check-verbs.js                 # 500 verbs, rules, 0 mismatches vs hand-verified table
rm -f engine-extract.js vd-extract.js
```
`verify.js` catches duplicate IDs, unanswerable MCQs (answer not among options), broken 8-step order, and section-tag imbalance — the exact failure modes that break this engine. Treat a red harness as a hard stop.

## Known constraints & gotchas
- No browser here — verify statically, hand interactive testing to the user.
- Heredocs/`sed` mangle backslashes (`\\b`→backspace, `\\s`→`s`): write regex-heavy Node scripts with the Write tool, not shell heredocs.
- `data-*` JSON must escape `'` as `&#39;`.
- File is 1.72 MB — it loads slightly slower on a projector first time; that was the user's accepted trade for pre-computed verb data.
- Keep the favicon/title/theme defaults stable; users find things by them.
