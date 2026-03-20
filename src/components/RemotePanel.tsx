import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Send, CheckCircle, AlertCircle, Tv, Smartphone, ArrowLeft } from 'lucide-react';

export const RemotePanel: React.FC = () => {
  const [code, setCode] = useState('');
  const [host, setHost] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setStatus('error');
      setMessage('O código deve ter 6 dígitos');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/remote-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, host, user, pass })
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Conectado com sucesso! Verifique sua TV.');
      } else {
        throw new Error('Falha ao conectar');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao conectar. Verifique o código e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background optimized for performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff007f]/10 via-black to-[#007fff]/10 -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-3d p-8 rounded-[2.5rem] border border-white/10 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo size="sm" className="mb-4" />
          <h2 className="text-2xl font-black text-white tracking-tight uppercase text-center">Painel de Conexão Remota</h2>
          <p className="text-white/40 text-sm text-center mt-2">Digite o código que aparece na sua TV Roku</p>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-6 py-10">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            <p className="text-xl font-bold text-white">{message}</p>
            <button 
              onClick={() => setStatus('idle')}
              className="px-8 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-white font-bold"
            >
              Conectar Outra TV
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#ff007f] uppercase tracking-widest ml-2">Código da TV</label>
              <div className="relative">
                <Tv className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Ex: 123456"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#ff007f] transition-all font-mono text-xl tracking-[0.5em] text-center"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Host IPTV</label>
                <input
                  type="url"
                  placeholder="http://exemplo.com:8080"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-[#007fff] transition-all text-sm"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Usuário</label>
                  <input
                    type="text"
                    placeholder="User"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-[#ff007f] transition-all text-sm"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Senha</label>
                  <input
                    type="password"
                    placeholder="Pass"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-[#ff007f] transition-all text-sm"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl ${
                status === 'loading' ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-gradient-to-r from-[#ff007f] to-[#007fff] text-white hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {status === 'loading' ? 'Conectando...' : (
                <>
                  Conectar na TV <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-2xl flex items-center gap-3 bg-red-500/10 text-red-500 border border-red-500/20"
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-bold">{message}</p>
          </motion.div>
        )}

        <button 
          onClick={() => window.history.back()}
          className="mt-8 text-white/20 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </motion.div>
    </div>
  );
};
