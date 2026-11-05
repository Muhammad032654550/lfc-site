/* ═════════ LFC CINEMA ENGINE — preloader · burger film · depth carousel ═════════ */
(function () {
  'use strict';
  var d = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var big = window.innerWidth >= 1024;
  var canFilm = big && !reduceMotion && !!window.gsap;

  /* ══════════════ 1. PRELOADER (honest progress + fail-safes) ══════════════ */
  var pre = d.getElementById('lfc-pre');
  var bar = pre && pre.querySelector('.lfc-pre-track i');
  var pctEl = d.getElementById('lfc-pre-pct');
  var preProgress = 0;
  function setProgress(p) {
    preProgress = Math.max(preProgress, Math.min(p, 95));
    if (bar) bar.style.width = preProgress + '%';
    if (pctEl) pctEl.textContent = Math.round(preProgress) + '%';
  }

  /* wordmark letters land one by one (--li indexes the stagger) */
  if (pre && !reduceMotion) {
    var preLetters = pre.querySelectorAll('.lfc-pre-brand i');
    for (var li = 0; li < preLetters.length; li++) preLetters[li].style.setProperty('--li', li);
  }

  /* reveal gate: hero choreography starts only when the curtain opens */
  var revealed = false;
  function revealSite() {
    if (revealed) return;
    revealed = true;
    d.body.classList.remove('lfc-hold');
    d.body.classList.add('lfc-revealed');
    try { window.dispatchEvent(new CustomEvent('lfc:reveal')); } catch (e) { /* IE-safe no-op */ }
  }

  /* rotating kitchen taglines (flavor text — progress stays honest) */
  if (pre && !reduceMotion) {
    var preTxt = pre.querySelector('.lfc-pre-text');
    var taglines = ['Preparing something delicious\u2026', 'Firing up the fryers\u2026', 'Browning the legend\u2026', 'Plating the crunch\u2026'];
    var tagI = 0;
    if (preTxt) {
      setInterval(function () {
        if (!pre || !pre.parentNode || revealed) return;
        tagI = (tagI + 1) % taglines.length;
        preTxt.style.transition = 'opacity .3s';
        preTxt.style.opacity = '0';
        setTimeout(function () { preTxt.textContent = taglines[tagI]; preTxt.style.opacity = '1'; }, 300);
      }, 1900);
    }
  }

  /* rising gold embers inside the splash */
  if (pre && !reduceMotion) {
    var preEm = pre.querySelector('.lfc-pre-embers');
    if (preEm) {
      var emFrag = d.createDocumentFragment();
      for (var ei = 0; ei < 14; ei++) {
        var es = d.createElement('i');
        es.style.left = (Math.random() * 98).toFixed(1) + '%';
        es.style.setProperty('--t', (5 + Math.random() * 6).toFixed(1) + 's');
        es.style.setProperty('--dl', (-Math.random() * 9).toFixed(1) + 's');
        es.style.setProperty('--o', (0.3 + Math.random() * 0.5).toFixed(2));
        es.style.setProperty('--dx', (Math.random() * 44 - 22).toFixed(0) + 'px');
        emFrag.appendChild(es);
      }
      preEm.appendChild(emFrag);
    }
  }

  if (pre && !reduceMotion) {
    d.body.classList.add('pre-lock', 'lfc-hold');
    setProgress(14);
    var critical = ['.lfc-pre-logo', '#hero-image']
      .map(function (sel) { return d.querySelector(sel); })
      .filter(function (el) { return el && el.tagName === 'IMG'; });
    var loadedCount = 0;
    critical.forEach(function (img) {
      var bump = function () { loadedCount++; setProgress(14 + loadedCount * 38); };
      if (img.complete && img.naturalWidth > 0) bump();
      else { img.addEventListener('load', bump, { once: true }); img.addEventListener('error', bump, { once: true }); }
    });
    d.addEventListener('DOMContentLoaded', function () { setProgress(88); });
    var exited = false;
    function exitPreloader() {
      if (exited || !pre || !pre.parentNode) return;
      exited = true;
      window.removeEventListener('load', exitPreloader);
      if (bar) bar.style.width = '100%';
      if (pctEl) pctEl.textContent = '100%';
      var go = function () {
        if (window.gsap) {
          /* logo shrink toward the header logo, then curtain split */
          var headerLogo = d.querySelector('#site-header img.brand-logo-img');
          var inner = pre.querySelector('.lfc-pre-inner');
          var tl = gsap.timeline({ onComplete: function () { d.body.classList.remove('pre-lock'); if (pre.parentNode) pre.parentNode.removeChild(pre); } });
          if (headerLogo) {
            var logoEl = pre.querySelector('.lfc-pre-logo');
            logoEl.style.animation = 'none'; /* stop breathing so GSAP owns the flight */
            var fr = logoEl.getBoundingClientRect();
            var toR = headerLogo.getBoundingClientRect();
            var dx = (toR.left + toR.width / 2) - (fr.left + fr.width / 2);
            var dy = (toR.top + toR.height / 2) - (fr.top + fr.height / 2);
            var sc = toR.width / Math.max(1, fr.width);
            tl.to(logoEl, { x: dx, y: dy, scale: sc, opacity: .0, duration: .8, ease: 'power3.inOut' }, .22);
          }
          tl.to('.lfc-pre-inner', { opacity: 0, y: -26, duration: .4, ease: 'power2.in' }, .28)
            .to('.lfc-pre-head', { opacity: 0, duration: .3, ease: 'power1.in' }, .26)
            .to('.lfc-pre-embers', { opacity: 0, duration: .45, ease: 'power1.in' }, .36)
            .to(pre, { yPercent: -101, duration: .9, ease: 'power4.inOut' }, .5)
            .add(revealSite, .66)
            .add(startFilm, .88);
        } else {
          /* graceful no-GSAP exit */
          pre.classList.add('exit');
          d.body.classList.remove('pre-lock');
          revealSite();
          setTimeout(function () { if (pre.parentNode) pre.parentNode.removeChild(pre); }, 1100);
          startFilm();
        }
      };
      setTimeout(go, 620); /* minimum branded-splash time */
    }
    if (d.readyState === 'complete') exitPreloader();
    else window.addEventListener('load', exitPreloader);
    setTimeout(exitPreloader, 5200); /* fail-safe: nonessential assets stall */
    setTimeout(function () { d.body.classList.remove('pre-lock'); revealSite(); }, 6400); /* ultimate fail-safe: motion + scroll never stay frozen */
  } else {
    revealSite(); /* no preloader / reduced motion: reveal right away */
  }

  /* ══════════════ 2. SHARED STATE ══════════════ */
  var scene = d.getElementById('fx-scene');
  var wrapEl = d.getElementById('fx-burger-wrap');
  var stage = d.getElementById('fx-stage');
  var sidePrev = d.getElementById('fx-side-prev');
  var sideNext = d.getElementById('fx-side-next');
  var heroSec = d.getElementById('hero-section');
  var heroImg = d.getElementById('hero-image');
  var replayBtn = d.getElementById('fx-replay');
  var filmDone = false;

  /* ══════════════ 3. FILM — real-photo medallion montage ══════════════
     The old cartoon burger SVG is gone: the intro film now works ONLY with
     the site's real dish photography. Three gold-rimmed medallions (prev /
     current / next hero dish) cascade in from the kitchen, orbit in depth
     around the current dish, stack into a trio, then burst out so the real
     #hero-image blob pops through with golden crumbs. */

  function medMark(cls, src) {
    return '<div class="fx-med ' + cls + '"><img src="' + src + '" alt="" decoding="async"/></div>';
  }
  function medMontage(list, idx) {
    var n = list.length;
    var prev = list[((idx - 1) % n + n) % n];
    var cur = list[idx % n];
    var next = list[((idx + 1) % n + n) % n];
    return medMark('fx-med--sat fx-med--sat-A', prev) +
           medMark('fx-med--sat fx-med--sat-B', next) +
           medMark('fx-med--main', cur);
  }

  /* ══════════════ 4. FILM TIMELINE ══════════════ */

  function crumbs(kind, count, opts) {
    if (!wrapEl) return;
    var colors = kind === 'gold' ? ['#fbbf24', '#fcd34d', '#f59e0b'] : ['#c98a37', '#e8b04b', '#8b5517', '#f5bc56'];
    for (var i = 0; i < (count || 12); i++) {
      (function () {
        var c = d.createElement('i');
        c.className = 'fx-crumb' + (kind === 'gold' ? ' gold' : '');
        c.style.background = colors[i % colors.length];
        wrapEl.appendChild(c);
        gsap.fromTo(c,
          { x: gsap.utils.random(-16, 16), y: gsap.utils.random(-6, 10), opacity: 1, scale: gsap.utils.random(.5, 1), rotation: 0 },
          { x: gsap.utils.random(-(opts || 110), 110), y: gsap.utils.random(24, kind === 'gold' ? -60 : 130), opacity: 0, rotation: gsap.utils.random(-160, 160), scale: gsap.utils.random(.3, .8), duration: gsap.utils.random(.7, 1.35), ease: 'power2.out', onComplete: function () { if (c.parentNode) c.parentNode.removeChild(c); } });
      })();
    }
  }

  function playFilm(onDone) {
    if (!window.gsap || !wrapEl || !scene) { if (onDone) onDone(); return; }
    var list = thumbsData();
    if (!list.length) {
      /* hero photos may still be rendering — retry a few times, then pass */
      playFilm._tries = (playFilm._tries || 0) + 1;
      if (playFilm._tries < 10) { setTimeout(function () { playFilm(onDone); }, 350); return; }
      if (onDone) onDone(); return;
    }
    var blob = heroImg && heroImg.parentNode;
    if (!blob) { if (onDone) onDone(); return; }
    playFilm._tries = 0;

    scene.classList.add('film');
    wrapEl.classList.add('active');
    wrapEl.innerHTML = medMontage(list, currentIndex || 0);

    var main = wrapEl.querySelector('.fx-med--main');
    var satA = wrapEl.querySelector('.fx-med--sat-A');
    var satB = wrapEl.querySelector('.fx-med--sat-B');
    var glow = scene.querySelector('.fx-glow');
    var chips = scene.querySelectorAll('.fx-chip');
    var mainImg = main && main.querySelector('img');
    var R = Math.min(200, Math.max(120, (wrapEl.clientWidth || 500) * .3));

    var tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: function () {
        scene.classList.remove('film');
        wrapEl.classList.remove('active');
        wrapEl.innerHTML = '';
        scene.classList.add('carousel');
        filmDone = true;
        gsap.set(chips, { clearProps: 'transform,opacity,scale' });
        if (onDone) onDone();
      }
    });

    /* centre every medallion on the dish hub */
    gsap.set([main, satA, satB], { xPercent: -50, yPercent: -50 });

    /* warm-up: the hearth glow swells behind the montage */
    tl.fromTo(glow, { opacity: .6, scale: .92 }, { opacity: .98, scale: 1.06, duration: .7, ease: 'power2.out' }, 0);

    /* cascade: current dish rises from the hearth, its neighbours glide in */
    tl.fromTo(main, { y: 150, scale: .3, opacity: 0, rotation: -9 },
      { y: 0, scale: 1, opacity: 1, rotation: 0, duration: 1.05 }, 0.12);
    tl.fromTo(satA, { x: -R * 2.5, y: -R * 1.2, scale: .2, opacity: 0, rotation: -28 },
      { x: -R, y: 0, scale: .64, opacity: .96, rotation: 0, duration: .95, ease: 'power3.out' }, 0.42);
    tl.fromTo(satB, { x: R * 2.3, y: -R * .9, scale: .2, opacity: 0, rotation: 28 },
      { x: R, y: 0, scale: .64, opacity: .96, rotation: 0, duration: .95, ease: 'power3.out' }, 0.56);

    /* Ken Burns push-in on the current dish photo */
    if (mainImg) { tl.fromTo(mainImg, { scale: 1, xPercent: 0 }, { scale: 1.16, xPercent: -2, duration: 2.7, ease: 'power1.inOut' }, 0.1); }

    /* orbit: neighbours circle the current dish through depth (front = nearer) */
    var ang = { a: Math.PI };
    tl.to(ang, {
      a: Math.PI + Math.PI * 2, duration: 1.35, ease: 'power1.inOut',
      onUpdate: function () {
        var x = Math.cos(ang.a) * R, y = Math.sin(ang.a) * R * .42;
        if (satA) {
          gsap.set(satA, { x: x, y: y, scale: y > 0 ? .78 : .58, rotation: Math.sin(ang.a) * -5 });
          satA.style.zIndex = y > 0 ? 120 : 70;
        }
        if (satB) {
          gsap.set(satB, { x: -x, y: -y, scale: y > 0 ? .58 : .78, rotation: Math.sin(ang.a) * 5 });
          satB.style.zIndex = y > 0 ? 70 : 120;
        }
      }
    }, 1.4);

    /* stack the trio: neighbours lean onto the current dish */
    tl.to(satA, { x: -34, y: -8, scale: .8, rotation: -9, duration: .65, ease: 'power3.inOut' }, 2.88)
      .to(satB, { x: 34, y: 8, scale: .8, rotation: 9, duration: .65, ease: 'power3.inOut' }, 2.88)
      .to(main, { scale: 1.34, rotation: 5, duration: .55, ease: 'power3.in' }, 3.44);

    /* BURST: the film veil lifts and the real dish photo pops through */
    tl.add(function () {
      scene.classList.remove('film');
      blob.classList.remove('is-pop');
      void blob.offsetWidth;
      blob.classList.add('is-pop');
      crumbs('gold', 14, 90);
    }, 3.99);
    tl.to(main, { scale: 2.1, opacity: 0, rotation: 10, duration: .5, ease: 'power2.out' }, 3.99)
      .to(satA, { x: -R * 2, y: -R * .7, scale: .4, opacity: 0, rotation: -26, duration: .55, ease: 'power2.out' }, 4.01)
      .to(satB, { x: R * 2, y: -R * .6, scale: .4, opacity: 0, rotation: 26, duration: .55, ease: 'power2.out' }, 4.03);

    /* the real ingredient chips pop back in, one by one */
    tl.set(chips, { opacity: 0, scale: .5, y: 14 }, 3.94)
      .to(chips, { opacity: 1, scale: 1, y: 0, duration: .6, stagger: .07, ease: 'back.out(1.8)' }, 4.04);

    /* settle: the glow breathes back to its resting light */
    tl.to(glow, { opacity: .7, scale: 1, duration: .8, ease: 'power1.inOut' }, 4.3)
      .to({}, { duration: .45 });
  }

  function startFilm() {
    if (!canFilm || !wrapEl || wrapEl._played) return;
    wrapEl._played = true;
    /* wait until the photo scene reveal (app.js) has set its first image */
    var go = function () { playFilm(function () { /* film → carousel */ }); };
    setTimeout(go, 350);
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      if (!canFilm) return;
      scene.classList.remove('carousel');
      wrapEl._played = false;
      playFilm(function () { refreshCarousel(); });
    });
  }
  /* manual/test access */
  window.LFC_CINE = { playFilm: playFilm, refreshCarousel: refreshCarousel };

  /* photo mode fallback (mobile / reduced motion / GSAP blocked): straight to carousel */
  if (!canFilm && scene) {
    var initCarousel = function () { scene.classList.add('carousel'); refreshCarousel(); };
    if (d.readyState !== 'loading') initCarousel(); else d.addEventListener('DOMContentLoaded', initCarousel);
  }

  /* ══════════════ 5. DEPTH CAROUSEL (uses real slide data) ══════════════ */
  var currentIndex = 0;
  function thumbsData() {
    var list = [];
    d.querySelectorAll('#hero-thumbnails img').forEach(function (im) { list.push(im.getAttribute('src') || ''); });
    return list;
  }
  function matchIndex(src, list) {
    var base = (src || '').split('?')[0].toLowerCase();
    for (var i = 0; i < list.length; i++) {
      if ((list[i] || '').split('?')[0].toLowerCase() === base) return i;
    }
    return -1;
  }
  function refreshCarousel() {
    if (!sidePrev || !sideNext) return;
    var list = thumbsData();
    if (!list.length) return;
    if (currentIndex >= list.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = list.length - 1;
    var p = list[(currentIndex - 1 + list.length) % list.length];
    var n = list[(currentIndex + 1) % list.length];
    var ip = sidePrev.querySelector('img'); var inx = sideNext.querySelector('img');
    if (ip) ip.src = p;
    if (inx) inx.src = n;
  }
  function setSlide(i) {
    var list = thumbsData();
    if (!list.length) return;
    currentIndex = ((i % list.length) + list.length) % list.length;
    if (window.LFC && typeof window.LFC.goToHeroSlide === 'function') {
      window.LFC.goToHeroSlide(currentIndex);
    }
    refreshCarousel();
  }
  /* keep in sync with autoplay / admin-driven slide changes */
  if (heroImg && 'MutationObserver' in window) {
    new MutationObserver(function () {
      var list = thumbsData();
      var i = matchIndex(heroImg.getAttribute('src'), list);
      if (i > -1) currentIndex = i;
      refreshCarousel();
    }).observe(heroImg, { attributes: true, attributeFilter: ['src'] });
  }
  if (heroImg) refreshCarousel();
  window.addEventListener('load', refreshCarousel);

  /* controls */
  var btnPrev = d.getElementById('fx-car-prev');
  var btnNext = d.getElementById('fx-car-next');
  if (btnPrev) btnPrev.addEventListener('click', function () { setSlide(currentIndex - 1); });
  if (btnNext) btnNext.addEventListener('click', function () { setSlide(currentIndex + 1); });
  if (sidePrev) sidePrev.addEventListener('click', function () { setSlide(currentIndex - 1); });
  if (sideNext) sideNext.addEventListener('click', function () { setSlide(currentIndex + 1); });

  d.addEventListener('keydown', function (e) {
    if (!heroSec || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (/INPUT|TEXTAREA|SELECT/.test((d.activeElement && d.activeElement.tagName) || '')) return;
    var r = heroSec.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.7 || r.bottom < window.innerHeight * 0.3) return;
    if (e.key === 'ArrowLeft') setSlide(currentIndex - 1); else setSlide(currentIndex + 1);
  });

  /* touch swipe on the stage */
  if (stage) {
    var sx = null, sy = null;
    stage.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; }, { passive: true });
    stage.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.6) setSlide(currentIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ══════════════ 6. FINAL CTA — wire real WhatsApp link ══════════════ */
  var wa = d.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
  var waBtn = d.getElementById('final-wa-btn');
  if (wa && waBtn) {
    var href = wa.getAttribute('href');
    if (href && href.length > 5) waBtn.setAttribute('href', href);
  }

  /* ══════════════ 7. 3D CARD TILT ENGINE (deals · menu · bogo · reviews) ══════════════ */
  var TILT_SEL = '.lfc-card, .lfc-deal, .featured-bogo__card, #reviews-grid > div';
  var tiltOK = window.matchMedia('(min-width:1024px)').matches && !reduceMotion &&
               window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function armTilt(card) {
    if (card._fxTilt || !tiltOK) { if (tiltOK) card.classList.add('fx-tilt'); return; }
    card._fxTilt = true;
    card.classList.add('fx-tilt');
    var raf = 0;
    card.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      if (!raf) {
        raf = requestAnimationFrame(function () {
          raf = 0;
          card.style.setProperty('--fx-ry', ((px - .5) * 9).toFixed(2) + 'deg');   /* yaw */
          card.style.setProperty('--fx-rx', ((.5 - py) * 7).toFixed(2) + 'deg');   /* pitch */
          card.style.setProperty('--fx-mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--fx-my', (py * 100).toFixed(1) + '%');
        });
      }
    }, { passive: true });
    card.addEventListener('pointerleave', function () {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      card.style.setProperty('--fx-ry', '0deg');
      card.style.setProperty('--fx-rx', '0deg');
    }, { passive: true });
  }

  /* ══════════════ 8. SCROLL-REVEAL ENGINE (staggered, IntersectionObserver) ══════════════ */
  var REVEAL_SEL = [
    '.lfc-card', '.lfc-deal', '.featured-bogo__card', '#reviews-grid > div',
    '#categories-container button', '.lfc-menu-head', '.lfc-deals__head', '#final-cta .fx-final'
  ].join(',');
  var revIdx = 0;
  var revIO = ('IntersectionObserver' in window) && !reduceMotion
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('fx-in');
            revIO.unobserve(en.target);
          }
        });
      }, { rootMargin: '90px 0px -6% 0px', threshold: 0.06 })
    : null;

  function showRev(el) {
    el.classList.add('fx-in');
    if (revIO) revIO.unobserve(el);
  }

  /* live list of elements still waiting to reveal (for the scroll fallback sweep) */
  var pendingRev = [];

  /* scroll/resize fallback sweep — reveal by rect, independent of IO/rAF timing */
  var sweepThrottle = 0;
  function sweepReveal() {
    for (var i = pendingRev.length - 1; i >= 0; i--) {
      var el = pendingRev[i];
      if (!el.parentNode) { pendingRev.splice(i, 1); continue; }
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > -40) {
        showRev(el);
        pendingRev.splice(i, 1);
      }
    }
  }
  var sweepQueued = false;
  function queueSweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    setTimeout(function () { sweepQueued = false; if (pendingRev.length) sweepReveal(); }, 130);
  }
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
  /* last-resort ticker: only alive while elements are pending (dies when list empties) */
  var revTicker = setInterval(function () {
    if (!pendingRev.length) { clearInterval(revTicker); return; }
    sweepReveal();
    if (!pendingRev.length) clearInterval(revTicker);
  }, 400);

  function scanCards() {
    d.querySelectorAll(TILT_SEL).forEach(function (c) { armTilt(c); });
    if (!revIO) {
      d.querySelectorAll(REVEAL_SEL).forEach(function (el) { showRev(el); });
      return;
    }
    d.querySelectorAll(REVEAL_SEL).forEach(function (el) {
      if (el._fxRev) return;
      el._fxRev = true;
      el.classList.add('fx-rev');
      el.style.setProperty('--fx-d', (revIdx++ % 9) * 55 + 'ms');
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        showRev(el);
      } else {
        pendingRev.push(el);
        revIO.observe(el);
      }
    });
  }
  scanCards();

  /* rescan for dynamic renders (menu filter / search / deal changes / admin edits) */
  var scanQueued = false;
  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;
    setTimeout(function () {
      scanQueued = false;
      revIdx = 0;
      scanCards();
    }, 60);
  }
  if ('MutationObserver' in window) {
    new MutationObserver(queueScan).observe(d.body, { childList: true, subtree: true });
  }
  setTimeout(queueScan, 400);  /* catch first async renders (menu/deals after data fetch) */
  window.addEventListener('load', queueScan);

  /* ══════════════ 9. PREMIUM CARD EXTRAS ══════════════ */

  /* 9a. category photo tiles — real images from the admin-managed menu data */
  function paintCategoryTiles() {
    var pills = d.querySelectorAll('#categories-container .lfc-pill');
    if (!pills.length) return;
    var items = [];
    try { items = JSON.parse(localStorage.getItem('lfc_menu_items') || '[]'); } catch (e) { items = []; }
    if (!items.length) return;
    pills.forEach(function (pill) {
      if (pill._fxCat) return;
      pill._fxCat = true;
      var cat = '';
      var oc = pill.getAttribute('onclick') || '';
      var m = oc.match(/setCategory\('([^']+)'\)/);
      if (m) cat = m[1];
      var imgSrc = '';
      if (cat === 'all') {
        imgSrc = './images/zinger-burger.jpg'; /* the signature product, not invented */
      } else {
        for (var i = 0; i < items.length; i++) {
          if (items[i].cat === cat && items[i].image && items[i].inStock !== false) { imgSrc = items[i].image; break; }
        }
        if (!imgSrc) imgSrc = './images/zinger-burger.jpg';
      }
      pill.style.setProperty('--fx-cat-img', 'url("' + imgSrc.replace(/"/g, '%22') + '")');
    });
  }

  /* 9b. GSAP grid-wave entrances (menu + deals), per-section choreography.
         Only runs on desktop when GSAP is present; otherwise the CSS reveal
         engine handles those cards, so there is never a double animation. */
  var WAVES = [
    { sel: '#menu-grid', y: 20, s: .94, each: .055, dur: .45, from: 'start' },
    { sel: '#deals-grid', y: 26, s: .9, each: .09, dur: .55, from: 'center' }
  ];
  var pendingWaves = [];

  function playWave(fresh, cfg) {
    gsap.set(fresh, { autoAlpha: 0, y: cfg.y, scale: cfg.s });
    gsap.to(fresh, {
      autoAlpha: 1, y: 0, scale: 1,
      duration: cfg.dur, ease: 'back.out(1.4)',
      stagger: { each: cfg.each, from: cfg.from, grid: 'auto' }
    });
  }

  function waveGrids() {
    if (!canFilm) return;
    WAVES.forEach(function (cfg) {
      var grid = d.querySelector(cfg.sel);
      if (!grid || !grid.children.length) return;
      var fresh = [];
      Array.prototype.forEach.call(grid.children, function (k) {
        if (!k._fxWaved) { fresh.push(k); k._fxWaved = true; }
      });
      if (!fresh.length) return;
      var r = grid.getBoundingClientRect();
      var inView = r.bottom > -60 && r.top < window.innerHeight * 0.96;
      if (!inView) {
        pendingWaves.push({ grid: grid, fresh: fresh, cfg: cfg });
        return;
      }
      playWave(fresh, cfg);
    });
  }
  function flushWaves() {
    var vh = window.innerHeight;
    for (var i = pendingWaves.length - 1; i >= 0; i--) {
      var w = pendingWaves[i];
      if (!w.fresh[0] || !w.fresh[0].parentNode) { pendingWaves.splice(i, 1); continue; }
      var r = w.grid.getBoundingClientRect();
      if (r.bottom > -60 && r.top < vh * 0.96) {
        playWave(w.fresh, w.cfg);
        pendingWaves.splice(i, 1);
      }
    }
  }

  /* 9c. hook into the existing rescan + sweep machinery */
  var _scanBase = scanCards;
  var _sweepBase = sweepReveal;
  scanCards = function () {
    paintCategoryTiles();
    waveGrids();
    /* when GSAP drives the grids, keep those cards out of the CSS reveal path */
    if (canFilm) {
      d.querySelectorAll('#menu-grid > .lfc-card, #deals-grid > .lfc-deal').forEach(function (el) {
        el.classList.add('fx-in'); /* never hidden; wave owns the entrance */
        el._fxRev = true;
      });
    }
    _scanBase();
    buildSignaturePicks();
  };
  sweepReveal = function () {
    flushWaves();
    _sweepBase();
  };

  /* ══════════════ 10. FUN SPARKLE-POP on order actions ══════════════ */
  var SPARK_COLORS = ['#fbbf24', '#fde047', '#e11d2e', '#fff3c4'];
  d.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.lfc-add, .lfc-deal__cta');
    if (!btn || reduceMotion) return;
    for (var i = 0; i < 7; i++) {
      (function (i) {
        var s = d.createElement('i');
        s.className = 'fx-sparkle';
        var col = SPARK_COLORS[i % SPARK_COLORS.length];
        var rx = (Math.random() * 140 - 70).toFixed(0), ry = (-20 - Math.random() * 66).toFixed(0), rs = (0.6 + Math.random() * 0.9).toFixed(2);
        s.style.cssText = 'background:' + col + ';box-shadow:0 0 8px ' + col + ';--sx:' + rx + 'px;--sy:' + ry + 'px;--ss:' + rs + 's';
        btn.appendChild(s);
        setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 780);
      })(i);
    }
  }, true);

  /* ══════════════ 11. SIGNATURE PICKS — 3D coverflow (real menu data) ══════════════ */
  var sgIndex = 0, sgCards = [], sgItems = [], sgTimer = null, sgHover = false;

  function sgEsc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* one hero item per category, preferring name matches — real data only */
  function sgPicks(items) {
    var want = [
      ['burgers', /zinger/i],
      ['pizzas', /crown|tikka|supreme/i],
      ['chicken', /fried|bucket|family/i],
      ['wraps', /paratha|roll/i],
      ['wings', /wings/i],
      ['sides', /fries|loaded/i],
      ['deals', /combo|feast|deal/i]
    ];
    var picks = [], used = {};
    function take(item) {
      if (!item || used[String(item.id)] || picks.length >= 7) return false;
      used[String(item.id)] = true;
      picks.push(item);
      return true;
    }
    var live = items.filter(function (i) { return i && i.inStock !== false && i.image; });
    want.forEach(function (pair) {
      var pool = live.filter(function (i) { return i.cat === pair[0]; });
      if (!pool.length) return;
      var hit = null;
      for (var k = 0; k < pool.length; k++) {
        if (pair[1].test(String(pool[k].name || ''))) { hit = pool[k]; break; }
      }
      take(hit || pool[0]);
    });
    /* top up so the stage always spins */
    for (var t = 0; t < live.length && picks.length < 6; t++) take(live[t]);
    return picks;
  }

  /* progress fill: synced to the 4.5s autoplay rhythm (decor only) */
  function sgProgressReset() {
    var bar = document.getElementById('sg-progress-fill');
    if (!bar || reduceMotion) return;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    void bar.offsetWidth;
    bar.style.transition = 'width 4.5s linear';
    bar.style.width = '100%';
  }

  function sgLayout() {
    var N = sgCards.length;
    if (!N) return;
    var step = window.innerWidth < 700 ? 140 : 215;
    sgCards.forEach(function (c, i) {
      var d = ((i - sgIndex + N + N / 2) % N) - N / 2;
      var a = Math.abs(d);
      /* pointer tilt (§11a) rides on top of the layout transform via CSS vars */
      c.style.transform = 'translateX(' + (d * step) + 'px) translateZ(' + (-a * 130) + 'px) rotateY(' + (d * -18) + 'deg) rotateX(var(--sg-tiltX,0deg)) rotateY(var(--sg-tiltY,0deg)) scale(' + Math.max(0.7, 1 - a * 0.1) + ')';
      c.style.setProperty('--sg-tiltX', '0deg');
      c.style.setProperty('--sg-tiltY', '0deg');
      c.style.zIndex = String(100 - Math.round(a * 10));
      c.style.opacity = a > 2.6 ? '0' : String(1 - a * 0.26);
      c.classList.toggle('is-center', d === 0);
    });
    var count = document.getElementById('sg-count');
    if (count) {
      var label = (sgIndex + 1) + ' / ' + N;
      if (count.textContent !== label && !reduceMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches === false) {
        count.classList.remove('sg-flip');
        void count.offsetWidth;
        count.classList.add('sg-flip');
      }
      count.textContent = label;
    }
  }

  function sgStep(delta) {
    var N = sgCards.length;
    if (!N) return;
    sgIndex = ((sgIndex + delta) % N + N) % N;
    sgLayout();
    /* arrival FX: brightness flash + CTA pop on the new centre card
       (filter-only, so it can never fight the layout transform) */
    if (!reduceMotion) {
      var center = sgCards[sgIndex];
      if (center) {
        center.classList.remove('sg-arrive');
        void center.offsetWidth;
        center.classList.add('sg-arrive');
      }
    }
    sgProgressReset();
  }

  function sgStop() {
    if (sgTimer) { clearInterval(sgTimer); sgTimer = null; }
  }
  function sgAuto() {
    sgStop();
    if (reduceMotion) return;
    sgTimer = setInterval(function () {
      if (document.hidden || sgHover) return;
      var sec = document.getElementById('signature-picks');
      if (!sec) return;
      var r = sec.getBoundingClientRect();
      if (r.bottom < 40 || r.top > window.innerHeight - 40) return; /* only when in view */
      sgStep(1);
    }, 4500);
  }

  function buildSignaturePicks() {
    var stage = document.getElementById('sg-stage');
    if (!stage || stage._sgBuilt) return;
    var items = [];
    try { items = JSON.parse(localStorage.getItem('lfc_menu_items') || '[]'); } catch (e) { items = []; }
    var picks = sgPicks(items);
    if (picks.length < 3) return; /* menu data not ready yet — a later scan retries */

    stage._sgBuilt = true;
    sgItems = picks;
    stage.innerHTML = picks.map(function (it) {
      var img = sgEsc(it.image);
      var name = sgEsc(it.name);
      var price = Number(it.price) || 0;
      return '<button type="button" class="sg-card" aria-label="Order ' + name + '">' +
        '<span class="sg-card__img"><img src="' + img + '" alt="' + name + '" loading="lazy" decoding="async"/></span>' +
        '<span class="sg-card__body">' +
        '<span class="sg-card__name">' + name + '</span>' +
        '<span class="sg-card__price">Rs. ' + price.toLocaleString() + '</span>' +
        '<span class="sg-card__cta">Order now &rarr;</span>' +
        '</span></button>';
    }).join('');

    sgCards = Array.prototype.slice.call(stage.children);
    sgIndex = 0;
    sgLayout();

    /* the first autoplay cycle must show its countdown fill from the start */
    sgProgressReset();

    stage.addEventListener('click', function (e) {
      var card = e.target.closest && e.target.closest('.sg-card');
      if (!card) return;
      var idx = sgCards.indexOf(card);
      if (idx < 0) return;
      if (card.classList.contains('is-center')) {
        /* centre card = order action → opens the real customizer */
        if (window.LFC && LFC.openCustomizeModal) LFC.openCustomizeModal(sgItems[idx].id);
      } else {
        sgIndex = idx;
        sgLayout();
      }
    });
    stage.addEventListener('mouseenter', function () { sgHover = true; sgStop(); });
    stage.addEventListener('mouseleave', function () { sgHover = false; sgAuto(); });

    var prev = document.getElementById('sg-prev');
    var next = document.getElementById('sg-next');
    if (prev) prev.addEventListener('click', function () { sgStep(-1); });
    if (next) next.addEventListener('click', function () { sgStep(1); });
    window.addEventListener('resize', sgLayout);

    /* §11a — first-scroll cascade: cards stream in the first time the stage appears */
    if (window.gsap && !reduceMotion && !stage._sgIntro && 'IntersectionObserver' in window) {
      stage._sgIntro = true;
      gsap.set(sgCards, { visibility: 'hidden', y: 48, scale: .92, rotation: -2.5 });
      var introIO = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        introIO.disconnect();
        gsap.set(sgCards, { visibility: 'visible' });
        gsap.to(sgCards, {
          y: 0, scale: 1, rotation: 0, duration: .8, ease: 'back.out(1.45)',
          stagger: { each: .1, from: 'center' },
          onComplete: function () { gsap.set(sgCards, { clearProps: 'transform' }); }
        });
      }, { threshold: .3 });
      introIO.observe(stage);
    }

    /* §11a — pointer tilt: the centre card leans toward the cursor */
    if (!reduceMotion && window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
      stage.addEventListener('pointermove', function (e) {
        var card = e.target.closest && e.target.closest('.sg-card');
        if (!card || !card.classList.contains('is-center')) return;
        var r = card.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - .5;
        var ny = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--sg-tiltY', (nx * 8).toFixed(2) + 'deg');
        card.style.setProperty('--sg-tiltX', (-ny * 7).toFixed(2) + 'deg');
      });
      stage.addEventListener('pointerout', function (e) {
        var card = e.target.closest && e.target.closest('.sg-card');
        if (card && !card.contains(e.relatedTarget)) {
          card.style.setProperty('--sg-tiltY', '0deg');
          card.style.setProperty('--sg-tiltX', '0deg');
        }
      });
    }

    sgAuto();
  }
  /* retries until the admin menu data is present */
  setTimeout(buildSignaturePicks, 1200);
  setTimeout(buildSignaturePicks, 3200);
})();