/* Cheesy theme extras: floating cheese bubbles, ticker, scroll reveal. Safe to remove. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ready(fn) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn(); }
  ready(function () {
    var hero = document.getElementById('hero-section');
    if (hero && !reduce) {
      for (var i = 0; i < 9; i++) {
        var b = document.createElement('span'), s = 14 + Math.random() * 38;
        b.className = 'cz-blob';
        b.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (Math.random() * 96) + '%;top:' + (8 + Math.random() * 70) + '%;--d:' + (5 + Math.random() * 6) + 's;animation-delay:-' + (Math.random() * 6) + 's';
        hero.appendChild(b);
      }
    }
    var stats = document.querySelector('.lfc-stats');
    if (stats && !document.querySelector('.cz-ticker')) {
      var words = ['Extra Cheesy', 'Crispy Zingers', 'Loaded Pizzas', 'Buy 1 Get 1 Free', 'Order on WhatsApp', 'Open till 2:30 AM'];
      var row = words.map(function (w) { return '<span>🧀 ' + w + '</span>'; }).join('');
      var t = document.createElement('div');
      t.className = 'cz-ticker'; t.setAttribute('aria-hidden', 'true');
      t.innerHTML = '<div>' + row + row + row + row + '</div>';
      stats.parentNode.insertBefore(t, stats);
    }
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('cz-show'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    document.querySelectorAll('#why-lfc>*,#reviews>*,#branches>*,.lfc-menu-head').forEach(function (el) { el.classList.add('cz-in'); io.observe(el); });
  });
})();
