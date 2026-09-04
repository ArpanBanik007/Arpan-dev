import React from 'react';
import { motion } from 'framer-motion';
import { developerInfo } from '../../data/constants';
import { FiBookOpen, FiCode, FiBriefcase, FiGithub, FiTerminal, FiActivity } from 'react-icons/fi';

const timelineIcons = {
  experience: FiCode,
  education: FiBookOpen,
  secondary: FiBriefcase
};

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
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">Journey <span className="text-primary">& Experience</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
          <p className="mt-4 text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            An authentic track record of engineering education, self-driven software building, and practical technical growth.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative mb-20">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-cardBorder transform md:-translate-x-1/2"></div>
          
          <div className="space-y-12">
            {developerInfo.timeline.map((item, index) => {
              const Icon = timelineIcons[item.type] || FiCode;
              return (
                <div key={item.id} className={`relative flex items-center justify-between md:justify-normal w-full pt-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-card border-4 border-primary transform -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                    <Icon className="text-primary text-xs" />
                  </div>

                  {/* Content Card */}
                  <motion.div 
                    className={`ml-12 md:ml-0 md:w-[45%] glass p-6 rounded-2xl border-t-4 border-t-primary hover:scale-[1.02] transition-transform ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8 text-left md:text-right'}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                      <span className="text-primary font-mono text-xs bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                        {item.period}
                      </span>
                      {item.badge && (
                        <span className="text-gray-400 font-mono text-[11px] bg-white/[0.03] px-2 py-0.5 rounded border border-cardBorder">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg md:text-xl font-poppins font-bold text-white mb-1">{item.title}</h3>
                    <h4 className="text-primary font-medium text-sm mb-3">{item.organization}</h4>
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3">{item.description}</p>
                    
                    {item.score && (
                      <p className="text-gray-400 font-mono text-xs bg-card inline-block px-3 py-1 rounded-md border border-cardBorder">
                        Score: {item.score}
                      </p>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Developer & Coding Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-poppins font-bold text-white mb-2">Coding & Engineering Activity</h3>
            <p className="text-gray-400 text-xs md:text-sm">Active problem solving, continuous building, and transparent engineering discipline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl border border-cardBorder hover:border-primary/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <FiGithub className="text-xl" />
                </div>
                <h4 className="text-white font-poppins font-semibold text-base mb-1">GitHub Activity</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  Regular commits, active public repositories, full-stack MERN codebases, and continuous integration workflows.
                </p>
              </div>
              <a 
                href={developerInfo.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary text-xs font-mono hover:underline flex items-center gap-1.5"
              >
                github.com/ArpanBanik007 ↗
              </a>
            </div>

            <div className="glass p-6 rounded-2xl border border-cardBorder hover:border-primary/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <FiTerminal className="text-xl" />
                </div>
                <h4 className="text-white font-poppins font-semibold text-base mb-1">DSA & Problem Solving</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  Practicing core algorithmic problem solving in C++ and JavaScript—focusing on arrays, trees, recursion, and time complexity.
                </p>
              </div>
              <span className="text-gray-400 text-xs font-mono">
                Focus: C++ & JS Algorithms
              </span>
            </div>

            <div className="glass p-6 rounded-2xl border border-cardBorder hover:border-primary/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <FiActivity className="text-xl" />
                </div>
                <h4 className="text-white font-poppins font-semibold text-base mb-1">Building in Public</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  Iterating on production web apps, experimenting with AI/LLM integrations, and exploring Next.js & TypeScript architecture.
                </p>
              </div>
              <span className="text-primary text-xs font-mono">
                Status: Actively Shipping
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
