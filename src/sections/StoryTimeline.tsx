import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, BookOpen, PhoneCall, Heart, Laugh, Crown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    date: 'May 2025',
    title: 'The Beginning',
    description:
      'You were 21, searching for guidance in digital skills. I was just someone ready to help. Neither of us knew that a simple mentorship message would become the start of something solid and Impactful.',
    icon: Sparkles,
    side: 'left' as const,
  },
  {
    date: 'June 2025',
    title: 'First Classes',
    description:
      'Google Meet sessions filled with explanations, examples, and that adorable confused voice you tried to straighten up. You were determined, focused, and already showing signs of the brilliant lady you\'d become.',
    icon: BookOpen,
    side: 'right' as const,
  },
  {
    date: 'July 2025',
    title: 'The debateful Calls',
    description:
      'The classes ended but the conversations didn\'t. We started talking about life, dreams, fears, and everything in between. Those wisdomful calls became the highlight of my days.',
    icon: PhoneCall,
    side: 'left' as const,
  },
  {
    date: 'August 2025',
    title: 'Growing Closer',
    description:
      'From mentorship to friendship, a transition so natural it felt like it was always meant to be. You shared your world with me, and I found myself wanting to be part of it.',
    icon: Heart,
    side: 'right' as const,
  },
  {
    date: 'September 2025',
    title: 'The honesty Begins',
    description:
      'The inside jokes, the witty comebacks, you matched my energy perfectly. Your intelligence shines through every teasing remark, making me smile at my phone like an idiot.',
    icon: Laugh,
    side: 'left' as const,
  },
  {
    date: 'May 2026',
    title: 'One Year of Us',
    description:
      'One year. Countless messages, endless laughter, shared dreams, and a bond that distance couldn\'t weaken. You turned 22 today, and I\'m honored to know you, Lisa.',
    icon: Crown,
    side: 'right' as const,
  },
];

export default function StoryTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.timeline-heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.timeline-heading',
            start: 'top 85%',
          },
        }
      );

      // Card animations
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const isLeft = timelineData[i].side === 'left';
        gsap.fromTo(
          card,
          { opacity: 0, x: isLeft ? -60 : 60, rotateY: isLeft ? 10 : -10 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative py-20 lg:py-32"
      style={{
        background: '#0A1628',
        backgroundImage: 'radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)',
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="timeline-heading text-center mb-16 lg:mb-24">
          <p className="section-label mb-3">01 • OUR JOURNEY</p>
          <h2 className="section-heading mb-4">How the Stars Aligned</h2>
          <p className="section-subtext max-w-xl mx-auto">
            Every great friendship has a beginning. Ours started with a simple message...
          </p>
          <div className="w-10 h-[2px] bg-gradient-to-r from-cyan to-transparent mx-auto mt-4" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central line */}
          <div
            className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px]"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.6) 20%, rgba(0,212,255,0.6) 80%, transparent)',
            }}
          />

          {/* Cards */}
          <div className="space-y-12 lg:space-y-16">
            {timelineData.map((item, index) => {
              const Icon = item.icon;
              const isLeft = item.side === 'left';

              return (
                <div
                  key={index}
                  className={`relative flex items-start ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Card */}
                  <div
                    ref={(el) => { cardsRef.current[index] = el; }}
                    className={`ml-10 md:ml-0 md:w-[45%] ${isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}
                    style={{ perspective: '1000px' }}
                  >
                    <div className="glass-card p-6 relative animate-float-slow" style={{ animationDelay: `${index * 0.5}s`, animationDuration: `${5 + index}s` }}>
                      {/* Icon */}
                      <div className="absolute top-4 right-4">
                        <Icon className="w-5 h-5 text-cyan" />
                      </div>

                      <p className="section-label mb-2">{item.date}</p>
                      <h3 className="font-display text-xl font-semibold text-white mb-3">{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div
                    className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-6"
                  >
                    <div
                      className="w-3 h-3 rounded-full bg-cyan animate-pulse"
                      style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.6)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
