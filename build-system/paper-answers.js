// Answers and mark allotments for the ten papers.
//
// SOURCE OF TRUTH: "french mark , answers.pdf" in the paper folder -- the official
// CBSE Marking Scheme, Q.P. code 018/20. Everything about FORM comes from it:
// the mark allotments, the rubric for a free-response task, and the house style
// for an answer (a completed sentence with the answer in place, never a bare word;
// "- Vrai" / "- Faux" for a true-false item; "I - (iv) ; (II) - (v)" for a match).
//
// Two tiers, and they are never blurred:
//
//   tier: 'official'  the scheme answers this exact question. Used verbatim, with
//                     the page it came from. There are twelve of these -- the
//                     scheme is for a 2026 sitting that is not in this corpus, so
//                     only the stock Culture facts CBSE reuses year to year match.
//
//   tier: 'modele'    written here, following the scheme's rules and formats, and
//                     labelled in the UI as "Réponse modèle (générée selon le
//                     barème CBSE)" so nobody mistakes it for the official key for
//                     that year.
//
// The gate (check-papers.js) fails any entry that declares neither tier, any
// 'official' entry without a page, and any open-ended answer without its rubric.

/* ------------------------------------------------------------------ *
 *  MARKS -- transcribed from the scheme, every tally verbatim.
 *
 *  Where the scheme states a figure it wins, and it becomes the topic's
 *  displayed allotment. Where it is silent -- Section B's message/dialogue/
 *  story tasks and Section D's MCQ row, which the 2026 paper does not set --
 *  the figure stays the one gen-papers.js reads off the most recent paper that
 *  asked it. Nothing is invented at either level, and each question card keeps
 *  its own marks chip from its own paper's printed tally.
 * ------------------------------------------------------------------ */
const MARKS = {
  /* Section A, page 3 of the scheme */
  'cp-para':    { marks: 4,  tally: '2 × 2',  src: 'MS 018/20 p.3' },
  'cp-picture': { marks: 4,  tally: '2 × 2',  src: 'MS 018/20 p.3' },
  'cp-tf':      { marks: 3,  tally: '6 × ½',  src: 'MS 018/20 p.3' },
  'cp-vocab':   { marks: 3,  tally: '3 × 1',  src: 'MS 018/20 p.3' },
  /* Section B, pages 3-4 */
  'ex-letter':  { marks: 10, tally: '1 × 10', src: 'MS 018/20 p.4' },
  /* Section C, pages 5-7 -- every Grammaire task carries the same allotment */
  'gr-verbes':        { marks: 5, tally: '5 × 1', src: 'MS 018/20 p.5' },
  'gr-question':      { marks: 5, tally: '5 × 1', src: 'MS 018/20 p.5' },
  'gr-negation':      { marks: 5, tally: '5 × 1', src: 'MS 018/20 p.5' },
  'gr-discours':      { marks: 5, tally: '5 × 1', src: 'MS 018/20 p.5' },
  'gr-demonstratifs': { marks: 5, tally: '5 × 1', src: 'MS 018/20 p.6' },
  'gr-possessifs':    { marks: 5, tally: '5 × 1', src: 'MS 018/20 p.6' },
  'gr-relatifs':      { marks: 5, tally: '5 × 1', src: 'MS 018/20 p.6' },
  'gr-pronoms':       { marks: 5, tally: '5 × 1', src: 'MS 018/20 p.6' },
  'gr-subjonctif':    { marks: 5, tally: '5 × 1', src: 'MS 018/20 p.7' },
  /* Section D, pages 7-8 */
  'cu-short': { marks: 10, tally: '5 × 2', src: 'MS 018/20 p.7' },
  'cu-fill':  { marks: 5,  tally: '5 × 1', src: 'MS 018/20 p.8' },
  'cu-match': { marks: 5,  tally: '5 × 1', src: 'MS 018/20 p.8' },
  'cu-tf':    { marks: 5,  tally: '5 × 1', src: 'MS 018/20 p.8' }
};

/* ------------------------------------------------------------------ *
 *  RUBRICS -- the mark split for a free-response task, transcribed from the
 *  scheme's own wording (page 4). Quoted rather than paraphrased: this is the
 *  part a student most needs to see exactly as the examiner has it.
 * ------------------------------------------------------------------ */
const RUBRICS = {
  letter: {
    src: 'MS 018/20 p.4',
    total: 10,
    lines: [
      'Format — 4 marks (2 marks for place, date, name of addressee, introduction;',
      '2 marks for ending expression(s) / sentences and name of the writer)',
      'Idea and creativity — 4 marks',
      'Content, accuracy, presentation and cohesion of thoughts — 2 marks',
      'Grammatical errors — only 2 marks to be deducted (minor spelling errors may be overlooked)',
      'Misinterpretation of topic — only 2 marks to be deducted',
      'Any appropriate or relevant approach may be accepted. Textual phrases/expressions',
      'or the student’s own original expressions may be considered correct.'
    ]
  },
  /* The scheme sets no message, dialogue or story task, so it states no split for
     one. What it does state and what applies to any free-response answer is the
     [Réponse libre] principle and the two deduction caps, which are quoted here;
     the task's own total comes from the paper that set it. */
  libre: {
    src: 'MS 018/20 p.4',
    total: null,
    lines: [
      '[Réponse libre]',
      'Any appropriate or relevant approach may be accepted. Textual phrases/expressions',
      'or the student’s own original expressions may be considered correct.',
      'Grammatical errors — only 2 marks to be deducted (minor spelling errors may be overlooked).',
      'Misinterpretation of topic — only 2 marks to be deducted.'
    ]
  }
};

/* ------------------------------------------------------------------ *
 *  ANSWERS
 *
 *  Keyed by paper and question number, exactly like paper-corrections.js.
 *  `items` maps an item label to its answer; `text` answers a question that has
 *  no items. An item value may be a plain string (it inherits the question's
 *  tier) or { text, tier, page } where one item is official and its neighbours
 *  are not.
 * ------------------------------------------------------------------ */
const ANSWERS = {};

/* The twelve answers the scheme supplies outright are marked with O(text, page)
   inside their own paper's block below, so an official answer always sits next
   to the modelled ones it shares a question with. */
const O = (text, page) => ({ text: text, tier: 'official', page: page });

/* --- the papers, oldest first. One block each. --- */


/* ================= 2017 (All India, Set 4) ================= */

ANSWERS['qp2017 1.1'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'Ses hautes chaînes montagneuses provoquent les fortes précipitations, qui favorisent la forte production du secteur agricole.',
  b: 'Les plages du sud sont de sable blanc, et celles du nord et de l’est sont de sable noir.'
} };
ANSWERS['qp2017 1.2'] = { tier: 'modele', items: {
  a: 'le riz',
  b: 'une île'
} };
ANSWERS['qp2017 1.3'] = { tier: 'modele', items: {
  a: 'bas — haut',
  b: 'passif — actif',
  c: 'faible — fort / forte',
  d: 'montant — descendant'
} };
ANSWERS['qp2017 1.4'] = { tier: 'modele', items: {
  a: 'produire — la production',
  b: 'précipiter — les précipitations',
  c: 'cultiver — la culture',
  d: 'séparer — la séparation'
} };
ANSWERS['qp2017 1.5'] = { tier: 'modele', items: {
  a: 'On appelle l’Agung, la « mère montagne ». - Vrai',
  b: 'La nature volcanique de Bali contribue à sa fertilité. - Vrai',
  c: 'Les récifs coralliens entourent l’île de Bali. - Vrai',
  d: 'Le détroit de Badung sépare Bali et Java. - Faux (c’est le détroit de Bali qui les sépare)'
} };

ANSWERS['qp2017 2(a)'] = { tier: 'modele', rubric: 'letter', text:
  'New Delhi, le 12 mars\n\nChère Anjali,\n\n' +
  'Merci de ta lettre. Tu m’as demandé de te décrire le système politique en France, alors voici.\n' +
  'La France est une république. Le Président est élu pour cinq ans au suffrage universel et il ' +
  'représente le pays tout entier. Il nomme le Premier ministre, qui dirige le gouvernement. ' +
  'Le Parlement a deux assemblées : l’Assemblée Nationale, qui siège au Palais Bourbon, et le Sénat, ' +
  'qui siège au Palais du Luxembourg. Les citoyens votent à partir de dix-huit ans.\n' +
  'Écris-moi vite pour me parler de ton lycée.\n\nAmitiés,\nMeera' };

ANSWERS['qp2017 2(b)'] = { tier: 'modele', rubric: 'letter', text:
  'Chennai, le 12 mars\n\nCher Lucas,\n\n' +
  'Comment vas-tu ? Je veux te décrire la fête que nous avons organisée au lycée la semaine dernière.\n' +
  'Nous avons décoré la salle avec des ballons et des affiches. Mes camarades ont chanté et dansé, ' +
  'et notre professeur de français a préparé des crêpes. J’ai présenté un petit sketch en français ' +
  'avec deux amis et tout le monde a beaucoup ri. La directrice a distribué les prix à la fin de la journée.\n' +
  'C’était une journée magnifique ! Et toi, fais-tu des fêtes dans ton lycée ?\n\nAmicalement,\nRahul' };

ANSWERS['qp2017 3'] = { tier: 'modele', rubric: 'libre', text:
  '– Allons au restaurant ce soir, Min Chin ! Nous mangerons des burgers et des chips !\n' +
  '– Je suis désolée Maryam ! Je ne mange plus de fast-food !\n' +
  '– Est-ce vrai ? Pourquoi ?\n' +
  '– Parce que le fast-food n’est pas bon pour la santé. Je mange des légumes et des fruits.\n' +
  '– Et c’est pourquoi tu es en pleine forme ! Tu as raison, Min Chin !' };

ANSWERS['qp2017 4(a)'] = { tier: 'modele', rubric: 'libre',
  text: 'Chère Deepti,\nMerci beaucoup de ton invitation au théâtre. Malheureusement, je ne peux pas ' +
        'venir : ma tante arrive de Bombay ce soir et je dois aller la chercher à la gare. Je suis ' +
        'vraiment désolée. Une autre fois, avec plaisir !\nAmitiés, Nisha',
  items: {
    b: 'Cher Thomas,\nLes vacances commencent vendredi. Veux-tu passer quelques jours chez nous à la ' +
       'campagne ? La maison est près d’une rivière et nous pourrons faire du vélo et nager. Mes parents ' +
       'seront ravis de te voir. Réponds-moi vite !\nAmitiés, Karan'
  } };

ANSWERS['qp2017 5'] = { tier: 'modele', rubric: 'libre', text:
  'Java, est une île d’Indonésie faisant partie de l’Insulinde, baignée au sud par l’océan Indien et au ' +
  'nord par la mer de Java. Son nom viendrait du sanscrit Javadvipa, « l’île du millet ». À cette époque, ' +
  'ils pratiquaient déjà la culture du millet. Ce n’est que plus tard que la culture du riz aurait été ' +
  'introduite à Java.' };

ANSWERS['qp2017 6'] = { tier: 'modele', items: {
  a: 'On admire les grands palmiers de l’île.',
  b: 'Les enfants vont passer les vacances chez leurs grands-parents.',
  c: 'La chaleur est insupportable en été à Delhi.',
  d: 'Regarde le bel oiseau perché sur cet arbre !',
  e: 'Son chien est mignon. Il court derrière le petit chat !'
} };

ANSWERS['qp2017 7'] = { tier: 'modele', items: {
  a: 'Le médecin exige qu’il boive du lait tous les matins.',
  b: 'Lève-toi de bonne heure pour aller au Consulat Général de France.',
  c: 'Nous devons apprendre une nouvelle langue qui nous aidera.',
  d: 'Si Shiva avait eu des vacances, il serait parti en Italie.',
  e: 'La peinture que j’ai achetée est très chère.'
} };

ANSWERS['qp2017 8'] = { tier: 'modele', items: {
  a: 'Vous avez déjà complété vos travaux. Je n’ai pas encore fait les miens.',
  b: 'Elles viennent de téléphoner à leurs amis, mais lui, il doit téléphoner aux siens.',
  c: 'J’ai perdu ma carte de lecteur. Avez-vous la vôtre ?',
  d: 'Ils parlent à son proviseur. Nous n’allons pas parler au nôtre.',
  e: 'Meghna sortira avec sa famille. Sortiras-tu avec la tienne ?'
} };

ANSWERS['qp2017 9'] = { tier: 'modele', items: {
  a: 'Il n’a pas encore envoyé les cartes d’invitations.',
  b: 'Personne ne regarde la télé toute la journée.',
  c: 'Mon grand-père n’aimerait ni la salade verte ni le poulet pour le dîner.',
  d: 'Maman ne va rien mettre dans cette valise.',
  e: 'Damien ne téléphone jamais à sa cousine.'
} };

ANSWERS['qp2017 10'] = { tier: 'modele', items: {
  a: 'M. Bennet a vu quelqu’un se cachant derrière le mur.',
  b: 'Dès que j’ai reçu la lettre, j’ai téléphoné à mes parents.',
  c: 'Si tu avais complété ton travail à l’heure, tu aurais pu envoyer le mél.',
  d: 'Aussitôt que papa sera rentré à la maison, il apercevra le grand paquet sur la table.',
  e: 'Dépêchez-vous, monsieur ! Sinon, vous allez rater le vol !'
} };

ANSWERS['qp2017 11'] = { tier: 'modele', items: {
  a: 'Je demande à papa s’il pense qu’il va pleuvoir ce matin-là.',
  b: 'Zoé demande au professeur : « Est-ce que je peux entrer dans la classe ? »',
  c: 'Le PDG dit à M. Gupta de lui montrer son CV.',
  d: 'Arvind dit à son frère : « Achète de bons souvenirs de Paris ! »',
  e: 'Mme Julienne demande à sa sœur ce qu’elle fera en Inde.'
} };

ANSWERS['qp2017 12'] = { tier: 'modele', items: {
  a: 'La mère de Katie veut qu’elle soit gentille avec son petit frère.',
  b: 'Le professeur est heureux que Jean-Pierre puisse parler japonais si bien.',
  c: 'Mme la Directrice exige que tout le monde écrive soigneusement pendant les examens.',
  d: 'Il est nécessaire que vous remplissiez les formulaires tout de suite.',
  e: 'Pour être en bonne santé, il est important que je prenne mon dîner à l’heure.'
} };

ANSWERS['qp2017 13'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'Le 21 mai est la Journée mondiale de la diversité culturelle, déclarée par l’UNESCO. Elle encourage le dialogue entre les cultures du monde.',
  b: 'Oui, Internet est très important dans ma vie. Je fais mes devoirs, je lis les journaux et je reste en contact avec mes amis grâce à Internet.',
  c: 'Elle peut tomber sur un répondeur, faire un faux numéro, ou trouver la ligne occupée à cause du décalage horaire.',
  d: 'Les jeunes Français vont au lycée, retrouvent leurs amis au café et font du sport. Beaucoup travaillent aussi le week-end pour gagner un peu d’argent.',
  e: 'Nous pouvons économiser l’eau et l’électricité, utiliser les transports en commun, planter des arbres et ne pas gaspiller les ressources naturelles.',
  f: 'Je fais de la natation et du badminton pour rester en forme.'
} };

ANSWERS['qp2017 14'] = { tier: 'modele', items: {
  a: 'respecter la différence',
  b: 'ouvrir le site',
  c: 'donner un coup de fil',
  d: 'gagner de l’argent',
  e: 'arroser le jardin',
  f: 'attraper un rhume'
} };

ANSWERS['qp2017 15'] = { tier: 'modele', items: {
  a: 'Il faut lutter contre les incivilités.',
  b: 'Votre Wi-Fi ne marche pas. Vous avez un problème de connexion.',
  c: O('En France, le Président représente le pays tout entier.', 8),
  d: 'Bengaluru est la ville de la technologie de l’information.',
  e: 'Il faut réduire le réchauffement de la terre.',
  f: 'On peut acheter les médicaments chez le pharmacien.'
} };

ANSWERS['qp2017 16'] = { tier: 'modele', items: {
  a: 'Henri boit beaucoup d’eau en été. Il est sage. - Vrai',
  b: 'M. Gupta ne s’arrête jamais au feu rouge et il conduit très vite. Il est un mauvais citoyen. - Vrai',
  c: 'Connaître une autre culture nous enrichit. - Vrai',
  d: 'Klaxonner devant l’hôpital est très bon pour les malades. - Faux'
} };


/* ================= 2018 Annual ================= */

ANSWERS['qp2018a I(a)'] = { tier: 'modele', rubric: 'libre', items: {
  i:  'La pollution de l’air serait responsable de la mort de 3,3 millions de personnes chaque année.',
  ii: 'À Londres, le taux de particules fines a dépassé celui de Pékin en janvier 2017.'
} };
ANSWERS['qp2018a I(b)'] = { tier: 'modele', items: {
  i:   'de moins en moins — de plus en plus',
  ii:  'seul — ensemble',
  iii: 'solutions — problèmes',
  iv:  'rurales — urbaines'
} };
ANSWERS['qp2018a I(c)'] = { tier: 'modele', items: {
  i:   'un gérondif — en passant (« en passant par New Delhi ou Barcelone »)',
  ii:  'une fête — Diwali',
  iii: 'deux pays — la Chine et le Royaume-Uni'
} };
ANSWERS['qp2018a I(d)'] = { tier: 'modele', items: {
  i:  'mourir — la mort ; situer — la situation',
  ii: 'respiration — respirer ; titre — titrer'
} };
ANSWERS['qp2018a I(e)'] = { tier: 'modele', items: {
  i:  'En Chine, 32 villes ont été placées en alerte rouge en décembre. - Faux (23 villes)',
  ii: 'Selon le rapport de l’OMS sur la qualité de l’air dans le monde, moins de 12% de la population mondiale respirerait un air sain. - Vrai'
} };

ANSWERS['qp2018a II(a)'] = { tier: 'modele', rubric: 'letter', text:
  'Mumbai, le 8 mars\n\nChers grands-parents,\n\n' +
  'J’espère que vous allez bien. Vous m’avez demandé de vous décrire le système d’éducation en France.\n' +
  'L’école est obligatoire et gratuite. Les enfants vont à l’école maternelle, puis à l’école primaire ' +
  'vers six ans. Ensuite ils entrent au collège et passent le brevet, et au lycée ils préparent le ' +
  'baccalauréat. Avec le bac on peut aller à l’université ou dans un IUT pour des études plus courtes.\n' +
  'Je vous embrasse très fort.\n\nVotre petit-fils,\nAditya' };

ANSWERS['qp2018a II(b)'] = { tier: 'modele', rubric: 'letter', text:
  'Pune, le 8 mars\n\nChère Camille,\n\n' +
  'Comment vas-tu ? Tu m’as écrit que tu voulais protéger l’environnement, alors voici quelques idées.\n' +
  'Ferme le robinet quand tu te brosses les dents et arrose les plantes le soir : on économise ainsi ' +
  'beaucoup d’eau. Éteins les lumières inutiles, prends le bus ou le vélo au lieu de la voiture, et ' +
  'ne jette jamais de bouteilles vides dans la rue. Plante un arbre avec tes camarades : c’est facile ' +
  'et très utile.\n' +
  'La protection de l’environnement dépend de tous nos efforts !\n\nAmitiés,\nSneha' };

ANSWERS['qp2018a III(a)'] = { tier: 'modele', rubric: 'libre', text:
  'Le marchand : Bonjour, qu’est-ce qu’il vous faudra ?\n' +
  'La cliente : Je voudrais des pommes de terre. Un kilo s’il vous plaît.\n' +
  'Le marchand : Regardez aussi des tomates, elles sont belles !\n' +
  'La cliente : Oui... elles sont bonnes… donnez-moi un kilo.\n' +
  'Le marchand : Alors, un kilo de pommes de terre et un kilo de tomates … ça ira ?\n' +
  'La cliente : Oui. Merci !' };

ANSWERS['qp2018a III(b)'] = { tier: 'modele', rubric: 'libre', text:
  'Cher Nicolas,\nMerci de m’avoir proposé d’aller au cinéma samedi. Je suis désolé, je ne peux pas ' +
  'venir : j’ai un examen de mathématiques lundi et je dois réviser tout le week-end. Allons-y la ' +
  'semaine prochaine, si tu veux bien.\nÀ bientôt, Ishaan' };

ANSWERS['qp2018a III(c)'] = { tier: 'modele', rubric: 'libre', text:
  'Le marché de Noël de Strasbourg a lieu chaque année sur la place de la cathédrale et est très ' +
  'apprécié pour son animation et ses illuminations. Lorsque la ville s’illumine … le marché est le ' +
  'plus agréable. Les visiteurs se promènent dans les allées … On y trouve de petits kiosques dans ' +
  'lesquels on vend des décorations de Noël : des guirlandes, des boules de Noël en verre, des étoiles …' };

ANSWERS['qp2018a IV'] = { tier: 'modele', items: {
  a: 'Est-ce que vous irez en Italie l’année prochaine ?',
  b: 'Lorsque mes amies s’étaient habillées, elles sont parties.',
  c: 'Hier, nous nous promenions, soudain il a commencé à pleuvoir.',
  d: 'Sylvie fera ses devoirs aussitôt qu’elle aura lu la leçon.',
  e: 'Ayez du courage, mes enfants !',
  f: 'Si tu aimais la musique, tu ferais de la guitare.'
} };

ANSWERS['qp2018a V'] = { tier: 'modele', items: {
  a: 'Le professeur dit aux élèves : « Faites les exercices dans vos cahiers. »',
  b: 'La mère demande à la petite ce qu’elle veut pour son anniversaire.',
  c: 'L’employé demande au voyageur s’il a son passeport.'
} };

ANSWERS['qp2018a VI'] = { tier: 'modele', items: {
  a: 'Marie n’a mangé ni riz ni poisson.',
  b: 'Elle ne travaille plus chez IBM.',
  c: 'Je n’ai rien vu dans ton sac.'
} };

ANSWERS['qp2018a VII'] = { tier: 'modele', items: {
  a: 'Qu’est-ce que les enfants adorent ?',
  b: 'Comment ira-t-il à Bengaluru ?',
  c: 'Pourquoi ne venez-vous pas chez nous ?'
} };

ANSWERS['qp2018a VIII'] = { tier: 'modele', items: {
  a: 'Le quartier dans lequel nous habitons est très beau.',
  b: 'Ce sont mes amis auxquels j’ai téléphoné hier soir.',
  c: 'J’adore cette église devant laquelle il y a un beau jardin.'
} };

ANSWERS['qp2018a IX'] = { tier: 'modele', items: {
  a: 'Tes parents sont contents que tu aies de bonnes notes aux examens.',
  b: 'Mon frère est fâché que j’apprenne ses secrets.',
  c: 'Il faut que nous nous couchions tôt ce soir.'
} };

ANSWERS['qp2018a X'] = { tier: 'modele', items: {
  a: 'Achète cette robe-ci, pas celle-là.',
  b: 'Tu connais le frère de Paul ? – Non, je connais celui de Marc.',
  c: 'Je préfère ces romans-ci. Ceux-là ne sont pas aussi intéressants.',
  d: 'Regarde cet oiseau ! Il est mignon !'
} };

ANSWERS['qp2018a XI'] = { tier: 'modele', items: {
  a: 'Sophie parle à ses parents. Parlez-vous aux vôtres ?',
  b: 'Notre grand-mère nous raconte des histoires. Et la tienne ?',
  c: 'Je vais chez mon amie, mais ils ne vont pas chez la leur.'
} };

ANSWERS['qp2018a XII'] = { tier: 'modele', items: {
  a: 'Vas-y !',
  b: 'Elle les a achetés à la papeterie.',
  c: 'Nous allons leur en écrire.'
} };

ANSWERS['qp2018a XIII'] = { tier: 'modele', items: {
  a: 'Nous envoyons le paquet par avion.',
  b: 'Pour faire une omelette, il nous faut des œufs.',
  c: 'Hélène fait une promenade au bord de la mer.',
  d: 'As-tu commencé à lire la leçon ?',
  e: 'Paul va au marché avec ses amis.',
  f: 'Ma sœur est malade depuis hier.'
} };

ANSWERS['qp2018a XIV'] = { tier: 'modele', rubric: 'libre', items: {
  a: O('Une secrétaire a beaucoup de choses à faire. Elle tape des lettres, elle répond au téléphone et elle classe les dossiers.', 7),
  b: 'Port Blair est la capitale des îles Andaman-et-Nicobar, en Inde. C’est un port et une destination touristique connue pour ses plages.',
  c: 'On peut avoir un problème de connexion, oublier son mot de passe, ou recevoir trop de courriers indésirables.',
  d: 'La Sécurité sociale est le système français qui protège les travailleurs et leur famille : elle rembourse les frais médicaux et garantit une retraite aux travailleurs.',
  e: 'Le Parlement français se compose de deux assemblées : l’Assemblée Nationale, dont les membres sont les députés, et le Sénat, dont les membres sont les sénateurs.',
  f: 'Pour être en pleine forme, je dors huit heures par nuit, je mange des fruits et des légumes et je fais du sport tous les jours.'
} };

ANSWERS['qp2018a XV'] = { tier: 'modele', items: {
  a: 'Zapper, c’est passer d’une chaîne de télévision à l’autre.',
  b: 'Europe 1 est une chaîne de radio en France.',
  c: 'Les Aiguilles de Bavella se trouvent en Corse.',
  d: 'R.K. Narayan a écrit « Malgudi Days ».',
  e: 'L’Éditorial est une rubrique d’un journal.',
  f: 'Jacques Prévert a écrit Paroles.'
} };

ANSWERS['qp2018a XVI'] = { tier: 'modele', items: {
  a: 'Baccalauréat — (iii) Lycée',
  b: 'Carte de lecteur — (v) Bibliothèque',
  c: 'ARTE — (vi) Reportage culturel',
  d: 'Ville de la technologie de l’information — (ii) Bengaluru',
  e: 'Président — (iv) Chef des armées',
  f: 'UNESCO — (i) Journée Mondiale de la Diversité Culturelle'
} };

ANSWERS['qp2018a XVII'] = { tier: 'modele', items: {
  a: 'Les jeunes doivent gaspiller leur temps en surfant des sites web. - Faux',
  b: 'Il faut faire des efforts pour connaître les différentes cultures du monde. - Vrai',
  c: 'Il faut rester silencieux dans la bibliothèque. - Vrai',
  d: 'Il ne faut pas faire des efforts pour préserver les ressources naturelles. - Faux'
} };


/* ================= 2018 Re-conducted (Punjab) ================= */

ANSWERS['qp2018r 1(a)'] = { tier: 'modele', rubric: 'libre', items: {
  i:  'Quand les parents se sont couchés, les adolescents continuent de bombarder leur cerveau de stimulations avec l’aide de jeux vidéos ou de textos.',
  ii: 'Idéalement, la chambre à coucher du jeune devrait être exempte de toute stimulation de nature électronique au moins une heure avant le moment prévu pour aller dormir.'
} };
ANSWERS['qp2018r 1(b)'] = { tier: 'modele', items: {
  i:   'Hier j’ai acheté plusieurs disques de ce chanteur. Je l’aime beaucoup.',
  ii:  'Généralement je me lève tôt. Mais, ce matin je me suis levé tard.',
  iii: 'Idéalement tu dois travailler deux heures chaque jour si tu veux recevoir de bonnes notes.',
  iv:  'Il faut essayer de protéger notre source d’eau potable.'
} };
ANSWERS['qp2018r 1(c)'] = { tier: 'modele', items: {
  i:   'Un verbe au conditionnel — devrait (« la chambre à coucher du jeune devrait être exempte »)',
  ii:  'vivre — la vie ; manquer — le manque',
  iii: 'la continuité — continuer'
} };
ANSWERS['qp2018r 1(d)'] = { tier: 'modele', items: {
  i:   'absence — présence',
  ii:  'bêtes — intelligents',
  iii: 'tôt — tard',
  iv:  'en plus — au moins'
} };

ANSWERS['qp2018r 2(a)'] = { tier: 'modele', rubric: 'letter', text:
  'Jaipur, le 6 avril\n\nChère Léa,\n\n' +
  'J’espère que tu vas bien. Tu m’as demandé ce que je fais à la bibliothèque : je vais te le raconter.\n' +
  'J’y vais deux fois par semaine avec ma carte de lecteur. Je lis les journaux et les magazines dans la ' +
  'salle de lecture, puis je cherche des romans et des bandes dessinées. On peut aussi emprunter des CD ' +
  'et des DVD. Il faut rester silencieux et il ne faut jamais déchirer les pages des livres.\n' +
  'Et toi, vas-tu souvent à la bibliothèque ?\n\nAmitiés,\nPriya' };

ANSWERS['qp2018r 2(b)'] = { tier: 'modele', rubric: 'letter', text:
  'Kolkata, le 6 avril\n\nCher Antoine,\n\n' +
  'Comment vas-tu ? Tu veux protéger l’environnement : voici ce que tu peux faire.\n' +
  'Ferme le robinet quand tu te laves, arrose les plantes le soir et ne gaspille jamais l’eau. Éteins ' +
  'les lumières et les appareils que tu n’utilises pas. Va au lycée à vélo ou en bus. Ne laisse pas ' +
  'les bouteilles vides et les paquets de chips dans la nature, et plante des arbres avec tes amis.\n' +
  'Il faut limiter l’usage des ressources naturelles : la planète en dépend !\n\nAmicalement,\nArjun' };

ANSWERS['qp2018r 3(a)'] = { tier: 'modele', rubric: 'libre', text:
  'Directeur : Marie, avez-vous vu mon dossier personnel ?\n' +
  'Secrétaire : Je crois qu’il est sur votre bureau. Où il est peut-être sous un autre dossier ...\n' +
  'Directeur : Ah oui, le voilà. Merci. Et, Monsieur Dubois, a-t-il confirmé notre rendez-vous ?\n' +
  'Secrétaire : Je l’ai appelé et j’ai laissé un message ... Vous voulez que je le rappelle ?\n' +
  'Directeur : Oui, dites-lui que je serais un peu en retard.' };

ANSWERS['qp2018r 3(b)'] = { tier: 'modele', rubric: 'libre', text:
  'Chère Manon,\nMerci beaucoup pour ton invitation ! Je serai très content de venir à ta soirée ' +
  'd’anniversaire samedi à sept heures. J’apporterai un petit cadeau et le gâteau au chocolat que tu ' +
  'aimes tant. À samedi !\nAmitiés, Vikram' };

ANSWERS['qp2018r 3(c)'] = { tier: 'modele', rubric: 'libre', text:
  'Les journées des enfants en France sont un peu trop chargées par rapport aux voisins européens. ' +
  'Elles sont très longues. Elles commencent le matin vers 8h30 et terminent l’après-midi vers 16h30 ' +
  'ou 17 heures. On parle beaucoup en ce moment de diminuer le nombre d’heures de cours et peut-être ' +
  'de changer certains programmes d’enseignement.' };

ANSWERS['qp2018r 4'] = { tier: 'modele', items: {
  a: 'J’enverrai ces cadeaux à mes amis demain.',
  b: 'Tes cravates ? Je les ai mises dans la valise.',
  c: 'Si tu avais envoyé le livre à ton frère, il l’aurait reçu avant son examen.',
  d: 'Monsieur, nous aimerions vous inviter à dîner chez nous.',
  e: 'Si tu veux te promener dans le jardin, vas-y !',
  f: 'Nous dormions quand notre père nous a appelés.'
} };

ANSWERS['qp2018r 5'] = { tier: 'modele', items: {
  a: 'Thomas dit à son ami : « J’ai perdu mes clés. »',
  b: 'La petite fille demande à son frère pourquoi il prend ses poupées.',
  c: 'Le marchand dit au client de ne pas toucher aux fleurs délicates.'
} };

ANSWERS['qp2018r 6'] = { tier: 'modele', items: {
  a: 'Rien ne me gêne.',
  b: 'Jean-Pierre n’a pas encore visité l’Inde.',
  c: 'Elle ne fait jamais la même erreur.'
} };

ANSWERS['qp2018r 7'] = { tier: 'modele', items: {
  a: 'Voulez-vous encore du café ?',
  b: 'Qu’est-ce que ta mère achète souvent ?',
  c: 'Pour qui veux-tu acheter ces fleurs ?'
} };

ANSWERS['qp2018r 8'] = { tier: 'modele', items: {
  a: 'Paul, duquel je vous ai parlé hier, est déjà arrivé.',
  b: 'Regardez ces belles routes par lesquelles vous devez passer pour aller à la campagne.',
  c: 'J’ai passé de bonnes vacances auxquelles je pense souvent.'
} };

ANSWERS['qp2018r 9'] = { tier: 'modele', items: {
  a: 'Le professeur veut que les élèves fassent vite le travail.',
  b: 'Il est nécessaire que nous écrivions ces lettres ce soir.',
  c: 'Je suis heureux que tu prennes mes valises.'
} };

ANSWERS['qp2018r 10'] = { tier: 'modele', items: {
  a: 'Alex, tu aimes ce lycée ou celui de ton cousin ?',
  b: 'Les filles aiment cette écharpe-ci. Elles n’achètent pas celle-là.',
  c: 'Quels romans aimez-vous ? Ceux-ci ou ceux-là ?'
} };

ANSWERS['qp2018r 11'] = { tier: 'modele', items: {
  a: 'Michelle est partie avec ses parents. Les miens m’attendent.',
  b: 'Prends tes affaires ! Nous ne devrons pas oublier les nôtres.',
  c: 'Ils vont parler à leur professeur. Allez-vous parler au vôtre ?'
} };

ANSWERS['qp2018r 12'] = { tier: 'modele', items: {
  a: 'Montre-les-lui !',
  b: 'Manges-en. Elles sont bonnes.',
  c: 'Je pense souvent à eux.',
  d: 'Ils vont leur écrire la semaine prochaine.',
  e: 'Je les ai achetées.'
} };

ANSWERS['qp2018r 13'] = { tier: 'modele', items: {
  a: 'Ma maison est près de la piscine du quartier. Je vais à la piscine tous les jours.',
  b: 'Mets de l’eau dans ce verre.',
  c: 'On mange ce plat avec des frites.',
  d: 'Mon cousin s’occupe de la musique pour la soirée.'
} };

ANSWERS['qp2018r 14'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'Le « Panchatantra » est un recueil de fables indiennes très anciennes. Chaque fable met en scène des animaux et donne une leçon de sagesse.',
  b: 'Les médias sont importants parce qu’ils nous informent, nous éduquent et nous distraient. Ils jouent aussi un rôle important dans la formation de l’opinion publique.',
  c: 'Pour trouver un emploi, il faut préparer un bon CV et une lettre de motivation, consulter des sites comme pôle-emploi.fr, lire les petites annonces et passer des entretiens.',
  d: O('Ieoh Ming Pei est un architecte.', 8),
  e: '« Zapper », c’est passer d’une chaîne de télévision à une autre. Deux chaînes françaises sont TF1 et France 2.',
  f: 'Le Président français est élu par les citoyens au suffrage universel, pour cinq ans. Il vit au Palais de l’Élysée, à Paris.'
} };

ANSWERS['qp2018r 15'] = { tier: 'modele', items: {
  a: 'On obtient le baccalauréat à la fin des études au lycée.',
  b: 'Parler de la pluie et du beau temps.',
  c: 'Le Petit Prince est un roman d’Antoine de Saint-Exupéry.',
  d: 'Bengaluru est la ville de la technologie de l’information.',
  e: O('Le Palais du Luxembourg est le siège du Sénat.', 8),
  f: O('La sécu assure la sécurité matérielle des travailleurs.', 8)
} };

ANSWERS['qp2018r 16'] = { tier: 'modele', items: {
  a: 'La Fontaine — (iv) Le renard et les raisins',
  b: 'Astérix — (v) Bande dessinée',
  c: 'Bonne forme — (vi) Légumes et fruits',
  d: 'Bonifacio — (i) Corse',
  e: 'Répondeur — (ii) Bip sonore',
  f: 'Une agrafeuse — (iii) Bureau'
} };

ANSWERS['qp2018r 17'] = { tier: 'modele', items: {
  a: 'On doit parler impoliment à tout le monde. - Faux',
  b: 'En quittant un endroit touristique, nous devons laisser les bouteilles vides et les paquets de chips partout. - Faux',
  c: 'Il faut respecter toutes les cultures du monde. - Vrai',
  d: 'Il faut limiter l’usage des ressources naturelles. - Vrai'
} };


/* ================= 2018 Compartment ================= */

ANSWERS['qp2018c I(1)'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'Les jeunes aiment les réseaux sociaux parce qu’ils peuvent communiquer avec leurs amis, renforcer leurs amitiés, se divertir, planifier des sorties, publier des photos et s’échanger des informations.',
  b: 'En choisissant l’image qu’ils postent, ils essayent de montrer leurs meilleurs profils : ils ont ainsi l’impression de pouvoir contrôler leur réputation.'
} };
ANSWERS['qp2018c I(2)'] = { tier: 'modele', items: {
  a: 'Nos parents ne nous permettent pas de conduire la voiture.',
  b: 'Pierre, si tu achètes ce livre tu auras ce disque gratuit.',
  c: 'Les médias influencent l’opinion publique.',
  d: 'Il faut étudier le français tous les jours. De cette manière, vous apprendrez très vite la langue.'
} };
ANSWERS['qp2018c I(3)'] = { tier: 'modele', items: {
  a: 'un gérondif — en publiant (« En publiant du contenu, ils attendent la validation de leurs actes »)',
  b: 'ensemble — seul ; détestent — adorent',
  c: 'renseignements — informations'
} };
ANSWERS['qp2018c I(4)'] = { tier: 'modele', items: {
  a: 'valider — la validation ; sortir — les sorties',
  b: 'contrôle — contrôler ; attente — attendre'
} };

ANSWERS['qp2018c II(a)'] = { tier: 'modele', rubric: 'letter', text:
  'Hyderabad, le 15 juillet\n\nCher Julien,\n\n' +
  'J’espère que tu vas bien. Tu voulais connaître les moyens de transport de ma ville : les voici.\n' +
  'Nous avons un métro très moderne qui traverse toute la ville, et beaucoup d’autobus. Les gens ' +
  'prennent aussi des auto-rickshaws pour les courtes distances, et les taxis se réservent sur le ' +
  'téléphone. Beaucoup d’élèves viennent au lycée à vélo, car c’est bon pour la santé et pour ' +
  'l’environnement.\n' +
  'Et chez toi, comment vas-tu au lycée ?\n\nAmitiés,\nRohan' };

ANSWERS['qp2018c II(b)'] = { tier: 'modele', rubric: 'letter', text:
  'Hyderabad, le 15 juillet\n\nChère Léa,\n\n' +
  'Comment vas-tu ? Tu m’as demandé comment je me détends après les cours : je te raconte.\n' +
  'Le soir, j’écoute de la musique et je lis des bandes dessinées. Le samedi, je vais à la piscine ' +
  'avec mes amis et nous jouons au badminton. J’aime aussi cuisiner avec ma mère et regarder un bon ' +
  'film en famille. Le dimanche matin, je fais du jardinage : c’est mon passe-temps favori.\n' +
  'Écris-moi vite pour me dire ce que tu fais toi !\n\nAmicalement,\nAnanya' };

ANSWERS['qp2018c III(a)'] = { tier: 'modele', rubric: 'libre', text:
  'Paolo : Bonjour Mademoiselle !\n' +
  'Christine : Bonjour !\n' +
  'Paolo : Pourriez-vous me dire comment arriver à la piscine ?\n' +
  'Christine : Oui, bien sûr. Derrière le bâtiment rouge là-bas il y a la piscine. Elle est à côté du restaurant Chez Marc.\n' +
  'Paolo : Merci beaucoup ! Vous êtes française ?\n' +
  'Christine : Non, je suis belge mais je fais mes études en France. Et vous, vous êtes français ?\n' +
  'Paolo : Non, je suis italien, je m’appelle Paolo.\n' +
  'Christine : Enchantée ! J’adore l’Italie ! Et moi c’est Christine !\n' +
  'Paolo : Enchanté de faire votre connaissance !\n' +
  'Christine : Au revoir' };

ANSWERS['qp2018c III(b)'] = { tier: 'modele', rubric: 'libre', text:
  'Cher Maxime,\nIl y a un match de foot très important à la télé dimanche à vingt heures. Viens le ' +
  'regarder chez moi ! Ma mère prépare des samosas et nous pourrons crier ensemble. Réponds-moi vite.\n' +
  'À dimanche, Kabir' };

ANSWERS['qp2018c III(c)'] = { tier: 'modele', rubric: 'libre', text:
  'Paris est la capitale économique, la capitale politique et la capitale culturelle de la France. ' +
  'La ville compte beaucoup de lieux connus dans le monde entier comme « la tour Eiffel », « l’Arc de ' +
  'Triomphe » et « Notre-Dame de Paris ». Les musées parisiens aussi sont très célèbres. Il y a, par ' +
  'exemple, le musée du Louvre. C’est le plus grand musée de France. On peut voir dans le musée du ' +
  'Louvre des tableaux magnifiques. Le plus célèbre est certainement « La Joconde » de Léonard de Vinci.' };

ANSWERS['qp2018c IV'] = { tier: 'modele', items: {
  a: 'Sachez bien les verbes, mes élèves !',
  b: 'L’année dernière, mes filles se sont habillées en noir pour la soirée de Noël.',
  c: 'La semaine dernière, quand nous sommes allés à Goa, il y faisait beau.',
  d: 'Dès que j’aurai passé mon baccalauréat, j’irai en Afrique.',
  e: 'Lorsque Sophie avait entendu la nouvelle, elle a téléphoné à sa mère.',
  f: 'Si Paul avait su, il aurait téléphoné à ses amis pour confirmer le rendez-vous.'
} };

ANSWERS['qp2018c V'] = { tier: 'modele', items: {
  a: 'La mère dit à son fils : « Ne rentre pas tard ! »',
  b: 'Paul demande à son père où ils vont pour les vacances.',
  c: 'Le professeur dit aux élèves qu’ils sont très intelligents.'
} };

ANSWERS['qp2018c VI'] = { tier: 'modele', items: {
  a: 'Tu n’aimes ni les fruits ni les légumes.',
  b: 'Marc n’a pas encore fait son devoir.',
  c: 'Personne n’a appelé le médecin.'
} };

ANSWERS['qp2018c VII'] = { tier: 'modele', items: {
  a: 'Quel temps fait-il en hiver ?',
  b: 'Qui rentre ce soir ?',
  c: 'À qui le professeur a-t-il parlé ?'
} };

ANSWERS['qp2018c VIII'] = { tier: 'modele', items: {
  a: 'Alex, auquel j’ai montré mes peintures, est malade.',
  b: 'Je vais rencontrer mon grand-père chez lequel il y a un grand chien.',
  c: 'La table sur laquelle il a mis le cadeau est ancienne.'
} };

ANSWERS['qp2018c IX'] = { tier: 'modele', items: {
  a: 'Il faut que tu sois à l’heure pour le rendez-vous.',
  b: 'J’aimerais que nous allions au cinéma ce soir.',
  c: 'Elle est triste que vous partiez tôt.'
} };

ANSWERS['qp2018c X'] = { tier: 'modele', items: {
  a: 'Regarde cette peinture-ci. Elle est plus belle que celle-là.',
  b: 'J’achète ces pantalons. Ils sont meilleurs que ceux de Jean.',
  c: 'Quel film voudriez-vous regarder ? Celui-ci ou celui-là ?'
} };

ANSWERS['qp2018c XI'] = { tier: 'modele', items: {
  a: 'Marie entre dans sa maison. Paul entre dans la sienne.',
  b: 'Je vous ai montré leurs photos. Montrez-moi les vôtres.',
  c: 'Ne nous montrez pas votre affiche car nous faisons la nôtre.'
} };

ANSWERS['qp2018c XII'] = { tier: 'modele', items: {
  a: 'Tu les as mises dans la valise.',
  b: 'Anne Marie, manges-en !',
  c: 'Il faut y aller.',
  d: 'Vous leur en avez offert.'
} };

ANSWERS['qp2018c XIII'] = { tier: 'modele', items: {
  a: 'J’envoie cette lettre par avion.',
  b: 'Je suis malade, je vais chez le médecin.',
  c: 'Nous avons besoin d’une craie.',
  d: 'Mon école est près de l’hôtel Rex.',
  e: 'Nous habitons à Delhi. Notre pays est en Asie.'
} };

ANSWERS['qp2018c XIV'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'Dans un bureau on trouve un ordinateur, une agrafeuse, des dossiers et un téléphone.',
  b: 'Il faut une pièce d’identité, un justificatif de domicile et une photo, et il faut payer une petite cotisation.',
  c: 'On peut fermer le robinet en se brossant les dents, prendre une douche courte, arroser les plantes le soir et réparer les fuites.',
  d: 'La grande pyramide se trouve dans la cour Napoléon du Louvre, à Paris. Elle a été construite par l’architecte Ieoh Ming Pei.',
  e: 'Le Président représente le pays tout entier, il est le chef des armées et il nomme le Premier ministre.',
  f: 'Le 21 mai est la Journée mondiale de la diversité culturelle. Un de ses objectifs est d’encourager le dialogue entre les cultures du monde.'
} };

ANSWERS['qp2018c XV'] = { tier: 'modele', items: {
  a: 'L’accent grave est un texte écrit par Prévert.',
  b: 'pôle-emploi.fr est un site qui aide à trouver un emploi.',
  c: 'RFI est une chaîne de la radio française.',
  d: 'Le médecin remplit les formulaires de la sécu.',
  e: 'Bengaluru est la ville de la technologie de l’information.',
  f: 'On a des problèmes de connexion quand le Wi-Fi ne marche pas.'
} };

ANSWERS['qp2018c XVI'] = { tier: 'modele', items: {
  a: 'Bonifacio — (iv) Corse',
  b: 'Brevet — (vi) Collège',
  c: 'L’Express — (i) Magazine',
  d: 'Le Palais Bourbon — (iii) L’Assemblée Nationale',
  e: 'Le Petit Prince — (ii) Antoine de Saint-Exupéry',
  f: 'Médicaments — (v) Pharmacie'
} };

ANSWERS['qp2018c XVII'] = { tier: 'modele', items: {
  a: 'On peut déchirer les pages des livres de la bibliothèque. - Faux',
  b: 'Un bon citoyen doit respecter la loi de son pays. - Vrai',
  c: 'On peut gaspiller les ressources naturelles. - Faux',
  d: 'Il ne faut pas argumenter avec ses parents. - Vrai'
} };


/* ================= 2019 ================= */

ANSWERS['qp2019 1(a)'] = { tier: 'modele', rubric: 'libre', items: {
  i:  'Stanley Lieber a créé Hulk, Thor, X-Men, Iron-Man et Spider-Man.',
  ii: 'Quand il était très jeune, il a débuté sa carrière de dessinateur dans les années 1940, alors qu’il n’avait pas encore 20 ans, et il a dessiné pour « Timely » en 1941.'
} };
ANSWERS['qp2019 1(b)'] = { tier: 'modele', items: {
  i:   'inconnu — connu',
  ii:  'lentement — vite',
  iii: 'dernière — première',
  iv:  'déjà — encore (« il n’avait pas encore 20 ans »)'
} };
ANSWERS['qp2019 1(c)'] = { tier: 'modele', items: {
  i:   'commencement — commencer',
  ii:  'édition — éditer',
  iii: 'dessiner — le dessinateur / le dessin',
  iv:  'nommer — le nom'
} };
ANSWERS['qp2019 1(d)'] = { tier: 'modele', items: {
  i:   '« Timely » était une société américaine. - Vrai',
  ii:  '« Captain America » était scénariste. - Faux (c’était un comic édité par Timely)',
  iii: '« Marvel » était le nouveau nom de « Timely ». - Vrai',
  iv:  'Stan Lee a apparu pour la première fois dans « Avengers 4 ». - Faux (c’était en 1989)'
} };
ANSWERS['qp2019 1(e)'] = { tier: 'modele', items: {
  i:  'renommer — changer le nom (« Timely a changé ensuite le nom pour devenir Marvel »)',
  ii: 'au commencement — au début (« au début des années 1960 »)'
} };

ANSWERS['qp2019 2(a)'] = { tier: 'modele', rubric: 'letter', text:
  'Bengaluru, le 3 mars\n\nCher Étienne,\n\n' +
  'J’ai appris que tu étais malade et je suis désolé. Voici ce que tu dois faire pour être en forme.\n' +
  'D’abord, dors au moins huit heures par nuit et ne regarde pas d’écrans avant de dormir. Mange des ' +
  'fruits, des légumes et des crudités, et bois beaucoup d’eau ; évite le fast-food. Fais un peu de ' +
  'sport chaque jour, une promenade ou de la natation. Et surtout, va chez le médecin si la fièvre ' +
  'continue.\n' +
  'Soigne-toi bien et écris-moi vite !\n\nAmitiés,\nSiddharth' };

ANSWERS['qp2019 2(b)'] = { tier: 'modele', rubric: 'letter', text:
  'Paris, le 3 mars\n\nCher ami,\n\n' +
  'Tu m’as demandé de te parler du système politique de mon pays. La France est une république.\n' +
  'Le Président est élu pour cinq ans par tous les citoyens ; il représente le pays tout entier et ' +
  'il est le chef des armées. Il habite au Palais de l’Élysée. Le Parlement a deux assemblées : ' +
  'l’Assemblée Nationale, au Palais Bourbon, où siègent les députés, et le Sénat, au Palais du ' +
  'Luxembourg, où siègent les sénateurs.\n' +
  'Écris-moi pour me parler du système politique indien !\n\nAmicalement,\nJean-Pierre' };

ANSWERS['qp2019 3(a)'] = { tier: 'modele', rubric: 'libre', text:
  'Patrick : Bonjour ! alors on se rencontre au cinéma à 5h ?\n' +
  'Caroline : Oui, j’y serai à l’heure.\n' +
  'Patrick : Tu viens en train ou en bus ?\n' +
  'Caroline : En général, je prends le métro. Et toi ?\n' +
  'Patrick : Moi, je viens à pied ou à vélo. Ça dépend des jours. Le cinéma est près de chez moi.\n' +
  'Caroline : C’est vrai ? Tu habites où ?\n' +
  'Patrick : Dans le quinzième arrondissement. Ma maison est à 20 minutes à pied. Et toi ? Tu habites loin ?\n' +
  'Caroline : Pas exactement ! Mais en métro, c’est à 10 minutes d’ici.\n' +
  'Patrick : Je dois me dépêcher. J’ai du travail à terminer . . . À ce soir !\n' +
  'Caroline : À ce soir Patrick !' };

ANSWERS['qp2019 3(b)'] = { tier: 'modele', rubric: 'libre', text:
  'Audrey Tautou est née le 9 août 1978 à Beaumont en Auvergne. Elle commence sa carrière d’actrice ' +
  'dans des téléfilms et ses courts métrages, puis elle apparaît dans des films ; en 2000, elle ' +
  'obtient le César du meilleur espoir féminin pour son rôle dans le film « Venus Beauté ». Mais ' +
  'c’est surtout grâce à l’énorme succès du film « Le Fabuleux Destin d’Amélie Poulain », où elle ' +
  'joue le rôle principal, qu’elle devient une actrice connue de tous les français et l’une des plus ' +
  'appréciées.' };

ANSWERS['qp2019 3(c)'] = { tier: 'modele', rubric: 'libre', text:
  'Chère Aurélie,\nSamedi, c’est l’anniversaire de mon petit frère et je voudrais lui faire une ' +
  'surprise. Peux-tu venir chez moi vendredi après-midi pour m’aider à décorer la maison et à ' +
  'préparer le gâteau ? Apporte de la musique !\nMerci d’avance, Tanvi' };

ANSWERS['qp2019 4'] = { tier: 'modele', items: {
  a: 'Tu n’écouteras pas de musique avant de finir ton travail.',
  b: 'Va jouer avec tes amis !',
  c: 'Je n’aime pas la maison en face de la nôtre.',
  d: 'Êtes-vous passé par ces routes pour arriver à ce village ?',
  e: 'C’est le mois d’avril et il a commencé à faire très chaud.'
} };

ANSWERS['qp2019 5'] = { tier: 'modele', items: {
  a: 'Demain, vous emmènerez vos amis chez Paul pour regarder un film.',
  b: 'Hier, il pleuvait quand je suis sorti faire une promenade.',
  c: 'Montre-moi la lettre que ton ami a envoyée hier.',
  d: 'Soyez à l’heure mes enfants ! Le match commence à 6 h.',
  e: 'Dans quelques mois, nous achèterons un nouvel appartement à Mumbai.',
  f: 'Si tu veux, nous pourrons t’aider.'
} };

ANSWERS['qp2019 6'] = { tier: 'modele', items: {
  a: 'Mon père, il n’aime pas sortir sans nous.',
  b: 'Il les a mises dans le tiroir.',
  c: 'Ma sœur n’aime pas en manger.',
  d: 'Tu leur as montré tes achats.'
} };

ANSWERS['qp2019 7'] = { tier: 'modele', items: {
  a: 'Ces peintures sont plus belles que celles-là.',
  b: 'Regarde cet arbre sans fruits. Mais celui qui est devant nous en a beaucoup.',
  c: 'Quels romans veux-tu emprunter ? Ceux-ci ou ceux-là ?'
} };

ANSWERS['qp2019 8'] = { tier: 'modele', items: {
  a: 'Paul me dit : « Viens chez moi pour m’aider. »',
  b: 'Elle me demande : « Qu’est-ce que tu fais ce week-end avec tes parents ? »',
  c: 'Mes parents me demandent à quelle heure je vais aller à la piscine.'
} };

ANSWERS['qp2019 9'] = { tier: 'modele', items: {
  a: 'Vous n’êtes jamais allé en France.',
  b: 'Vous n’avez rencontré personne dans le centre commercial.',
  c: 'Rien n’est tombé de mon sac.'
} };

ANSWERS['qp2019 10'] = { tier: 'modele', items: {
  a: 'Il faut que vous appreniez les conjugaisons chaque soir.',
  b: 'J’aimerais que tu aies du courage pour confronter les obstacles dans la vie.',
  c: 'Mes parents veulent que nous riions beaucoup. C’est bon pour la santé.'
} };

ANSWERS['qp2019 11'] = { tier: 'modele', items: {
  a: 'Posez-leur cette question à laquelle vous voulez une réponse !',
  b: 'Rencontrez maintenant vos amis chez lesquels vous n’avez pas pu aller !',
  c: 'Ma mère, pour laquelle j’achète toujours des fleurs, est très gentille.'
} };

ANSWERS['qp2019 12'] = { tier: 'modele', items: {
  a: 'De quoi as-tu besoin ?',
  b: 'Comment ces hommes parlent-ils ?',
  c: 'Quel temps fera-t-il demain ?'
} };

ANSWERS['qp2019 13'] = { tier: 'modele', items: {
  a: 'J’ai fait mes devoirs. Et toi, as-tu fait les tiens ?',
  b: 'Les enfants ont rencontré leurs amies. Nous avons rencontré les nôtres.',
  c: 'Nos étudiants sont ponctuels. Mais, les leurs sont toujours en retard. Donc, ils sont mécontents.'
} };

ANSWERS['qp2019 14'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'En France, il y a l’école maternelle, l’école primaire, le collège, qui se termine par le brevet, et le lycée, qui se termine par le baccalauréat. Ensuite viennent les études supérieures.',
  b: 'La grande pyramide se trouve dans la cour Napoléon du Louvre, à Paris. Elle a été construite par l’architecte Ieoh Ming Pei.',
  c: 'Le Président français représente le pays tout entier et il est le chef des armées. Il nomme aussi le Premier ministre.',
  d: 'Le 21 mai est la Journée mondiale de la diversité culturelle. Un de ses objectifs est d’encourager le dialogue entre les cultures du monde.',
  e: 'La Sécurité Sociale est le système français qui protège les travailleurs et leur famille : elle rembourse les frais médicaux et garantit une retraite aux travailleurs.',
  f: 'Pour conserver l’environnement, il faut économiser l’eau et l’électricité, prendre les transports en commun, planter des arbres et ne pas gaspiller les ressources naturelles.'
} };

ANSWERS['qp2019 15'] = { tier: 'modele', items: {
  a: 'Baccalauréat — (iii) Lycée',
  b: 'Quittance de loyer — (v) Bibliothèque',
  c: 'Bavella — (iv) Collines en Corse',
  d: 'Ville de la technologie de l’information — (ii) Bengaluru',
  e: 'Fast-food — (vi) Les chips',
  f: 'Chercher un emploi — (i) pôle-emploi.fr'
} };

ANSWERS['qp2019 16'] = { tier: 'modele', items: {
  a: 'Il faut avoir une bonne connexion pour le Wi-fi.',
  b: '« Zapper » veut dire passer d’une chaîne à l’autre.',
  c: 'Le Petit Prince est un roman d’Antoine de Saint-Exupéry.',
  d: '« Fait divers » est une rubrique d’un journal.',
  e: O('Le Palais Bourbon est le siège de l’Assemblée Nationale.', 8),
  f: 'Pour être en bonne forme, il faut manger des crudités.'
} };

ANSWERS['qp2019 17'] = { tier: 'modele', items: {
  a: 'La diversité culturelle est un droit humain fondamental. - Vrai',
  b: 'Pour conserver de l’eau, on doit arroser les plantes le soir. - Vrai',
  c: 'Les médias jouent un rôle important dans la formation de l’opinion publique. - Vrai',
  d: 'Après avoir tapé le mot de passe, il n’est pas nécessaire de valider. - Faux'
} };

ANSWERS['qp2019 18'] = { tier: 'modele', items: {
  a: 'brevet — les trois autres décrivent l’école publique ; le brevet est un diplôme.',
  b: 'promenade — les trois autres sont des tâches ménagères.',
  c: 'Europe — les trois autres sont des chaînes de télévision ; Europe 1 est une radio.',
  d: 'citoyens — les trois autres font partie du Parlement français.'
} };


/* ================= 2020 ================= */

ANSWERS['qp2020 I(a)'] = { tier: 'modele', rubric: 'libre', items: {
  i:   'en Europe. — non',
  ii:  'aux États-Unis. — non',
  iii: 'en Amérique du Nord. — Le Québec est situé en Amérique du Nord. (bonne réponse)'
} };
ANSWERS['qp2020 I(b)'] = { tier: 'modele', rubric: 'libre', items: {
  i:   'on parle anglais et français. — Au Québec, on parle anglais et français. (bonne réponse)',
  ii:  'on parle seulement en français. — non',
  iii: 'on parle seulement en anglais. — non'
} };
ANSWERS['qp2020 II'] = { tier: 'modele', rubric: 'libre', text:
  'Selon l’image, deux arrondissements du Québec sont La Cité-Limoilou et Les Rivières. ' +
  '(On accepte aussi Sainte-Foy–Sillery–Cap-Rouge, Charlesbourg, Beauport ou La Haute-Saint-Charles.)' };
ANSWERS['qp2020 III'] = { tier: 'modele', rubric: 'libre', text:
  'L’arrondissement historique du Vieux-Québec a été déclaré site du patrimoine mondial par l’Unesco ' +
  'en 1985 parce que la ville de Québec est la seule ville fortifiée en Amérique du Nord et la plus ' +
  'vieille ville francophone d’Amérique.' };
ANSWERS['qp2020 IV'] = { tier: 'modele', rubric: 'libre', text:
  'Selon l’image, le maire du Québec est Régis Labeaume. Son mandat est de quatre ans, de 2017 à 2021.' };
ANSWERS['qp2020 V'] = { tier: 'modele', rubric: 'libre', text:
  'Le Saint-Laurent est un fleuve : c’est l’un des grands fleuves du globe, et la grande majorité de ' +
  'la population du Québec vit à ses abords.' };
ANSWERS['qp2020 VI'] = { tier: 'modele', items: {
  a: 'habite — vit (« la grande majorité de la population vit aux abords du fleuve »)',
  b: 'ancienne — vieille (« la plus vieille ville francophone d’Amérique »)'
} };
ANSWERS['qp2020 VII'] = { tier: 'modele', items: {
  a: 'Le Québec est une petite province du Canada. - Faux — « Il est la plus grande province du Canada. »',
  b: 'Les Québécois aiment parler en français. - Vrai — « Les Québécois sont, en général, fiers d’être francophones. »'
} };

ANSWERS['qp2020 2(a)'] = { tier: 'modele', rubric: 'letter', text:
  'Chandigarh, le 20 février\n\nChère Manon,\n\n' +
  'J’ai une bonne nouvelle : j’ai enfin trouvé un nouveau boulot !\n' +
  'Je travaille depuis lundi dans un bureau au centre-ville. Je suis secrétaire : je tape des lettres, ' +
  'je réponds au téléphone et je classe les dossiers. Mes collègues sont très gentils et le directeur ' +
  'est patient. Je commence à neuf heures et je finis à dix-sept heures, et j’y vais en métro.\n' +
  'Ce travail me plaît énormément ! Et toi, que fais-tu en ce moment ?\n\nAmitiés,\nDivya' };

ANSWERS['qp2020 2(b)'] = { tier: 'modele', rubric: 'letter', text:
  'Chandigarh, le 20 février\n\nCher Aman,\n\n' +
  'Tu m’as demandé de te parler du système d’éducation en France : le voici.\n' +
  'L’école est gratuite et obligatoire. Les enfants vont d’abord à l’école maternelle, puis à l’école ' +
  'primaire. Ensuite ils entrent au collège, où ils passent le brevet, et enfin au lycée, où ils ' +
  'préparent le baccalauréat. Avec le bac on peut entrer à l’université ou dans un IUT.\n' +
  'C’est assez différent de chez nous, n’est-ce pas ?\n\nTon frère,\nNikhil' };

ANSWERS['qp2020 3(a)'] = { tier: 'modele', rubric: 'libre', text:
  'Cher oncle,\nNous fêtons le 50e anniversaire de mariage de nos grands-parents samedi 12 mars à ' +
  'dix-neuf heures, à la maison. Toute la famille sera là et nous aimerions beaucoup que tu viennes ' +
  'avec ta femme et les enfants. Ce sera une surprise pour eux, alors ne dis rien !\n' +
  'Réponds-nous vite. Affectueusement, Meera' };

ANSWERS['qp2020 3(b)'] = { tier: 'modele', rubric: 'libre', text:
  'Cliente 1 : Bonjour Monsieur ! Nous sommes deux.\n' +
  'Serveur : Entrez Mesdames ! Asseyez-vous !\n' +
  'Cliente 1 : Pour moi, « poisson avec légumes du jour ».\n' +
  'Cliente 2 : Vous faites toujours d’excellents steaks ? Je prends un steak du chef.\n' +
  'Serveur : Oui Madame, vous ne serez pas déçue ! Et pour vous ?\n' +
  'Serveur : Voulez-vous notre spécialité, la tarte au citron ?\n' +
  'Cliente 1 : Non, merci. Je n’aime pas cette tarte. Avez-vous un gâteau au chocolat ?\n' +
  'Serveur : Bien sûr ! Presque tout le monde aime ce gâteau.\n' +
  'Cliente 2 : Super ! Un gâteau et deux tasses de café pour nous, s’il vous plaît.\n' +
  'Serveur : Très bien. Dans cinq minutes, mesdames.' };

ANSWERS['qp2020 3(c)'] = { tier: 'modele', rubric: 'libre', text:
  'Le modern jazz est un mélange de plusieurs danses comme le jazz, la danse classique, la danse ' +
  'moderne, la danse africaine, les claquettes et la danse espagnole. Et c’est une des raisons pour ' +
  'laquelle il attire : par sa diversité, le modern jazz convient à beaucoup de personnalités. Il ' +
  'laisse beaucoup de liberté aux danseurs tout en étant technique. Elle demande de la souplesse, de ' +
  'la rigueur et de l’énergie. Comme toutes les danses, elle permet l’expression des sentiments. ' +
  'D’ailleurs, le nom vient des États-Unis, où on l’enseigne dans beaucoup d’écoles.' };

ANSWERS['qp2020 4'] = { tier: 'modele', items: {
  a: 'Si tu sortais avec nous, on irait ensemble voir un beau spectacle.',
  b: 'Dès que nous aurons conduit pour 2 heures, nous traverserons la belle campagne.',
  c: 'Avant-hier, ma sœur est rentrée de la Malaisie.',
  d: 'Les écrivains ne faisaient pas de sports autrefois.',
  e: 'Lorsque la musicienne était arrivée, le concert a commencé.',
  f: 'Sache bien les paroles de la chanson !',
  g: 'Tout le monde s’est arrêté devant la tour pour admirer l’illumination.',
  h: 'En 2021, ma famille et moi voyagerons pour 3 mois.'
} };

ANSWERS['qp2020 5'] = { tier: 'modele', items: {
  a: 'La chaise sur laquelle tu vas t’asseoir est sale.',
  b: 'La liberté est un concept auquel tout le monde s’attache.',
  c: 'La personne pour laquelle j’ai voté a été élue.',
  d: 'Ce sont mes amis d’enfance chez lesquels j’irai pendant mes vacances.'
} };

ANSWERS['qp2020 6'] = { tier: 'modele', items: {
  a: 'Je l’ai rencontré chez elle.',
  b: 'Ce village leur plaît beaucoup.',
  c: 'Fais-y attention !',
  d: 'Il en prend au petit déjeuner. Nous en mangeons le matin.'
} };

ANSWERS['qp2020 7'] = { tier: 'modele', items: {
  a: 'Quel temps fait-il ?',
  b: 'Comment sont les jeunes ?',
  c: 'Pourquoi dort-elle ?',
  d: 'À quoi penses-tu ?'
} };

ANSWERS['qp2020 8'] = { tier: 'modele', items: {
  a: 'Elle s’intéresse toujours à ses études mais lui, il ne s’intéresse pas aux siennes.',
  b: 'Tu as visité ta ville ? Je n’ai pas encore visité la mienne.',
  c: 'Vous allez envoyer une invitation à vos grands-parents, nous allons l’envoyer aux nôtres.',
  d: 'Ils se souviennent de leurs amies extraordinaires, mais elle ne se souvient pas des siens.'
} };

ANSWERS['qp2020 9'] = { tier: 'modele', items: {
  a: 'Il voudrait bien qu’elles aillent chez lui.',
  b: 'Anne a peur qu’elle apprenne mal son dialogue.',
  c: 'Il faut que je voie ce film.',
  d: 'J’aimerais bien que vous puissiez assister à ce concert.'
} };

ANSWERS['qp2020 10'] = { tier: 'modele', items: {
  a: 'Viens chez moi !',
  b: 'Suzanne est assise à côté de moi.',
  c: 'Elle vient de retourner de son voyage en Inde.',
  d: 'Il va acheter ce roman pour sa copine.',
  e: 'Je vais au Maroc pendant mes vacances.',
  f: 'Habitez-vous à Colombo ?',
  g: 'Parle-t-on anglais en France ?',
  h: 'Raghav est malade depuis une semaine.'
} };

ANSWERS['qp2020 11'] = { tier: 'modele', items: {
  a: 'Il me dit : « Je vais écouter ton discours. »',
  b: 'Nous avons dit aux enfants : « Restez avec nous ! »',
  c: 'Maman demande à Asha quel cadeau elle veut pour son anniversaire.',
  d: 'Pierre me demande si je veux aller au cinéma avec lui.'
} };

ANSWERS['qp2020 12'] = { tier: 'modele', items: {
  a: 'Cet appartement est magnifique.',
  b: 'Cela ne semble pas difficile.',
  c: 'Ne prenez pas ces romans, prenez ceux-là !',
  d: 'Nous ne voulons pas cette salade. Commandons celle-là, s’il te plaît. Cette exposition a plus de tableaux que celle-là.'
} };

ANSWERS['qp2020 13'] = { tier: 'modele', items: {
  a: 'Personne ne l’apprécie.',
  b: 'Lillette n’achète ni crème ni farine.',
  c: 'Nous n’avons pas encore préparé le repas.',
  d: 'Il n’a plus d’euros avec lui.'
} };

ANSWERS['qp2020 14'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'Pour s’inscrire dans une bibliothèque en France, il faut une pièce d’identité, un justificatif de domicile et une photo, et il faut payer une petite cotisation.',
  b: 'Pour garder une bonne forme, il faut dormir huit heures par nuit, manger des fruits et des légumes, boire beaucoup d’eau et faire du sport régulièrement.',
  c: 'J’étudie le français, l’anglais, les mathématiques, les sciences et l’histoire-géographie. Je préfère le français parce que j’aime les langues.',
  d: 'Pour faire le jardinage, on prépare la terre, on plante les graines, on arrose les plantes le soir et on enlève les mauvaises herbes.',
  e: 'Le Président français représente le pays tout entier et il est le chef des armées. Il nomme aussi le Premier ministre.',
  f: 'Une jeune fille en France va au lycée la semaine et retrouve ses amis au café. Elle fait du sport et écoute de la musique. Beaucoup travaillent le week-end pour gagner un peu d’argent.',
  g: 'Les médias informent, éduquent et distraient le public. Ils jouent aussi un rôle important dans la formation de l’opinion publique.'
} };

ANSWERS['qp2020 15'] = { tier: 'modele', items: {
  a: 'Bonifacio, en Corse a des côtes et des villages.',
  b: 'Il n’a pas de travail fixe, il fait de l’intérim.',
  c: 'Je veux envoyer un mél mais son ordinateur ne marche pas !',
  d: 'L’éditorial est une rubrique dans le journal.',
  e: 'Metro, boulot, dodo signifie la vie urbaine.',
  f: 'L’UNESCO a déclaré le 21 mai comme Journée internationale de la diversité culturelle.',
  g: 'Je viens de recevoir des messages dans ma boîte aux lettres.',
  h: 'Le palais de l’Élysée est la résidence présidentielle en France.'
} };

ANSWERS['qp2020 16'] = { tier: 'modele', items: {
  a: 'Après la pluie — (iii) le beau temps',
  b: 'le bordeaux — (iv) vin',
  c: 'pharmacie — (vi) médicaments',
  d: 'le roquefort — (i) fromage',
  e: 'Louvre — (ii) château médiéval',
  f: 'TF1 — (v) chaîne de télévision française'
} };

ANSWERS['qp2020 17'] = { tier: 'modele', items: {
  a: 'courrier des lecteurs — les trois autres sont des genres littéraires ; celui-ci est une rubrique de journal.',
  b: 'dossiers — les trois autres servent au ménage ; les dossiers sont des objets de bureau.',
  c: 'ARTE — les trois autres sont des supports ; ARTE est une chaîne de télévision.',
  d: 'Europe 1 — les trois autres sont des journaux ; Europe 1 est une radio.',
  e: 'chômage — les trois autres concernent Internet.'
} };

ANSWERS['qp2020 18'] = { tier: 'modele', items: {
  a: 'Il faut apprécier les autres cultures du monde. - Vrai',
  b: O('Quand nous tombons sur le répondeur, nous avons fait un faux numéro. - Faux', 7),
  c: 'La protection de l’environnement dépend de tous nos efforts. - Vrai',
  d: '« Malgudi Days » est un roman de St. Exupéry. - Faux (il est de R.K. Narayan)',
  e: 'La Fontaine a écrit les Fables. - Vrai'
} };


/* ================= 2022 (Term 2, 40 marks) ================= */

ANSWERS['qp2022 1'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'D’après l’image, les adolescents perdent leur sommeil à cause du stress (55 %), parce qu’ils regardent des écrans avant de dormir (41 %), parce qu’ils se couchent après minuit (36 %) et à cause de l’école (22 %).',
  b: 'Il faut bien dormir parce que le sommeil nous rend résistant et plus intelligent : une nuit de bon sommeil aide à être actif pendant toute la journée.',
  c: 'Si on dort mal, un sommeil insuffisant peut affecter notre état mental et notre état physique.',
  d: 'Notre sommeil est grandement affecté par le travail, l’école, la famille et toutes les autres préoccupations de la vie quotidienne.',
  e: 'Le sommeil paradoxal favorise la créativité.',
  f: 'Nous profitons d’un « bon sommeil » parce qu’il diminue le risque des maladies : on apprend mieux et on est en bonne humeur.',
  g: 'Oui, je dors bien. Je dors huit à neuf heures par nuit et je me couche avant onze heures.'
} };

ANSWERS['qp2022 2(a)'] = { tier: 'modele', rubric: 'letter', text:
  'Nagpur, le 5 mai\n\nChère Camille,\n\n' +
  'Tu m’as demandé pourquoi j’aime tant aller à la bibliothèque : je partage avec toi « le plaisir de lire ».\n' +
  'C’est un endroit calme où je peux lire pendant des heures. J’y trouve des romans, des bandes ' +
  'dessinées, des magazines et même des DVD. Avec ma carte de lecteur, j’emprunte trois livres par ' +
  'semaine. La lecture m’apprend des mots nouveaux et me fait voyager sans quitter ma ville.\n' +
  'Viens avec moi la prochaine fois !\n\nAmitiés,\nShreya' };

ANSWERS['qp2022 2(b)'] = { tier: 'modele', rubric: 'letter', text:
  'Nagpur, le 5 mai\n\nCher Lucas,\n\n' +
  'J’ai appris que tu étais tombé malade et je suis désolé. Ne t’inquiète pas, tu vas vite guérir !\n' +
  'Prends bien tes médicaments, bois beaucoup d’eau et dors au moins huit heures par nuit. Mange des ' +
  'fruits, des légumes et de la soupe, et évite le fast-food. Quand tu iras mieux, fais une petite ' +
  'promenade chaque jour.\n' +
  'Courage ! Je pense à toi et j’attends de tes nouvelles.\n\nAmicalement,\nDev' };

ANSWERS['qp2022 2(c)'] = { tier: 'modele', rubric: 'letter', text:
  'Nagpur, le 5 mai\n\nChère Élodie,\n\n' +
  'Notre planète souffre et je voulais te dire ce que nous devons faire pour sauver la Terre.\n' +
  'Il faut économiser l’eau et l’électricité, prendre le bus ou le vélo au lieu de la voiture, et ' +
  'refuser les sacs en plastique. Il ne faut pas gaspiller les ressources naturelles ni jeter les ' +
  'bouteilles vides dans la nature. Plantons des arbres avec nos amis !\n' +
  'La protection de l’environnement dépend de tous nos efforts.\n\nAmitiés,\nAarav' };

ANSWERS['qp2022 3'] = { tier: 'modele', items: {
  a: 'Elle reviendra dans une semaine.',
  b: 'Mon frère a lu l’article hier.',
  c: 'Il y a quelques secondes, ton portable a sonné.',
  d: 'Aussitôt que les acteurs seront montés sur la scène, nous prendrons les photos.',
  e: '« Veuillez attendre un peu, s’il vous plaît » dit le secrétaire.',
  f: 'Je me coucherai dans une heure.',
  g: 'Quand les éléphants ont traversé le chemin, le train était déjà passé.'
} };

ANSWERS['qp2022 4'] = { tier: 'modele', items: {
  a: 'Le directeur lui dit : « Ne regarde pas la réponse ! »',
  b: 'Elle te demande si tu peux lui envoyer la lettre.',
  c: 'Jean me demande : « Quel temps fait-il dans ta ville ? »',
  d: 'Elena nous dit qu’elle va nous téléphoner ce soir-là.',
  e: 'Je te dis de voyager avec moi.'
} };

ANSWERS['qp2022 5'] = { tier: 'modele', items: {
  a: 'Comment sont ses cheveux ?',
  b: 'Avec quoi cuisine-t-elle ?',
  c: 'D’où sont-ils arrivés ?',
  d: 'Quel temps fait-il ?',
  e: 'Comment sont ces croissants ?'
} };

ANSWERS['qp2022 6'] = { tier: 'modele', items: {
  a: 'J’ai parlé à mon professeur et tu dois parler au tien.',
  b: 'Où avez-vous garé votre voiture ? La nôtre est au sous-sol.',
  c: 'Je préfère tes poèmes, les miens sont ennuyeux.',
  d: 'Ma mère vient de rencontrer la tienne.',
  e: 'Elle se souvient de son séjour en France. Vous souvenez-vous du vôtre ?'
} };

ANSWERS['qp2022 7'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'Nous contribuons au réchauffement de la terre en brûlant trop de carburant, en utilisant la voiture partout, en gaspillant l’électricité et en coupant les arbres.',
  b: 'Jules Verne est un écrivain français du XIXe siècle, connu pour ses romans d’aventures. Il a écrit « Le Tour du monde en quatre-vingts jours ».',
  c: 'Jean de La Fontaine a écrit Les Fables. Une de ces fables est « Le corbeau et le renard ».',
  d: 'La sécurité sociale est le système français qui protège les travailleurs et leur famille : elle rembourse les frais médicaux et garantit une retraite aux travailleurs.',
  e: 'Pour rester en bonne forme, je mange des fruits, des légumes et des crudités, et je bois beaucoup d’eau. J’évite le fast-food et les boissons sucrées.',
  f: 'Oui, je lis le journal tous les matins. On y trouve, par exemple, la rubrique « fait divers » et l’éditorial.',
  g: 'Pour s’inscrire dans une bibliothèque en France, il faut une pièce d’identité, un justificatif de domicile et une photo, et il faut payer une petite cotisation.',
  h: O('Une pharmacie est un lieu où l’on peut acheter des médicaments.', 7)
} };


/* ================= 2023 ================= */

ANSWERS['qp2023 1(i)'] = { tier: 'modele', rubric: 'libre', items: {
  a: 'Les médias ont des effets négatifs : les adolescents sortent moins parce qu’ils sont devant l’écran, et une trop grande exposition à la télévision et aux jeux vidéo leur fait du mal.',
  b: 'La télévision peut être un professeur d’une grande influence : elle peut améliorer les aptitudes de lecture et d’apprentissage de ses téléspectateurs.',
  c: 'Oui. Internet possède l’énorme potentiel de fournir aux enfants et aux adolescents l’accès à de l’information éducative, et il peut se comparer à une énorme bibliothèque à domicile.'
} };
ANSWERS['qp2023 1(ii)'] = { tier: 'modele', items: {
  a: 'Selon l’infographie les adolescents sont très connectés sur les réseaux sociaux. - Vrai',
  b: 'Les médias jouent un rôle important dans la vie des adolescents. - Vrai',
  c: 'Les parents des adolescents sont souvent aussi habiles que leurs enfants, selon le texte. - Faux',
  d: 'Les adolescents sortent moins parce qu’ils sont devant l’écran. - Vrai',
  e: 'Les jeux vidéo ont toujours de bons effets sur un adolescent. - Faux',
  f: 'Internet est un outil important pour avoir de l’information. - Vrai'
} };
ANSWERS['qp2023 1(iii)'] = { tier: 'modele', items: {
  a: 'Une préposition — sur, à, de, dans, aux',
  b: 'Un adjectif — négatifs, éducative, énorme',
  c: 'étudier — les études',
  d: 'détériorer — améliorer',
  e: '« très grand » — énorme',
  f: 'production — produire'
} };

ANSWERS['qp2023 2'] = { tier: 'modele', rubric: 'letter', items: {
  i: 'Delhi, le 20 février — Chère Léa, Comment vas-tu ? Je veux te parler de mes loisirs préférés. ' +
     'J’aime beaucoup lire : je vais à la bibliothèque chaque samedi et j’emprunte des romans et des ' +
     'bandes dessinées. J’écoute aussi de la musique et je joue au badminton avec mes amis. Le ' +
     'dimanche, je fais du jardinage avec ma mère. Et toi, quels sont tes loisirs ? Amitiés, Ira',
  ii: 'Delhi, le 20 février — Cher Rohit, J’ai appris que tu cherchais du travail. Voici ce que tu ' +
      'dois faire. Prépare d’abord un bon CV et une lettre de motivation. Consulte des sites comme ' +
      'pôle-emploi.fr et lis les petites annonces dans le journal. Parle de ta recherche autour de ' +
      'toi, et prépare bien tes entretiens. Bon courage ! Ton frère, Aman',
  iii: 'Delhi, le 20 février — Chère Zoé, Je veux te décrire une journée dans la bibliothèque de ma ' +
       'ville. J’arrive vers dix heures avec ma carte de lecteur. Je lis les journaux dans la salle ' +
       'de lecture, puis je cherche des romans dans les rayons. À midi, je travaille sur un ' +
       'ordinateur. Tout le monde reste silencieux : c’est très agréable. Amitiés, Neha'
} };

ANSWERS['qp2023 3(i)'] = { tier: 'modele', rubric: 'libre', text:
  'Chers amis,\nNous fêtons les 25 ans de mon frère Karan samedi 4 mars à dix-neuf heures, chez nous, ' +
  '12 rue des Lilas. Il y aura de la musique, un grand gâteau et beaucoup de surprises. Venez tous ! ' +
  'Répondez-moi avant jeudi.\nAmicalement, Isha' };

ANSWERS['qp2023 3(ii)'] = { tier: 'modele', rubric: 'libre', text:
  'Mme. Saby : Tu vas sortir ce week-end ?\n' +
  'Naomi : Oui, je vais voir le Pont du Gard avec l’école.\n' +
  'Mme. Saby : Tu pars à quelle heure ?\n' +
  'Naomi : Comme d’habitude, mais je vais certainement rentrer plus tard.\n' +
  'Mme. Saby : Très bien ! Tu veux apporter quelque chose ?\n' +
  'Naomi : Non, c’est gentil, on va acheter un sandwich sur la route.\n' +
  'Mme. Saby : D’accord. Je vais préparer un bon poulet avec une soupe aux oignons. J’en laisserai dans le frigo.\n' +
  'Naomi : Merci, c’est très gentil.\n' +
  'Mme. Saby : Allez, je te laisse. Bonne nuit Naomi.\n' +
  'Naomi : Bonne nuit Madame !' };

ANSWERS['qp2023 3(iii)'] = { tier: 'modele', rubric: 'libre', text:
  'Pour aller de Paris à Lyon, on peut prendre le train, l’avion, le bus et même le taxi. Le plus ' +
  'rapide, c’est l’avion. On met une heure pour aller de Paris à Lyon. C’est le plus rapide, mais ' +
  'c’est aussi le plus cher. Le voyage en avion coûte 150 euros pour un aller. Bien sûr, ça dépend ' +
  'des jours et des compagnies aériennes. Il y a un autre moyen de transport assez rapide, c’est le ' +
  'train. En plus c’est beaucoup moins cher que l’avion, ça coûte 42 euros l’aller simple. Le train ' +
  'est moins rapide que l’avion, c’est vrai, mais il met seulement deux heures. C’est donc plus ' +
  'rapide que le bus et c’est aussi plus confortable. Si le train et le taxi sont les moyens de ' +
  'transport les plus confortables, le moins cher c’est quand même le bus.' };

ANSWERS['qp2023 4'] = { tier: 'modele', items: {
  i:   'Je veux me coucher tôt ce soir.',
  ii:  'Il y a une heure, nous avons complété l’affiche.',
  iii: 'Veuillez écrire votre nom sur la fiche !',
  iv:  'Dans quelques instants, il va présenter son œuvre.',
  v:   'S’il faisait froid, il ne sortirait pas.',
  vi:  'Dès que l’actrice sera revenue, le réalisateur racontera l’histoire.',
  vii: 'L’année dernière, elles se sont rencontrées dans la rue.'
} };

ANSWERS['qp2023 5'] = { tier: 'modele', items: {
  i:   'Je leur demande : « Pouvez-vous visiter mon école ? »',
  ii:  'Paul lui dit : « Accompagne-moi au stade ! »',
  iii: 'Mon père me demande ce qui m’ennuie.',
  iv:  'Notre ami nous demande si nous faisons du yoga tous les jours.',
  v:   'Ma mère me dit : « Tu pourras sortir sans moi. »',
  vi:  'Harry lui demande : « Qu’est-ce que tu voudrais comme cadeau ? »',
  vii: 'L’agent de police nous dit qu’il faut conduire prudemment.'
} };

ANSWERS['qp2023 6(a)'] = { tier: 'modele', items: {
  i:   'Quand Miriam arrive-t-elle ?',
  ii:  'Avec quoi manges-tu la salade ?',
  iii: 'Pourquoi ne sors-tu pas ?',
  iv:  'Comment sont les magasins ?',
  v:   'Qu’est-ce qu’elle a acheté ?'
} };

ANSWERS['qp2023 6(b)'] = { tier: 'modele', items: {
  i:   'Non, je ne me couche jamais à minuit.',
  ii:  'Non, je ne mets pas de sucre dans mon café.',
  iii: 'Non, je n’ai lu ni Astérix ni Tintin.',
  iv:  'Non, nous n’avons pas encore copié les dessins.',
  v:   'Non, personne ne vient de frapper à la porte.'
} };

ANSWERS['qp2023 7(a)'] = { tier: 'modele', items: {
  i:   'Je vais prendre mon roman, prenez le vôtre aussi !',
  ii:  'Le garçon lui a servi son dessert, j’attends le mien.',
  iii: 'Chers amis, où sont vos photos ? Nous avons mis les nôtres dans la boîte.',
  iv:  'La jeune fille s’occupe bien de ses parents, et lui, s’occupe-t-il des siens ?',
  v:   'Ma voix est plus belle que la tienne.'
} };

ANSWERS['qp2023 7(b)'] = { tier: 'modele', items: {
  i:   'Cette boisson fraîche est meilleure que celle-là.',
  ii:  'J’aime ce restaurant. Celui qui est derrière le musée est trop petit.',
  iii: 'J’ai emprunté 2 bandes dessinées, celle-ci pour toi et celle-là pour moi.',
  iv:  'Voulez-vous visiter cette maison ou celle-là ?',
  v:   'Écoutes-tu ces vieilles chansons et celles de Elvis Presley ?'
} };

ANSWERS['qp2023 8(a)'] = { tier: 'modele', items: {
  i:   'J’ai assisté au concert dont tu m’as parlé.',
  ii:  'Elle a reçu la lettre que tu as écrite.',
  iii: 'Nous ne connaissons pas cette dame avec laquelle vous parlez.',
  iv:  'Le professeur a trouvé les erreurs auxquelles je n’ai pas fait attention.',
  v:   'Voilà Sophie qui m’a invité au dîner.'
} };

ANSWERS['qp2023 8(b)'] = { tier: 'modele', items: {
  i:   'Kathy ne l’a pas acceptée.',
  ii:  'Entres-y !',
  iii: 'Ma cousine va t’en donner.',
  iv:  'Ce sont elles qui rient.',
  v:   'Je ne les leur montre pas.'
} };

ANSWERS['qp2023 9'] = { tier: 'modele', items: {
  i:   'Il faut que nous sachions le chemin.',
  ii:  'Elle ne pense pas que tu viennes à la soirée.',
  iii: 'Je suis content que tes amis soient à l’heure pour le concours.',
  iv:  'Elle ne veut pas que nous ayons du mal à la comprendre.',
  v:   'Il exige que je finisse mon devoir.',
  vi:  'Claire souhaite que tu voies ce film avec elle.',
  vii: 'Nous sommes heureux qu’elle puisse chanter.'
} };

ANSWERS['qp2023 10'] = { tier: 'modele', rubric: 'libre', items: {
  i:   'En France, on entre au primaire à six ans, au collège à onze ans et au lycée à quinze ans.',
  ii:  O('Ieoh Ming Pei est un architecte.', 8),
  iii: 'On s’inscrit dans une bibliothèque pour emprunter des livres, des magazines, des CD et des DVD, et pour lire dans une salle calme.',
  iv:  'Le musée d’Orsay se trouve à Paris, au bord de la Seine. Il y a beaucoup de peintures impressionnistes dans le musée.',
  v:   'Nous pouvons fermer le robinet en nous brossant les dents, prendre une douche courte, arroser les plantes le soir et réparer les fuites.',
  vi:  '« La sécu », c’est la Sécurité sociale : le système français qui rembourse les frais médicaux et garantit une retraite aux travailleurs.',
  vii: 'Le Président représente le pays tout entier, il est le chef des armées et il nomme le Premier ministre.'
} };

ANSWERS['qp2023 11'] = { tier: 'modele', items: {
  i:   'Si je tombe sur le répondeur, je laisse un message.',
  ii:  'Le Sénat est une des deux assemblées en France.',
  iii: 'Il faut absolument réduire le réchauffement de la terre.',
  iv:  'Je n’arrive pas à dormir, j’ai passé une nuit blanche.',
  v:   'Je vais regarder le film en version originale.',
  vi:  'Le Louvre reste le musée le plus visité du monde.',
  vii: 'Canal+ est une chaîne de télévision.'
} };

ANSWERS['qp2023 12(a)'] = { tier: 'modele', items: {
  i:   'Le Monde — journal',
  ii:  'ARTE — chaîne culturelle',
  iii: 'Fables — La Fontaine',
  iv:  'passer un — concours',
  v:   'le travail — intérim'
} };

ANSWERS['qp2023 12(b)'] = { tier: 'modele', items: {
  i:   'L’Express est un mensuel. - Faux (c’est un hebdomadaire)',
  ii:  'Première est la deuxième année de lycée. - Vrai',
  iii: 'On peut trouver des jeux vidéo dans une bibliothèque en France. - Vrai',
  iv:  'Malgudi Days est une revue indienne. - Faux (c’est un recueil de nouvelles de R.K. Narayan)',
  v:   'Le médecin doit remplir des formulaires de sécu de son patient en France. - Vrai'
} };


/* ================= 2024 ================= */

ANSWERS['qp2024 1(a)'] = { tier: 'modele', rubric: 'libre', items: {
  i:   'Nous sommes aujourd’hui dans un processus de mondialisation : il y a plus d’échanges économiques, diplomatiques, culturels ou commerciaux entre les différentes régions du globe, donc un besoin de communication entre les différentes populations mondiales est fort nécessaire.',
  ii:  'Oui. L’enseignement d’une seconde langue aux enfants dès l’école primaire, même maternelle, cherche à développer plus de tolérance vers les autres dans une société moderne d’aujourd’hui.',
  iii: 'Apprendre une langue étrangère permet de voyager beaucoup plus facilement et de découvrir le monde soi-même. Maîtriser la langue locale permet aussi de communiquer avec des personnes qui ne parlent pas forcément l’anglais.'
} };
ANSWERS['qp2024 1(b)'] = { tier: 'modele', items: {
  i:   'Parler une langue étrangère peut être utile dans beaucoup de domaines de la vie. - Vrai',
  ii:  'Selon l’image 300 millions de personnes parlent français. - Vrai',
  iii: 'On n’a pas besoin de connaitre plus d’une langue, selon le texte. - Faux',
  iv:  'D’après le texte, le voyage est plus intéressant si on parle la langue de la région. - Vrai',
  v:   'Parler l’anglais est suffisant quand on voyage dans n’importe quel pays. - Faux',
  vi:  'On peut avoir de meilleures relations avec les autres si on parle leur langue. - Vrai'
} };
ANSWERS['qp2024 1(c)'] = { tier: 'modele', items: {
  i:   'Une préposition — entre, de, dans, vers, avec',
  ii:  'Un adjectif — économique, culturel, nécessaire, moderne',
  iii: 'étudier — les études',
  iv:  'ancienne — moderne',
  v:   'cuisine — la gastronomie'
} };

ANSWERS['qp2024 2(a)'] = { tier: 'modele', rubric: 'letter', text:
  'Lucknow, le 18 février\n\nCher Olivier,\n\n' +
  'Tu m’as écrit que tu te sentais fatigué. Voici ce que tu peux faire pour rester en pleine forme.\n' +
  'Dors au moins huit heures par nuit et ne regarde pas d’écrans avant de dormir. Mange des fruits, ' +
  'des légumes et des crudités, et bois beaucoup d’eau ; évite le fast-food. Fais du sport chaque ' +
  'jour — la natation ou une simple promenade suffisent — et prends tes repas à l’heure.\n' +
  'Essaie pendant un mois et tu verras la différence !\n\nAmitiés,\nRiya' };

ANSWERS['qp2024 2(b)'] = { tier: 'modele', rubric: 'letter', text:
  'Paris, le 18 février\n\nChère Maman,\n\n' +
  'Je vais bien et je m’habitue à ma nouvelle école. Je veux te décrire le système scolaire en France.\n' +
  'L’école est gratuite et obligatoire. Les enfants commencent à l’école maternelle, puis vont à ' +
  'l’école primaire à six ans. À onze ans ils entrent au collège, qui se termine par le brevet, et ' +
  'à quinze ans au lycée, qui se termine par le baccalauréat. Après le bac on entre à l’université ' +
  'ou dans un IUT.\n' +
  'Tu me manques beaucoup. Je t’embrasse.\n\nTa fille,\nAnjali' };

ANSWERS['qp2024 2(c)'] = { tier: 'modele', rubric: 'letter', text:
  'Lucknow, le 18 février\n\nChère Sarah,\n\n' +
  'Tu m’as demandé pourquoi j’aime tant aller à la bibliothèque : voici ma réponse.\n' +
  'C’est un endroit calme où je peux lire tranquillement. Avec ma carte de lecteur j’emprunte des ' +
  'romans, des bandes dessinées et même des DVD. Je lis aussi les journaux et je travaille sur les ' +
  'ordinateurs. La lecture m’apprend des mots nouveaux et me fait découvrir d’autres cultures.\n' +
  'Viens avec moi quand tu seras en Inde !\n\nAmitiés,\nKavya' };

ANSWERS['qp2024 3(a)'] = { tier: 'modele', rubric: 'libre', text:
  'Chère Amélie,\nMerci pour ton invitation à ta soirée d’anniversaire. Je suis vraiment désolée : ' +
  'je ne peux pas venir car j’ai un examen le lendemain matin. Excuse-moi ! Je passerai te voir ' +
  'dimanche avec ton cadeau.\nBon anniversaire ! Ta cousine, Nidhi' };

ANSWERS['qp2024 3(b)'] = { tier: 'modele', rubric: 'libre', text:
  'Pierre : Bonjour, ça va ? Comment t’appelles-tu ?\n' +
  'Lucas : Bonjour. Oui ça va. Je m’appelle Lucas. Et toi ?\n' +
  'Pierre : Moi, c’est Pierre. Bienvenue au collège Claude Debussy.\n' +
  'Lucas : Merci, c’est gentil.\n' +
  'Pierre : Tu viens d’où ?\n' +
  'Lucas : Je viens de la Provence.\n' +
  'Pierre : La Provence ? C’est loin de Paris ça !\n' +
  'Lucas : C’est vrai. Ici à Paris, tout est immense, il y a du monde partout.\n' +
  'Pierre : Pourquoi as-tu quitté la Provence ?\n' +
  'Lucas : Mon père a trouvé un emploi à Paris.' };

ANSWERS['qp2024 3(c)'] = { tier: 'modele', rubric: 'libre', text:
  'Tout le monde aime les centres commerciaux. En été comme en hiver, les gens visitent ces endroits ' +
  'fantastiques remplis de boutiques variées et d’animations diverses. En effet, même si vous ne ' +
  'voulez pas acheter quelque chose, il est toujours intéressant de passer du temps dans les centres ' +
  'commerciaux. Le centre commercial est l’endroit idéal pour passer un bon moment avec la famille ' +
  'ou des amis. Les gens y vont surtout pour déguster un bon sandwich assis près de la fontaine ou ' +
  'tout en regardant un spectacle de danse.' };

ANSWERS['qp2024 4(a)'] = { tier: 'modele', items: {
  i:   'Le mois dernier, les chanteurs se sont présentés au Directeur.',
  ii:  'Lorsque les crêpes seront prêtes, ils auront déjà déjeuné.',
  iii: 'Ne te fâche pas, je te prie !',
  iv:  'En 2021, nous étudiions souvent en ligne.',
  v:   'Dans une semaine, on verra ce film célèbre.',
  vi:  'Pauline me téléphonerait si elle recevait la bonne nouvelle.',
  vii: 'Aussitôt que le train était arrivé, nous sommes descendus avec nos valises.'
} };

ANSWERS['qp2024 4(b)'] = { tier: 'modele', items: {
  i:   'Son père lui dit de ne pas aller seul.',
  ii:  'Maman me demande si je peux la chercher de son bureau.',
  iii: 'Nous te demandons : « À quelle heure arrive ton train ? »',
  iv:  'Gilles nous dit qu’il ne veut pas nous déranger.',
  v:   'Le proviseur annonce : « L’école sera fermée demain. »',
  vi:  'Je demande à ma sœur ce qu’elle fait samedi soir.',
  vii: 'Je lui dis : « Repose-toi dans ta chambre. »'
} };

ANSWERS['qp2024 4(c)(I)'] = { tier: 'modele', items: {
  i:   'Quel temps fait-il ?',
  ii:  'Quand arrive-t-elle ?',
  iii: 'Avec qui vas-tu sortir ?',
  iv:  'Comment est la leçon ?',
  v:   'Comment sont les histoires ?'
} };

ANSWERS['qp2024 4(c)(II)'] = { tier: 'modele', items: {
  i:   'Non, je ne veux ni sel ni poivre.',
  ii:  'Non, je ne parle jamais en français avec mes parents.',
  iii: 'Non, personne ne sait nager dans ma classe.',
  iv:  'Non, ma famille n’est pas encore allée au Japon.',
  v:   'Non, je ne veux pas acheter de cartes-postales.'
} };

ANSWERS['qp2024 4(d)(I)'] = { tier: 'modele', items: {
  i:   'Ils parlent de leur famille. Parlez-vous de la vôtre ?',
  ii:  'Je m’occupe toujours de mes belles plantes, t’occupes-tu des tiennes ?',
  iii: 'Peux-tu me prêter ta trousse ? Je ne trouve pas la mienne.',
  iv:  'Nous avons fait notre peinture. Il n’a pas encore complété la sienne.',
  v:   'J’ai oublié ma serviette de plage, me prêtes-tu la tienne ?'
} };

ANSWERS['qp2024 4(d)(II)'] = { tier: 'modele', items: {
  i:   'Ces vacances étaient plus belles que celles de l’année dernière.',
  ii:  'Je veux goûter celui-ci, pas celui-là !',
  iii: 'Melissa prend ces lunettes. Elle laisse celles-là pour sa sœur.',
  iv:  'Nous avons visité ce musée. Nous allons visiter celui de Paris bientôt.',
  v:   'Cette station de radio a de meilleures émissions que celle-ci.'
} };

ANSWERS['qp2024 4(e)(I)'] = { tier: 'modele', items: {
  i:   'J’adore ce jardin dans lequel nous nous promenons.',
  ii:  'Elle a bien réussi à ce contrôle auquel elle avait fait bien attention.',
  iii: 'Je viens de voir le documentaire qui est magnifique.',
  iv:  'Veux-tu goûter ces tartes que maman vient de préparer ?',
  v:   'Voilà le lac au bord duquel nous passons nos vacances.'
} };

ANSWERS['qp2024 4(e)(II)'] = { tier: 'modele', items: {
  i:   'La regardes-tu tous les soirs ?',
  ii:  'Eux, ils ne sortent pas beaucoup.',
  iii: 'Attendez-moi là-bas ! (après « moi » à l’impératif, le français n’emploie pas « y »)',
  iv:  'Je vais te les donner.',
  v:   'Il en a fait.'
} };

ANSWERS['qp2024 4(f)'] = { tier: 'modele', items: {
  i:   'Il est important que nous puissions assister à cette fête.',
  ii:  'Il est nécessaire que vous sachiez les verbes.',
  iii: 'J’ai peur qu’elles fassent des bêtises.',
  iv:  'Nous sommes contents que notre professeur aille en France.',
  v:   'Ma mère exige que nous mangions ensemble.',
  vi:  'Il faut qu’un enfant apprenne plus d’une langue.',
  vii: 'Je veux que ma grand-mère soit en bonne santé.'
} };

ANSWERS['qp2024 5'] = { tier: 'modele', rubric: 'libre', items: {
  i:   'Si on est au chômage en France, il faut s’inscrire sur pôle-emploi.fr, préparer un CV et chercher des offres. On reçoit une allocation pendant la recherche.',
  ii:  'Pour avoir une carte de lecteur en France, il faut aller à la bibliothèque avec une pièce d’identité, un justificatif de domicile et une photo, et payer une petite cotisation.',
  iii: 'Les médias sont la presse, la radio, la télévision et Internet. Deux chaînes de télévision française sont TF1 et France 2.',
  iv:  'Le musée d’Orsay se trouve à Paris, au bord de la Seine. Il y a beaucoup de peintures impressionnistes dans le musée.',
  v:   'On peut réduire le gaspillage d’eau en fermant le robinet quand on se brosse les dents, en prenant une douche courte, en arrosant les plantes le soir et en réparant les fuites.',
  vi:  'Le Président français représente le pays tout entier et il est le chef des armées. Il nomme aussi le Premier ministre.',
  vii: 'Un mensuel est une publication qui paraît une fois par mois ; un quotidien est une publication qui paraît chaque jour.'
} };

ANSWERS['qp2024 6'] = { tier: 'modele', items: {
  i:   'Malgudi Days est écrit par R.K. Narayan.',
  ii:  'On laisse un message si on tombe sur un répondeur.',
  iii: 'Il va chez le dentiste car il a mal aux dents.',
  iv:  O('La Sécu garantit une retraite aux travailleurs.', 8),
  v:   'Faire la lessive est une tâche ménagère.',
  vi:  'J’aime faire le jardinage, c’est mon passe-temps favori.',
  vii: 'Le Monde est un journal français.'
} };

ANSWERS['qp2024 7(a)'] = { tier: 'modele', items: {
  i:   'Baccalauréat — Lycée',
  ii:  'IUT — Études supérieures',
  iii: 'Récit — Le Petit Prince',
  iv:  'Fable — Panchatantra',
  v:   'ARTE — Reportage culturel'
} };

ANSWERS['qp2024 7(b)'] = { tier: 'modele', items: {
  i:   'Zapper, c’est passer d’une chaîne à une autre. - Vrai',
  ii:  O('PSG est un métro rapide en France. - Faux', 8),
  iii: 'L’Express est un hebdomadaire. - Vrai',
  iv:  'Tournesol est un roman français. - Faux (Tournesol est un personnage de Tintin)',
  v:   'Le Palais Bourbon est le siège de l’Assemblée Nationale. - Vrai'
} };


/* ================= 2025 ================= */

ANSWERS['qp2025 1(a)'] = { tier: 'modele', rubric: 'libre', items: {
  i:   'Selon l’image, 25% des joueurs jouent régulièrement (1 ou 2 fois par semaine). — Pour les élèves malvoyants : deux titres cités dans le texte sont Pac-Man et Space Invaders.',
  ii:  'Les jeux vidéo sont populaires grâce à la notoriété de certains titres entrés dans la culture populaire, à la démocratisation des téléphones portables et des ordinateurs, et aux jeux gratuits avec des achats dans le jeu.',
  iii: 'Selon une étude de l’Insee de février 2021, le taux d’équipement des ménages français en ordinateurs a doublé en 15 ans : en 2019, 96% des ménages possèdent un téléphone portable et 83% un ordinateur.'
} };
ANSWERS['qp2025 1(b)'] = { tier: 'modele', items: {
  iv:   'Selon l’image, 29% de jeunes jouent rarement aux jeux vidéo. - Faux (29% jouent plusieurs fois par jour) — Pour les élèves malvoyants : « près de 20% des Français ne jouent pas du tout » - Faux (près de 20% jouent plusieurs fois par jour)',
  v:    'Les jeux vidéo sont devenus populaires pendant quelques ans. - Faux (en quelques décennies)',
  vi:   'Les jeux gratuits avec des achats réduisent la popularité des jeux vidéo. - Faux (ils contribuent au développement de la pratique)',
  vii:  'Selon une étude en 2021, les équipements ont doublé dans les ménages français. - Vrai',
  viii: 'Les gens en retraite s’amusent en jouant aux jeux vidéo. - Vrai (on compte 19% de retraités parmi les joueurs français)',
  ix:   'D’après l’enquête Pratique, beaucoup plus de Français ont joué aux jeux vidéo en 2020 qu’en 1997. - Vrai (53% contre 19%)'
} };
ANSWERS['qp2025 1(c)'] = { tier: 'modele', items: {
  x:    'moins — plus',
  xi:   'progresser — la progression',
  xii:  'par exemple — comme',
  xiii: 'quelque chose qui se fait chaque jour — quotidiennement',
  xiv:  'Un pronom relatif — qui (« une progression continue qui exprime une tendance de fond »)'
} };

ANSWERS['qp2025 2(a)'] = { tier: 'modele', rubric: 'letter', text:
  'Puducherry, le 10 mars\n\nChère Emma,\n\n' +
  'J’ai appris que tu étais tombée malade et je suis désolée. Voici ce que tu dois faire pour te rétablir.\n' +
  'Prends bien tes médicaments et repose-toi : dors au moins huit heures par nuit. Bois beaucoup d’eau ' +
  'et mange léger — de la soupe, des fruits et des légumes. Ne regarde pas d’écrans toute la journée. ' +
  'Quand tu iras mieux, fais une petite promenade chaque matin.\n' +
  'Soigne-toi bien ! Donne-moi vite de tes nouvelles.\n\nAmitiés,\nLakshmi' };

ANSWERS['qp2025 2(b)'] = { tier: 'modele', rubric: 'letter', text:
  'Puducherry, le 10 mars\n\nCher Théo,\n\n' +
  'Comment vas-tu ? Tu m’as demandé quels sont mes loisirs préférés : je te réponds.\n' +
  'J’aime beaucoup lire ; je vais à la bibliothèque chaque samedi et j’emprunte des romans et des ' +
  'bandes dessinées. J’écoute aussi de la musique et je joue au badminton avec mes amis. Le dimanche, ' +
  'je fais du jardinage avec ma mère : c’est mon passe-temps favori.\n' +
  'Et toi, que fais-tu pendant ton temps libre ?\n\nAmicalement,\nRaghav' };

ANSWERS['qp2025 2(c)'] = { tier: 'modele', rubric: 'letter', text:
  'Paris, le 10 mars\n\nChère Ananya,\n\n' +
  'Je veux te décrire le système politique français, que j’étudie en ce moment.\n' +
  'La France est une république. Le Président est élu pour cinq ans au suffrage universel : il ' +
  'représente le pays tout entier, il est le chef des armées et il habite au Palais de l’Élysée. Il ' +
  'nomme le Premier ministre. Le Parlement a deux assemblées : l’Assemblée Nationale, au Palais ' +
  'Bourbon, et le Sénat, au Palais du Luxembourg.\n' +
  'Écris-moi si tu veux en savoir plus !\n\nTa cousine,\nMeenakshi' };

ANSWERS['qp2025 3(a)'] = { tier: 'modele', rubric: 'libre', text:
  'Chers amis,\nL’équipe indienne a gagné la Coupe du Monde de T20 ! Pour fêter cette victoire, je ' +
  'vous invite chez moi samedi soir à dix-neuf heures, 8 rue Gandhi. Il y aura de la musique, des ' +
  'samosas et un grand gâteau. Venez avec vos maillots !\nRépondez-moi avant vendredi. Amitiés, Aditi' };

ANSWERS['qp2025 3(b)'] = { tier: 'modele', rubric: 'libre', text:
  'Bonjour à toutes et à tous.\n' +
  'C’est mon dernier jour parmi vous après 8 belles années passées dans notre entreprise.\n' +
  'Je voulais tout simplement vous dire que c’était un très grand plaisir de travailler avec vous.\n' +
  'C’était une expérience très riche que je garderai longtemps en mémoire.\n' +
  'Une page se tourne mais cette étape de ma vie professionnelle restera toujours comme une très ' +
  'belle période de ma vie.\n' +
  'Un grand merci à vous !\n' +
  'Bonne continuation à tous et meilleurs voeux de bonheur à chacun !' };

ANSWERS['qp2025 3(c)'] = { tier: 'modele', rubric: 'libre', text:
  'Greg : Alors voici ta nouvelle chambre !\n' +
  'Nao : Qu’elle est grande !\n' +
  'Greg : Oui, mais le lit est petit. Je suis désolé.\n' +
  'Nao : Ne t’inquiète pas ! Il y a un bureau qui me plaît.\n' +
  'Greg : Oui, un bureau avec des tiroirs pour tes cahiers.\n' +
  'Nao : La table est trop basse. Tu ne penses pas ?\n' +
  'Greg : Et un fauteuil pour les loisirs. Tu pourras lire autant que tu veux.\n' +
  'Nao : Il y a aussi une armoire où je peux mettre mes vêtements.\n' +
  'Nao : En bref, c’est fantastique ! Merci beaucoup !' };

ANSWERS['qp2025 4'] = { tier: 'modele', items: {
  i:   'Ma petite, sois heureuse car nous partons en vacances dans un mois !',
  ii:  'Hier, les jeunes de mon bâtiment avaient déjà nagé quand leurs parents les ont appelés.',
  iii: 'Mes parents achèteront une nouvelle voiture le mois prochain.',
  iv:  'Les élèves achèteront les nouveaux romans aussitôt qu’ils auront fini leurs examens.',
  v:   'Nous nous sommes rencontrés au club la semaine dernière.',
  vi:  'Il faut suivre les consignes données.',
  vii: 'Les jeunes ne connaissent pas les mauvais effets de moins dormir.'
} };

ANSWERS['qp2025 5'] = { tier: 'modele', items: {
  i:   'Paul dit à ses amis de venir à l’heure pour le match de basket.',
  ii:  'Le professeur demande à ses élèves s’ils ont parlé du voyage à Paris.',
  iii: 'Le présentateur déclare : « Le nouveau Président va former le gouvernement bientôt. »',
  iv:  'Ma mère me demande : « Qui as-tu rencontré au centre commercial ? »',
  v:   'Mon frère me dit de ne pas donner ces biscuits à leur chien.',
  vi:  'Mes parents nous disent que nous pourrons aller à la campagne ce week-end-là.',
  vii: 'Daniel demande à ses amis : « Souhaitez-vous venir chez moi pour passer une bonne soirée ? »'
} };

ANSWERS['qp2025 6(a)'] = { tier: 'modele', items: {
  i:   'Veux-tu encore du café ?',
  ii:  'En quoi est cette robe ?',
  iii: 'Qui allez-vous inviter chez vous ?',
  iv:  'Qu’est-ce que tes amis adorent ?',
  v:   'Quel temps fait-il ?'
} };

ANSWERS['qp2025 6(b)'] = { tier: 'modele', items: {
  i:   'Marie ne va jamais au même restaurant.',
  ii:  'Rien n’est tombé sur tes valises.',
  iii: 'Nous n’avons rencontré personne dans votre maison.',
  iv:  'Les enfants ne font plus la même faute.',
  v:   'Vous n’avez acheté ni fruits ni légumes.'
} };

ANSWERS['qp2025 7(a)'] = { tier: 'modele', items: {
  i:   'Donnez-moi vos dossiers. Je vous donne les miens !',
  ii:  'Mes camarades sont occupés et les tiens sont déjà partis.',
  iii: 'Tu penses à ton enfance. Nous pensons à la nôtre.',
  iv:  'Nous avons regardé nos photos. Avez-vous regardé les vôtres ?',
  v:   'Monsieur, j’ai rempli mon formulaire. Mes copains ont-ils rempli le leur ?'
} };

ANSWERS['qp2025 7(b)'] = { tier: 'modele', items: {
  i:   'Nous achetons ces fleurs-ci ! Ne prenez pas celles-là !',
  ii:  'Comment trouvez-vous cet article ? Celui de Pierre est plus informatif.',
  iii: 'Nous n’allons pas à ce magasin. Nous préférons celui qui est au coin de la rue.',
  iv:  '« Donne-moi celui-ci ! Je ne désire pas celui-là ! »',
  v:   'Ces fruits-ci sont trop mûrs ! Ceux-là sont frais.'
} };

ANSWERS['qp2025 8(a)'] = { tier: 'modele', items: {
  i:   'C’est une belle ville dans laquelle mes parents habitent.',
  ii:  'Nous voulons acheter cet appartement dans lequel il y a de grandes chambres.',
  iii: 'Il faut lire ces poèmes dont les auteurs sont bien connus.',
  iv:  'C’est ma nouvelle voiture que j’ai achetée la semaine dernière.',
  v:   'Mes étudiants, auxquels j’explique ce concept difficile, sont très calmes.'
} };

ANSWERS['qp2025 8(b)'] = { tier: 'modele', items: {
  i:   'Viens-tu de les leur envoyer ?',
  ii:  'Nous les avons tous lus.',
  iii: 'Elle adore en faire. Elle va les arroser.',
  iv:  'Elle, elle l’a très bien joué.',
  v:   'Les touristes en ont acheté dans la chocolaterie.'
} };

ANSWERS['qp2025 9'] = { tier: 'modele', items: {
  i:   'Il faut que nous oubliions les mauvaises expériences.',
  ii:  'Maman veut que nous fassions bien notre devoir.',
  iii: 'Ma mère est fâchée que j’aille voir mes amis très tard.',
  iv:  'Les professeurs exigent que nous soyons tranquilles pendant l’examen.',
  v:   'Il est nécessaire que nous accomplissions cette tâche.',
  vi:  'Nous sommes heureux que vous ayez de bonnes notes.',
  vii: 'Notre directeur souhaite que la secrétaire écrive toutes les lettres avant son départ.'
} };

ANSWERS['qp2025 10'] = { tier: 'modele', rubric: 'libre', items: {
  i:   'Après le baccalauréat en France, on peut entrer à l’université, dans un IUT pour des études plus courtes, ou dans une grande école après un concours.',
  ii:  'Un journal a plusieurs rubriques. Deux exemples sont l’éditorial et les faits divers.',
  iii: 'Les médias informent, éduquent et distraient le public. Ils jouent aussi un rôle important dans la formation de l’opinion publique.',
  iv:  'Pour éviter le gaspillage de l’eau, il faut fermer le robinet en se brossant les dents, prendre une douche courte, arroser les plantes le soir et réparer les fuites.',
  v:   'Les tâches ménagères sont les travaux de la maison. Deux exemples sont faire la lessive et faire la cuisine.',
  vi:  'La sécurité sociale est le système français qui protège les travailleurs et leur famille : elle rembourse les frais médicaux et garantit une retraite aux travailleurs.',
  vii: 'Le Président français représente le pays tout entier et il est le chef des armées.'
} };

ANSWERS['qp2025 11'] = { tier: 'modele', items: {
  i:   'Les jeunes peuvent recevoir des bourses pour leurs études supérieures.',
  ii:  'Une ruban adhésive sert à coller.',
  iii: 'Le Tour du Monde en 80 jours est écrit par Jules Verne.',
  iv:  'Zapper veut dire passer d’une chaîne à l’autre.',
  v:   'Un feuilleton est une émission dramatique divisée en épisodes.',
  vi:  O('On peut acheter des médicaments à la pharmacie.', 8),
  vii: 'Pour protéger notre planète, il faut réduire le gaspillage.'
} };

ANSWERS['qp2025 12(a)'] = { tier: 'modele', items: {
  i:   'Le brevet — le collège',
  ii:  'agrafeuse — Bureau',
  iii: 'VO — version originale',
  iv:  'Crudités — fruits et légumes',
  v:   'L’Assemblée Nationale — Députés'
} };

ANSWERS['qp2025 12(b)'] = { tier: 'modele', items: {
  i:   'Le fast-food est bon pour la santé. - Faux',
  ii:  'Il faut conserver de l’électricité. - Vrai',
  iii: 'L’autorisation des parents n’est pas obligatoire pour la carte de lecteur. - Faux (elle est obligatoire pour les mineurs)',
  iv:  'Avant le Louvre était un palais des rois. - Vrai',
  v:   'Le français dans le monde est un hebdomadaire. - Faux (c’est une revue bimestrielle)'
} };

module.exports = { MARKS, RUBRICS, ANSWERS, RUBRIC_FOR: {
  /* which rubric a free-response leaf takes */
  'ex-letter':   'letter',
  'ex-message':  'libre',
  'ex-dialogue': 'libre',
  'ex-story':    'libre',
  'cu-short':    'libre',
  'cp-para':     'libre'
} };
