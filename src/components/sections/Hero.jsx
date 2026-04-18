import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 z-10 text-center">
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", stiffness: 200, damping: 20 }}
           className="mb-8 relative w-40 h-40 md:w-52 md:h-52 mx-auto"
        >
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-[20px] animate-pulse" />
          <img 
            src="/profile.jpg" 
            alt="Arpan Banik" 
            className="w-full h-full object-cover object-[center_15%] rounded-full border-4 border-card relative z-10 shadow-[0_0_20px_rgba(14,165,233,0.4)]"
          />
        </motion.div>

        <motion.p 
          className="text-primary font-mono mb-4 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to my digital universe
        </motion.p>

        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="text-white">Hi, I'm Arpan, </span>
          <br className="md:hidden" />
          <span className="gradient-text h-20 inline-block md:min-h-0">
            <Typewriter
              words={['MERN Stack Developer']}
              loop={0}
              cursor
              cursorStyle='_'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </span>
        </motion.h1>

        <motion.h2
          className="text-xl md:text-2xl text-gray-400 mb-10 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Freelancer | Digital Marketer | Content Creator
        </motion.h2>

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
            className="px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-sky-400 transition-all shadow-[0_0_15px_rgba(14,165,233,0.5)] cursor-pointer"
          >
            View Projects
          </Link>
          <Link
            to="contact"
            smooth={true}
            className="px-8 py-3 rounded-full glass border border-primary/30 text-white font-medium hover:bg-primary/10 transition-all cursor-pointer"
          >
            Contact Me
          </Link>
          <a
            href="/Arpan_Banik_Resume.pdf"
            download="Arpan_Banik_Resume.pdf"
            className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-pointer flex items-center gap-2"
          >
            Download Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
