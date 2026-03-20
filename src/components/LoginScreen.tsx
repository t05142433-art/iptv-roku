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
    <div className="min-h-screen flex items-center justify-center bg-bg-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass p-10 rounded-3xl w-full max-w-md relative z-10"
      >
        <Logo size="md" className="mb-8" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1">Servidor (Host)</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="text" 
                placeholder="http://url-iptv.com:8080"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-secondary transition-colors"
                value={host}
                onChange={e => setHost(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="text" 
                placeholder="Seu usuário"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors"
                value={user}
                onChange={e => setUser(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="password" 
                placeholder="Sua senha"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors"
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              onClick={() => { setHost(''); setUser(''); setPass(''); }}
            >
              <X className="w-5 h-5" /> Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Play className="w-5 h-5" /> Continuar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
