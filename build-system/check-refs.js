const fs = require('fs');
const html = fs.readFileSync('C:/claude/10 th/master-grammar-app.html', 'utf8');
// engine-extract.js is derived from e-engine.html. Regenerate it if it is missing or
// stale: when it vanished, this gate crashed on startup instead of reporting, so the
// harness looked green while running two checks short.
if (!fs.existsSync('engine-extract.js') ||
    fs.statSync('engine-extract.js').mtimeMs < fs.statSync('e-engine.html').mtimeMs){
  require('child_process').execFileSync(process.execPath, ['gen-engine-extract.js'], { cwd: __dirname });
}
const js = fs.readFileSync('engine-extract.js', 'utf8');
const markup = html.slice(0, html.lastIndexOf('<script>'));

// --- ids the engine looks up ---
const wanted = new Set();
[...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].forEach(m => wanted.add(m[1]));
[...js.matchAll(/\$\('#([A-Za-z0-9_-]+)'/g)].forEach(m => wanted.add(m[1]));
const present = new Set([...markup.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
const missingIds = [...wanted].filter(id => !present.has(id));

// --- classes the engine queries ---
const classes = ['quiz-container','question-row','option-btn','fib-input','fib-verdict','score-display',
  'quiz-progress-fill','retry-btn','fib-check','reveal-answers','accent-key','flip-card','flip-card-front',
  'fc-mark','formula-lab','lab-body','lab-stem','lab-verb','lab-eq','verb-select-btn','tense-select-btn',
  'editable-field','slide-card','student-only','teacher-only'];
const classCount = {};
classes.forEach(c => {
  const re = new RegExp('class="[^"]*\\b' + c + '\\b', 'g');
  classCount[c] = (markup.match(re) || []).length;
});
const missingClasses = classes.filter(c => classCount[c] === 0);

// --- data attributes the engine relies on ---
const attrs = ['data-topic','data-topic-name','data-sub','data-step','data-slide-id','data-answer','data-verb','data-tense','data-mark','data-lab','data-pronouns'];
const attrCount = {};
attrs.forEach(a => attrCount[a] = (markup.match(new RegExp(a + '=', 'g')) || []).length);
const missingAttrs = attrs.filter(a => attrCount[a] === 0);

console.log('engine id lookups  :', wanted.size, '| missing:', missingIds.length ? missingIds : 'none');
console.log('missing classes    :', missingClasses.length ? missingClasses : 'none');
console.log('missing attributes :', missingAttrs.length ? missingAttrs : 'none');
console.log('');
console.log('--- widget counts in markup ---');
['quiz-container','question-row','option-btn','fib-input','flip-card','formula-lab','editable-field','slide-card','teacher-only','student-only']
  .forEach(c => console.log('  ' + c.padEnd(20), classCount[c]));
console.log('');
console.log('--- structure ---');
['data-topic','data-sub','data-step','data-slide-id','data-answer'].forEach(a => console.log('  ' + a.padEnd(20), attrCount[a]));

process.exit(missingIds.length || missingClasses.length || missingAttrs.length ? 1 : 0);
