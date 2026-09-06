/* Sonoran night hero — Three.js r160 when available, WebGL fallback otherwise */
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function runThree() {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    camera.position.set(0, 3.2, 9.5);
    camera.lookAt(0, 0.4, 0);
    scene.add(new THREE.AmbientLight(0x1a2430, 0.55));
    const moon = new THREE.DirectionalLight(0x9ec8d8, 0.55);
    moon.position.set(-4, 8, 2);
    scene.add(moon);
    const copperGlow = new THREE.PointLight(0xc67a45, 1.1, 28);
    copperGlow.position.set(2, 1.5, 3);
    scene.add(copperGlow);
    const cyanGlow = new THREE.PointLight(0x5ec8d8, 0.7, 24);
    cyanGlow.position.set(-3, 2, -2);
    scene.add(cyanGlow);

    const cols = 80, rows = 50;
    const geo = new THREE.PlaneGeometry(28, 18, cols, rows);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const ridge = Math.sin(x * 0.22) * Math.cos(z * 0.18) * 0.55;
      const foothills = Math.exp(-((x + 4) * (x + 4)) / 40) * 2.2;
      const slope = (-z) * 0.12 + (-x) * 0.05;
      const noise = Math.sin(x * 1.7 + z * 0.9) * 0.08 + Math.sin(x * 0.4 - z * 1.3) * 0.12;
      pos.setY(i, slope + foothills + ridge + noise);
    }
    geo.computeVertexNormals();
    const terrain = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x1a221c, roughness: 0.92, metalness: 0.08, flatShading: true,
      emissive: 0x0a1512, emissiveIntensity: 0.25
    }));
    terrain.position.y = -0.6;
    scene.add(terrain);

    const ribbonPts = [];
    for (let t = 0; t <= 1; t += 0.02) {
      const x = -8 + t * 16, z = 6 - t * 12;
      const y = 0.15 + (-z) * 0.12 + (-x) * 0.05 + 0.35;
      ribbonPts.push(new THREE.Vector3(x * 0.7, y, z * 0.65));
    }
    const curve = new THREE.CatmullRomCurve3(ribbonPts);
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.045, 8, false),
      new THREE.MeshBasicMaterial({ color: 0x5ec8d8, transparent: true, opacity: 0.85 })));
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.12, 8, false),
      new THREE.MeshBasicMaterial({ color: 0xe8955a, transparent: true, opacity: 0.22 })));
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), new THREE.MeshBasicMaterial({ color: 0x7ee0ef }));
    scene.add(pulse);

    const starCount = reduced ? 200 : 900;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 60;
      starPos[i * 3 + 1] = 4 + Math.random() * 22;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xd8e8f0, size: 0.045, sizeAttenuation: true, transparent: true, opacity: 0.85
    }));
    scene.add(stars);

    const cactusMat = new THREE.MeshStandardMaterial({ color: 0x3d6b4f, roughness: 0.85, emissive: 0x1a3024, emissiveIntensity: 0.2 });
    for (let i = 0; i < 7; i++) {
      const h = 0.6 + Math.random() * 0.9;
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, h, 6), cactusMat);
      c.position.set(-6 + Math.random() * 12, h / 2 - 0.2, -2 + Math.random() * 6);
      scene.add(c);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 }).observe(canvas);
    let t0 = performance.now(), raf = 0;
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = (now - t0) / 1000;
      if (!reduced) {
        stars.rotation.y = t * 0.012;
        copperGlow.intensity = 0.95 + Math.sin(t * 1.2) * 0.2;
        pulse.position.copy(curve.getPointAt((t * 0.08) % 1));
        camera.position.x = Math.sin(t * 0.08) * 0.35;
        camera.lookAt(0, 0.5, 0);
      }
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    });
  }

  function waitThree(attempts) {
    if (typeof THREE !== "undefined") { runThree(); return; }
    if (attempts <= 0) { console.warn("THREE unavailable — hero canvas idle under CSS veil"); return; }
    setTimeout(function () { waitThree(attempts - 1); }, 50);
  }
  waitThree(40);
})();
