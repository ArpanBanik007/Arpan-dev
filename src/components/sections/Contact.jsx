import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiSend, FiMessageSquare, FiDownload, FiLinkedin, FiGithub } from 'react-icons/fi';
import { developerInfo } from '../../data/constants';

const API_URL = 'http://localhost:5000/api/contact';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please check if the backend is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-grid-pattern">
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        {/* Looking for the Next Opportunity Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass p-8 md:p-12 rounded-3xl border border-white/[0.1] max-w-5xl mx-auto mb-20 relative overflow-hidden text-center shadow-[0_0_30px_rgba(14,165,233,0.12)]"
        >
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/15 rounded-full blur-[80px] -z-10 pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-[80px] -z-10 pointer-events-none" />

          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono mb-4">
            Actively Available
          </span>
          <h3 className="text-2xl md:text-4xl font-poppins font-bold text-white mb-3">
            Looking for the Next Opportunity
          </h3>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Open for <span className="text-primary font-medium">Software Developer</span>, <span className="text-primary font-medium">Full-Stack Developer</span>, and <span className="text-primary font-medium">Generative AI / LLM Engineer</span> roles & internships.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href="/Arpan_Banik_Resume.pdf"
              download="Arpan_Banik_Resume.pdf"
              className="px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-sky-400 transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)] flex items-center gap-2 cursor-pointer text-sm"
            >
              <FiDownload className="text-base" /> Download Resume
            </a>
            <a
              href={developerInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full glass border border-white/10 text-gray-200 hover:text-white hover:border-primary/50 transition-all flex items-center gap-2 text-sm"
            >
              <FiLinkedin className="text-primary text-base" /> LinkedIn
            </a>
            <a
              href={developerInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full glass border border-white/10 text-gray-200 hover:text-white hover:border-primary/50 transition-all flex items-center gap-2 text-sm"
            >
              <FiGithub className="text-primary text-base" /> GitHub
            </a>
            <a
              href={`mailto:${developerInfo.email}`}
              className="px-6 py-3 rounded-full glass border border-white/10 text-gray-200 hover:text-white hover:border-primary/50 transition-all flex items-center gap-2 text-sm"
            >
              <FiMail className="text-primary text-base" /> Email Me
            </a>
          </div>
        </motion.div>

        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-3">
            Direct Channel
          </div>
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-poppins font-bold text-white mb-3">Let's connect & collaborate</h3>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm md:text-base">
              Interested in discussing a software engineering position, Generative AI project, or internship opportunity? Feel free to reach out directly.
            </p>

            <div className="flex items-center gap-5 p-4 rounded-xl glass border border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(14,165,233,0.2)] shrink-0">
                <FiMail className="text-xl" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Email Address</h4>
                <a href={`mailto:${developerInfo.email}`} className="text-gray-400 hover:text-primary transition-colors text-sm font-mono">{developerInfo.email}</a>
              </div>
            </div>

            <div className="flex items-center gap-5 p-4 rounded-xl glass border border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(14,165,233,0.2)] shrink-0">
                <FiPhone className="text-xl" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Phone / WhatsApp</h4>
                <a href={`https://wa.me/${developerInfo.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors text-sm font-mono">{developerInfo.phone}</a>
              </div>
            </div>

            <div className="flex items-center gap-5 p-4 rounded-xl glass border border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(14,165,233,0.2)] shrink-0">
                <FiMapPin className="text-xl" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Current Location</h4>
                <p className="text-gray-400 text-sm font-mono">{developerInfo.location}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <a 
                href={`https://wa.me/${developerInfo.phone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-medium transition-colors shadow-lg text-sm"
              >
                <FiMessageSquare className="text-base" /> WhatsApp Quick Chat
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl flex flex-col gap-5 relative overflow-hidden border border-white/[0.08]">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[50px] -z-10 pointer-events-none" />
              
              <div>
                <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">Your Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  placeholder="What would you like to discuss?"
                ></textarea>
              </div>

              {status.message && (
                <div className={`p-4 rounded-xl text-xs font-mono ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {status.message}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-sky-400 transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)] flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <FiSend className={isSubmitting ? 'animate-bounce text-base' : 'text-base'} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
