import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // unmount logic
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative mb-8">
        <motion.div 
          className="text-6xl font-poppins font-bold gradient-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          AB.
        </motion.div>
        <motion.div 
          className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full -z-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="w-64 h-1 bg-cardBorder rounded-full overflow-hidden relative">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_#0ea5e9]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 text-gray-400 font-mono text-sm flex justify-between w-64">
        <span>Initializing...</span>
        <span>{progress}%</span>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
