import React from 'react';
import { motion } from 'framer-motion';
import { developerInfo } from '../../data/constants';
import { FiBookOpen } from 'react-icons/fi';

const Experience = () => {
  return (
    <section id="experience" className="py-20 relative bg-[#080808]">
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">Education <span className="text-primary">& Timeline</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-cardBorder transform md:-translate-x-1/2"></div>
          
          <div className="space-y-12">
            {developerInfo.education.map((edu, index) => (
              <div key={edu.id} className={`relative flex items-center justify-between md:justify-normal w-full pt-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-card border-4 border-primary transform -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                  <FiBookOpen className="text-primary text-sm" />
                </div>

                {/* Content Card */}
                <motion.div 
                  className={`ml-12 md:ml-0 md:w-[45%] glass p-6 rounded-2xl border-t-4 border-t-primary hover:scale-[1.02] transition-transform ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8 text-left md:text-right'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <h3 className="text-xl font-poppins font-bold text-white mb-1">{edu.degree}</h3>
                  <h4 className="text-primary font-medium text-sm mb-3">{edu.institution}</h4>
                  <p className="text-gray-400 font-mono text-xs bg-card inline-block px-3 py-1 rounded-md border border-cardBorder">Score: {edu.score}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
