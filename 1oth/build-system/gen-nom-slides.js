// Generate t-nom.html — the La Nominalisation sub-topic.
//
// Reads t-nom-base.html (the 5 hand-written rule slides) and nomdata.js (95
// verb -> noun pairs), and appends:
//   1 intro slide, 14 vocabulary slides (7 pairs each, flip cards + fragments),
//   4 drill slides (type the noun).
//
// t-nom.html is GENERATED — edit t-nom-base.html or nomdata.js, never the output.
// The stack has no step named "Description", so it stays exempt from the 8-step
// rule in verify.js. No step name starts with "Usages" (that gate needs an svg/img).
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const base = fs.readFileSync(path.join(HERE, 't-nom-base.html'), 'utf8');
const nd = fs.readFileSync(path.join(HERE, 'nomdata.js'), 'utf8');
const NOMDATA = JSON.parse(nd.slice(nd.indexOf('['), nd.lastIndexOf(']') + 1));

const PER_SLIDE = 7;
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* apostrophes inside data-* attributes must be entity-escaped (house rule) */
const attr = s => esc(s).replace(/'/g, '&#39;').replace(/’/g, '&#39;');

/* the noun minus its article, for the drill's accepted answers */
const bare = n => n.replace(/^(la|le|les|un|une)\s+/i, '').replace(/^l['’]/i, '');

const chunks = [];
for (let i = 0; i < NOMDATA.length; i += PER_SLIDE) chunks.push(NOMDATA.slice(i, i + PER_SLIDE));

let out = '';
let ribbon = 5;                      // the base file already used 1-5
const slide = (id, step, body) => {
  ribbon++;
  return `
        <section data-slide-id="${id}" data-step="${step}">
          <div class="slide-card">
            <div class="flag-stripe"></div>
            <div class="step-ribbon"><span class="sr-n">${ribbon}</span> ${step}</div>
${body}
          </div>
        </section>
`;
};

/* ---------- intro ---------- */
out += slide('nom-6', 'Les Formes Nominales', `            <span class="usage-badge">${NOMDATA.length} formes nominales — tout le vocabulaire</span>
            <h2 class="editable-field">Du verbe au nom</h2>
            <p class="editable-field">Les ${NOMDATA.length} formes qui suivent couvrent tout ce que l&#39;examen peut demander. Elles arrivent <strong>sept par diapositive</strong>.</p>
            <div class="three-columns">
              <div class="box blue">
                <p class="editable-field"><strong>1 · Regardez</strong></p>
                <p class="gloss">Chaque carte montre le verbe. Le nom apparaît quand on clique dessus.</p>
              </div>
              <div class="box blue">
                <p class="editable-field"><strong>2 · Testez-vous</strong></p>
                <p class="gloss">Cliquez ✓ quand vous connaissez une carte : elle reste marquée à votre prochaine visite.</p>
              </div>
              <div class="box blue">
                <p class="editable-field"><strong>3 · Écrivez</strong></p>
                <p class="gloss">Toutes les quatre diapositives, un exercice vous fait écrire les noms de mémoire.</p>
              </div>
            </div>
            <div class="box gold content-box fragment">
              <p class="editable-field">🔑 <strong>Le genre compte autant que le mot.</strong> Les noms en <em>-tion</em>, <em>-sion</em>, <em>-ure</em> et <em>-ance</em> sont féminins ; ceux en <em>-ment</em> et <em>-age</em> sont masculins.</p>
            </div>`);

/* ---------- vocabulary slides ---------- */
chunks.forEach((chunk, ci) => {
  const cards = chunk.map(d => {
    const g = d.gender ? `<span class="nom-g nom-${d.gender}">${d.gender}</span>` : '';
    const note = d.note ? `<p class="nom-note">⚠️ ${esc(d.note)}</p>` : '';
    return `              <div class="fragment nom-cell">
                <div class="flip-card">
                <div class="flip-card-inner">
                  <div class="flip-card-front"><strong>${esc(d.verb.toUpperCase())}</strong></div>
                  <div class="flip-card-back">${esc(d.noun)} ${g}<br><span class="nom-en">${esc(d.en)}</span></div>
                </div>
                  <div class="fc-marks"><button class="fc-mark" data-mark="known" title="Je sais">✓</button><button class="fc-mark" data-mark="again" title="À revoir">↻</button></div>
                </div>
              </div>`;
  }).join('\n');
  const notes = chunk.filter(d => d.note)
    .map(d => `            <div class="box gold content-box"><p class="editable-field nom-note">⚠️ <strong>${esc(d.verb)}</strong> — ${esc(d.note)}</p></div>`)
    .join('\n');
  out += slide(`nom-v${ci + 1}`, `Formes ${ci + 1}`,
`            <h2 class="editable-field">Formes nominales — ${ci * PER_SLIDE + 1} à ${ci * PER_SLIDE + chunk.length}</h2>
            <p class="editable-field gloss">Cliquez une carte pour révéler le nom. ✓ = je sais · ↻ = à revoir.</p>
            <div class="flip-card-grid nom-grid">
${cards}
            </div>${notes ? '\n' + notes : ''}`);
});

/* ---------- drills, one per block of chunks ---------- */
const DRILL_BLOCKS = 4;
const perBlock = Math.ceil(chunks.length / DRILL_BLOCKS);
for (let b = 0; b < DRILL_BLOCKS; b++) {
  const pool = chunks.slice(b * perBlock, (b + 1) * perBlock).flat();
  if (!pool.length) continue;
  const step = Math.max(1, Math.floor(pool.length / 10));
  const picks = pool.filter((_, i) => i % step === 0).slice(0, 10);
  const rows = picks.map((d, i) => {
    const accepted = [d.noun, bare(d.noun)].filter((v, j, a) => a.indexOf(v) === j);
    return `              <div class="question-row">
                <p class="q-text">${i + 1}. ${esc(d.verb)} → _____ <span class="gloss">(${esc(d.en)})</span></p>
                <input class="fib-input" data-answer="${attr(accepted.join('|'))}" placeholder="votre réponse"><span class="fib-verdict"></span>
              </div>`;
  }).join('\n');
  out += slide(`nom-d${b + 1}`, `Drill ${b + 1}`,
`            <h2 class="editable-field">Écrivez la forme nominale — série ${b + 1}</h2>
            <p class="editable-field gloss student-only">Appuyez sur <strong>T</strong> pour passer en mode Étudiant si les cases sont bloquées.</p>
            <div class="quiz-container">
              <div class="quiz-progress-bar"><div class="quiz-progress-fill"></div></div>
${rows}
              <div class="accent-bar">
                <span class="ab-label">Accents :</span>
                <button class="accent-key">é</button><button class="accent-key">è</button><button class="accent-key">ê</button>
                <button class="accent-key">à</button><button class="accent-key">ç</button><button class="accent-key">ù</button>
                <button class="accent-key">û</button><button class="accent-key">î</button><button class="accent-key">ô</button>
              </div>
              <div class="fib-actions">
                <button class="tb-btn fib-check student-only">✓ Check</button>
                <button class="tb-btn reveal-answers teacher-only">👁️ Show answers</button>
                <button class="retry-btn student-only">🔄 Retry</button>
                <span class="score-display">Score : 0 / ${picks.length}</span>
              </div>
            </div>`);
}

/* ---------- splice into the base stack ---------- */
const closeIdx = base.lastIndexOf('</section>');
if (closeIdx < 0) { console.error('FAIL: no closing </section> in t-nom-base.html'); process.exit(1); }
const header = `      <!-- ==================================================================
           LA NOMINALISATION — GENERATED by gen-nom-slides.js.
           Base slides come from t-nom-base.html; the ${NOMDATA.length} pairs from nomdata.js.
           Do not hand-edit this file.
           =================================================================== -->
`;
const result = header + base.slice(0, closeIdx) + out + '      </section>\n';

/* ---------- self-checks ---------- */
const problems = [];
NOMDATA.forEach(d => {
  if (!result.includes(esc(d.noun))) problems.push(`noun missing from output: ${d.noun}`);
  if (!result.includes(esc(d.verb.toUpperCase()))) problems.push(`verb missing from output: ${d.verb}`);
});
const fronts = [...result.matchAll(/<div class="flip-card-front"><strong>([^<]*)<\/strong>/g)].map(m => m[1]);
const dupFronts = fronts.filter((f, i) => fronts.indexOf(f) !== i);
if (dupFronts.length) problems.push('duplicate flip-card fronts (keys would collide): ' + [...new Set(dupFronts)].join(', '));
const inputs = [...result.matchAll(/<input class="fib-input"([^>]*)>/g)];
inputs.forEach((m, i) => { if (!/data-answer="/.test(m[1])) problems.push(`fib-input #${i} has no data-answer`); });
[...result.matchAll(/class="quiz-container"/g)].forEach(() => {});
const qc = (result.match(/class="quiz-container"/g) || []).length;
const sd = (result.match(/class="score-display"/g) || []).length;
const pf = (result.match(/class="quiz-progress-fill"/g) || []).length;
if (sd < qc || pf < qc) problems.push(`quiz-container ${qc} but score-display ${sd} / progress-fill ${pf}`);
if (/frenchcoaching|Faridabad|9910082375/i.test(result)) problems.push('branding text leaked into output');
if (/data-step="Description"/.test(result)) problems.push('a step is named Description — would trigger the 8-step rule');
if (/data-step="Usages/.test(result)) problems.push('a step starts with Usages — would need an svg/img');
if (/\sid="/.test(result)) problems.push('an id= attribute leaked in (verify.js forbids duplicates)');
const ids = [...result.matchAll(/data-slide-id="([^"]*)"/g)].map(m => m[1]);
const dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
if (dupIds.length) problems.push('duplicate data-slide-id: ' + dupIds.join(', '));
const opens = (result.match(/<section/g) || []).length, closes = (result.match(/<\/section>/g) || []).length;
if (opens !== closes) problems.push(`section imbalance: ${opens} open vs ${closes} close`);

if (problems.length) {
  console.error('PROBLEMS:');
  problems.forEach(p => console.error('  ' + p));
  process.exit(1);
}

fs.writeFileSync(path.join(HERE, 't-nom.html'), result);
console.log(`t-nom.html: ${ids.length} slides (5 base + ${ids.length - 5} generated)`);
console.log(`  vocabulary slides : ${chunks.length} (${PER_SLIDE} pairs each)`);
console.log(`  drill slides      : ${DRILL_BLOCKS}  |  drill items: ${inputs.length}`);
console.log(`  flip cards        : ${fronts.length} (all fronts unique)`);
console.log('  self-checks clean');
