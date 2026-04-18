import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { projects } from '../../data/projects';

const ProjectCard = ({ project, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass rounded-2xl overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
        </div>
        <div className="p-6 relative z-10 -mt-8 flex-grow flex flex-col">
          <h3 className="text-xl font-poppins font-bold text-white mb-2 tracking-wide group-hover:text-primary transition-colors">{project.title}</h3>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            {project.techStack.map((tech, i) => (
              <span key={i} className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                {tech}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center border-t border-cardBorder pt-4 mt-auto">
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <FiGithub className="text-lg" /> Code
            </a>
            <a 
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium opacity-50 cursor-not-allowed"
              title="Demo not available yet"
            >
              <FiExternalLink className="text-lg" /> Live
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-20 relative">
      <div className="absolute right-0 top-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">Featured <span className="text-primary">Projects</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
