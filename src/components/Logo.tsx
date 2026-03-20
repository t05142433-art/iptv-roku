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
          rotateX: [ 10, -10, 10 ],
          z: [ 0, 50, 0 ]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative perspective-1000 transform-style-3d cursor-default"
      >
        <div className="absolute inset-0 bg-black/40 blur-3xl rounded-full -z-30 translate-x-8 translate-y-8" />
        
        <h1 className={`${sizes[size]} font-black tracking-tighter text-3d select-none text-center leading-none relative z-10`}>
          <span className="text-[#ff007f] drop-shadow-[0_0_20px_rgba(255,0,127,0.8)]">THAYSON</span>
          <br />
          <div className="flex items-center justify-center gap-4 my-2">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#ff007f]" />
            <span className="text-white text-[0.5em] font-black drop-shadow-[0_0_10px_white]">&</span>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#007fff]" />
          </div>
          <span className="text-[#007fff] drop-shadow-[0_0_20px_rgba(0,127,255,0.8)]">THAYLA</span>
        </h1>
        
        {/* 3D Borders and Glows */}
        <div className="absolute -inset-12 bg-gradient-to-br from-[#ff007f]/10 to-[#007fff]/10 blur-3xl rounded-full -z-20 animate-pulse" />
        <div className="absolute -inset-6 border-2 border-white/10 rounded-[2.5rem] -z-10 backdrop-blur-sm shadow-[0_0_40px_rgba(255,0,127,0.2)]" />
        <div className="absolute -inset-2 border border-white/20 rounded-3xl -z-10" />
      </motion.div>
    </div>
  );
};
