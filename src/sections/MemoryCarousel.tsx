import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    image: '/lisa-study.png',
    caption: 'The Dedicated Student',
    quote:
      'This was the beginning — you, determined and focused, ready to conquer the digital world. Even through a screen, your dedication was undeniable.',
  },
  {
    image: '/lisa-calls.png',
    caption: 'Late Night Conversations',
    quote:
      'From mentorship calls to hours of talking about everything and nothing. Those calls became my sanctuary.',
  },
  {
    image: '/lisa-messages.png',
    caption: 'Your Beautiful Smile',
    quote:
      'This smile looked like peace disguised as confidence. Like someone who knows her worth but stays humble about it.',
  },
  {
    image: '/lisa-moon.png',
    caption: 'Our Digital Constellation',
    quote:
      'Two souls connected across distance, building a universe of memories one message at a time.',
  },
];

export default function MemoryCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0) {
        setCurrent(slides.length - 1);
      } else if (index >= slides.length) {
        setCurrent(0);
      } else {
        setCurrent(index);
      }
    },
    []
  );

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = setInterval(() => {
      goTo(current + 1);
    }, 5000);
    return () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
  }, [current, isPlaying, goTo]);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.carousel-heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.carousel-heading', start: 'top 85%' },
        }
      );
      gsap.fromTo(
        '.carousel-container',
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.carousel-container', start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, goTo]);

  // Touch/swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  };

  return (
    <section
      id="memories"
      ref={sectionRef}
      className="relative py-20 lg:py-32"
      style={{
        background: '#060B14',
        backgroundImage: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,11,20,0.6) 100%)',
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="carousel-heading text-center mb-12">
          <p className="section-label mb-3">02 • MEMORIES</p>
          <h2 className="section-heading mb-4">Moments That Matter</h2>
          <p className="section-subtext max-w-xl mx-auto">
            Every photo you shared became a treasure. Every smile, a memory etched in time.
          </p>
          <div className="w-10 h-[2px] bg-gradient-to-r from-cyan to-transparent mx-auto mt-4" />
        </div>

        {/* Carousel */}
        <div
          className="carousel-container relative"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides */}
          <div className="relative aspect-video rounded-2xl overflow-hidden glass-card">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-800 ${
                  index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Caption overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 lg:p-8"
                  style={{
                    background: 'rgba(6, 11, 20, 0.7)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <h3 className="font-display text-xl lg:text-2xl font-semibold text-white mb-2">
                    {slide.caption}
                  </h3>
                  <p className="text-sm lg:text-base italic" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    "{slide.quote}"
                  </p>
                </div>
              </div>
            ))}

            {/* Floating hearts decoration */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  left: `${15 + i * 25}%`,
                  bottom: `${20 + Math.random() * 30}%`,
                  animation: `float ${8 + i * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 1.5}s`,
                  opacity: 0.3,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF6B9D">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full glass-card flex items-center justify-center hover:border-cyan/50 transition-all hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full glass-card flex items-center justify-center hover:border-cyan/50 transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? 'bg-cyan scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                style={index === current ? { boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)' } : {}}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
