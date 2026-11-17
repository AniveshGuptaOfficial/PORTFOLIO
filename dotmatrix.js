/* ==========================================================
   DOT MATRIX ANIMATION
   A site-wide background layer (behind all content): a grid of tiny dots
   that drift and sway like liquid, shimmer with sweeping light waves,
   pulse on their own, light up around the cursor, and ripple on click / tap.
   Self-contained — just include <script src="dotmatrix.js" defer>.
   ========================================================== */
(function () {
  'use strict';
  if (window.__dotMatrixLoaded) return;
  window.__dotMatrixLoaded = true;

  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  var cvs = document.createElement('canvas');
  cvs.id = 'dot-matrix';
  cvs.setAttribute('aria-hidden', 'true');
  cvs.style.cssText =
    'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;' +
    'z-index:0;';
  var ctx = cvs.getContext('2d');

  // Sit BEHIND the content: the canvas is at z-index 0 under #spa-root (z-index 1),
  // so the page layers need to let it show through instead of painting a solid --bg.
  var bgStyle = document.createElement('style');
  bgStyle.id = 'dot-matrix-bg';
  bgStyle.textContent =
    '.view-page{background:transparent!important}' +
    '.hero{background:radial-gradient(ellipse 80% 60% at 50% 0%,var(--hero-glow,#1e0a3c) 0%,transparent 70%)!important}' +
    ':root.light .hero{background:radial-gradient(ellipse 80% 60% at 50% 0%,var(--hero-glow,#ede9fb) 0%,transparent 70%)!important}';

  var GAP = isTouch ? 26 : 22;     // spacing between dots (px)
  var BASE_R = 1.05;               // resting dot radius
  var SPOT = isTouch ? 130 : 170;  // cursor spotlight radius
  var BUCKETS = 10;                // alpha levels (batched draw calls)
  var DRIFT_X = 0.014, DRIFT_Y = 0.009;  // grid drift speed (px per ms)

  var W = 0, H = 0, DPR = 1, cols = 0, rows = 0;
  var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: false };
  var ripples = [];
  var color = '167,139,250', light = false;

  function readTheme() {
    light = document.documentElement.classList.contains('light');
    var c = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || (light ? '#7c3aed' : '#a78bfa');
    var m = c.match(/^#?([0-9a-f]{6})$/i);
    if (m) {
      var n = parseInt(m[1], 16);
      color = (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255);
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cvs.width = W * DPR; cvs.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cols = Math.ceil(W / GAP) + 3;   // extra rows/cols so the drifting grid never shows an edge
    rows = Math.ceil(H / GAP) + 3;
  }

  // stable pseudo-random value per grid cell, so each dot keeps its own twinkle while drifting
  function hash(i, j) {
    var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return (h - Math.floor(h)) * 6.2832;
  }

  var paths = [];
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (var b = 0; b < BUCKETS; b++) paths[b] = new Path2D();

    var mx = mouse.x, my = mouse.y, spot2 = SPOT * SPOT;

    // the whole grid slowly slides diagonally and wraps around
    var sx = t * DRIFT_X, sy = t * DRIFT_Y;
    var ci = Math.floor(sx / GAP), cj = Math.floor(sy / GAP);
    var offX = sx - ci * GAP - GAP, offY = sy - cj * GAP - GAP;

    // wave direction slowly rotates so the light bands sweep in changing directions
    var ang = t * 0.00008;
    var kx = Math.cos(ang) * 0.011, ky = Math.sin(ang) * 0.011;

    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var bx = offX + i * GAP, by = offY + j * GAP;
        var seed = hash(i - ci, j - cj);

        // liquid flow: each dot sways around its grid point
        var x = bx + Math.sin(by * 0.018 + t * 0.0013) * 5 + Math.cos(bx * 0.011 - t * 0.0009) * 3;
        var y = by + Math.cos(bx * 0.016 + t * 0.0011) * 5 + Math.sin(by * 0.013 + t * 0.0007) * 3;

        var wave = 0.5 + 0.5 * Math.sin(bx * kx + by * ky - t * 0.0024);
        var wave2 = 0.5 + 0.5 * Math.sin(bx * 0.006 - by * 0.009 + t * 0.0016);
        var twinkle = 0.5 + 0.5 * Math.sin(t * 0.003 + seed * 3);
        var a = 0.06 + wave * wave * 0.32 + wave2 * 0.1 + twinkle * twinkle * 0.12;
        var r = BASE_R * 0.7 + wave * 0.9 + twinkle * 0.3;

        // cursor spotlight: brighten, enlarge, and push dots outward
        if (mouse.on) {
          var dx = x - mx, dy = y - my, dist2 = dx * dx + dy * dy;
          if (dist2 < spot2) {
            var dist = Math.sqrt(dist2) || 1, f = 1 - dist / SPOT, e = f * f;
            a += e * 0.75; r += e * 1.6;
            x += (dx / dist) * e * 10; y += (dy / dist) * e * 10;
          }
        }

        // ripples: bright rings expanding outward
        for (var q = 0; q < ripples.length; q++) {
          var rp = ripples[q], rx = x - rp.x, ry = y - rp.y;
          var band = Math.abs(Math.sqrt(rx * rx + ry * ry) - rp.r);
          if (band < 26) { var g = (1 - band / 26) * rp.life * rp.power; a += g * 0.8; r += g * 1.4; }
        }

        if (a > 1) a = 1;
        var bucket = Math.min(BUCKETS - 1, (a * BUCKETS) | 0);
        paths[bucket].moveTo(x + r, y);
        paths[bucket].arc(x, y, r, 0, 6.2832);
      }
    }

    var scale = light ? 0.75 : 1;
    for (var b2 = 0; b2 < BUCKETS; b2++) {
      ctx.fillStyle = 'rgba(' + color + ',' + (((b2 + 0.5) / BUCKETS) * scale).toFixed(3) + ')';
      ctx.fill(paths[b2]);
    }
  }

  var themeTick = 0, nextPulse = 1200;
  function loop(t) {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    if (++themeTick % 30 === 0) readTheme();

    // ease the spotlight toward the pointer for a smooth trail
    mouse.x += (mouse.tx - mouse.x) * 0.18;
    mouse.y += (mouse.ty - mouse.y) * 0.18;

    // a soft ambient pulse every few seconds somewhere on screen
    if (t > nextPulse) {
      nextPulse = t + 2200 + Math.random() * 2000;
      addRipple(Math.random() * W, Math.random() * H, 0.45);
    }

    for (var i = ripples.length - 1; i >= 0; i--) {
      ripples[i].r += 7; ripples[i].life -= 0.014;
      if (ripples[i].life <= 0) ripples.splice(i, 1);
    }
    draw(t);
  }

  function point(x, y) {
    if (!mouse.on) { mouse.x = x; mouse.y = y; }
    mouse.tx = x; mouse.ty = y; mouse.on = true;
  }
  function addRipple(x, y, power) {
    if (ripples.length > 5) ripples.shift();
    ripples.push({ x: x, y: y, r: 0, life: 1, power: power || 1 });
  }

  function start() {
    document.head.appendChild(bgStyle);
    document.body.insertBefore(cvs, document.body.firstChild);
    readTheme();
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function (e) { point(e.clientX, e.clientY); }, { passive: true });
    document.addEventListener('pointerleave', function () { mouse.on = false; });
    window.addEventListener('blur', function () { mouse.on = false; });
    window.addEventListener('pointerdown', function (e) { point(e.clientX, e.clientY); addRipple(e.clientX, e.clientY); }, { passive: true });
    if (isTouch) window.addEventListener('pointerup', function () { mouse.on = false; }, { passive: true });
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
