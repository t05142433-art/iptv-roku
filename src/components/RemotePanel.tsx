import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export const RemotePanel: React.FC = () => {
  const [code, setCode] = useState('');
  const [playlist, setPlaylist] = useState({ host: '', user: '', pass: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, playlist })
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass p-10 rounded-3xl w-full max-w-lg space-y-8"
      >
        <Logo size="md" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Painel de Controle Remoto</h2>
          <p className="text-white/50">Digite o código da TV para enviar sua playlist.</p>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-6 py-10">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            <p className="text-xl font-bold">Playlist enviada com sucesso!</p>
            <button 
              onClick={() => setStatus('idle')}
              className="px-8 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              Enviar Outra
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Código da TV (6 dígitos)</label>
              <input 
                type="text" 
                maxLength={6}
                placeholder="000000"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-3xl font-black tracking-[1em] focus:border-primary focus:outline-none"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <input 
                type="text" 
                placeholder="Host (http://...)"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-secondary focus:outline-none"
                value={playlist.host}
                onChange={e => setPlaylist({ ...playlist, host: e.target.value })}
                required
              />
              <input 
                type="text" 
                placeholder="Usuário"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-secondary focus:outline-none"
                value={playlist.user}
                onChange={e => setPlaylist({ ...playlist, user: e.target.value })}
                required
              />
              <input 
                type="password" 
                placeholder="Senha"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-secondary focus:outline-none"
                value={playlist.pass}
                onChange={e => setPlaylist({ ...playlist, pass: e.target.value })}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {status === 'loading' ? 'Enviando...' : <><Send className="w-5 h-5" /> ENVIAR PARA TV</>}
            </button>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-500 justify-center font-bold">
                <AlertCircle className="w-5 h-5" /> Código inválido ou expirado.
              </div>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};
