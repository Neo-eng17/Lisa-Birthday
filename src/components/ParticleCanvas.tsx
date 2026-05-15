import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export default function ParticleCanvas({ density = 'normal' }: { density?: 'low' | 'normal' | 'high' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const countMap = { low: isMobile ? 15 : 30, normal: isMobile ? 30 : 60, high: isMobile ? 50 : 100 };
    const particleCount = countMap[density];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const colors = ['#00D4FF', 'rgba(0, 150, 255, 0.5)', 'rgba(255, 228, 161, 0.4)', 'rgba(0, 212, 255, 0.3)'];
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.5 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', handleMouseMove);

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.speedX += (dx / dist) * force * 0.5;
          p.speedY += (dy / dist) * force * 0.5;
        }

        // Movement with sine wave
        p.x += p.speedX + Math.sin(Date.now() * 0.001 + i) * 0.2;
        p.y += p.speedY;

        // Damping
        p.speedX *= 0.99;
        p.speedY *= 0.99;

        // Base speed (upward drift)
        p.speedY -= 0.001;

        // Wrap around
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fill();

        // Draw connection lines
        if (density === 'high' || density === 'normal') {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
            if (d < 150) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - d / 150)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
