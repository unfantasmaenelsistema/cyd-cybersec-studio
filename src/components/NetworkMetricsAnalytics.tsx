import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Activity, 
  ShieldAlert, 
  Wifi, 
  Layers, 
  AlertTriangle, 
  Play, 
  Pause, 
  Flame, 
  RefreshCw,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface MetricPoint {
  time: string;
  mgmt: number;
  data: number;
  deauth: number;
  total: number;
}

interface ChannelPoint {
  channel: string;
  packets: number;
  isCommon: boolean; // 1, 6, 11
}

const FRAME_TYPE_DATA = [
  { name: 'Beacons (Anuncio AP)', value: 58, color: '#38bdf8' },
  { name: 'Probe Requests (Clientes)', value: 22, color: '#818cf8' },
  { name: 'Probe Responses', value: 12, color: '#34d399' },
  { name: 'Deauth / Disassoc (Ataques)', value: 5, color: '#f87171' },
  { name: 'Control (ACK / RTS)', value: 3, color: '#fbbf24' }
];

export const NetworkMetricsAnalytics: React.FC = () => {
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isAttackSpike, setIsAttackSpike] = useState<boolean>(false);
  const [metricsHistory, setMetricsHistory] = useState<MetricPoint[]>(() => {
    const initial: MetricPoint[] = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const d = new Date(now - i * 1500);
      const timeStr = d.toTimeString().slice(3, 8);
      const mgmt = Math.floor(Math.random() * 40) + 60;
      const data = Math.floor(Math.random() * 80) + 110;
      const deauth = Math.floor(Math.random() * 3);
      initial.push({
        time: timeStr,
        mgmt,
        data,
        deauth,
        total: mgmt + data + deauth
      });
    }
    return initial;
  });

  const [channelData, setChannelData] = useState<ChannelPoint[]>([
    { channel: 'CH 1', packets: 420, isCommon: true },
    { channel: 'CH 2', packets: 110, isCommon: false },
    { channel: 'CH 3', packets: 95, isCommon: false },
    { channel: 'CH 4', packets: 140, isCommon: false },
    { channel: 'CH 5', packets: 180, isCommon: false },
    { channel: 'CH 6', packets: 680, isCommon: true },
    { channel: 'CH 7', packets: 210, isCommon: false },
    { channel: 'CH 8', packets: 160, isCommon: false },
    { channel: 'CH 9', packets: 130, isCommon: false },
    { channel: 'CH 10', packets: 195, isCommon: false },
    { channel: 'CH 11', packets: 540, isCommon: true },
    { channel: 'CH 12', packets: 85, isCommon: false },
    { channel: 'CH 13', packets: 60, isCommon: false }
  ]);

  const [totalAlerts, setTotalAlerts] = useState<number>(3);
  const [peakPps, setPeakPps] = useState<number>(285);

  // Periodic real-time simulator interval
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().slice(3, 8);

      let mgmt = Math.floor(Math.random() * 30) + 65;
      let data = Math.floor(Math.random() * 60) + 120;
      let deauth = isAttackSpike ? Math.floor(Math.random() * 120) + 90 : Math.floor(Math.random() * 3);

      if (isAttackSpike) {
        mgmt += 80;
      }

      const total = mgmt + data + deauth;

      setMetricsHistory((prev) => {
        const next = [...prev.slice(1), { time: timeStr, mgmt, data, deauth, total }];
        return next;
      });

      if (total > peakPps) {
        setPeakPps(total);
      }

      // Slightly perturb channel distributions
      setChannelData((prev) =>
        prev.map((ch) => {
          const delta = Math.floor(Math.random() * 25) - 12;
          return {
            ...ch,
            packets: Math.max(30, ch.packets + delta + (isAttackSpike && ch.channel === 'CH 6' ? 40 : 0))
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isLive, isAttackSpike, peakPps]);

  const triggerSpike = () => {
    setIsAttackSpike(true);
    setTotalAlerts((prev) => prev + 1);
    setTimeout(() => {
      setIsAttackSpike(false);
    }, 6000);
  };

  const currentPoint = metricsHistory[metricsHistory.length - 1] || { mgmt: 0, data: 0, deauth: 0, total: 0 };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      {/* Header with Title and Realtime Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>TELEMETRÍA EN TIEMPO REAL</span>
            <span>·</span>
            <span>CYD SENTINEL PROMISCUOUS MONITOR</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Análisis de Tráfico 802.11 e Incidentes de Seguridad
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            Simulación de paquetes capturados en el aire por el módulo Wi-Fi de la CYD en modo promiscuo y segmentación de tramas de ataque.
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isLive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Pausar Telemetría' : 'Reanudar'}</span>
          </button>

          <button
            onClick={triggerSpike}
            disabled={isAttackSpike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isAttackSpike
                ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30'
                : 'bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>{isAttackSpike ? 'Ataque Deauth en Curso...' : 'Inyectar Ráfaga Deauth'}</span>
          </button>
        </div>
      </div>

      {/* 4 Analytical KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Flujo Actual</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {currentPoint.total} <span className="text-xs font-sans text-slate-500">pkt/s</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Pico registrado: {peakPps} pkt/s
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Tramas de Gestión</span>
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
            {currentPoint.mgmt} <span className="text-xs font-sans text-slate-500">pkt/s</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Beacons & Probe Requests
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border transition-colors ${
          isAttackSpike 
            ? 'bg-red-950/50 border-red-500/60' 
            : 'bg-slate-950/70 border-slate-800'
        }`}>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Deauth / Disassoc</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${isAttackSpike ? 'text-red-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className={`text-xl font-bold font-mono mt-1 ${
            currentPoint.deauth > 10 ? 'text-red-400' : 'text-slate-200'
          }`}>
            {currentPoint.deauth} <span className="text-xs font-sans text-slate-500">pkt/s</span>
          </div>
          <div className={`text-[10px] mt-0.5 ${isAttackSpike ? 'text-red-300 font-bold' : 'text-slate-500'}`}>
            {isAttackSpike ? '¡Peligro: Deauth flood detectado!' : 'Normal (sin ataques activos)'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Alertas IDS Totales</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {totalAlerts} <span className="text-xs font-sans text-slate-500">eventos</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Acción: Notificación acústica CYD
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Real-time Timeline Chart (Left - 8 columns) */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Flujo Temporal de Tramas (Últimos 30 segundos)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                <span>Gestión (802.11 Mgmt)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>Datos (Data)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                <span>Deauth Anómalos</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMgmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDeauth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="data" 
                  name="Tramas de Datos" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorData)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="mgmt" 
                  name="Tramas de Gestión" 
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#colorMgmt)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="deauth" 
                  name="Deauth Ataque" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDeauth)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Frame Type Distribution Donut (Right - 4 columns) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="font-bold text-white text-xs flex items-center justify-between">
            <span>Distribución de Subtipos 802.11</span>
            <span className="text-[10px] text-slate-400 font-mono">Modo Promiscuo</span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={FRAME_TYPE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {FRAME_TYPE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                  formatter={(val: any) => [`${val ?? 0}%`, 'Porcentaje']}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-mono text-slate-400">Total</span>
              <span className="text-sm font-bold text-white">100%</span>
            </div>
          </div>

          {/* Clean metadata list */}
          <div className="space-y-1.5 pt-1 text-[11px]">
            {FRAME_TYPE_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate max-w-[160px]">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spectrum Channel Distribution (Channels 1 to 13) */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Densidad de Tráfico por Canal 2.4 GHz (Canales 1 al 13)</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Canales estándar no solapados: <span className="text-amber-400 font-bold">1, 6 y 11</span>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="channel" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  color: '#f8fafc'
                }}
                formatter={(val: any) => [`${val ?? 0} paquetes`, 'Volumen']}
              />
              <Bar dataKey="packets" radius={[4, 4, 0, 0]}>
                {channelData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isCommon ? '#f59e0b' : '#334155'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          * La CYD implementa salto de canal (<em>Channel Hopping</em>) en software para barrer cíclicamente los 13 canales de 2.4 GHz. La mayor concentración de actividad se agrupa naturalmente en los canales 1, 6 y 11 debido a las políticas de planificación de radiofrecuencia para evitar interferencias adyacentes.
        </p>
      </div>
    </div>
  );
};
