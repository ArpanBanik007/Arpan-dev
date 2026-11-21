import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiServer, FiShield, FiDatabase, FiLayout, FiCpu } from 'react-icons/fi';

const engineeringPrinciples = [
  {
    icon: FiCode,
    title: "Layered & Modular Code",
    description: "Architecting applications with strict controller–service–model separation, reusable component trees, and self-documenting code so features remain testable and extendable.",
    tags: ["Controller-Service-Model", "Modular Design", "Clean Architecture"]
  },
  {
    icon: FiCpu,
    title: "Generative AI & Agentic Systems",
    description: "Designing stateful multi-step agent workflows with LangGraph, deterministic tool calling, structured Pydantic outputs, and token/cost telemetry.",
    tags: ["LangGraph StateGraphs", "Pydantic Schemas", "Prompt Engineering"]
  },
  {
    icon: FiDatabase,
    title: "RAG & Vector Embeddings",
    description: "Building production RAG pipelines with Qdrant vector databases, dense 384-dim embeddings (SentenceTransformers), and Faster-Whisper audio transcription.",
    tags: ["Qdrant Vector DB", "all-MiniLM-L6-v2", "Faster-Whisper RAG"]
  },
  {
    icon: FiShield,
    title: "Authentication & Security",
    description: "Enforcing security with cryptographically signed JWTs in HTTP-only cookies, email OTP verification, and backend-enforced Role-Based Access Control (RBAC).",
    tags: ["JWT & HTTP-Only", "RBAC Enforcement", "Email OTP"]
  },
  {
    icon: FiServer,
    title: "Payments & Webhook Processing",
    description: "Integrating Razorpay with server-side amount calculation, cryptographic HMAC signature verification, duplicate-protected refunds, and webhook event listeners.",
    tags: ["Razorpay Gateway", "HMAC Verification", "Webhook Handling"]
  },
  {
    icon: FiLayout,
    title: "Real-Time Sync & Geospatial Scale",
    description: "Leveraging Socket.IO event rooms for live booking and social updates, paired with MongoDB $geoNear geospatial radius queries and Leaflet maps.",
    tags: ["Socket.IO Rooms", "MongoDB $geoNear", "Leaflet Maps"]
  }
];

const Engineering = () => {
  return (
    <section id="engineering" className="py-24 relative bg-[#07090e] bg-grid-pattern">
      {/* Background ambient glow */}
      <div className="absolute left-1/4 top-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-3">
            Architectural Philosophy
          </div>
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">
            How I <span className="text-primary">Build</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
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
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass p-6 rounded-2xl border border-white/[0.08] hover:border-primary/40 transition-all duration-300 flex flex-col group shadow-md hover:shadow-[0_0_20px_rgba(14,165,233,0.12)]"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_10px_rgba(14,165,233,0.15)]">
                  <Icon className="text-xl" />
                </div>

                <h3 className="text-base font-poppins font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.08]">
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
