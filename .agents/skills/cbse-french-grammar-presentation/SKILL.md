---
name: cbse-french-grammar-presentation
description: Generates 100vw x 100vh interactive, full-screen, step-by-step presentation HTML files for any CBSE Class 10 French Grammar topic using the ultimate experimental presentation engine (6 themes, 7 fonts, text scale, live editing, box creator, Web Audio sound FX, 2D canvas fireworks, interactive formula lab, 3D flippable flashcards, and enlarged blue verb highlights).
---

# CBSE Class 10 French Grammar Presentation Skill Engine

Whenever the user asks to create a presentation for ANY CBSE Class 10 French Grammar topic (e.g. *Le Subjonctif*, *Le Conditionnel*, *Les Pronoms COD/COI/y/en*, *Le Futur Antérieur*, *Passé Composé vs Imparfait*, *Le Plus-que-Parfait*, *Le Discours Direct/Indirect*, *La Forme Passive*, *Les Pronoms Relatifs Simple/Composés*, etc.), or provides content/notes to be turned into a presentation:

**ALWAYS USE THE EXACT ARCHITECTURE FROM [`template.html`](file:///c:/PROJECT%2010TH/.agents/skills/cbse-french-grammar-presentation/template.html)**.

---

## 1. Master Template Reference

The reference template file containing the complete engine, styling, CSS variables, sound FX synth, particle canvas, settings modal, formula lab logic, 3D flippable cards, and interactive quiz system is stored at:
- Workspace Path: [`template.html`](file:///c:/PROJECT%2010TH/.agents/skills/cbse-french-grammar-presentation/template.html)
- Global Path: [`template.html`](file:///C:/Users/User/.gemini/config/skills/cbse-french-grammar-presentation/template.html)

When creating a new presentation:
1. Copy the full HTML structure, CSS rules, settings engine, sound synth, fireworks particle script, and navigation logic from `template.html`.
2. Adapt the slide titles, grammar rules, examples, formula calculator verbs, 3D flashcards, practice quiz questions, and answer key for the target grammar topic.

---

## 2. Core Presentation Engine Specifications

1. **Fullscreen Canvas (`100vw` × `100vh`)**:
   - Zero scrollbars on main window (`html, body { width: 100vw; height: 100vh; overflow: hidden; }`).
   - Standard slide dimension: `width: 94vw; max-width: 1420px; height: 88vh; padding: 24px 45px 55px 45px; display: flex; flex-direction: column; align-items: center; text-align: center; overflow-y: auto;`.

2. **Top-Right ⚙️ Settings Modal & Customization Engine**:
   - **6 Themes**: *French Tricolor Classic*, *Midnight Cyber*, *Sunrise Gold*, *Emerald Forest*, *Royal Purple*, *Minimalist Clean Studio*.
   - **7 Fonts**: *Plus Jakarta Sans*, *Outfit*, *Poppins*, *Playfair Display*, *Space Grotesk*, *Comic Neue*, *Cinzel*.
   - **Text Scaling**: 88% to 130%.
   - **Text Color Presets**: French Navy, Crimson Red, Emerald Green, Royal Purple, Slate Dark.
   - **Live In-Place Text Editing Mode**: Toggle `contenteditable="true"` across all slides.
   - **Dynamic Element Creator**: `➕ Add Blue Box`, `➕ Add Gold Box`, `➕ Add Highlight Badge`, `➕ Add Bullet`.
   - **`💾 Save Custom Text & Boxes`**: Persists all live edits and added elements in `localStorage`.

3. **Slide 8 — Interactive Formula Calculator Lab**:
   - Verb selection buttons triggering dynamic 3-step formula pipeline breakdown and interactive conjugation table matrix.

4. **Slide 9 — 3D Flippable Flashcards**:
   - Flip effect (`transform-style: preserve-3d`, `rotateY(180deg)`) triggered by clicking, accompanied by Web Audio card flip sound FX.

5. **Slide 11 — Interactive CBSE Practice Quiz**:
   - Instant click validation (green/red feedback).
   - Score tracker and attempt count.
   - Web Audio API Synthesizer sound FX (`playQuizSound(true/false)`).
   - 2D Canvas Fireworks explosion animation (`#fireworksCanvas`) on correct answers.

6. **Navigation & Controls**:
   - Bottom HUD bar: `Prev ◄`, Slide Counter (`Slide X / 12`), `Next ►`, `fullscreen-btn`.
   - Global keyboard shortcuts: `Right Arrow` / `Space` (Next step/slide), `Left Arrow` (Prev step/slide), `F` (Fullscreen).

7. **Typography & Enlarged Blue Highlights**:
   - Blue verb forms, terminations, key triggers, and essential rules MUST use enlarged styling (`font-size: 1.35em`, `color: #002395`, `font-weight: 800`).

---

## 3. Standard 12-Slide Curriculum Architecture

All CBSE French Grammar presentations must follow this exact 12-slide layout:

- **Slide 1**: Title & Master Topic Overview
- **Slide 2**: Prerequisites & Fundamental Rules
- **Slide 3**: Usage 1 (e.g. Primary Rule / Category 1)
- **Slide 4**: Usage 2 (e.g. Category 2 / Triggers)
- **Slide 5**: Usage 3 (e.g. Category 3 / Special Cases)
- **Slide 6**: Usage 4 (e.g. Doubt/Exceptions or Comparison)
- **Slide 7**: Master Comparison / Trap Alert (e.g. Affirmative vs Negative, Indicative vs Subjunctive, PC vs Imparfait)
- **Slide 8**: Interactive Conjugation / Rule Calculator Lab
- **Slide 9**: 3D Flippable Flashcards (Exceptions / Irregulars / Stems)
- **Slide 10**: Complete Conjugation / Reference Matrix Table
- **Slide 11**: Interactive Practice Quiz with Audio Sound FX & Canvas Fireworks
- **Slide 12**: Answer Key & CBSE Board Exam Checklist
