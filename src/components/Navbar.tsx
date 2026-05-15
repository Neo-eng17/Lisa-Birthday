import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Story', href: '#story' },
  { label: 'Memories', href: '#memories' },
  { label: 'Messages', href: '#messages' },
  { label: 'Letter', href: '#letter' },
  { label: 'Music', href: '#music' },
  { label: 'Finale', href: '#finale' },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
        style={{
          background: 'rgba(6, 11, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-display text-xl font-bold text-cyan">
              LISA
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-sm text-white/60 hover:text-cyan transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white/80 hover:text-cyan transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t border-cyan-border/30"
            style={{ background: 'rgba(6, 11, 20, 0.95)', backdropFilter: 'blur(20px)' }}
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="block text-white/70 hover:text-cyan transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Scroll progress bar */}
      <ScrollProgress visible={visible} />
    </>
  );
}

function ScrollProgress({ visible }: { visible: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-[2px] z-[60] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(0, 212, 255, 0.1)' }}
    >
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #00D4FF, #0096FF)',
        }}
      />
    </div>
  );
}
