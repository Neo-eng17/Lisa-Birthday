import { useState, useEffect } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import Hero from './sections/Hero';
import StoryTimeline from './sections/StoryTimeline';
import MemoryCarousel from './sections/MemoryCarousel';
import MessageJourney from './sections/MessageJourney';
import TeasingQuiz from './sections/TeasingQuiz';
import DigitalLetter from './sections/DigitalLetter';
import MusicDedication from './sections/MusicDedication';
import ReasonsWhy from './sections/ReasonsWhy';
import FutureWishes from './sections/FutureWishes';
import GrandFinale from './sections/GrandFinale';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent scroll during loading
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Global particle background */}
        <ParticleCanvas density="normal" />

        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main className="relative">
          <Hero />
          <StoryTimeline />
          <MemoryCarousel />
          <MessageJourney />
          <TeasingQuiz />
          <DigitalLetter />
          <MusicDedication />
          <ReasonsWhy />
          <FutureWishes />
          <GrandFinale />
        </main>

        {/* Footer */}
        <footer
          className="py-8 text-center relative z-10"
          style={{
            background: '#060B14',
            borderTop: '1px solid rgba(0, 212, 255, 0.1)',
          }}
        >
          <p className="font-accent text-lg text-cyan mb-1">
            Made with love for Lisa
          </p>
          <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
            May 16, 2026 • A digital love letter
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
