/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  PAGE TRANSITIONS                                            ║
 * ║                                                              ║
 * ║  • On every page load   → fade body in + finish progress bar ║
 * ║  • On internal link click → run progress bar + fade out,     ║
 * ║                             then navigate                    ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

(function () {
  'use strict';

  /* ── 1. CREATE THE PROGRESS BAR ─────────────────────────────── */
  const bar = document.createElement('div');
  bar.id = 'page-progress';
  bar.setAttribute('aria-hidden', 'true');
  // Inject BEFORE any other child so it sits on top
  document.documentElement.insertBefore(bar, document.documentElement.firstChild);

  /* ── 2. PROGRESS BAR HELPERS ────────────────────────────────── */
  let rafId = null;

  function setWidth(pct, animated) {
    bar.style.transition = animated ? 'width 0.25s ease, opacity 0.3s ease' : 'none';
    bar.style.width = pct + '%';
  }

  function showBar() {
    bar.style.opacity = '1';
    setWidth(0, false);          // start at 0 instantly
    // micro-tick so the browser registers the 0% before we animate
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setWidth(65, true))  // fast run to 65%
    );
  }

  function finishBar() {
    setWidth(100, true);
    // After reaching 100, fade the bar out
    clearTimeout(rafId);
    rafId = setTimeout(() => {
      bar.style.transition = 'opacity 0.3s ease';
      bar.style.opacity = '0';
      // Reset width invisibly after fade
      setTimeout(() => setWidth(0, false), 350);
    }, 260);
  }

  /* ── 3. PAGE ENTER — fade body in ───────────────────────────── */
  // The body starts at opacity:0 (set in style.css via .page-loading).
  // We remove that class once the page is interactive.
  document.documentElement.classList.add('page-loading');

  window.addEventListener('pageshow', () => {
    // pageshow fires on both fresh loads and bfcache restores
    showBar();
    // Give the browser one frame to paint, then reveal
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('page-loading');
        finishBar();
      })
    );
  });

  /* ── 4. PAGE EXIT — intercept internal <a> clicks ───────────── */
  document.addEventListener('click', (e) => {
    // Walk up the DOM to find an <a> in case the click hit a child element
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Skip: external links, anchors (#), new-tab, download, JS void
    const isExternal =
      anchor.hostname && anchor.hostname !== location.hostname;
    const isHashOnly  = href.startsWith('#');
    const isNewTab    = anchor.target === '_blank';
    const isDownload  = anchor.hasAttribute('download');
    const isJsVoid    = href.startsWith('javascript:');

    if (isExternal || isHashOnly || isNewTab || isDownload || isJsVoid) return;

    // It's an internal page navigation — animate before leaving
    e.preventDefault();

    showBar();

    // Fade the body out
    document.documentElement.classList.add('page-loading');

    // Delay navigation until the bar is partway and the fade starts
    setTimeout(() => {
      window.location.href = href;
    }, 220);
  });

})();
