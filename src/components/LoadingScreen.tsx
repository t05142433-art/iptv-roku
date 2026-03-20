import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#ff007f]/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#007fff]/20 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Logo size="xl" />
      </motion.div>
      
      <div className="mt-16 w-80 h-2 bg-white/5 rounded-full overflow-hidden glass-3d relative">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#ff007f] via-[#ff007f] to-[#007fff] shadow-[0_0_20px_rgba(255,0,127,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-6 text-white/40 font-mono text-xs tracking-[0.3em] uppercase">
        Iniciando Experiência 3D... {progress}%
      </p>
    </div>
  );
};
