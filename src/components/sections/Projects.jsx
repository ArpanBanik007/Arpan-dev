import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiLayers, FiCpu, FiCode } from 'react-icons/fi';
import { projects } from '../../data/projects';

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass rounded-2xl overflow-hidden group border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] h-full flex flex-col"
    >
      {/* Media / Preview container */}
      <div className="relative h-52 overflow-hidden bg-black/60">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <span className="text-[11px] font-mono text-white/90 bg-black/70 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
            {project.category}
          </span>
          {project.demo ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE PLATFORM
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/25 backdrop-blur-md flex items-center gap-1.5">
              <FiCode className="text-xs" />
              AI REPOSITORY
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 relative z-10 -mt-6 flex-grow flex flex-col">
        <h3 className="text-xl font-poppins font-bold text-white mb-2 tracking-wide group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        {project.problem && (
          <div className="mb-3 text-xs text-gray-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.06] leading-relaxed">
            <span className="font-semibold text-gray-200">Engineering Focus: </span>
            {project.problem}
          </div>
        )}

        <p className="text-gray-300 text-xs md:text-sm mb-3 leading-relaxed">
          {project.description}
        </p>

        {project.architecture && (
          <div className="mb-4 text-[11px] font-mono text-sky-300 bg-primary/5 p-2 rounded-lg border border-primary/20 flex items-center gap-2 overflow-x-auto">
            <span className="font-semibold text-primary shrink-0 flex items-center gap-1">
              <FiCpu className="text-xs" /> Arch:
            </span>
            <span className="whitespace-nowrap text-gray-300">{project.architecture}</span>
          </div>
        )}

        {project.features && (
          <ul className="mb-4 space-y-1.5 text-xs text-gray-400">
            {project.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary leading-none mt-1 shrink-0 font-bold">›</span>
                <span className="leading-snug">{feat}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto pt-2">
          {project.techStack.map((tech, i) => (
            <span key={i} className="text-[11px] font-mono text-primary/90 bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div className="flex justify-between items-center border-t border-white/[0.08] pt-4 mt-auto">
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <FiGithub className="text-base" /> GitHub Repository
          </a>
          {project.demo ? (
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-sky-300 transition-colors flex items-center gap-1.5 text-sm font-semibold"
            >
              <span>Live Website</span>
              <FiExternalLink className="text-base" />
            </a>
          ) : (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-200 transition-colors flex items-center gap-1 text-xs font-mono"
            >
              <span>View Source</span>
              <FiExternalLink className="text-xs" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.domain === activeFilter;
  });

  return (
    <section id="projects" className="py-24 relative bg-grid-pattern">
      <div className="absolute right-0 top-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-3">
            Portfolio Showcase
          </div>
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
          <p className="mt-4 text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Real-world full-stack platforms with live deployments and production Generative AI applications covering RAG, vector search, and LangGraph agents.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2 rounded-full text-xs font-mono transition-all duration-200 ${
                activeFilter === 'all'
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'glass text-gray-400 hover:text-white hover:border-primary/40'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveFilter('ai')}
              className={`px-5 py-2 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 ${
                activeFilter === 'ai'
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'glass text-gray-400 hover:text-white hover:border-primary/40'
              }`}
            >
              <FiCpu className="text-xs" />
              Generative AI & Agents ({projects.filter((p) => p.domain === 'ai').length})
            </button>
            <button
              onClick={() => setActiveFilter('fullstack')}
              className={`px-5 py-2 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 ${
                activeFilter === 'fullstack'
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'glass text-gray-400 hover:text-white hover:border-primary/40'
              }`}
            >
              <FiLayers className="text-xs" />
              Full-Stack Platforms ({projects.filter((p) => p.domain === 'fullstack').length})
            </button>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
