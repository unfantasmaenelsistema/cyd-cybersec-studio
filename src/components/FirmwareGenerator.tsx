import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Settings, 
  Cpu, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { FIRMWARE_TEMPLATES } from '../data/cydData';
import { FirmwareTemplate } from '../types';

export const FirmwareGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<FirmwareTemplate>(FIRMWARE_TEMPLATES[0]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedIni, setCopiedIni] = useState<boolean>(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'arduino' | 'platformio'>('arduino');

  const handleCopy = (text: string, isIni: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isIni) {
      setCopiedIni(true);
      setTimeout(() => setCopiedIni(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>GENERADOR DE CÓDIGO</span>
            <span>·</span>
            <span>ARDUINO IDE & PLATFORMIO</span>
            <span>·</span>
            <span>100% FUNCIONAL</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Firmwares y Plantillas Listas para Flashear en la CYD
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Descarga o copia código C++ optimizado con gestión de modo promiscuo en el ESP32, visualización en TFT_eSPI y soporte para el altavoz y LED RGB.
          </p>
        </div>
      </div>

      {/* Main Grid: Template Selector on Left, Code Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Template Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Proyectos Disponibles:
          </div>

          {FIRMWARE_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`w-full p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-lg'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {tmpl.filename}
                  </span>
                </div>
                <div className="font-bold text-sm text-white mb-1.5">
                  {tmpl.title}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </button>
            );
          })}

          {/* Quick Notice about User_Setup.h */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Regla de Oro con la CYD:</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Si es tu primera vez usando la CYD con Arduino IDE, <strong>debes configurar el archivo User_Setup.h</strong> de la librería TFT_eSPI. Selecciona la tercera plantilla de la lista y cópiala en tu carpeta de librerías.
            </p>
          </div>
        </div>

        {/* Right Column: Code Viewer & Controls */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            {/* Header with Title and Copy/Download Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase">
                  {selectedTemplate.category}
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-amber-400" />
                  <span>{selectedTemplate.filename}</span>
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeCodeTab === 'arduino' ? selectedTemplate.code : selectedTemplate.platformioIni, activeCodeTab === 'platformio')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  {(activeCodeTab === 'arduino' ? copiedCode : copiedIni) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload(
                    activeCodeTab === 'arduino' ? selectedTemplate.filename : 'platformio.ini',
                    activeCodeTab === 'arduino' ? selectedTemplate.code : selectedTemplate.platformioIni
                  )}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>

            {/* Code Tabs: Arduino Sketch vs PlatformIO INI */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveCodeTab('arduino')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeCodeTab === 'arduino'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Código C++ ({selectedTemplate.filename})
                </button>
                <button
                  onClick={() => setActiveCodeTab('platformio')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeCodeTab === 'platformio'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Configuración PlatformIO (platformio.ini)
                </button>
              </div>

              {/* Required Libraries info */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <span>Librerías:</span>
                <span className="text-amber-300">{selectedTemplate.libraries.join(', ')}</span>
              </div>
            </div>

            {/* Syntax Code Container */}
            <div className="relative rounded-xl bg-slate-950 border border-slate-800/80 p-4 font-mono text-xs overflow-x-auto max-h-[480px]">
              <pre className="text-slate-300 leading-relaxed">
                <code>
                  {activeCodeTab === 'arduino' ? selectedTemplate.code : selectedTemplate.platformioIni}
                </code>
              </pre>
            </div>

            {/* Setup Instructions for this template */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Instrucciones de Compilación y Flasheo:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px]">
                {selectedTemplate.setupInstructions.map((inst, i) => (
                  <li key={i} className="leading-relaxed">
                    {inst}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
