/**
 * Historical Data for the Louvre 3D Cosmic Experience (1190 - Present)
 * Written in concise, simple English with key dates, facts, and architectural shifts.
 */

const LOUVRE_ERAS = [
  {
    id: "era-1190",
    order: 1,
    year: "1190 AD",
    exactDate: "1190 – 1202",
    title: "The Medieval Fortress",
    frenchTitle: "La Forteresse Médiévale",
    ruler: "King Philippe Auguste",
    architect: "Royal Military Engineers",
    role: "Armed Military Citadel & Treasury",
    color: "#c29d59",
    glowColor: "#f59e0b",
    orbitRadius: 28,
    planetSize: 2.8,
    orbitSpeed: 0.0035,
    subtitle: "Built to guard Paris from English invaders while the King fought in the Crusades.",
    architecture: {
      style: "High Medieval Romanesque-Gothic Military",
      keyFeature: "Grosse Tour (Donjon) & Deep Dry Moat",
      description: "A thick square fortress (78m x 72m) with 10 circular towers and a massive 30-meter high cylindrical central keep surrounded by a deep moat. It was purely a defensive fortress, not a comfortable royal palace."
    },
    historyPoints: [
      "King Philippe Auguste ordered this fortress built before departing for the Third Crusade to shield Paris against Anglo-Norman attacks from the Seine river.",
      "The massive central tower held the royal archives and royal treasury in iron chests under heavy guard.",
      "Today, visitors can still walk through the excavated medieval stone foundations deep below the modern museum's glass pyramid!"
    ],
    funFact: "The word 'Louvre' might come from the Latin 'Lupara' (meaning a place haunted by wolves) or Frankish 'Leovar' (a fortified camp).",
    masterpiece: {
      name: "The Medieval Fortress Moat & Donjon",
      category: "Archaeological Ruin",
      desc: "Excavated in 1984, the medieval stone walls still bear the marks of 12th-century stonecutters."
    },
    audioNote: "Echoes of iron chains, church bells, and medieval stone cutters."
  },
  {
    id: "era-1364",
    order: 2,
    year: "1364 AD",
    exactDate: "1364 – 1380",
    title: "The Gothic Royal Palace",
    frenchTitle: "Le Château de Charles V",
    ruler: "King Charles V 'The Wise'",
    architect: "Raymond du Temple",
    role: "Official Royal Residence & Library",
    color: "#3b82f6",
    glowColor: "#60a5fa",
    orbitRadius: 42,
    planetSize: 3.2,
    orbitSpeed: 0.0028,
    subtitle: "Paris grew larger, turning the grim military fort into an ornate royal haven.",
    architecture: {
      style: "French Flamboyant Gothic",
      keyFeature: "Tower of the Royal Library & Great Spiral Staircase",
      description: "Carved stone mullioned windows brought sunlight into dark stone walls. Elegant conical turrets, ornate chimneypieces, tapestries, and the grand 'Vis du Louvre' (spiral staircase with royal statues) turned the citadel into a palace."
    },
    historyPoints: [
      "Paris had expanded so rapidly that new city walls left the fortress deep inside the city. Charles V felt unsafe in the city center after civil riots and moved his royal court here.",
      "Charles V created the legendary Royal Library in the Falconry Tower, storing over 900 illuminated handwritten manuscripts—the ancestor of France's National Library!",
      "The castle was immortalized in the famous 1410 medieval illuminated manuscript, 'Les Très Riches Heures du Duc de Berry'."
    ],
    funFact: "Charles V owned 917 books when most European kings owned less than 20! He employed full-time scribes to translate Greek and Arabic philosophy into French.",
    masterpiece: {
      name: "Scepter of Charles V & Royal Manuscripts",
      category: "Royal Regalia",
      desc: "An ornate solid gold scepter topped with Charlemagne seated on an imperial throne."
    },
    audioNote: "Chants from royal scribes, rustling parchment, and gentle harpsichord."
  },
  {
    id: "era-1546",
    order: 3,
    year: "1546 AD",
    exactDate: "1546 – 1559",
    title: "The Renaissance Rebirth",
    frenchTitle: "Le Palais de la Renaissance",
    ruler: "King Francis I & Henri II",
    architect: "Pierre Lescot & Jean Goujon",
    role: "Italian Renaissance Royal Showpiece",
    color: "#f59e0b",
    glowColor: "#fbbf24",
    orbitRadius: 58,
    planetSize: 3.4,
    orbitSpeed: 0.0022,
    subtitle: "Tearing down medieval towers to embrace Italian Renaissance beauty and symmetry.",
    architecture: {
      style: "French Classical Renaissance",
      keyFeature: "The Lescot Wing & Caryatids Hall",
      description: "The dark medieval donjon was demolished. Pierre Lescot designed harmonious classical facades with fluted Corinthian pilasters and triangular pediments. Sculptor Jean Goujon carved graceful allegorical reliefs and four monumental stone caryatid women to support the musicians' gallery."
    },
    historyPoints: [
      "Francis I loved Italian culture and brought Leonardo da Vinci to France in 1516, along with masterpieces like the Mona Lisa.",
      "Just before his death in 1546, Francis ordered the complete demolition of the medieval fortress tower to construct a palace worthy of the Renaissance.",
      "The Salle des Caryatides (Caryatids Hall) was used for royal banquets, grand balls, and dramatic theatre plays by Molière."
    ],
    funFact: "Francis I gave Leonardo da Vinci the title 'First Painter, Engineer, and Architect to the King' and a pension just so Leonardo could converse with him daily!",
    masterpiece: {
      name: "The Mona Lisa (La Joconde)",
      category: "Oil Painting by Leonardo da Vinci",
      desc: "Acquired by Francis I in 1518, this 77 x 53 cm portrait is the most famous painting in human history."
    },
    audioNote: "Renaissance lutes, royal fanfares, and chisel sounds of master sculptors."
  },
  {
    id: "era-1600",
    order: 4,
    year: "1600 AD",
    exactDate: "1594 – 1610",
    title: "The Grand Gallery of Henry IV",
    frenchTitle: "Le Grand Dessein d'Henri IV",
    ruler: "King Henry IV ('Good King Henry')",
    architect: "Louis Métezeau & Jacques Androuet II",
    role: "Riverside Mega-Palace & Royal Artist Colony",
    color: "#10b981",
    glowColor: "#34d399",
    orbitRadius: 74,
    planetSize: 3.6,
    orbitSpeed: 0.0017,
    subtitle: "A colossal 450-meter gallery connecting the Louvre to the Tuileries along the Seine.",
    architecture: {
      style: "Mannerist Classical Monumentalism",
      keyFeature: "La Grande Galerie (Half a Kilometer Long)",
      description: "Henry IV launched the ambitious 'Grand Dessein' (Grand Design). He built a staggering 450-meter gallery along the Seine River, linking the Louvre with the Tuileries Palace so the King could stroll between palaces indoors."
    },
    historyPoints: [
      "To encourage French craftsmanship, Henry IV invited hundreds of the kingdom's finest artists, clockmakers, tapissiers, and goldsmiths to live and set up workshops on the ground floor.",
      "The massive upper gallery was so long that courtiers and children reportedly rode small carriages and raced dogs inside it!",
      "This Grand Gallery established the Louvre's identity as a home for artists, laying the groundwork for it to eventually become a public museum."
    ],
    funFact: "Henry IV installed an elaborate royal aviary with exotic singing birds and a fox-hunting kennel inside the royal gardens.",
    masterpiece: {
      name: "Floorplans of the Grand Dessein & Royal Tapestries",
      category: "Royal Architecture & Gobelins",
      desc: "One of the longest building wings ever constructed in European history."
    },
    audioNote: "Clattering artist tools, ticking clock escapements, and gentle flowing Seine water."
  },
  {
    id: "era-1682",
    order: 5,
    year: "1682 AD",
    exactDate: "1665 – 1682",
    title: "The Sun King & The Academies",
    frenchTitle: "Le Roi-Soleil et la Colonnade",
    ruler: "King Louis XIV",
    architect: "Claude Perrault, Louis Le Vau, Charles Le Brun",
    role: "Neoclassical Colonnade & Salon of Arts",
    color: "#e11d48",
    glowColor: "#fb7185",
    orbitRadius: 90,
    planetSize: 3.5,
    orbitSpeed: 0.0013,
    subtitle: "Louis XIV departs for Versailles, leaving the Louvre to painters, sculptors, and scientists.",
    architecture: {
      style: "French High Neoclassicism",
      keyFeature: "The Perrault Colonnade & Cour Carrée",
      description: "A monumental eastern facade featuring paired Corinthian columns rising above a rusticated basement. The Cour Carrée (Square Courtyard) was doubled in size, creating a grand four-sided palace enclosure."
    },
    historyPoints: [
      "Gian Lorenzo Bernini was summoned from Rome to submit designs, but Louis XIV rejected his Italian Baroque style in favor of Claude Perrault's disciplined French Colonnade.",
      "In 1682, Louis XIV permanently moved the royal government to the Palace of Versailles. The Louvre ceased to be a royal home.",
      "Instead of decaying, the Louvre became the headquarters for France's Royal Academies of Painting, Sculpture, Architecture, and Sciences.",
      "In 1725, the Académie began holding annual public exhibitions of modern art in the Salon Carré—origin of the word 'Art Salon'!"
    ],
    funFact: "When Louis XIV abandoned the Louvre, squatter artists built temporary wooden shacks, chimneys, and stovepipes inside the royal courtyards!",
    masterpiece: {
      name: "The Galerie d'Apollon (Apollo Gallery)",
      category: "Baroque Vaulted Ceiling",
      desc: "Commissioned by Louis XIV with dazzling gilded plasterwork and ceiling frescoes celebrating the Sun King."
    },
    audioNote: "Baroque strings by Lully, echoing footsteps through marble colonnades."
  },
  {
    id: "era-1793",
    order: 6,
    year: "1793 AD",
    exactDate: "August 10, 1793",
    title: "The Birth of the People's Museum",
    frenchTitle: "L'Ouverture du Muséum Central",
    ruler: "National Assembly (French Revolution)",
    architect: "Revolutionary Commissions & Jacques-Louis David",
    role: "First Free Public Museum for the People",
    color: "#06b6d4",
    glowColor: "#22d3ee",
    orbitRadius: 106,
    planetSize: 3.6,
    orbitSpeed: 0.0010,
    subtitle: "The French Revolution seizes royal art and opens the palace doors to the public for free.",
    architecture: {
      style: "Enlightenment Neoclassical Public Gallery",
      keyFeature: "Skylit Picture Galleries & Public Educational Halls",
      description: "Private royal bedrooms and salons were converted into public exhibition halls. Skylights were installed along the Grand Gallery so natural daylight illuminated paintings for ordinary visitors and student copyists."
    },
    historyPoints: [
      "On August 10, 1793, the Revolutionary government opened the 'Muséum Central des Arts' to the public for free three days per week.",
      "For the first time in world history, royal and church treasures were declared the collective property of all citizens.",
      "During the Napoleonic Wars, thousands of priceless antiquities and paintings from Egypt, Italy, and across Europe poured into the museum.",
      "The museum was temporarily renamed 'Musée Napoléon', showcasing newly acquired ancient wonders like the Rosetta Stone (later returned) and Renaissance masterpieces."
    ],
    funFact: "Artists were given special priority: ordinary citizens could enter on weekends, while artists had private access on weekdays to study and paint master copies!",
    masterpiece: {
      name: "Liberty Leading the People & Coronation of Napoleon",
      category: "Historic Revolutionary Canvases",
      desc: "Monumental paintings capturing the spirit of revolution, liberty, and dramatic historical transformation."
    },
    audioNote: "Tricolor march cadence, cheering crowds, and creaking gallery wooden floors."
  },
  {
    id: "era-1857",
    order: 7,
    year: "1857 AD",
    exactDate: "1852 – 1857",
    title: "Napoleon III & The Grand Louvre",
    frenchTitle: "L'Achèvement du Grand Louvre",
    ruler: "Emperor Napoleon III",
    architect: "Louis Visconti & Hector Lefuel",
    role: "Imperial Monument & Vast Museum Complex",
    color: "#8b5cf6",
    glowColor: "#a78bfa",
    orbitRadius: 122,
    planetSize: 3.7,
    orbitSpeed: 0.0008,
    subtitle: "Clearing Paris slums to merge the Louvre and Tuileries into the world's largest palace complex.",
    architecture: {
      style: "Second Empire Neo-Baroque",
      keyFeature: "Cour Napoléon, Richelieu Wing & Mollien Pavilion",
      description: "Vast ornate pavilions with high mansard roofs, decorated with 86 statues of France's illustrious thinkers, poets, and statesmen. Opulent gilded state apartments for the Minister of State."
    },
    historyPoints: [
      "Emperor Napoleon III demolished hundreds of decaying medieval houses and crooked alleys between the Louvre and Tuileries to clear the monumental Cour Napoléon.",
      "On August 14, 1857, Napoleon III officially inaugurated the completed Grand Louvre—fulfilling a 300-year dream of French sovereigns.",
      "In 1871, during the Paris Commune uprising, the adjacent Tuileries Palace was set on fire and burned to the ground, leaving the Louvre with its open western vista toward the Champs-Élysées."
    ],
    funFact: "Napoleon III's grand apartments inside the Richelieu wing feature 10-meter crystal chandeliers and velvet armchairs so luxurious they remain completely intact today.",
    masterpiece: {
      name: "Winged Victory of Samothrace & Venus de Milo",
      category: "Ancient Greek Sculptures",
      desc: "Discovered in Greece in 1863 and 1820, placed in theatrical architectural staircases designed to awe visitors."
    },
    audioNote: "Imperial brass horns, grand organ harmonies, and echoes of grand palace balls."
  },
  {
    id: "era-1989",
    order: 8,
    year: "1989 – Today",
    exactDate: "March 29, 1989 – Present",
    title: "The Glass Pyramid & Global Icon",
    frenchTitle: "La Pyramide et Le Grand Louvre Moderne",
    ruler: "President François Mitterrand",
    architect: "I. M. Pei (Chinese-American Architect)",
    role: "World's Most Visited Museum (10M+ Visitors/Year)",
    color: "#38bdf8",
    glowColor: "#7dd3fc",
    orbitRadius: 138,
    planetSize: 3.8,
    orbitSpeed: 0.0006,
    subtitle: "A 21.6-meter glass pyramid unites centuries of stone with radical modern transparency.",
    architecture: {
      style: "Modernist High-Tech Structural Glass",
      keyFeature: "The Glass Pyramid & Subterranean Hall",
      description: "Constructed from 673 diamond and triangular laminated glass panes held by high-tension steel cables. Beneath lies a vast 60,000 m² sunlit marble reception concourse connecting all three museum wings (Denon, Richelieu, Sully)."
    },
    historyPoints: [
      "In 1981, President Mitterrand launched the 'Grand Louvre Project' to reclaim the entire Richelieu wing from the French Ministry of Finance and dedicate the whole palace to art.",
      "I. M. Pei's pyramid design initially faced fierce public controversy, criticized as too futuristic next to historic French architecture. Today, it is celebrated as an international masterpiece.",
      "In 1993, the inverted underground glass pyramid (Pyramide Inversée) was opened in the Carrousel shopping gallery.",
      "Today, the Louvre houses over 380,000 objects and displays 35,000 works of art across 72,735 square meters of exhibition space!"
    ],
    funFact: "Urban myth claimed the pyramid had exactly 666 panes of glass (The Number of the Beast). In reality, the official Louvre blueprints count 673 panes (603 diamonds and 70 triangles)!",
    masterpiece: {
      name: "The Grand Pyramid & 35,000 Displayed Treasures",
      category: "Architectural Landmark & Universal Collection",
      desc: "A universal museum spanning from 7,000 BC Mesopotamia to 19th-century Romanticism."
    },
    audioNote: "Modern crystalline synths, ambient echoes of multicultural visitors, and light glass resonance."
  }
];

// Quiz Questions for interactive learning test
const LOUVRE_QUIZ = [
  {
    question: "Why was the original Louvre fortress built in 1190 AD by King Philippe Auguste?",
    options: [
      "To display paintings from Leonardo da Vinci",
      "To protect Paris from English invaders while the King was away on the Crusades",
      "To host grand royal weddings and ballroom dances",
      "To serve as a summer villa for the Queen"
    ],
    answer: 1,
    explanation: "Correct! In 1190, the Louvre was an armed military citadel with a dry moat and high towers built to protect Paris along the Seine river."
  },
  {
    question: "What did King Charles V create inside the Louvre in the 14th century that was extraordinary for its time?",
    options: [
      "An underground subway system",
      "A massive royal library with over 900 manuscripts",
      "The first glass pyramid",
      "A zoo with lions and polar bears"
    ],
    answer: 1,
    explanation: "Spot on! Charles V 'The Wise' housed 917 handwritten manuscripts in the Falconry Tower, the ancestor of France's National Library."
  },
  {
    question: "Which French King brought Leonardo da Vinci and the Mona Lisa to France in the 16th century?",
    options: [
      "King Louis XIV",
      "King Francis I",
      "Napoleon Bonaparte",
      "Charles V"
    ],
    answer: 1,
    explanation: "Exactly! Francis I was a passionate patron of the Italian Renaissance who invited Leonardo da Vinci to France in 1516."
  },
  {
    question: "When did the Louvre officially open its doors to the public as a free museum?",
    options: [
      "August 10, 1793 (During the French Revolution)",
      "July 4, 1776 (American Independence)",
      "May 1989 (When the Pyramid was built)",
      "Christmas 1190"
    ],
    answer: 0,
    explanation: "Yes! On August 10, 1793, the French Revolutionary government declared that royal art belonged to all citizens and opened the museum for free."
  },
  {
    question: "Who was the architect behind the iconic 1989 modern Glass Pyramid in the Cour Napoléon?",
    options: [
      "Gustave Eiffel",
      "Claude Perrault",
      "I. M. Pei",
      "Pierre Lescot"
    ],
    answer: 2,
    explanation: "Brilliant! Chinese-American architect I. M. Pei designed the 21.6-meter tall glass pyramid, creating a modern gateway into the ancient palace."
  }
];

// Global Masterpieces for quick spotlight
const LOUVRE_MASTERPIECES = [
  {
    id: "mona-lisa",
    name: "Mona Lisa (La Gioconda)",
    artist: "Leonardo da Vinci (c. 1503–1519)",
    room: "Salle des États, Denon Wing",
    eraId: "era-1546",
    funFact: "Painted on a poplar wood panel using the 'sfumato' technique (smoke-like shading). It has no visible brushstrokes!"
  },
  {
    id: "winged-victory",
    name: "Winged Victory of Samothrace",
    artist: "Hellenistic Greek Sculptor (c. 190 BC)",
    room: "Daru Staircase, Denon Wing",
    eraId: "era-1857",
    funFact: "Discovered in 1863 in pieces on the Greek island of Samothrace. She depicts Nike, the Greek goddess of victory, standing atop a warship prow."
  },
  {
    id: "venus-milo",
    name: "Venus de Milo (Aphrodite of Melos)",
    artist: "Alexandros of Antioch (c. 150–125 BC)",
    room: "Greek Antiquities, Sully Wing",
    eraId: "era-1857",
    funFact: "Discovered on the island of Milos in 1820. Her missing arms have puzzled historians for 200 years—did she hold an apple or a shield?"
  },
  {
    id: "medieval-donjon",
    name: "The Medieval Fortress Keep",
    artist: "Philippe Auguste's Engineers (1190)",
    room: "Crypt of the Sphinx, Sully Lower Ground",
    eraId: "era-1190",
    funFact: "You can walk along the dry moat walls underground and touch the stones carved by medieval masons over 830 years ago!"
  },
  {
    id: "great-sphinx",
    name: "The Great Sphinx of Tanis",
    artist: "Ancient Egyptian Craftsmen (c. 2600 BC)",
    room: "Crypt of the Sphinx, Sully Wing",
    eraId: "era-1793",
    funFact: "One of the largest royal sphinxes preserved outside of Egypt, carved from a single block of pink granite."
  },
  {
    id: "code-hammurabi",
    name: "The Code of Hammurabi",
    artist: "Babylonian Scribes (c. 1750 BC)",
    room: "Near Eastern Antiquities, Richelieu Wing",
    eraId: "era-1857",
    funFact: "A 2.25-meter black basalt stele containing 282 early legal codes, including the famous 'eye for an eye' principle."
  }
];
