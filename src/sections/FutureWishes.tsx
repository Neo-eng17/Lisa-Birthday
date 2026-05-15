import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, GraduationCap, Plane, Trophy, Camera, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const wishes = [
  { icon: Phone, text: 'Beautiful experiences, meaningful conversations, and days that leave us smiling long after they end.' },
  { icon: GraduationCap, text: "Watching you achieve every academic goal you set" },
  { icon: Plane, text: 'The day we finally meet in person (it\'s coming)' },
  { icon: Trophy, text: 'Seeing you become the successful woman you\'re destined to be' },
  { icon: Camera, text: 'Creating real memories beyond screens and messages' },
  { icon: Heart, text: 'More years of friendship, laughter, and growing together' },
];

export default function FutureWishes() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.wishes-heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.wishes-heading', start: 'top 85%' },
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.9, y: 30 },
          {
            opacity: 1, scale: 1, y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="wishes"
      ref={sectionRef}
      className="relative py-20 lg:py-32 min-h-screen flex items-center"
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/lisa-future.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(6, 11, 20, 0.75)' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Heading */}
        <div className="wishes-heading text-center mb-12 lg:mb-16">
          <p className="section-label mb-3">08 • THE FUTURE</p>
          <h2 className="section-heading mb-4">Here's to What's Next</h2>
          <p className="section-subtext max-w-xl mx-auto">
            The best chapters are the ones we haven't written yet.
          </p>
          <div className="w-10 h-[2px] bg-gradient-to-r from-cyan to-transparent mx-auto mt-4" />
        </div>

        {/* Wishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishes.map((wish, i) => {
            const Icon = wish.icon;
            return (
              <div
                key={i}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="opacity-0"
                style={{
                  animation: `float ${5 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                <div
                  className="p-7 rounded-2xl text-center h-full transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(10, 22, 40, 0.55)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Icon
                    className="w-7 h-7 mx-auto mb-4"
                    style={{ color: i % 2 === 0 ? '#00D4FF' : '#FFE4A1' }}
                  />
                  <p className="text-base lg:text-lg text-white leading-relaxed">
                    {wish.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
