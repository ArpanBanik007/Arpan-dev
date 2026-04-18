import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', to: 'hero' },
    { name: 'About', to: 'about' },
    { name: 'Projects', to: 'projects' },
    { name: 'Experience', to: 'experience' },
    { name: 'Contact', to: 'contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 md:px-12 xl:px-20 flex justify-between items-center">
        <div className="text-2xl font-poppins font-bold gradient-text cursor-pointer hover:scale-105 transition-transform">
          ARPAN BANIK
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              smooth={true}
              duration={500}
              spy={true}
              activeClass="text-primary"
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors cursor-pointer"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="/Arpan_Banik_Resume.pdf"
            download="Arpan_Banik_Resume.pdf"
            className="px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/50 hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(14,165,233,0.2)] hover:shadow-[0_0_20px_rgba(14,165,233,0.6)]"
          >
            Resume
          </a>
        </nav>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-2xl text-white focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden absolute top-full left-0 w-full glass transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen py-6 border-b border-cardBorder' : 'max-h-0'}`}>
        <nav className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              smooth={true}
              duration={500}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-primary transition-colors cursor-pointer"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="/Arpan_Banik_Resume.pdf"
            download="Arpan_Banik_Resume.pdf"
            className="px-6 py-2 mt-2 rounded-full bg-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]"
          >
            Download Resume
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
