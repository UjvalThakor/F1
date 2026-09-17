/**
 * MAX VERSTAPPEN — MAIN FRONTEND ORCHESTRATOR
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Scroll State
  const siteNav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteNav?.classList.add('scrolled');
    } else {
      siteNav?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Fullscreen Navigation Menu Overlay (Nick Ho / F1 Style)
  const navToggle = document.getElementById('navToggle');
  const fullscreenMenu = document.getElementById('fullscreenMenu');
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  const fullscreenLinks = document.querySelectorAll('.fullscreen-nav-link');

  function openFullscreenMenu() {
    if (!fullscreenMenu) return;
    fullscreenMenu.classList.add('active');
    fullscreenMenu.setAttribute('aria-hidden', 'false');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    window.lenis?.stop();
  }

  function closeFullscreenMenu() {
    if (!fullscreenMenu) return;
    fullscreenMenu.classList.remove('active');
    fullscreenMenu.setAttribute('aria-hidden', 'true');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    window.lenis?.start();
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      openFullscreenMenu();
    });
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeFullscreenMenu();
    });
  }

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenMenu?.classList.contains('active')) {
      closeFullscreenMenu();
    }
  });

  // Handle navigation link clicks with smooth scroll
  fullscreenLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || link.getAttribute('data-menu-target') || '';
      closeFullscreenMenu();

      if (href.includes('#')) {
        const hash = href.split('#')[1];
        const targetEl = document.getElementById(hash);
        if (targetEl) {
          e.preventDefault();
          setTimeout(() => {
            if (window.lenis) {
              window.lenis.scrollTo(targetEl, { offset: -40, duration: 1.2 });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }, 350);
        }
      }
    });
  });

  // 3. Cinematic Video Reel Modal
  const playVideoBtn = document.getElementById('playFilmBtn');
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoFrame = document.getElementById('videoModalIframe');

  if (playVideoBtn && videoModal && videoFrame) {
    const videoSrc = playVideoBtn.getAttribute('data-video-url');

    playVideoBtn.addEventListener('click', () => {
      // Auto append autoplay for embed
      let embedUrl = videoSrc;
      if (videoSrc.includes('youtube.com/watch?v=')) {
        const videoId = videoSrc.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      } else if (videoSrc.includes('youtu.be/')) {
        const videoId = videoSrc.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }

      videoFrame.src = embedUrl;
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    function closeVideoModal() {
      videoModal.classList.remove('active');
      videoFrame.src = '';
      document.body.style.overflow = '';
    }

    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
      }
    });
  }

  // 4. Smooth Anchor Scrolling (Lenis & GSAP compatible)
  function scrollToTarget(target) {
    if (!target) return;
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const hash = href.includes('#') ? '#' + href.split('#')[1] : null;
      if (!hash || hash === '#') return;
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        e.preventDefault();
        scrollToTarget(targetElement);
        if (history.pushState) {
          history.pushState(null, null, hash);
        }
      }
    });
  });

  // Handle direct hash navigation on page load
  if (window.location.hash) {
    const initTarget = document.querySelector(window.location.hash);
    if (initTarget) {
      setTimeout(() => {
        scrollToTarget(initTarget);
      }, 400);
    }
  }
});
