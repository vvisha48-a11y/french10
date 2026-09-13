// Text and tags that could not be extracted from the PDFs -- only read.
//
// The 2022, 2023 and 2024 PDFs draw part of their text as glyphs with no Unicode
// mapping. A person reading the paper sees the sentences; no extractor can. Every
// apostrophe in those three papers is absent from the text layer, fourteen items
// are empty, and in Section C the damage also breaks the STRUCTURE -- a heading
// whose text is half missing stops looking like a heading, so its items get
// attached to the question above.
//
// So for those three papers, Section C is supplied here in full: read off the
// pages rendered from the original PDFs, at the page numbers named below. Nothing
// in this file is inferred from a pattern; it is transcription.
//
// Verb tenses are the other thing no rule can supply. "Conjuguez les verbes entre
// parenthèses" does not say which tense each item wants -- the item's own context
// and its three options do. Those judgements are recorded per item with their
// provenance: named by the paper, confirmed by the teacher, or still only read
// from the sentence. See the C / T / I helpers below.

/* ------------------------------------------------------------------ *
 *  SECTIONS - a whole section's questions, replacing what was parsed.
 *  Keyed "<paperId> <sectionId>".
 * ------------------------------------------------------------------ */
module.exports.SECTIONS = {

  /* ---------------- 2022, Section C, pages 5-6 ---------------- */
  'qp2022 C': { page: '5-6', marks: 15, questions: [
    { num: '3', marks: 5, choose: 5, tally: '5 × 1 = 5',
      instruction: 'Conjuguez les verbes entre parenthèses :',
      items: [
        { label: 'a', text: 'Elle __________ dans une semaine. (revenir)' },
        { label: 'b', text: "Mon frère __________ l'article hier. (lire)" },
        { label: 'c', text: 'Il y a quelques secondes, ton portable ___________. (sonner)' },
        { label: 'd', text: 'Aussitôt que les acteurs ___________ sur la scène, nous prendrons les photos. (monter)' },
        { label: 'e', text: '« ___________ attendre un peu, s’il vous plaît » dit le secrétaire. (vouloir)' },
        { label: 'f', text: 'Je ___________ dans une heure. (se coucher)' },
        { label: 'g', text: 'Quand les éléphants ont traversé le chemin, le train ___________. (déjà passer)' }
      ] },
    { num: '4', marks: 5, tally: '5 × 1 = 5',
      instruction: 'Mettez les phrases au style direct ou indirect, selon le cas :',
      items: [
        { label: 'a', text: 'Le directeur lui dit de ne pas regarder la réponse.' },
        { label: 'b', text: 'Elle te demande, « Peux-tu m’envoyer la lettre ? »' },
        { label: 'c', text: 'Jean me demande quel temps il fait dans ma ville.' },
        { label: 'd', text: 'Elena nous dit, « Je vais vous téléphoner ce soir. »' },
        { label: 'e', text: 'Je te dis, « Voyage avec moi ! »' }
      ] },
    { num: '5', marks: 5, tally: '5 × 1 = 5',
      instruction: 'Trouvez la question :',
      items: [
        { label: 'a', text: 'Il a des cheveux blonds.' },
        { label: 'b', text: "Elle cuisine avec de l’huile d’olive." },
        { label: 'c', text: 'Ils sont arrivés de Montréal.' },
        { label: 'd', text: 'Il fait un temps merveilleux !' },
        { label: 'e', text: 'Ces croissants sont délicieux.' }
      ] },
    { num: '6', marks: 5, tally: '5 × 1 = 5',
      instruction: 'Remplacez les mots soulignés par les pronoms possessifs :',
      items: [
        { label: 'a', text: "J’ai parlé à mon professeur et tu dois parler à ton professeur." },
        { label: 'b', text: 'Où avez-vous garé votre voiture ? Notre voiture est au sous-sol.' },
        { label: 'c', text: 'Je préfère tes poèmes, mes poèmes sont ennuyeux.' },
        { label: 'd', text: 'Ma mère vient de rencontrer ta mère.' },
        { label: 'e', text: 'Elle se souvient de son séjour en France. Vous souvenez-vous de votre séjour ?' }
      ] }
  ] },

  /* ---------------- 2023, Section C, pages 6-9 ---------------- */
  'qp2023 C': { page: '6-9', marks: 30, questions: [
    { num: '4', marks: 5, choose: 5, tally: '5 × 1 = 5',
      instruction: 'Conjuguez les verbes entre parenthèses :',
      items: [
        { label: 'i',   text: 'Je veux __________ (se coucher) tôt ce soir.' },
        { label: 'ii',  text: "Il y a une heure, nous ________ (compléter) l’affiche." },
        { label: 'iii', text: '___________ (Vouloir) écrire votre nom sur la fiche !' },
        { label: 'iv',  text: 'Dans quelques instants, il _________ (présenter) son œuvre.' },
        { label: 'v',   text: "S’il ________ (faire) froid, il ne sortirait pas." },
        { label: 'vi',  text: "Dès que l’actrice _________ (revenir), le réalisateur racontera l’histoire." },
        { label: 'vii', text: "L’année dernière, elles _________ (se rencontrer) dans la rue." }
      ] },
    { num: '5', marks: 5, choose: 5, tally: '5 × 1 = 5',
      instruction: 'Mettez les phrases au style direct ou indirect, selon le cas :',
      items: [
        { label: 'i',   text: "Je leur demande s’ils peuvent visiter mon école." },
        { label: 'ii',  text: "Paul lui dit de l’accompagner au stade." },
        { label: 'iii', text: 'Mon père me demande, “Qu’est-ce qui t’ennuie ?”' },
        { label: 'iv',  text: '« Faites-vous du yoga tous les jours ? », notre ami nous demande.' },
        { label: 'v',   text: 'Ma mère me dit que je pourrai sortir sans elle.' },
        { label: 'vi',  text: "Harry lui demande ce qu’il voudrait comme cadeau." },
        { label: 'vii', text: "L’agent de police nous dit, « Il faut conduire prudemment »." }
      ] },
    { num: '6(a)', marks: 5, tally: '5 × 1 = 5',
      instruction: 'Trouvez la question :',
      items: [
        { label: 'i',   text: 'Miriam arrive demain.' },
        { label: 'ii',  text: 'Je mange la salade avec du pain.' },
        { label: 'iii', text: "Parce qu’il fait très chaud." },
        { label: 'iv',  text: 'Les magasins sont fermés.' },
        { label: 'v',   text: 'Elle a acheté des fleurs' }
      ] },
    { num: '6(b)', marks: 5, isAlternative: true, tally: '5 × 1 = 5',
      instruction: 'Répondez aux questions suivantes à la forme négative :',
      items: [
        { label: 'i',   text: 'Te couches-tu toujours à minuit ?' },
        { label: 'ii',  text: 'Mets-tu du sucre dans ton café ?' },
        { label: 'iii', text: 'As-tu lu Astérix et Tintin ?' },
        { label: 'iv',  text: 'Avez-vous déjà copié les dessins ?' },
        { label: 'v',   text: "Quelqu’un vient de frapper à la porte ?" }
      ] },
    { num: '7(a)', marks: 5, tally: '10 × ½ = 5',
      instruction: 'Remplissez les blancs par les adjectifs ou les pronoms possessifs :',
      items: [
        { label: 'i',   text: 'Je vais prendre __________ roman, prenez _________ aussi !' },
        { label: 'ii',  text: "Le garçon lui a servi ________ dessert, j’attends _________ ." },
        { label: 'iii', text: 'Chers amis, où sont ________ photos ? Nous avons mis ________ dans la boîte.' },
        { label: 'iv',  text: "La jeune fille s’occupe bien de ________ parents, et lui, s’occupe-t-il de ________ ?" },
        { label: 'v',   text: '_________ voix est plus belle que _________ .' }
      ] },
    { num: '7(b)', marks: 5, isAlternative: true, tally: '10 × ½ = 5',
      instruction: 'Complétez avec les adjectifs ou les pronoms démonstratifs :',
      items: [
        { label: 'i',   text: '________ boisson fraîche est meilleure que ________ .' },
        { label: 'ii',  text: "J’aime ________ restaurant. ________ qui est derrière le musée est trop petit." },
        { label: 'iii', text: "J’ai emprunté 2 bandes dessinées, _________ pour toi et _________ pour moi." },
        { label: 'iv',  text: 'Voulez-vous visiter ________ maison ou ________ ?' },
        { label: 'v',   text: 'Écoutes-tu _________ vieilles chansons et _________ de Elvis Presley ?' }
      ] },
    { num: '8(a)', marks: 5, tally: '5 × 1 = 5',
      instruction: 'Reliez les phrases avec les pronoms relatifs simples ou composés :',
      items: [
        { label: 'i',   text: "J’ai assisté à ce concert. Tu m’as parlé de ce concert." },
        { label: 'ii',  text: "Elle a reçu la lettre. Tu l’as écrite." },
        { label: 'iii', text: 'Nous ne connaissons pas cette dame. Vous parlez avec elle.' },
        { label: 'iv',  text: "Le professeur a trouvé les erreurs. Je n’ai pas fait attention à ces erreurs." },
        { label: 'v',   text: "Voilà Sophie. Elle m’a invité au dîner." }
      ] },
    { num: '8(b)', marks: 5, isAlternative: true, tally: '5 × 1 = 5',
      instruction: 'Remplacez les noms soulignés par les pronoms personnels, y, en, etc. :',
      items: [
        { label: 'i',   text: "Kathy n’a pas accepté la bourse." },
        { label: 'ii',  text: 'Entre dans ce salon !' },
        { label: 'iii', text: 'Ma cousine va te donner des fleurs.' },
        { label: 'iv',  text: 'Ce sont mes tantes qui rient.' },
        { label: 'v',   text: 'Je ne montre pas ces peintures à mes camarades.' }
      ] },
    { num: '9', marks: 5, choose: 5, tally: '5 × 1 = 5',
      instruction: 'Mettez au subjonctif :',
      items: [
        { label: 'i',   text: 'Il faut que nous (savoir) le chemin.' },
        { label: 'ii',  text: 'Elle ne pense pas que tu (venir) à la soirée.' },
        { label: 'iii', text: "Je suis content que tes amis (être) à l’heure pour le concours." },
        { label: 'iv',  text: 'Elle ne veut pas que nous (avoir) du mal à la comprendre.' },
        { label: 'v',   text: 'Il exige que je (finir) mon devoir.' },
        { label: 'vi',  text: 'Claire souhaite que tu (voir) ce film avec elle.' },
        { label: 'vii', text: "Nous sommes heureux qu’elle (pouvoir) chanter." }
      ] }
  ] },

  /* ---------------- 2024, Section C, pages 7-9 ---------------- */
  'qp2024 C': { page: '7-9', marks: 30, questions: [
    { num: '4(a)', marks: 5, choose: 5, tally: '5 × 1 = 5',
      instruction: 'Conjuguez les verbes entre parenthèses :',
      items: [
        { label: 'i',   text: 'Le mois dernier, les chanteurs (se présenter) au Directeur.' },
        { label: 'ii',  text: 'Lorsque les crêpes seront prêtes, ils (déjeuner) déjà.' },
        { label: 'iii', text: 'Ne (se fâcher) pas, je te prie !' },
        { label: 'iv',  text: 'En 2021, nous (étudier) souvent en ligne.' },
        { label: 'v',   text: 'Dans une semaine, on (voir) ce film célèbre.' },
        { label: 'vi',  text: 'Pauline me (téléphoner) si elle recevait la bonne nouvelle.' },
        { label: 'vii', text: 'Aussitôt que le train (arriver) nous sommes descendus avec nos valises.' }
      ] },
    { num: '4(b)', marks: 5, choose: 5, tally: '5 × 1 = 5',
      instruction: 'Mettez les phrases au style direct ou indirect, selon le cas :',
      items: [
        { label: 'i',   text: 'Son père lui dit, « Ne va pas seul. »' },
        { label: 'ii',  text: 'Maman me demande, « Peux-tu me chercher de mon bureau ? »' },
        { label: 'iii', text: 'Nous te demandons à quelle heure arrive ton train.' },
        { label: 'iv',  text: 'Gilles nous dit, « Je ne veux pas vous déranger. »' },
        { label: 'v',   text: "Le proviseur annonce que l’école sera fermée demain." },
        { label: 'vi',  text: 'Je demande à ma sœur, « Que fais-tu samedi soir ? »' },
        { label: 'vii', text: 'Je lui conseille de se reposer dans sa chambre.' }
      ] },
    { num: '4(c)(I)', marks: 5, tally: '5 × 1 = 5',
      instruction: 'Trouvez la question :',
      items: [
        { label: 'i',   text: 'Il fait très chaud.' },
        { label: 'ii',  text: 'Elle arrive dans deux jours.' },
        { label: 'iii', text: 'Je vais sortir avec ma sœur.' },
        { label: 'iv',  text: 'La leçon est difficile.' },
        { label: 'v',   text: 'Les histoires sont intéressantes.' }
      ] },
    { num: '4(c)(II)', marks: 5, isAlternative: true, tally: '5 × 1 = 5',
      instruction: 'Répondez aux questions suivantes à la forme négative :',
      items: [
        { label: 'i',   text: 'Voulez-vous du sel ou du poivre ?' },
        { label: 'ii',  text: 'Parlez-vous toujours en français avec vos parents ?' },
        { label: 'iii', text: 'Tout le monde sait nager dans votre classe ?' },
        { label: 'iv',  text: 'Votre famille est déjà allée au Japon ?' },
        { label: 'v',   text: 'Voulez-vous acheter des cartes-postales ?' }
      ] },
    { num: '4(d)(I)', marks: 5, tally: '5 × 1 = 5',
      instruction: 'Remplissez les blancs par les adjectifs ou les pronoms possessifs :',
      items: [
        { label: 'i',   text: 'Ils parlent de _____ famille. Parlez-vous de _____ ?' },
        { label: 'ii',  text: "Je m’occupe toujours de _____ belles plantes, t’occupes-tu _____ ?" },
        { label: 'iii', text: 'Peux-tu me prêter _____ trousse ? Je ne trouve pas _____ .' },
        { label: 'iv',  text: "Nous avons fait _____ peinture. Il n’a pas encore complété _____ ." },
        { label: 'v',   text: "J’ai oublié _____ serviette de plage, me prêtes-tu _____ ?" }
      ] },
    { num: '4(d)(II)', marks: 5, isAlternative: true, tally: '5 × 1 = 5',
      instruction: 'Complétez avec les adjectifs ou les pronoms démonstratifs :',
      items: [
        { label: 'i',   text: "_____ vacances étaient plus belles que _____ de l’année dernière." },
        { label: 'ii',  text: 'Je veux gouter _____, pas _____ !' },
        { label: 'iii', text: 'Melissa prend _____ lunettes. Elle laisse _____ -la pour sa sœur.' },
        { label: 'iv',  text: 'Nous avons visité _____ musée. Nous allons visiter _____ de Paris bientôt.' },
        { label: 'v',   text: '_____ station de radio a de meilleures émissions que _____ -ci.' }
      ] },
    { num: '4(e)(I)', marks: 5, tally: '5 × 1 = 5',
      instruction: 'Reliez les phrases avec les pronoms relatifs simples ou composés :',
      items: [
        { label: 'i',   text: "J’adore ce jardin. Nous nous promenons dans ce jardin." },
        { label: 'ii',  text: 'Elle a bien réussi à ce contrôle. Elle avait fait bien attention à ce contrôle.' },
        { label: 'iii', text: 'Je viens de voir le documentaire. Il est magnifique.' },
        { label: 'iv',  text: 'Veux-tu goûter ces tartes ? Maman vient de préparer ces tartes.' },
        { label: 'v',   text: 'Voilà le lac. Nous passons nos vacances au bord de ce lac.' }
      ] },
    { num: '4(e)(II)', marks: 5, isAlternative: true, tally: '5 × 1 = 5',
      instruction: 'Remplacez les noms soulignés par les pronoms personnels, y, en, etc. :',
      items: [
        { label: 'i',   text: 'Regardes-tu cette émission tous les soirs ?' },
        { label: 'ii',  text: 'Ses parents, ils ne sortent pas beaucoup.' },
        { label: 'iii', text: 'Attendez-moi au restaurant !' },
        { label: 'iv',  text: 'Je vais te donner mes coordonnées.' },
        { label: 'v',   text: "Il a fait des fautes d’orthographe." }
      ] },
    { num: '4(f)', marks: 5, choose: 5, tally: '5 × 1 = 5',
      instruction: 'Mettez au subjonctif :',
      items: [
        { label: 'i',   text: 'Il est important que nous (pouvoir) assister à cette fête.' },
        { label: 'ii',  text: 'Il est nécessaire que vous (savoir) les verbes.' },
        { label: 'iii', text: "J’ai peur qu’elles (faire) des bêtises." },
        { label: 'iv',  text: 'Nous sommes contents que notre professeur (aller) en France.' },
        { label: 'v',   text: 'Ma mère exige que nous (manger) ensemble.' },
        { label: 'vi',  text: "Il faut qu’un enfant (apprendre) plus d’une langue." },
        { label: 'vii', text: 'Je veux que ma grand-mère (être) en bonne santé.' }
      ] }
  ] }
};

/* ------------------------------------------------------------------ *
 *  TEXT - single items elsewhere that the scrape left blank or broken.
 *  Keyed "<paperId> <num>(<label>)" or "<paperId> <num>".
 * ------------------------------------------------------------------ */
module.exports.TEXT = {
  'qp2023 11(iv)': { page: 10, text: "Je n’arrive pas à dormir, j’ai passé une _________ blanche." },
  'qp2023 12(b)(i)': { page: 11, text: "L’Express est un mensuel." },

  /* 2018 Compartment, question IV, PDF page 3. This paper's text layer is
     intact -- the problem is the printed LAYOUT: item (f) sits between (d)'s
     option list and (e), and the vertical watermark drops stray letters ("m",
     "o") at the joins, so two option lists ended up attached to the wrong
     items. These three restore each item to the options printed beneath it. */
  'qp2018c IV(d)': { page: 3,
    text: "Dès que, j’ _________ mon baccalauréat, j’irai en Afrique. (ai passé / avais passé / aurai passé)" },
  'qp2018c IV(e)': { page: 3,
    text: "Lorsque Sophie _________ la nouvelle, elle a téléphoné à sa mère. (a entendu / aura entendu / avait entendu)" },
  'qp2018c IV(f)': { page: 3,
    text: "Si Paul avait su, il _________ à ses amis pour confirmer le rendezvous. (aura téléphoné / avait téléphoné / aurait téléphoné)" }
};

/* ------------------------------------------------------------------ *
 *  TENSES - which tense each conjugation item is asking for.
 *
 *  `certain`  the paper names the tense in its instruction.
 *  `inferred` the sentence fixes it: a time marker, a concordance rule, or the
 *             three options offered, only one of which fits.
 * ------------------------------------------------------------------ */
/*  C  the paper names the tense in its own instruction.
 *  T  read from the sentence by me, then REVIEWED AND CONFIRMED by the teacher
 *     (2026-09-12). Shown as a plain tense, with no query marker, because a
 *     French teacher has checked it -- but kept distinct from C in the data, so
 *     the provenance of every tag stays recoverable.
 *  I  read from the sentence and NOT yet confirmed. Still carries the ? marker.
 */
const C = k => ({ key: k, confidence: 'certain' });
const T = k => ({ key: k, confidence: 'confirmed' });
const I = k => ({ key: k, confidence: 'inferred' });

module.exports.TENSES = {
  /* 2017 Q10 -- "Mettez les verbes aux temps convenables", options given */
  'qp2017 10': { a: T('gerondif'), b: T('pc'), c: T('condPasse'), d: T('futur'), e: T('imperatif') },

  /* 2018 Annual Q IV */
  'qp2018a IV': { a: T('futur'), b: T('pc'), c: T('imparfait'), d: T('futurAnt'),
                  e: T('imperatif'), f: T('cond') },

  /* 2018 Re-conducted Q4 */
  'qp2018r 4': { a: T('futur'), b: T('pc'), c: T('condPasse'), d: T('cond'),
                 e: T('imperatif'), f: T('imparfait') },

  /* 2018 Compartment Q IV */
  'qp2018c IV': { a: T('imperatif'), b: T('pc'), c: T('imparfait'), d: T('futurAnt'),
                  e: T('pqp'), f: T('cond') },

  /* 2019 Q5 */
  'qp2019 5': { a: T('futur'), b: T('imparfait'), c: T('pc'), d: T('imperatif'),
                e: T('futur'), f: T('futur') },

  /* 2020 Q4 */
  'qp2020 4': { a: T('cond'), b: T('futurAnt'), c: T('pc'), d: T('imparfait'),
                e: T('pqp'), f: T('imperatif'), g: T('pc'), h: T('pc') },

  /* 2022 Q3 -- read from page 5 */
  'qp2022 3': { a: T('futur'), b: T('pc'), c: T('pc'), d: T('futurAnt'),
                e: T('imperatif'), f: T('futur'), g: T('pqp') },

  /* 2023 Q4 -- read from page 6-7. (iv) "Dans quelques instants" is the one
     futur-proche reading in all ten papers, and it is a judgement, not a fact. */
  /* (iv) "Dans quelques instants, il ___ (présenter) son œuvre" is the only
     futur proche in all ten papers. Confirmed by the teacher (2026-09-12) after
     I had argued for futur simple: "dans quelques instants" is imminent and
     already settled, which is what the futur proche is for. */
  'qp2023 4': { i: T('infinitif'), ii: T('pc'), iii: T('imperatif'), iv: T('futurProche'),
                v: T('imparfait'), vi: T('futurAnt'), vii: T('pc') },

  /* 2024 Q4(a) -- read from page 7 */
  'qp2024 4(a)': { i: T('pc'), ii: T('futurAnt'), iii: T('imperatif'), iv: T('imparfait'),
                   v: T('futur'), vi: T('cond'), vii: T('pqp') },

  /* 2025 Q4 */
  'qp2025 4': { i: T('imperatif'), ii: T('pqp'), iii: T('futur'), iv: T('futurAnt'),
                v: T('pc'), vi: T('present'), vii: T('present') },

  /* The subjonctif questions are NOT tagged here. They are their own Grammaire
     topic in the syllabus, and Les Verbes lists only the ten tenses the teacher
     specified -- adding subjonctif as an eleventh tense row would contradict that. */
};

/* ------------------------------------------------------------------ *
 *  SPLIT -- one parsed question that is really several
 *
 *  A different failure from the blanks. Where a question number sits at the
 *  start of a line the parser finds it; where the -layout extractor glued
 *  "17. Dites vrai ou faux :" onto the end of the line above, it did not, and
 *  three questions arrived as one with its item labels repeated three times.
 *  A student then sees (a) three times over with no way to tell which task
 *  each belongs to.
 *
 *  Fixed the same way as everything else here: by reading the page. Each entry
 *  names the PDF page it was transcribed from and replaces ONE parsed question
 *  with the questions actually printed there. No regex splits the text.
 * ------------------------------------------------------------------ */
module.exports.SPLIT = {

  /* 2019 page 7: questions 16, 17 and 18 arrived as a single 14-item Q16. */
  'qp2019 16': { page: 7, questions: [
    { num: '16', marks: 3, instruction: 'Choisissez la bonne réponse : (Palais Bourbon / crudités / fait divers / connexion / Antoine de Saint-Exupéry / zapper)', items: [
      ['a', 'Il faut avoir une bonne __________ pour le Wi-fi.'],
      ['b', '« __________ » veut dire passer d’une chaîne à l’autre.'],
      ['c', 'Le Petit Prince est un roman d’__________ .'],
      ['d', '« __________ » est une rubrique d’un journal.'],
      ['e', 'Le __________ est le siège de l’Assemblée Nationale.'],
      ['f', 'Pour être en bonne forme, il faut manger des __________ .']
    ] },
    { num: '17', marks: 2, instruction: 'Dites « Vrai » ou « Faux » :', items: [
      ['a', 'La diversité culturelle est un droit humain fondamental.'],
      ['b', 'Pour conserver de l’eau, on doit arroser les plantes le soir.'],
      ['c', 'Les médias jouent un rôle important dans la formation de l’opinion publique.'],
      ['d', 'Après avoir tapé le mot de passe, il n’est pas nécessaire de valider.']
    ] },
    { num: '18', marks: 2, instruction: 'Chassez l’intrus :', items: [
      ['a', 'public / brevet / gratuit / obligatoire.'],
      ['b', 'cuisine / ménage / lessive / promenade.'],
      ['c', 'TF 1 / France 2 / Canal+ / Europe.'],
      ['d', 'Assemblée Nationale / citoyens / Sénat / Parlement.']
    ] }
  ] },

  /* 2020 pages 10-11: questions 16, 17 and 18 arrived as a single 16-item Q16. */
  'qp2020 16': { page: 10, questions: [
    { num: '16', marks: 3, instruction: 'Reliez et récrivez :', items: [
      ['a', 'Après la pluie — (i) fromage'],
      ['b', 'le bordeaux — (ii) château médiéval'],
      ['c', 'pharmacie — (iii) le beau temps'],
      ['d', 'le roquefort — (iv) vin'],
      ['e', 'Louvre — (v) chaîne de télévision française'],
      ['f', 'TF1 — (vi) médicaments']
    ] },
    { num: '17', marks: 2, choose: 4, instruction: 'Chassez l’intrus : (4 au choix)', items: [
      ['a', 'roman / poème / fable / courrier des lecteurs'],
      ['b', 'colle / lessive / dossiers / agrafeuse'],
      ['c', 'CD / BD / DVD / ARTE'],
      ['d', 'L’Express / Le Figaro / Europe 1 / Le Monde'],
      ['e', 'WiFi / site / connexion / chômage']
    ] },
    { num: '18', marks: 2, choose: 4, instruction: 'Écrivez « Vrai » ou « Faux » : (4 au choix)', items: [
      ['a', 'Il faut apprécier les autres cultures du monde.'],
      ['b', 'Quand nous tombons sur le répondeur, nous avons fait un faux numéro.'],
      ['c', 'La protection de l’environnement dépend de tous nos efforts.'],
      ['d', '« Malgudi Days » est un roman de St. Exupéry.'],
      ['e', 'La Fontaine a écrit les Fables.']
    ] }
  ] }

};

/* 2024 page 10: questions 5 and 6 arrived as a single 13-item Q5. */
module.exports.SPLIT['qp2024 5'] = { page: 10, questions: [
  { num: '5', marks: 10, choose: 5, tally: '5 × 2',
    instruction: 'Répondez aux questions : (5 au choix) (20 à 30 mots)', items: [
    ['i',   'Que faut-il faire si on est au chômage en France ?'],
    ['ii',  'Comment peut-on avoir une carte de lecteur en France ?'],
    ['iii', 'Qu’est-ce qui constitue les médias ? Nommez 2 chaines de télévision française.'],
    ['iv',  'Que savez-vous du musée d’Orsay ?'],
    ['v',   'Comment peut-on réduire le gaspillage d’eau ?'],
    ['vi',  'Quels sont les responsabilités du Président français ? Nommez-en deux.'],
    ['vii', 'Qu’est-ce que c’est (a) un mensuel, (b) un quotidien ?']
  ] },
  { num: '6', marks: 5, choose: 5, tally: '5 × 1',
    instruction: 'Complétez à l’aide des mots donnes ci-dessous : (5 au choix) (lessive / dents / répondeur / Malgudi Days / Monde / jardinage / retraite)', items: [
    ['i',   '_____ est écrit par R.K. Narayan.'],
    ['ii',  'On laisse un message si on tombe sur un _____.'],
    ['iii', 'Il va chez le dentiste car il a mal aux _____.'],
    ['iv',  'La Sécu garantit une _____ aux travailleurs.'],
    ['v',   'Faire la _____ est une tâche ménagère.'],
    ['vi',  'J’aime faire le _____, c’est mon passe-temps favori.'],
    ['vii', 'Le _____ est un journal français.']
  ] }
] };

/* 2024 page 11: the watermark cost 7(a) its two columns and 7(b) its first item. */
module.exports.SPLIT['qp2024 7(a)'] = { page: 11, questions: [
  { num: '7(a)', marks: 5, tally: '5 × 1',
    instruction: 'Faites correspondre les éléments de la Colonne A avec ceux de la Colonne B :', items: [
    ['i',   'Baccalauréat — Reportage culturel'],
    ['ii',  'IUT — Le Petit Prince'],
    ['iii', 'Récit — Lycée'],
    ['iv',  'Fable — Études supérieures'],
    ['v',   'ARTE — Panchatantra']
  ] }
] };
module.exports.SPLIT['qp2024 7(b)'] = { page: 11, questions: [
  { num: '7(b)', marks: 5, tally: '5 × 1', isAlternative: true,
    instruction: 'Écrivez vrai ou faux :', items: [
    ['i',   'Zapper, c’est passer d’une chaîne à une autre.'],
    ['ii',  'PSG est un métro rapide en France.'],
    ['iii', 'L’Express est un hebdomadaire.'],
    ['iv',  'Tournesol est un roman français.'],
    ['v',   'Le Palais Bourbon est le siège de l’Assemblée Nationale.']
  ] }
] };

/* 2025 page 7: 6(a) and 6(b) arrived as a single 9-item 6(a). */
module.exports.SPLIT['qp2025 6(a)'] = { page: 7, questions: [
  { num: '6(a)', marks: 5, instruction: 'Trouvez la question :', items: [
    ['i',   'Non, je ne veux pas.'],
    ['ii',  'Cette robe est en coton.'],
    ['iii', 'Nous allons inviter nos amis chez nous.'],
    ['iv',  'Mes amis adorent aller à la plage.'],
    ['v',   'Il fait beau temps.']
  ] },
  { num: '6(b)', marks: 5, isAlternative: true,
    instruction: 'Mettez les phrases suivantes au négatif :', items: [
    ['i',   'Marie va toujours au même restaurant.'],
    ['ii',  'Quelque chose est tombé sur tes valises.'],
    ['iii', 'Nous avons rencontré quelqu’un dans votre maison.'],
    ['iv',  'Les enfants font encore la même faute.'],
    ['v',   'Vous avez acheté des fruits et des légumes.']
  ] }
] };

/* 2025 page 9: 8(a) and 8(b) arrived as a single 11-item 8(a). */
module.exports.SPLIT['qp2025 8(a)'] = { page: 9, questions: [
  { num: '8(a)', marks: 5,
    instruction: 'Reliez les phrases avec les pronoms relatifs simples ou composés :', items: [
    ['i',   'C’est une belle ville. Mes parents habitent dans cette ville.'],
    ['ii',  'Nous voulons acheter cet appartement. Il y a de grandes chambres dans cet appartement.'],
    ['iii', 'Il faut lire ces poèmes. Les auteurs de ces poèmes sont bien connus.'],
    ['iv',  'C’est ma nouvelle voiture. Je l’ai achetée la semaine dernière.'],
    ['v',   'Mes étudiants sont très calmes. J’explique ce concept difficile à ces enfants.']
  ] },
  { num: '8(b)', marks: 5, isAlternative: true,
    instruction: 'Remplacez les mots soulignés avec les pronoms personnels, y, en, etc. :', items: [
    ['i',   'Viens-tu d’envoyer ces paquets à tes parents ?'],
    ['ii',  'Nous avons lu tous les contes de fée.'],
    ['iii', 'Elle adore faire le jardinage. Elle va arroser les plantes.'],
    ['iv',  'L’équipe, elle joué très bien le football.'],
    ['v',   'Les touristes ont acheté des chocolats dans la chocolaterie.']
  ] }
] };

/* 2018 Re-conducted page 7: questions 16 and 17 arrived as a single 10-item Q16. */
module.exports.SPLIT['qp2018r 16'] = { page: 7, questions: [
  { num: '16', marks: 3, instruction: 'Reliez et récrivez :', items: [
    ['a', 'La Fontaine — (i) Corse'],
    ['b', 'Astérix — (ii) Bip sonore'],
    ['c', 'Bonne forme — (iii) Bureau'],
    ['d', 'Bonifacio — (iv) Le renard et les raisins'],
    ['e', 'Répondeur — (v) Bande dessinée'],
    ['f', 'Une agrafeuse — (vi) Légumes et fruits']
  ] },
  { num: '17', marks: 4, instruction: 'Dites vrai ou faux :', items: [
    ['a', 'On doit parler impoliment à tout le monde.'],
    ['b', 'En quittant un endroit touristique, nous devons laisser les bouteilles vides et les paquets de chips partout.'],
    ['c', 'Il faut respecter toutes les cultures du monde.'],
    ['d', 'Il faut limiter l’usage des ressources naturelles.']
  ] }
] };

/* 2018 Compartment page 2: question I has four numbered parts, which arrived
   interleaved as ten items on one question. */
module.exports.SPLIT['qp2018c I'] = { page: 2, questions: [
  { num: 'I(1)', marks: 2, instruction: 'Répondez aux questions suivantes :', items: [
    ['a', 'Pourquoi les jeunes aiment-ils les réseaux sociaux ?'],
    ['b', 'Comment les jeunes peuvent-ils contrôler l’image qu’ils projettent au monde ?']
  ] },
  { num: 'I(2)', marks: 4, instruction: 'Complétez avec les mots du texte :', items: [
    ['a', 'Nos parents nous ne ___________ pas de conduire la voiture. (permettent / adorent / montrent)'],
    ['b', 'Pierre, si tu achètes ce livre tu auras ce disque ___________. (gratuit / contenu / rapport)'],
    ['c', 'Les ___________ influencent l’opinion publique. (réponses / médias / photos)'],
    ['d', 'Il faut étudier le français tous les jours. ___________, vous apprendrez très vite la langue. (de cette manière / pour / mais)']
  ] },
  { num: 'I(3)', marks: 2, instruction: 'Trouvez dans le texte :', items: [
    ['a', 'un gérondif'],
    ['b', 'le contraire de “ensemble”; “détestent”'],
    ['c', 'un autre mot pour “renseignements”']
  ] },
  { num: 'I(4)', marks: 2, instruction: 'Trouvez du texte :', items: [
    ['a', 'La forme nominale de “valider”, “sortir”.'],
    ['b', 'La forme verbale de “contrôle”, “attente”.']
  ] }
] };

/* 2018 Compartment page 3: VII lost item (b) and gained a stray (c). */
module.exports.SPLIT['qp2018c VII'] = { page: 3, questions: [
  { num: 'VII', marks: 3, instruction: 'Trouvez la question :', items: [
    ['a', 'Il fait très beau en hiver.'],
    ['b', 'Les Danoit rentrent ce soir.'],
    ['c', 'Le professeur a parlé aux élèves.']
  ] }
] };

/* 2018 Compartment page 3: VIII swallowed the first item of IX. */
module.exports.SPLIT['qp2018c VIII'] = { page: 3, questions: [
  { num: 'VIII', marks: 3, instruction: 'Reliez avec les pronoms relatifs composés :', items: [
    ['a', 'Alex est malade. Je lui ai montré mes peintures.'],
    ['b', 'Je vais rencontrer mon grand-père. Il y a un grand chien chez lui.'],
    ['c', 'La table est ancienne. Il a mis le cadeau sur cette table.']
  ] }
] };

/* 2018 Compartment page 4: XIII swallowed the first item of XIV. */
module.exports.SPLIT['qp2018c XIII'] = { page: 4, questions: [
  { num: 'XIII', marks: 3, instruction: 'Complétez avec les prépositions : (de / chez / à / par / en / près de)', items: [
    ['a', 'J’envoie cette lettre _________ avion.'],
    ['b', 'Je suis malade, je vais _________ le médecin.'],
    ['c', 'Nous avons besoin _________ une craie.'],
    ['d', 'Mon école est _________ l’hôtel Rex.'],
    ['e', 'Nous habitons _________ Delhi. Notre pays est _________ Asie.']
  ] }
] };

/* 2018 Compartment page 4: XV picked up two items of XIV and lost its word bank. */
module.exports.SPLIT['qp2018c XV'] = { page: 4, questions: [
  { num: 'XV', marks: 3, instruction: 'Choisissez la bonne réponse : (Wi-Fi / formulaires / RFI / pôle-emploi.fr / L’accent grave / Bengaluru)', items: [
    ['a', '_________ est un texte écrit par Prévert.'],
    ['b', '_________ est un site qui aide à trouver un emploi.'],
    ['c', '_________ est une chaîne de la radio française.'],
    ['d', 'Le médecin remplit les _________ de la sécu.'],
    ['e', '_________ est la ville de la technologie de l’information.'],
    ['f', 'On a des problèmes de connexion quand le _________ ne marche pas.']
  ] }
] };

/* 2018 Compartment page 4: XVI arrived with its two columns shuffled together
   and the first item of XVII bolted on. */
module.exports.SPLIT['qp2018c XVI'] = { page: 4, questions: [
  { num: 'XVI', marks: 3, instruction: 'Reliez et récrivez :', items: [
    ['a', 'Bonifacio — (i) Magazine'],
    ['b', 'Brevet — (ii) Antoine de Saint-Exupéry'],
    ['c', 'L’Express — (iii) L’Assemblée Nationale'],
    ['d', 'Le Palais Bourbon — (iv) Corse'],
    ['e', 'Le Petit Prince — (v) Pharmacie'],
    ['f', 'Médicaments — (vi) Collège']
  ] },
  { num: 'XVII', marks: 4, instruction: 'Dites vrai ou faux :', items: [
    ['a', 'On peut déchirer les pages des livres de la bibliothèque.'],
    ['b', 'Un bon citoyen doit respecter la loi de son pays.'],
    ['c', 'On peut gaspiller les ressources naturelles.'],
    ['d', 'Il ne faut pas argumenter avec ses parents.']
  ] }
] };

/* 2023 pages 3-4: Section A question 1 has three numbered parts, which arrived
   as eighteen items on one question with the part headings among them. */
module.exports.SPLIT['qp2023 1'] = { page: 3, questions: [
  { num: '1(i)', marks: 4, choose: 2, tally: '2 × 2',
    instruction: 'Répondez aux questions suivantes (2 au choix) :', items: [
    ['a', 'Quels sont les effets négatifs des médias sur des adolescents ?'],
    ['b', 'Comment la télévision peut-elle avoir une bonne influence sur nous ?'],
    ['c', 'Est-ce que Internet peut nous éduquer aussi ? Justifiez votre réponse.']
  ] },
  { num: '1(ii)', marks: 3, tally: '6 × ½', instruction: 'Ecrivez vrai ou faux :', items: [
    ['a', 'Selon l’infographie les adolescents sont très connectés sur les réseaux sociaux.'],
    ['b', 'Les médias jouent un rôle important dans la vie des adolescents.'],
    ['c', 'Les parents des adolescents sont souvent aussi habiles que leurs enfants, selon le texte.'],
    ['d', 'Les adolescents sortent moins parce qu’ils sont devant l’écran.'],
    ['e', 'Les jeux vidéo ont toujours de bons effets sur un adolescent.'],
    ['f', 'Internet est un outil important pour avoir de l’information.']
  ] },
  { num: '1(iii)', marks: 3, tally: '6 × ½', instruction: 'Trouvez dans le texte :', items: [
    ['a', 'Une préposition - ___________'],
    ['b', 'Un adjectif - ___________'],
    ['c', 'La forme nominale de “étudier” - _________'],
    ['d', 'Le contraire de “détériorer” - _________'],
    ['e', 'Un autre mot pour « très grand » _________'],
    ['f', 'La forme verbale de “production” - _________']
  ] }
] };

/* 2023 page 1: the English reading-time instruction was parsed as a Section A
   question. It is not a question; it is dropped. */
module.exports.SPLIT['qp2023 10'] = { page: 1, section: 'A', questions: [] };

/* 2017 page 5: the label "(e )" carries a space, so item (e) was appended to (d). */
module.exports.SPLIT['qp2017 9'] = { page: 5, questions: [
  { num: '9', marks: 3, instruction: 'Mettez au négatif :', items: [
    ['a', 'Il a déjà envoyé les cartes d’invitations.'],
    ['b', 'Tout le monde regarde la télé toute la journée.'],
    ['c', 'Mon grand-père aimerait la salade verte et poulet pour le dîner.'],
    ['d', 'Maman va mettre beaucoup de choses dans cette valise.'],
    ['e', 'Damien téléphone souvent à sa cousine.']
  ] }
] };

/* 2018 Annual page 2: question I's first sub-part arrived as an item of the
   passage question, and I(b)'s four contraires arrived glued two to a line. */
module.exports.SPLIT['qp2018a I'] = { page: 2, questions: [
  { num: 'I(a)', marks: 2, instruction: 'Répondez aux questions : (taux* : degree)', items: [
    ['i',  'Selon le rapport de l’Organisation mondiale de la santé, de quoi est-ce que la pollution de l’air serait responsable ?'],
    ['ii', 'En janvier 2017 qu’est-ce qui s’est passé à Londres ?']
  ] }
] };
module.exports.SPLIT['qp2018a I(b)'] = { page: 2, questions: [
  { num: 'I(b)', marks: 2, instruction: 'Trouvez les contraires du texte :', items: [
    ['i',   'moins en moins'],
    ['ii',  'seul'],
    ['iii', 'solutions'],
    ['iv',  'rurales']
  ] }
] };

/* 2018 Compartment page 2: the two letter options arrived as one instruction. */
module.exports.SPLIT['qp2018c II'] = { page: 2, questions: [
  { num: 'II(a)', marks: 10, instruction: 'Écrivez une lettre d’environ 80 mots à votre ami/amie lui décrivant les moyens de transport de votre ville.', items: [] },
  { num: 'II(b)', marks: 10, isAlternative: true, instruction: 'Écrivez une lettre d’environ 80 mots à votre cousin/e lui décrivant comment vous vous détendez.', items: [] }
] };

/* 2018 Compartment page 2: a vertical watermark dropped stray letters into the
   dialogue and reversed two of its lines. */
module.exports.SPLIT['qp2018c III(a)'] = { page: 2, questions: [
  { num: 'III(a)', marks: 5, instruction: 'Mettez en ordre le dialogue suivant et récrivez : Paolo : Enchanté de faire votre connaissance ! / Christine : Non, je suis belge mais je fais mes études en France. Et vous, vous êtes français ? / Paolo : Pourriez-vous me dire comment arriver à la piscine ? / Christine : Enchantée ! J’adore l’Italie ! Et moi c’est Christine ! / Paolo : Merci beaucoup ! Vous êtes française ? / Christine : Bonjour ! / Paolo : Bonjour Mademoiselle ! / Christine : Au revoir / Paolo : Non, je suis italien, je m’appelle Paolo. / Christine : Oui, bien sûr. Derrière le bâtiment rouge là-bas il y a la piscine. Elle est à côté du restaurant Chez Marc.', items: [] }
] };

/* 2018 Compartment page 3: the passage picked up Arabic-script artefacts from
   the scan, and its last sentence was cut. */
module.exports.SPLIT['qp2018c III(c)'] = { page: 3, questions: [
  { num: 'III(c)', marks: 5, instruction: 'Complétez le texte suivant avec les mots donnés ci-dessous : (entier / connus / magnifiques / célèbres / certainement / par exemple / économique / grand / capitale / musée) — Paris est la capitale __________, la capitale politique et la _________ culturelle de la France. La ville compte beaucoup de lieux _________ dans le monde _________ comme « la tour Eiffel », « l’Arc de Triomphe » et « Notre-Dame de Paris ». Les musées parisiens aussi sont très _________ Il y a, _________, le musée du Louvre. C’est le plus _________ musée de France. On peut voir dans le _________ du Louvre des tableaux _________. Le plus célèbre est _________ « La Joconde » de Léonard de Vinci.', items: [] }
] };

/* 2018 Compartment page 3: VI lost its third item to the question below. */
module.exports.SPLIT['qp2018c VI'] = { page: 3, questions: [
  { num: 'VI', marks: 3, instruction: 'Mettez au négatif :', items: [
    ['a', 'Tu aimes les fruits et les lègumes.'],
    ['b', 'Marc a déjà fait son devoir.'],
    ['c', 'Quelqu’un a appelé le médecin.']
  ] }
] };

/* 2018 Compartment page 3: IX lost item (a) to VIII and gained a stray line of X. */
module.exports.SPLIT['qp2018c IX'] = { page: 3, questions: [
  { num: 'IX', marks: 3, instruction: 'Conjuguez le verbe au subjonctif :', items: [
    ['a', 'Il faut que tu _________ (être) à l’heure pour le rendez-vous.'],
    ['b', 'J’aimerais que nous _________ (aller) au cinéma ce soir.'],
    ['c', 'Elle est triste que vous _________ (partir) tôt.']
  ] }
] };

/* 2018 Compartment page 3: X lost item (a) to IX. */
module.exports.SPLIT['qp2018c X'] = { page: 3, questions: [
  { num: 'X', marks: 3, instruction: 'Complétez avec les adjectifs ou les pronoms démonstratifs :', items: [
    ['a', 'Regarde _________ peinture-ci. Elle est plus belle que _________.'],
    ['b', 'J’achète _________ pantalons. Ils sont meilleurs que _________ de Jean.'],
    ['c', 'Quel film voudriez-vous regarder ? _________ ou _________ ?']
  ] }
] };

/* 2018 Compartment page 4: XIV lost (a) to XIII and (e), (f) to XV. */
module.exports.SPLIT['qp2018c XIV'] = { page: 4, questions: [
  { num: 'XIV', marks: 10, choose: 5, tally: '5 × 2', instruction: 'Répondez aux questions (5 au choix) :', items: [
    ['a', 'Nommez quatre objets qu’on trouve dans un bureau.'],
    ['b', 'Quels documents faut-il avoir pour obtenir une carte de lecteur ?'],
    ['c', 'Comment pouvez-vous réduire l’usage de l’eau ?'],
    ['d', 'Où se trouve la grande pyramide dans le Louvre ? Qui l’a construite ?'],
    ['e', 'Connaissez-vous les responsabilités du Président français ? Citez-en deux.'],
    ['f', 'Quelle est l’importance du 21 mai ? Citez un objectif de cette journée.']
  ] }
] };

/* 2018 Compartment page 4: XVII is supplied whole by the XVI entry above; this
   is the damaged duplicate the parser produced from the same lines. */
module.exports.SPLIT['qp2018c XVII'] = { page: 4, questions: [] };

/* 2020 page 3: question I's stem "(a) Le Québec est situé :" arrived as an item
   of the passage question rather than as the question it introduces. */
module.exports.SPLIT['qp2020 I'] = { page: 3, questions: [
  { num: 'I(a)', marks: 2, instruction: 'Le Québec est situé :', items: [
    ['i',   'en Europe.'],
    ['ii',  'aux États-Unis.'],
    ['iii', 'en Amérique du Nord.']
  ] }
] };

/* 2020 page 3: the vrai/faux table arrived as one run-on item. */
module.exports.SPLIT['qp2020 VII'] = { page: 3, questions: [
  { num: 'VII', marks: 2, instruction: 'Dites vrai ou faux. Justifiez votre réponse :', items: [
    ['a', 'Le Québec est une petite province du Canada.'],
    ['b', 'Les Québécois aiment parler en français.']
  ] }
] };

/* 2020 page 4: the two letter options arrived as one instruction. */
module.exports.SPLIT['qp2020 2'] = { page: 4, questions: [
  { num: '2(a)', marks: 10, instruction: 'Écrivez une lettre à votre ami(e) décrivant votre nouveau boulot (80 mots).', items: [] },
  { num: '2(b)', marks: 10, isAlternative: true, instruction: 'Écrivez une lettre à votre frère sur le système d’éducation en France.', items: [] }
] };

/* 2022 page 4: four of the seven Section A questions lost their opening words
   (the 2022 PDF draws much of its text as unmapped glyphs). */
module.exports.SPLIT['qp2022 1'] = { page: 4, questions: [
  { num: '1', marks: 5, choose: 5, tally: '5 × 1',
    instruction: 'Regardez l’image, lisez le texte et répondez aux questions suivantes. (5 au choix)', items: [
    ['a', 'D’après l’image, pour quelles raisons les adolescents perdent leur sommeil ?'],
    ['b', 'Pourquoi faut-il bien dormir ? Donner une raison.'],
    ['c', 'Si on dort mal qu’est-ce qui peut arriver ?'],
    ['d', 'Comment notre sommeil peut-il être affecté ?'],
    ['e', 'Que favorise le sommeil paradoxal ?'],
    ['f', 'Comment profitons-nous d’un « bon sommeil » ?'],
    ['g', 'Dormez-vous bien ? Pour combien d’heures dormez-vous ?']
  ] }
] };

/* 2023 page 4: the second letter option lost its opening clause. */
module.exports.SPLIT['qp2023 2'] = { page: 4, questions: [
  { num: '2', marks: 10, choose: 1, tally: '1 × 10', instruction: 'Écrivez UNE lettre de 80 mots :', items: [
    ['i',   'Écrivez à votre ami(e) lui décrivant vos loisirs préférés.'],
    ['ii',  'Écrivez une lettre à votre frère pour lui dire ce qu’il doit faire pour trouver un emploi.'],
    ['iii', 'Écrivez à votre cousin(e) pour lui décrire une journée dans la bibliothèque.']
  ] }
] };

/* 2023 pages 5-6: question 3 arrived as a bare heading; its three tasks are here. */
module.exports.SPLIT['qp2023 3'] = { page: 5, questions: [
  { num: '3(i)', marks: 5, instruction: 'Vous voulez fêter le 25e anniversaire de votre frère/sœur. Rédigez une invitation de 30 à 40 mots à ses amis.', items: [] },
  { num: '3(ii)', marks: 5, instruction: 'Mettez le dialogue en ordre et récrivez : Mme. Saby : Très bien ! Tu veux apporter quelque chose ? / Naomi : Oui, je vais voir le Pont du Gard avec l’école. / Mme. Saby : Tu pars à quelle heure ? / Naomi : Bonne nuit Madame ! / Mme. Saby : Tu vas sortir ce week-end ? / Naomi : Merci, c’est très gentil. / Mme. Saby : Allez, je te laisse. Bonne nuit Naomi. / Naomi : Comme d’habitude, mais je vais certainement rentrer plus tard. / Mme. Saby : D’accord. Je vais préparer un bon poulet avec une soupe aux oignons. J’en laisserai dans le frigo. / Naomi : Non, c’est gentil, on va acheter un sandwich sur la route.', items: [] },
  { num: '3(iii)', marks: 5, instruction: 'Complétez le texte en utilisant les mots/les expressions donnés : (voyage / coûte / confortable / prendre / moyens / dépend / seulement / même / moins / rapide) — Pour aller de Paris à Lyon, on peut ________ le train, l’avion, le bus et ________ le taxi. Le plus _________, c’est l’avion. On met une heure pour aller de Paris à Lyon. C’est le plus rapide, mais c’est aussi le plus cher. Le ________ en avion coûte 150 euros pour un aller. Bien sûr, ça ________ des jours et des compagnies aériennes. Il y a un autre moyen de transport assez rapide, c’est le train. En plus c’est beaucoup _______ cher que l’avion, ça ______ 42 euros l’aller simple. Le train est moins rapide que l’avion, c’est vrai, mais il met ______ deux heures. C’est donc plus rapide que le bus et c’est aussi plus _______. Si le train et le taxi sont les _______ de transport les plus confortables, le moins cher c’est quand même le bus.', items: [] }
] };

/* 2023 page 10: four of question 10's items lost their opening words. */
module.exports.SPLIT['qp2023 10'] = { page: 10, section: 'D', questions: [
  { num: '10', marks: 10, choose: 5, tally: '5 × 2', instruction: 'Répondez aux questions (5 au choix) (20 à 30 mots) :', items: [
    ['i',   'A quel âge entre-t-on au primaire, au collège et au lycée en France ?'],
    ['ii',  'Qui est Ieoh Ming Pei ?'],
    ['iii', 'Pourquoi s’inscrit-on dans une bibliothèque ?'],
    ['iv',  'Où se situe le musée d’Orsay ? Que peut-on y trouver ?'],
    ['v',   'Comment pouvons-nous conserver de l’eau ?'],
    ['vi',  'Qu’est-ce que c’est « la sécu » ?'],
    ['vii', 'Quelles sont les responsabilités du Président en France ?']
  ] }
] };

/* 2023 page 10: question 11 lost the first words of its instruction. */
module.exports.SPLIT['qp2023 11'] = { page: 10, questions: [
  { num: '11', marks: 5, choose: 5, tally: '5 × 1', instruction: 'Complétez à l’aide des mots donnés ci-dessous (5 au choix) : (répondeur / version / terre / musée / chaîne / nuit / Sénat)', items: [
    ['i',   'Si je tombe sur le __________, je laisse un message.'],
    ['ii',  'Le _________ est une des deux assemblées en France.'],
    ['iii', 'Il faut absolument réduire le réchauffement de la _________ .'],
    ['iv',  'Je n’arrive pas à dormir, j’ai passé une _________ blanche.'],
    ['v',   'Je vais regarder le film en _________ originale.'],
    ['vi',  'Le Louvre reste le _________ le plus visité du monde.'],
    ['vii', 'Canal+ est une _________ de télévision.']
  ] }
] };

/* 2023 page 10: 12(a)'s two columns arrived merged one row at a time. */
module.exports.SPLIT['qp2023 12(a)'] = { page: 10, questions: [
  { num: '12(a)', marks: 5, tally: '5 × 1', instruction: 'Faites correspondre les éléments de le colonne A avec ceux de la colonne B :', items: [
    ['i',   'Le Monde — La Fontaine'],
    ['ii',  'ARTE — journal'],
    ['iii', 'Fables — chaîne culturelle'],
    ['iv',  'passer un — intérim'],
    ['v',   'le travail — concours']
  ] }
] };

/* 2024 page 4: the watermark ate the opening of several Section A items. */
module.exports.SPLIT['qp2024 1(a)'] = { page: 4, questions: [
  { num: '1(a)', marks: 4, choose: 2, tally: '2 × 2', instruction: 'Répondez aux questions suivantes : (2 au choix)', items: [
    ['i',   'Aujourd’hui, pourquoi est-il important d’apprendre plusieurs langues ?'],
    ['ii',  'Pensez-vous que les petits enfants bénéficient d’apprendre des langues étrangères ? Justifiez votre réponse.'],
    ['iii', 'Quels sont les avantages de connaître une langue étrangère quand on voyage ?']
  ] }
] };
module.exports.SPLIT['qp2024 1(b)'] = { page: 4, questions: [
  { num: '1(b)', marks: 3, instruction: 'Écrivez vrai ou faux :', items: [
    ['i',   'Parler une langue étrangère peut être utile dans beaucoup de domaines de la vie.'],
    ['ii',  'Selon l’image 300 millions de personnes parlent français.'],
    ['iii', 'On n’a pas besoin de connaitre plus d’une langue, selon le texte.'],
    ['iv',  'D’après le texte, le voyage est plus intéressant si on parle la langue de la région.'],
    ['v',   'Parler l’anglais est suffisant quand on voyage dans n’importe quel pays.'],
    ['vi',  'On peut avoir de meilleures relations avec les autres si on parle leur langue.']
  ] }
] };
module.exports.SPLIT['qp2024 1(c)'] = { page: 4, questions: [
  { num: '1(c)', marks: 3, choose: 3, tally: '3 × 1', instruction: 'Trouvez dans le texte : (3 au choix)', items: [
    ['i',   'Une préposition - ___________'],
    ['ii',  'Un adjectif - ___________'],
    ['iii', 'La forme nominale de “étudier” - _________'],
    ['iv',  'Le contraire de “ancienne” - _________'],
    ['v',   'Le synonyme de “cuisine” - _________']
  ] }
] };

/* 2024 page 5: the watermark cut both alternative letter prompts. */
module.exports.SPLIT['qp2024 2(b)'] = { page: 5, questions: [
  { num: '2(b)', marks: 10, isAlternative: true, instruction: 'Écrivez une lettre à votre mère en Inde, lui décrivant le système scolaire en France.', items: [] }
] };
module.exports.SPLIT['qp2024 2(c)'] = { page: 5, questions: [
  { num: '2(c)', marks: 10, isAlternative: true, instruction: 'Écrivez à votre ami/amie, lui disant pourquoi vous aimez aller à la bibliothèque.', items: [] }
] };

/* 2024 pages 5-6: 3(a) lost its opening sentence, and the 3(b) dialogue arrived
   with its lines interleaved with watermark letters and split across two pages. */
module.exports.SPLIT['qp2024 3(a)'] = { page: 5, questions: [
  { num: '3(a)', marks: 5, instruction: 'C’est l’anniversaire de votre cousine. Vous ne pouvez pas assister à la soirée. Rédigez un refus et excusez-vous ! (30 mots)', items: [] }
] };
module.exports.SPLIT['qp2024 3(b)'] = { page: 5, questions: [
  { num: '3(b)', marks: 5, isAlternative: true, instruction: 'Mettez le dialogue en ordre et récrivez : Pierre : Pourquoi as-tu quitté la Provence ? / Lucas : C’est vrai. Ici à Paris, tout est immense, il y a du monde partout. / Pierre : Moi, c’est Pierre. Bienvenue au collège Claude Debussy. / Lucas : Mon père a trouvé un emploi à Paris. / Pierre : Bonjour, ça va ? Comment t’appelles-tu ? / Lucas : Je viens de la Provence. / Pierre : Tu viens d’où ? / Lucas : Bonjour. Oui ça va. Je m’appelle Lucas. Et toi ? / Pierre : La Provence ? C’est loin de Paris ça ! / Lucas : Merci, c’est gentil.', items: [] }
] };
module.exports.SPLIT['qp2024 3(c)'] = { page: 6, questions: [
  { num: '3(c)', marks: 5, isAlternative: true, instruction: 'Complétez le texte en choisissant parmi les mots donnés ci-dessous et récrivez : (beaucoup / fantastiques / acheter / prennent / surtout / pour / hiver) — Tout le monde aime les centres commerciaux. En été comme en ________, les gens visitent ces endroits ________ remplis de boutiques variées et d’animations diverses. En effet, même si vous ne voulez pas _________ quelque chose, il est toujours intéressant de passer du temps dans les centres commerciaux. Le centre commercial est l’endroit idéal ________ passer un bon moment avec la famille ou des amis. Les gens y vont ________ pour déguster un bon sandwich assis près de la fontaine ou tout en regardant un spectacle de danse.', items: [] }
] };

/* 2025 page 4: 1(c)'s five prompts arrived on one line. */
module.exports.SPLIT['qp2025 1(c)'] = { page: 4, questions: [
  { num: '1(c)', marks: 3, choose: 3, tally: '3 × 1', instruction: 'Trouvez dans le texte : (3 au choix)', items: [
    ['x',    'Le contraire de ‘moins’ : ___________'],
    ['xi',   'La forme nominale de ‘Progresser’ : ____________'],
    ['xii',  'Le synonyme de ‘par exemple’ : __________'],
    ['xiii', 'Un mot pour parler de quelque chose qui se fait chaque jour : __________'],
    ['xiv',  'Un pronom relatif : _________']
  ] }
] };

/* 2025 page 5: the farewell text lost its last two lines at the page break. */
module.exports.SPLIT['qp2025 3(b)'] = { page: 5, questions: [
  { num: '3(b)', marks: 5, isAlternative: true, instruction: 'Complétez le texte en choisissant le mot convenable donnés ci-dessous et récrivez : (professionnelle / passées / longtemps / plaisir / construire / continuation / endroit) — Bonjour à toutes et à tous. C’est mon dernier jour parmi vous après 8 belles années _________ dans notre entreprise. Je voulais tout simplement vous dire que c’était un très grand _________ de travailler avec vous. C’était une expérience très riche que je garderai _________ en mémoire. Une page se tourne mais cette étape de ma vie _________ restera toujours comme une très belle période de ma vie. Un grand merci à vous ! Bonne _________ à tous et meilleurs voeux de bonheur à chacun !', items: [] }
] };

/* ------------------------------------------------------------------ *
 *  CONTAINERS -- a numbered block that holds a reading passage and no task
 *
 *  2017's question 1 and 2020's question 1 print the text and the picture;
 *  the questions themselves are the numbered parts beneath them. Left as
 *  questions they would sit in the deck asking nothing and expecting an
 *  answer, so they are marked as the headings they are.
 * ------------------------------------------------------------------ */
module.exports.CONTAINERS = ['qp2017 1', 'qp2020 1'];

/* Section-qualified: 2023 prints a question 10 in Section D, and the parser
   also made one in Section A out of the English reading-time instruction.
   Keyed with the section so it drops only the second. */
module.exports.SPLIT['qp2023 A 10'] = { page: 1, questions: [] };
