# Master Z.ai Prompt & Reference Code — CBSE Class 10 French Master Grammar Application

This artifact contains the **Complete Z.ai System Prompt** AND the **Full Reference HTML Code Base** generated for the CBSE Class 10 French Grammar Interactive Presentation Framework.

- **Workspace Live File Link:** [`index.html`](file:///c:/PROJECT%2010TH/index.html)

---

## Part 1: Z.ai System Prompt (Copy & Paste to Z.ai)

```markdown
# SYSTEM PROMPT FOR Z.AI: CBSE Class 10 French Master Grammar Interactive Presentation Web Application

## ROLE & OBJECTIVE
Act as an expert frontend developer and UI/UX designer specializing in educational technology. Your task is to build a highly interactive, visually stunning, single-page web application using HTML, CSS, JavaScript, and the Reveal.js presentation framework (or a zero-dependency full-screen Reveal.js engine).

This application will be used live in a classroom to teach **CBSE Class 10 French Grammar**. It needs to be visually appealing, highly animated, and designed to minimize cognitive load so students can easily grasp complex grammar concepts.

---

## 1. OVERALL LAYOUT & ARCHITECTURE

The application layout is divided into 3 core zones optimized for laptop, TV, and classroom projector displays (`100vw` × `100vh` zero-scroll outer viewport):

+----------------------------------------------------------------------------------------------------+
| 🌐 TOP NAVIGATION BAR: Sleek Header | 🔽 "Grammar" Dropdown Menu (7 Topics) | ⚙️ Settings Panel    |
+----------------------------------------------------------------------+-----------------------------+
|                                                                      | 📌 RIGHT SUBTOPIC SIDEBAR   |
|                                                                      |    (20% Width)              |
|   MAIN PRESENTATION VIEW (80% Width, Left/Center)                    |  -------------------------  |
|   - Full-Screen Reveal.js Slide Container                            |  • 1. Description           |
|   - Giant Color-Coded Grammar Formulas (Full Slide Size)             |  • 2. Usages & Triggers     |
|   - Step-by-Step Fragments / Animated Reveals                        |  • 3. Exceptions to Usage   |
|   - Visual SVG/GIF Placeholders on Usage Slides                      |  • 4. Formula / Formation   |
|   - 3D Flippable Flashcards & Interactive Formula Lab                |  • 5. Formation Exceptions  |
|   - Interactive Quiz with Web Audio & Canvas Fireworks               |  • 6. 5-8 Exam Examples     |
|                                                                      |  • 7. CBSE Board PYQs       |
|                                                                      |  • 8. Answer Key            |
+----------------------------------------------------------------------+-----------------------------+
| 🎮 BOTTOM HUD CONTROL BAR: [◄ Prev]  |  Slide X / 12  |  [Next ►]  |  [⛶ Fullscreen]              |
+----------------------------------------------------------------------------------------------------+

### Layout Rules:
* **Top Navigation Bar:** A sleek horizontal header at the top of the screen. It contains a "Grammar" dropdown menu listing all 7 CBSE Class 10 French Grammar topics. Clicking a topic dynamically loads that specific presentation into the main view.
* **Split-Screen UI:** Below the navbar, the screen is divided into two main sections:
  * **Main Presentation View (80% width, Left/Center):** A full-screen Reveal.js container where the actual presentation slides are displayed.
  * **Subtopic Sidebar (20% width, Right):** A sticky vertical menu listing the sub-sections of the currently active grammar topic. Clicking these links instantly navigates the presentation to the corresponding slide.

---

## 2. SYLLABUS TOPIC SCOPE (7 EXACT CBSE TOPICS)

1. **Les Temps** (Présent, Passé Composé, Imparfait, Plus-que-parfait, Futur Simple, Futur Antérieur, Conditionnel Présent, Conditionnel Passé, Impératif)
2. **La Négation**
3. **Les Pronoms Personnels** (COD, COI, y, en, toniques)
4. **Les Pronoms Relatifs** (Simples et Composés)
5. **Le Subjonctif**
6. **Le Discours Direct et Indirect**
7. **Trouvez la question** (L'interrogation)

---

## 3. BILINGUAL INSTRUCTION & SLIDE RULES

* **Bilingual Instruction (Crucial):** All grammatical rules, descriptions, and concepts MUST be explicitly explained in clear, simple English for better student understanding. The actual formulas, examples, and vocabulary remain in French.
* **Massive Color-Coded Formulas:** Formula slides occupy the entire slide with massive typography (`2.5rem` to `3.8rem`).
  - **Sujet / Main Noun:** Blue (`#002395`)
  - **Ne / N' / Negative Particles:** Crimson Red (`#ED2939`)
  - **Verbes / Endings / Stems:** Emerald Green (`#047857`)
  - **Pas / Auxiliaries / Triggers:** Accent Gold (`#D97706`)
  - **Object Pronouns (COD/COI/y/en):** Royal Purple (`#7e22ce`)
* **CBSE PYQs Practice Section:** Dedicated section formatting Previous Year Questions (PYQs) from past CBSE board exams with step-by-step click reveal solutions.
```
