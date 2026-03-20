import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        initial={{ rotateY: -20, rotateX: 10 }}
        animate={{ 
          rotateY: [ -20, 20, -20 ],
          rotateX: [ 10, -10, 10 ]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative perspective-1000 transform-style-3d"
      >
        <h1 className={`${sizes[size]} font-black tracking-tighter text-3d select-none text-center leading-none`}>
          <span className="text-[#ff007f] drop-shadow-[0_0_15px_rgba(255,0,127,0.5)]">THAYSON</span>
          <br />
          <span className="text-white text-[0.6em] opacity-80">&</span>
          <br />
          <span className="text-[#007fff] drop-shadow-[0_0_15px_rgba(0,127,255,0.5)]">THAYLA</span>
        </h1>
        
        {/* 3D Borders and Glows */}
        <div className="absolute -inset-8 bg-[#ff007f]/10 blur-3xl rounded-full -z-20 animate-pulse" />
        <div className="absolute -inset-4 border-2 border-[#ff007f]/30 rounded-2xl -z-10 blur-[2px]" />
        <div className="absolute -inset-2 border border-[#007fff]/50 rounded-xl -z-10" />
      </motion.div>
    </div>
  );
};
