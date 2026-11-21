import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiServer, FiDatabase, FiCpu } from 'react-icons/fi';
import { developerInfo } from '../../data/constants';

const About = () => {
  return (
    <section id="about" className="py-24 relative bg-grid-pattern">
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-3">
            Background & Mindset
          </div>
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">
            About <span className="text-primary">Me</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Bio side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass p-8 md:p-10 rounded-2xl relative overflow-hidden group border border-white/[0.08]"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-bl-full transition-transform group-hover:scale-110 pointer-events-none" />
            <h3 className="text-2xl font-poppins font-bold text-white mb-5 relative z-10">
              Engineering Journey
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4 relative z-10 text-sm md:text-base">
              {developerInfo.aboutJourney.origin}
            </p>
            <p className="text-gray-300 leading-relaxed mb-4 relative z-10 text-sm md:text-base">
              {developerInfo.aboutJourney.growth}
            </p>
            <p className="text-gray-300 leading-relaxed relative z-10 text-sm md:text-base">
              {developerInfo.aboutJourney.current}
            </p>
          </motion.div>

          {/* Core Engineering Focus */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-2xl font-poppins font-bold text-white mb-2">
              Core Engineering Focus
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {developerInfo.engineeringPillars.map((pillar, index) => (
                <div 
                  key={index}
                  className="glass p-5 rounded-xl border border-white/[0.08] hover:border-primary/40 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(14,165,233,0.1)]"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_10px_rgba(14,165,233,0.15)]">
                    {pillar.icon === 'code' && <FiCode className="text-lg" />}
                    {pillar.icon === 'server' && <FiServer className="text-lg" />}
                    {pillar.icon === 'database' && <FiDatabase className="text-lg" />}
                    {pillar.icon === 'cpu' && <FiCpu className="text-lg" />}
                  </div>
                  <h4 className="text-white font-poppins font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
