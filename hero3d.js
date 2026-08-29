/**
 * hero3d.js — Anivesh Gupta Portfolio
 * Three.js 3D hero animation: neural-circuit polyhedra structure
 * Cinematic orbit, glowing wireframes, floating particles, data-streams
 */

(function () {
  'use strict';

  // ─── Wait for THREE to be available ───────────────────────────────────────
  function waitForThree(cb, tries = 0) {
    if (typeof THREE !== 'undefined') { cb(); return; }
    if (tries > 60) return;
    setTimeout(() => waitForThree(cb, tries + 1), 100);
  }

  // ─── Init on DOM ready ────────────────────────────────────────────────────
  function init() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth || window.innerWidth, canvas.offsetHeight || window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // ── Scene & Camera ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 11);

    // ── Colors ──────────────────────────────────────────────────────────────
    const C_ACCENT    = 0xa78bfa;
    const C_DEEP      = 0x7c3aed;
    const C_WIRE      = 0x6d28d9;
    const C_BRIGHT    = 0xc4b5fd;
    const C_PARTICLE  = 0xddd6fe;

    // ── Fog ─────────────────────────────────────────────────────────────────
    scene.fog = new THREE.FogExp2(0x050308, 0.045);

    // ══════════════════════════════════════════════════════════════════════════
    //  CENTRAL POLYHEDRA STRUCTURE
    // ══════════════════════════════════════════════════════════════════════════

    const structureGroup = new THREE.Group();
    scene.add(structureGroup);

    // Shared materials
    const wireMat = new THREE.MeshBasicMaterial({
      color: C_WIRE,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    const glowMat = new THREE.LineBasicMaterial({
      color: C_ACCENT,
      transparent: true,
      opacity: 0.65,
      linewidth: 1,
    });

    const faceMat = new THREE.MeshPhongMaterial({
      color: 0x0d0014,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      shininess: 120,
      specular: new THREE.Color(C_ACCENT),
    });

    // ── Core icosahedron ────────────────────────────────────────────────────
    const coreGeo = new THREE.IcosahedronGeometry(2.0, 1);
    const coreMesh = new THREE.Mesh(coreGeo, faceMat.clone());
    const coreWire = new THREE.Mesh(coreGeo, wireMat.clone());
    structureGroup.add(coreMesh, coreWire);

    // Glowing edges for core
    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const coreLines = new THREE.LineSegments(coreEdges, glowMat.clone());
    structureGroup.add(coreLines);

    // ── Outer dodecahedron ──────────────────────────────────────────────────
    const outerGeo = new THREE.DodecahedronGeometry(3.2, 0);
    const outerFaceMat = faceMat.clone();
    outerFaceMat.opacity = 0.06;
    const outerMesh = new THREE.Mesh(outerGeo, outerFaceMat);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerGlowMat = glowMat.clone();
    outerGlowMat.opacity = 0.28;
    outerGlowMat.color.set(C_DEEP);
    const outerLines = new THREE.LineSegments(outerEdges, outerGlowMat);
    structureGroup.add(outerMesh, outerLines);

    // ── Mid tetrahedra ring ─────────────────────────────────────────────────
    const tetraGeo = new THREE.TetrahedronGeometry(0.7, 0);
    const tetraEdges = new THREE.EdgesGeometry(tetraGeo);
    const tetraCount = 8;
    for (let i = 0; i < tetraCount; i++) {
      const angle = (i / tetraCount) * Math.PI * 2;
      const r = 2.6;
      const tetra = new THREE.Group();
      tetra.position.set(
        Math.cos(angle) * r,
        Math.sin(angle * 0.7) * 1.2,
        Math.sin(angle) * r
      );
      tetra.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const tFaceMat = faceMat.clone();
      tFaceMat.opacity = 0.12;
      const tm = new THREE.Mesh(tetraGeo, tFaceMat);
      const tGlowMat = glowMat.clone();
      tGlowMat.color.set(C_BRIGHT);
      tGlowMat.opacity = 0.5;
      const tl = new THREE.LineSegments(tetraEdges, tGlowMat);
      tetra.add(tm, tl);
      tetra.userData.orbitSpeed = 0.003 + Math.random() * 0.002;
      tetra.userData.orbitAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      structureGroup.add(tetra);
    }

    // ── Node spheres at icosahedron vertices ────────────────────────────────
    const posAttr = coreGeo.attributes.position;
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: C_BRIGHT });
    const seen = new Set();
    for (let i = 0; i < posAttr.count; i++) {
      const key = [
        posAttr.getX(i).toFixed(2),
        posAttr.getY(i).toFixed(2),
        posAttr.getZ(i).toFixed(2),
      ].join(',');
      if (seen.has(key)) continue;
      seen.add(key);
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      structureGroup.add(node);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  CONNECTION LINES (neural-network style)
    // ══════════════════════════════════════════════════════════════════════════
    const nodePositions = [...seen].map(k => {
      const [x, y, z] = k.split(',').map(Number);
      return new THREE.Vector3(x, y, z);
    });

    const connMat = new THREE.LineBasicMaterial({
      color: C_ACCENT,
      transparent: true,
      opacity: 0.12,
    });

    // Connect nearby nodes
    for (let a = 0; a < nodePositions.length; a++) {
      for (let b = a + 1; b < nodePositions.length; b++) {
        const dist = nodePositions[a].distanceTo(nodePositions[b]);
        if (dist < 2.3) {
          const pts = [nodePositions[a], nodePositions[b]];
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          const line = new THREE.Line(geo, connMat.clone());
          structureGroup.add(line);
        }
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  FLOATING PARTICLES
    // ══════════════════════════════════════════════════════════════════════════
    const PARTICLE_COUNT = 420;
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pSizes     = new Float32Array(PARTICLE_COUNT);
    const pPhases    = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r     = 4.5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);
      pSizes[i]  = 0.6 + Math.random() * 1.8;
      pPhases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

    const particleMat = new THREE.PointsMaterial({
      color: C_PARTICLE,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ══════════════════════════════════════════════════════════════════════════
    //  DATA STREAM ARCS
    // ══════════════════════════════════════════════════════════════════════════
    const streamGroup = new THREE.Group();
    scene.add(streamGroup);

    function makeArc(p1, p2, segments = 24) {
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(p1.length() * 1.3);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const pts = curve.getPoints(segments);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: C_ACCENT,
        transparent: true,
        opacity: 0.09 + Math.random() * 0.12,
      });
      return new THREE.Line(geo, mat);
    }

    // Pick random pairs from outer shell
    const shellPts = [];
    for (let i = 0; i < 18; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3.8 + Math.random() * 1.5;
      shellPts.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));
    }
    for (let i = 0; i < 14; i++) {
      const a = shellPts[Math.floor(Math.random() * shellPts.length)];
      const b = shellPts[Math.floor(Math.random() * shellPts.length)];
      if (a !== b) streamGroup.add(makeArc(a, b));
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  AMBIENT & POINT LIGHTS
    // ══════════════════════════════════════════════════════════════════════════
    scene.add(new THREE.AmbientLight(0x1a0030, 2.5));

    const pLight1 = new THREE.PointLight(C_ACCENT, 4, 18);
    pLight1.position.set(4, 3, 5);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(C_DEEP, 3, 14);
    pLight2.position.set(-5, -2, -4);
    scene.add(pLight2);

    const pLight3 = new THREE.PointLight(0xffffff, 1, 12);
    pLight3.position.set(0, 6, 2);
    scene.add(pLight3);

    // ══════════════════════════════════════════════════════════════════════════
    //  FILM GRAIN OVERLAY (canvas 2D, composited via CSS)
    // ══════════════════════════════════════════════════════════════════════════
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width  = 256;
    grainCanvas.height = 256;
    grainCanvas.style.cssText = `
      position:absolute;inset:0;width:100%;height:100%;
      pointer-events:none;opacity:0.03;mix-blend-mode:overlay;
      z-index:2;border-radius:inherit;
    `;
    const grainCtx = grainCanvas.getContext('2d');

    function refreshGrain() {
      const imgData = grainCtx.createImageData(256, 256);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = v;
        imgData.data[i+3] = 255;
      }
      grainCtx.putImageData(imgData, 0, 0);
    }
    refreshGrain();
    canvas.parentElement.appendChild(grainCanvas);

    // ══════════════════════════════════════════════════════════════════════════
    //  ANIMATION LOOP
    // ══════════════════════════════════════════════════════════════════════════
    let frameCount = 0;
    const clock = new THREE.Clock();

    // Camera orbit parameters
    const CAM_RADIUS = 11;
    const CAM_SPEED  = 0.055; // radians/sec

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      frameCount++;

      // ── Structure slow rotation ──────────────────────────────────────────
      structureGroup.rotation.y = t * 0.09;
      structureGroup.rotation.x = Math.sin(t * 0.04) * 0.18;
      structureGroup.rotation.z = Math.cos(t * 0.03) * 0.08;

      // ── Tetrahedra individual spin ───────────────────────────────────────
      structureGroup.children.forEach(child => {
        if (child.userData.orbitSpeed) {
          child.rotateOnAxis(child.userData.orbitAxis, child.userData.orbitSpeed);
        }
      });

      // ── Particle gentle pulse ────────────────────────────────────────────
      particleMat.opacity = 0.45 + Math.sin(t * 0.6) * 0.1;
      particles.rotation.y = t * 0.018;
      particles.rotation.x = t * 0.009;

      // ── Data streams slow drift ──────────────────────────────────────────
      streamGroup.rotation.y = -t * 0.022;
      streamGroup.rotation.x = Math.sin(t * 0.025) * 0.12;

      // ── Cinematic camera orbit ───────────────────────────────────────────
      const camAngle = t * CAM_SPEED;
      camera.position.x = Math.cos(camAngle) * CAM_RADIUS;
      camera.position.z = Math.sin(camAngle) * CAM_RADIUS;
      camera.position.y = Math.sin(t * 0.08) * 2.2;
      camera.lookAt(0, 0, 0);

      // ── Glow pulse on core edges ─────────────────────────────────────────
      coreLines.material.opacity = 0.5 + Math.sin(t * 1.1) * 0.2;

      // ── Lights gentle movement ───────────────────────────────────────────
      pLight1.position.x = Math.sin(t * 0.4) * 5;
      pLight1.position.y = Math.cos(t * 0.3) * 3;
      pLight2.position.x = Math.cos(t * 0.35) * -5;

      // ── Grain refresh every 3 frames ─────────────────────────────────────
      if (frameCount % 3 === 0) refreshGrain();

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize handler ───────────────────────────────────────────────────────
    function onResize() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', onResize);
    setTimeout(onResize, 200); // after layout settles
  }

  // ─── Entry ────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForThree(init));
  } else {
    waitForThree(init);
  }
})();