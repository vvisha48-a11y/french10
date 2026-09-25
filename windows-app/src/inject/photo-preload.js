/* Full-resolution photos, loaded in the background.
   On the website Reveal fetches a stack's photos only as it comes near. Here they
   are files on this PC, so once the first slide is up every photo is promoted --
   data-src to src, exactly the step Reveal itself performs -- a few at a time, in
   idle moments, so that no slide ever waits for a picture. Reveal skips a photo that
   already has its src, and never unloads one. */
(function(){
  'use strict';
  if (window.__dskPhotos) return;
  window.__dskPhotos = true;

  var AT_ONCE = 4;
  var idle = window.requestIdleCallback || function(cb){ return setTimeout(cb, 30); };

  function promote(img){
    return new Promise(function(done){
      if (!img.hasAttribute('data-src')) return done();
      img.loading = 'eager';
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      img.setAttribute('src', img.getAttribute('data-src'));
      img.setAttribute('data-lazy-loaded', '');
      img.removeAttribute('data-src');
    });
  }

  function run(){
    var queue = Array.prototype.slice.call(document.querySelectorAll('#slidesRoot img[data-src]'));
    var total = queue.length, done = 0;
    function next(){
      if (!queue.length) return;
      var img = queue.shift();
      idle(function(){
        promote(img).then(function(){
          done++;
          if (done === total) console.info('[desktop] ' + total + ' photos ready');
          next();
        });
      });
    }
    for (var i = 0; i < AT_ONCE; i++) next();
  }

  var tries = 0;
  (function wait(){
    if (window.Deck && window.Deck.isReady && window.Deck.isReady()) setTimeout(run, 1200);
    else if (++tries < 400) setTimeout(wait, 100);
  })();
})();
