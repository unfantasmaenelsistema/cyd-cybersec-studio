import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Radio, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { USE_CASES } from '../data/cydData';
import { UseCase } from '../types';

interface UseCasesCatalogProps {
  onSelectProjectForSimulation?: (projectId: string) => void;
}

export const UseCasesCatalog: React.FC<UseCasesCatalogProps> = ({ onSelectProjectForSimulation }) => {
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeUseCase, setActiveUseCase] = useState<UseCase | null>(USE_CASES[0]);

  const filteredUseCases = USE_CASES.filter((item) => {
    const matchesTeam = selectedTeam === 'all' || item.team === selectedTeam;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>METODOLOGÍAS Y PROYECTOS REALES</span>
            <span>·</span>
            <span>RED TEAM · BLUE TEAM · HARDWARE HACKING</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            ¿Qué podemos hacer en Ciberseguridad con la CYD ESP32?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Desde sistemas IDS de escritorio hasta auditorías de balizas BLE o transceptores Sub-GHz de radiofrecuencia, explora los roles y aplicaciones prácticas con su respectiva mitigación defensiva.
          </p>
        </div>

        {/* Filter buttons by Team */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedTeam('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTeam === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({USE_CASES.length})
          </button>
          <button
            onClick={() => setSelectedTeam('blue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTeam === 'blue'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Blue Team (Defensa)
          </button>
          <button
            onClick={() => setSelectedTeam('red')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTeam === 'red'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Red Team (Ofensivo)
          </button>
          <button
            onClick={() => setSelectedTeam('purple')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedTeam === 'purple'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hardware RF / Sub-GHz
          </button>
        </div>
      </div>

      {/* Main Grid: Cards on left, Inspector on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Use Cases */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por nombre, tecnología o vector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-2.5">
            {filteredUseCases.map((item) => {
              const isSelected = activeUseCase?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveUseCase(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        item.team === 'blue' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : item.team === 'red'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {item.team === 'blue' ? 'BLUE TEAM' : item.team === 'red' ? 'RED TEAM' : 'HARDWARE RF'}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-400">{item.difficulty}</span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      Peligro: {item.dangerLevel}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Dive Case Inspector */}
        <div className="lg:col-span-7">
          {activeUseCase ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <span>{activeUseCase.category}</span>
                  <span>·</span>
                  <span>NIVEL: {activeUseCase.difficulty.toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activeUseCase.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeUseCase.summary}
                </p>
              </div>

              {/* Deep Technical Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Descripción Técnica y Funcionamiento:
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                  {activeUseCase.description}
                </p>
              </div>

              {/* How it works on ESP32 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Mecánica Interna en el Chip ESP32:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 font-mono">
                  {activeUseCase.howItWorks}
                </p>
              </div>

              {/* Hardware Requirements & CYD Features used */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-slate-300">Hardware Necesario:</div>
                  <ul className="text-slate-400 space-y-1 text-[11px]">
                    {activeUseCase.hardwareNeeded.map((hw, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{hw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-slate-300">Periféricos CYD Utilizados:</div>
                  <ul className="text-slate-400 space-y-1 text-[11px]">
                    {activeUseCase.cydFeaturesUsed.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Defensive Mitigation / Countermeasure */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Mitigación y Defensa Recomendada:</span>
                </div>
                <p className="text-emerald-200/90 leading-relaxed text-[11px]">
                  {activeUseCase.defenseMitigation}
                </p>
              </div>

              {/* Firmware Recommendation */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Firmware Recomendado:</span>
                  <div className="font-bold text-white">{activeUseCase.firmwareRecommended}</div>
                </div>
                <div className="text-[11px] font-mono text-amber-400">
                  Cheap Yellow Display Ready
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
              Selecciona un caso de uso para ver su análisis en profundidad.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
