import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  text: string;
  sender: 'lisa' | 'you';
  time: string;
}

const allMessages: Message[] = [
  { text: "Are you always this patient with your students?", sender: 'lisa', time: '8:32 PM' },
  { text: "Only the ones who ask questions as smart as yours 😊", sender: 'you', time: '8:33 PM' },
  { text: "Stop flirting and teach me 😂", sender: 'lisa', time: '8:34 PM' },
  { text: "Who says I can't do both?", sender: 'you', time: '8:35 PM' },
  { text: "You're impossible. But also... kind of amazing.", sender: 'lisa', time: '11:47 PM' },
  { text: "Kind of? I'll take it. For now.", sender: 'you', time: '11:48 PM' },
  { text: "My friends think I have a secret boyfriend because I'm always smiling at my phone", sender: 'lisa', time: '9:15 PM' },
  { text: "Tell them you're just studying. Technically not a lie 😏", sender: 'you', time: '9:16 PM' },
  { text: "You know what's crazy? We've never met but I feel like I know you better than some people I've known for years", sender: 'lisa', time: '1:23 AM' },
  { text: "That's because souls don't need GPS to find each other, Lisa", sender: 'you', time: '1:25 AM' },
  { text: "When are you going to stop being so wise?", sender: 'lisa', time: '1:26 AM' },
  { text: "When you stop inspiring it", sender: 'you', time: '1:27 AM' },
];

const MESSAGES_PER_BATCH = 4;

export default function MessageJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState(MESSAGES_PER_BATCH);
  const [showContinue, setShowContinue] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const visibleMessages = allMessages.slice(0, visibleCount);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.msg-heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.msg-heading', start: 'top 85%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Animate new messages
  useEffect(() => {
    const newMessages = document.querySelectorAll('.msg-bubble');
    const lastBatch = newMessages.length <= MESSAGES_PER_BATCH 
      ? newMessages 
      : Array.from(newMessages).slice(-MESSAGES_PER_BATCH);
    
    gsap.fromTo(
      lastBatch,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)', stagger: 0.15 }
    );

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }, [visibleCount]);

  const handleContinue = () => {
    const next = visibleCount + MESSAGES_PER_BATCH;
    if (next >= allMessages.length) {
      setVisibleCount(allMessages.length);
      setShowContinue(false);
    } else {
      setVisibleCount(next);
    }
  };

  return (
    <section
      id="messages"
      ref={sectionRef}
      className="relative py-20 lg:py-32"
      style={{
        background: '#060B14',
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, rgba(255,107,157,0.05) 0%, transparent 50%)
        `,
      }}
    >
      {/* Background image - blurred */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'url(/lisa-messages.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="msg-heading text-center mb-12">
          <p className="section-label mb-3">03 • OUR WORDS</p>
          <h2 className="section-heading mb-4">A Journey Through Our Universe</h2>
          <p className="section-subtext max-w-xl mx-auto">
            Every message was a star. Together, they formed a constellation.
          </p>
          <div className="w-10 h-[2px] bg-gradient-to-r from-cyan to-transparent mx-auto mt-4" />
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-8">
          {visibleMessages.map((msg, index) => (
            <div
              key={index}
              className={`msg-bubble flex ${msg.sender === 'lisa' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[75%] px-5 py-3 rounded-2xl ${
                  msg.sender === 'lisa'
                    ? 'rounded-bl-sm'
                    : 'rounded-br-sm'
                }`}
                style={{
                  background:
                    msg.sender === 'lisa'
                      ? 'rgba(255, 107, 157, 0.08)'
                      : 'rgba(0, 212, 255, 0.08)',
                  border:
                    msg.sender === 'lisa'
                      ? '1px solid rgba(255, 107, 157, 0.2)'
                      : '1px solid rgba(0, 212, 255, 0.2)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p className="text-sm lg:text-base text-white mb-1">{msg.text}</p>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
                  {msg.sender === 'lisa' ? 'Lisa' : 'You'} • {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Continue button */}
        {showContinue && (
          <div className="text-center">
            <button onClick={handleContinue} className="btn-cyan">
              Continue Reading...
            </button>
          </div>
        )}

        {/* Floating stars decoration */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `float ${6 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
              opacity: 0.15,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFE4A1">
              <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}
