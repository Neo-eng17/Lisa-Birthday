import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState('');
  const [showLisa, setShowLisa] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Portrait entrance
    tl.fromTo(
      portraitRef.current,
      { opacity: 0, x: -30, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' }
    );

    // Label
    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    // Typing animation for heading
    const fullText = 'Happy 22nd Birthday';
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setTypedText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setShowLisa(true);
      }
    }, 100);

    tl.add(() => {
      // Description
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 }
      );
      // Buttons
      gsap.fromTo(
        buttonsRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.6 }
      );
      // Scroll indicator
      gsap.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out', delay: 1.3 }
      );
    }, '+=0.5');

    return () => {
      clearInterval(typeInterval);
      tl.kill();
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #060B14 0%, #0A1A30 40%, #0D2137 70%, #0A1628 100%)',
      }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
          {/* Left - Portrait */}
          <div ref={portraitRef} className="flex justify-center lg:justify-end opacity-0">
            <div className="relative">
              {/* Glowing border effect */}
              <div
                className="absolute -inset-1 rounded-2xl animate-border-shimmer"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,212,255,0.5), rgba(0,150,255,0.2), rgba(0,212,255,0.5), rgba(0,150,255,0.2))',
                  backgroundSize: '200% 100%',
                  filter: 'blur(8px)',
                  opacity: 0.6,
                }}
              />
              <div className="relative glass-card p-2 max-w-[380px] w-full">
                <img
                  src="/lisa-hero.png"
                  alt="Lisa - Beautiful portrait in cosmic setting"
                  className="w-full rounded-xl object-cover"
                  style={{ aspectRatio: '3/4' }}
                  loading="eager"
                />
                {/* Floating particles around portrait */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-cyan/40"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: i % 2 === 0 ? '-12px' : 'calc(100% + 4px)',
                      animation: `float ${4 + i}s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                      boxShadow: '0 0 8px rgba(0, 212, 255, 0.5)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right - Text */}
          <div className="text-center lg:text-left">
            <p
              ref={labelRef}
              className="section-label mb-4 opacity-0"
            >
              May 16 • A Day the Universe Smiled
            </p>

            <h1
              ref={headingRef}
              className="font-display font-bold text-white mb-2"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              <span className="glow-text">{typedText}</span>
              <span className="animate-[blink_0.8s_step-end_infinite] text-cyan">|</span>
            </h1>

            {showLisa && (
              <h2
                className="font-display font-bold text-gradient-cyan mb-6 animate-fade-in-up"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 40px rgba(0, 212, 255, 0.5)',
                }}
              >
                Lisa
              </h2>
            )}

            <p
              ref={descRef}
              className="text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 opacity-0"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              To the girl who turned a simple mentorship into the most beautiful friendship. 
              Your intelligence lights up every conversation, your maturity inspires me daily, 
              and your smile, even through a screen has the power to brighten my darkest days. 
              You're not just 22, you're 22 years of pure magic.
            </p>

            <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center lg:justify-start opacity-0">
              <button onClick={() => scrollTo('#story')} className="btn-cyan">
                Begin Our Story
              </button>
              <button onClick={() => scrollTo('#memories')} className="btn-outline">
                Open Memories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
          Scroll to explore
        </span>
        <ChevronDown className="w-5 h-5 text-cyan animate-bounce-subtle" />
      </div>
    </section>
  );
}
