/* Desktop defaults, applied on every launch through the deck's own Settings lists,
   exactly as if the teacher had chosen them: Plus Jakarta Sans at 130% — Projector.
   Adds "150% — Maximum" to the text-size list. Any choice made during a session is
   kept for that session; the next launch starts from these defaults again. */
(function(){
  'use strict';
  if (window.__dskUi) return;
  window.__dskUi = true;

  var FONT = "'Plus Jakarta Sans', sans-serif";
  var SIZE = '1.3';
  var MAX = { value: '1.5', label: '150% — Maximum' };

  function choose(id, value){
    var s = document.getElementById(id);
    if (!s) return false;
    var has = Array.prototype.some.call(s.options, function(o){ return o.value === value; });
    if (!has) return false;
    s.value = value;
    /* the deck wires these with .onchange: this runs its own handler, which sets the
       CSS variable, remembers the choice and re-lays the slides out */
    s.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  /* Projector mode pins the text size to its own 1.18 (body.projector-mode sets
     --custom-font-scale, and body wins over the value the Settings list writes on
     <html>), so 130% and the new 150% did nothing on a projector -- where they matter
     most. The chosen size is mirrored into --dsk-scale, which ui-overrides.css hands
     back to projector mode. */
  function mirror(){
    var s = document.getElementById('fontSizeSelect');
    if (s) document.documentElement.style.setProperty('--dsk-scale', s.value);
  }

  function apply(){
    var size = document.getElementById('fontSizeSelect');
    if (size && !size.querySelector('option[value="' + MAX.value + '"]')) size.appendChild(new Option(MAX.label, MAX.value));
    choose('fontFamilySelect', FONT);
    choose('fontSizeSelect', SIZE);
    mirror();
    if (size) size.addEventListener('change', mirror);
  }

  var tries = 0;
  (function wait(){
    if (window.Deck && window.Deck.layout && document.getElementById('fontSizeSelect')) apply();
    else if (++tries < 200) setTimeout(wait, 50);
  })();
})();
