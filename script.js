/* ============================================================
   SAMYAK KAMBLE – PORTFOLIO
   script.js  |  Animations, Particles, Interactions
   ============================================================ */

"use strict";

/* ====================== 1. LOADER ====================== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("loaded");
  }, 900);
});

/* ====================== 2. CUSTOM CURSOR ====================== */
const cursorDot  = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

let mouseX = -100, mouseY = -100;
let ringX  = -100, ringY  = -100;
let raf;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top  = `${mouseY}px`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top  = `${ringY}px`;
  raf = requestAnimationFrame(animateRing);
}
animateRing();

// Grow ring on hover over interactive elements
document.querySelectorAll("a, button, .glass-card, .skill-tag, .tech-pill").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorRing.style.width  = "48px";
    cursorRing.style.height = "48px";
    cursorRing.style.borderColor = "var(--accent-cyan)";
  });
  el.addEventListener("mouseleave", () => {
    cursorRing.style.width  = "32px";
    cursorRing.style.height = "32px";
    cursorRing.style.borderColor = "rgba(0,212,255,0.5)";
  });
});

/* ====================== 3. PARTICLE CANVAS ====================== */
const canvas  = document.getElementById("particleCanvas");
const ctx     = canvas.getContext("2d");
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.vx   = (Math.random() - 0.5) * 0.35;
    this.vy   = (Math.random() - 0.5) * 0.35;
    this.r    = Math.random() * 1.5 + 0.4;
    this.life = Math.random() * 0.6 + 0.2;
    this.maxLife = this.life;
    // Alternate between accent colours
    const colours = [
      "rgba(0,212,255,",
      "rgba(58,124,255,",
      "rgba(139,92,246,",
    ];
    this.colour = colours[Math.floor(Math.random() * colours.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.0008;
    if (this.life <= 0 || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  }

  draw() {
    const alpha = (this.life / this.maxLife) * 0.7;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `${this.colour}${alpha})`;
    ctx.fill();
  }
}

// Connection lines between nearby particles
function drawConnections() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }
  }
}

const PARTICLE_COUNT = window.innerWidth < 640 ? 60 : 120;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p) => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ====================== 4. TYPING ANIMATION ====================== */
const typingEl = document.getElementById("typingText");

// ✏️ Update typing strings to change what is typed in the hero
const strings = [
  "Data Engineer",
  "Azure Data Engineer",
  "SQL & Python Expert",
  "ETL Pipeline Builder",
  "AI Analytics Enthusiast",
  "Power BI & Tableau",
];

let strIndex   = 0;
let charIndex  = 0;
let isDeleting = false;

function type() {
  const current = strings[strIndex];

  if (!isDeleting) {
    typingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 65);
  } else {
    typingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      strIndex   = (strIndex + 1) % strings.length;
    }
    setTimeout(type, 35);
  }
}
setTimeout(type, 1200);

/* ====================== 5. NAVBAR SCROLL BEHAVIOUR ====================== */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  // Add scrolled class after 60px
  if (currentScroll > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Active nav link
  let current = "";
  sections.forEach((sec) => {
    const top    = sec.offsetTop - var_navHeight();
    const height = sec.offsetHeight;
    if (currentScroll >= top && currentScroll < top + height) {
      current = sec.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });

  lastScroll = currentScroll;
});

function var_navHeight() {
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
  ) || 72;
}

/* ====================== 6. HAMBURGER MENU ====================== */
const hamburger = document.getElementById("hamburger");
const navLinksEl = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinksEl.classList.toggle("open");
  const isOpen = navLinksEl.classList.contains("open");
  hamburger.setAttribute("aria-expanded", isOpen);
  // Animate spans
  const spans = hamburger.querySelectorAll("span");
  if (isOpen) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity   = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  } else {
    spans[0].style.transform = "";
    spans[1].style.opacity   = "";
    spans[2].style.transform = "";
  }
});

// Close nav on link click (mobile)
navLinksEl.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinksEl.classList.remove("open");
    hamburger.querySelectorAll("span").forEach((s) => {
      s.style.transform = "";
      s.style.opacity   = "";
    });
  });
});

/* ====================== 7. SCROLL REVEAL ====================== */
const revealEls = document.querySelectorAll("[data-reveal], [data-reveal-right]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if multiple in same section
        const delay = Array.from(revealEls).indexOf(entry.target) * 60;
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, Math.min(delay, 300));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ====================== 8. COUNTER ANIMATION ====================== */
const statNums = document.querySelectorAll(".stat-num");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target) || 0;
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach((el) => counterObserver.observe(el));

function animateCounter(el, target) {
  let count    = 0;
  const step   = Math.max(1, Math.ceil(target / 40));
  const timer  = setInterval(() => {
    count += step;
    if (count >= target) {
      count = target;
      clearInterval(timer);
    }
    el.textContent = count;
  }, 35);
}

/* ====================== 9. GLASS CARD 3D TILT ====================== */
const tiltCards = document.querySelectorAll(".project-card, .cert-card, .highlight-card");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const cx    = rect.width  / 2;
    const cy    = rect.height / 2;
    const rotX  = ((y - cy) / cy) * -6;
    const rotY  = ((x - cx) / cx) *  6;
    card.style.transform   = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    card.style.transition  = "transform 0.1s ease";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform   = "";
    card.style.transition  = "transform 0.4s ease, box-shadow 0.35s, border-color 0.35s";
  });
});

/* ====================== 10. SMOOTH SCROLL FOR ANCHOR LINKS ====================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = var_navHeight() + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ====================== 11. CONTACT FORM FEEDBACK ====================== */
const formSubmit = document.querySelector(".form-submit");

if (formSubmit) {
  formSubmit.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".form-input, .form-textarea");
    let hasValue = false;
    inputs.forEach((inp) => { if (inp.value.trim()) hasValue = true; });

    if (!hasValue) {
      formSubmit.textContent = "Please fill in the form!";
      formSubmit.style.background = "linear-gradient(135deg,#ef4444,#dc2626)";
      setTimeout(() => {
        formSubmit.innerHTML = '<i class="ri-send-plane-2-line"></i> Send Message';
        formSubmit.style.background = "";
      }, 2000);
      return;
    }

    formSubmit.innerHTML = '<i class="ri-check-line"></i> Message Sent!';
    formSubmit.style.background = "linear-gradient(135deg,#10b981,#059669)";
    formSubmit.disabled = true;

    setTimeout(() => {
      formSubmit.innerHTML = '<i class="ri-send-plane-2-line"></i> Send Message';
      formSubmit.style.background = "";
      formSubmit.disabled = false;
      inputs.forEach((inp) => (inp.value = ""));
    }, 3000);
  });
}

/* ====================== 12. SKILL TAGS GLOW ON HOVER ====================== */
const skillTags = document.querySelectorAll(".skill-tag, .tech-pill");

skillTags.forEach((tag) => {
  tag.addEventListener("mouseenter", () => {
    tag.style.boxShadow = "0 0 16px rgba(0,212,255,0.25)";
  });
  tag.addEventListener("mouseleave", () => {
    tag.style.boxShadow = "";
  });
});

/* ====================== 13. PIPELINE NODE HIGHLIGHT ON HOVER ====================== */
const pipelineNodes = document.querySelectorAll(".pipeline-node");

pipelineNodes.forEach((node) => {
  node.addEventListener("mouseenter", () => {
    node.style.borderColor = "var(--accent-cyan)";
    node.style.boxShadow   = "0 0 20px rgba(0,212,255,0.3)";
    node.style.color       = "var(--text-primary)";
  });
  node.addEventListener("mouseleave", () => {
    node.style.borderColor = "";
    node.style.boxShadow   = "";
    node.style.color       = "";
  });
});

/* ====================== 14. GLOWING BACKGROUND BLOB EFFECT ====================== */
// Subtle mouse-following glow
const glowEl = document.createElement("div");
glowEl.style.cssText = `
  position: fixed;
  width: 500px; height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: left 0.8s ease, top 0.8s ease;
`;
document.body.appendChild(glowEl);

document.addEventListener("mousemove", (e) => {
  glowEl.style.left = `${e.clientX}px`;
  glowEl.style.top  = `${e.clientY}px`;
});

/* ====================== 15. SECTION ENTRANCE GLOW LINE ====================== */
// Draw a glowing top border on section enter
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty("--section-entered", "1");
      }
    });
  },
  { threshold: 0.05 }
);

document.querySelectorAll(".section").forEach((sec) => sectionObserver.observe(sec));

/* ====================== 16. ARCH NODE PULSE ON VIEWPORT ====================== */
const archNodes = document.querySelectorAll(".arch-node");

const archObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      archNodes.forEach((node, i) => {
        setTimeout(() => {
          node.style.opacity   = "1";
          node.style.transform = "translateY(0)";
        }, i * 80);
      });
      archObserver.disconnect();
    }
  },
  { threshold: 0.3 }
);

// Initial hidden state
archNodes.forEach((node) => {
  node.style.opacity   = "0";
  node.style.transform = "translateY(10px)";
  node.style.transition = "opacity 0.4s ease, transform 0.4s ease";
});

const archSection = document.querySelector(".arch-flow");
if (archSection) archObserver.observe(archSection);

/* ====================== 17. COPY EMAIL ON CLICK ====================== */
const emailCard = document.querySelector('a[href^="mailto"]');
if (emailCard) {
  emailCard.title = "Click to send an email";
}

/* ====================== 18. SCROLL PROGRESS BAR ====================== */
const progressBar = document.createElement("div");
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, #00d4ff, #3a7cff, #8b5cf6);
  z-index: 9999;
  width: 0%;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
});

/* ====================== 19. REDUCE MOTION SUPPORT ====================== */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  cancelAnimationFrame(raf);
  document.querySelectorAll("[data-reveal],[data-reveal-right]").forEach((el) => {
    el.classList.add("visible");
  });
  // Remove particle canvas
  canvas.style.display = "none";
  glowEl.style.display = "none";
}
