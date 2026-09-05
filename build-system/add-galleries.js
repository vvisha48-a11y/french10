// One-off: append a "Galerie visuelle" slide (3 visuals) to each of the 10
// topic-level Usages & Contexte stacks, and swap two hero photos for better
// art-directed ones. Additive: new data-slide-ids, new CSS classes only.
// Idempotent — re-running will not duplicate slides. Not part of build.sh.
const fs = require('fs'), path = require('path');
const SP = __dirname;

// ---------- helpers ----------
const fig = (token, alt, caption, credit) =>
`              <figure class="tv-figure fragment">
                <img class="topic-visual" src="@@PHOTO:${token}@@"
                     alt="${alt}"
                     style="max-width:100%;height:auto;">
                <figcaption class="tv-caption">${caption}<span class="tv-credit">${credit}</span></figcaption>
              </figure>`;

const svgFig = (svg, caption) =>
`              <figure class="tv-figure fragment">
${svg}
                <figcaption class="tv-caption">${caption}<span class="tv-credit">Schéma original — Master Grammar App</span></figcaption>
              </figure>`;

const slide = (id, title, body) =>
`
        <section data-slide-id="${id}" data-step="Galerie visuelle">
          <div class="slide-card">
            <div class="flag-stripe"></div>
            <div class="step-ribbon"><span class="sr-n">4</span> Galerie visuelle</div>
            <h2 class="editable-field">${title}</h2>
            <div class="topic-visual-grid">
${body}
            </div>
          </div>
        </section>
`;

// Shared SVG scaffolding. Theme variables only — never literal hex.
const S = (arr, label) => {
  // NB: the template literal must start on the SAME line as `return` — a newline
  // after `return` triggers automatic semicolon insertion and yields undefined.
  const inner = (Array.isArray(arr) ? arr : [arr]).filter(Boolean).join('\n');
  return `                <svg class="memo-svg" viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
${inner}
                </svg>`;
};

const box = (x, y, w, h, fill, stroke) =>
`                  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="var(${fill})" stroke="var(${stroke})" stroke-width="2.5"/>`;
const txt = (x, y, s, size, fill, anchor) =>
`                  <text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" font-size="${size}" fill="var(${fill})">${s}</text>`;

// ---------- the 13 diagrams ----------
const SVG = {};

SVG.timeline = S([
  txt(320, 34, 'Choisir un temps, c&#39;est choisir un moment', 21, '--heading-color'),
  `                  <line x1="52" y1="200" x2="588" y2="200" stroke="var(--card-border)" stroke-width="4"/>`,
  `                  <polygon points="588,200 570,190 570,210" fill="var(--card-border)"/>`,
  box(60, 150, 150, 100, '--box-gold-bg', '--crimson'),
  txt(135, 186, 'PASSÉ', 20, '--crimson'),
  txt(135, 214, 'j&#39;ai visité', 19, '--text-main'),
  txt(135, 238, 'je visitais', 19, '--text-main'),
  box(245, 150, 150, 100, '--box-blue-bg', '--green'),
  txt(320, 186, 'PRÉSENT', 20, '--green'),
  txt(320, 214, 'je visite', 19, '--text-main'),
  box(430, 150, 150, 100, '--box-gold-bg', '--purple'),
  txt(505, 186, 'FUTUR', 20, '--purple'),
  txt(505, 214, 'je visiterai', 19, '--text-main'),
  txt(505, 238, 'je vais visiter', 18, '--text-main'),
  txt(320, 300, 'Le repère de temps dans la phrase est votre consigne', 17, '--text-muted'),
  txt(320, 330, 'hier · maintenant · demain', 17, '--subheading-color'),
], 'Timeline diagram: past, present and future zones each listing the French tenses that belong to them');

SVG.filmstrip = S([
  txt(320, 32, 'Le décor tourne — l&#39;action coupe', 21, '--heading-color'),
  `                  <rect x="40" y="90" width="560" height="130" rx="8" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>`,
  ...[0,1,2,3,4,5,6,7,8,9].map(i =>
  `                  <rect x="${52 + i*56}" y="98" width="14" height="12" rx="2" fill="var(--card-border)"/>`),
  ...[0,1,2,3,4,5,6,7,8,9].map(i =>
  `                  <rect x="${52 + i*56}" y="200" width="14" height="12" rx="2" fill="var(--card-border)"/>`),
  txt(200, 155, 'il pleuvait · j&#39;étais · elle portait', 19, '--green'),
  txt(200, 180, 'IMPARFAIT — le décor', 16, '--text-muted'),
  `                  <rect x="392" y="112" width="150" height="86" rx="6" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="3.5"/>`,
  txt(467, 148, 'le téléphone', 17, '--crimson'),
  txt(467, 170, 'a sonné', 19, '--crimson'),
  txt(467, 244, 'PASSÉ COMPOSÉ', 16, '--crimson'),
  txt(467, 264, 'l&#39;action', 15, '--text-muted'),
  txt(320, 320, 'Le film continue au fond ; une seule image le coupe.', 17, '--text-main'),
  txt(320, 348, 'Décor = imparfait · Événement = passé composé', 16, '--subheading-color'),
], 'Film strip diagram: a continuous band of imparfait scene-setting interrupted by one bright passé composé frame');

SVG.subjTrigger = S([
  txt(320, 34, 'Le déclencheur commande le subjonctif', 21, '--heading-color'),
  box(30, 120, 170, 90, '--box-gold-bg', '--crimson'),
  txt(115, 152, 'Il faut', 22, '--crimson'),
  txt(115, 178, 'Je veux · Je doute', 15, '--text-main'),
  txt(115, 232, 'DÉCLENCHEUR', 14, '--text-muted'),
  txt(115, 252, 'volonté · émotion', 13, '--text-muted'),
  `                  <circle cx="250" cy="165" r="34" fill="var(--box-blue-bg)" stroke="var(--heading-color)" stroke-width="3"/>`,
  txt(250, 174, 'QUE', 20, '--heading-color'),
  `                  <line x1="200" y1="165" x2="214" y2="165" stroke="var(--card-border)" stroke-width="3"/>`,
  `                  <line x1="286" y1="165" x2="322" y2="165" stroke="var(--card-border)" stroke-width="3"/>`,
  `                  <polygon points="332,165 318,158 318,172" fill="var(--card-border)"/>`,
  box(340, 120, 270, 90, '--box-blue-bg', '--green'),
  txt(475, 152, 'tu fasses', 24, '--green'),
  txt(475, 180, 'nous partions · il vienne', 15, '--text-main'),
  txt(475, 232, 'SUBJONCTIF', 14, '--text-muted'),
  txt(320, 300, 'Deux sujets différents + que = subjonctif', 18, '--text-main'),
  txt(320, 332, 'Même sujet ? → infinitif : Je veux partir.', 16, '--subheading-color'),
], 'Diagram: a trigger expression feeds through the connector que into a subjunctive verb');

SVG.negVariants = S([
  txt(320, 32, 'Le sandwich change de garniture', 21, '--heading-color'),
  ...[['pas','rien de plus','ne … pas'],['plus','fini, terminé','ne … plus'],['jamais','zéro fois','ne … jamais'],['rien','aucune chose','ne … rien'],['personne','aucun être','ne … personne']]
    .map(([w, gloss], i) => {
      const y = 72 + i*58;
      return [
  `                  <rect x="36" y="${y}" width="64" height="42" rx="8" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2"/>`,
        txt(68, y+28, 'ne', 19, '--crimson'),
  `                  <rect x="112" y="${y}" width="150" height="42" rx="8" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2"/>`,
        txt(187, y+28, 'VERBE', 17, '--green'),
  `                  <rect x="274" y="${y}" width="132" height="42" rx="8" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2"/>`,
        txt(340, y+28, w, 19, '--crimson'),
        txt(424, y+28, gloss, 15, '--text-muted', 'start'),
      ].join('\n');
    }),
  txt(320, 372, 'Temps composés : le sandwich se referme sur l&#39;auxiliaire.', 16, '--subheading-color'),
], 'Diagram: five negation pairs, each wrapping ne and a second word around the conjugated verb');

SVG.pronOrder = S([
  txt(320, 32, 'L&#39;ordre des wagons ne change jamais', 21, '--heading-color'),
  ...[['me te se','nous vous','--crimson'],['le la les','','--green'],['lui leur','','--purple'],['y','','--heading-color'],['en','','--crimson']]
    .map(([a, b, col], i) => {
      const x = 24 + i*118;
      return [
  `                  <rect x="${x}" y="120" width="104" height="96" rx="10" fill="var(--box-blue-bg)" stroke="var(${col})" stroke-width="2.5"/>`,
        txt(x+52, 156, a, b ? 17 : 21, col),
        b ? txt(x+52, 180, b, 17, col) : '',
        txt(x+52, 240, String(i+1), 16, '--text-muted'),
      ].filter(Boolean).join('\n');
    }),
  `                  <line x1="24" y1="272" x2="616" y2="272" stroke="var(--card-border)" stroke-width="3"/>`,
  `                  <polygon points="616,272 600,264 600,280" fill="var(--card-border)"/>`,
  txt(320, 308, 'puis le VERBE', 20, '--green'),
  txt(320, 344, 'Il me le donne. · Je lui en parle. · Elle nous y emmène.', 16, '--text-main'),
  txt(320, 374, 'Jamais deux wagons de la même colonne.', 15, '--subheading-color'),
], 'Diagram: five ordered slots of French object pronouns forming a fixed train before the verb');

SVG.relBridge = S([
  txt(320, 32, 'Le pont entre deux phrases', 21, '--heading-color'),
  `                  <rect x="18" y="128" width="132" height="70" rx="10" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>`,
  txt(84, 158, 'Phrase 1', 17, '--green'),
  txt(84, 182, 'Le livre…', 16, '--text-main'),
  `                  <rect x="490" y="128" width="132" height="70" rx="10" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>`,
  txt(556, 158, 'Phrase 2', 17, '--green'),
  txt(556, 182, '…est là', 16, '--text-main'),
  `                  <path d="M150 163 Q320 74 490 163" fill="none" stroke="var(--card-border)" stroke-width="4"/>`,
  ...[['qui','sujet',196],['que','objet',272],['où','lieu/temps',348],['dont','de +',424]]
    .map(([w, role, x]) => [
  `                  <rect x="${x-42}" y="96" width="84" height="46" rx="8" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2.5"/>`,
      txt(x, 126, w, 20, '--crimson'),
      txt(x, 164, role, 14, '--text-muted'),
    ].join('\n')),
  txt(320, 250, 'Le livre qui est sur la table…', 17, '--text-main'),
  txt(320, 278, 'Le livre que j&#39;ai acheté…', 17, '--text-main'),
  txt(320, 306, 'La ville où je suis né…', 17, '--text-main'),
  txt(320, 334, 'Le livre dont je parle…', 17, '--text-main'),
  txt(320, 372, 'Un seul pronom relie — il ne se supprime jamais.', 15, '--subheading-color'),
], 'Diagram: an arch bridging two clauses, carrying the four relative pronouns qui, que, ou and dont with their roles');

SVG.discShift = S([
  txt(320, 32, 'Du direct à l&#39;indirect : trois réglages', 21, '--heading-color'),
  `                  <path d="M28 74 h250 a10 10 0 0 1 10 10 v58 a10 10 0 0 1 -10 10 h-208 l-24 26 v-26 h-18 a10 10 0 0 1 -10 -10 v-58 a10 10 0 0 1 10 -10 z" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>`,
  txt(155, 106, '« Je viens demain. »', 19, '--green'),
  txt(155, 132, 'DISCOURS DIRECT', 14, '--text-muted'),
  `                  <line x1="300" y1="112" x2="352" y2="112" stroke="var(--card-border)" stroke-width="3"/>`,
  `                  <polygon points="362,112 348,105 348,119" fill="var(--card-border)"/>`,
  `                  <rect x="372" y="74" width="248" height="78" rx="10" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2.5"/>`,
  txt(496, 106, 'Il dit qu&#39;il vient', 19, '--crimson'),
  txt(496, 132, 'DISCOURS INDIRECT', 14, '--text-muted'),
  ...[['PRONOM', 'je → il', 96],['TEMPS', 'viens → venait', 300],['TEMPS/LIEU', 'demain → le lendemain', 504]]
    .map(([k, v, x]) => [
  `                  <rect x="${x-92}" y="196" width="184" height="76" rx="10" fill="var(--card-bg)" stroke="var(--card-border)" stroke-width="2"/>`,
      txt(x, 224, k, 15, '--heading-color'),
      txt(x, 252, v, 16, '--text-main'),
    ].join('\n')),
  txt(320, 316, 'Si le verbe introducteur est au passé, les temps reculent.', 17, '--text-main'),
  txt(320, 350, 'Il a dit qu&#39;il venait le lendemain.', 17, '--subheading-color'),
], 'Diagram: a direct speech bubble converting into reported speech, with the three things that shift: pronoun, tense and time markers');

SVG.qstRegisters = S([
  txt(320, 32, 'Trois façons de poser la même question', 21, '--heading-color'),
  ...[['Tu viens ?','intonation','familier','--green',78],['Est-ce que tu viens ?','est-ce que','courant','--heading-color',162],['Viens-tu ?','inversion','soutenu / écrit','--purple',246]]
    .map(([q, how, reg, col, y]) => [
  `                  <rect x="36" y="${y}" width="360" height="62" rx="10" fill="var(--box-blue-bg)" stroke="var(${col})" stroke-width="2.5"/>`,
      txt(216, y+38, q, 21, col),
      txt(430, y+30, how, 16, '--text-main', 'start'),
      txt(430, y+52, reg, 14, '--text-muted', 'start'),
    ].join('\n')),
  `                  <line x1="20" y1="330" x2="620" y2="330" stroke="var(--card-border)" stroke-width="3"/>`,
  `                  <polygon points="620,330 604,322 604,338" fill="var(--card-border)"/>`,
  txt(60, 358, 'parlé', 15, '--text-muted', 'start'),
  txt(580, 358, 'écrit / examen', 15, '--text-muted', 'end'),
  txt(320, 358, 'formalité croissante', 15, '--subheading-color'),
], 'Diagram: the same question written three ways, ranked from spoken intonation to formal written inversion');

SVG.qstWords = S([
  txt(320, 32, 'Le mot interrogatif choisit la réponse', 21, '--heading-color'),
  ...[['qui','une personne',0,0],['que / quoi','une chose',1,0],['où','un lieu',2,0],
      ['quand','un moment',0,1],['comment','une manière',1,1],['pourquoi','une raison',2,1],
      ['combien','une quantité',0,2],['quel(le)','un choix précis',1,2],['lequel','parmi plusieurs',2,2]]
    .map(([w, gloss, cx, cy]) => {
      const x = 26 + cx*204, y = 66 + cy*100;
      return [
  `                  <rect x="${x}" y="${y}" width="188" height="82" rx="10" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2"/>`,
        txt(x+94, y+34, w, 20, '--crimson'),
        txt(x+94, y+62, gloss, 15, '--text-main'),
      ].join('\n');
    }),
  txt(320, 384, 'La réponse attendue vous dit quel mot employer.', 15, '--subheading-color'),
], 'Grid diagram: nine French question words each paired with the kind of answer it demands');

SVG.possAdj = S([
  txt(320, 32, 'L&#39;accord suit l&#39;objet, pas le propriétaire', 21, '--heading-color'),
  txt(150, 76, 'masculin', 16, '--text-muted'),
  txt(316, 76, 'féminin', 16, '--text-muted'),
  txt(482, 76, 'pluriel', 16, '--text-muted'),
  ...[['je','mon livre','ma sœur','mes amis',96],['tu','ton livre','ta sœur','tes amis',166],['il / elle','son livre','sa sœur','ses amis',236]]
    .map(([p, m, f, pl, y]) => [
      txt(46, y+30, p, 17, '--heading-color'),
  `                  <rect x="86" y="${y}" width="128" height="52" rx="8" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2"/>`,
      txt(150, y+32, m, 17, '--green'),
  `                  <rect x="252" y="${y}" width="128" height="52" rx="8" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2"/>`,
      txt(316, y+32, f, 17, '--crimson'),
  `                  <rect x="418" y="${y}" width="128" height="52" rx="8" fill="var(--card-bg)" stroke="var(--purple)" stroke-width="2"/>`,
      txt(482, y+32, pl, 17, '--purple'),
    ].join('\n')),
  txt(320, 328, 'Piège : mon amie — féminin, mais voyelle → mon, pas ma.', 17, '--text-main'),
  txt(320, 362, 'On accorde avec la chose possédée.', 16, '--subheading-color'),
], 'Table diagram: possessive adjectives for je, tu and il-elle across masculine, feminine and plural nouns');

SVG.possPron = S([
  txt(320, 32, 'L&#39;adjectif devient pronom', 21, '--heading-color'),
  `                  <rect x="40" y="86" width="240" height="70" rx="10" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>`,
  txt(160, 116, 'mon livre', 21, '--green'),
  txt(160, 142, 'ADJECTIF + nom', 14, '--text-muted'),
  `                  <line x1="288" y1="121" x2="342" y2="121" stroke="var(--card-border)" stroke-width="3"/>`,
  `                  <polygon points="352,121 338,114 338,128" fill="var(--card-border)"/>`,
  `                  <rect x="360" y="86" width="240" height="70" rx="10" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2.5"/>`,
  txt(480, 116, 'le mien', 21, '--crimson'),
  txt(480, 142, 'PRONOM — le nom disparaît', 14, '--text-muted'),
  ...[['le mien','la mienne',96,196],['les miens','les miennes',96,258]]
    .map(() => ''),
  ...[['le mien','la mienne','les miens','les miennes',200],['le tien','la tienne','les tiens','les tiennes',258],['le sien','la sienne','les siens','les siennes',316]]
    .map(([a,b,c,d,y]) => [
  `                  <rect x="30" y="${y}" width="140" height="46" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" stroke-width="2"/>`,
      txt(100, y+30, a, 17, '--text-main'),
  `                  <rect x="182" y="${y}" width="140" height="46" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" stroke-width="2"/>`,
      txt(252, y+30, b, 17, '--text-main'),
  `                  <rect x="334" y="${y}" width="140" height="46" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" stroke-width="2"/>`,
      txt(404, y+30, c, 17, '--text-main'),
  `                  <rect x="486" y="${y}" width="140" height="46" rx="8" fill="var(--card-bg)" stroke="var(--card-border)" stroke-width="2"/>`,
      txt(556, y+30, d, 17, '--text-main'),
    ].join('\n')),
  txt(320, 384, 'C&#39;est mon stylo → C&#39;est le mien.', 16, '--subheading-color'),
], 'Diagram: a possessive adjective plus noun collapsing into a possessive pronoun, with the full mien, tien and sien table');

SVG.demAdj = S([
  txt(320, 32, 'Ce, cet, cette, ces — un seul mot anglais', 21, '--heading-color'),
  ...[['ce','masculin','ce livre','--green',72],['cet','masc. + voyelle','cet arbre','--crimson',150],['cette','féminin','cette robe','--purple',228],['ces','pluriel','ces enfants','--heading-color',306]]
    .map(([w, when, ex, col, y]) => [
  `                  <rect x="40" y="${y}" width="118" height="58" rx="10" fill="var(--box-gold-bg)" stroke="var(${col})" stroke-width="2.5"/>`,
      txt(99, y+38, w, 24, col),
      txt(184, y+26, when, 16, '--text-muted', 'start'),
      txt(184, y+50, ex, 18, '--text-main', 'start'),
    ].join('\n')),
  txt(320, 388, 'cet devant a, e, i, o, u et h muet — pour l&#39;oreille.', 15, '--subheading-color'),
], 'Table diagram: the four French demonstrative adjectives with the noun type each one selects');

SVG.demCiLa = S([
  txt(320, 32, '-ci rapproche, -là éloigne', 21, '--heading-color'),
  `                  <line x1="60" y1="250" x2="580" y2="250" stroke="var(--card-border)" stroke-width="4"/>`,
  `                  <circle cx="120" cy="250" r="12" fill="var(--green)"/>`,
  `                  <circle cx="520" cy="250" r="12" fill="var(--crimson)"/>`,
  `                  <rect x="42" y="128" width="156" height="82" rx="10" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>`,
  txt(120, 160, 'ce livre-ci', 20, '--green'),
  txt(120, 190, 'celui-ci', 18, '--text-main'),
  `                  <rect x="442" y="128" width="156" height="82" rx="10" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2.5"/>`,
  txt(520, 160, 'ce livre-là', 20, '--crimson'),
  txt(520, 190, 'celui-là', 18, '--text-main'),
  txt(120, 292, 'près de moi', 16, '--text-muted'),
  txt(520, 292, 'plus loin', 16, '--text-muted'),
  txt(320, 250, '→', 24, '--card-border'),
  txt(320, 330, 'Je prends celui-ci, pas celui-là.', 18, '--text-main'),
  txt(320, 366, 'Sert à opposer deux choses que l&#39;on montre.', 15, '--subheading-color'),
], 'Diagram: a near-to-far axis contrasting the -ci and -la demonstrative forms');

// ---------- the 10 galleries ----------
const GALLERIES = {
'u-verbes-usage.html': slide('use-vrb-4', 'Trois moments, trois temps', [
  fig('vrb-horloge-gare',
      'The illuminated clock tower of the Gare de Lyon in Paris rising against a dusk sky, its hands marking a precise moment — the choice every French tense makes',
      'A station clock fixes one moment. A tense does the same: <em>je visite</em>, <em>j&#39;ai visité</em>, <em>je visiterai</em>.',
      'Photo : Gare de Lyon, Paris — Wikimedia Commons, CC BY-SA 3.0'),
  fig('vrb-terrasse-cafe',
      'Customers seated at small round tables on a Paris café terrace under an awning, the setting in which a French speaker softens a request into the conditional',
      'On the terrace you order in the conditionnel: <em>Je voudrais un café</em> — never <em>je veux</em>.',
      'Photo : terrasse de café, Paris — Wikimedia Commons, CC BY 2.0'),
  svgFig(SVG.timeline, 'Past, present and future each own a set of tenses. The time marker in the sentence tells you which zone you are in.'),
].join('\n')),

'u-verbes-filmscene.html': slide('use-ipc-4', 'Le décor et l&#39;action', [
  fig('ipc-rue-pluie',
      'A Paris street seen through falling rain, wet cobbles reflecting the shopfronts, nobody hurrying — the kind of continuous background the imparfait describes',
      'Rain falling, shops glowing, no beginning and no end: this is <em>il pleuvait</em> — the imparfait décor.',
      'Photo : rue sous la pluie, Paris 1er — Wikimedia Commons, CC BY 3.0'),
  fig('ipc-marathon',
      'Runners packed at the start of the Paris marathon in the instant before the gun, a single bounded event about to happen',
      'The gun fires once: <em>le départ a été donné</em>. A finished, dated event — passé composé.',
      'Photo : Marathon de Paris 2023 — Wikimedia Commons, CC BY-SA 4.0'),
  svgFig(SVG.filmstrip, 'The imparfait runs like the film underneath; the passé composé is the one frame that cuts across it.'),
].join('\n')),

'u-subjonctif-usage.html': slide('use-sub-4', 'Quand le français cesse d&#39;être neutre', [
  fig('sub-manifestation',
      'Demonstrators in a Paris street holding hand-painted banners demanding change, the public voice of wanting and requiring that the subjunctive carries',
      'A banner is a demand: <em>Il faut que ça change.</em> Volonté and nécessité both trigger the subjonctif.',
      'Photo : manifestation, Paris, mars 2024 — Wikimedia Commons, CC BY 2.0'),
  fig('sub-bougies',
      'Lit candles on a birthday cake in a darkened room, the moment a wish is made rather than a fact stated',
      'Blowing out candles is a wish, not a fact: <em>Je souhaite que tu sois heureux.</em>',
      'Photo : bougies d&#39;anniversaire — Rawpixel, CC0'),
  svgFig(SVG.subjTrigger, 'A trigger of will, emotion, necessity or doubt, plus <em>que</em>, plus a second subject — that combination is what forces the subjunctive.'),
].join('\n')),

'u-negation-usage.html': slide('use-neg-4', 'Dire non, en vrai', [
  fig('neg-etal-legumes',
      'A French market stall banked with fruit and vegetables, several crates already emptied by the end of the morning',
      'When the crate is empty the vendor says <em>je n&#39;ai plus de tomates</em> — and <em>de</em>, never <em>des</em>, after a negation.',
      'Photo : étal de fruits et légumes — Wikimedia Commons, CC BY-SA 4.0'),
  fig('neg-sens-interdit',
      'A French no-entry road sign with a supplementary plate reading sauf vélo, forbidding everyone except cyclists',
      'French signs negate in the infinitive, and <em>sauf</em> carves out the exception — the everyday cousin of <em>ne … que</em>.',
      'Photo : panneau sens interdit sauf vélo — Wikimedia Commons, CC BY-SA 4.0'),
  svgFig(SVG.negVariants, 'The two slices of bread stay put; only the filling changes — pas, plus, jamais, rien, personne.'),
].join('\n')),

'u-pronoms-usage.html': slide('use-pro-4', 'L&#39;ordre est un rail', [
  fig('pro-quai-gare',
      'A station platform in Annecy with a waiting train, passengers boarding in sequence along the carriages',
      'Boarding follows an order and so do pronouns: <em>Il me le donne</em>, never <em>il le me donne</em>.',
      'Photo : quais de la gare d&#39;Annecy — Wikimedia Commons, CC BY-SA 3.0'),
  fig('pro-petit-train',
      'A small tourist train at Arles with its carriages coupled in a fixed sequence, none able to swap places',
      'Carriages cannot swap places. Neither can <em>me · le · lui · y · en</em>.',
      'Photo : petit train des Alpilles, Arles — Wikimedia Commons, CC BY-SA 3.0'),
  svgFig(SVG.pronOrder, 'Five slots, always in this order, always before the verb — and never two pronouns from the same column.'),
].join('\n')),

'u-relatifs-usage.html': slide('use-rel-4', 'Relier deux idées', [
  fig('rel-bouquiniste',
      'A bouquiniste green box open on the Seine embankment in Paris, second-hand books stacked for browsing',
      '<em>Le livre que j&#39;ai acheté chez le bouquiniste</em> — <em>que</em> stands in for the object of the second clause.',
      'Photo : bouquiniste, quais de Seine, Paris — Wikimedia Commons, CC BY-SA 3.0'),
  fig('rel-village-toits',
      'Terracotta rooftops of the village of Saint-Émilion packed together below a church tower',
      '<em>Le village où je suis né</em> — <em>où</em> covers place, and time as well: <em>le jour où…</em>',
      'Photo : toits de Saint-Émilion — Wikimedia Commons, CC BY-SA 4.0'),
  svgFig(SVG.relBridge, 'One relative pronoun carries the whole bridge, and its choice depends on the job it does in the second clause.'),
].join('\n')),

'u-discours-usage.html': slide('use-dis-4', 'Rapporter ce qui a été dit', [
  fig('dis-kiosque',
      'A green Paris newspaper kiosk on avenue Marceau, its racks filled with the day&#39;s headlines',
      'Headlines report: <em>Le ministre a déclaré qu&#39;il démissionnerait.</em> Reported speech is the language of the press.',
      'Photo : kiosque à journaux, avenue Marceau, Paris — Wikimedia Commons, CC0'),
  fig('dis-cabine-tel',
      'A repurposed French telephone box standing on a village street, the place a message was once passed on to someone else',
      'Passing a message on forces the shift: « Je viens » becomes <em>il a dit qu&#39;il venait</em>.',
      'Photo : cabine téléphonique — Wikimedia Commons, CC BY-SA 3.0'),
  svgFig(SVG.discShift, 'Three things move when speech is reported: the pronoun, the tense, and the time or place marker.'),
].join('\n')),

'u-question-usage.html': slide('use-qst-4', 'Poser la bonne question', [
  fig('qst-salle-classe',
      'Students at desks in a French lycée classroom with several hands raised, the everyday setting for asking and answering in French',
      'In class all three registers are heard — but the exam wants <em>est-ce que</em> or the inversion.',
      'Photo : salle de classe, lycée français — Wikimedia Commons, CC BY-SA 4.0'),
  svgFig(SVG.qstRegisters, 'The same question, three ways: rising intonation is spoken, <em>est-ce que</em> is neutral, inversion is written and formal.'),
  svgFig(SVG.qstWords, 'Work backwards from the answer you expect — that is what selects the question word.'),
].join('\n')),

'u-possessifs-usage.html': slide('use-pos-4', 'À qui est-ce ?', [
  fig('pos-trousseau-cles',
      'A hand holding out a bunch of keys on a ring, the ordinary gesture of claiming something as one&#39;s own',
      '<em>Ce sont mes clés</em> — and if the noun disappears, <em>ce sont les miennes</em>.',
      'Photo : trousseau de clés — Wikimedia Commons, CC BY 2.0'),
  svgFig(SVG.possAdj, 'The possessive agrees with the thing owned, not the owner — which is exactly backwards from English.'),
  svgFig(SVG.possPron, 'Drop the noun and the adjective becomes a pronoun, complete with its own article.'),
].join('\n')),

'u-demonstratifs-usage.html': slide('use-dem-4', 'Celui-ci ou celui-là ?', [
  fig('dem-vitrine-paris',
      'A Paris boutique window displaying patterned tights and socks arranged in rows, the situation in which a shopper points and says this one',
      'In front of the window you point: <em>cette robe-ci</em>, <em>ces chaussettes-là</em>.',
      'Photo : vitrine de boutique, Paris — Wikimedia Commons, CC BY-SA 4.0'),
  svgFig(SVG.demAdj, 'English has one word. French picks between four, and <em>cet</em> exists purely so the sound flows.'),
  svgFig(SVG.demCiLa, 'Add <em>-ci</em> or <em>-là</em> only when you are contrasting two things you can point at.'),
].join('\n')),
};

// ---------- hero photo swaps (better art direction, same slot) ----------
const HERO = [
  ['u-verbes-filmscene.html',
   '@@PHOTO:photo-1489599849927-2ee91cede3ba@@', '@@PHOTO:ipc-projecteur@@',
   'Rows of red seats in an empty cinema',
   'A 70 mm film projector threaded and running in a Paris cinema, the reel turning continuously while single frames flash past the gate'],
  ['u-relatifs-usage.html',
   '@@PHOTO:photo-1519677100203-a0e668c92439@@', '@@PHOTO:rel-pont-neuf@@',
   'A stone bridge joining two banks of a river',
   'The Pont Neuf spanning the Seine in Paris, a single structure joining two separate banks the way a relative pronoun joins two clauses'],
];

// ---------- apply ----------
let added = 0, swapped = 0;
for (const [file, html] of Object.entries(GALLERIES)) {
  const p = path.join(SP, file);
  let s = fs.readFileSync(p, 'utf8');
  const id = html.match(/data-slide-id="([^"]+)"/)[1];
  if (s.includes(`data-slide-id="${id}"`)) {
    if (!process.argv.includes('--force')) { console.log('  skip (present) %s', id); continue; }
    const re = new RegExp('\\n\\s*<section data-slide-id="' + id + '"[\\s\\S]*?\\n        </section>\\n', 'g');
    s = s.replace(re, '\n');
  }
  // insert before the final stack-closing </section>
  const i = s.lastIndexOf('\n      </section>');
  if (i < 0) { console.error('  NO STACK CLOSE in ' + file); process.exit(1); }
  s = s.slice(0, i) + '\n' + html + s.slice(i);
  fs.writeFileSync(p, s);
  console.log('  added  %s -> %s', id, file);
  added++;
}
for (const [file, oldTok, newTok, oldAlt, newAlt] of HERO) {
  const p = path.join(SP, file);
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes(newTok)) { console.log('  skip (swapped) %s', file); continue; }
  if (!s.includes(oldTok)) { console.error('  HERO TOKEN NOT FOUND in ' + file); process.exit(1); }
  s = s.split(oldTok).join(newTok).split('alt="' + oldAlt + '"').join('alt="' + newAlt + '"');
  fs.writeFileSync(p, s);
  console.log('  hero   %s', file);
  swapped++;
}
console.log('\ngalleries added: %d, hero photos swapped: %d', added, swapped);
