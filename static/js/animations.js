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
  // 5. CAR SCROLL EXPERIENCE (FROM RACE CALENDAR TO START OF VIDEO SECTION)
  // Car is active & moves with scroll through Races, Sponsor CTA, and News.
  // The moment the Video section (#film) starts, car movement stops and car disappears.
  // --------------------------------------------------------------------------
  const carZone = document.getElementById('carScrollZone') || document.querySelector('.car-scroll-zone');
  const filmSection = document.getElementById('film') || document.querySelector('.section-video-showcase');
  const agendaStickyWrapper = document.getElementById('agendaStickyWrapper') || document.querySelector('.agenda_sticky_wrapper');
  const agendaCar = document.getElementById('agendaCarImage') || document.querySelector('[data-agenda="car"]');
  const agendaSticky = document.getElementById('agendaSticky') || document.querySelector('.agenda_sticky');
  const agendaItems = gsap.utils.toArray('[data-agenda="item"]');

  if (carZone && agendaCar && agendaStickyWrapper) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper to toggle active state of car
    function setCarActive(active) {
      if (active) {
        agendaStickyWrapper.classList.add('is-active');
        if (typeof gsap !== 'undefined') {
          gsap.to(agendaCar, { autoAlpha: 1, duration: 0.2, overwrite: 'auto' });
        } else {
          agendaCar.style.opacity = '1';
          agendaCar.style.visibility = 'visible';
        }
      } else {
        agendaStickyWrapper.classList.remove('is-active');
        if (typeof gsap !== 'undefined') {
          gsap.to(agendaCar, { autoAlpha: 0, duration: 0.15, overwrite: 'auto' });
        } else {
          agendaCar.style.opacity = '0';
          agendaCar.style.visibility = 'hidden';
        }
      }
    }

    // Boundary enforcement:
    // 1. Car starts when entering carZone (Race Calendar, top <= window.innerHeight * 0.45)
    // 2. Car MUST STOP the moment the Video section (#film) starts (filmRect.top <= window.innerHeight * 0.98)
    // 3. Car must NEVER be visible in Video, Gallery, Contact, or Footer
    // 4. Car must NEVER be visible before Race Calendar (Hero, Statement, Helmet, Timeline)
    function enforceCarBoundaries() {
      const zoneRect = carZone.getBoundingClientRect();
      const filmRect = filmSection ? filmSection.getBoundingClientRect() : null;
      const vh = window.innerHeight;

      // Has the video section started entering the screen?
      const filmStarted = filmRect ? (filmRect.top <= vh * 0.98) : (zoneRect.bottom <= vh * 0.5);

      // Has the user scrolled past the entire car zone?
      const zoneExited = zoneRect.bottom <= 0;

      // Is the user above the car zone?
      const aboveZone = zoneRect.top > vh * 0.45;

      if (filmStarted || zoneExited || aboveZone) {
        setCarActive(false);
      } else {
        setCarActive(true);
      }
    }

    window.addEventListener('scroll', enforceCarBoundaries, { passive: true });
    window.addEventListener('resize', enforceCarBoundaries, { passive: true });

    // Video Section direct observer: the instant video section starts, stop car movement!
    if (filmSection && 'IntersectionObserver' in window) {
      const filmObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCarActive(false);
          } else {
            enforceCarBoundaries();
          }
        });
      }, { threshold: [0, 0.05, 0.1] });
      filmObserver.observe(filmSection);

      // Also observe downstream sections to ensure car stays 100% stopped & hidden
      const postVideoSections = document.querySelectorAll('#gallery, #contact, footer');
      postVideoSections.forEach(sec => filmObserver.observe(sec));
    }

    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
      // ScrollTrigger for car zone:
      // Controls the car movement from entry of carZone until start of Video section
      ScrollTrigger.create({
        trigger: carZone,
        start: 'top 45%',
        end: () => filmSection ? 'bottom bottom' : 'bottom bottom',
        onEnter: () => enforceCarBoundaries(),
        onLeave: () => setCarActive(false),
        onEnterBack: () => enforceCarBoundaries(),
        onLeaveBack: () => setCarActive(false),
        onUpdate: (self) => {
          enforceCarBoundaries();
          const p = self.progress;
          // Steering micro-rotation along the track as user scrolls
          if (p > 0.01 && p < 0.98) {
            const steerAngle = Math.sin(p * Math.PI * 6) * 1.8;
            gsap.set(agendaCar, { rotation: steerAngle });
          }
        }
      });

      // Video section entrance trigger: guarantee car stops moving the second video starts
      if (filmSection) {
        ScrollTrigger.create({
          trigger: filmSection,
          start: 'top bottom', // The moment the top of the video section hits the bottom of the viewport
          end: 'bottom top',
          onEnter: () => setCarActive(false),
          onEnterBack: () => setCarActive(false),
          onLeaveBack: () => enforceCarBoundaries()
        });
      }

      // Sequential yellow highlighting of race items in #races
      if (agendaItems.length > 0) {
        const highlightColor = '#fed60a';
        const yellowDuration = 0.22;
        const resetDuration = 0.55;

        agendaItems.forEach((item) => {
          const line = item.querySelector('[data-agenda="line"]');
          const origColor = gsap.getProperty(item, 'color') || '#ffffff';
          const origBg = line ? (gsap.getProperty(line, 'backgroundColor') || 'rgba(255,255,255,0.15)') : null;

          const onEnter = () => {
            gsap.to(item, { color: highlightColor, duration: yellowDuration, ease: 'power2.out', overwrite: 'auto' });
            if (line) gsap.to(line, { backgroundColor: highlightColor, duration: yellowDuration, ease: 'power2.out', overwrite: 'auto' });
            item.classList.add('is-active');
          };

          const onLeave = () => {
            gsap.to(item, { color: origColor, duration: resetDuration, ease: 'power2.inOut', overwrite: 'auto' });
            if (line) gsap.to(line, { backgroundColor: origBg, duration: resetDuration, ease: 'power2.inOut', overwrite: 'auto' });
            item.classList.remove('is-active');
          };

          ScrollTrigger.create({
            trigger: item,
            start: 'top 52%',
            end: 'bottom 48%',
            onEnter: onEnter,
            onLeave: onLeave,
            onEnterBack: onEnter,
            onLeaveBack: onLeave
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
      }

      ScrollTrigger.addEventListener('refresh', enforceCarBoundaries);
      enforceCarBoundaries();
      window.addEventListener('load', () => {
        ScrollTrigger.refresh();
        enforceCarBoundaries();
      });
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
  // SPRINT 2: VIDEO SHOWCASE CONTROLS & RACE REEL SWITCHER
  // Features real Max Verstappen race win (Abu Dhabi 2021) & controversial races (Saudi Arabia, Silverstone)
  // Full audio management with volume slider, live telemetry HUD, and seamless unmuting
  // --------------------------------------------------------------------------
  const videoEl = document.getElementById('showcaseVideoEl');
  const mediaWrap = document.querySelector('.video-showcase-media');
  const centerControls = document.getElementById('videoCenterControls');
  const soundToggleBtn = document.getElementById('videoSoundToggleBtn');
  const audioHud = document.getElementById('videoAudioHud');
  const videoTabs = document.querySelectorAll('.video-reel-tab');
  const posterImg = document.getElementById('showcasePosterImg');
  const telemetryText = document.getElementById('videoTelemetryText');
  const captionBadge = document.getElementById('videoCaptionBadge');
  const captionHeadline = document.getElementById('videoCaptionHeadline');
  const captionDesc = document.getElementById('videoCaptionDesc');
  const playPauseBtn = document.getElementById('videoPlayPauseBtn');
  const fullscreenBtn = document.getElementById('videoFullscreenBtn');
  const volBtn = document.getElementById('videoVolumeBtn');
  const volSlider = document.getElementById('videoVolumeSlider');
  const volLevel = document.getElementById('videoVolumeLevel');

  if (videoEl) {
    let isAudioEnabled = false;
    let currentVolume = 1.0;

    // Master Audio UI & State Sync function
    const updateAudioUI = (enabled, vol) => {
      if (vol !== undefined) {
        currentVolume = Math.max(0, Math.min(1, vol));
      }
      isAudioEnabled = enabled;

      // Apply to video DOM element
      if (isAudioEnabled && currentVolume > 0) {
        videoEl.muted = false;
        videoEl.volume = currentVolume;
        videoEl.removeAttribute('muted');
      } else {
        videoEl.muted = true;
      }

      const percent = Math.round(currentVolume * 100);

      // 1. Center Unmute Banner
      if (centerControls) {
        if (isAudioEnabled && currentVolume > 0) {
          centerControls.classList.add('is-audio-on');
        } else {
          centerControls.classList.remove('is-audio-on');
        }
      }

      if (soundToggleBtn) {
        const soundMutedIcon = soundToggleBtn.querySelector('.sound-icon-muted');
        const soundActiveIcon = soundToggleBtn.querySelector('.sound-icon-active');
        const headline = soundToggleBtn.querySelector('.sound-toggle-headline');
        const badge = soundToggleBtn.querySelector('.sound-toggle-badge');
        if (soundMutedIcon) soundMutedIcon.style.display = (isAudioEnabled && currentVolume > 0) ? 'none' : 'block';
        if (soundActiveIcon) soundActiveIcon.style.display = (isAudioEnabled && currentVolume > 0) ? 'block' : 'none';
        if (headline) headline.textContent = (isAudioEnabled && currentVolume > 0) ? 'AUDIO LIVE' : 'UNMUTE BROADCAST AUDIO';
        if (badge) badge.textContent = (isAudioEnabled && currentVolume > 0) ? '🔊 ON' : '🔊 SOUND ON';
      }

      // 2. Top-Right Audio Telemetry HUD
      if (audioHud) {
        const audioHudText = document.getElementById('audioHudText');
        const audioHudWaves = document.getElementById('audioHudWaves');
        if (isAudioEnabled && currentVolume > 0) {
          audioHud.classList.add('is-audio-live');
          if (audioHudText) audioHudText.textContent = `AUDIO: LIVE // ${percent}%`;
          if (audioHudWaves) audioHudWaves.style.display = 'inline-flex';
        } else {
          audioHud.classList.remove('is-audio-live');
          if (audioHudText) audioHudText.textContent = 'AUDIO: MUTED (CLICK TO UNMUTE)';
          if (audioHudWaves) audioHudWaves.style.display = 'none';
        }
      }

      // 3. Action Bar Volume Controls
      if (volBtn) {
        const volMutedIcon = volBtn.querySelector('.vol-icon-muted');
        const volActiveIcon = volBtn.querySelector('.vol-icon-active');
        if (volMutedIcon) volMutedIcon.style.display = (isAudioEnabled && currentVolume > 0) ? 'none' : 'block';
        if (volActiveIcon) volActiveIcon.style.display = (isAudioEnabled && currentVolume > 0) ? 'block' : 'none';
      }
      if (volSlider) {
        volSlider.value = (isAudioEnabled && currentVolume > 0) ? currentVolume : 0;
      }
      if (volLevel) {
        volLevel.textContent = (isAudioEnabled && currentVolume > 0) ? `${percent}%` : '0%';
      }
    };

    // Helper to turn on audio and play
    const enableAndPlayAudio = (targetVolume = 1.0) => {
      updateAudioUI(true, targetVolume);
      const promise = videoEl.play();
      if (promise !== undefined) {
        promise.catch(err => {
          console.warn('Audio play request handled:', err);
        });
      }
    };

    // 1. Race Moment Switcher Tabs
    if (videoTabs.length > 0) {
      videoTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          if (tab.classList.contains('is-active')) return;

          // Update tabs state
          videoTabs.forEach(t => {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');

          // Extract data attributes
          const videoSrc = tab.getAttribute('data-video-src');
          const posterSrc = tab.getAttribute('data-poster');
          const telemetry = tab.getAttribute('data-telemetry');
          const headline = tab.getAttribute('data-headline');
          const caption = tab.getAttribute('data-caption');
          const badge = tab.getAttribute('data-badge');

          // Automatically enable audio on tab click (user interaction gesture)
          isAudioEnabled = true;

          // Smooth fade transition
          if (typeof gsap !== 'undefined') {
            gsap.to(videoEl, {
              opacity: 0.3,
              duration: 0.2,
              onComplete: () => {
                videoEl.src = videoSrc;
                if (posterSrc) {
                  videoEl.poster = posterSrc;
                  if (posterImg) posterImg.src = posterSrc;
                }
                videoEl.load();

                // Re-enforce audio state after video element load
                videoEl.muted = false;
                videoEl.volume = currentVolume;
                videoEl.removeAttribute('muted');
                updateAudioUI(true, currentVolume);

                const playPromise = videoEl.play();
                if (playPromise !== undefined) {
                  playPromise.catch(() => {});
                }
                gsap.to(videoEl, { opacity: 1, duration: 0.35 });
              }
            });
          } else {
            videoEl.src = videoSrc;
            if (posterSrc) {
              videoEl.poster = posterSrc;
              if (posterImg) posterImg.src = posterSrc;
            }
            videoEl.load();
            videoEl.muted = false;
            videoEl.volume = currentVolume;
            videoEl.removeAttribute('muted');
            updateAudioUI(true, currentVolume);
            videoEl.play().catch(() => {});
          }

          // Update overlays
          if (telemetryText && telemetry) telemetryText.textContent = telemetry;
          if (captionBadge && badge) captionBadge.textContent = badge;
          if (captionHeadline && headline) captionHeadline.textContent = headline;
          if (captionDesc && caption) captionDesc.textContent = caption;

          // Update play button icon
          if (playPauseBtn) {
            const pauseIcon = playPauseBtn.querySelector('.action-icon-pause');
            const playIcon = playPauseBtn.querySelector('.action-icon-play');
            if (pauseIcon) pauseIcon.style.display = 'block';
            if (playIcon) playIcon.style.display = 'none';
          }
        });
      });
    }

    // 2. Play/Pause Action Button
    if (playPauseBtn) {
      const pauseIcon = playPauseBtn.querySelector('.action-icon-pause');
      const playIcon = playPauseBtn.querySelector('.action-icon-play');

      playPauseBtn.addEventListener('click', () => {
        if (videoEl.paused) {
          videoEl.play().catch(() => {});
          if (pauseIcon) pauseIcon.style.display = 'block';
          if (playIcon) playIcon.style.display = 'none';
          if (mediaWrap) mediaWrap.classList.remove('is-paused');
        } else {
          videoEl.pause();
          if (pauseIcon) pauseIcon.style.display = 'none';
          if (playIcon) playIcon.style.display = 'block';
          if (mediaWrap) mediaWrap.classList.add('is-paused');
        }
      });
    }

    // Video element native play/pause event hooks
    videoEl.addEventListener('play', () => {
      if (mediaWrap) mediaWrap.classList.remove('is-paused');
      if (playPauseBtn) {
        const pauseIcon = playPauseBtn.querySelector('.action-icon-pause');
        const playIcon = playPauseBtn.querySelector('.action-icon-play');
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (playIcon) playIcon.style.display = 'none';
      }
    });

    videoEl.addEventListener('pause', () => {
      if (mediaWrap) mediaWrap.classList.add('is-paused');
      if (playPauseBtn) {
        const pauseIcon = playPauseBtn.querySelector('.action-icon-pause');
        const playIcon = playPauseBtn.querySelector('.action-icon-play');
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (playIcon) playIcon.style.display = 'block';
      }
    });

    // 3. Fullscreen Action Button
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const wrapper = document.querySelector('.video-showcase-wrapper') || videoEl;
        if (!document.fullscreenElement) {
          if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen().catch(() => {});
          } else if (videoEl.webkitEnterFullscreen) {
            videoEl.webkitEnterFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      });
    }

    // 4. Center Sound Toggle Button
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (videoEl.muted || !isAudioEnabled) {
          enableAndPlayAudio(1.0);
        } else {
          updateAudioUI(false);
        }
      });
    }

    // 5. Top-Right Audio HUD click to toggle
    if (audioHud) {
      audioHud.addEventListener('click', (e) => {
        e.stopPropagation();
        if (videoEl.muted || !isAudioEnabled) {
          enableAndPlayAudio(1.0);
        } else {
          updateAudioUI(false);
        }
      });
    }

    // 6. Action Bar Volume Button click to toggle
    if (volBtn) {
      volBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (videoEl.muted || !isAudioEnabled) {
          enableAndPlayAudio(currentVolume > 0 ? currentVolume : 1.0);
        } else {
          updateAudioUI(false);
        }
      });
    }

    // 7. Volume Slider
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const val = parseFloat(volSlider.value);
        if (val === 0) {
          updateAudioUI(false, 0);
        } else {
          updateAudioUI(true, val);
          if (videoEl.paused) {
            videoEl.play().catch(() => {});
          }
        }
      });
    }

    // 8. Direct click on video media player to unmute or toggle play/pause
    if (mediaWrap) {
      mediaWrap.addEventListener('click', (e) => {
        // Prevent click when tapping controls, buttons, or slider
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.video-reel-tab')) {
          return;
        }

        // If audio is currently muted, clicking the player un-mutes it
        if (videoEl.muted || !isAudioEnabled) {
          enableAndPlayAudio(1.0);
        } else {
          // If already unmuted, clicking video toggles play/pause
          if (videoEl.paused) {
            videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
          }
        }
      });
    }

    // Initial check: ensure muted autoplay begins smoothly
    if (videoEl.paused) {
      videoEl.play().catch(() => {});
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

  if (progressSection && !prefersReduced && typeof ScrollTrigger !== 'undefined') {
    if (cardTopLeft) {
      gsap.to(cardTopLeft, {
        scrollTrigger: {
          trigger: progressSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: -50,
        rotation: -2,
        ease: 'none'
      });
    }
    if (cardBottomRight) {
      gsap.to(cardBottomRight, {
        scrollTrigger: {
          trigger: progressSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: 40,
        rotation: 2,
        ease: 'none'
      });
    }
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

