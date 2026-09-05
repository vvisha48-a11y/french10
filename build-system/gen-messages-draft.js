// Writes messages-draft.json — everything in Les Messages that is MINE, not the
// teacher's, and not a verified past paper. Generated so it cannot drift from the deck.
//
//   node gen-messages-draft.js
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, 'messagedata.js'), 'utf8');
const at = src.indexOf('MESSAGEDATA');
const DATA = JSON.parse(src.slice(src.indexOf('[', at), src.lastIndexOf(']') + 1));

const out = {
  _readme: [
    'Content in Les Messages that needs a teacher decision before students see it.',
    'Nothing here claims a CBSE year. The gate check-messages.js fails the build if a',
    '"CBSE 20xx" label ever appears in this module, or if a drafted model loses its',
    'on-slide "awaiting review" badge.',
    'Reviewed items: set "approved": true. That is a record for you; it changes no output.'
  ],
  why_this_exists: 'messages.txt supplied 3 invitations, 3 refusals and 2 announcements. ' +
    'It contained NO acceptance, which is one of the three types the syllabus requires, ' +
    'and no practice prompts. Those gaps were filled by drafting, and drafted material ' +
    'is listed here rather than being silently mixed in with the teacher\'s own.',
  drafted_models: [],
  practice_prompts: [],
  derived_claims: []
};

DATA.forEach(g => g.topics.forEach(t => {
  if (!t.draft) return;
  out.drafted_models.push({
    id: t.id, type: t.type, slide: g.group + ' -> ' + t.en.title,
    prompt_fr: t.prompt.fr,
    message_fr: [t.message.fr.date, t.message.fr.salutation]
      .concat(t.message.fr.paras, t.message.fr.closing, [t.message.fr.signature]),
    approved: false
  });
}));

const ls = fs.readFileSync(path.join(__dirname, 'msg-lessons.js'), 'utf8');
[['msg-prac-inv', 'invitation'], ['msg-prac-acc', 'acceptance'], ['msg-prac-ref', 'refusal']]
  .forEach(([id, type]) => {
    const a = ls.indexOf("M['" + id + "']");
    const seg = ls.slice(a, a + 1200);
    const m = /'([^']*\(30 mots\)[^']*)'/.exec(seg) || /prac\('[^']*',\s*\n?\s*'([^']*)'/.exec(seg);
    out.practice_prompts.push({ id, type, prompt_fr: m ? m[1] : '(see msg-lessons.js)', approved: false });
  });

out.derived_claims.push({
  id: 'msg-freq',
  claim: 'The "What Gets Asked" bar chart ranks message situations by how often they appear.',
  basis: 'Counted from the 8 messages in messages.txt only — NOT from a board-paper survey.',
  on_slide_caveat: 'The slide carries a red warning saying exactly this.',
  approved: false
});

fs.writeFileSync(path.join(__dirname, 'messages-draft.json'), JSON.stringify(out, null, 2) + '\n');
console.log('  messages-draft.json:', out.drafted_models.length, 'models,',
            out.practice_prompts.length, 'prompts,', out.derived_claims.length, 'derived claim');
