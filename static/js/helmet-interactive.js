/**
 * Nick Ho 1:1 Interactive Racing Helmet Engine
 * 
 * Recreates the exact helmet showcase behavior from nickho-motorsports.nl:
 * - 36-frame 360-degree rotational sequence rendered to sharp DPR-aware canvas
 * - Pinned sticky showcase centered between partner logo columns
 * - Continuous idle rotation with direction memory
 * - Scroll-velocity driven spin (direction & speed react to scroll physics)
 * - Pointer drag / touch scrub with inertia & grabbing cursor
 * - 3D parallax tilt responsive to cursor position
 * - GSAP ScrollTrigger scale & entry orchestration
 */

(function () {
  'use strict';

  function initHelmetShowcase() {
    const stage = document.getElementById('helmetStage');
    const partnersSection = document.getElementById('partners') || document.querySelector('[data-helmet-section]');
    if (!stage || !partnersSection) return;

    // Prevent double initialization
    if (stage.dataset.initialized === 'true') return;
    stage.dataset.initialized = 'true';

    const TOTAL_FRAMES = 36;
    const FRAME_BASE_PATH = '/static/images/helmet_360/frame_';
    const FRAME_EXT = '.webp';

    // Canvas setup
    const canvas = document.createElement('canvas');
    canvas.className = 'helmet-canvas';
    canvas.setAttribute('aria-label', '360 degree interactive racing helmet');
    stage.appendChild(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });

    // Frame preloading
    const images = new Array(TOTAL_FRAMES);
    let loadedCount = 0;
    let isFirstFrameReady = false;

    function getFrameSrc(index) {
      const padded = String(index + 1).padStart(4, '0');
      return `${FRAME_BASE_PATH}${padded}${FRAME_EXT}`;
    }

    // Load first frame with immediate priority
    const firstImg = new Image();
    firstImg.src = getFrameSrc(0);
    images[0] = firstImg;
    firstImg.onload = () => {
      isFirstFrameReady = true;
      loadedCount++;
      resizeCanvas();
      drawFrame(0);

      // Preload remaining frames progressively
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
        images[i] = img;
        img.onload = () => {
          loadedCount++;
        };
      }
    };

    // State Variables
    let currentFrame = 0; // Float 0..36
    let targetFrame = 0;
    let idleSpeed = 0.12; // Gentle continuous spin
    let idleDirection = 1;
    let momentum = 0;
    let isDragging = false;
    let dragStartX = 0;
    let lastDragX = 0;
    let lastDragTime = 0;
    let dragVelocity = 0;

    // Mouse tilt state
    let mouseX = 0;
    let mouseY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    // Scroll velocity tracking
    let lastScrollY = window.scrollY || window.pageYOffset;
    let scrollVelocity = 0;
    let isVisible = false;
    let animFrameId = null;

    // Resize & DPR Handling
    function resizeCanvas() {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const width = rect.width || 420;
      const height = rect.height || 420;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      drawCurrent();
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });

    function drawFrame(frameIdx) {
      if (!ctx || !canvas.width || !canvas.height) return;
      const safeIdx = ((Math.floor(frameIdx) % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
      const img = images[safeIdx];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (img && img.complete && img.naturalWidth > 0) {
        // High quality drawing centered with aspect ratio preservation
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Fit contain within canvas with 6% padding for shadows
        const scale = Math.min((cw * 0.90) / iw, (ch * 0.90) / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;

        ctx.drawImage(img, dx, dy, dw, dh);
      } else if (images[0] && images[0].complete && images[0].naturalWidth > 0) {
        // Fallback to first frame while loading
        const img0 = images[0];
        const scale = Math.min((canvas.width * 0.90) / img0.naturalWidth, (canvas.height * 0.90) / img0.naturalHeight);
        const dw = img0.naturalWidth * scale;
        const dh = img0.naturalHeight * scale;
        ctx.drawImage(img0, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
      }
    }

    let lastDrawnIdx = -1;
    function drawCurrent() {
      const safeIdx = ((Math.floor(currentFrame) % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
      if (safeIdx !== lastDrawnIdx) {
        drawFrame(safeIdx);
        lastDrawnIdx = safeIdx;
      }
    }

    // Scroll listener for velocity calculation
    let scrollTimeout = null;
    window.addEventListener('scroll', () => {
      const nowScrollY = window.scrollY || window.pageYOffset;
      const delta = nowScrollY - lastScrollY;
      lastScrollY = nowScrollY;

      // Add scroll impulse to helmet spin
      if (Math.abs(delta) > 0.5) {
        scrollVelocity = delta * 0.055;
        if (Math.abs(scrollVelocity) > 0.01) {
          idleDirection = scrollVelocity > 0 ? 1 : -1;
        }
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollVelocity = 0;
      }, 100);
    }, { passive: true });

    // Pointer Drag & Scrubbing
    function onPointerDown(e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDragging = true;
      dragStartX = e.clientX;
      lastDragX = e.clientX;
      lastDragTime = performance.now();
      dragVelocity = 0;
      stage.classList.add('is-grabbing');

      if (stage.setPointerCapture) {
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
      }
    }

    function onPointerMove(e) {
      // Always track mouse for 3D parallax tilt
      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX = (e.clientX - centerX) / (window.innerWidth / 2);
      mouseY = (e.clientY - centerY) / (window.innerHeight / 2);

      if (!isDragging) return;

      const now = performance.now();
      const deltaX = e.clientX - lastDragX;
      const dt = Math.max(now - lastDragTime, 1);

      // Scrub frames: 10px = 1 frame
      const frameDelta = (deltaX / 12);
      currentFrame -= frameDelta;
      dragVelocity = -frameDelta / (dt / 16.67);

      if (Math.abs(dragVelocity) > 0.02) {
        idleDirection = dragVelocity > 0 ? 1 : -1;
      }

      lastDragX = e.clientX;
      lastDragTime = now;
      drawCurrent();
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove('is-grabbing');

      // Transfer drag velocity to momentum
      momentum = Math.max(Math.min(dragVelocity * 1.2, 1.8), -1.8);

      if (stage.releasePointerCapture) {
        try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    }

    stage.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    // GSAP ScrollTrigger Integration (Scale-in entry & grow on scroll)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      // Entry scale animation matching Nick Ho
      gsap.fromTo(stage, 
        { scale: 0.82, opacity: 0.9 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: partnersSection,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Subtle progressive grow across the section
      gsap.to(stage, {
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: partnersSection,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 0.6
        }
      });
    }

    // Main Animation Loop
    function tick() {
      if (isVisible) {
        if (!isDragging) {
          // Decay drag momentum smoothly
          momentum *= 0.92;
          if (Math.abs(momentum) < 0.005) momentum = 0;

          // Decay scroll velocity smoothly
          scrollVelocity *= 0.88;
          if (Math.abs(scrollVelocity) < 0.005) scrollVelocity = 0;

          // Combine idle rotation with scroll and drag momentum
          const activeSpin = (idleSpeed * idleDirection) + scrollVelocity + momentum;
          currentFrame += activeSpin;

          drawCurrent();
        }

        // 3D Parallax tilt interpolation (Smooth lerp)
        const targetTiltY = Math.max(Math.min(mouseX * 12, 16), -16);
        const targetTiltX = Math.max(Math.min(-mouseY * 8, 12), -12);
        currentTiltY += (targetTiltY - currentTiltY) * 0.08;
        currentTiltX += (targetTiltX - currentTiltX) * 0.08;

        if (canvas) {
          canvas.style.transform = `perspective(800px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
        }
      }

      animFrameId = requestAnimationFrame(tick);
    }

    // IntersectionObserver to pause loop when out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animFrameId) {
          animFrameId = requestAnimationFrame(tick);
        }
      });
    }, { rootMargin: '120px 0px' });

    observer.observe(partnersSection);

    // Initial resize
    setTimeout(resizeCanvas, 50);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHelmetShowcase);
  } else {
    initHelmetShowcase();
  }
})();
