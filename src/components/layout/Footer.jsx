import React from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiHeart } from 'react-icons/fi';
import { developerInfo } from '../../data/constants';

const Footer = () => {
  return (
    <footer className="bg-[#050505] py-8 border-t border-cardBorder text-center relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex justify-center gap-6 mb-6">
          <a href={developerInfo.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-card hover:bg-primary/20 hover:text-primary transition-all duration-300 transform hover:-translate-y-1">
            <FiGithub className="text-xl" />
          </a>
          <a href={developerInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-card hover:bg-primary/20 hover:text-primary transition-all duration-300 transform hover:-translate-y-1">
            <FiLinkedin className="text-xl" />
          </a>
          <a href={developerInfo.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-card hover:bg-primary/20 hover:text-primary transition-all duration-300 transform hover:-translate-y-1">
            <FiTwitter className="text-xl" />
          </a>
        </div>
        <p className="flex justify-center items-center gap-2 text-gray-400 text-sm">
          Built with <FiHeart className="text-red-500 animate-pulse" /> by {developerInfo.name}
        </p>
        <p className="mt-2 text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
