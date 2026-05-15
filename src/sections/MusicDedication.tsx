import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function MusicDedication() {
  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const active = isPlaying;

  // Audio Control
 const togglePlay = () => {
  const audio = audioRef.current;
  if (!audio) {
    console.error("Audio ref is null");
    return;
  }

  if (isPlaying) {
    audio.pause();
    setIsPlaying(false);
  } else {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Play failed:", err);
          setIsPlaying(false);
        });
    }
  }
};

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.music-heading', 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.music-heading', start: 'top 85%' }}
      );
      gsap.fromTo('.music-card', 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.music-card', start: 'top 80%' }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="music"
      ref={sectionRef}
      className="relative py-20 lg:py-32"
      style={{
        background: '#0A1628',
        backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(0,212,255,0.1) 0%, transparent 50%)',
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="music-heading text-center mb-12">
          <p className="section-label mb-3">06 • SOUNDTRACK</p>
          <h2 className="section-heading mb-4">This Song Is Yours</h2>
          <p className="section-subtext max-w-xl mx-auto">
            Every time I hear it, I think of you.
          </p>
          <div className="w-10 h-[2px] bg-gradient-to-r from-cyan to-transparent mx-auto mt-4" />
        </div>

        {/* Music Player Card */}
        <div className="music-card glass-card p-6 lg:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            {/* Vinyl Record */}
            <div className="vinyl-record relative flex-shrink-0">
              <div
                className={`w-48 h-48 lg:w-60 lg:h-60 rounded-full relative ${isPlaying ? 'animate-spin-slow' : ''}`}
                style={{
                  background: `repeating-radial-gradient(circle at center, #0a0a0a 0px, #0a0a0a 2px, #1a1a1a 3px, #1a1a1a 4px)`,
                  boxShadow: '0 0 40px rgba(0, 212, 255, 0.3)',
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.8), rgba(0,150,255,0.6))' }}
                >
                  <span className="font-display font-bold text-white text-sm lg:text-base">LISA</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cosmic-deep" />
              </div>

              {/* Visualizer */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const radius = 110;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return (
                    <div
                      key={i}
                      className="absolute left-1/2 top-1/2 w-1 rounded-full"
                      style={{
                        height: active ? `${12 + Math.random() * 24}px` : '8px',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${i * 30}deg)`,
                        background: 'linear-gradient(to top, rgba(0,212,255,0.6), transparent)',
                        opacity: 0.7,
                        transition: 'height 0.3s ease',
                        animation: active ? `pulse ${0.4 + Math.random() * 0.4}s ease-in-out infinite alternate` : 'none',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Track Info */}
            <div className="track-info text-center md:text-left flex-1">
              <p className="text-sm italic mb-4" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                "This song says it better, ebu skia."
              </p>

              <h3 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
                Wema 
              </h3>
              <p className="text-base mb-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Nk Njoroge ft Fedora
              </p>

              <p className="font-accent text-xl text-cyan mb-6">
                "Met you by chance..."
              </p>

              {/* Play Button */}
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto md:mx-0 transition-all hover:scale-110 active:scale-95"
                style={{
                  background: 'rgba(0, 212, 255, 0.2)',
                  border: '1px solid rgba(0, 212, 255, 0.5)',
                  boxShadow: isPlaying ? '0 0 30px rgba(0, 212, 255, 0.4)' : '0 0 15px rgba(0, 212, 255, 0.2)',
                }}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
<audio
  ref={audioRef}
  src="/music/lisa-song.mp3"
  onEnded={() => setIsPlaying(false)}
  onError={(e) => {
    console.error("Audio Error:", e);
    console.error("Audio Src:", e.currentTarget.src);
    alert("Audio failed to load. Check console for details.");
  }}
/>  
      

      <style>{`
        @keyframes pulse {
          from { height: 8px; }
          to { height: 32px; }
        }
        .animate-spin-slow {
          animation: spin 25s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}