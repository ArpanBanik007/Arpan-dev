import React from 'react';
import { motion } from 'framer-motion';
import { developerInfo } from '../../data/constants';

const TechStack = () => {
  const allSkills = [
    ...developerInfo.skills.languages,
    ...developerInfo.skills.technologies,
    ...developerInfo.skills.core
  ];
  
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

        <motion.div 
          className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {allSkills.map((skill, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                show: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="glass px-6 py-3 rounded-full border border-cardBorder shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:border-primary/50 transition-all cursor-default"
            >
              <span className="text-gray-300 font-medium text-sm text-center">{skill}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
