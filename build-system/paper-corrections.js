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
