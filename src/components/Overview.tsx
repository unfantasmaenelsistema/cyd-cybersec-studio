import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Radio, 
  Cpu, 
  Terminal, 
  FileCode, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Layers, 
  Sliders, 
  DollarSign, 
  ExternalLink,
  Wifi,
  Printer,
  BookOpen
} from 'lucide-react';
import { TabType } from '../types';
import { NetworkMetricsAnalytics } from './NetworkMetricsAnalytics';
import { SecurityEventLogger } from './SecurityEventLogger';
import { QuickStartGuide } from './QuickStartGuide';
import { cydAudio } from '../utils/audio';

interface OverviewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigateTab }) => {
  const [scanRequested, setScanRequested] = useState<boolean>(false);
  const loggerSectionRef = useRef<HTMLDivElement>(null);

  const handleTriggerScanFromHero = () => {
    cydAudio.playSonarPing();
    setScanRequested(true);
    if (loggerSectionRef.current) {
      loggerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <div className="space-y-10">
      {/* Hero Section */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          {/* Creator Brand Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://www.unfantasmaenelsistema.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-amber-500/40 text-xs font-semibold text-slate-200 transition-all group shadow-sm hover:border-amber-400"
            >
              <img 
                src={`${import.meta.env.BASE_URL}icono.png`}
                alt="Un Fantasma en el Sistema" 
                className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" 
              />
              <span className="text-amber-300 font-bold">Un Fantasma en el Sistema</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 group-hover:text-white transition-colors">unfantasmaenelsistema.com</span>
              <ExternalLink className="w-3 h-3 text-amber-400 ml-0.5" />
            </a>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>ESP32-2432S028R</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Ciberseguridad y Hardware Hacking con Placas <span className="text-amber-400">CYD ESP32</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            La placa <strong>Cheap Yellow Display (CYD)</strong> ha revolucionado la ciberseguridad defensiva y ofensiva de bajo coste. Por menos de <strong>12€</strong>, integra un procesador ESP32 de doble núcleo, pantalla táctil a color de 2.8 pulgadas, ranura MicroSD, altavoz y LED RGB, convirtiéndose en el equivalente accesible a dispositivos como Flipper Zero o M5Stack.
          </p>

          {/* Quick Action Badges / CTAs */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('theory')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/30 hover:scale-[1.03] ring-2 ring-cyan-400/50"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Empezar el Curso (7 Módulos)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleTriggerScanFromHero}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/30 hover:scale-[1.03] ring-2 ring-amber-400/50"
              title="Disparar escaneo de redes Wi-Fi en el registro forense en tiempo real"
            >
              <Wifi className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>Comando 'Scan Wi-Fi' (Simular CYD)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('simulator')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors shadow-sm"
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Abrir Simulador Interactivo</span>
            </button>

            <button
              onClick={() => onNavigateTab('use-cases')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Explorar Casos de Uso</span>
            </button>

            <button
              onClick={() => onNavigateTab('builder-flasher')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs border border-amber-500/40 transition-colors shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Crear & Flashear Proyecto Propio</span>
            </button>

            <button
              onClick={() => onNavigateTab('3d-enclosure')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Carcasas 3D</span>
            </button>

            <button
              onClick={() => onNavigateTab('firmware-generator')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>Ver Códigos C++</span>
            </button>
          </div>
        </div>

        {/* 4 Feature highlight metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-8 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Coste de Entrada</div>
            <div className="text-lg font-bold text-emerald-400">&lt; 12€ - 15€</div>
            <div className="text-[10px] text-slate-500">10x más barata que Flipper</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Pantalla & Touch</div>
            <div className="text-lg font-bold text-amber-400">2.8" TFT 320x240</div>
            <div className="text-[10px] text-slate-500">Resistivo XPT2046 integrado</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Almacenamiento Local</div>
            <div className="text-lg font-bold text-cyan-400">MicroSD SPI</div>
            <div className="text-[10px] text-slate-500">Capturas PCAP para Wireshark</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Expansión RF</div>
            <div className="text-lg font-bold text-purple-400">Sub-GHz CC1101</div>
            <div className="text-[10px] text-slate-500">Pines CN1/P3 listos para 433MHz</div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix: CYD vs Alternatives */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-mono text-amber-400">COMPARATIVA DE HARDWARE HACKING</span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            ¿Por qué la CYD domina en relación Potencia / Coste?
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/60">
                <th className="py-2.5 px-3 font-semibold">Dispositivo</th>
                <th className="py-2.5 px-3 font-semibold">Precio Aprox.</th>
                <th className="py-2.5 px-3 font-semibold">Pantalla</th>
                <th className="py-2.5 px-3 font-semibold">Wi-Fi & BLE</th>
                <th className="py-2.5 px-3 font-semibold">Sub-GHz</th>
                <th className="py-2.5 px-3 font-semibold">MicroSD PCAP</th>
                <th className="py-2.5 px-3 font-semibold">Veredicto Ciberseguridad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="bg-amber-500/10 font-medium">
                <td className="py-3 px-3 font-bold text-amber-300 flex items-center gap-1.5">
                  <span>ESP32 CYD (2432S028R)</span>
                </td>
                <td className="py-3 px-3 text-emerald-400 font-mono font-bold">~12€</td>
                <td className="py-3 px-3 text-white">2.8" Color + Touch</td>
                <td className="py-3 px-3 text-emerald-400">✓ Nativo (Modo Promiscuo)</td>
                <td className="py-3 px-3 text-amber-300">Vía CC1101 externo (~3€)</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Integrado</td>
                <td className="py-3 px-3 text-amber-200">Insuperable relación calidad-precio</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-white">Flipper Zero</td>
                <td className="py-3 px-3 text-rose-400 font-mono font-bold">~170€</td>
                <td className="py-3 px-3 text-slate-400">1.4" Monocromo (128x64)</td>
                <td className="py-3 px-3 text-slate-400">Solo BLE (Wi-Fi requiere módulo 40€)</td>
                <td className="py-3 px-3 text-emerald-400">✓ Integrado</td>
                <td className="py-3 px-3 text-emerald-400">✓ Integrado</td>
                <td className="py-3 px-3 text-slate-400">Muy caro y limitado en Wi-Fi nativo</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-white">M5Stack Cardputer</td>
                <td className="py-3 px-3 text-amber-300 font-mono font-bold">~35€</td>
                <td className="py-3 px-3 text-slate-400">1.14" Color (Sin Touch)</td>
                <td className="py-3 px-3 text-emerald-400">✓ Nativo (ESP32-S3)</td>
                <td className="py-3 px-3 text-slate-400">No (requiere módulo)</td>
                <td className="py-3 px-3 text-emerald-400">✓ Integrado</td>
                <td className="py-3 px-3 text-slate-400">Pantalla minúscula, teclado físico</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-white">HackRF One</td>
                <td className="py-3 px-3 text-rose-400 font-mono font-bold">~250€ - 350€</td>
                <td className="py-3 px-3 text-slate-400">Ninguna (requiere Portapack)</td>
                <td className="py-3 px-3 text-slate-400">SDR Banda ancha completa</td>
                <td className="py-3 px-3 text-emerald-400">✓ SDR Completo</td>
                <td className="py-3 px-3 text-slate-400">Solo con Portapack</td>
                <td className="py-3 px-3 text-slate-400">Laboratorio SDR avanzado, no portátil básico</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Start Guide: From Box to First Flash */}
      <QuickStartGuide />

      {/* Real-time Network Traffic & IDS Data Visualization (Recharts) */}
      <NetworkMetricsAnalytics />

      {/* The 4 Major Pillars of CYD in Cybersecurity */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono text-amber-400">ÁREAS DE APLICACIÓN</span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Los 4 Grandes Pilares de Trabajo con la CYD
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pillar 1 */}
          <div 
            onClick={() => onNavigateTab('use-cases')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>PILAR 1 · BLUE TEAM (DEFENSA ACTIVA)</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-bold text-white">
              Sistemas IDS de Red, Honeypots y Monitores Anti-Deauth
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coloca la CYD en tu escritorio como un <strong>centinela 24/7</strong>. Si alguien cerca lanza un ataque de desautenticación contra tu red Wi-Fi para capturar handshakes, la pantalla cambia al instante a rojo brillante y el altavoz suena, avisándote de la intrusión en tiempo real.
            </p>
          </div>

          {/* Pillar 2 */}
          <div 
            onClick={() => onNavigateTab('use-cases')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>PILAR 2 · RED TEAM (PENTESTING 802.11)</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-bold text-white">
              ESP32 Marauder, Captura de PMKID y Wardriving
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audita la robustez de contraseñas corporativas capturando el hash PMKID sin clientes conectados, analiza la fuga de información en tramas Probe Request y genera informes con la tarjeta MicroSD integrada.
            </p>
          </div>

          {/* Pillar 3 */}
          <div 
            onClick={() => onNavigateTab('use-cases')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                <Radio className="w-4 h-4" />
                <span>PILAR 3 · PRIVACIDAD & BLUETOOTH BLE</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-bold text-white">
              Detector de Balizas AirTag / Tile y Estrés de Emparejamiento
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Descubre dispositivos de rastreo ocultos analizando anuncios BLE de Apple Find My y Samsung SmartTag. Evalúa además la resiliencia de dispositivos iOS/Android ante tormentas de anuncios de emparejamiento rápido.
            </p>
          </div>

          {/* Pillar 4 */}
          <div 
            onClick={() => onNavigateTab('hardware-pinout')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400 font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>PILAR 4 · HARDWARE HACKING & SUB-GHZ</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-bold text-white">
              Expansión con Módulo CC1101 y Firmware Bruce
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aprovecha los conectores libres CN1 y P3 para soldar o conectar un chip CC1101. Con el firmware Bruce, convierte la CYD en un emulador de radiofrecuencia para puertas automáticas, sensores ISM y periféricos inalámbricos.
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Security Event Logger Component with Ref for Smooth Scroll */}
      <div ref={loggerSectionRef} className="scroll-mt-8">
        <SecurityEventLogger 
          onScanRequested={scanRequested} 
          onScanCompleted={() => setScanRequested(false)} 
        />
      </div>
    </div>
  );
};
