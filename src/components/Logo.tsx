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
        initial={{ rotateY: -10, rotateX: 5 }}
        animate={{ 
          rotateY: [ -10, 10, -10 ],
          rotateX: [ 5, -5, 5 ],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative perspective-1000 transform-style-3d cursor-default"
      >
        <h1 className={`${sizes[size]} font-black tracking-tighter text-3d select-none text-center leading-none relative z-10`}>
          <span className="text-[#ff007f] drop-shadow-[0_0_10px_rgba(255,0,127,0.4)]">THAYSON</span>
          <br />
          <div className="flex items-center justify-center gap-4 my-2">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#ff007f]" />
            <span className="text-white text-[0.5em] font-black">&</span>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#007fff]" />
          </div>
          <span className="text-[#007fff] drop-shadow-[0_0_10px_rgba(0,127,255,0.4)]">THAYLA</span>
        </h1>
        
        {/* Optimized 3D Borders */}
        <div className="absolute -inset-6 border border-white/10 rounded-[2.5rem] -z-10 backdrop-blur-sm shadow-xl" />
      </motion.div>
    </div>
  );
};
