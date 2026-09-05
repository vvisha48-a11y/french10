---
name: passe-recent-ppt-style
description: Generates clean, high-impact EdTech presentation slides and HTML web presentations inspired by the "Le Passé Récent Deck" design system (Slate Navy #2B3645, Cobalt Blue #4A6EAA, Success Green #639A48, emoji pointers 👉, formula breakdown cards, bilingual sentence mapping →, and 6-slide standard architecture).
---

# Le Passé Récent EdTech Presentation Design System & Skill

Use this skill whenever creating PowerPoint slides, presentation outlines, HTML presentations, or grammar teaching resources using the clean, high-impact **Passé Récent Presentation Design System**.

---

## 1. Visual Design Tokens & Color Palette

### 🎨 Color Palette
- **Header Slate Navy (`#2B3645` / `#293545` / `#192833`)**:
  - Used for main slide headers, card titles, and primary emphasis text.
  - Gives a professional, grounded EdTech aesthetic.
- **Accent Cobalt Blue (`#4A6EAA` / `#4770B4` / `#4A90E2`)**:
  - Used for subtitles, concept callouts (`👉 In English we say...`), formula cards, and key grammatical elements.
- **Deep Royal Navy (`#1C4E8A` / `#406080`)**:
  - Used for highlight cards, example box borders, and formula backgrounds.
- **Success / Answer Green (`#639A48`)**:
  - Used exclusively for answer keys, success feedback badges, and solution boxes.
- **Muted Subtitle Slate (`#4D6F96`)**:
  - Used for instruction text (e.g., `Complete the sentences:`).
- **Background White / Light Slate (`#FFFFFF` / `#F8FAFC`)**:
  - Clean, zero-clutter canvas background to ensure maximum contrast and zero cognitive fatigue for students.

---

## 2. Typography & Formatting Rules

1. **Font Family**:
   - Primary Sans-Serif: `Arial` or `Microsoft YaHei` (or modern Google Font equivalents: `Outfit`, `Plus Jakarta Sans`, `Poppins`).
2. **Visual Pointers & Symbols**:
   - Use pointing emoji `👉` to anchor the core student takeaway rule on every concept slide.
   - Use right arrow `→` for French-to-English translation mappings (`Je viens de manger. → I just ate.`).
   - Use bold highlights on key verb forms, auxiliaries, and prepositions.
3. **Cognitive Load Optimization**:
   - Keep text on every slide under 40 words.
   - Avoid long paragraphs; use clean stacked cards or bold bullet items.

---

## 3. Standard 6-Slide Presentation Architecture

Every grammar topic modeled after this presentation style MUST follow this exact 6-slide structure:

### 📍 Slide 1 — Hero Cover & Concept Preview
- **Main Header (Navy `#2B3645`)**: Topic Name in All-Caps French (e.g., `LE PASSÉ RÉCENT`).
- **Subtitle (Cobalt Blue `#4A6EAA`)**: English Equivalent Title in quotes (e.g., `The "Just Did" Tense in French`).
- **Spotlight Card**: 1 primary example with translation (`Je viens de manger. → I have just eaten.`).
- **Summary Banner**: 1-sentence definition of when the tense/rule is used.

### 📍 Slide 2 — Concept & Intuitive Meaning ("What is [Topic]?")
- **Header**: `What is [Grammar Topic]?`
- **Explanation**: Simple English description of the situation/timeframe.
- **Core Takeaway**: `👉 In English we say "[English equivalent keyword]"` (e.g., `👉 In English we say "just"`).
- **2 Side-by-Side Examples**:
  - `I just finished my homework. → Je viens de finir mes devoirs.`
  - `She just arrived. → Elle vient d'arriver.`

### 📍 Slide 3 — Formation & Formula Breakdown
- **Header**: `Formation and Structure`
- **Formula Card (Cobalt `#406080` / `#4A6EAA`)**:
  - `Subject + verb (present) + de + infinitive verb`
- **Reassurance Note**: `The structure is very easy!`
- **Core Callout**: `👉 [Conjugated Verb] + de + [Infinitive Verb]`
- **Minimal Sample Box**: French sentence + English translation.

### 📍 Slide 4 — Conjugation Focus Matrix
- **Header**: `Conjugation of "[KEY VERB]"`
- **Subtitle**: `Then add de + verb`
- **Table / Matrix Grid**:
  - `Je viens` | `Nous venons`
  - `Tu viens` | `Vous venez`
  - `Il/Elle vient` | `Ils/Elles viennent`
- **Applied Example Sentence**: `Nous venons de finir le travail. / We just finished the work.`

### 📍 Slide 5 — Contextual Sentence Examples
- **Header**: `Examples in Context`
- **List of 4–5 High-Frequency Examples (Deep Navy `#1C4E8A`)**:
  - 1. `Je viens de manger.` (I just ate.)
  - 2. `Elle vient de partir.` (She just left.)
  - 3. `Nous venons de regarder un film.` (We just watched a movie.)
  - 4. `Ils viennent d'arriver.` (They just arrived.)

### 📍 Slide 6 — Quick Practice & Interactive Answer Key
- **Header**: `Quick Practice`
- **Sub-instruction (Slate `#4D6F96`)**: `Complete the sentences:`
- **4 Fill-in-the-Blank Questions**:
  - 1. `Je __________ de finir mes devoirs.`
  - 2. `Nous __________ de manger.`
  - 3. `Elle __________ d'arriver.`
  - 4. `Ils __________ de partir.`
- **Success Answer Key Box (Green `#639A48`)**:
  - `Answers:`
  - `1. viens`
  - `2. venons`
  - `3. vient`
  - `4. viennent`

---

## 4. HTML/CSS Implementation Template (Web Presentation Engine)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Passé Récent Presentation Style Engine</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Outfit:wght@800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-navy: #2B3645;
      --color-cobalt: #4A6EAA;
      --color-deep-navy: #1C4E8A;
      --color-green: #639A48;
      --color-slate-sub: #4D6F96;
      --color-bg: #FFFFFF;
    }

    body {
      background: #F1F5F9;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .ppt-slide-card {
      width: 900px;
      height: 520px;
      background: var(--color-bg);
      border-radius: 20px;
      box-shadow: 0 16px 40px rgba(43, 54, 69, 0.12);
      padding: 40px 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid #E2E8F0;
    }

    .slide-header {
      font-family: 'Outfit', sans-serif;
      font-size: 2.2rem;
      font-weight: 900;
      color: var(--color-navy);
      margin: 0;
    }

    .slide-subtitle {
      font-size: 1.15rem;
      color: var(--color-cobalt);
      font-weight: 700;
      margin-top: 6px;
    }

    .pointer-callout {
      background: rgba(74, 110, 170, 0.08);
      border-left: 5px solid var(--color-cobalt);
      padding: 14px 20px;
      border-radius: 8px;
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--color-navy);
      margin: 16px 0;
    }

    .formula-box {
      background: var(--color-navy);
      color: #FFFFFF;
      padding: 20px 28px;
      border-radius: 14px;
      font-size: 1.35rem;
      font-weight: 800;
      text-align: center;
    }

    .answer-key-box {
      background: rgba(99, 154, 72, 0.12);
      border: 2px solid var(--color-green);
      color: var(--color-green);
      padding: 16px;
      border-radius: 12px;
      font-weight: 800;
    }
  </style>
</head>
<body>
  <div class="ppt-slide-card">
    <div>
      <h1 class="slide-header">LE PASSÉ RÉCENT</h1>
      <div class="slide-subtitle">The "Just Did" Tense in French</div>
      <div class="pointer-callout">👉 In English we say "just"</div>
    </div>
    <div class="formula-box">
      Subject + venir (present) + de + infinitive verb
    </div>
  </div>
</body>
</html>
```
