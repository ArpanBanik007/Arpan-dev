import React from 'react';
import { motion } from 'framer-motion';
import { developerInfo } from '../../data/constants';

const About = () => {
  const skillBars = [
    { name: 'MERN Stack', percentage: 90 },
    { name: 'Frontend (React/Tailwind)', percentage: 85 },
    { name: 'Backend (Node/Express/MongoDB)', percentage: 85 },
    { name: 'Problem Solving (DSA)', percentage: 80 },
    { name: 'Digital Marketing / SEO', percentage: 75 },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">About <span className="text-primary">Me</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Bio side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass p-8 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full transition-transform group-hover:scale-110" />
            <h3 className="text-2xl font-poppins font-semibold text-white mb-4 relative z-10">Who am I?</h3>
            <p className="text-gray-300 leading-relaxed mb-6 relative z-10">
              I'm {developerInfo.name}, based in {developerInfo.location}. {developerInfo.bio}
            </p>
            <p className="text-gray-300 leading-relaxed relative z-10">
              Whether building stunning frontends with React or robust architectures with Node.js and MongoDB, I love turning complex problems into elegant, scalable solutions.
            </p>
          </motion.div>

          {/* Skills side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <h3 className="text-2xl font-poppins font-semibold text-white mb-2">Core Proficiencies</h3>
            {skillBars.map((skill, index) => (
              <div key={index} className="w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium text-sm">{skill.name}</span>
                  <span className="text-primary font-mono text-sm">{skill.percentage}%</span>
                </div>
                <div className="w-full bg-cardBorder rounded-full h-2">
                  <motion.div 
                    className="bg-primary h-2 rounded-full shadow-[0_0_10px_#0ea5e9]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
