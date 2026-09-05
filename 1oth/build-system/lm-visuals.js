/* ============================================================
   LA LETTRE — diagram registry for the interactive module.
   Keyed by the `visual` id on a topic in letterdata.js.
   Kept in the engine (not in the data) because renderTopic() esc()-escapes
   every string it prints — raw SVG in the JSON would render as visible source.
   Colours come only from theme variables so the diagrams stay legible in the
   two dark themes (cyber, slate) as well as the five light ones.
   ============================================================ */
const LM_VISUALS = {

  /* the seven zones of the page, laid out where they actually sit */
  skeleton: () => '<svg viewBox="0 0 620 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The seven zones of a friendly letter, in order down the page">' +
    '<rect x="56" y="8" width="508" height="414" rx="10" fill="var(--card-bg)" stroke="var(--card-border)" stroke-width="2"/>' +
    '<rect x="330" y="26" width="216" height="42" rx="8" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2"/>' +
    '<text x="438" y="52" text-anchor="middle" font-size="15" fill="var(--gold)">Koweït, le 13 octobre 2024</text>' +
    '<text x="318" y="52" text-anchor="end" font-size="13" fill="var(--text-muted)">① lieu et date</text>' +
    '<rect x="74" y="86" width="190" height="36" rx="8" fill="var(--box-blue-bg)" stroke="var(--heading-color)" stroke-width="2"/>' +
    '<text x="169" y="110" text-anchor="middle" font-size="15" fill="var(--heading-color)">Cher Paul,</text>' +
    '<text x="276" y="110" font-size="13" fill="var(--text-muted)">② l’appel</text>' +
    '<rect x="74" y="136" width="472" height="38" rx="8" fill="var(--box-blue-bg)" stroke="var(--card-border)" stroke-width="2"/>' +
    '<text x="88" y="160" font-size="14" fill="var(--text-main)">Comment vas-tu ? Je t’écris pour…</text>' +
    '<text x="534" y="160" text-anchor="end" font-size="13" fill="var(--text-muted)">③ introduction</text>' +
    '<rect x="74" y="186" width="472" height="96" rx="8" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>' +
    '<text x="88" y="214" font-size="14" fill="var(--green)">D’abord… Ensuite… De plus… Enfin…</text>' +
    '<text x="88" y="242" font-size="13" fill="var(--text-muted)">le contenu qui change selon le sujet</text>' +
    '<text x="88" y="268" font-size="15" fill="var(--green)">≈ 50 mots</text>' +
    '<text x="534" y="214" text-anchor="end" font-size="13" fill="var(--text-muted)">④ le corps</text>' +
    '<rect x="74" y="294" width="472" height="34" rx="8" fill="var(--box-blue-bg)" stroke="var(--card-border)" stroke-width="2"/>' +
    '<text x="88" y="316" font-size="14" fill="var(--text-main)">Écris-moi vite !</text>' +
    '<text x="534" y="316" text-anchor="end" font-size="13" fill="var(--text-muted)">⑤ conclusion</text>' +
    '<rect x="330" y="340" width="216" height="32" rx="8" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2"/>' +
    '<text x="438" y="362" text-anchor="middle" font-size="14" fill="var(--gold)">Amicalement,</text>' +
    '<text x="318" y="362" text-anchor="end" font-size="13" fill="var(--text-muted)">⑥ politesse</text>' +
    '<rect x="330" y="380" width="216" height="32" rx="8" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2"/>' +
    '<text x="438" y="402" text-anchor="middle" font-size="14" fill="var(--gold)">Rahul</text>' +
    '<text x="318" y="402" text-anchor="end" font-size="13" fill="var(--text-muted)">⑦ signature</text>' +
    '</svg>',

  /* where the eighty words are actually spent */
  budget: () => '<svg viewBox="0 0 620 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The 80 word budget split 15, 50, 15">' +
    '<text x="310" y="26" text-anchor="middle" font-size="15" fill="var(--text-muted)">80 mots — visez 75 à 90</text>' +
    '<rect x="40" y="44" width="101" height="52" rx="8" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2.5"/>' +
    '<text x="90" y="76" text-anchor="middle" font-size="19" fill="var(--gold)">15</text>' +
    '<rect x="141" y="44" width="338" height="52" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>' +
    '<text x="310" y="76" text-anchor="middle" font-size="19" fill="var(--green)">50</text>' +
    '<rect x="479" y="44" width="101" height="52" rx="8" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2.5"/>' +
    '<text x="529" y="76" text-anchor="middle" font-size="19" fill="var(--gold)">15</text>' +
    '<text x="90" y="118" text-anchor="middle" font-size="13" fill="var(--text-muted)">ouverture</text>' +
    '<text x="310" y="118" text-anchor="middle" font-size="13" fill="var(--text-muted)">le corps</text>' +
    '<text x="529" y="118" text-anchor="middle" font-size="13" fill="var(--text-muted)">clôture</text>' +
    '<path d="M40 134 L141 134 M479 134 L580 134" stroke="var(--gold)" stroke-width="3"/>' +
    '<text x="310" y="160" text-anchor="middle" font-size="15" fill="var(--gold)">30 mots appris par cœur — écrits avant l’examen</text>' +
    '<text x="310" y="188" text-anchor="middle" font-size="15" fill="var(--green)">il ne reste qu’un problème de 50 mots</text>' +
    '</svg>',

  /* the exact shape of the place-and-date line, with its three traps */
  datebar: () => '<svg viewBox="0 0 620 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The place and date line with its three traps marked">' +
    '<rect x="150" y="30" width="330" height="46" rx="8" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2.5"/>' +
    '<text x="172" y="61" font-size="20" fill="var(--text-main)">Koweït<tspan fill="var(--crimson)">,</tspan> le <tspan fill="var(--heading-color)">13</tspan> <tspan fill="var(--green)">octobre</tspan> 2024</text>' +
    '<text x="480" y="22" text-anchor="end" font-size="13" fill="var(--text-muted)">en haut à droite</text>' +
    '<path d="M232 84 L232 112" stroke="var(--crimson)" stroke-width="2.5"/>' +
    '<text x="232" y="132" text-anchor="middle" font-size="13" fill="var(--crimson)">virgule obligatoire</text>' +
    '<path d="M290 84 L290 148" stroke="var(--heading-color)" stroke-width="2.5"/>' +
    '<text x="290" y="168" text-anchor="middle" font-size="13" fill="var(--heading-color)">chiffre ordinaire, pas 13ᵉ</text>' +
    '<path d="M350 84 L350 184" stroke="var(--green)" stroke-width="2.5"/>' +
    '<text x="350" y="204" text-anchor="middle" font-size="13" fill="var(--green)">minuscule — jamais Octobre</text>' +
    '<rect x="20" y="30" width="112" height="46" rx="8" fill="var(--box-blue-bg)" stroke="var(--card-border)" stroke-width="2"/>' +
    '<text x="76" y="52" text-anchor="middle" font-size="13" fill="var(--text-muted)">seule exception</text>' +
    '<text x="76" y="70" text-anchor="middle" font-size="15" fill="var(--purple)">le 1er mai</text>' +
    '</svg>',

  /* greeting on the left, sign-off on the right, and they must agree */
  salute: () => '<svg viewBox="0 0 620 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Salutation on the left matched to the signature on the right">' +
    '<text x="150" y="24" text-anchor="middle" font-size="14" fill="var(--text-muted)">à gauche — l’appel</text>' +
    '<text x="470" y="24" text-anchor="middle" font-size="14" fill="var(--text-muted)">à droite — la signature</text>' +
    '<rect x="26" y="38" width="248" height="40" rx="8" fill="var(--box-blue-bg)" stroke="var(--heading-color)" stroke-width="2"/>' +
    '<text x="150" y="64" text-anchor="middle" font-size="16" fill="var(--heading-color)">Cher Paul,</text>' +
    '<rect x="346" y="38" width="248" height="40" rx="8" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2"/>' +
    '<text x="470" y="64" text-anchor="middle" font-size="16" fill="var(--gold)">Ton ami, Rahul</text>' +
    '<rect x="26" y="88" width="248" height="40" rx="8" fill="var(--box-blue-bg)" stroke="var(--heading-color)" stroke-width="2"/>' +
    '<text x="150" y="114" text-anchor="middle" font-size="16" fill="var(--heading-color)">Chère maman,</text>' +
    '<rect x="346" y="88" width="248" height="40" rx="8" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2"/>' +
    '<text x="470" y="114" text-anchor="middle" font-size="16" fill="var(--gold)">Ton fils, Rahul</text>' +
    '<rect x="26" y="138" width="248" height="40" rx="8" fill="var(--box-blue-bg)" stroke="var(--heading-color)" stroke-width="2"/>' +
    '<text x="150" y="164" text-anchor="middle" font-size="16" fill="var(--heading-color)">Chers parents,</text>' +
    '<rect x="346" y="138" width="248" height="40" rx="8" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2"/>' +
    '<text x="470" y="164" text-anchor="middle" font-size="16" fill="var(--gold)">Votre fils, Rahul</text>' +
    '<path d="M282 58 L338 58 M282 108 L338 108 M282 158 L338 158" stroke="var(--green)" stroke-width="2" stroke-dasharray="5 4"/>' +
    '<text x="310" y="200" text-anchor="middle" font-size="14" fill="var(--green)">la signature s’accorde au lecteur</text>' +
    '<rect x="90" y="212" width="440" height="30" rx="8" fill="none" stroke="var(--crimson)" stroke-width="2"/>' +
    '<text x="310" y="232" text-anchor="middle" font-size="14" fill="var(--crimson)">prénom seul — jamais Marc Dupont, jamais M. Dupont</text>' +
    '</svg>',

  /* three openings and three closings, as a matched pair */
  'open-close': () => '<svg viewBox="0 0 620 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three opening formulas and three closing formulas">' +
    '<rect x="20" y="18" width="272" height="128" rx="10" fill="var(--box-blue-bg)" stroke="var(--heading-color)" stroke-width="2.5"/>' +
    '<text x="156" y="42" text-anchor="middle" font-size="15" fill="var(--heading-color)">OUVRIR</text>' +
    '<text x="36" y="70" font-size="13" fill="var(--text-main)">Comment vas-tu ? J’espère que</text>' +
    '<text x="36" y="88" font-size="13" fill="var(--text-main)">cette lettre te trouvera bien.</text>' +
    '<text x="36" y="112" font-size="13" fill="var(--text-main)">Comment ça va ? Moi, je vais bien.</text>' +
    '<text x="36" y="136" font-size="13" fill="var(--text-main)">J’ai reçu ta lettre dans laquelle…</text>' +
    '<rect x="328" y="18" width="272" height="128" rx="10" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2.5"/>' +
    '<text x="464" y="42" text-anchor="middle" font-size="15" fill="var(--gold)">CLORE</text>' +
    '<text x="344" y="70" font-size="13" fill="var(--text-main)">Écris-moi vite.</text>' +
    '<text x="344" y="94" font-size="13" fill="var(--text-main)">J’attends ta réponse avec impatience.</text>' +
    '<text x="344" y="118" font-size="13" fill="var(--text-main)">Dis bonjour à tes parents de ma part.</text>' +
    '<text x="344" y="140" font-size="13" fill="var(--purple)">Bonne chance ! · Soigne-toi bien !</text>' +
    '<path d="M156 154 L156 178 L464 178 L464 154" fill="none" stroke="var(--green)" stroke-width="2" stroke-dasharray="5 4"/>' +
    '<text x="310" y="202" text-anchor="middle" font-size="14" fill="var(--green)">≈ 30 mots, appris par cœur, valables pour tous les sujets</text>' +
    '<text x="310" y="234" text-anchor="middle" font-size="13" fill="var(--text-muted)">une clôture liée au thème vaut mieux qu’une clôture passe-partout</text>' +
    '</svg>',

  /* the five connectors that turn a list into a paragraph */
  linkers: () => '<svg viewBox="0 0 620 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The chain of linking words from d abord to enfin">' +
    '<rect x="8" y="44" width="104" height="42" rx="21" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>' +
    '<text x="60" y="71" text-anchor="middle" font-size="15" fill="var(--green)">D’abord</text>' +
    '<path d="M116 65 L134 65 M134 65 L130 60 M134 65 L130 70" stroke="var(--text-muted)" stroke-width="2"/>' +
    '<rect x="138" y="44" width="100" height="42" rx="21" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>' +
    '<text x="188" y="71" text-anchor="middle" font-size="15" fill="var(--green)">Ensuite</text>' +
    '<path d="M242 65 L260 65 M260 65 L256 60 M260 65 L256 70" stroke="var(--text-muted)" stroke-width="2"/>' +
    '<rect x="264" y="44" width="100" height="42" rx="21" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>' +
    '<text x="314" y="71" text-anchor="middle" font-size="15" fill="var(--green)">De plus</text>' +
    '<path d="M368 65 L386 65 M386 65 L382 60 M386 65 L382 70" stroke="var(--text-muted)" stroke-width="2"/>' +
    '<rect x="390" y="44" width="112" height="42" rx="21" fill="var(--box-gold-bg)" stroke="var(--gold)" stroke-width="2.5"/>' +
    '<text x="446" y="71" text-anchor="middle" font-size="15" fill="var(--gold)">Cependant</text>' +
    '<path d="M506 65 L524 65 M524 65 L520 60 M524 65 L520 70" stroke="var(--text-muted)" stroke-width="2"/>' +
    '<rect x="528" y="44" width="84" height="42" rx="21" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="2.5"/>' +
    '<text x="570" y="71" text-anchor="middle" font-size="15" fill="var(--green)">Enfin</text>' +
    '<text x="310" y="26" text-anchor="middle" font-size="14" fill="var(--text-muted)">un connecteur par phrase</text>' +
    '<text x="310" y="118" text-anchor="middle" font-size="15" fill="var(--heading-color)">5 phrases × 5 connecteurs = les 50 mots du corps</text>' +
    '<text x="310" y="148" text-anchor="middle" font-size="13" fill="var(--text-muted)">« parce que » relie deux idées à l’intérieur d’une phrase</text>' +
    '</svg>',

  /* tu versus vous, and the single exception */
  register: () => '<svg viewBox="0 0 620 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Use tu throughout, never vous, with one exception">' +
    '<rect x="20" y="18" width="272" height="140" rx="10" fill="var(--box-blue-bg)" stroke="var(--green)" stroke-width="3"/>' +
    '<text x="156" y="46" text-anchor="middle" font-size="26" fill="var(--green)">TU  ✓</text>' +
    '<text x="156" y="76" text-anchor="middle" font-size="14" fill="var(--text-main)">Comment vas-tu ?</text>' +
    '<text x="156" y="100" text-anchor="middle" font-size="14" fill="var(--text-main)">ton · ta · tes</text>' +
    '<text x="156" y="124" text-anchor="middle" font-size="14" fill="var(--text-main)">Écris-moi.</text>' +
    '<text x="156" y="148" text-anchor="middle" font-size="13" fill="var(--text-muted)">du premier mot au dernier</text>' +
    '<rect x="328" y="18" width="272" height="140" rx="10" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="3"/>' +
    '<text x="464" y="46" text-anchor="middle" font-size="26" fill="var(--crimson)">VOUS  ✗</text>' +
    '<text x="464" y="76" text-anchor="middle" font-size="14" fill="var(--text-main)">Comment allez-vous ?</text>' +
    '<text x="464" y="100" text-anchor="middle" font-size="14" fill="var(--text-main)">votre · vos</text>' +
    '<text x="464" y="128" text-anchor="middle" font-size="13" fill="var(--crimson)">français correct,</text>' +
    '<text x="464" y="148" text-anchor="middle" font-size="13" fill="var(--crimson)">mauvaise lettre — 2 points perdus</text>' +
    '<rect x="80" y="176" width="460" height="58" rx="10" fill="none" stroke="var(--purple)" stroke-width="2.5"/>' +
    '<text x="310" y="200" text-anchor="middle" font-size="14" fill="var(--purple)">une seule exception — deux destinataires</text>' +
    '<text x="310" y="222" text-anchor="middle" font-size="15" fill="var(--text-main)">« Chers papa et maman, » → vous = pluriel ✓</text>' +
    '</svg>',

  /* the mark scheme, as proportional bars */
  checklist: () => '<svg viewBox="0 0 620 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Indicative mark scheme out of ten">' +
    '<text x="310" y="24" text-anchor="middle" font-size="15" fill="var(--text-muted)">barème indicatif sur 10 — deux minutes de relecture</text>' +
    '<text x="24" y="66" font-size="14" fill="var(--text-main)">le format</text>' +
    '<rect x="150" y="50" width="88" height="24" rx="6" fill="var(--gold)" opacity=".85"/>' +
    '<text x="250" y="68" font-size="14" fill="var(--gold)">2</text>' +
    '<text x="24" y="106" font-size="14" fill="var(--text-main)">le registre « tu »</text>' +
    '<rect x="150" y="90" width="88" height="24" rx="6" fill="var(--crimson)" opacity=".85"/>' +
    '<text x="250" y="108" font-size="14" fill="var(--crimson)">2</text>' +
    '<text x="24" y="146" font-size="14" fill="var(--text-main)">le contenu</text>' +
    '<rect x="150" y="130" width="132" height="24" rx="6" fill="var(--green)" opacity=".85"/>' +
    '<text x="294" y="148" font-size="14" fill="var(--green)">3</text>' +
    '<text x="24" y="186" font-size="14" fill="var(--text-main)">la grammaire</text>' +
    '<rect x="150" y="170" width="132" height="24" rx="6" fill="var(--heading-color)" opacity=".85"/>' +
    '<text x="294" y="188" font-size="14" fill="var(--heading-color)">3</text>' +
    '<rect x="330" y="46" width="270" height="152" rx="10" fill="var(--box-gold-bg)" stroke="var(--crimson)" stroke-width="2"/>' +
    '<text x="465" y="72" text-anchor="middle" font-size="14" fill="var(--crimson)">la faute la plus fréquente</text>' +
    '<text x="465" y="100" text-anchor="middle" font-size="13" fill="var(--text-main)">on commence en « tu »…</text>' +
    '<text x="465" y="124" text-anchor="middle" font-size="13" fill="var(--text-main)">…on glisse vers « vous »</text>    ' +
    '<text x="465" y="148" text-anchor="middle" font-size="13" fill="var(--text-main)">au 2ᵉ paragraphe</text>' +
    '<text x="465" y="180" text-anchor="middle" font-size="13" fill="var(--crimson)">relisez à l’envers, verbe par verbe</text>' +
    '<text x="310" y="228" text-anchor="middle" font-size="14" fill="var(--text-muted)">75 à 90 mots · une ouverture · une clôture · 2 structures différentes</text>' +
    '</svg>'
};

module.exports = LM_VISUALS;
