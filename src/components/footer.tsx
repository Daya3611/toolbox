"use client"
import React from 'react';
import { Github, Twitter, Mail, Heart, ArrowUp, Globe, Shield, Zap } from 'lucide-react';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
   <footer>
    <div className='bg-transparent text-slate-200 py-8 px-4 md:px-8 lg:px-16'>
       © Toolbox 2025 | Made with <Heart className="inline text-red-500" /> by <a href="https://dayanandgawade.in" className='hover:text-blue-300'>Daya3611</a>
    </div>
   </footer>
  );
}

export default Footer;