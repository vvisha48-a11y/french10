/* Ctrl+Shift+F — search every word of every slide and every past-paper question,
   offline, from memory.

   The deck's own Ctrl+K search matches slide titles; this one reads the full text.
   The index is built once, from the page itself, the first time it is opened (well
   under a second): 952 slides and the 237 questions of the Question Papers, accents
   and case folded so "ete" finds "été". Answers are left out on purpose -- the
   hidden past-paper answers and teacher-only notes -- so a result never gives one
   away in Student view.

   The deck's keyboard handler reads a bare "f" as Fullscreen even with Ctrl+Shift
   held, so the shortcut is taken in the capture phase, before the deck sees it. */
(function(){
  'use strict';
  if (window.__dskSearch) return;

  var SKIP = 'script,style,template,noscript,.pl-answer,.teacher-only,.let-toggle';
  var LIMIT = 80;
  var index = null, hits = [], sel = 0, root = null, input = null, list = null, meta = null, timer = null;

  /* one character in, one character out, so a match in the folded text sits at the
     same offset in the original and can be highlighted there */
  /* the deck writes French with typographic quotes; a keyboard types the straight ones */
  var SAME = { '’': "'", '‘': "'", 'ʼ': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ' };
  function fold(s){
    var out = '';
    for (var i = 0; i < s.length; i++){
      var c = SAME[s[i]] || s[i], d = c.normalize('NFD')[0].toLowerCase();
      out += d.length === 1 ? d : c;
    }
    return out;
  }
  /* Text inside one paragraph is joined as written -- the spaces in the markup are
     text nodes of their own -- so a word wrapped in a <span> stays one word and can be
     found. Only a real block boundary adds a space, so two paragraphs never run
     together into a word that is not there. */
  var INLINE = { SPAN: 1, B: 1, STRONG: 1, I: 1, EM: 1, MARK: 1, SMALL: 1, SUP: 1, SUB: 1, A: 1,
                 CODE: 1, KBD: 1, ABBR: 1, U: 1, S: 1, FONT: 1, LABEL: 1, BDI: 1, BDO: 1, TIME: 1, VAR: 1 };
  /* A <span> is inline by name but not always in fact: this deck styles several as
     blocks (.f-label, .f-value, .voc-fr, .tv-en ...), and treating those as inline
     fused a label into its value -- "Infinitifparler" is in no slide. The verdict is
     cached per tag+class, so this costs a handful of style reads for the whole deck. */
  var displayCache = {};
  function inlineInFact(el){
    if (!INLINE[el.tagName]) return false;
    if (el.tagName !== 'SPAN') return true;
    var key = el.className || '-';
    if (displayCache[key] === undefined) displayCache[key] = /^inline($|-)/.test(getComputedStyle(el).display);
    return displayCache[key];
  }
  function blockOf(node){
    var el = node.parentElement;
    while (el && inlineInFact(el)) el = el.parentElement;
    return el;
  }
  function textOf(el){
    if (!el) return '';
    var parts = [], lastBlock = null;
    /* elements as well as text, so a <br> -- a line break with no text node of its
       own -- separates words instead of gluing them together */
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function(n){
        if (n.nodeType === 1) return n.closest(SKIP) ? NodeFilter.FILTER_REJECT
                                                     : (n.tagName === 'BR' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP);
        var p = n.parentElement;
        return p && p.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()){
      var n = walker.currentNode;
      if (n.nodeType === 1){ parts.push(' '); lastBlock = null; continue; }   // a <br>
      var block = blockOf(n);
      if (parts.length && block !== lastBlock) parts.push(' ');
      parts.push(n.nodeValue);
      lastBlock = block;
    }
    return parts.join('').replace(/\s+/g, ' ').trim();
  }
  function first(el, sels){
    for (var i = 0; i < sels.length; i++){
      var f = el.querySelector(sels[i]);
      var t = f ? f.textContent.replace(/\s+/g, ' ').trim() : '';
      if (t) return t;
    }
    return '';
  }

  function build(){
    var t0 = performance.now();
    var items = [];
    var stacks = document.querySelectorAll('#slidesRoot > section');
    Array.prototype.forEach.call(stacks, function(st, h){
      var path = [st.dataset.topicName || st.dataset.topic || '', st.dataset.sub || ''].filter(Boolean).join(' › ');
      if (st.dataset.topic === 'papers'){
        Array.prototype.forEach.call(st.querySelectorAll('article.pl-q'), function(q){
          var paper = q.closest('.pl-paper');
          var badge = first(q, ['.q-tag']) || (paper && paper.dataset.year) || 'Paper';
          var raw = [first(q, ['.pl-q-instr']), textOf(q.querySelector('.pl-items'))].filter(Boolean).join(' ');
          var title = badge + ' · Q' + (q.dataset.item || '') + (q.dataset.group ? ' · ' + q.dataset.group : '');
          items.push({ kind: 'paper', h: h, v: 0, id: q.id, title: title, path: 'Question Papers',
                       raw: raw, hay: fold(raw), th: fold(title + ' ' + (paper ? paper.dataset.year : '')) });
        });
        return;
      }
      var slides = st.querySelectorAll(':scope > section');
      Array.prototype.forEach.call(slides.length ? slides : [st], function(sl, v){
        var card = sl.querySelector('.slide-card') || sl;
        var title = first(card, ['h2', 'h1', 'h3', '.step-ribbon']) || path;
        var raw = textOf(card);
        if (!raw) return;
        items.push({ kind: 'slide', h: h, v: v, title: title, path: path,
                     raw: raw, hay: fold(raw), th: fold(title + ' ' + path) });
      });
    });
    index = items;
    var s = items.filter(function(i){ return i.kind === 'slide'; }).length;
    meta.textContent = s + ' slides · ' + (items.length - s) + ' exam questions · offline · ' +
                       Math.round(performance.now() - t0) + ' ms to index';
  }

  function esc(s){ return s.replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function snippet(it, terms){
    var at = -1;
    terms.forEach(function(t){ var i = it.hay.indexOf(t); if (i !== -1 && (at === -1 || i < at)) at = i; });
    if (at === -1) return esc(it.raw.slice(0, 160)) + (it.raw.length > 160 ? '…' : '');
    var a = Math.max(0, at - 70), b = Math.min(it.raw.length, at + 150);
    var raw = it.raw.slice(a, b), hay = it.hay.slice(a, b);
    var marks = [];
    terms.forEach(function(t){
      var i = -1;
      while ((i = hay.indexOf(t, i + 1)) !== -1) marks.push([i, i + t.length]);
    });
    marks.sort(function(x, y){ return x[0] - y[0]; });
    var out = '', pos = 0;
    marks.forEach(function(m){
      if (m[0] < pos) return;
      out += esc(raw.slice(pos, m[0])) + '<mark>' + esc(raw.slice(m[0], m[1])) + '</mark>';
      pos = m[1];
    });
    out += esc(raw.slice(pos));
    return (a > 0 ? '…' : '') + out + (b < it.raw.length ? '…' : '');
  }

  function run(){
    var q = fold(input.value.trim());
    var terms = q.split(/\s+/).filter(function(t){ return t.length > 0; });
    if (!terms.length){ hits = []; render([]); return; }
    var scored = [];
    for (var k = 0; k < index.length; k++){
      var it = index[k], ok = true, score = 0;
      for (var j = 0; j < terms.length; j++){
        var inTitle = it.th.indexOf(terms[j]) !== -1, inText = it.hay.indexOf(terms[j]) !== -1;
        if (!inTitle && !inText){ ok = false; break; }
        score += inTitle ? 40 : 0;
        if (inText) score += Math.min(12, it.hay.split(terms[j]).length - 1) + 5;
      }
      if (!ok) continue;
      var phrase = terms.length > 1 && it.hay.indexOf(q) !== -1;
      scored.push({ it: it, score: score + (phrase ? 60 : 0) - (it.kind === 'paper' ? 3 : 0) });
    }
    scored.sort(function(a, b){ return b.score - a.score; });
    hits = scored.slice(0, LIMIT).map(function(s){ return s.it; });
    render(terms, scored.length);
  }

  function render(terms, total){
    sel = 0;
    if (!input.value.trim()){
      list.innerHTML = '<p class="dsk-s-empty">Type a word or a phrase — French or English, accents optional.</p>';
      return;
    }
    if (!hits.length){
      list.innerHTML = '<p class="dsk-s-empty">Nothing matches every word. Try fewer words.</p>';
      return;
    }
    var html = '';
    if (total > hits.length) html += '<p class="dsk-s-more">Showing the best ' + hits.length + ' of ' + total + ' matches</p>';
    hits.forEach(function(it, i){
      html += '<button type="button" class="dsk-s-hit' + (i === 0 ? ' is-sel' : '') + '" data-i="' + i + '">' +
        '<span class="dsk-s-where"><span class="dsk-s-kind is-' + it.kind + '">' + (it.kind === 'paper' ? 'Exam' : 'Slide') + '</span>' +
        esc(it.path) + '</span>' +
        '<span class="dsk-s-title">' + esc(it.title) + '</span>' +
        '<span class="dsk-s-snip">' + snippet(it, terms) + '</span></button>';
    });
    list.innerHTML = html;
  }

  function move(d){
    var btns = list.querySelectorAll('.dsk-s-hit');
    if (!btns.length) return;
    btns[sel].classList.remove('is-sel');
    sel = (sel + d + btns.length) % btns.length;
    btns[sel].classList.add('is-sel');
    btns[sel].scrollIntoView({ block: 'nearest' });
  }

  function go(it){
    close();
    window.Deck.slide(it.h, it.v);
    if (it.kind !== 'paper') return;
    setTimeout(function(){
      var q = document.getElementById(it.id);
      if (!q) return;
      /* The Papers screen has two filters of its own -- a year and a topic -- and the
         question may be hidden by either. Both are cleared through their own buttons,
         so the module's state stays its own. */
      if (q.classList.contains('is-out') || q.closest('[hidden]')){
        var year = document.querySelector('[data-year="all"]');
        if (year && !year.classList.contains('is-on')) year.click();
        var clear = document.querySelector('.pl-clear');
        if (clear) clear.click();
      }
      setTimeout(function(){
        var el = document.getElementById(it.id);
        if (!el) return;
        el.scrollIntoView({ block: 'center' });
        el.classList.add('dsk-flash');
        setTimeout(function(){ el.classList.remove('dsk-flash'); }, 2200);
      }, 120);
    }, 450);
  }

  function mount(){
    root = document.createElement('div');
    root.id = 'dskSearch';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Search everything');
    root.innerHTML =
      '<div class="dsk-s-panel">' +
        '<label class="dsk-s-field"><span class="dsk-s-glyph" aria-hidden="true">🔍</span>' +
          '<input type="search" id="dskSearchInput" autocomplete="off" spellcheck="false" ' +
          'placeholder="Search every slide and past paper…" aria-label="Search every slide and past paper"></label>' +
        '<p class="dsk-s-meta">Building the index…</p>' +
        '<div class="dsk-s-list" role="listbox"></div>' +
        '<p class="dsk-s-keys"><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close · <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd></p>' +
      '</div>';
    document.body.appendChild(root);
    input = root.querySelector('input');
    list = root.querySelector('.dsk-s-list');
    meta = root.querySelector('.dsk-s-meta');
    /* keys inside the search window stay there -- the deck reads bare keys as
       shortcuts, and Reveal moves slides on the arrows */
    ['keydown', 'keyup', 'keypress'].forEach(function(t){ root.addEventListener(t, function(e){ e.stopPropagation(); }); });
    root.addEventListener('mousedown', function(e){ if (e.target === root) close(); });
    input.addEventListener('input', function(){ clearTimeout(timer); timer = setTimeout(run, 60); });
    input.addEventListener('keydown', function(e){
      if (e.key === 'ArrowDown'){ e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp'){ e.preventDefault(); move(-1); }
      else if (e.key === 'Enter'){ e.preventDefault(); if (hits[sel]) go(hits[sel]); }
      else if (e.key === 'Escape'){ e.preventDefault(); close(); }
      e.stopPropagation();
    });
    list.addEventListener('click', function(e){
      var b = e.target.closest('.dsk-s-hit');
      if (b) go(hits[+b.dataset.i]);
    });
  }

  function open(){
    if (document.body.classList.contains('fb-locked')) return;
    if (!root) mount();
    root.hidden = false;
    if (!index) build();
    input.select();
    input.focus();
    if (input.value.trim()) run();
    else render([]);
  }
  function close(){ if (root) root.hidden = true; }

  window.__dskSearch = { open: open, close: close };

  window.addEventListener('keydown', function(e){
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && !e.altKey && e.code === 'KeyF'){
      e.preventDefault(); e.stopImmediatePropagation();
      open();
      return;
    }
    /* Escape closes it wherever the focus happens to be, not only in the input */
    if (e.key === 'Escape' && root && !root.hidden){
      e.preventDefault(); e.stopImmediatePropagation();
      close();
    }
  }, true);
  if (window.desktop) window.desktop.onCommand(function(name){ if (name === 'search') open(); });
})();
