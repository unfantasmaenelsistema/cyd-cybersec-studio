import React, { useState } from 'react';
import { 
  Flame, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Cpu, 
  Sparkles, 
  Radio, 
  Shield, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { COMMUNITY_FIRMWARES } from '../data/cydData';
import { CommunityFirmware } from '../types';

export const CommunityFirmwares: React.FC = () => {
  const [selectedFirmware, setSelectedFirmware] = useState<CommunityFirmware>(COMMUNITY_FIRMWARES[0]);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>PROYECTOS OPEN SOURCE</span>
            <span>·</span>
            <span>LISTOS PARA FLASHEAR</span>
            <span>·</span>
            <span>BRUCE · MARAUDER · NEMO</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Grandes Firmwares de la Comunidad Adaptados a la CYD
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            No necesitas programar desde cero: la comunidad de hardware hacking ha portado las mejores suites de pentesting directamente a la pantalla táctil de la Cheap Yellow Display.
          </p>
        </div>
      </div>

      {/* Grid of Community Firmwares */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COMMUNITY_FIRMWARES.map((fw) => {
          const isSelected = selectedFirmware.name === fw.name;
          return (
            <div
              key={fw.name}
              onClick={() => setSelectedFirmware(fw)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-xl'
                  : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-amber-400">{fw.category}</span>
                  <span className="text-slate-500">{fw.author}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {fw.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {fw.description}
                </p>

                <div className="space-y-1.5 border-t border-slate-800/80 pt-3 text-xs">
                  <div className="text-[11px] font-bold text-slate-400">Puntos Fuertes:</div>
                  <ul className="text-[11px] text-slate-300 space-y-1">
                    {fw.highlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-amber-400/80 text-[11px] font-medium">Ver comando & guía</span>
                <span className="text-slate-500 text-[10px]">GitHub Repo</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Firmware Detailed Inspection and Flash Guide */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-amber-400">GUÍA DE INSTALACIÓN Y FLASHEO</span>
            <h3 className="text-xl font-bold text-white">
              Cómo Flashear {selectedFirmware.name} en tu CYD
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={selectedFirmware.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <span>Repositorio Oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-slate-200">Requisitos Hardware:</div>
            <ul className="text-slate-400 space-y-1 text-[11px]">
              {selectedFirmware.requirements.map((req, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-slate-200">Características Clave:</div>
            <ul className="text-slate-400 space-y-1 text-[11px]">
              {selectedFirmware.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Flashing Option 1: esptool command */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Opción A: Flasheo por Terminal con esptool.py (Recomendado)</span>
            </span>
            <button
              onClick={() => handleCopyCmd(selectedFirmware.flashCommand)}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
            >
              {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCmd ? '¡Copiado!' : 'Copiar Comando'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
            {selectedFirmware.flashCommand}
          </div>
          <p className="text-[11px] text-slate-500">
            * En Windows, sustituye <code className="text-slate-400">/dev/ttyUSB0</code> por tu puerto COM correspondiente (ej: <code className="text-slate-400">COM3</code>). Si la placa no entra en modo bootloader automáticamente, mantén pulsado el botón <strong>BOOT</strong> mientras conectas el cable USB.
          </p>
        </div>

        {/* Flashing Option 2: Web Serial (No install needed) */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Opción B: Flasheo Directo desde el Navegador (Web Serial API)</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Tanto el proyecto <strong>Bruce</strong> como <strong>ESP32 Marauder</strong> disponen de instaladores web oficiales basados en <em>ESP Web Tools</em>. 
            Puedes conectar tu CYD por cable USB a Google Chrome o Edge, pulsar "Install" en su web flasher y el navegador programará el chip ESP32 sin necesidad de instalar Python, drivers ni compiladores.
          </p>
        </div>
      </div>
    </div>
  );
};
