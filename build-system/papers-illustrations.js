// Illustrations ADDED by this app. Not from the papers.
//
// Six of the ten Compréhension passages print no image at all. Rather than leave
// those sections grey, each gets a small drawing of what its passage is about --
// and every one ships with the caption "Illustration ajoutée -- ne figure pas sur
// l'épreuve", plus a dashed frame, so no student can mistake it for something the
// candidate was shown. The real images live in papers-images.js and are captioned
// the other way round.
//
// Inline SVG rather than raster: it costs a few hundred bytes, scales to any card
// width, and takes the section accent from var(--sec) so it belongs to whichever
// theme is running.

const sky = '#BFE3F2', sea = '#2E86AB', sand = '#F2D492', night = '#2B2D64',
      leaf = '#4C956C', warm = '#E4572E', gold = '#F5B841', grey = '#9AA5B1';

const ILLUS = {
  /* Bali: island, volcano, sea */
  qp2017: {
    theme: "L'île de Bali",
    svg: '<svg viewBox="0 0 440 190" role="img" aria-label="Île tropicale avec un volcan et la mer">' +
      '<rect width="440" height="190" fill="' + sky + '"/>' +
      '<circle cx="366" cy="44" r="21" fill="' + gold + '"/>' +
      '<path d="M0 128 L96 60 L150 102 L196 66 L268 128 Z" fill="' + leaf + '"/>' +
      '<path d="M150 102 L196 66 L232 96 Z" fill="#3A7D5A"/>' +
      '<path d="M180 74 q16-12 32 0 q-16 6-32 0z" fill="#FFFFFF" opacity=".75"/>' +
      '<rect y="128" width="440" height="62" fill="' + sea + '"/>' +
      '<path d="M0 142 q30-9 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#FFFFFF" stroke-opacity=".45" stroke-width="3" fill="none"/>' +
      '<path d="M0 162 q30-9 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="3" fill="none"/>' +
      '<rect x="300" y="98" width="4" height="30" fill="' + sand + '"/>' +
      '<path d="M304 98 q22-10 34 2 q-22-2-34 6z M302 98 q-22-10-34 2 q22-2 34 6z" fill="' + leaf + '"/>' +
      '</svg>'
  },
  /* Air pollution over a big city */
  qp2018a: {
    theme: "La pollution de l'air",
    svg: '<svg viewBox="0 0 440 190" role="img" aria-label="Silhouette de ville sous un ciel chargé de pollution">' +
      '<rect width="440" height="190" fill="#E7D7C6"/>' +
      '<circle cx="360" cy="52" r="20" fill="' + warm + '" opacity=".55"/>' +
      '<g fill="' + grey + '" opacity=".5">' +
      '<rect x="0" y="66" width="440" height="8" rx="4"/><rect x="40" y="86" width="360" height="8" rx="4"/>' +
      '<rect x="90" y="106" width="280" height="8" rx="4"/></g>' +
      '<g fill="var(--sec, #33415C)">' +
      '<rect x="24" y="118" width="46" height="72"/><rect x="78" y="94" width="38" height="96"/>' +
      '<rect x="124" y="132" width="52" height="58"/><rect x="184" y="80" width="42" height="110"/>' +
      '<rect x="234" y="116" width="36" height="74"/><rect x="278" y="100" width="48" height="90"/>' +
      '<rect x="334" y="126" width="40" height="64"/><rect x="382" y="108" width="34" height="82"/></g>' +
      '<g fill="' + gold + '" opacity=".85">' +
      '<rect x="88" y="106" width="7" height="9"/><rect x="100" y="106" width="7" height="9"/>' +
      '<rect x="194" y="92" width="7" height="9"/><rect x="208" y="92" width="7" height="9"/>' +
      '<rect x="288" y="114" width="7" height="9"/><rect x="302" y="114" width="7" height="9"/></g>' +
      '</svg>'
  },
  /* Sleep: how many hours a teenager needs */
  qp2018r: {
    theme: 'Le sommeil des adolescents',
    svg: '<svg viewBox="0 0 440 190" role="img" aria-label="Nuit étoilée, croissant de lune et lit">' +
      '<rect width="440" height="190" fill="' + night + '"/>' +
      '<path d="M366 30 a30 30 0 1 0 26 44 a24 24 0 0 1-26-44z" fill="' + gold + '"/>' +
      '<g fill="#FFFFFF" opacity=".85">' +
      '<circle cx="60" cy="40" r="2.5"/><circle cx="120" cy="26" r="2"/><circle cx="180" cy="52" r="2.5"/>' +
      '<circle cx="250" cy="32" r="2"/><circle cx="96" cy="70" r="2"/><circle cx="300" cy="62" r="2.5"/>' +
      '<circle cx="34" cy="92" r="2"/><circle cx="212" cy="88" r="2"/></g>' +
      '<g fill="#FFFFFF" opacity=".9" font-family="system-ui, sans-serif" font-weight="700">' +
      '<text x="128" y="98" font-size="20">Z</text><text x="150" y="82" font-size="15">z</text>' +
      '<text x="166" y="70" font-size="11">z</text></g>' +
      '<rect x="52" y="126" width="264" height="40" rx="8" fill="var(--sec, #5B7DB1)"/>' +
      '<rect x="40" y="104" width="70" height="34" rx="9" fill="#FFFFFF"/>' +
      '<rect x="36" y="112" width="14" height="54" rx="4" fill="#FFFFFF" opacity=".55"/>' +
      '<rect x="308" y="112" width="14" height="54" rx="4" fill="#FFFFFF" opacity=".55"/>' +
      '</svg>'
  },
  /* Social networks */
  qp2018c: {
    theme: 'Les jeunes et les réseaux sociaux',
    svg: '<svg viewBox="0 0 440 190" role="img" aria-label="Téléphone entouré de contacts reliés entre eux">' +
      '<rect width="440" height="190" fill="#EEF3FA"/>' +
      '<g stroke="var(--sec, #3E5C76)" stroke-width="2" opacity=".45">' +
      '<path d="M220 95 L96 46 M220 95 L86 140 M220 95 L352 44 M220 95 L362 136 M220 95 L214 26 M220 95 L226 168"/></g>' +
      '<rect x="192" y="48" width="56" height="94" rx="10" fill="var(--sec, #3E5C76)"/>' +
      '<rect x="198" y="58" width="44" height="70" rx="4" fill="#FFFFFF"/>' +
      '<path d="M212 76 h16 M206 88 h28 M206 100 h28 M206 112 h20" stroke="' + sea + '" stroke-width="4" stroke-linecap="round"/>' +
      '<g fill="' + warm + '"><circle cx="96" cy="46" r="15"/><circle cx="362" cy="136" r="15"/></g>' +
      '<g fill="' + leaf + '"><circle cx="86" cy="140" r="15"/><circle cx="352" cy="44" r="15"/></g>' +
      '<g fill="' + gold + '"><circle cx="214" cy="26" r="13"/><circle cx="226" cy="168" r="13"/></g>' +
      '<g fill="#FFFFFF" opacity=".9">' +
      '<circle cx="96" cy="42" r="4.5"/><path d="M88 54 a8 8 0 0 1 16 0z"/>' +
      '<circle cx="86" cy="136" r="4.5"/><path d="M78 148 a8 8 0 0 1 16 0z"/>' +
      '<circle cx="352" cy="40" r="4.5"/><path d="M344 52 a8 8 0 0 1 16 0z"/>' +
      '<circle cx="362" cy="132" r="4.5"/><path d="M354 144 a8 8 0 0 1 16 0z"/></g>' +
      '</svg>'
  },
  /* Stan Lee and the comics */
  qp2019: {
    theme: 'Stan Lee et la bande dessinée',
    svg: '<svg viewBox="0 0 440 190" role="img" aria-label="Bulle de bande dessinée, éclat et masque de super-héros">' +
      '<rect width="440" height="190" fill="#FDF0D5"/>' +
      '<path d="M212 18 l14 30 l33-8 l-16 30 l30 17 l-30 17 l16 30 l-33-8 l-14 30 l-14-30 l-33 8 l16-30 l-30-17 l30-17 l-16-30 l33 8z" fill="' + warm + '"/>' +
      '<text x="212" y="105" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="30" fill="#FFFFFF">BD</text>' +
      '<path d="M300 34 h118 a10 10 0 0 1 10 10 v44 a10 10 0 0 1-10 10 h-92 l-20 20 v-20 h-6 a10 10 0 0 1-10-10 v-44 a10 10 0 0 1 10-10z" fill="var(--sec, #2B3A67)"/>' +
      '<path d="M312 54 h84 M312 68 h84 M312 82 h56" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".9"/>' +
      '<path d="M18 116 q54-26 108 0 q-14 30-54 30 q-40 0-54-30z" fill="' + night + '"/>' +
      '<g fill="#FFFFFF"><path d="M44 122 q16-9 30 0 q-15 9-30 0z"/><path d="M70 122 q16-9 30 0 q-15 9-30 0z"/></g>' +
      '<g fill="' + sea + '"><circle cx="59" cy="122" r="5"/><circle cx="85" cy="122" r="5"/></g>' +
      '</svg>'
  },
  /* Teenagers and the media */
  qp2023: {
    theme: 'Les ados et les médias',
    svg: '<svg viewBox="0 0 440 190" role="img" aria-label="Écran, casque audio et bulles de conversation">' +
      '<rect width="440" height="190" fill="#F3EEF8"/>' +
      '<rect x="112" y="34" width="216" height="120" rx="12" fill="var(--sec, #4A4E8C)"/>' +
      '<rect x="124" y="46" width="192" height="84" rx="6" fill="#FFFFFF"/>' +
      '<path d="M204 68 l40 20 l-40 20z" fill="' + warm + '"/>' +
      '<rect x="196" y="154" width="48" height="8" rx="4" fill="var(--sec, #4A4E8C)"/>' +
      '<path d="M36 122 v-18 a34 34 0 0 1 68 0 v18" stroke="' + night + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
      '<rect x="26" y="116" width="22" height="34" rx="8" fill="' + sea + '"/>' +
      '<rect x="92" y="116" width="22" height="34" rx="8" fill="' + sea + '"/>' +
      '<path d="M344 40 h74 a9 9 0 0 1 9 9 v30 a9 9 0 0 1-9 9 h-46 l-16 15 v-15 h-12 a9 9 0 0 1-9-9 v-30 a9 9 0 0 1 9-9z" fill="' + gold + '"/>' +
      '<path d="M356 116 h62 a9 9 0 0 1 9 9 v26 a9 9 0 0 1-9 9 h-62 a9 9 0 0 1-9-9 v-26 a9 9 0 0 1 9-9z" fill="' + leaf + '"/>' +
      '<path d="M358 58 h44 M358 70 h30" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M362 130 h48 M362 142 h32" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>' +
      '</svg>'
  }
};

const CAPTION = 'Illustration ajoutée — ne figure pas sur l’épreuve';

module.exports = { ILLUS, CAPTION };
