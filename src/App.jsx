import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import LoadingScreen from './components/layout/LoadingScreen';
import CustomCursor from './components/layout/CustomCursor';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Hero from './components/sections/Hero';
import About from './components/sections/About';
import TechStack from './components/sections/TechStack';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';

function App() {
  const [loading, setLoading] = useState(true);


  return (
    <>
      <CustomCursor />

      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex flex-col relative z-0">
            <Hero />
            <About />
            <TechStack />
            <Experience />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
