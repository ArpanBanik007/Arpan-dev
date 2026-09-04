import React from 'react';
import { motion } from 'framer-motion';
import { FiLayout, FiServer, FiDatabase, FiTool, FiCpu } from 'react-icons/fi';
import { developerInfo } from '../../data/constants';

const categoryIcons = {
  "Frontend": FiLayout,
  "Backend": FiServer,
  "Databases": FiDatabase,
  "Tools & Engineering": FiTool,
  "AI & Emerging Focus": FiCpu,
};

const TechStack = () => {
  return (
    <section id="techstack" className="py-20 relative bg-black">
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">Tech <span className="text-primary">Stack</span> & Skills</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {developerInfo.skillsCategorized.map((group, index) => {
            const Icon = categoryIcons[group.category] || FiTool;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-6 rounded-2xl border border-cardBorder hover:border-primary/40 transition-all flex flex-col group shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_10px_rgba(14,165,233,0.2)]">
                    <Icon className="text-lg" />
                  </div>
                  <h3 className="text-lg font-poppins font-semibold text-white tracking-wide">{group.category}</h3>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {group.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="glass px-3.5 py-1.5 rounded-full border border-cardBorder text-gray-300 font-medium text-xs tracking-wide hover:border-primary/50 hover:text-white transition-all cursor-default shadow-[0_0_8px_rgba(255,255,255,0.02)]"
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
