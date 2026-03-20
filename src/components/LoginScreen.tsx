import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { User, Lock, Globe, Play, X } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (host: string, user: string, pass: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [host, setHost] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (host && user && pass) {
      onLogin(host, user, pass);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
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
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-3d p-10 rounded-[40px] w-full max-w-md relative z-10 border border-white/10"
      >
        <Logo size="md" className="mb-10" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#007fff] ml-1">Servidor (Host)</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="text" 
                placeholder="http://url-iptv.com:8080"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#007fff] transition-all text-sm font-medium placeholder:text-white/10"
                value={host}
                onChange={e => setHost(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff007f] ml-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="text" 
                placeholder="Seu usuário"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#ff007f] transition-all text-sm font-medium placeholder:text-white/10"
                value={user}
                onChange={e => setUser(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff007f] ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input 
                type="password" 
                placeholder="Sua senha"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#ff007f] transition-all text-sm font-medium placeholder:text-white/10"
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button"
              className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/5"
              onClick={() => { setHost(''); setUser(''); setPass(''); }}
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-gradient-to-br from-[#ff007f] to-[#800040] hover:shadow-[0_0_30px_rgba(255,0,127,0.4)] transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Play className="w-4 h-4" /> Entrar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
