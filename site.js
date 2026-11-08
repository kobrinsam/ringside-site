(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // headline: fade in word by word
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement('span');
            s.textContent = w;
            s.style.setProperty('--i', i++);
            frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
    el.classList.add('words');
  });

  // the horse hops across the wordmark and back; tap the brand to replay
  var brand = document.querySelector('.brand'), horse = document.querySelector('.horse');
  function fit() {
    if (brand && horse) horse.style.setProperty('--t', Math.max(0, brand.clientWidth - horse.clientWidth) + 'px');
  }
  fit();
  window.addEventListener('resize', fit);
  if (brand && horse && !reduce) {
    brand.style.cursor = 'pointer';
    brand.addEventListener('click', function () {
      var img = horse.firstElementChild;
      [horse, img].forEach(function (e) { e.style.animation = 'none'; });
      void horse.offsetWidth;
      horse.style.animation = ''; img.style.animation = '';
      horse.style.animationDelay = '0s'; img.style.animationDelay = '0s';
    });
  }

  // scroll reveals
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (e) { io.observe(e); });
  }

  // gentle parallax on the hero phone and orbs
  var shot = document.querySelector('.hero .shot'), orbs = document.querySelectorAll('.orb');
  if (!reduce && shot) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        shot.style.translate = '0 ' + (y * -0.08) + 'px';
        orbs.forEach(function (o, i) { o.style.marginTop = (y * (0.12 + i * 0.05)) + 'px'; });
        ticking = false;
      });
    }, { passive: true });
  }
})();
