/**
 * Max Verstappen 360° Interactive Red Bull Racing Helmet Engine
 * 
 * High-fidelity 1:1 turntable showcase:
 * - 180-frame high-resolution rotational sequence rendered to DPR-aware canvas
 * - Seamless sticky pinning spanning both Statement and Partners sections
 * - Scroll-velocity driven spin physics with inertia and damping
 * - Continuous gentle idle spin with direction memory
 * - Pointer drag / touch scrubbing with momentum and grabbing cursor
 * - 3D parallax perspective tilt responsive to cursor position
 * - Floating sine hover physics
 */

(function () {
  'use strict';

  const CONFIG = {
    totalFrames: 180,
    localPath: '/static/images/helmet_redbull/frame_',
    cdnPath: '',
    ext: '.webp',
    padLength: 4,
    idleSpeed: 16, // frames per second idle rotation
    velocityGain: 0.24,
    maxSpeed: 280,
    responsiveness: 0.32,
    dragSensitivity: 0.45,
    strides: [12, 6, 3, 1], // progressive loading strides
    tiltMax: 12,
    moveMax: 36,
    perspective: 900,
    floatAmount: 8,
    floatDuration: 2.2
  };

  function initHelmet() {
    const stage = document.querySelector('[data-helmet-stage]');
    const section = document.querySelector('[data-helmet-section]');
    const layer = document.querySelector('[data-helmet-layer]');

    if (!stage) return;
    if (stage.dataset.initialized === 'true') return;
    stage.dataset.initialized = 'true';

    // Static 4K Mode: keep helmet completely static and unmoveable
    if (stage.querySelector('.helmet_static_img') || stage.classList.contains('is-static-4k')) {
      return;
    }

    // 1. Setup Canvas
    const canvas = document.createElement('canvas');
    canvas.setAttribute('data-helmet-canvas', '');
    canvas.setAttribute('aria-label', 'Max Verstappen 360-degree interactive Red Bull racing helmet');
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.userSelect = 'none';
    canvas.style.pointerEvents = 'auto';
    canvas.style.cursor = 'grab';
    stage.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    const frames = new Array(CONFIG.totalFrames);
    const loaded = new Array(CONFIG.totalFrames).fill(false);
    let loadedCount = 0;
    let allLoaded = false;
    let currentDrawnFrame = -1;

    function getFrameUrl(idx, useCdn = false) {
      const padded = String(idx + 1).padStart(CONFIG.padLength, '0');
      const base = (useCdn && CONFIG.cdnPath) ? CONFIG.cdnPath : CONFIG.localPath;
      return `${base}${padded}${CONFIG.ext}?v=4k_v2`;
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const stageRect = stage.getBoundingClientRect();
      const stageW = Math.round(stageRect.width || stage.clientWidth || 380);
      const stageH = Math.round(stageRect.height || stage.clientHeight || 380);

      const targetW = Math.round(stageW * dpr);
      const targetH = Math.round(stageH * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = stageW + 'px';
        canvas.style.height = stageH + 'px';
        if (currentDrawnFrame !== -1) {
          drawFrame(currentDrawnFrame, true);
        }
      }
    }

    window.addEventListener('resize', resizeCanvas);

    function drawFrame(idx, force = false) {
      if (!loaded[idx] && !force) return;
      const img = frames[idx];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      if (!canvas.width || !canvas.height) {
        resizeCanvas();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvas.width / canvas.height;
      let drawW, drawH, drawX, drawY;

      if (canvasAspect > imgAspect) {
        drawH = canvas.height;
        drawW = drawH * imgAspect;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = canvas.width;
        drawH = drawW / imgAspect;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      currentDrawnFrame = idx;
    }

    function findNearestLoaded(targetIdx) {
      if (loaded[targetIdx]) return targetIdx;
      for (let delta = 1; delta < CONFIG.totalFrames; delta++) {
        const left = (targetIdx - delta + CONFIG.totalFrames) % CONFIG.totalFrames;
        if (loaded[left]) return left;
        const right = (targetIdx + delta) % CONFIG.totalFrames;
        if (loaded[right]) return right;
      }
      return -1;
    }

    // 2. Progressive Frame Loading
    function startLoader() {
      const loadQueue = [];
      const queuedSet = new Set([0]);

      CONFIG.strides.forEach(stride => {
        for (let i = 0; i < CONFIG.totalFrames; i += stride) {
          if (!queuedSet.has(i)) {
            queuedSet.add(i);
            loadQueue.push(i);
          }
        }
      });

      // Fill remaining
      for (let i = 0; i < CONFIG.totalFrames; i++) {
        if (!queuedSet.has(i)) {
          queuedSet.add(i);
          loadQueue.push(i);
        }
      }

      let queueIdx = 0;
      const concurrency = 6;

      function loadNext() {
        if (queueIdx >= loadQueue.length) return;
        const frameIdx = loadQueue[queueIdx++];
        const img = new Image();
        img.decoding = 'async';

        const onFrameReady = () => {
          loaded[frameIdx] = true;
          loadedCount++;
          if (loadedCount === CONFIG.totalFrames) allLoaded = true;

          if (currentDrawnFrame === -1) {
            drawFrame(frameIdx, true);
          }
          loadNext();
        };

        img.onload = () => {
          if (img.decode) {
            img.decode().then(onFrameReady).catch(onFrameReady);
          } else {
            onFrameReady();
          }
        };

        img.onerror = () => {
          if (CONFIG.cdnPath) {
            const cdnImg = new Image();
            cdnImg.onload = () => {
              frames[frameIdx] = cdnImg;
              onFrameReady();
            };
            cdnImg.onerror = () => loadNext();
            cdnImg.src = getFrameUrl(frameIdx, true);
          } else {
            loadNext();
          }
        };

        img.src = getFrameUrl(frameIdx, false);
        frames[frameIdx] = img;
      }

      for (let c = 0; c < concurrency; c++) {
        loadNext();
      }
    }

    // Load Frame 0 immediately
    const firstImg = new Image();
    frames[0] = firstImg;
    firstImg.onload = () => {
      loaded[0] = true;
      loadedCount++;
      resizeCanvas();
      drawFrame(0, true);
      startLoader();
    };
    firstImg.onerror = () => {
      if (CONFIG.cdnPath) {
        const cdnFirst = new Image();
        frames[0] = cdnFirst;
        cdnFirst.onload = () => {
          loaded[0] = true;
          loadedCount++;
          resizeCanvas();
          drawFrame(0, true);
          startLoader();
        };
        cdnFirst.onerror = startLoader;
        cdnFirst.src = getFrameUrl(0, true);
      } else {
        startLoader();
      }
    };
    firstImg.src = getFrameUrl(0, false);

    // 3. Scroll & Idle Physics Engine
    let currentPosition = 0; // Float 0..180
    let velocity = 0;
    let idleDirection = 1;
    let lastScrollY = window.scrollY;
    let isDragging = false;
    let dragStartX = 0;
    let lastDragX = 0;
    let dragVelocity = 0;
    let lastDragTime = 0;
    let isVisible = true;

    if ('IntersectionObserver' in window && section) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { rootMargin: '250px' });
      observer.observe(section);
    }

    // Pointer Drag / Touch Scrubbing
    function onPointerDown(e) {
      isDragging = true;
      canvas.style.cursor = 'grabbing';
      dragStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      lastDragX = dragStartX;
      lastDragTime = performance.now();
      dragVelocity = 0;
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const dx = x - lastDragX;
      const now = performance.now();
      const dt = Math.max((now - lastDragTime) / 1000, 0.001);

      dragVelocity = (dx / dt) * 0.05;
      lastDragX = x;
      lastDragTime = now;

      // Invert dx so dragging right rotates helmet clockwise
      currentPosition -= dx * CONFIG.dragSensitivity;
      currentPosition = ((currentPosition % CONFIG.totalFrames) + CONFIG.totalFrames) % CONFIG.totalFrames;

      idleDirection = dx > 0 ? -1 : 1;
      renderCurrentFrame();
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      canvas.style.cursor = 'grab';
      velocity = -dragVelocity * 0.35;
    }

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    function renderCurrentFrame() {
      const rounded = Math.round(currentPosition) % CONFIG.totalFrames;
      const target = allLoaded ? rounded : findNearestLoaded(rounded);
      if (target !== -1 && target !== currentDrawnFrame) {
        drawFrame(target);
      }
    }

    // Main animation ticker
    let lastTickTime = performance.now();

    function tick(now) {
      const dt = Math.min((now - lastTickTime) / 1000, 0.05);
      lastTickTime = now;

      if (isVisible && dt > 0) {
        const scrollY = window.scrollY;
        const scrollDelta = (scrollY - lastScrollY) / dt;
        lastScrollY = scrollY;

        if (!isDragging) {
          if (Math.abs(scrollDelta) > 40) {
            idleDirection = scrollDelta > 0 ? 1 : -1;
          }

          const targetVelocity = idleDirection * CONFIG.idleSpeed + scrollDelta * CONFIG.velocityGain;
          const clampedTarget = Math.max(-CONFIG.maxSpeed, Math.min(CONFIG.maxSpeed, targetVelocity));
          const blend = 1 - Math.exp(-dt / CONFIG.responsiveness);

          velocity += (clampedTarget - velocity) * blend;
          currentPosition = ((currentPosition + velocity * dt) % CONFIG.totalFrames + CONFIG.totalFrames) % CONFIG.totalFrames;
          renderCurrentFrame();
        }
      } else {
        lastScrollY = window.scrollY;
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // 4. 3D Mouse Perspective Tilt & Floating Hover Physics
    if (typeof gsap !== 'undefined') {
      gsap.set(stage, {
        transformPerspective: CONFIG.perspective,
        transformOrigin: '50% 50%',
        force3D: true
      });

      // Subtle sine wave floating bounce
      gsap.fromTo(stage,
        { y: -CONFIG.floatAmount },
        {
          y: CONFIG.floatAmount,
          duration: CONFIG.floatDuration,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        }
      );

      // Smooth cursor parallax tilt
      const quickX = gsap.quickTo(stage, 'x', { duration: 1.2, ease: 'power3.out' });
      const quickRotateY = gsap.quickTo(stage, 'rotationY', { duration: 1.4, ease: 'power3.out' });
      const quickRotateX = gsap.quickTo(stage, 'rotationX', { duration: 1.4, ease: 'power3.out' });

      window.addEventListener('mousemove', (e) => {
        if (!isVisible) return;
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;

        quickX(nx * CONFIG.moveMax);
        quickRotateY(nx * CONFIG.tiltMax);
        quickRotateX(-ny * (CONFIG.tiltMax * 0.6));
      }, { passive: true });

      document.documentElement.addEventListener('mouseleave', () => {
        quickX(0);
        quickRotateY(0);
        quickRotateX(0);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHelmet);
  } else {
    initHelmet();
  }
})();
