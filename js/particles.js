/* ==========================================================================
   SchemaMorph 3NF - Ambient Constellation & Particle Matrix Background
   ========================================================================== */

class ParticleMatrix {
  constructor(canvasId = "ambientCanvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.symbols = ["1NF", "2NF", "3NF", "PK", "FK", "X → Y", "σ", "π", "⋈", "R(A,B)", "dom(A)", "X⁺"];
    this.mouse = { x: null, y: null, radius: 140 };
    this.theme = "light";
    this.animationId = null;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.setupListeners();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setTheme(theme) {
    this.theme = theme;
  }

  setupListeners() {
    window.addEventListener("resize", () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    window.addEventListener("click", (e) => {
      this.createClickBurst(e.clientX, e.clientY);
    });
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 18000), 75);

    for (let i = 0; i < count; i++) {
      const isSymbol = Math.random() < 0.28;
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: isSymbol ? 0 : Math.random() * 2.5 + 1.2,
        isSymbol: isSymbol,
        symbolText: isSymbol ? this.symbols[Math.floor(Math.random() * this.symbols.length)] : "",
        color: this.getRandomColor(),
        alpha: Math.random() * 0.45 + 0.15,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }
  }

  createClickBurst(x, y) {
    const burstCount = 8;
    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount;
      const speed = Math.random() * 2.5 + 1.5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2 + 1,
        isSymbol: false,
        symbolText: "",
        color: "#3B82F6",
        alpha: 0.8,
        decay: 0.03,
        pulseSpeed: 0,
        pulseAngle: 0
      });
    }
  }

  getRandomColor() {
    const colors = [
      "#3B82F6", // Blue
      "#0284C7", // Cyan
      "#7C3AED", // Purple
      "#059669", // Emerald
      "#D97706", // Gold
      "#E11D48"  // Rose
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate() {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const isDark = document.body.classList.contains("dark-theme");

    // Draw connecting constellation lines
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * (isDark ? 0.15 : 0.08);
          this.ctx.strokeStyle = isDark ? `rgba(147, 197, 253, ${alpha})` : `rgba(59, 130, 246, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Update and draw each particle
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Pulse alpha
      p.pulseAngle += p.pulseSpeed;
      const currentAlpha = p.decay ? (p.alpha -= p.decay) : p.alpha + Math.sin(p.pulseAngle) * 0.08;

      if (p.decay && p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Bounce off borders
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse interactivity (gentle repulsion)
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const mdx = p.x - this.mouse.x;
        const mdy = p.y - this.mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < this.mouse.radius) {
          const force = (1 - mDist / this.mouse.radius) * 1.5;
          p.x += (mdx / mDist) * force * 2;
          p.y += (mdy / mDist) * force * 2;
        }
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));

      if (p.isSymbol) {
        this.ctx.font = isDark ? "600 11px 'JetBrains Mono', monospace" : "600 10px 'JetBrains Mono', monospace";
        this.ctx.fillStyle = isDark ? "#94A3B8" : "#64748B";
        this.ctx.fillText(p.symbolText, p.x, p.y);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = isDark ? 8 : 4;
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

// Confetti Celebration Engine
class ConfettiCannon {
  constructor(canvasId = "confettiCanvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 90) {
    const colors = ["#3B82F6", "#7C3AED", "#10B981", "#F59E0B", "#EC4899", "#06B6D4", "#F43F5E"];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.18,
        drag: 0.96,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle"
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.render();
    }
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.009;

      if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.render());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

window.particleMatrix = null;
window.confettiCannon = null;

document.addEventListener("DOMContentLoaded", () => {
  window.particleMatrix = new ParticleMatrix("ambientCanvas");
  window.confettiCannon = new ConfettiCannon("confettiCanvas");
});
