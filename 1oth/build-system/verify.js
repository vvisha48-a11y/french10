// Structural validator for master-grammar-app.html
const fs = require('fs');
const file = 'C:/claude/10 th/master-grammar-app.html';
const html = fs.readFileSync(file, 'utf8');

const norm = s => (s || '').trim().toLowerCase()
  .normalize('NFD').replace(new RegExp('[\u0300-\u036f]', 'g'), '')
  .replace(/[\u2019']/g, "'").replace(/\s+/g, ' ');

const EXPECTED = ['Description','Formation','Exceptions','Pièges','Exemples','En contexte','Pratique QCM','Pratique — à compléter'];
const problems = [];
const attr = (tag, name) => { const m = tag.match(new RegExp(name + '="([^"]*)"')); return m ? m[1] : null; };
const decode = s => (s||'').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');

// ---- 1. stacks and their steps ----
const stackRe = /<section (data-topic="[^"]*"[^>]*)>/g;
const marks = [];
let m;
while ((m = stackRe.exec(html)) !== null) marks.push({ idx: m.index, tag: m[1] });

const stacks = marks.map((mk, i) => {
  const end = i + 1 < marks.length ? marks[i + 1].idx : html.length;
  const body = html.slice(mk.idx, end);
  const steps = [...body.matchAll(/data-step="([^"]*)"/g)].map(x => decode(x[1]));
  return {
    topic: attr(mk.tag, 'data-topic'),
    topicName: decode(attr(mk.tag, 'data-topic-name')),
    sub: decode(attr(mk.tag, 'data-sub')),
    steps, body
  };
});

// Schema: Description -> Usages x(2-3) -> Formation -> ... -> Pratique — à compléter
// A stack with 0 usage slides is the legacy 8-slide form and still validates, so the
// topic-by-topic rollout never breaks the build mid-migration.
const TAIL = EXPECTED.slice(1); // Formation .. Pratique — à compléter (7 steps)
const ruleStacks = stacks.filter(s => s.steps.includes('Description'));
let migrated = 0;
ruleStacks.forEach(s => {
  const steps = s.steps;
  if (steps[0] !== 'Description') { problems.push(`[order] "${s.sub}" does not start with Description`); return; }
  const fIdx = steps.indexOf('Formation');
  if (fIdx < 0) { problems.push(`[order] "${s.sub}" has no Formation slide`); return; }

  const usages = steps.slice(1, fIdx);
  const mislabelled = usages.filter(u => !/^Usages/.test(u));
  if (mislabelled.length) {
    problems.push(`[usage-label] "${s.sub}" step(s) between Description and Formation must start with "Usages": ${mislabelled.join(', ')}`);
    return;
  }
  // 1 to 3 usage slides. Some sub-topics (the Subjonctif triggers: Volonté, Émotion,
  // Nécessité, Doute) ARE themselves a usage, so a single consolidated slide is correct
  // there — forcing 2-3 would only produce padding.
  if (usages.length) {
    migrated++;
    if (usages.length > 3) problems.push(`[usage-count] "${s.sub}" has ${usages.length} usage slides; expected 1 to 3`);
  }

  const tail = steps.slice(fIdx);
  if (tail.length !== TAIL.length) problems.push(`[order] "${s.sub}" has ${tail.length} slides after the usages, expected ${TAIL.length}: ${tail.join(' | ')}`);
  else TAIL.forEach((e, i) => { if (tail[i] !== e) problems.push(`[order] "${s.sub}" slide "${tail[i]}" should be "${e}"`); });

  const expectTotal = 8 + usages.length;
  if (steps.length !== expectTotal) problems.push(`[count] "${s.sub}" has ${steps.length} slides, expected ${expectTotal}`);
});

// ---- 2. duplicate slide ids ----
const ids = [...html.matchAll(/data-slide-id="([^"]*)"/g)].map(x => x[1]);
const dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
if (dupIds.length) problems.push(`[dup-id] ${[...new Set(dupIds)].join(', ')}`);

// ---- 3. duplicate HTML id attributes ----
const htmlIds = [...html.matchAll(/\sid="([^"]*)"/g)].map(x => x[1]);
const dupHtmlIds = htmlIds.filter((v, i) => htmlIds.indexOf(v) !== i);
if (dupHtmlIds.length) problems.push(`[dup-html-id] ${[...new Set(dupHtmlIds)].join(', ')}`);

// ---- 4. MCQ: does data-answer match one of the options? ----
let mcqCount = 0, mcqBad = 0;
const chunks = html.split(/<div class="question-row"/).slice(1);
chunks.forEach(chunk => {
  const head = chunk.slice(0, 200);
  const ansM = head.match(/^\s*data-answer="([^"]*)"/);
  const upto = chunk.split('</div>').slice(0, 6).join('</div>');
  const opts = [...upto.matchAll(/<button class="option-btn">([^<]*)<\/button>/g)].map(x => decode(x[1]));
  if (!opts.length) return;
  mcqCount++;
  if (!ansM) { problems.push(`[mcq] options with no data-answer near: ${opts.join(' / ')}`); mcqBad++; return; }
  const ans = decode(ansM[1]);
  if (!opts.some(o => norm(o) === norm(ans))) {
    problems.push(`[mcq-unanswerable] answer "${ans}" not among options [${opts.join(' | ')}]`);
    mcqBad++;
  }
});

// ---- 5. fill-in-the-blank sanity ----
const fibs = [...html.matchAll(/<input class="fib-input"([^>]*)>/g)].map(x => x[1]);
fibs.forEach(a => { if (!/data-answer="/.test(a)) problems.push(`[fib] input without data-answer: ${a.trim().slice(0,60)}`); });

// ---- 6. quiz containers each have a score display ----
const quizBlocks = html.split('class="quiz-container"').slice(1);
quizBlocks.forEach((b, i) => {
  const seg = b.split('</section>')[0];
  if (!/class="score-display"/.test(seg)) problems.push(`[quiz] container #${i+1} has no .score-display`);
  if (!/class="quiz-progress-fill"/.test(seg)) problems.push(`[quiz] container #${i+1} has no .quiz-progress-fill`);
});

// ---- 7. formula-lab JSON parses ----
[...html.matchAll(/data-lab='([^']*)'/g)].forEach((x, i) => {
  try { JSON.parse(decode(x[1])); } catch (e) { problems.push(`[lab] data-lab #${i+1} is not valid JSON: ${e.message}`); }
});
[...html.matchAll(/data-pronouns='([^']*)'/g)].forEach((x, i) => {
  try { JSON.parse(decode(x[1])); } catch (e) { problems.push(`[lab] data-pronouns #${i+1} invalid: ${e.message}`); }
});

// ---- 8. section tag balance (slides region only — script/style mention <section> in comments) ----
const startTok = '<div class="slides" id="slidesRoot">';
const endTok = '</div><!-- /.slides -->';
const sIdx = html.indexOf(startTok), eIdx = html.indexOf(endTok);
if (sIdx < 0 || eIdx < 0) problems.push('[tags] could not locate the slides region');
else {
  const slidesRegion = html.slice(sIdx, eIdx);
  const opens = (slidesRegion.match(/<section\b/g) || []).length;
  const closes = (slidesRegion.match(/<\/section>/g) || []).length;
  if (opens !== closes) problems.push(`[tags] slides region: <section> ${opens} vs </section> ${closes}`);
}

// ---- 9. every Usages slide MUST carry a visual (svg or img) ----
const slideMarks = [];
const slideRe = /<section data-slide-id="([^"]*)" data-step="([^"]*)"[^>]*>/g;
let sm;
while ((sm = slideRe.exec(html)) !== null) slideMarks.push({ idx: sm.index, id: sm[1], step: decode(sm[2]) });
let usageSlides = 0;
slideMarks.forEach((s, i) => {
  if (!/^Usages/.test(s.step)) return;
  usageSlides++;
  const body = html.slice(s.idx, i + 1 < slideMarks.length ? slideMarks[i + 1].idx : html.length);
  if (!/<svg[\s>]/.test(body) && !/<img[\s>]/.test(body)) {
    problems.push(`[usage-visual] "${s.id}" is a Usages slide with no <svg> or <img> — a visual is compulsory`);
  }
});

// ---- report ----
const byTopic = {};
stacks.forEach(s => { (byTopic[s.topicName] = byTopic[s.topicName] || []).push(s.sub); });

console.log('=== TOPICS ===');
Object.entries(byTopic).forEach(([t, subs]) => console.log(`  ${t}: ${subs.length} stacks`));
console.log('\n=== TOTALS ===');
console.log('  stacks           :', stacks.length);
console.log('  8-step sub-topics:', ruleStacks.length);
console.log('  migrated w/ usages:', migrated, '/', ruleStacks.length);
console.log('  usage slides     :', usageSlides);
console.log('  slides           :', ids.length);
console.log('  MCQ questions    :', mcqCount, mcqBad ? `(${mcqBad} BAD)` : '(all answerable)');
console.log('  fill-in-blanks   :', fibs.length);
console.log('  quiz containers  :', quizBlocks.length);
console.log('  PYQ tags         :', (html.match(/class="q-tag"/g) || []).length);
console.log('\n=== PROBLEMS ===');
if (!problems.length) console.log('  none');
else problems.forEach(p => console.log('  ✗ ' + p));
process.exit(problems.length ? 1 : 0);
