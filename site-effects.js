/* Connect Lenis to GSAP only on the inventory page where both are loaded on eligible mobile devices. */
(() => {
  'use strict';
  const connectMotionClock = () => {
    const lenis = window.__natexLenis;
    if (!lenis || lenis.__natexFrameConnected) return;

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(time => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
      lenis.__natexGsapConnected = true;
    } else {
      // Lenis still works if a motion CDN fails; native scroll remains available if Lenis fails too.
      const raf = time => {
        lenis.raf(time);
        lenis.__natexFallbackFrame = requestAnimationFrame(raf);
      };
      lenis.__natexFallbackFrame = requestAnimationFrame(raf);
    }
    lenis.__natexFrameConnected = true;
  };

  Promise.resolve(window.__natexMobileMotionReady).then(connectMotionClock);

  // Optional desktop Three.js accent: inline SVG stays visible until hover/focus intent.
  const host = document.querySelector('[data-three-showcase]');
  if (!host) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = window.matchMedia('(max-width: 760px)').matches;
  const lowMemory = Number(navigator.deviceMemory || 0) > 0 && Number(navigator.deviceMemory) <= 2;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  if (reducedMotion || smallScreen || lowMemory || saveData) return;

  const interactionRegion = host.closest('.hero-art') || host;
  let initialized = false;
  let visible = false;
  let rafId = 0;
  let renderer = null;
  let scene = null;
  let camera = null;
  let group = null;
  let core = null;
  let resizeObserver = null;

  const render = () => {
    if (visible && renderer && scene && camera) renderer.render(scene, camera);
  };
  const stop = () => {
    visible = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };
  const animate = () => {
    rafId = 0;
    if (!visible || !renderer || !group) return;
    group.rotation.y += 0.005;
    group.rotation.x += 0.0015;
    if (core) core.rotation.y -= 0.007;
    render();
    rafId = requestAnimationFrame(animate);
  };
  const start = () => {
    visible = true;
    if (!initialized) initialize();
    if (!rafId && renderer) rafId = requestAnimationFrame(animate);
  };
  const initialize = async () => {
    if (initialized) return;
    initialized = true;
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js');
      if (!host.isConnected) return;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
      camera.position.z = 3.5;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(Math.max(1, host.clientWidth), Math.max(1, host.clientHeight), false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.appendChild(renderer.domElement);
      group = new THREE.Group();
      scene.add(group);
      group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(.86, 1),
        new THREE.MeshBasicMaterial({ color: 0xc5f36b, wireframe: true, transparent: true, opacity: .76 })));
      core = new THREE.Mesh(new THREE.IcosahedronGeometry(.38, 1),
        new THREE.MeshBasicMaterial({ color: 0xe9ffd0, wireframe: true, transparent: true, opacity: .34 }));
      group.add(core);
      host.classList.add('is-three-ready');
      resizeObserver = new ResizeObserver(() => {
        const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        render();
      });
      resizeObserver.observe(host);
      render();
      if (visible && !rafId) rafId = requestAnimationFrame(animate);
    } catch (error) {
      host.classList.remove('is-three-ready');
      console.warn('[NatexWorks] Three.js enhancement skipped:', error);
    }
  };

  interactionRegion.addEventListener('pointerenter', start, { passive: true });
  interactionRegion.addEventListener('pointerleave', stop, { passive: true });
  interactionRegion.addEventListener('focusin', start);
  interactionRegion.addEventListener('focusout', event => {
    if (!interactionRegion.contains(event.relatedTarget)) stop();
  });
})();
