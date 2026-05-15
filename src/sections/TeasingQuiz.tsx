import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Question {
  question: string;
  options: { label: string; text: string }[];
  bestAnswer: number;
  responses: string[];
}

const questions: Question[] = [
  {
    question: 'Which version of Lisa are we meeting today?',
    options: [
      { label: 'A', text: 'Professional Lisa (glasses on, focus mode)' },
      { label: 'B', text: 'Soft Lisa (gentle, sweet, dreamy)' },
      { label: 'C', text: 'Chaotic Lisa (random jokes, energy overflow)' },
      { label: 'D', text: 'Mentor-stressing Lisa (asking questions just to tease)' },
    ],
    bestAnswer: 3,
    responses: [
      'Professional Lisa is impressive, but where\'s the fun without a little chaos?',
      'Soft Lisa is adorable, but I know you have a mischievous side 😏',
      'Chaotic Lisa keeps me on my toes, but you\'re not always this unpredictable!',
      'Ah, Mentor-Stressing Lisa! The version that asks me complex questions just to see me struggle, then sends a "😂" when I finally figure it out. You\'re lucky you\'re cute.',
    ],
  },
  {
    question: "What's Lisa's biggest weakness?",
    options: [
      { label: 'A', text: 'She cares too much' },
      { label: 'B', text: "She can't resist a good meme" },
      { label: 'C', text: 'Her smile — it disarms everyone' },
      { label: 'D', text: 'She pretends not to blush over compliments' },
    ],
    bestAnswer: 3,
    responses: [
      'True, but that\'s not a weakness — that\'s your superpower.',
      'Who can resist a good meme though? Not a weakness in my book.',
      'That smile is dangerous, I\'ll admit. But there\'s something even more telling...',
      'Caught you! You can deny it all you want, but I know that blush is real. And it\'s absolutely adorable.',
    ],
  },
  {
    question: 'If Lisa were a time of day, she\'d be...',
    options: [
      { label: 'A', text: 'Midnight — mysterious and deep' },
      { label: 'B', text: 'Sunset — beautiful and warm' },
      { label: 'C', text: '3 AM — when the best conversations happen' },
      { label: 'D', text: 'Dawn — full of hope and new beginnings' },
    ],
    bestAnswer: 2,
    responses: [
      'Mysterious? Yes. But you\'re much more than just mystery.',
      'Beautiful and warm fits, but there\'s a time that captures you even better.',
      '3 AM Lisa — when walls come down, truths come out, and conversations become memories. That\'s when your brilliance truly shines.',
      'Hopeful? Absolutely. But you\'re more of a night owl than an early bird, admit it!',
    ],
  },
  {
    question: 'What does Lisa do when she\'s nervous?',
    options: [
      { label: 'A', text: "Types 'lol' way too much" },
      { label: 'B', text: 'Changes the subject cleverly' },
      { label: 'C', text: 'Asks more questions to deflect' },
      { label: 'D', text: 'All of the above, simultaneously' },
    ],
    bestAnswer: 3,
    responses: [
      'lol haha lol — yeah, I\'ve noticed 😂',
      'You\'re smooth with it, but I always catch the pivot!',
      'Classic Lisa defense mechanism — when in doubt, ask a question!',
      'The full Lisa nervous package! It\'s actually endearing how transparent you are. Don\'t worry, your secret is safe with me.',
    ],
  },
  {
    question: 'What makes Lisa truly special?',
    options: [
      { label: 'A', text: 'Her intelligence' },
      { label: 'B', text: 'Her heart' },
      { label: 'C', text: 'The way she makes people feel seen' },
      { label: 'D', text: 'All of it. Every single part.' },
    ],
    bestAnswer: 3,
    responses: [
      'Her intelligence is remarkable, but that\'s just one piece of the puzzle.',
      'Her heart is beautiful, yet there\'s even more to you than that.',
      'This is true — you have a gift for making people feel valued.',
      'This is the only correct answer. Every part of you — your mind, your heart, your spirit, your humor — comes together to create someone truly extraordinary.',
    ],
  },
];

export default function TeasingQuiz() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [completed, setCompleted] = useState(false);
  const confettiRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.quiz-heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.quiz-heading', start: 'top 85%' },
        }
      );
      gsap.fromTo(
        '.quiz-card',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.quiz-card', start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleAnswer = (index: number) => {
    setSelected(index);
    setShowResponse(true);
    if (index === questions[currentQ].bestAnswer) {
      triggerConfetti();
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResponse(false);
    } else {
      setCompleted(true);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number }[] = [];
    const colors = ['#00D4FF', '#FF6B9D', '#FFE4A1', '#33DDFF', '#FFFFFF'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        life: 1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.life -= 0.015;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      ctx.globalAlpha = 1;
      if (alive) requestAnimationFrame(animate);
    }

    animate();
  };

  const q = questions[currentQ];

  return (
    <section
      id="quiz"
      ref={sectionRef}
      className="relative py-20 lg:py-32"
      style={{ background: '#0A1628' }}
    >
      {/* Confetti canvas */}
      <canvas
        ref={confettiRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="quiz-heading text-center mb-12">
          <p className="section-label mb-3">04 • PLAYGROUND</p>
          <h2 className="section-heading mb-4">The Lisa Quiz</h2>
          <p className="section-subtext max-w-xl mx-auto">
            How well do you know her? Let's find out.
          </p>
          <div className="w-10 h-[2px] bg-gradient-to-r from-cyan to-transparent mx-auto mt-4" />
        </div>

        {/* Quiz Card */}
        <div className="quiz-card glass-card p-6 lg:p-10 relative" style={{ boxShadow: '0 0 40px rgba(0, 212, 255, 0.1)' }}>
          {completed ? (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-cyan mx-auto mb-4 animate-pulse-glow" />
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Quiz Complete!
              </h3>
              <p className="text-base mb-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Whether you got them "right" or not, the truth is:
              </p>
              <p className="font-accent text-2xl text-cyan mb-6">
                Lisa is perfect just the way she is.
              </p>
              <button onClick={() => { setCurrentQ(0); setSelected(null); setShowResponse(false); setCompleted(false); }} className="btn-outline">
                Play Again
              </button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="mb-6">
                <p className="section-label mb-2">
                  Question {currentQ + 1} of {questions.length}
                </p>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan to-cyan-bright transition-all duration-500"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h3 className="font-display text-xl lg:text-2xl font-semibold text-white mb-6">
                {q.question}
              </h3>

              {/* Response */}
              {showResponse && selected !== null && (
                <div
                  className={`mb-6 p-4 rounded-xl border animate-fade-in-up ${
                    selected === q.bestAnswer
                      ? 'border-cyan/40 bg-cyan/10'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {selected === q.bestAnswer && (
                      <CheckCircle className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm lg:text-base" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                      {q.responses[selected]}
                    </p>
                  </div>
                  <button onClick={handleNext} className="btn-cyan mt-4">
                    {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results'}
                  </button>
                </div>
              )}

              {/* Options */}
              {!showResponse && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="glass-card p-4 text-left hover:border-cyan/40 transition-all hover:shadow-glow text-left"
                    >
                      <span className="text-cyan font-bold mr-2">{opt.label}.</span>
                      <span className="text-sm text-white/80">{opt.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
