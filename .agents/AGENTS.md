# Workspace Customization Rules

## CBSE Class 10 French Grammar Presentation Standard

Whenever the user asks to create or generate a presentation for any French Grammar topic (e.g. *Le Subjonctif*, *Le Conditionnel*, *Les Pronoms*, *Le Futur Antérieur*, *Passé Composé vs Imparfait*, etc.):

1. **Always use the `cbse-french-grammar-presentation` skill**.
2. **Content Adaptation**: Keep all content, examples, notes, and grammar rules provided by the user, while adapting them into the standard 12-slide presentation architecture.
3. **Layout & Engine**: Always use a 100% full-screen (`100vw` × `100vh`) self-contained presentation engine with zero external script dependencies.
4. **Settings & Customization Engine**: Include the Top-Right ⚙️ Settings Panel featuring:
   - 6 Color Themes (*French Tricolor Classic*, *Midnight Cyber*, *Sunrise Gold*, *Emerald Forest*, *Royal Purple*, *Minimalist Clean Studio*).
   - 7 Famous Google Fonts (*Plus Jakarta Sans*, *Outfit*, *Poppins*, *Playfair Display*, *Space Grotesk*, *Comic Neue*, *Cinzel*).
   - Font Size Scaling (88% to 130%) & Text Color Presets.
   - Live On-Screen Text Editing Mode (`contenteditable="true"`).
   - Dynamic Element Creator (`➕ Add Blue Box`, `➕ Add Gold Box`, `➕ Add Highlight Badge`, `➕ Add Bullet`).
   - `💾 Save Custom Text & Boxes` Button with `localStorage` persistence.
5. **Interactive Widgets & FX**: Always include Slide 8 Interactive Formula Calculator Lab, Slide 9 3D Flippable Flashcards, Slide 11 Interactive CBSE Practice Quiz with Web Audio sound FX & Canvas Fireworks burst.
6. **Visibility & Typography**: Always enlarge blue verb forms, highlighted terms, endings, and key grammar rules (`font-size: 1.35em`, `color: #002395`, `font-weight: 800`).
