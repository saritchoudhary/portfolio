/* ─────────────────────────────────────────
   SARIT CHOUDHARY PORTFOLIO – MAIN JS
───────────────────────────────────────── */

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress?.style.setProperty('--scroll-progress', `${Math.min(1, Math.max(0, progress))}`);
});

// ── FULL-PAGE PARTICLE FIELD ──
function initParticleField() {
  const canvas = document.getElementById('particleField');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  const particles = [];
  let viewportWidth = 0;
  let viewportHeight = 0;
  let galaxyRadius = 0;
  let pointerX = -1000;
  let pointerY = -1000;
  let pointerActive = false;
  let animationFrame = 0;

  function resizeField() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    canvas.width = Math.round(viewportWidth * pixelRatio);
    canvas.height = Math.round(viewportHeight * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const particleCount = Math.max(96, Math.min(320, Math.round(viewportWidth * viewportHeight / 4800)));
    particles.length = 0;
    const galaxyCenterX = viewportWidth * 0.52;
    const galaxyCenterY = viewportHeight * 0.48;
    galaxyRadius = Math.min(viewportWidth * 0.72, viewportHeight * 1.18);
    for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
      let homeX = Math.random() * viewportWidth;
      let homeY = Math.random() * viewportHeight;
      let distanceFromCore = galaxyRadius;

      if (Math.random() < 0.78) {
        const armIndex = Math.floor(Math.random() * 3);
        distanceFromCore = Math.pow(Math.random(), 0.72) * galaxyRadius;
        const spiralAngle = armIndex * Math.PI * 2 / 3 + distanceFromCore * 0.009;
        const armScatter = 10 + distanceFromCore * 0.12;
        homeX = galaxyCenterX + Math.cos(spiralAngle) * distanceFromCore + (Math.random() - 0.5) * armScatter;
        homeY = galaxyCenterY + Math.sin(spiralAngle) * distanceFromCore * 0.48 + (Math.random() - 0.5) * armScatter;
      }

      const starColor = Math.random();
      const hue = starColor < 0.48
        ? 205 + Math.random() * 35
        : starColor < 0.78
          ? 258 + Math.random() * 42
          : starColor < 0.95
            ? 185 + Math.random() * 22
            : 35 + Math.random() * 24;
      particles.push({
        x: homeX,
        y: homeY,
        homeX,
        homeY,
        velocityX: 0,
        velocityY: 0,
        radius: 0.8 + Math.random() * 1.6 + (1 - distanceFromCore / galaxyRadius) * 0.75,
        hue,
        phase: Math.random() * Math.PI * 2
      });
    }

    drawField(0, false);
  }

  function drawField(time, scheduleNextFrame = true) {
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    const repulsionRadius = 190;
    const parallaxX = pointerActive ? (pointerX / viewportWidth - 0.5) * 18 : 0;
    const parallaxY = pointerActive ? (pointerY / viewportHeight - 0.5) * 12 : 0;
    const galaxyCenterX = viewportWidth * 0.52 - parallaxX;
    const galaxyCenterY = viewportHeight * 0.48 - parallaxY;

    context.save();
    context.globalCompositeOperation = 'screen';
    context.translate(galaxyCenterX, galaxyCenterY);
    context.rotate(-0.32);
    context.scale(1, 0.32);
    const coreGlow = context.createRadialGradient(0, 0, 8, 0, 0, Math.max(viewportWidth, viewportHeight) * 0.72);
    coreGlow.addColorStop(0, 'rgba(255, 239, 255, 0.34)');
    coreGlow.addColorStop(0.12, 'rgba(217, 188, 255, 0.3)');
    coreGlow.addColorStop(0.36, 'rgba(130, 145, 255, 0.18)');
    coreGlow.addColorStop(0.72, 'rgba(95, 123, 255, 0.055)');
    coreGlow.addColorStop(1, 'rgba(95, 123, 255, 0)');
    context.fillStyle = coreGlow;
    context.beginPath();
    context.ellipse(0, 0, viewportWidth * 0.86, viewportHeight * 1.7, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.save();
    context.translate(galaxyCenterX, galaxyCenterY);
    context.rotate(-0.32);
    for (let armIndex = 0; armIndex < 3; armIndex += 1) {
      context.beginPath();
      for (let radius = 14; radius <= galaxyRadius; radius += 5) {
        const spiralAngle = armIndex * Math.PI * 2 / 3 + radius * 0.009;
        const x = Math.cos(spiralAngle) * radius;
        const y = Math.sin(spiralAngle) * radius * 0.48;
        if (radius === 14) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = 'rgba(205, 184, 255, 0.2)';
      context.lineWidth = 2;
      context.stroke();
    }
    context.restore();

    particles.forEach(particle => {
      if (!prefersReducedMotion) {
        particle.velocityX += (particle.homeX - particle.x) * 0.0018;
        particle.velocityY += (particle.homeY - particle.y) * 0.0018;

        if (pointerActive) {
          const offsetX = particle.x - pointerX;
          const offsetY = particle.y - pointerY;
          const distance = Math.max(1, Math.hypot(offsetX, offsetY));
          if (distance < repulsionRadius) {
            const force = (1 - distance / repulsionRadius) * 0.95;
            particle.velocityX += (offsetX / distance) * force;
            particle.velocityY += (offsetY / distance) * force;
          }
        }

        particle.velocityX *= 0.92;
        particle.velocityY *= 0.92;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
      }
    });

    context.globalCompositeOperation = 'lighter';
    for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
      const firstParticle = particles[firstIndex];
      for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
        const secondParticle = particles[secondIndex];
        const distance = Math.hypot(firstParticle.x - secondParticle.x, firstParticle.y - secondParticle.y);
        if (distance < 78) {
          context.strokeStyle = `rgba(180, 190, 255, ${(1 - distance / 78) * 0.16})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(firstParticle.x, firstParticle.y);
          context.lineTo(secondParticle.x, secondParticle.y);
          context.stroke();
        }
      }
    }

    particles.forEach(particle => {
      const pulse = prefersReducedMotion ? 0 : (Math.sin(time * 0.0018 + particle.phase) + 1) * 0.5;
      const opacity = 0.52 + pulse * 0.43;
      context.fillStyle = `hsla(${particle.hue}, 88%, 70%, ${opacity})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * (0.9 + pulse * 0.45), 0, Math.PI * 2);
      context.fill();
    });

    context.globalCompositeOperation = 'source-over';
    if (!prefersReducedMotion && scheduleNextFrame) animationFrame = window.requestAnimationFrame(drawField);
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !finePointer || prefersReducedMotion) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerActive = true;
    if (!animationFrame) animationFrame = window.requestAnimationFrame(drawField);
  });

  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) pointerActive = false;
  });

  window.addEventListener('resize', resizeField, { passive: true });
  resizeField();
  if (!prefersReducedMotion) animationFrame = window.requestAnimationFrame(drawField);
}

// ── POINTER DEPTH ──
const cursorOrb = document.getElementById('cursorOrb');
const finePointer = window.matchMedia('(pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
initParticleField();

// â”€â”€ INTRO PIXEL SWARM â”€â”€
function initIntroPixels() {
  const canvas = document.getElementById('introPixels');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  const pixels = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  function resizePixels() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    pixels.length = 0;
    const pixelCount = Math.max(45, Math.min(110, Math.round(width / 8)));
    for (let index = 0; index < pixelCount; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.pow(Math.random(), 0.72) * Math.min(width * 0.25, height * 0.38);
      const colorChoice = Math.random();
      pixels.push({
        angle,
        distance,
        size: 1.4 + Math.random() * 3.4,
        phase: Math.random() * Math.PI * 2,
        hue: colorChoice < 0.62 ? 215 + Math.random() * 24 : colorChoice < 0.9 ? 188 + Math.random() * 22 : 255
      });
    }
    drawPixels(0, false);
  }

  function drawPixels(time, scheduleNextFrame = true) {
    context.clearRect(0, 0, width, height);
    const centerX = width * 0.45;
    const centerY = height * 0.57;
    const motion = prefersReducedMotion ? 0 : time * 0.00016;

    pixels.forEach(pixel => {
      const angle = pixel.angle + motion;
      const drift = prefersReducedMotion ? 0 : Math.sin(time * 0.001 + pixel.phase) * 5;
      const x = centerX + Math.cos(angle) * pixel.distance + drift;
      const y = centerY + Math.sin(angle) * pixel.distance * 0.62;
      const shimmer = prefersReducedMotion ? 0.7 : 0.34 + (Math.sin(time * 0.002 + pixel.phase) + 1) * 0.28;
      context.fillStyle = `hsla(${pixel.hue}, 92%, 76%, ${shimmer})`;
      context.shadowColor = `hsla(${pixel.hue}, 100%, 70%, ${shimmer * 0.65})`;
      context.shadowBlur = pixel.size * 2.5;
      context.fillRect(x, y, pixel.size, pixel.size);
    });
    context.shadowBlur = 0;
    if (!prefersReducedMotion && scheduleNextFrame) frame = window.requestAnimationFrame(drawPixels);
  }

  new ResizeObserver(resizePixels).observe(canvas);
  resizePixels();
  if (!prefersReducedMotion) frame = window.requestAnimationFrame(drawPixels);
}

initIntroPixels();
const depthSelector = '.hero-screen, .section, .info-card, .skill-group, .project-card, .timeline-card, .edu-card, .achievement-card, .github-profile-card, .gh-repo-card, .contact-item';
const magneticSelector = '.hero-screen-nav a, .navbar a, .mobile-menu a, .hero-cta a, .hero-socials a, .btn-project, .intro-choice';

if (finePointer && !prefersReducedMotion && cursorOrb) {
  let targetX = 0;
  let targetY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let cursorFrame = 0;
  let activeDepth = null;
  let activeMagnet = null;

  function resetDepth() {
    if (!activeDepth) return;
    activeDepth.style.removeProperty('--tilt-x');
    activeDepth.style.removeProperty('--tilt-y');
    activeDepth.classList.remove('pointer-tilt');
    activeDepth = null;
  }

  function resetMagnet() {
    if (!activeMagnet) return;
    activeMagnet.style.removeProperty('--magnet-x');
    activeMagnet.style.removeProperty('--magnet-y');
    activeMagnet.classList.remove('magnetic-item');
    activeMagnet = null;
  }

  function animateCursor() {
    cursorX += (targetX - cursorX) * 0.18;
    cursorY += (targetY - cursorY) * 0.18;
    cursorOrb.style.setProperty('--cursor-x', `${cursorX}px`);
    cursorOrb.style.setProperty('--cursor-y', `${cursorY}px`);
    if (Math.abs(targetX - cursorX) + Math.abs(targetY - cursorY) > 0.5) {
      cursorFrame = window.requestAnimationFrame(animateCursor);
    } else {
      cursorFrame = 0;
    }
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    targetX = event.clientX;
    targetY = event.clientY;
    document.documentElement.style.setProperty('--pointer-x', `${targetX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${targetY}px`);
    cursorOrb.classList.add('visible');

    if (!cursorFrame) cursorFrame = window.requestAnimationFrame(animateCursor);

    const nextDepth = event.target.closest(depthSelector);
    if (nextDepth !== activeDepth) {
      resetDepth();
      activeDepth = nextDepth;
      activeDepth?.classList.add('pointer-tilt');
    }

    if (activeDepth) {
      const bounds = activeDepth.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
      const sectionDepth = activeDepth.matches('.section') ? 1.25 : 5;
      const sectionTurn = activeDepth.matches('.section') ? 1.5 : 6;
      activeDepth.style.setProperty('--tilt-x', `${-vertical * sectionDepth}deg`);
      activeDepth.style.setProperty('--tilt-y', `${horizontal * sectionTurn}deg`);
    }

    const nextMagnet = event.target.closest(magneticSelector);
    if (nextMagnet !== activeMagnet) {
      resetMagnet();
      activeMagnet = nextMagnet;
      activeMagnet?.classList.add('magnetic-item');
    }

    if (activeMagnet) {
      const bounds = activeMagnet.getBoundingClientRect();
      const horizontal = event.clientX - (bounds.left + bounds.width / 2);
      const vertical = event.clientY - (bounds.top + bounds.height / 2);
      activeMagnet.style.setProperty('--magnet-x', `${horizontal * 0.13}px`);
      activeMagnet.style.setProperty('--magnet-y', `${vertical * 0.13}px`);
    }
  });

  document.addEventListener('pointerout', event => {
    if (event.relatedTarget) return;
    cursorOrb.classList.remove('visible');
    resetDepth();
    resetMagnet();
  });

  document.addEventListener('pointerover', event => {
    cursorOrb.classList.toggle('hot', Boolean(event.target.closest('a, button, input, textarea')));
  });
}

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── INTRO DISCOVERY ──
const introStories = {
  build: {
    label: 'THE BUILDER',
    text: 'I made a WiFi attack simulator with an ESP8266, then built this portfolio to make the work easier to explore.'
  },
  think: {
    label: 'THE WAY I LEARN',
    text: 'I like pulling systems apart conceptually, testing what I learn, and explaining security ideas with practical projects.'
  },
  reset: {
    label: 'OFF THE SCREEN',
    text: 'Away from code, I recharge with e-sports and cinema. Both are pretty good studies in strategy and storytelling.'
  }
};

const introChoices = document.querySelectorAll('.intro-choice');
const introReveal = document.getElementById('introReveal');
introChoices.forEach(choice => {
  choice.addEventListener('click', () => {
    const story = introStories[choice.dataset.story];
    introChoices.forEach(button => {
      const selected = button === choice;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    introReveal.classList.add('changing');
    window.setTimeout(() => {
      introReveal.querySelector('.intro-reveal-label').textContent = story.label;
      introReveal.querySelector('p').textContent = story.text;
      introReveal.classList.remove('changing');
    }, 140);
  });
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children in same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const sibIdx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }, Math.min(sibIdx * 80, 300));
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObs.observe(el));

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = '';
        a.style.background = '';
      });
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) {
        active.style.color = 'var(--accent)';
        active.style.background = 'var(--accent-dim)';
      }
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => navObs.observe(s));

// ── HERO CHARACTER ──
function initHeroCharacter() {
  const canvas = document.getElementById('heroCanvas');
  const THREE = window.THREE;
  if (!canvas) return;
  if (!THREE) return;

  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, canvas.clientWidth / canvas.clientHeight, 0.1, 50);
    camera.position.set(0, 0.12, 8.1);
    scene.add(new THREE.HemisphereLight(0xf4eee8, 0x252633, 1.05));

    const keyLight = new THREE.DirectionalLight(0xffd9c8, 1.8);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x668cff, 4.5, 12);
    rimLight.position.set(2.6, 1.5, -1.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x48e8c5, 2.5, 10);
    fillLight.position.set(-2.8, -0.6, 3.5);
    scene.add(fillLight);

    const character = new THREE.Group();
    scene.add(character);

    const materials = {
      skin: new THREE.MeshPhysicalMaterial({ color: 0xc4826d, roughness: 0.66, clearcoat: 0.12, clearcoatRoughness: 0.72 }),
      skinLight: new THREE.MeshPhysicalMaterial({ color: 0xd99a82, roughness: 0.62, clearcoat: 0.16, clearcoatRoughness: 0.68 }),
      skinShade: new THREE.MeshStandardMaterial({ color: 0x945e55, roughness: 0.78 }),
      hair: new THREE.MeshStandardMaterial({ color: 0x211d27, roughness: 0.58 }),
      hairLight: new THREE.MeshStandardMaterial({ color: 0x514354, roughness: 0.55 }),
      hoodie: new THREE.MeshStandardMaterial({ color: 0x182840, roughness: 0.84 }),
      hoodieLight: new THREE.MeshStandardMaterial({ color: 0x5276a8, roughness: 0.62 }),
      eye: new THREE.MeshStandardMaterial({ color: 0xf1e7df, roughness: 0.28 }),
      iris: new THREE.MeshPhysicalMaterial({ color: 0x438ba6, roughness: 0.24, clearcoat: 0.8 }),
      pupil: new THREE.MeshStandardMaterial({ color: 0x14171b, roughness: 0.18 }),
      shine: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      seam: new THREE.MeshStandardMaterial({ color: 0x637d9b, roughness: 0.8 })
    };

    const torso = new THREE.Group();
    character.add(torso);
    const head = new THREE.Group();
    head.position.set(0, 0.72, 0);
    character.add(head);

    function addSphere(material, position, scale, parent = character, segments = 40) {
      const part = new THREE.Mesh(new THREE.SphereGeometry(1, segments, 32), material);
      part.position.set(position[0], position[1], position[2]);
      part.scale.set(scale[0], scale[1], scale[2]);
      parent.add(part);
      return part;
    }

    function addCurve(parent, points, material, radius = 0.012) {
      const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
      const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, radius, 8, false), material);
      parent.add(line);
      return line;
    }

    addSphere(materials.hoodie, [0, -1.05, 0], [1.12, 0.9, 0.69], torso);
    addSphere(materials.hoodieLight, [0, -0.58, 0.34], [0.5, 0.2, 0.3], torso);
    addSphere(materials.skin, [0, -0.29, 0], [0.27, 0.45, 0.29], torso);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.065, 14, 48), materials.hoodieLight);
    collar.position.set(0, -0.43, 0.2);
    collar.rotation.x = Math.PI / 2;
    torso.add(collar);
    addCurve(torso, [[-0.42, -0.8, 0.49], [-0.22, -0.96, 0.63], [0, -1.02, 0.67]], materials.seam, 0.009);
    addCurve(torso, [[0.42, -0.8, 0.49], [0.22, -0.96, 0.63], [0, -1.02, 0.67]], materials.seam, 0.009);

    addSphere(materials.skinLight, [0, 0, 0], [0.73, 0.94, 0.66], head);
    const earGeometry = new THREE.SphereGeometry(1, 32, 24);
    const blinkEyes = [];
    [-1, 1].forEach(side => {
      const ear = new THREE.Mesh(earGeometry, materials.skin);
      ear.position.set(side * 0.7, 0.03, -0.02);
      ear.scale.set(0.18, 0.24, 0.14);
      head.add(ear);
      addSphere(materials.skinShade, [side * 0.73, 0.03, 0.092], [0.06, 0.13, 0.035], head, 24);

      const eye = new THREE.Group();
      eye.position.set(side * 0.275, 0.12, 0.61);
      head.add(eye);
      blinkEyes.push(eye);
      addSphere(materials.eye, [0, 0, 0.04], [0.108, 0.125, 0.055], eye, 32);
      addSphere(materials.iris, [side * 0.008, -0.002, 0.085], [0.056, 0.073, 0.029], eye, 32);
      addSphere(materials.pupil, [side * 0.008, -0.002, 0.108], [0.029, 0.048, 0.015], eye, 24);
      addSphere(materials.shine, [-0.018, 0.026, 0.122], [0.014, 0.018, 0.008], eye, 16);

      const browPoints = side < 0
        ? [[-0.4, 0.31, 0.63], [-0.28, 0.35, 0.66], [-0.16, 0.32, 0.63]]
        : [[0.16, 0.32, 0.63], [0.28, 0.35, 0.66], [0.4, 0.31, 0.63]];
      addCurve(head, browPoints, materials.hair, 0.025);
    });

    addSphere(materials.skin, [0, -0.09, 0.675], [0.07, 0.12, 0.105], head, 32);
    addSphere(materials.skinShade, [-0.045, -0.17, 0.723], [0.022, 0.012, 0.012], head, 16);
    addSphere(materials.skinShade, [0.045, -0.17, 0.723], [0.022, 0.012, 0.012], head, 16);
    addCurve(head, [[-0.19, -0.34, 0.64], [-0.1, -0.4, 0.7], [0, -0.42, 0.72], [0.1, -0.4, 0.7], [0.19, -0.34, 0.64]], materials.skinShade, 0.018);

    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), materials.hair);
    hairCap.position.set(0, 0.74, -0.02);
    hairCap.scale.set(0.78, 0.43, 0.7);
    head.add(hairCap);
    [-0.5, -0.28, -0.05, 0.2, 0.44, 0.6].forEach((x, index) => {
      const lock = new THREE.Mesh(
        new THREE.ConeGeometry(index % 2 ? 0.2 : 0.25, index % 2 ? 0.48 : 0.6, 12),
        index % 3 === 0 ? materials.hairLight : materials.hair
      );
      lock.position.set(x, 0.94 + (index % 2) * 0.035, 0.22);
      lock.rotation.z = -x * 0.4;
      lock.rotation.x = -0.2;
      head.add(lock);
    });

    const drawstringMaterial = new THREE.MeshStandardMaterial({ color: 0xc2ccd9, roughness: 0.58 });
    [-0.12, 0.12].forEach(x => {
      const string = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.38, 10), drawstringMaterial);
      string.position.set(x, -0.9, 0.63);
      torso.add(string);
      addSphere(materials.hoodieLight, [x, -1.1, 0.63], [0.025, 0.04, 0.025], torso, 16);
    });

    const leftArm = new THREE.Group();
    leftArm.position.set(-0.82, -0.78, 0.02);
    character.add(leftArm);
    const upperArmGeometry = new THREE.CylinderGeometry(0.15, 0.19, 0.56, 20, 1);
    const leftSleeve = new THREE.Mesh(upperArmGeometry, materials.hoodie);
    leftSleeve.position.set(-0.05, -0.27, 0);
    leftSleeve.rotation.z = -0.18;
    leftArm.add(leftSleeve);
    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.4, 18, 1), materials.skinLight);
    leftForearm.position.set(-0.12, -0.7, 0.03);
    leftForearm.rotation.z = -0.12;
    leftArm.add(leftForearm);
    addSphere(materials.skinLight, [-0.15, -0.94, 0.06], [0.14, 0.16, 0.13], leftArm, 24);

    const waveArm = new THREE.Group();
    waveArm.position.set(0.82, -0.78, 0.02);
    character.add(waveArm);
    const rightSleeve = new THREE.Mesh(upperArmGeometry, materials.hoodie);
    rightSleeve.position.set(0.05, -0.27, 0);
    rightSleeve.rotation.z = 0.18;
    waveArm.add(rightSleeve);
    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.4, 18, 1), materials.skinLight);
    rightForearm.position.set(0.12, -0.7, 0.03);
    rightForearm.rotation.z = 0.12;
    waveArm.add(rightForearm);
    addSphere(materials.skinLight, [0.15, -0.94, 0.06], [0.14, 0.16, 0.13], waveArm, 24);
    addSphere(materials.skinLight, [0.28, -0.9, 0.08], [0.065, 0.11, 0.08], waveArm, 20);
    for (let finger = 0; finger < 3; finger += 1) {
      const digit = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.035, 0.16, 10), materials.skinLight);
      digit.position.set(0.12 + finger * 0.045, -1.075, 0.08);
      digit.rotation.z = (finger - 1) * 0.12;
      waveArm.add(digit);
    }

    let pointerX = 0;
    let pointerY = 0;
    canvas.addEventListener('pointermove', event => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.42;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.16;
    });

    function resizeScene() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    new ResizeObserver(resizeScene).observe(canvas);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderFrame(time) {
      if (!reduceMotion) {
        const entranceProgress = Math.min(1, time / 1500);
        const entranceEase = 1 - Math.pow(1 - entranceProgress, 3);
        const entranceSpin = Math.PI * 2 * (1 - entranceEase);
        const waveClock = time < 2600 ? -1 : (time - 2600) % 9200;
        const greeting = time < 2600
          ? time < 350 ? time / 350 : time < 1850 ? 1 : (2600 - time) / 750
          : waveClock < 1450 ? Math.sin((waveClock / 1450) * Math.PI) : 0;
        const blinkClock = time % 4700;
        const blink = Math.max(0, 1 - Math.abs(blinkClock - 150) / 90);

        character.rotation.y = pointerX + Math.sin(time * 0.0005) * 0.055 + entranceSpin;
        character.rotation.x = -pointerY + Math.sin(time * 0.00085) * 0.025;
        character.rotation.z = Math.sin(time * 0.0007) * 0.018;
        character.position.y = Math.sin(time * 0.0023) * 0.045 + Math.sin(entranceEase * Math.PI) * 0.16;
        character.scale.setScalar(0.88 + entranceEase * 0.13 + Math.sin(time * 0.006) * 0.012 * (1 - entranceEase));
        head.rotation.x = Math.sin(time * 0.0011) * 0.035;
        head.rotation.y = Math.sin(time * 0.0008) * 0.075;
        torso.scale.y = 1 + Math.sin(time * 0.0023 + 0.5) * 0.012;
        waveArm.rotation.z = 0.08 + greeting * 2.55 + Math.sin(time * 0.018) * greeting * 0.18;
        waveArm.rotation.x = Math.sin(time * 0.009) * greeting * 0.08;
        leftArm.rotation.z = -0.08 + Math.sin(time * 0.0012) * 0.025;
        blinkEyes.forEach(eye => { eye.scale.y = 1 - blink * 0.9; });
      }
      renderer.render(scene, camera);
      canvas.parentElement.classList.add('scene-ready');
      if (!reduceMotion) window.requestAnimationFrame(renderFrame);
    }

    resizeScene();
    renderFrame(0);
  } catch (error) {
    console.warn('The 3D character could not be initialized.', error);
  }
}

window.setTimeout(initHeroCharacter, 100);

// ── GITHUB API ──
async function loadGitHub() {
  const username = 'saritchoudhary';
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
    ]);
    if (!userRes.ok || !reposRes.ok) {
      throw new Error('GitHub API request failed');
    }
    const user = await userRes.json();
    const repos = await reposRes.json();

    if (user.public_repos !== undefined) {
      document.getElementById('gh-repos').textContent = user.public_repos || '0';
      document.getElementById('gh-followers').textContent = user.followers || '0';
      document.getElementById('gh-following').textContent = user.following || '0';

      // Compute total stars
      const totalStars = Array.isArray(repos)
        ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
        : 0;
      document.getElementById('gh-stars').textContent = totalStars;
    }

    const list = document.getElementById('ghRepoList');
    if (Array.isArray(repos) && repos.length > 0) {
      list.innerHTML = repos.map(r => `
        <a href="${r.html_url}" target="_blank" rel="noopener" class="gh-repo-card">
          <div class="gh-repo-name">📁 ${r.name}</div>
          <div class="gh-repo-desc">${r.description || 'No description provided.'}</div>
          <div class="gh-repo-meta">
            ${r.language ? `<span class="gh-repo-lang">● ${r.language}</span>` : ''}
            <span class="gh-repo-stars">★ ${r.stargazers_count}</span>
          </div>
        </a>
      `).join('');
    } else {
      list.innerHTML = '<div class="gh-loading">No public repositories found yet.</div>';
    }
  } catch (err) {
    document.getElementById('ghRepoList').innerHTML =
      '<div class="gh-loading">Could not load repositories. Check the GitHub profile directly.</div>';
  }
}
loadGitHub();

// ── CONTACT FORM ──
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
const sendLabel = document.getElementById('sendLabel');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const details = new URLSearchParams({
    subject: `Portfolio message from ${name}`,
    body: `${message}\n\nFrom: ${name}\nEmail: ${email}`
  });

  feedback.textContent = 'Thank you!';
  feedback.className = 'form-feedback success';
  window.location.href = `mailto:saritsherawat@gmail.com?${details}`;
});

// ── SMOOTH ANCHOR CLICK ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
