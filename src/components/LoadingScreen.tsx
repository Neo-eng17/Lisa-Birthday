import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#060B14' }}
    >
      {/* Pulsing dot */}
      <div
        className="w-4 h-4 rounded-full bg-cyan mb-6"
        style={{
          animation: 'pulse 1.5s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
        }}
      />

      {/* Text */}
      <p className="section-label tracking-[0.2em]">
        Entering Lisa's Universe...
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
