/**
 * MAX VERSTAPPEN — GSAP & SCROLLTRIGGER ANIMATION ENGINE
 * Syncs with Lenis smooth scroll for cinema-grade motion fidelity.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    window.lenis = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.warn("GSAP not loaded. Running fallback visual reveals.");
    document.querySelectorAll('.reveal-fade').forEach(el => el.classList.add('is-inview'));
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 2. Cinematic Hero Sequence
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (document.querySelector('.hero-section')) {
    heroTl
      .from('.hero-bg-image', {
        scale: 1.2,
        duration: 1.8,
        ease: 'power2.out',
      })
      .from('.hero-telemetry-row', {
        opacity: 0,
        y: 20,
        duration: 0.8,
      }, '-=1.2')
      .from('.hero-driver-title .first-name', {
        opacity: 0,
        y: 50,
        duration: 0.9,
      }, '-=0.7')
      .from('.hero-driver-title .last-name', {
        opacity: 0,
        y: 60,
        duration: 1.0,
      }, '-=0.8')
      .from('.hero-bottom-grid', {
        opacity: 0,
        y: 30,
        duration: 0.8,
      }, '-=0.6');

    // Hero Parallax on Scroll
    gsap.to('.hero-bg-image', {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      yPercent: 25,
      scale: 1.12,
      opacity: 0.4,
    });

    if (document.querySelector('.partners_section_light')) {
      gsap.to('.partners_center_helmet', {
        scrollTrigger: { trigger: '.partners_section_light', start: 'top bottom', end: 'bottom top', scrub: 1 },
        yPercent: -15, rotation: 2, ease: 'none'
      });
    }
  }

  // 3. Counter Animation (Odometer)
  const counterElements = document.querySelectorAll('.stat-number-val');
  counterElements.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10) || 0;

    gsap.fromTo(counter,
      { innerHTML: 0 },
      {
        innerHTML: target,
        duration: 2.2,
        ease: 'power2.out',
        snap: { innerHTML: 1 },
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });

  // 4. Career Story / Timeline Vertical Scroll & Pinned Viewport Sync
  const aboutSection = document.querySelector('.section_about');
  const stickyViewport = document.querySelector('.about_sticky_viewport');

  if (aboutSection && typeof gsap !== 'undefined') {
    const aboutImages = gsap.utils.toArray('[data-about-image]');
    const aboutTitles = gsap.utils.toArray('[data-about-title-item]');
    const aboutContents = gsap.utils.toArray('[data-about-content-item]');
    const countEl = aboutSection.querySelector('[data-about-count="count"]');
    const totalEl = aboutSection.querySelector('[data-about-count="total"]');
    const skipBtn = document.getElementById('storySkipBtn');

    if (totalEl && aboutImages.length) {
      totalEl.textContent = aboutImages.length;
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#races');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Pin the viewport overlay across the section
    if (stickyViewport && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyViewport,
        pinSpacing: false
      });
    }

    let currentIndex = -1;

    const updateActiveSlide = (force = false) => {
      const triggerY = window.innerHeight * 0.5;
      let newIndex = 0;

      aboutImages.forEach((imgEl, idx) => {
        const rect = imgEl.getBoundingClientRect();
        if (rect.top <= triggerY) {
          newIndex = idx;
        }
      });

      if (newIndex !== currentIndex || force) {
        currentIndex = newIndex;

        // Update active image styles
        aboutImages.forEach((imgEl, idx) => {
          const isActive = idx === currentIndex;
          imgEl.classList.toggle('is-active', isActive);
          gsap.to(imgEl, {
            opacity: isActive ? 1 : 0.2,
            filter: isActive ? 'saturate(1)' : 'saturate(0)',
            scale: isActive ? 1 : 0.96,
            duration: force ? 0 : 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        // Update titles with clean fade and slight vertical shift
        aboutTitles.forEach((titleEl, idx) => {
          const isActive = idx === currentIndex;
          titleEl.classList.toggle('is-active', isActive);
          gsap.to(titleEl, {
            autoAlpha: isActive ? 1 : 0,
            y: isActive ? 0 : (idx < currentIndex ? -20 : 20),
            duration: force ? 0 : 0.45,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        // Update content paragraphs
        aboutContents.forEach((contentEl, idx) => {
          const isActive = idx === currentIndex;
          contentEl.classList.toggle('is-active', isActive);
          gsap.to(contentEl, {
            autoAlpha: isActive ? 1 : 0,
            y: isActive ? 0 : (idx < currentIndex ? -15 : 15),
            duration: force ? 0 : 0.45,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        // Update count indicator
        if (countEl) {
          countEl.textContent = currentIndex + 1;
        }
      }
    };

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: () => updateActiveSlide(false),
        onRefresh: () => updateActiveSlide(true)
      });
    } else {
      window.addEventListener('scroll', () => updateActiveSlide(false), { passive: true });
    }

    // Initial run
    updateActiveSlide(true);
  }

  // --------------------------------------------------------------------------
  // 5. RACE CALENDAR & MOVEABLE CAR (100% Exact Nick Ho Motorsports Recreation)
  // https://nickho-motorsports.nl/
  // --------------------------------------------------------------------------
  const agendaSection = document.querySelector('.section_agenda');
  const agendaCar = document.querySelector('[data-agenda="car"]');
  const agendaStart = document.querySelector('[data-agenda="start"]');
  const agendaEnd = document.querySelector('[data-agenda="end"]');
  const agendaSticky = document.querySelector('.agenda_sticky');
  const agendaItems = gsap.utils.toArray('[data-agenda="item"]');

  if (agendaSection && agendaCar && agendaStart && agendaEnd && agendaItems.length > 0) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
      const config = {
        carInDuration: 0.8,
        carInEase: 'expo.out',
        carOutDuration: 0.8,
        carOutEase: 'expo.in',
        carStart: 'top center',
        carEnd: 'bottom center',
        highlightColor: '#fed60a',
        yellowDuration: 0.2,
        yellowEase: 'power2.out',
        resetDuration: 0.6,
        resetEase: 'power2.inOut',
        itemStart: 'top center',
        itemEnd: 'bottom center',
        debug: false
      };

      const vh = (pct) => window.innerHeight * (pct / 100);
      let carTween = null;
      let carState = 'above';

      function tweenCar(targetY, duration, ease, onComplete) {
        if (carTween) carTween.kill();
        carTween = gsap.to(agendaCar, {
          y: targetY,
          duration: duration,
          ease: ease,
          force3D: true,
          overwrite: true,
          onComplete: onComplete || null
        });
        return carTween;
      }

      function checkCarPosition() {
        if (carTween && carTween.isActive()) return;
        const mid = window.innerHeight / 2;
        const topStart = agendaStart.getBoundingClientRect().top;
        const topEnd = agendaEnd.getBoundingClientRect().top;

        let currentState;
        if (topStart > mid) {
          currentState = 'above';
        } else if (topEnd > mid) {
          currentState = 'in';
        } else {
          currentState = 'below';
        }

        if (currentState !== carState) {
          carState = currentState;
          if (currentState === 'above') {
            gsap.set(agendaCar, { y: -vh(100), rotation: 0, autoAlpha: 0 });
          } else if (currentState === 'below') {
            gsap.set(agendaCar, { y: vh(100), rotation: 0, autoAlpha: 0 });
          } else {
            gsap.set(agendaCar, { y: 0, rotation: 0, autoAlpha: 1 });
          }
        }
      }

      // Initial placement: car hidden off-screen above
      gsap.set(agendaCar, {
        y: -vh(100),
        rotation: 0,
        autoAlpha: 0,
        force3D: true,
        willChange: 'transform'
      });

      // Actions on scroll trigger boundary crossings
      const enterCar = () => {
        carState = 'in';
        gsap.set(agendaCar, { autoAlpha: 1 });
        tweenCar(0, config.carInDuration, config.carInEase);
      };

      const exitCarBelow = () => {
        carState = 'below';
        tweenCar(vh(100), config.carOutDuration, config.carOutEase, () => {
          gsap.set(agendaCar, { autoAlpha: 0 });
        });
      };

      const exitCarAbove = () => {
        carState = 'above';
        tweenCar(-vh(100), config.carOutDuration, config.carOutEase, () => {
          gsap.set(agendaCar, { autoAlpha: 0 });
        });
      };

      // Entrance trigger: car enters from above when section reaches center
      ScrollTrigger.create({
        trigger: agendaStart,
        start: config.carStart,
        onEnter: enterCar,
        onLeaveBack: exitCarAbove,
        markers: config.debug
      });

      // Exit trigger: car exits below when calendar end reaches center
      ScrollTrigger.create({
        trigger: agendaEnd,
        start: config.carEnd,
        onEnter: exitCarBelow,
        onLeaveBack: enterCar,
        markers: config.debug
      });

      // Subtle parallax on the sticky car layer while scrolling calendar
      if (agendaSticky) {
        gsap.fromTo(agendaSticky,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: agendaSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }

      // Race items yellow highlighting as each item glides past screen center
      agendaItems.forEach((item) => {
        const line = item.querySelector('[data-agenda="line"]');
        const origColor = gsap.getProperty(item, 'color') || '#ffffff';
        const origBg = line ? (gsap.getProperty(line, 'backgroundColor') || 'rgba(255,255,255,0.15)') : null;

        const onEnter = () => {
          gsap.to(item, { color: config.highlightColor, duration: config.yellowDuration, ease: config.yellowEase, overwrite: 'auto' });
          if (line) gsap.to(line, { backgroundColor: config.highlightColor, duration: config.yellowDuration, ease: config.yellowEase, overwrite: 'auto' });
          item.classList.add('is-active');
        };

        const onLeave = () => {
          gsap.to(item, { color: origColor, duration: config.resetDuration, ease: config.resetEase, overwrite: 'auto' });
          if (line) gsap.to(line, { backgroundColor: origBg, duration: config.resetDuration, ease: config.resetEase, overwrite: 'auto' });
          item.classList.remove('is-active');
        };

        ScrollTrigger.create({
          trigger: item,
          start: config.itemStart,
          end: config.itemEnd,
          onEnter: onEnter,
          onLeave: onLeave,
          onEnterBack: onEnter,
          onLeaveBack: onLeave,
          markers: config.debug
        });

        // Hover support
        item.addEventListener('mouseenter', () => {
          item.classList.add('is-active');
        });
        item.addEventListener('mouseleave', () => {
          const rect = item.getBoundingClientRect();
          const mid = window.innerHeight / 2;
          if (rect.top > mid || rect.bottom < mid) {
            item.classList.remove('is-active');
          }
        });
      });

      ScrollTrigger.addEventListener('refresh', checkCarPosition);
      checkCarPosition();
      window.addEventListener('load', () => ScrollTrigger.refresh());
    }
  }

  // 5. Section Headers & Cards Reveal
  const revealCards = document.querySelectorAll('.pillar-card, .news-card, .partner-tile, .calendar-row');
  if (revealCards.length > 0) {
    ScrollTrigger.batch(revealCards, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => {
        gsap.from(batch, {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    });
  }

  // 6. Custom Magnetic Dot Cursor (Desktop Only)
  const cursor = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');

  if (cursor && cursorFollower && window.innerWidth > 1024) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const hoverables = document.querySelectorAll('a, button, .gallery-tile, .stat-box, .pillar-card, .btn, .media-nav-btn, .gallery-nav-btn, .gallery-arc-card, .btn-sponsor-guide, .btn-video-sound-toggle');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
      });
    });
  }

  // --------------------------------------------------------------------------
  // SPRINT 2: MEDIA & ARTICLES HORIZONTAL SLIDER
  // --------------------------------------------------------------------------
  const mediaArticlesSlider = document.getElementById('mediaArticlesSlider');
  const mediaPrevBtn = document.getElementById('mediaArticlesPrev');
  const mediaNextBtn = document.getElementById('mediaArticlesNext');

  if (mediaArticlesSlider && mediaPrevBtn && mediaNextBtn) {
    const scrollStep = 380;
    mediaPrevBtn.addEventListener('click', () => {
      mediaArticlesSlider.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
    mediaNextBtn.addEventListener('click', () => {
      mediaArticlesSlider.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });

    // Parallax watermark on scroll
    const mediaWatermark = document.querySelector('.media-articles-watermark');
    if (mediaWatermark && typeof ScrollTrigger !== 'undefined') {
      gsap.to(mediaWatermark, {
        scrollTrigger: {
          trigger: '.section-media-articles',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        xPercent: -5,
        ease: 'none'
      });
    }
  }

  // --------------------------------------------------------------------------
  // SPRINT 2: VIDEO SHOWCASE SOUND TOGGLE
  // --------------------------------------------------------------------------
  const videoEl = document.getElementById('showcaseVideoEl');
  const soundToggleBtn = document.getElementById('videoSoundToggleBtn');
  if (videoEl && soundToggleBtn) {
    const iconMuted = soundToggleBtn.querySelector('.sound-icon-muted');
    const iconActive = soundToggleBtn.querySelector('.sound-icon-active');
    const label = soundToggleBtn.querySelector('.sound-toggle-label');

    soundToggleBtn.addEventListener('click', () => {
      if (videoEl.muted) {
        videoEl.muted = false;
        videoEl.volume = 0.85;
        videoEl.play().catch(e => console.warn('Video play error:', e));
        if (iconMuted) iconMuted.style.display = 'none';
        if (iconActive) iconActive.style.display = 'block';
        if (label) label.textContent = 'SOUND OFF';
        soundToggleBtn.classList.add('is-active');
      } else {
        videoEl.muted = true;
        if (iconMuted) iconMuted.style.display = 'block';
        if (iconActive) iconActive.style.display = 'none';
        if (label) label.textContent = 'SOUND ON';
        soundToggleBtn.classList.remove('is-active');
      }
    });

    // Ensure muted autoplay kicks in
    if (videoEl.paused) {
      videoEl.play().catch(() => { });
    }
  }

  // --------------------------------------------------------------------------
  // SPRINT 2: GALLERY SCROLL PARALLAX (watermark only - slider handled inline)
  // --------------------------------------------------------------------------
  const galleryWatermark = document.querySelector('.photo-gallery-watermark');
  if (galleryWatermark && typeof ScrollTrigger !== 'undefined') {
    gsap.to(galleryWatermark, {
      scrollTrigger: {
        trigger: '.section-photo-gallery',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      yPercent: -10,
      ease: 'none'
    });
  }


  // --------------------------------------------------------------------------
  // DRIVEN BY PROGRESS: SCROLL-DRIVEN PINNED SECTION & HERO HELMET INTERACTION
  // (Reference: nickho-motorsports.nl pinned scroll behavior)
  // --------------------------------------------------------------------------
  const progressSection = document.querySelector('.section-driven-progress');
  const progressHelmet = document.getElementById('progressHelmet');
  const cardTopLeft = document.getElementById('progressCardTopLeft');
  const cardBottomRight = document.getElementById('progressCardBottomRight');
  const statementText = document.querySelector('.progress-big-text');
  const customCursor = document.querySelector('.custom-cursor');
  const customFollower = document.querySelector('.custom-cursor-follower');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intentional cursor state management around the pinned section
  function setCursorPinnedMode(isPinned) {
    if (!customCursor || !customFollower) return;
    if (isPinned) {
      document.body.classList.add('cursor-pinned-hidden');
      customCursor.classList.add('is-hidden');
      customFollower.classList.add('is-hidden');
    } else {
      document.body.classList.remove('cursor-pinned-hidden');
      customCursor.classList.remove('is-hidden');
      customFollower.classList.remove('is-hidden');
    }
  }

  if (progressSection && progressHelmet && !prefersReduced && typeof ScrollTrigger !== 'undefined') {
    const isMobile = window.innerWidth <= 768;
    const moveDistance = isMobile ? 110 : 165;

    // Set hardware-accelerated initial transform state
    gsap.set(progressHelmet, {
      force3D: true,
      transformPerspective: 1000
    });

    // Pinned Scroll-Driven Timeline
    const pinnedTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: progressSection,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        scrub: 0.8, // Smooth fluid linear interpolation
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onEnter: () => setCursorPinnedMode(true),
        onLeave: () => setCursorPinnedMode(false),
        onEnterBack: () => setCursorPinnedMode(true),
        onLeaveBack: () => setCursorPinnedMode(false),
        onUpdate: (self) => {
          // Safeguard: ensure cursor is hidden strictly within pinned progress
          if (self.progress > 0.02 && self.progress < 0.98) {
            if (!document.body.classList.contains('cursor-pinned-hidden')) {
              setCursorPinnedMode(true);
            }
          } else if (self.progress >= 0.98 || self.progress <= 0.02) {
            if (document.body.classList.contains('cursor-pinned-hidden')) {
              setCursorPinnedMode(false);
            }
          }
        }
      }
    });

    // 1. Helmet moves vertically DOWN smoothly in response to scroll progress
    pinnedTimeline.to(progressHelmet, {
      y: moveDistance,
      scale: 1.05,
      rotationZ: 1.5,
      ease: 'power1.inOut',
      force3D: true
    }, 0);

    // 2. Subtle background text scale & depth push
    if (statementText) {
      pinnedTimeline.to(statementText, {
        scale: 0.96,
        opacity: 0.88,
        ease: 'power1.inOut'
      }, 0);
    }

    // 3. Floating satellite cards subtle parallax depth
    if (cardTopLeft) {
      pinnedTimeline.to(cardTopLeft, {
        y: -40,
        rotation: -2,
        ease: 'none'
      }, 0);
    }

    if (cardBottomRight) {
      pinnedTimeline.to(cardBottomRight, {
        y: 35,
        rotation: 2,
        ease: 'none'
      }, 0);
    }

    // Interactive mouse tilt on the helmet during hover
    progressSection.addEventListener('mousemove', (e) => {
      const rect = progressSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(progressHelmet, {
        x: x * 25,
        rotationY: x * 15,
        rotationX: -y * 12,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    progressSection.addEventListener('mouseleave', () => {
      gsap.to(progressHelmet, {
        x: 0,
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  }

  // Ensure all ScrollTriggers are properly sorted by DOM order and refreshed
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    window.addEventListener('load', () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
  }
});

