import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FiDownload, FiArrowRight, FiMail } from 'react-icons/fi';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 bg-grid-pattern">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 z-10 text-center">
        {/* Profile Avatar */}
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", stiffness: 200, damping: 20 }}
           className="mb-6 relative w-36 h-36 md:w-44 md:h-44 mx-auto"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-indigo-500 blur-xl opacity-40 animate-pulse" />
          <img 
            src="/profile.jpg" 
            alt="Arpan Banik" 
            className="w-full h-full object-cover object-[center_15%] rounded-full border-2 border-white/20 relative z-10 shadow-[0_0_25px_rgba(14,165,233,0.3)]"
          />
        </motion.div>

        {/* Live Availability Status Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Available for Full-Stack & Generative AI Roles</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins mb-4 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <span className="text-white">Hi, I'm Arpan, </span>
          <br className="md:hidden" />
          <span className="gradient-text h-16 md:h-20 inline-block">
            <Typewriter
              words={[
                'Full-Stack Developer',
                'Generative AI Developer',
                'RAG & Agentic Systems',
                'Software Developer'
              ]}
              loop={0}
              cursor
              cursorStyle='_'
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={2000}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          className="text-base md:text-xl text-gray-300 mb-4 font-medium tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Full-Stack Development • Generative AI & RAG • LangGraph Agents
        </motion.h2>

        {/* Description */}
        <motion.p
          className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base mb-8 leading-relaxed font-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          I build production-grade web applications with MERN, stateful ordering agents with LangGraph, and multilingual RAG systems with vector search.
        </motion.p>

        {/* Impact Highlights Strip */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-xs font-mono text-gray-400 mb-10 pb-4 border-b border-white/[0.08] max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-sm">2</span>
            <span>Live Deployed Platforms</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-sm">3</span>
            <span>GenAI & RAG Systems</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-sm">150+</span>
            <span>REST APIs Architected</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link
            to="projects"
            smooth={true}
            offset={-50}
            className="px-7 py-3 rounded-full bg-primary hover:bg-sky-400 text-white font-medium transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] cursor-pointer flex items-center gap-2 text-sm"
          >
            <span>Explore Projects</span>
            <FiArrowRight className="text-base" />
          </Link>
          <a
            href="/Arpan_Banik_Resume.pdf"
            download="Arpan_Banik_Resume.pdf"
            className="px-7 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-pointer flex items-center gap-2 text-sm"
          >
            <FiDownload className="text-base" />
            <span>Download CV</span>
          </a>
          <Link
            to="contact"
            smooth={true}
            className="px-7 py-3 rounded-full glass border border-white/10 text-white font-medium hover:border-primary/50 hover:bg-white/[0.04] transition-all cursor-pointer flex items-center gap-2 text-sm"
          >
            <FiMail className="text-base text-primary" />
            <span>Contact Me</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
