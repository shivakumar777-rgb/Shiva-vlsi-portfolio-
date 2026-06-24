// ══ CIRCUIT BOARD CANVAS ANIMATION ══
(function () {
  const canvas = document.getElementById('circuit-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], pulses = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initNodes();
  }

  function initNodes() {
    nodes = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        connections: []
      });
    }
    // Connect nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = dist(nodes[i], nodes[j]);
        if (d < 160) nodes[i].connections.push(j);
      }
    }
  }

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function spawnPulse() {
    if (nodes.length < 2) return;
    const ni = Math.floor(Math.random() * nodes.length);
    const n = nodes[ni];
    if (!n.connections.length) return;
    const nj = n.connections[Math.floor(Math.random() * n.connections.length)];
    pulses.push({
      from: ni,
      to: nj,
      progress: 0,
      speed: 0.008 + Math.random() * 0.012
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      for (const j of n.connections) {
        const m = nodes[j];
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        // Right-angle routing
        ctx.lineTo(m.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = 'rgba(0, 180, 220, 0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
      ctx.fill();
    }

    // Draw pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.progress += p.speed;
      if (p.progress >= 1) { pulses.splice(i, 1); continue; }

      const from = nodes[p.from];
      const to   = nodes[p.to];
      // Lerp along right-angle path
      let px, py;
      if (p.progress < 0.5) {
        const t = p.progress * 2;
        px = from.x + (to.x - from.x) * t;
        py = from.y;
      } else {
        const t = (p.progress - 0.5) * 2;
        px = to.x;
        py = from.y + (to.y - from.y) * t;
      }

      const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
      g.addColorStop(0, 'rgba(0, 212, 255, 0.9)');
      g.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    // Spawn pulses occasionally
    if (Math.random() < 0.04) spawnPulse();

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ══ NAVBAR SCROLL ══
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.background = 'rgba(10, 15, 30, 0.97)';
  } else {
    navbar.style.background = 'rgba(10, 15, 30, 0.85)';
  }
});

// ══ HAMBURGER ══
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ══ SCROLL REVEAL ══
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.skill-category, .project-card, .cert-card, .timeline-card, .contact-card, .achievement, .about-link-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
