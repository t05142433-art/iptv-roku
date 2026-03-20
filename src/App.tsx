/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { iptvService, XtreamConfig } from './services/iptvService';

export default function App() {
  const [appState, setAppState] = useState<'loading' | 'login' | 'dashboard'>('loading');
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check for saved credentials
    const saved = localStorage.getItem('iptv_config');
    if (saved) {
      const config = JSON.parse(saved);
      iptvService.setConfig(config);
      setIsAuth(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setAppState(isAuth ? 'dashboard' : 'login');
  };

  const handleLogin = async (host: string, user: string, pass: string) => {
    const config: XtreamConfig = { host, user, pass };
    iptvService.setConfig(config);
    
    try {
      const authData = await iptvService.authenticate();
      if (authData && authData.user_info && authData.user_info.auth === 1) {
        localStorage.setItem('iptv_config', JSON.stringify(config));
        setIsAuth(true);
        setAppState('dashboard');
      } else {
        alert('Falha na autenticação. Verifique seus dados.');
      }
    } catch (err) {
      alert('Erro ao conectar ao servidor. Verifique o Host e sua conexão.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('iptv_config');
    setIsAuth(false);
    setAppState('login');
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white">
      {appState === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}
      {appState === 'login' && <LoginScreen onLogin={handleLogin} />}
      {appState === 'dashboard' && <Dashboard onLogout={handleLogout} />}
    </div>
  );
}
