import React from 'react';
import { motion } from 'framer-motion';
import { FiLayout, FiServer, FiDatabase, FiTool, FiCpu } from 'react-icons/fi';
import { developerInfo } from '../../data/constants';

const categoryIcons = {
  "Generative AI & LLMs": FiCpu,
  "Full-Stack & Backend": FiServer,
  "Frontend Engineering": FiLayout,
  "Databases & Storage": FiDatabase,
  "Languages & DevOps": FiTool,
};

const TechStack = () => {
  return (
    <section id="techstack" className="py-24 relative bg-black/60 bg-grid-pattern">
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-3">
            Technical Competencies
          </div>
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">
            Tech <span className="text-primary">Stack</span> & Tooling
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
          <p className="mt-4 text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Practical, verified technologies applied across full-stack production deployments and Generative AI systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {developerInfo.skillsCategorized.map((group, index) => {
            const Icon = categoryIcons[group.category] || FiTool;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass p-6 rounded-2xl border border-white/[0.08] hover:border-primary/40 transition-all duration-300 flex flex-col group shadow-md hover:shadow-[0_0_20px_rgba(14,165,233,0.12)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_10px_rgba(14,165,233,0.15)]">
                    <Icon className="text-lg" />
                  </div>
                  <h3 className="text-base font-poppins font-semibold text-white tracking-wide">
                    {group.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {group.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="glass px-3.5 py-1.5 rounded-full border border-white/[0.06] text-gray-300 font-medium text-xs tracking-wide hover:border-primary/50 hover:text-white transition-all cursor-default shadow-[0_0_8px_rgba(255,255,255,0.02)]"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
