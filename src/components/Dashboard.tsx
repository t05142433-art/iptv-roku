import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tv, Film, PlayCircle, Settings, Search, LogOut, Clock, ChevronRight, Star, Info, X, Globe, Palette, Smartphone } from 'lucide-react';
import { Logo } from './Logo';
import { iptvService, Category, Stream, Series } from '../services/iptvService';
import { VideoPlayer } from './VideoPlayer';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'channels' | 'movies' | 'series' | 'settings'>('channels');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [playingStream, setPlayingStream] = useState<{ url: string; title: string; id: string | number } | null>(null);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [theme, setTheme] = useState<'pink-blue' | 'blue' | 'pink'>('pink-blue');
  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    loadCategories();
    loadContinueWatching();
  }, [activeTab]);

  useEffect(() => {
    loadItems();
  }, [activeTab, selectedCategory]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const action = activeTab === 'channels' ? 'get_live_categories' : 
                     activeTab === 'movies' ? 'get_vod_categories' : 'get_series_categories';
      const cats = await iptvService.getCategories(action);
      setCategories([{ category_id: 'all', category_name: 'Todos' }, ...cats]);
      setSelectedCategory('all');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const action = activeTab === 'channels' ? 'get_live_streams' : 
                     activeTab === 'movies' ? 'get_vod_streams' : 'get_series';
      const data = await iptvService.getStreams(action, selectedCategory === 'all' ? undefined : selectedCategory);
      setItems(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const loadContinueWatching = () => {
    const saved = localStorage.getItem('continue_watching');
    if (saved) setContinueWatching(JSON.parse(saved));
  };

  const saveProgress = (item: any, time: number) => {
    const saved = localStorage.getItem('continue_watching');
    let list = saved ? JSON.parse(saved) : [];
    const index = list.findIndex((i: any) => i.id === item.id);
    const newItem = { ...item, progress: time, lastWatched: Date.now() };
    if (index > -1) list[index] = newItem;
    else list.unshift(newItem);
    list = list.slice(0, 10); // Keep last 10
    localStorage.setItem('continue_watching', JSON.stringify(list));
    setContinueWatching(list);
  };

  const filteredItems = items.filter(item => 
    (item.name || item.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlay = (item: any) => {
    const type = activeTab === 'channels' ? 'live' : activeTab === 'movies' ? 'movie' : 'series';
    const id = item.stream_id || item.series_id;
    const url = iptvService.getStreamUrl(type, id);
    setPlayingStream({ url, title: item.name || item.title, id });
  };

  const themeColors = {
    'pink-blue': 'from-primary to-secondary shadow-primary/30',
    'blue': 'from-secondary to-secondary shadow-secondary/30',
    'pink': 'from-primary to-primary shadow-primary/30'
  };

  const t = {
    pt: {
      channels: 'Canais ao Vivo',
      movies: 'Cinema',
      series: 'Séries',
      settings: 'Ajustes',
      search: 'Pesquisar...',
      categories: 'Categorias',
      continue: 'Continuar Assistindo',
      watch: 'ASSISTIR',
      play: 'REPRODUZIR AGORA',
      more: 'MAIS INFO',
      recommended: 'Recomendados para você',
      logout: 'SAIR DA CONTA',
      generate: 'GERAR CÓDIGO (GIT CODE)',
      remote: 'Acesso Remoto',
      remote_desc: 'Gere um código para gerenciar sua playlist de outro dispositivo.',
      general: 'Geral',
      lang: 'Idioma',
      visual: 'Tema Visual'
    },
    en: {
      channels: 'Live Channels',
      movies: 'Movies',
      series: 'Series',
      settings: 'Settings',
      search: 'Search...',
      categories: 'Categories',
      continue: 'Continue Watching',
      watch: 'WATCH',
      play: 'PLAY NOW',
      more: 'MORE INFO',
      recommended: 'Recommended for you',
      logout: 'LOGOUT',
      generate: 'GENERATE CODE (GIT CODE)',
      remote: 'Remote Access',
      remote_desc: 'Generate a code to manage your playlist from another device.',
      general: 'General',
      lang: 'Language',
      visual: 'Visual Theme'
    }
  }[language as 'pt' | 'en'] || {
    channels: 'Canais ao Vivo',
    movies: 'Cinema',
    series: 'Séries',
    settings: 'Ajustes',
    search: 'Pesquisar...',
    categories: 'Categorias',
    continue: 'Continuar Assistindo',
    watch: 'ASSISTIR',
    play: 'REPRODUZIR AGORA',
    more: 'MAIS INFO',
    recommended: 'Recomendados para você',
    logout: 'SAIR DA CONTA',
    generate: 'GERAR CÓDIGO (GIT CODE)',
    remote: 'Acesso Remoto',
    remote_desc: 'Gere um código para gerenciar sua playlist de outro dispositivo.',
    general: 'Geral',
    lang: 'Idioma',
    visual: 'Tema Visual'
  };

  const renderSettings = () => (
    <div className="p-10 space-y-10 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-8">{t.settings}</h2>
      
      <div className="glass p-8 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2"><Settings className="w-6 h-6" /> {t.general}</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm text-white/50 uppercase font-bold">{t.lang}</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/50 uppercase font-bold">{t.visual}</label>
            <div className="flex gap-4">
              {['pink-blue', 'blue', 'pink'].map(themeKey => (
                <button 
                  key={themeKey}
                  onClick={() => setTheme(themeKey as any)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${theme === themeKey ? 'border-primary bg-primary/20' : 'border-white/10 bg-white/5'}`}
                >
                  {themeKey.replace('-', ' & ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">{t.remote}</h3>
        <p className="text-white/60">{t.remote_desc}</p>
        <button 
          className={`px-8 py-4 bg-gradient-to-r ${themeColors[theme]} rounded-xl font-bold hover:scale-105 transition-transform`}
          onClick={() => {
            const code = Math.floor(100000 + Math.random() * 900000);
            alert(`Seu código de 6 dígitos: ${code}\nVálido por 5 minutos.`);
          }}
        >
          {t.generate}
        </button>
      </div>

      <button 
        onClick={onLogout}
        className="w-full p-6 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors"
      >
        <LogOut className="w-6 h-6" /> {t.logout}
      </button>
    </div>
  );

  return (
    <div className={`flex h-screen bg-black overflow-hidden ${theme === 'blue' ? '[--color-primary:#007fff]' : theme === 'pink' ? '[--color-secondary:#ff007f]' : ''}`}>
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 overflow-hidden -z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] bg-[#ff007f]/20 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-[#007fff]/20 blur-[150px] rounded-full"
        />
      </div>

      {/* Sidebar Navigation */}
      <div className="w-24 flex flex-col items-center py-10 glass-3d border-r border-white/5 gap-16 z-20">
        <Logo size="sm" />
        <nav className="flex flex-col gap-10">
          {[
            { id: 'channels', icon: Tv, label: t.channels },
            { id: 'movies', icon: Film, label: t.movies },
            { id: 'series', icon: PlayCircle, label: t.series },
            { id: 'settings', icon: Settings, label: t.settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-5 rounded-3xl transition-all group relative ${activeTab === tab.id ? `bg-gradient-to-br ${themeColors[theme]} text-white shadow-[0_0_20px_rgba(255,0,127,0.3)]` : 'text-white/30 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-8 h-8" />
              <span className="absolute left-full ml-6 px-4 py-2 glass-3d text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <div className="h-28 flex items-center justify-between px-12 glass-3d border-b border-white/5">
          <h2 className="text-4xl font-black tracking-tighter uppercase text-3d">
            {activeTab === 'channels' ? t.channels : activeTab === 'movies' ? t.movies : activeTab === 'series' ? t.series : t.settings}
          </h2>
          
          <div className="relative w-[400px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input 
              type="text" 
              placeholder={t.search}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-[#ff007f] transition-all text-sm font-medium"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {activeTab === 'settings' ? renderSettings() : (
          <div className="flex flex-1 overflow-hidden">
            {/* Categories Sidebar */}
            <div className="w-80 overflow-y-auto p-8 space-y-3 glass-3d border-r border-white/5">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 px-4">{t.categories}</h3>
              {categories.map(cat => (
                <button
                  key={cat.category_id}
                  onClick={() => setSelectedCategory(cat.category_id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center justify-between group border border-transparent ${selectedCategory === cat.category_id ? 'bg-white/10 border-white/10 text-white font-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  <span className="truncate text-sm uppercase tracking-wider">{cat.category_name}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === cat.category_id ? 'rotate-90 text-[#ff007f]' : 'group-hover:translate-x-1'}`} />
                </button>
              ))}
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
              {/* Continue Watching Section */}
              {continueWatching.length > 0 && selectedCategory === 'all' && (
                <div className="mb-16">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-3d"><Clock className="w-7 h-7 text-[#ff007f]" /> {t.continue}</h3>
                  <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
                    {continueWatching.map(item => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="flex-shrink-0 w-72 card-3d glass-3d rounded-[32px] overflow-hidden cursor-pointer group border border-white/5"
                        onClick={() => handlePlay(item)}
                      >
                        <div className="relative aspect-video">
                          <img src={item.stream_icon || item.cover} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="w-16 h-16 bg-[#ff007f] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,127,0.6)]">
                              <PlayCircle className="w-10 h-10 text-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-[#ff007f] to-[#007fff]" style={{ width: '40%' }} />
                        </div>
                        <div className="p-5">
                          <p className="font-black text-sm truncate uppercase tracking-tight">{item.name || item.title}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                {loading ? (
                  Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-[32px]" />
                  ))
                ) : filteredItems.map(item => (
                  <motion.div
                    key={item.stream_id || item.series_id}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="flex flex-col gap-4 group cursor-pointer"
                    onClick={() => {
                      if (activeTab === 'channels') handlePlay(item);
                      else setSelectedItem(item);
                    }}
                  >
                    <div className="relative aspect-[2/3] rounded-[32px] overflow-hidden shadow-2xl card-3d border border-white/5">
                      <img 
                        src={item.stream_icon || item.cover || `https://picsum.photos/seed/${item.name}/300/450`} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                        <button className={`w-full py-4 bg-gradient-to-r ${themeColors[theme]} rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform`}>
                          {t.watch}
                        </button>
                      </div>
                      {item.rating && (
                        <div className="absolute top-4 right-4 px-3 py-1.5 glass-3d rounded-xl flex items-center gap-1.5 text-[10px] font-black">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {item.rating}
                        </div>
                      )}
                    </div>
                    <p className="font-black text-xs uppercase tracking-wider truncate px-2 group-hover:text-[#ff007f] transition-colors">{item.name || item.title}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-10 bg-black/90 backdrop-blur-xl"
          >
            <div className="max-w-6xl w-full flex gap-12 relative">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 -right-12 p-3 glass rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="w-1/3 flex-shrink-0">
                <img 
                  src={selectedItem.stream_icon || selectedItem.cover} 
                  className="w-full rounded-3xl shadow-2xl border border-white/10" 
                  alt="" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 space-y-8 py-8">
                <div className="space-y-4">
                  <h2 className="text-6xl font-black tracking-tighter uppercase leading-none">{selectedItem.name || selectedItem.title}</h2>
                  <div className="flex items-center gap-4 text-white/60 font-bold">
                    <span className="px-2 py-1 border border-white/20 rounded text-xs uppercase">{selectedItem.rating || 'N/A'}</span>
                    <span>{selectedItem.releaseDate || selectedItem.year || '2024'}</span>
                    <span>{selectedItem.genre || 'Ação / Drama'}</span>
                  </div>
                </div>

                <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
                  {selectedItem.plot || 'Nenhuma descrição disponível para este título no momento. Aproveite o melhor do entretenimento com Thayson & Thayla IPTV.'}
                </p>

                <div className="flex gap-6">
                  <button 
                    onClick={() => { handlePlay(selectedItem); setSelectedItem(null); }}
                    className={`px-12 py-5 bg-gradient-to-r ${themeColors[theme]} rounded-2xl font-black text-xl flex items-center gap-3 hover:scale-105 transition-transform shadow-xl`}
                  >
                    <PlayCircle className="w-8 h-8" /> {t.play}
                  </button>
                  <button className="px-8 py-5 glass rounded-2xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
                    <Info className="w-6 h-6" /> {t.more}
                  </button>
                </div>

                <div className="pt-12">
                  <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">{t.recommended}</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {items.slice(0, 10).map(rec => (
                      <div key={rec.id} className="w-32 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
                        <img src={rec.stream_icon || rec.cover} className="w-full aspect-[2/3] object-cover rounded-xl" alt="" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Overlay */}
      {playingStream && (
        <VideoPlayer 
          url={playingStream.url}
          title={playingStream.title}
          onClose={() => setPlayingStream(null)}
          onProgress={(time) => {
            // Throttled save progress
            if (Math.floor(time) % 10 === 0) {
              saveProgress(items.find(i => (i.stream_id || i.series_id) === playingStream.id), time);
            }
          }}
        />
      )}
    </div>
  );
};
