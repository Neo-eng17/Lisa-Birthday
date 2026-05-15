import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Brain,
  Heart,
  Target,
  Sparkles,
  Crown,
  Laugh,
  Clock,
  Eye,
  Moon,
  Star,
  TrendingUp,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  { icon: Brain, title: 'Your Intelligence', subtitle: 'The way you process the world is fascinating' },
  { icon: Heart, title: 'Your Emotional Maturity', subtitle: 'You feel deeply and wisely' },
  { icon: Target, title: 'Your Discipline', subtitle: 'You set goals and you achieve them' },
  { icon: Sparkles, title: 'Your Kindness', subtitle: 'Even when no one is watching' },
  { icon: Crown, title: 'Your Standards', subtitle: 'You know your worth. Never lower it.' },
  { icon: Laugh, title: 'Your Wit', subtitle: 'The comebacks that make me laugh for days' },
  { icon: Clock, title: 'Your Consistency', subtitle: 'Day after day, you show up as you' },
  { icon: Eye, title: 'Your Presence', subtitle: 'When you listen, people feel heard' },
  { icon: Moon, title: 'Your Calmness', subtitle: 'A steady light in chaotic times' },
  { icon: Star, title: 'Your Beauty', subtitle: 'Inside and out, effortlessly' },
  { icon: TrendingUp, title: 'Your Growth Mindset', subtitle: 'Always becoming, never settling' },
];

export default function ReasonsWhy() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reasons-heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.reasons-heading', start: 'top 85%' },
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const randomX = (Math.random() - 0.5) * 40;
        const randomY = (Math.random() - 0.5) * 30;
        const randomRotate = (Math.random() - 0.5) * 6;

        gsap.fromTo(
          card,
          { opacity: 0, x: randomX, y: randomY + 30, rotate: randomRotate },
          {
            opacity: 1, x: 0, y: 0, rotate: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.08,
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
      id="reasons"
      ref={sectionRef}
      className="relative py-20 lg:py-32"
      style={{
        background: '#060B14',
        backgroundImage: `
          radial-gradient(ellipse at 30% 20%, rgba(0,212,255,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(255,107,157,0.05) 0%, transparent 50%)
        `,
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="reasons-heading text-center mb-12 lg:mb-16">
          <p className="section-label mb-3">07 • THE TRUTH</p>
          <h2 className="section-heading mb-4">Why You're Extraordinary</h2>
          <p className="section-subtext max-w-xl mx-auto">
            In case you ever forget, here are a few reminders.
          </p>
          <div className="w-10 h-[2px] bg-gradient-to-r from-cyan to-transparent mx-auto mt-4" />
        </div>

        {/* Floating Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={i}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="opacity-0 cursor-default"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  animation: `float ${4 + (i % 4)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                <div
                  className="glass-card p-6 h-full transition-all duration-300"
                  style={{
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                    borderColor: isHovered ? 'rgba(0, 212, 255, 0.5)' : 'rgba(0, 212, 255, 0.2)',
                    boxShadow: isHovered
                      ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 212, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                      : undefined,
                  }}
                >
                  <Icon
                    className="w-6 h-6 mb-3 transition-colors duration-300"
                    style={{ color: isHovered ? '#00D4FF' : 'rgba(0, 212, 255, 0.7)' }}
                  />
                  <h3 className="font-display text-lg font-semibold text-white mb-1">
                    {reason.title}
                  </h3>
                  <p
                    className="text-sm transition-all duration-300"
                    style={{
                      color: isHovered ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.35)',
                      opacity: isHovered ? 1 : 0.7,
                    }}
                  >
                    {reason.subtitle}
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
