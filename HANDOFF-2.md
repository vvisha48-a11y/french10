# Master Grammar App — Handoff #2 (Continuation)

> Paste this whole document into a fresh Claude session as the first message.
> It describes the REAL current state as of this handoff, building on the original
> `HANDOFF-MASTER-PROMPT.md`. Read that original too — its architecture rules
> (§1.1–§1.7) still hold in full. This document records everything done SINCE it.

---

## 1. Project overview & progress

A self-contained, offline-capable single-file web app that teaches CBSE Class 10
French grammar — a Reveal.js deck with quizzes, a 500-verb Conjugation Lab, an
interactive tense timeline, and print-to-A4. **Never edit the assembled output by
hand.** Edit the modular source in `C:/claude/10 th/build-system/` and run
`bash build.sh`.

**Two output files, byte-identical, produced by every build:**
- `C:/claude/10 th/master-grammar-app.html` — what all five original verifiers read (path hardcoded in them).
- `C:/claude/10 th/docs/index.html` — the deployable artifact for GitHub Pages (`/docs` publishing root) and student download.

**Authoritative metrics right now (from `node verify.js`, not memory):**

| Metric | Value |
|---|---|
| Slides (`data-slide-id`) | **584** |
| Horizontal stacks (`data-sub`) | **78** |
| 8-step rule sub-topics | **49** (unchanged — the invariant proving nothing existing broke) |
| Usage slides (`data-step` starts "Usages") | **72** across **48 / 49** rule stacks |
| MCQ questions | **258** (all answerable) |
| Fill-in-the-blank inputs | **328** |
| Quiz containers | **113** |
| Inline `<svg>` diagrams | **89** (was 75; +13 gallery, +1 letter layout) |
| Embedded photos | **27** `<img>` data: URIs (was 10) |
| Conjugation Lab dataset | 500 verbs × 10 tenses |
| File size | **~12.44 MB** |
| External network requests | **ZERO** (fully offline) |

---

## 2. Changes made since the original handoff

1. **Usage & Real-World Context — two layers.**
   - 10 topic-level "Usages & Contexte" stacks (30 slides), each with a hand-authored inline-SVG memory anchor (Négation "sandwich", Pronoun "train", Imparfait-vs-PC "film strip", Discours "speech bubbles", etc.) + one base64-embedded Unsplash photo. Files: `build-system/u-*.html`.
   - Rule-specific usage slides inside the sub-topics themselves: **72 slides across 48 of 49 rule stacks**, each with its own inline SVG. Files: `build-system/usages/<description-slide-id>.html`, spliced in by `insert-usages.js` immediately after each Description slide.
2. **Exceptions/Pièges audit** — 13/14 CBSE edge cases already covered; added the one gap (invariable participles `coûté`/`valu`, tagged enrichment) to `pc-4`. Report: `EXCEPTIONS-AUDIT.md`. Auditor: `audit-exceptions.js`.
3. **True single-file / offline** — inlined the last 3 external deps (Google Fonts latin subset as base64 woff2, GSAP, Lucide) via `inline-assets.js`; photos via `inline-photos.js`. Gate: `check-offline.js`. Cached originals in `build-system/vendor/` so builds work with no network.
4. **Drag-and-drop image overlay** (teaching aid) — drop any local image onto the running deck → centred lightbox, Esc/click to close. `initDropOverlay()` in `e-engine.html`; `#dropOverlay` in `b-style.html`. Transient, not persisted.
5. **Verb Family Navigator** (`cj-nav-1`, 4th Lab slide) — 4 ending tabs → 20 sub-family chips → every verb, each opening full 10-tense conjugation inline. Bucketing is empirical from conjugated forms (not model labels — the `ELER` model mixes accent-shift and doubling). Shares the Lab's renderer via the extracted `cjRenderAllTenses()`. "Open in the Lab" uses an additive `container.__setVFam` hook. Interface text is English; sub-family names + all conjugations stay French.
6. **8-step rule relaxed** — `verify.js` now allows `Description → Usages ×(1–3) → [original 7-step tail]`; a 0-usage stack still validates as legacy. New gate: every "Usages" slide MUST contain `<svg>` or `<img>` or the build fails.

**Bugs fixed (all were latent faults my own changes activated):**
- Navigator + Speed Drill shipped blank: `boot()` had `$('.vfam')`/`$('.drill')` (single `$`, no `.forEach`) — caused by `String.replace()` treating `$$` as an escape. Fixed; lint added.
- Timeline tenses invisible in light theme: `__enhanceTimeline()` called twice, and `gsap.from({opacity:0})` infers its end value → animated 0→0. Fixed with run-once guard + `fromTo`/`clearProps`/reveal-fallback. (Colours were always correct theme vars.)

---

## 3. Current working file

**Do NOT paste the 3.66 MB `docs/index.html` into a chat** — it is assembled output and hand-editing it is how the engine breaks. The source of truth is `build-system/`.

- Deployable file: `C:/claude/10 th/docs/index.html`
- Source parts: `C:/claude/10 th/build-system/` — `a-head.html`, `b-style.html`, content parts (`t*.html`, `c*.html`, `u-*.html`), `usages/*.html`, `verbdata.js`, `d-mid.html`, `e-engine.html`, `build.sh`.

**Rebuild:**
```bash
cd "C:/claude/10 th/build-system" && bash build.sh
```
Pipeline: assemble → `insert-usages.js` → `inline-photos.js` → `inline-assets.js` → copy to `docs/index.html` + `.nojekyll`.

**Full verification harness (all must pass; a red harness is a hard stop):**
```bash
cd "C:/claude/10 th/build-system" && node -e "const fs=require('fs');const h=fs.readFileSync('C:/claude/10 th/master-grammar-app.html','utf8');const i=h.lastIndexOf('<script>'),j=h.lastIndexOf('</script>');fs.writeFileSync('engine-extract.js',h.slice(i+8,j));" && node --check engine-extract.js && node verify.js && node check-refs.js && node check-lab.js && node check-verbs.js && node check-vfam.js && node check-render.js && node check-offline.js && rm -f engine-extract.js
```
- `verify.js` structure + 8-step rule + usage-visual gate
- `check-refs.js` engine DOM lookups resolve
- `check-lab.js` lab/drill hooks + `cjRenderAllTenses` extraction
- `check-verbs.js` 500-verb dataset integrity
- `check-vfam.js` navigator partitions 500 verbs exactly (0 orphans/overlaps)
- `check-render.js` **runs** `initVerbFamilies` in a DOM shim + lints the two bug classes above
- `check-offline.js` zero external references

---

## 6. Topic visual galleries (added after handoff #2)

Each of the 10 topic-level `u-*.html` stacks gained a 4th slide,
`data-step="Galerie visuelle"` (ids `use-vrb-4`, `use-ipc-4`, `use-sub-4`, `use-neg-4`,
`use-pro-4`, `use-rel-4`, `use-dis-4`, `use-qst-4`, `use-pos-4`, `use-dem-4`), each
carrying **three visuals** in a new `.topic-visual-grid` 3-up responsive grid.

- **Step name is deliberately NOT prefixed "Usages"** — that keeps the usage-slide
  census at 72 and stays clear of the `verify.js` gate 9 visual requirement. The
  `u-*` stacks have no `Description` step, so the 8-step rule does not apply to them.
- **Mix:** 7 topics get 2 photographs + 1 diagram; Question / Possessifs / Démonstratifs
  get 1 photograph + 2 diagrams, because their content is an agreement *system* that a
  diagram teaches better than any stock photo.
- **19 new photos** in `build-system/photos/`, all Wikimedia Commons / Rawpixel under
  CC BY, CC BY-SA, CC0 or public domain; licence + author per file in
  `build-system/photo-credits.json`, and the credit is printed in each `.tv-credit`.
  Sourced by `fetch-photos.js` (one-off, not part of `build.sh`).
- **13 new inline SVG diagrams**, theme CSS variables only — verified recolouring
  correctly across all 7 themes (slate, cyber, classic, sunrise, emerald, purple, minimal).
- Two hero photos swapped for better art direction: `use-ipc-1` (film projector) and
  `use-rel-1` (Pont Neuf). The other 8 heroes were left alone.
- Slides were generated by `build-system/add-galleries.js` (idempotent; `--force`
  replaces existing gallery slides). **`inline-photos.js` now resolves `.jpg/.jpeg/.png/.webp`**
  and emits the matching MIME type; the non-`data:` `<img src>` offline gate is untouched.
- Layout verified in-browser: every gallery cell renders 360×225 (exactly 16:10), no card
  overflow and no scrollbar on any of the 10 slides.

**Pre-existing bug, NOT caused by this work:** the deck logs repeated
`RangeError: Maximum call stack size exceeded` at Reveal's internal `Fe`
(its `dispatchEvent` helper) — an event-listener loop in `e-engine.html`. Confirmed
identical on `master-grammar-app.html.bak5`, which predates all of this. Worth fixing separately.

## 7. La Lettre — Section B module (added after the galleries)

**Why:** the deck answered Section C only — 30 of 80 marks. Its grammar coverage is
complete (verified against every paper 2017–2025; 2023/24/25 Section C is 100% covered),
so the headroom was elsewhere. This module adds the 10-mark informal letter, which is
Question 2 of every single paper.

New topic `data-topic="lettre" data-topic-name="La Lettre (Section B)"`, **12 stacks /
69 slides**, in `t11-lettre.html`, `t11b-lettre.html`, `t11c-lettre.html` (registered in
the `build.sh` PARTS list between `t-conjlab.html` and `t10-revision.html`). Slide ids
are `let-*`.

- **Three craft stacks** — Le format, Les formules, Le registre — teach the transferable
  skeleton (~30 of the 80 words are memorised formulae).
- **Eight theme stacks, depth weighted by real exam frequency**, not by textbook order:

  | Thème | Set in | Slides |
  |---|---|---|
  | L7 En pleine forme (santé) | 2019, 2022, 2024, 2025 | 7 |
  | L10 Vive la République | 2017, 2019, 2025 | 7 |
  | L2 / L3 / L4 | 2× each | 6 each |
  | L6 Chacun ses goûts | 2× | 5 |
  | L5 / L8 | never in these 6 papers | 4 each |

- **The two most-set themes had NO model letter in the repo.** Both were written from
  scratch and also saved as repo files:
  `letters 10 mark questions/UIS_w_L7_LETTRE_SANTE.md` and `UIS_w_L10_LETTRE_REPUBLIQUE.md`.
  The empty 3-byte `20250822134951_UIS_w_lettre_LOUVRE.md` was filled (both copies).
- **Zero new CSS and zero new JS.** Everything reuses the `initQuizContainer()` markup —
  `.question-row[data-answer]` + `.option-btn`, `.fib-input`, `.accent-bar`,
  `.reveal-answers.teacher-only`, `.retry-btn.student-only` — plus `.subj-table` and
  `.hint-btn` / `.hint-box`. Hint boxes are used throughout so a wrong answer explains
  itself; before this they existed on only 12 items in `t10-revision.html`.
- **No step is named "Description"**, so these stacks stay exempt from the 8-step rule
  (`verify.js:37`) and the 49-sub-topic invariant is untouched. No step starts with
  "Usages", so gate 9 does not apply and the usage census stays at 72.
- Model letters build line by line with `.fragment` — verified stepping
  000000 → 100000 → … → 111111.
- Practice slides carry a `student-only` note to press **T**, because the deck boots in
  Teacher mode where every quiz input is `disabled`.

**Verified in-browser:** MCQ scoring and lock-out, gap-fill accepting accented *and*
accent-stripped answers (`norm()` strips diacritics), hint toggling, the mode switch,
fragment stepping, and the new letter-layout SVG recolouring across all 7 themes with no
hardcoded hex. Card overflow on the new slides (51% of slides scroll when every fragment
is open) is **lower than existing content** — négation 66%, relatifs 63%, possessifs 68%,
révision 78%. The scrolling card is the deck's designed behaviour, not a regression.

**Note for whoever navigates this deck programmatically:** Reveal is initialised with
`hash: false` and there is **no `hashchange` listener**, so changing `location.hash` on an
already-loaded page does nothing. Use `window.Deck.slide(h, v)` instead.

## 4. Known open items (optional)

- **One un-migrated rule stack:** `Le Subjonctif / La Formation` has no usage slide (validates fine as a legacy 8-slide stack). Add `build-system/usages/subj-form-1.html` if desired — the other 5 Subjonctif sub-topics already have theirs.
- File size ~3.66 MB: roughly doubled by the embedded fonts/GSAP/Lucide/photos (accepted trade for offline). **Lucide (~328 KB) is dead code** — no `data-lucide` elements exist; removable in one line if size matters.

---

## 5. Working constraints (still in force)

- **Additive only.** No existing `data-slide-id`, engine DOM lookup, queried CSS class, `data-answer`, or scoring closure may be removed/renamed. New features get new IDs/classes.
- **No browser in the build environment** — verify statically; hand interactive checks to the user.
- **Splice scripts:** use the Write tool for regex-heavy Node scripts, and NEVER `String.replace()` with a `$$` replacement string (it collapses to `$`). Use `split().join()` or a function replacer.
- SVG diagrams: theme CSS variables only, never literal hex (dark themes exist).
- `data-*` JSON escapes `'` as `&#39;`.

---

## 7. La Lettre (Section B) — corrected record

**The 100 slides described earlier in this document were never in the build.**
`t11-lettre.html`, `t11b-`, `t11c-`, `t11d-` (2,663 lines) were absent from
`build.sh`'s PARTS and appeared nowhere in the output. They were superseded by a
single interactive module and have now been **deleted** (recoverable from git).

**What is live:** one slide, `let-mod-1` (`t11-module.html`), rendered by
`initLetterModule()` from `letterdata.js` — a sidebar of 5 groups → 35 topics
(18 lessons + 17 model letters) with a FR/EN translate toggle.

**Rework applied:**
- New `LM_VISUALS` registry in `e-engine.html`: **8 inline-SVG diagrams** (skeleton,
  budget, datebar, salute, open-close, linkers, register, checklist), theme
  variables only. Topics opt in via a `visual: "<id>"` field in `letterdata.js`.
  This replaced an orphaned `blueprint: true` flag that the renderer never read.
- Diagrams live in the engine, **not** the data, because `renderTopic()` `esc()`-escapes
  every string — raw SVG in the JSON would render as visible source text.
- Lesson prose cut **53%** (4,359 → 2,067 chars across the 8 reworked lessons);
  the detail now lives in the diagrams.
- **All 17 model letters untouched**, proven byte-identical by `check-letter.js`.

**New verifier:** `node check-letter.js` — asserts every referenced diagram exists
(and none is orphaned), the renderer actually reads `t.visual`, no hardcoded hex in
the diagrams, correct topic counts, and the model letters match their baseline.
Add it to the harness chain.

### 7b. La Lettre converted to Reveal.js slides

The bespoke sidebar module was replaced by ordinary slides, matching every other topic.

- **5 stacks / 35 slides**: The Format (6) · Useful Phrases (5) · The Tone (4) ·
  Model Letters (17) · Exam Practice (3). One topic = one slide.
- **Generated, not hand-written**: `gen-letter-slides.js` runs as the first step of
  `build.sh`, reading `letterdata.js` (still the single source of truth) and
  `lm-visuals.js` (build-time module holding the 8 SVG diagrams). Never hand-edit
  `t11-lettre.html` — regenerate it.
- **Removed**: `t11-module.html`, `initLetterModule()`, `LM_VISUALS` from the engine,
  ~6 KB of dead `.lm-*` CSS, and the **88 KB `LETTERDATA` runtime block** (content is
  now baked into the slides).
- **Added**: `initLetterToggle()` — the FR/EN button appears on every letter slide but
  the state is global and persisted, so a teacher flips English on once.
- The `entrainement` quiz is now a real `.quiz-container` scored by the deck's own
  quiz engine (MCQ count 254 → 258), and the CBSE year tags render as `.q-tag`
  (PYQ count 59 → 74).

`node check-letter.js` was rewritten for the slide format: it asserts 5 stacks /
35 slides, every topic became a slide, 8 theme-safe diagrams, a toggle on every
slide, no module leftovers, and — the load-bearing one — that all 17 model letters
are byte-identical to their pre-work baseline AND actually rendered.
