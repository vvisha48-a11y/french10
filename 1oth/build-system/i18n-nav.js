// Translate the Family Navigator's INTERFACE to English.
// Study terms stay French on purpose: sub-family titles (Famille Prendre,
// Réguliers, Autres en -re), the tab labels, every `model`, every `demo`
// conjugation, and the pronouns. Only chrome and explanations change.
//
// Every pair is asserted: a string that no longer matches fails the run rather
// than silently leaving French on the slide.
const fs = require('fs');

function apply(file, pairs){
  let s = fs.readFileSync(file, 'utf8');
  const missing = [];
  pairs.forEach(([from, to]) => {
    if (s.indexOf(from) === -1){ missing.push(from.slice(0, 70)); return; }
    s = s.split(from).join(to);
  });
  if (missing.length){
    console.error('NOT FOUND in ' + file + ':');
    missing.forEach(m => console.error('   ' + m));
    process.exit(1);
  }
  fs.writeFileSync(file, s);
  console.log('  ' + file + ': ' + pairs.length + ' strings translated');
}

/* ---------------- slide markup ---------------- */
apply('t-conjlab.html', [
  ['🧭 Familles de verbes — 500 verbes, 4 groupes',
   '🧭 Verb Families — 500 verbs, 4 groups'],
  ['Une <strong>famille</strong> = un groupe de verbes qui suivent le même modèle. Apprends le modèle une fois, et toute la famille suit. Choisis une terminaison, puis une famille, puis un verbe.',
   'A <strong>family</strong> is a group of verbs that follow the same pattern. Learn the pattern once, and the whole family follows. Choose an ending, then a family, then a verb.']
]);

/* ---------------- engine: UI chrome ---------------- */
apply('e-engine.html', [
  // field rename: the text is English now, so the key should not say _fr
  ['rule_fr:', 'rule_en:'],
  ['s.rule_fr', 's.rule_en'],

  // chrome strings
  ['Ouvrir dans le Lab →', 'Open in the Lab →'],
  ['placeholder="chercher dans les \' + list.length + \' verbes…">',
   'placeholder="Search within the \' + list.length + \' verbs…">'],
  ['Choisis une famille ci-dessus pour voir sa règle et ses verbes.',
   'Choose a family above to see its pattern and its verbs.'],
  ['Aucun verbe ne correspond.', 'No verb matches.'],
  ["' verbes</span>'", "' verbs</span>'"],
  ["buckets[curSub.id].length + ' verbes'", "buckets[curSub.id].length + ' verbs'"],
  ['Présent — modèle : <b>', 'Present — model: <b>'],

  // tab hints
  ["hint:'le plus grand groupe'", "hint:'the biggest group'"],
  ["hint:'quatre comportements'", "hint:'four behaviours'"],
  ["hint:'sept modèles'", "hint:'seven models'"],
  ["hint:'à apprendre par cœur'", "hint:'learn these by heart'"],

  // -ER rules
  ['Aucun changement de radical. On enlève -er et on ajoute les terminaisons.',
   'No stem change at all. Drop the -er and add the endings.'],
  ['Le son doit rester doux devant O : -ger garde le <b>e</b>, -cer prend une <b>cédille</b> — mais seulement à la forme NOUS.',
   'The soft sound has to survive before O: -ger keeps its <b>e</b>, -cer takes a <b>cedilla</b> — but only in the NOUS form.'],
  ['Le <b>y</b> devient <b>i</b> devant un e muet — donc partout sauf à nous et vous.',
   'The <b>y</b> becomes <b>i</b> before a silent e — so everywhere except nous and vous.'],
  ['L’accent bascule en <b>è</b> quand la syllabe suivante est muette — encore une fois, nous et vous y échappent.',
   'The accent flips to <b>è</b> when the next syllable is silent — once again, nous and vous escape it.'],
  ['La consonne <b>double</b> (ll / tt) devant un e muet. Attention : <i>geler</i> et <i>épeler</i> prennent un accent, pas une double consonne.',
   'The consonant <b>doubles</b> (ll / tt) before a silent e. Careful: <i>geler</i> and <i>épeler</i> take an accent instead, not a double consonant.'],

  // -IR rules
  ['Le vrai 2ᵉ groupe : il insère <b>-iss-</b> aux trois personnes du pluriel.',
   'The true 2nd group: it inserts <b>-iss-</b> in all three plural persons.'],
  ['Ils finissent en -ir mais se conjuguent avec les terminaisons du <b>1ᵉr groupe</b>.',
   'They end in -ir but take the <b>1st-group</b> endings instead.'],
  ['Pas de -iss-. La <b>consonne finale du radical tombe</b> au singulier.',
   'No -iss- here. The <b>last consonant of the stem drops</b> in the singular.'],
  ['Radical en <b>ien-</b> au singulier et à la 3ᵉ du pluriel ; futur irrégulier en <b>viendr-</b>.',
   'The stem becomes <b>ien-</b> in the singular and in the 3rd person plural; the future stem is an irregular <b>viendr-</b>.'],
  ['Petites familles à part : courir, mourir, fuir, haïr, acquérir.',
   'Small families of their own: courir, mourir, fuir, haïr, acquérir.'],

  // -RE rules
  ['Le 3ᵉ groupe régulier : à la 3ᵉ personne du singulier, <b>aucune terminaison</b>.',
   'The regular 3rd group: in the 3rd person singular there is <b>no ending at all</b>.'],
  ['Le <b>d</b> tombe au pluriel, et le <b>n double</b> à la 3ᵉ personne du pluriel.',
   'The <b>d</b> drops in the plural, and the <b>n doubles</b> in the 3rd person plural.'],
  ['Un seul <b>t</b> au singulier, les deux reviennent au pluriel.',
   'One <b>t</b> in the singular, both return in the plural.'],
  ['Accent circonflexe sur le <b>î</b> devant un <b>t</b>, et <b>-ss-</b> au pluriel.',
   'A circumflex on the <b>î</b> before a <b>t</b>, and <b>-ss-</b> in the plural.'],
  ['Le radical prend <b>-is-</b> au pluriel.',
   'The stem takes <b>-is-</b> in the plural.'],
  ['Le <b>d</b> disparaît et le radical prend <b>gn</b> au pluriel.',
   'The <b>d</b> disappears and the stem takes <b>gn</b> in the plural.'],
  ['Modèles isolés : dire, écrire, lire, vivre, suivre, battre, vaincre, croire…',
   'One-off models, each learned on its own: dire, écrire, lire, vivre, suivre, battre, vaincre, croire…'],

  // Irregulars
  ['Aucun modèle. Ce sont les quatre verbes les plus fréquents du français et ils servent aussi d’<b>auxiliaires</b>.',
   'No pattern at all. These are the four most frequent verbs in French, and they double as <b>auxiliaries</b>.'],
  ['🥾 <b>Pourquoi « verbes bottes » ?</b> Écris les six formes en colonne et entoure celles qui partagent le radical irrégulier : je / tu / il et ils sont <b>dedans</b>, nous et vous tombent <b>dehors</b>. Le dessin ressemble à une botte.',
   '🥾 <b>Why “boot verbs”?</b> Write the six forms in a column and draw a line round the ones sharing the irregular stem: je / tu / il and ils sit <b>inside</b>, while nous and vous fall <b>outside</b>. The shape looks like a boot.'],
  ['Ils n’existent qu’à la <b>3ᵉ personne du singulier</b>. Pas de « je » possible.',
   'These exist only in the <b>3rd person singular</b>. There is no “je” form.'],
  ['Verbes qui ne correspondent à aucune famille connue — ouvre-les dans le Lab pour voir leur conjugaison complète.',
   'Verbs that match no known family — open them in the Lab to see their full conjugation.']
]);

console.log('DONE');
