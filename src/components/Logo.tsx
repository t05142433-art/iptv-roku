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
        className="relative perspective-1000"
      >
        <h1 className={`${sizes[size]} font-black tracking-tighter text-3d logo-glow select-none text-center leading-none`}>
          <span className="text-primary">THAYSON</span>
          <br />
          <span className="text-white text-[0.6em]">&</span>
          <br />
          <span className="text-secondary">THAYLA</span>
        </h1>
        
        {/* 3D Borders */}
        <div className="absolute -inset-4 border-4 border-primary/30 rounded-2xl -z-10 blur-sm" />
        <div className="absolute -inset-2 border-2 border-secondary/50 rounded-xl -z-10" />
      </motion.div>
    </div>
  );
};
