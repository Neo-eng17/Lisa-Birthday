import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const letterContent = `One year ago, you were a stranger with a hunger to learn. Today, you're one of the most important people in my life. Funny how the universe works, isn't it?

I've watched you grow from a curious 21-year-old into this incredible 22-year-old woman. I've seen your determination when things get hard. I've heard your laughter through late-night calls. I've read your messages that somehow always know exactly what I need to hear.

You are intelligent in a way that makes every conversation a journey. Mature beyond your years, yet never too serious to laugh at yourself. Emotionally aware — you feel deeply, and that is your superpower. Your standards are high because you know your worth, and that respect you demand? You give it tenfold to everyone around you.

We've never stood in the same room. Never shared a meal face-to-face. But I know you. I know the way your mind works, the way your heart feels, the way your spirit shines. And I am endlessly grateful that our paths crossed.

Happy Birthday, Lisa. May 22 be the year that gives you everything 21 promised and more. May your dreams grow bigger, your laughter grow louder, and your heart remain as beautiful as it has always been.

The world is better with you in it. Never forget that.`;

const PAUSE_CHARS = ['?', '.', '!'];
const PAUSE_DURATION = 600; // ms
const TYPING_SPEED = 45; // ms per char

export default function DigitalLetter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSignoff, setShowSignoff] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const letterStarted = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo(
            '.letter-heading',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          );
          gsap.fromTo(
            '.letter-card',
            { opacity: 0, scale: 0.97 },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
              onComplete: () => setHasTriggered(true),
            }
          );
        },
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Typing effect
  useEffect(() => {
    if (!hasTriggered || letterStarted.current) return;
    letterStarted.current = true;

    let index = 0;
    setIsTyping(true);

    const typeNext = () => {
      if (index >= letterContent.length) {
        setIsTyping(false);
        setShowSignoff(true);
        return;
      }

      const char = letterContent[index];
      setDisplayedText(letterContent.slice(0, index + 1));
      index++;

      // Check for pause after punctuation
      if (PAUSE_CHARS.includes(char) && letterContent[index] === ' ') {
        setTimeout(typeNext, PAUSE_DURATION);
      } else {
        setTimeout(typeNext, TYPING_SPEED);
      }
    };

    // Start after a brief delay
    setTimeout(typeNext, 500);
  }, [hasTriggered]);

  return (
    <section
      id="letter"
      ref={sectionRef}
      className="relative py-20 lg:py-32"
      style={{
        background: '#060B14',
        backgroundImage: 'radial-gradient(ellipse at center, rgba(0,212,255,0.06) 0%, transparent 70%)',
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="letter-heading text-center mb-12 opacity-0">
          <p className="section-label mb-3">05 • A LETTER TO YOU</p>
          <h2 className="section-heading mb-4">Words I Never Said</h2>
          <p className="section-subtext max-w-xl mx-auto">
            Some things take time to find the right words. These are yours.
          </p>
          <div className="w-10 h-[2px] bg-gradient-to-r from-cyan to-transparent mx-auto mt-4" />
        </div>

        {/* Letter Card */}
        <div
          className="letter-card opacity-0"
          style={{
            background: 'rgba(10, 22, 40, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 0 60px rgba(0, 212, 255, 0.08), 0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            padding: 'clamp(24px, 5vw, 48px)',
          }}
        >
          {/* Letter Header */}
          <div className="mb-6">
            <p className="font-accent text-xl lg:text-2xl text-cyan mb-1">To Lisa,</p>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              May 16, 2026
            </p>
          </div>

          {/* Letter Body with typing effect */}
          <div className="min-h-[400px]">
            <p
              className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap"
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
            >
              {displayedText}
              {isTyping && (
                <span className="text-cyan animate-[blink_0.8s_step-end_infinite] font-bold">|</span>
              )}
            </p>
          </div>

          {/* Sign-off */}
          {showSignoff && (
            <div className="mt-8 pt-6 border-t border-white/10 animate-fade-in-up">
              <p className="italic text-sm mb-3" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                With all my admiration,
              </p>
              <p className="font-accent text-xl text-cyan">
                Your friend, forever 💙
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ambient particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none w-1 h-1 rounded-full bg-cyan/30"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${5 + Math.random() * 90}%`,
            animation: `float ${7 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}
    </section>
  );
}
