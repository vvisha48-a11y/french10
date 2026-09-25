/* Desktop printing: the deck's 🖨️ / 📚 buttons end in window.print(); here that call
   becomes a native choice -- Print, Save as PDF, or Cancel -- on A4 landscape, one
   slide per sheet (print-landscape.css).

   The deck's own steps all still run: printTopic()/printBook() load every photo the
   job needs and isolate the topic, armPrint() listens for afterprint, and endPrint()
   puts the deck back. This file only replaces the final window.print() and fires
   afterprint when the native job is over.

   Also here: Ctrl+P prints the current topic. The deck's keyboard handler reads a
   bare "p" as Projector mode even with Ctrl held, so the key is taken in the capture
   phase, before the deck sees it. Printing is refused while the sign-in gate is up. */
(function(){
  'use strict';
  if (!window.desktop || window.__dskPrint) return;
  var $ = function(s){ return document.querySelector(s); };

  /* The website's dense-handout print rules that 9d77c11 kept away from the slide
     print: [selector, a property it must set]. Each exists exactly once inside
     @media print (check-desktop.js asserts it at sync time). */
  var HANDOUT_RULES = [
    ['body', 'font-size'], ['.slide-card', 'padding'],
    ['h1', 'font-size'], ['h2', 'font-size'], ['h3', 'font-size'],
    ['p, .subj-table td, .subj-table th, .q-text', 'font-size'],
    ['.two-columns', 'gap'], ['.three-columns', 'gap'], ['.box', 'padding'], ['.fib-input', 'border-bottom'],
    ['.cj-allgrid', 'gap'], ['.cj-block .cj-table td', 'font-size'],
    ['.usage-grid', 'gap'], ['.usage-photo', 'max-height'], ['.memo-svg', 'max-width'],
    ['.topic-visual-grid', 'gap'], ['.usage-figure > svg, .usage-figure > img', 'max-height'],
    ['.vfam-card', 'grid-template-columns'], ['.let-fig > svg', 'max-height'], ['.let-cols', 'grid-template-columns'],
    ['.let-paper, .let-focus', 'max-width'],
    ['.let-paper .example-text, .let-paper .gloss, .let-table td, .let-note', 'font-size'],
    ['.ls-fig > svg', 'max-height']
  ];
  var WANT = {};
  HANDOUT_RULES.forEach(function(r){ WANT[r[0]] = r[1]; });
  var PAGE_RULE = '@page{ size:A4 landscape; margin:6mm; }';

  var parked = [], pageStyle = null, busy = false, jobSeq = 0;

  function parkHandoutRules(){
    Array.prototype.forEach.call(document.styleSheets, function(sheet){
      var rules;
      try { rules = sheet.cssRules; } catch (_){ return; }
      Array.prototype.forEach.call(rules || [], function(m){
        if (m.type !== CSSRule.MEDIA_RULE || !/^\s*print\b/.test(m.media.mediaText)) return;
        Array.prototype.forEach.call(m.cssRules, function(r){
          if (r.type !== CSSRule.STYLE_RULE) return;
          var sel = r.selectorText.replace(/\s+/g, ' ').trim();
          var prop = WANT[sel];
          if (prop && r.style.getPropertyValue(prop) !== ''){ parked.push([r, r.style.cssText]); r.style.cssText = ''; }
        });
      });
    });
    if (parked.length !== HANDOUT_RULES.length)
      console.warn('[desktop print] parked ' + parked.length + ' of ' + HANDOUT_RULES.length + ' handout rules');
  }
  function restoreHandoutRules(){
    parked.splice(0).forEach(function(p){ p[0].style.cssText = p[1]; });
  }

  function jobTitle(job){
    if (job === 'book') return 'French Grammar - complete workbook';
    var t = $('.print-target');
    var name = t ? [t.dataset.topicName, t.dataset.sub].filter(Boolean).join(' - ') : 'French Grammar';
    return name.replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'French Grammar';
  }

  function toast(text){
    var t = document.getElementById('toastNotification');
    if (!t) return;
    t.textContent = text;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 3200);
  }

  /* the desktop layout on, and off again: exposed so the layout can be measured */
  function prepare(){
    parkHandoutRules();
    pageStyle = document.createElement('style');
    pageStyle.id = 'dskPageRule';
    pageStyle.textContent = PAGE_RULE;
    document.head.appendChild(pageStyle);
    document.body.classList.add('dsk-print');
    return parked.length;
  }
  function finish(){
    document.body.classList.remove('dsk-print');
    if (pageStyle){ pageStyle.remove(); pageStyle = null; }
    restoreHandoutRules();
  }

  /* Let the isolation take effect before the page is printed. A frame is the natural
     wait, but Chromium stops delivering frames to a window that is not on screen --
     and the save runs for minutes, during which the teacher may well look elsewhere --
     so a timer backs it up. (Measured: with the window behind another, the save stopped
     after the very first topic.) */
  function settle(){
    return new Promise(function(done){
      var fired = false;
      var go = function(){ if (!fired){ fired = true; done(); } };
      requestAnimationFrame(function(){ requestAnimationFrame(go); });
      setTimeout(go, 250);
    });
  }

  function stackName(stack, i){
    var name = [stack.dataset.topicName || stack.dataset.topic, stack.dataset.sub].filter(Boolean).join(' - ');
    return name || ('Topic ' + (i + 1));
  }

  /* The complete workbook, saved as one PDF per topic. 950 slides is more than
     Windows will print in a single job, so each stack is isolated in turn -- exactly
     as "Print this topic" does -- and saved into the folder chosen in the dialog. */
  async function saveWorkbook(){
    var stacks = Array.prototype.slice.call(document.querySelectorAll('#slidesRoot > section'));
    /* The deck armed its listeners for ONE print: an afterprint handler and a
       matchMedia('print') one, both of which call endPrint() and strip the isolation.
       Print media flips back after EVERY part, so left in place they would un-isolate
       the deck after the first topic and the next part would try to print all 950
       slides at once -- which fails outright. Let them fire now, once, on a job that
       is already over; endPrint() detaches them both. */
    window.dispatchEvent(new Event('afterprint'));
    await settle();
    document.body.classList.remove('printing-book');
    document.body.classList.add('printing-topic');
    var saved = 0, failed = 0;
    for (var i = 0; i < stacks.length; i++){
      /* re-asserted every time, not just once: this state is the only thing keeping a
         part to ONE topic, and the deck removes it whenever it thinks a print ended */
      document.body.classList.remove('printing-book');
      document.body.classList.add('printing-topic');
      stacks.forEach(function(s){ s.classList.remove('print-target'); });
      stacks[i].classList.add('print-target');
      toast('📚 Saving topic ' + (i + 1) + ' of ' + stacks.length + '…');
      await settle();
      /* Awaited to the end, with no timeout of its own. A timeout here would only
         abandon this side of the call: the main process would carry on writing that
         topic's file while the loop moved the isolation to the next one, and the file
         would hold the wrong slides. Main refuses overlapping parts instead. */
      try { await window.desktop.printPart(i, stackName(stacks[i], i)); saved++; }
      catch (e){ failed++; console.warn('[desktop] workbook part ' + (i + 1) + ': ' + (e && e.message || e)); }
    }
    stacks.forEach(function(s){ s.classList.remove('print-target'); });
    document.body.classList.remove('printing-topic');
    try { await window.desktop.printDone(); } catch (_){}
    return { message: '📚 Saved ' + saved + ' topic PDFs' + (failed ? ', ' + failed + ' failed' : '') + '.' };
  }

  async function nativePrint(){
    if (busy){
      /* a second job while one is running: say so, and leave the deck's state to the
         job that owns it -- never tear it down underneath the running one */
      toast('🖨️ A print job is already running.');
      return;
    }
    busy = true;
    var myJob = ++jobSeq;
    var job = document.body.classList.contains('printing-book') ? 'book' : 'topic';
    prepare();
    var result = null;
    try {
      result = await window.desktop.print(job, jobTitle(job));
      if (job === 'book' && result && result.parts) result = await saveWorkbook();
    }
    catch (e){ result = { message: 'Printing failed: ' + (e && e.message || e) }; }
    finally {
      finish();
      busy = false;
      /* The deck's armPrint() waits for this to run endPrint(), which strips
         print-target and printing-topic. Only the job that still owns that state may
         fire it: otherwise a job finishing late would un-isolate a newer one, and the
         newer job would print the WHOLE deck under the name of one topic. */
      if (myJob === jobSeq) window.dispatchEvent(new Event('afterprint'));
    }
    if (result && result.message) toast(result.message);
  }

  window.print = function(){ nativePrint(); };
  window.__dskPrint = { prepare: prepare, finish: finish };

  function locked(){ return document.body.classList.contains('fb-locked'); }
  function run(id){
    if (locked() || busy){
      if (busy) toast('🖨️ A print job is already running.');
      return;
    }
    var b = document.getElementById(id);
    if (b) b.click();
  }

  /* Refuse a second print at the BUTTON, not at window.print().
     The deck's printTopic()/printBook() do their work first -- load photos, isolate a
     stack, and arm their own afterprint and print-media listeners -- and only then
     call window.print(). Refusing at that last step would leave those listeners armed,
     and during the workbook save they would strip the isolation between parts, so the
     rest of the save would print the whole deck instead of one topic. */
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('#printTopicBtn2, #printBookBtn');
    if (!b || !busy) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    toast('🖨️ A print job is already running.');
  }, true);

  window.addEventListener('keydown', function(e){
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.code === 'KeyP'){
      e.preventDefault(); e.stopImmediatePropagation();
      run('printTopicBtn2');
    }
  }, true);

  window.desktop.onCommand(function(name){
    if (name === 'print-topic') run('printTopicBtn2');
    else if (name === 'print-book') run('printBookBtn');
  });
})();
