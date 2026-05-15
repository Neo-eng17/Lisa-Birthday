import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface Firework {
  x: number;
  y: number;
  particles: FireworkParticle[];
}

export default function GrandFinale() {
  const sectionRef = useRef<HTMLElement>(null);
  const fireworksCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const hasTriggered = useRef<boolean>(false);

  // Launch firework
  const launchFirework = useCallback(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;

    const colors = ['#00D4FF', '#33DDFF', '#FFFFFF', '#FFE4A1', '#FF6B9D', '#99EEFF'];
    const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;

    const particles: FireworkParticle[] = [];
    const count = 40 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.random() * 3,
        life: 1,
        maxLife: 0.8 + Math.random() * 0.4,
      });
    }

    fireworksRef.current.push({ x, y, particles });
  }, []);

  // Fireworks animation
  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let lastLaunch = 0;
    function animate(timestamp: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Launch new fireworks
      if (hasTriggered.current && timestamp - lastLaunch > 2000 + Math.random() * 2000) {
        launchFirework();
        lastLaunch = timestamp;
      }

      // Update and draw fireworks
      for (let f = fireworksRef.current.length - 1; f >= 0; f--) {
        const fw = fireworksRef.current[f];
        let alive = false;

        for (const p of fw.particles) {
          if (p.life <= 0) continue;
          alive = true;

          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // gravity
          p.vx *= 0.98; // friction
          p.life -= 0.008;

          ctx.beginPath();
          ctx.arc(fw.x + p.x, fw.y + p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(fw.x + p.x, fw.y + p.y, p.size * p.life * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life * 0.2;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        if (!alive) {
          fireworksRef.current.splice(f, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [launchFirework]);

  // Confetti burst on entrance
  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const confetti: { x: number; y: number; vx: number; vy: number; w: number; h: number; color: string; rotation: number; rotSpeed: number }[] = [];
    const colors = ['#00D4FF', '#FF6B9D', '#FFE4A1', '#33DDFF', '#FFFFFF'];

    function burst() {
      for (let i = 0; i < 80; i++) {
        confetti.push({
          x: canvas!.width / 2,
          y: canvas!.height / 3,
          vx: (Math.random() - 0.5) * 16,
          vy: -Math.random() * 12 - 4,
          w: 4 + Math.random() * 6,
          h: 2 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
        });
      }
    }

    let animId: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.15;
        c.vx *= 0.99;
        c.rotation += c.rotSpeed;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();

        if (c.y > canvas.height + 20) {
          confetti.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(animate);
    }

    // Trigger burst after delay
    const timer = setTimeout(() => {
      burst();
      animate();
    }, 1000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
    };
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          hasTriggered.current = true;

          gsap.fromTo('.finale-bg', { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' });
          gsap.fromTo(
            '.giant-age',
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
          );
          gsap.fromTo(
            '.birthday-text',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
          );
          gsap.fromTo(
            '.closing-text',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 }
          );
          gsap.fromTo(
            '.finale-quote',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.2 }
          );
          gsap.fromTo(
            '.finale-buttons',
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.5 }
          );
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <section
      id="finale"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center justify-center py-20 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="finale-bg absolute inset-0 opacity-0"
        style={{
          backgroundImage: 'url(/lisa-celebration.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(6,11,20,0.3) 0%, rgba(6,11,20,0.8) 100%)',
        }}
      />

      {/* Fireworks canvas */}
      <canvas
        ref={fireworksCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Confetti canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Floating hearts */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none z-5"
          style={{
            left: `${5 + i * 12}%`,
            bottom: '-20px',
            animation: `float ${10 + i * 2}s linear infinite`,
            animationDelay: `${i * 1.2}s`,
          }}
        >
          <svg
            width={16 + i * 3}
            height={16 + i * 3}
            viewBox="0 0 24 24"
            fill="#00D4FF"
            style={{ opacity: 0.25 }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Giant 22 */}
        <div
          className="giant-age font-display font-bold pointer-events-none select-none mb-4"
          style={{
            fontSize: 'clamp(6rem, 15vw, 12rem)',
            color: 'rgba(0, 212, 255, 0.06)',
            lineHeight: 1,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -60%)',
            zIndex: 0,
          }}
        >
          22
        </div>

        {/* Birthday text */}
        <h2
          className="birthday-text font-display font-bold text-white opacity-0 relative z-10"
          style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            lineHeight: 1.1,
            textShadow: '0 0 60px rgba(0, 212, 255, 0.5), 0 0 120px rgba(0, 212, 255, 0.2)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}
        >
          <span className="text-gradient-cyan">Happy Birthday,</span>
          <br />
          <span className="text-white">Lisa</span>
        </h2>

        {/* Closing statement */}
        <p
          className="closing-text text-lg lg:text-xl max-w-2xl mx-auto mt-8 mb-6 opacity-0"
          style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7 }}
        >
          Some people become memories. You became a chapter I never want to end. 
          Thank you for one incredible year, Lisa. Here's to many more.
        </p>

        {/* Quote */}
        <div className="finale-quote mb-10 opacity-0 relative">
          <span
            className="absolute -top-6 left-1/2 -translate-x-1/2 font-display text-6xl"
            style={{ color: 'rgba(0, 212, 255, 0.08)' }}
          >
            &ldquo;
          </span>
          <p className="font-accent text-xl lg:text-2xl text-cyan relative z-10">
            The best friendships don't need proximity.
            <br />
            They need two souls that understand each other.
          </p>
        </div>

        {/* Buttons */}
        <div className="finale-buttons flex flex-wrap gap-4 justify-center opacity-0">
          <button onClick={replay} className="btn-outline">
            <RotateCcw className="w-4 h-4" />
            Replay Experience
          </button>
          <button onClick={scrollToTop} className="btn-cyan">
            <ArrowUp className="w-4 h-4" />
            Back to Top
          </button>
        </div>
      </div>
    </section>
  );
}
