import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiServer, FiShield, FiDatabase, FiLayout, FiCpu } from 'react-icons/fi';

const engineeringPrinciples = [
  {
    icon: FiCode,
    title: "Clean & Maintainable Code",
    description: "Prioritizing modular component architecture, separation of concerns, and readable codebase conventions so software remains easy to test, extend, and maintain.",
    tags: ["Modular Architecture", "DRY & SOLID", "Code Readability"]
  },
  {
    icon: FiServer,
    title: "API Design & Backend Structure",
    description: "Designing structured RESTful APIs with predictable URI paths, standardized JSON payloads, clear status codes, and resilient error handling middleware.",
    tags: ["RESTful APIs", "Structured Routing", "Error Middleware"]
  },
  {
    icon: FiShield,
    title: "Authentication & Security",
    description: "Safeguarding user sessions with cryptographically signed JWT tokens, sanitized input validation, protected endpoints, and role-based authorization controls.",
    tags: ["JWT Authentication", "RBAC", "Input Sanitization"]
  },
  {
    icon: FiDatabase,
    title: "Database Modeling & Structure",
    description: "Architecting efficient MongoDB document schemas and relational models, leveraging compound indexing for fast querying, and ensuring transactional integrity.",
    tags: ["Schema Modeling", "Compound Indexing", "Data Integrity"]
  },
  {
    icon: FiLayout,
    title: "Responsive UI & State Management",
    description: "Crafting fluid, mobile-first interfaces with predictable unidirectional data flow, granular component state, and accessible interactions.",
    tags: ["Mobile-First UI", "Redux / Context", "Micro-Interactions"]
  },
  {
    icon: FiCpu,
    title: "Performance, Scale & Deployment",
    description: "Optimizing bundle sizes, handling real-time synchronization with WebSockets, and setting up reliable CI/CD pipelines for cloud deployments.",
    tags: ["WebSockets / Socket.IO", "Vercel / Cloud", "CI/CD Workflows"]
  }
];

const Engineering = () => {
  return (
    <section id="engineering" className="py-20 relative bg-[#080808]">
      {/* Background ambient glow */}
      <div className="absolute left-1/4 top-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">
            How I <span className="text-primary">Build</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
          <p className="mt-4 text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Practical engineering standards and architectural principles guiding how I build software from prototype to production.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {engineeringPrinciples.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="glass p-6 rounded-2xl border border-cardBorder hover:border-primary/40 transition-all flex flex-col group shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_10px_rgba(14,165,233,0.2)]">
                  <Icon className="text-xl" />
                </div>

                <h3 className="text-lg font-poppins font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-cardBorder/60">
                  {item.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-[11px] font-mono text-primary/80 bg-primary/5 px-2 py-0.5 rounded border border-primary/15"
                    >
                      {tag}
                    </span>
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

export default Engineering;
