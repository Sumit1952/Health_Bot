import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/faqs', label: 'FAQS' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactClick = (e) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      return; // Link handles navigation to home#contact
    }
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      e.preventDefault();
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-transparent backdrop-blur-md" : "bg-orange-500/50 backdrop-blur-sm shadow-sm"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 pt-4">
          <Link to="/" className="flex items-center gap-1" aria-label="HealthifyMe Homepage">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary">Healthify</span>
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">Me</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                className="text-sm font-semibold tracking-wider text-secondary-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2">
              <a 
                href="https://www.facebook.com/share/1Drng6WnjA/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-black/5 transition-colors text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/sssumit____" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-black/5 transition-colors text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/sssumit____" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-black/5 transition-colors text-primary"
                aria-label="Twitter / X"
              >
                <svg
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            <a 
              href="/#contact" 
              onClick={handleContactClick} 
              className="hidden lg:inline-flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-500 font-bold rounded-full px-6 py-2.5 text-sm transition-all shadow-sm hover:shadow"
            >
              CONTACT
            </a>

            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-secondary-foreground hover:bg-black/5"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-orange-500/90 backdrop-blur-md border-b border-orange-600/20">
          <nav className="flex flex-col items-center space-y-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-mobile`}
                to={link.href}
                className="text-base font-bold text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a 
              href="/#contact"
              onClick={handleContactClick}
              className="w-11/12 text-center bg-yellow-400 text-black hover:bg-yellow-500 font-bold rounded-full py-3 shadow"
            >
              CONTACT
            </a>
            <div className="flex items-center gap-6 pt-2">
              <a href="https://www.facebook.com/share/1Drng6WnjA/" target="_blank" rel="noopener noreferrer" className="text-primary">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/sssumit____" target="_blank" rel="noopener noreferrer" className="text-primary">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://x.com/sssumit____" target="_blank" rel="noopener noreferrer" className="text-primary">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
