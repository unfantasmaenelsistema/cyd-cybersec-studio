import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Terminal, 
  FileCode, 
  Layers, 
  Scale, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Radio, 
  LayoutDashboard,
  ExternalLink,
  Zap,
  GraduationCap,
  Printer,
  Sun,
  Moon,
  BookOpen
} from 'lucide-react';
import { TabType } from './types';
import { Overview } from './components/Overview';
import { TheoryHub } from './components/TheoryHub';
import { CydSimulator } from './components/CydSimulator';
import { UseCasesCatalog } from './components/UseCasesCatalog';
import { HardwareExplorer } from './components/HardwareExplorer';
import { FirmwareGenerator } from './components/FirmwareGenerator';
import { CommunityFirmwares } from './components/CommunityFirmwares';
import { EthicsMethodology } from './components/EthicsMethodology';
import { CustomProjectBuilderFlasher } from './components/CustomProjectBuilderFlasher';
import { ProfessionalEducationalHub } from './components/ProfessionalEducationalHub';
import { Enclosure3DGenerator } from './components/Enclosure3DGenerator';
import { cydAudio } from './utils/audio';

const VALID_TABS: TabType[] = [
  'overview',
  'theory',
  'simulator',
  'use-cases',
  'hardware-pinout',
  'firmware-generator',
  'builder-flasher',
  'community-firmware',
  '3d-enclosure',
  'pro-academy',
  'ethics-methodology'
];

const getTabFromHash = (): TabType | null => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace('#', '') as TabType;
  return VALID_TABS.includes(hash) ? hash : null;
};

export default function App() {
  // Supports deep-linking straight into a tab (e.g. ...#theory) so external
  // landing pages can send visitors to a specific section of the suite.
  const [activeTab, setActiveTab] = useState<TabType>(() => getTabFromHash() || 'overview');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cyd-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cyd-theme', nextTheme);
    }
    cydAudio.playClick();
  };

  const toggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    cydAudio.setMuted(!nextSound);
    if (nextSound) {
      cydAudio.playClick();
    }
  };

  // Keep the URL hash in sync so the active tab stays bookmarkable/shareable,
  // using replaceState (not location.hash =) to avoid spamming browser history.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${activeTab}`);
    }
  }, [activeTab]);

  // React to back/forward navigation or an external link changing the hash.
  useEffect(() => {
    const onHashChange = () => {
      const tab = getTabFromHash();
      if (tab) setActiveTab(tab);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    cydAudio.playClick();
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleTabChange('overview')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center p-1 group-hover:scale-105 group-hover:border-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] overflow-hidden">
              <img 
                src={`${import.meta.env.BASE_URL}icono.png`}
                alt="Un Fantasma en el Sistema" 
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  CYD CyberSec Studio
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  ESP32
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <span>Cheap Yellow Display</span>
                <span>·</span>
                <span className="text-amber-300/80 font-medium">Un Fantasma en el Sistema</span>
              </p>
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs">
            <button
              onClick={() => handleTabChange('overview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Resumen
            </button>

            <button
              onClick={() => handleTabChange('theory')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'theory'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Curso: Teoría</span>
            </button>

            <button
              onClick={() => handleTabChange('simulator')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Simulador CYD</span>
            </button>

            <button
              onClick={() => handleTabChange('use-cases')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'use-cases'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Casos de Uso
            </button>

            <button
              onClick={() => handleTabChange('hardware-pinout')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'hardware-pinout'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hardware & Pinout
            </button>

            <button
              onClick={() => handleTabChange('firmware-generator')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'firmware-generator'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Generador C++
            </button>

            <button
              onClick={() => handleTabChange('builder-flasher')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'builder-flasher'
                  ? 'bg-gradient-to-r from-amber-500/25 to-amber-400/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Builder & Flasher</span>
            </button>

            <button
              onClick={() => handleTabChange('community-firmware')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'community-firmware'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Firmwares
            </button>

            <button
              onClick={() => handleTabChange('3d-enclosure')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === '3d-enclosure'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Carcasa 3D</span>
            </button>

            <button
              onClick={() => handleTabChange('pro-academy')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'pro-academy'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Academia & Pro Hub</span>
            </button>

            <button
              onClick={() => handleTabChange('ethics-methodology')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'ethics-methodology'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Marco Legal
            </button>
          </nav>

          {/* Right Header Utilities: External website link & Sound toggle */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://www.unfantasmaenelsistema.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 hover:border-amber-500/50 text-slate-200 text-xs font-semibold transition-all group shadow-sm"
              title="Visitar la web oficial de Un Fantasma en el Sistema"
            >
              <img 
                src={`${import.meta.env.BASE_URL}icono.png`}
                alt="Logo Un Fantasma en el Sistema" 
                className="w-4 h-4 object-contain group-hover:scale-110 transition-transform" 
              />
              <span className="hidden md:inline text-amber-300 group-hover:text-amber-200">
                unfantasmaenelsistema.com
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
            </a>

            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido del simulador'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                theme === 'light'
                  ? 'bg-amber-100/90 border-amber-300 text-amber-800 hover:bg-amber-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:text-amber-300'
              }`}
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-slate-950/60 text-xs">
          {[
            { id: 'overview', label: 'Resumen' },
            { id: 'theory', label: '📘 Curso: Teoría' },
            { id: 'simulator', label: 'Simulador' },
            { id: 'use-cases', label: 'Casos de Uso' },
            { id: 'hardware-pinout', label: 'Hardware' },
            { id: 'firmware-generator', label: 'Código C++' },
            { id: 'builder-flasher', label: '⚡ Builder & Flasher' },
            { id: 'community-firmware', label: 'Firmwares' },
            { id: '3d-enclosure', label: '🖨️ Carcasa 3D' },
            { id: 'pro-academy', label: '🎓 Academia & Pro' },
            { id: 'ethics-methodology', label: 'Legal' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as TabType)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <Overview onNavigateTab={handleTabChange} />}
        {activeTab === 'theory' && <TheoryHub onNavigateTab={handleTabChange} />}
        {activeTab === 'simulator' && <CydSimulator />}
        {activeTab === 'use-cases' && <UseCasesCatalog />}
        {activeTab === 'hardware-pinout' && <HardwareExplorer />}
        {activeTab === 'firmware-generator' && <FirmwareGenerator />}
        {activeTab === 'builder-flasher' && <CustomProjectBuilderFlasher />}
        {activeTab === 'community-firmware' && <CommunityFirmwares />}
        {activeTab === '3d-enclosure' && <Enclosure3DGenerator />}
        {activeTab === 'pro-academy' && <ProfessionalEducationalHub />}
        {activeTab === 'ethics-methodology' && <EthicsMethodology />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/95 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-850">
            {/* Creator badge */}
            <a
              href="https://www.unfantasmaenelsistema.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
                <img 
                  src={`${import.meta.env.BASE_URL}icono.png`}
                  alt="Un Fantasma en el Sistema" 
                  className="w-full h-full object-contain filter drop-shadow" 
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                    Un Fantasma en el Sistema
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Divulgación, guías y tutoriales sobre ciberseguridad, OSINT y hacking ético
                </p>
                <span className="text-[10px] text-amber-300 font-mono">
                  www.unfantasmaenelsistema.com
                </span>
              </div>
            </a>

            {/* Quick links to community references */}
            <div className="flex items-center gap-4 text-slate-400 text-xs flex-wrap justify-center">
              <span className="text-slate-300 font-semibold">Proyectos Open Source:</span>
              <a href="https://github.com/pradoman/Bruce" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">Bruce</a>
              <span>·</span>
              <a href="https://github.com/smoochiee/ESP32-Marauder-Cheap-Yellow-Display" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">Marauder CYD</a>
              <span>·</span>
              <a href="https://github.com/Bodmer/TFT_eSPI" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">TFT_eSPI</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              <span>CYD CyberSec Studio</span>
              <span> · </span>
              <span>ESP32-2432S028R Security Research Lab</span>
            </div>
            <div>
              Desarrollado con fines educativos y de investigación defensiva.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
