import React from 'react';
import { motion } from 'framer-motion';
import { developerInfo } from '../../data/constants';
import { FiBookOpen, FiCode, FiBriefcase, FiGithub, FiTerminal, FiCpu } from 'react-icons/fi';

const timelineIcons = {
  experience: FiCode,
  education: FiBookOpen,
  secondary: FiBriefcase
};

const Experience = () => {
  return (
    <section id="experience" className="py-24 relative bg-[#07090e] bg-grid-pattern">
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-3">
            Trajectory & Activity
          </div>
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">
            Journey <span className="text-primary">& Timeline</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
          <p className="mt-4 text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            An authentic track record of engineering education, production software development, and Generative AI research.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative mb-20">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/[0.1] transform md:-translate-x-1/2"></div>
          
          <div className="space-y-12">
            {developerInfo.timeline.map((item, index) => {
              const Icon = timelineIcons[item.type] || FiCode;
              return (
                <div key={item.id} className={`relative flex items-center justify-between md:justify-normal w-full pt-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary transform -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(14,165,233,0.4)]">
                    <Icon className="text-primary text-xs" />
                  </div>

                  {/* Content Card */}
                  <motion.div 
                    className={`ml-12 md:ml-0 md:w-[45%] glass p-6 rounded-2xl border-t-2 border-t-primary border-white/[0.08] hover:border-primary/40 transition-all duration-300 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8 text-left md:text-right'}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                      <span className="text-primary font-mono text-xs bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                        {item.period}
                      </span>
                      {item.badge && (
                        <span className="text-gray-400 font-mono text-[11px] bg-white/[0.03] px-2 py-0.5 rounded border border-white/10">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg md:text-xl font-poppins font-bold text-white mb-1">{item.title}</h3>
                    <h4 className="text-primary font-medium text-sm mb-3">{item.organization}</h4>
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3">{item.description}</p>

                    {item.coursework && (
                      <div className={`mb-3 ${index % 2 === 0 ? 'text-left' : 'text-left md:text-right'}`}>
                        <div className="inline-block text-left text-xs font-mono text-gray-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/10">
                          <span className="text-primary font-semibold">Coursework: </span>
                          <span className="text-gray-400">{item.coursework}</span>
                        </div>
                      </div>
                    )}
                    
                    {item.score && (
                      <div className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-start md:justify-end'}`}>
                        <span className="text-primary font-mono text-xs bg-primary/10 inline-block px-3 py-1 rounded-md border border-primary/20">
                          {item.score}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Developer & Coding Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-poppins font-bold text-white mb-2">Coding & Engineering Activity</h3>
            <p className="text-gray-400 text-xs md:text-sm">Active problem solving, continuous building, and transparent engineering discipline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl border border-white/[0.08] hover:border-primary/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <FiGithub className="text-xl" />
                </div>
                <h4 className="text-white font-poppins font-semibold text-base mb-1">GitHub Activity</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  Active public repositories covering Near It..., YouTube RAG, Restaurant Agent, and Pluto with continuous commits.
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

            <div className="glass p-6 rounded-2xl border border-white/[0.08] hover:border-primary/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <FiCpu className="text-xl" />
                </div>
                <h4 className="text-white font-poppins font-semibold text-base mb-1">Generative AI Systems</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  Building stateful multi-step agents with LangGraph, semantic vector search with Qdrant, and Faster-Whisper audio RAG.
                </p>
              </div>
              <span className="text-gray-400 text-xs font-mono">
                Focus: LangGraph & RAG
              </span>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/[0.08] hover:border-primary/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <FiTerminal className="text-xl" />
                </div>
                <h4 className="text-white font-poppins font-semibold text-base mb-1">Full-Stack Deployments</h4>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  Shipping production MERN platforms with 150+ REST APIs, real-time WebSockets, Razorpay payments, and geospatial queries.
                </p>
              </div>
              <span className="text-primary text-xs font-mono">
                Status: 2 Live Platforms
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
