// Read-only coverage audit of the Exceptions (step 3) / Pièges (step 4) slides
// against a CBSE Class 10 edge-case checklist. Does not modify the build.
// Usage: node audit-exceptions.js
const fs = require('fs');

const file = 'C:/claude/10 th/master-grammar-app.html';
const html = fs.readFileSync(file, 'utf8');

const decode = s => (s || '')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const norm = s => decode(s).toLowerCase()
  .normalize('NFD').replace(new RegExp('[\u0300-\u036f]', 'g'), '')
  .replace(/[\u2019']/g, "'").replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

// ---- slice the deck into slides ----
const slideRe = /<section data-slide-id="([^"]*)" data-step="([^"]*)"[^>]*>/g;
const marks = [];
let m;
while ((m = slideRe.exec(html)) !== null) {
  marks.push({ idx: m.index, id: m[1], step: decode(m[2]) });
}
const slides = marks.map((mk, i) => ({
  id: mk.id,
  step: mk.step,
  text: norm(html.slice(mk.idx, i + 1 < marks.length ? marks[i + 1].idx : html.length))
}));

const trapSlides = slides.filter(s => /exception|piege/i.test(norm(s.step)));
const allText = slides.map(s => s.text).join(' ');

// ---- the checklist ----
// `any` = matches anywhere in the deck; `strong` = the rule is actually explained
const CHECKS = [
  { tier: 'Advanced', name: 'Invariable participles (coute / valu / pese / couru)',
    re: /(coute|valu|pese|couru|vecu).{0,220}(invariable|jamais d'accord|pas d'accord|never agree)|(invariable|never agree).{0,220}(coute|valu|pese|couru)/ },
  { tier: 'Advanced', name: "Reflexive + following direct object (Elle s'est lave les mains)",
    re: /s'est lave les mains|se sont lave les mains|lave les mains/ },
  { tier: 'Advanced', name: 'auquel / duquel / desquels',
    re: /auquel|duquel|desquels|auxquels|auxquelles/ },
  { tier: 'Core', name: 'Partitive du/de la/des -> de after negation',
    re: /pas de|plus de.{0,40}partitif|partitif.{0,60}(negation|pas de)|du.{0,20}->.{0,20}de/ },
  { tier: 'Core', name: 'EXCEPT after etre (ce n\'est pas du lait)',
    re: /(sauf|except|mais pas).{0,40}etre|n'est pas (du|de la|un|une).{0,40}(etre|exception)|avec etre.{0,60}(du|de la|des)/ },
  { tier: 'Core', name: 'ce qui / ce que / ce dont',
    re: /ce qui.{0,30}ce que|ce dont/ },
  { tier: 'Core', name: 'Agreement with preceding COD (les fleurs que j\'ai achetees)',
    re: /cod.{0,60}(avant|precede|place avant)|(avant|precede).{0,60}cod|que j'ai .{0,20}ees/ },
  { tier: 'Core', name: 'etre-verbs agreement (DR & MRS VANDERTRAMP)',
    re: /vandertramp|dr.{0,4}mrs|verbes de mouvement.{0,60}etre|avec etre.{0,60}accord/ },
  { tier: 'Core', name: 'esperer que -> indicative',
    re: /esper\w*.{0,60}(indicatif|pas de subjonctif|indicative)/ },
  { tier: 'Core', name: 'ne ... que is restrictive, not negative',
    re: /ne.{0,6}que.{0,60}(restrict|seulement|not a negation|pas une negation)/ },
  { tier: 'Core', name: 'Imperative + pronoun (hyphens, moi/toi)',
    re: /donne-le-moi|-moi|me devient moi|imperatif.{0,80}(trait d'union|moi)/ },
  { tier: 'Core', name: 'mon amie (feminine noun, vowel-initial)',
    re: /mon amie|mon ecole|mon histoire|ma amie/ },
  { tier: 'Core', name: 'cet before vowel / mute h',
    re: /cet .{0,20}(arbre|homme|hotel|anorak)|cet.{0,40}(voyelle|h muet)/ },
  { tier: 'Core', name: 'Reported speech: si vs ce que',
    re: /demande si|si.{0,40}question.{0,40}oui|ce que.{0,40}(qu'est-ce que|interrogat)/ }
];

console.log('=== EXCEPTIONS / PIEGES COVERAGE AUDIT ===\n');
console.log('slides scanned      :', slides.length);
console.log('Exceptions/Pieges   :', trapSlides.length, 'slides\n');

const gaps = [];
CHECKS.forEach(c => {
  const inTrap = trapSlides.filter(s => c.re.test(s.text));
  const anywhere = c.re.test(allText);
  let status, note;
  if (inTrap.length) { status = 'COVERED '; note = 'in ' + inTrap.slice(0, 3).map(s => s.id).join(', '); }
  else if (anywhere) { status = 'PARTIAL '; note = 'mentioned in the deck, but not on an Exceptions/Pieges slide'; }
  else { status = 'MISSING '; note = 'not found anywhere'; gaps.push(c); }
  if (status === 'PARTIAL ') gaps.push(c);
  console.log(status + '[' + c.tier.padEnd(8) + '] ' + c.name);
  console.log('           ' + note + '\n');
});

console.log('=== SUMMARY ===');
console.log('  needs attention :', gaps.length, 'of', CHECKS.length);
gaps.forEach(g => console.log('   - [' + g.tier + '] ' + g.name));
