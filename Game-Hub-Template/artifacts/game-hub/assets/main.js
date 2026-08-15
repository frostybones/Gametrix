/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  GAME HUB — SHARED JAVASCRIPT (homepage)                     ║
 * ║                                                              ║
 * ║  This file handles:                                          ║
 * ║   • Card entrance animations (IntersectionObserver)          ║
 * ║   • Dynamic glow colour per card (from data-color attr)      ║
 * ║   • Smooth-scroll anchor for the "Browse Games" button       ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

(function () {
  'use strict';

  /* ─── 1. CARD ENTRANCE ANIMATIONS ─────────────────────────── */
  // Each .game-card starts opacity:0 / translateY(24px) in the CSS.
  // When the card enters the viewport we add .card--visible to
  // fade it in with a staggered delay.

  const cards = document.querySelectorAll('.game-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small stagger based on the card's position in the grid
            const index = [...cards].indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 80}ms`;
            entry.target.classList.add('card--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
  } else {
    // Fallback: show all cards immediately for older browsers
    cards.forEach((card) => card.classList.add('card--visible'));
  }


  /* ─── 2. DYNAMIC GLOW COLOUR PER CARD ─────────────────────── */
  // Each <article class="game-card"> can carry a data-color attribute
  // (e.g. data-color="#7c3aed").  We read that value and inject a
  // CSS custom property so the hover glow matches the card's accent.
  //
  // To change a card's glow colour, just change its data-color value
  // in index.html — no JS edits needed.

  cards.forEach((card) => {
    const color = card.dataset.color;
    if (!color) return;

    // Build a translucent version of the colour for the glow
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const glowColor = `rgba(${r}, ${g}, ${b}, 0.25)`;

    // Inject into the card's style so the hover rule can use it
    card.style.setProperty('--card-accent',      color);
    card.style.setProperty('--card-accent-glow', glowColor);

    // Override the hover box-shadow with this card's specific colour
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = [
        `0 0 0 1px ${color}`,
        `0 8px 40px ${glowColor}`,
        `0 20px 60px rgba(0, 0, 0, 0.5)`,
      ].join(', ');
      card.style.borderColor = color;
    });

    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.borderColor = '';
    });

    // Also tint the thumbnail background to the card's accent colour
    const thumb = card.querySelector('.card-thumb');
    if (thumb) {
      thumb.style.background =
        `linear-gradient(135deg, ${color}33 0%, #0d0d1a 100%)`;
    }
  });


  /* ─── 3. ACTIVE NAV LINK ───────────────────────────────────── */
  // Highlight the nav link whose hash matches the current scroll
  // position (basic active-state tracking).

  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (navLinks.length > 0 && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.style.color =
                link.getAttribute('href') === `#${id}`
                  ? 'var(--color-text)'
                  : '';
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('section[id], main[id]').forEach((sec) =>
      sectionObserver.observe(sec)
    );
  }

})();
