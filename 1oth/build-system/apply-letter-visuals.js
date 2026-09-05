// Attach `visual` ids to letter lessons and tighten the prose the diagrams now
// carry. Assert-on-miss: any topic or paragraph that no longer matches fails the
// run loudly rather than silently leaving stale text on the slide.
//
// MODEL LETTERS ARE NEVER TOUCHED — only topics with kind === 'lesson'.
const fs = require('fs');

const FILE = 'letterdata.js';
let src = fs.readFileSync(FILE, 'utf8');
const head = src.slice(0, src.indexOf('['));
const tail = src.slice(src.lastIndexOf(']') + 1);
const D = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']') + 1));

const byId = {};
D.forEach(g => g.topics.forEach(t => { byId[t.id] = t; }));

// id -> { visual, fr: [...tightened], en: [...tightened] }
// Where a diagram now shows the detail, the prose shrinks to the point the
// diagram cannot make on its own.
const EDITS = {
  squelette: {
    visual: 'skeleton',
    fr: ['Une lettre amicale a toujours les mêmes zones, dans le même ordre, aux mêmes endroits sur la page.',
         'Dessinez ce cadre avant d’écrire. Deux minutes suffisent, et vous protégez les points qui ne dépendent pas du tout de votre français.'],
    en: ['A friendly letter always has the same zones, in the same order, in the same places on the page.',
         'Draw this frame before you write. Two minutes is enough, and it protects the marks that do not depend on your French at all.']
  },
  'lieu-date': {
    visual: 'datebar',
    fr: ['La ligne du lieu et de la date se place en haut à droite.',
         'Trois pièges vivent dans cette ligne : la virgule après la ville, le jour en chiffre ordinaire, et le mois toujours en minuscule.'],
    en: ['The place-and-date line goes at the top right.',
         'Three traps live in this line: the comma after the town, the day as a plain number, and the month always in lower case.']
  },
  'appel-signature': {
    visual: 'salute',
    fr: ['L’appel se place à gauche et se termine toujours par une virgule : « Cher » devant un prénom masculin, « Chère » devant un prénom féminin.',
         'La signature se place à droite, sur deux lignes, et s’accorde au lecteur.',
         'Règle stricte : le prénom seul. Un nom de famille ou un titre transforme la lettre amicale en lettre formelle et coûte des points.'],
    en: ['The salutation goes on the left and always ends with a comma: "Cher" before a male name, "Chère" before a female one.',
         'The signature goes on the right, on two lines, and matches the reader.',
         'Strict rule: first name only. A surname or a title turns a friendly letter into a formal one and costs marks.']
  },
  budget: {
    visual: 'budget',
    fr: ['Visez 80 mots. Entre 75 et 90, vous êtes dans la bonne zone. Beaucoup plus long, et les fautes s’accumulent sans rapporter un seul point de plus.',
         'L’ouverture et la clôture s’apprennent par cœur. Seul le corps change selon le sujet.'],
    en: ['Aim for 80 words. Between 75 and 90 you are in the right zone. Much longer and the mistakes pile up without earning a single extra mark.',
         'The opening and the closing are learned by heart. Only the body changes with the topic.']
  },
  ouvrir: {
    visual: 'open-close',
    fr: ['Apprenez trois ouvertures et vous n’en aurez jamais besoin d’une quatrième.',
         'Chaque ouverture a sa clôture. Ensemble, elles écrivent environ trente de vos quatre-vingts mots.'],
    en: ['Learn three openings and you will never need a fourth.',
         'Every opening has its closing. Together they write about thirty of your eighty words.']
  },
  charnieres: {
    visual: 'linkers',
    fr: ['Sans eux, le corps de la lettre est une liste de phrases sans lien. Avec eux, c’est un paragraphe qui se tient — et c’est exactement ce que cherche l’examinateur.',
         'En pratique : « D’abord, il faut que tu te reposes. Ensuite, mange des fruits frais. De plus, bois beaucoup d’eau. Cependant, évite le fast-food. Enfin, fais un peu de sport parce que cela aide à récupérer. »'],
    en: ['Without them the body of the letter is a list of unconnected sentences. With them it is a paragraph that holds together — exactly what the examiner is looking for.',
         'In practice: "D’abord, il faut que tu te reposes. Ensuite, mange des fruits frais. De plus, bois beaucoup d’eau. Cependant, évite le fast-food. Enfin, fais un peu de sport parce que cela aide à récupérer."']
  },
  'tu-jamais-vous': {
    visual: 'register',
    fr: ['Toutes les lettres de la Section B s’adressent à un ami, un cousin, un parent ou un correspondant de votre âge. Cela veut dire « tu » du premier mot au dernier.',
         '« Comment allez-vous ? » est du français correct — mais c’est la mauvaise lettre, et cela coûte le point de registre.'],
    en: ['Every Section B letter is written to a friend, a cousin, a parent or a pen-friend your own age. That means "tu" from the first word to the last.',
         '"Comment allez-vous ?" is correct French — but it is the wrong letter, and it costs you the register mark.']
  },
  'prac-checklist': {
    visual: 'checklist',
    fr: ['Gardez deux minutes à la fin. Cette relecture vaut plusieurs points et ne demande aucune inspiration.',
         'La faute la plus fréquente n’arrive pas au début : on commence en « tu », on glisse vers « vous » au deuxième paragraphe, et on ne le remarque jamais.'],
    en: ['Keep two minutes at the end. This re-read is worth several marks and requires no inspiration at all.',
         'The commonest mistake does not happen at the start: you begin with "tu", drift into "vous" in the second paragraph, and never notice.']
  }
};

const problems = [];
let touched = 0;

Object.keys(EDITS).forEach(id => {
  const t = byId[id];
  if (!t){ problems.push('topic not found: ' + id); return; }
  if (t.kind !== 'lesson'){ problems.push('refusing to edit non-lesson topic: ' + id); return; }
  const e = EDITS[id];

  if (e.fr.length !== e.en.length){ problems.push('fr/en length mismatch for ' + id); return; }
  t.fr.paras = e.fr;
  t.en.paras = e.en;
  t.visual = e.visual;
  delete t.blueprint;          // migrate the orphaned flag the renderer never read
  touched++;
});

// nothing outside `lesson` may have been altered
let letters = 0;
D.forEach(g => g.topics.forEach(t => { if (t.kind === 'letter') letters++; }));
if (letters !== 17) problems.push('expected 17 model letters, found ' + letters);

if (problems.length){
  console.error('FAILED:');
  problems.forEach(p => console.error('   ' + p));
  process.exit(1);
}

fs.writeFileSync(FILE, head + JSON.stringify(D, null, 2) + tail);
console.log('  lessons updated  :', touched);
console.log('  model letters    :', letters, '(untouched)');
