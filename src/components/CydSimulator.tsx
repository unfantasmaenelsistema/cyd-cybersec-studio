import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Wifi, 
  Search, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Play, 
  Flame, 
  Bug, 
  Cpu, 
  Lock, 
  Smartphone, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { cydAudio } from '../utils/audio';
import { SerialMonitorPanel } from './SerialMonitorPanel';

type SimMode = 'sentinel' | 'marauder' | 'ble-hunter' | 'honeypot';

export const CydSimulator: React.FC = () => {
  const [mode, setMode] = useState<SimMode>('sentinel');
  const [channel, setChannel] = useState<number>(1);
  const [packetsPerSec, setPacketsPerSec] = useState<number>(128);
  const [totalPackets, setTotalPackets] = useState<number>(4520);
  const [deauthCount, setDeauthCount] = useState<number>(0);
  const [isUnderAttack, setIsUnderAttack] = useState<boolean>(false);
  const [pmfEnabled, setPmfEnabled] = useState<boolean>(false);
  const [attackerMac, setAttackerMac] = useState<string>('B4:82:C5:11:9E:04');
  const [victimMac, setVictimMac] = useState<string>('DC:A6:32:8B:F2:70');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [ldrValue, setLdrValue] = useState<number>(75); // Light sensor
  const [rgbState, setRgbState] = useState<{ r: boolean; g: boolean; b: boolean }>({ r: false, g: true, b: false });

  // Marauder sub-screen
  const [marauderScreen, setMarauderScreen] = useState<'main' | 'scan_ap' | 'sniff_pmkid' | 'beacon_spam'>('main');
  const [foundAps, setFoundAps] = useState<Array<{ ssid: string; bssid: string; ch: number; rssi: number; enc: string }>>([
    { ssid: 'Corp_WiFi_5G', bssid: 'A4:11:9B:44:01:10', ch: 6, rssi: -52, enc: 'WPA2' },
    { ssid: 'INVITADOS_FREE', bssid: 'F8:0F:41:2B:99:32', ch: 1, rssi: -68, enc: 'OPEN' },
    { ssid: 'FIBRA_OPTICA_78B2', bssid: '30:91:8F:D2:78:B2', ch: 11, rssi: -74, enc: 'WPA3/WPA2' },
    { ssid: 'Smart_Home_IoT', bssid: '00:1E:06:55:C3:19', ch: 6, rssi: -80, enc: 'WPA2' }
  ]);
  const [pmkidCaptured, setPmkidCaptured] = useState<boolean>(false);

  // BLE Hunter state
  const [bleBeacons, setBleBeacons] = useState<Array<{ id: string; type: string; mac: string; rssi: number; dist: string }>>([
    { id: '1', type: 'Apple AirTag (FindMy)', mac: '5E:19:B2:A0:41:9C', rssi: -62, dist: '~1.8 metros' },
    { id: '2', type: 'Tile Pro', mac: 'CA:40:91:88:23:4F', rssi: -84, dist: '~6.5 metros' }
  ]);
  const [bleRadarDegree, setBleRadarDegree] = useState<number>(0);

  // Honeypot Canary state
  const [canaryLogs, setCanaryLogs] = useState<Array<{ time: string; ip: string; port: number; event: string }>>([
    { time: '10:14:02', ip: '192.168.1.140', port: 23, event: 'TCP SYN recibido (Telnet)' },
    { time: '10:14:05', ip: '192.168.1.140', port: 23, event: 'Login intento: admin/admin' }
  ]);
  const [canaryAlertActive, setCanaryAlertActive] = useState<boolean>(false);

  // Channel hopping interval
  useEffect(() => {
    const hopInterval = setInterval(() => {
      setChannel((prev) => (prev % 13) + 1);
      setPacketsPerSec((prev) => Math.max(45, Math.min(260, prev + Math.floor(Math.random() * 21) - 10)));
      setTotalPackets((prev) => prev + Math.floor(Math.random() * 30) + 15);
    }, 1200);
    return () => clearInterval(hopInterval);
  }, []);

  // Radar animation
  useEffect(() => {
    if (mode === 'ble-hunter') {
      const radarInt = setInterval(() => {
        setBleRadarDegree((prev) => (prev + 6) % 360);
      }, 50);
      return () => clearInterval(radarInt);
    }
  }, [mode]);

  // Audio mute sync
  useEffect(() => {
    cydAudio.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Trigger simulated deauth attack
  const triggerDeauthAttack = () => {
    if (pmfEnabled) {
      // 802.11w blocks deauth spoofing!
      cydAudio.playClick();
      alert('ℹ️ Ataque bloqueado: El router y los clientes tienen habilitado 802.11w (PMF - Protected Management Frames). Las tramas de desautenticación forjadas son descartadas criptográficamente.');
      return;
    }

    setIsUnderAttack(true);
    setDeauthCount((prev) => prev + 18);
    setRgbState({ r: true, g: false, b: false });
    cydAudio.playDeauthAlarm();

    // Reset after 4 seconds
    setTimeout(() => {
      setIsUnderAttack(false);
      setRgbState({ r: false, g: true, b: false });
    }, 4500);
  };

  const triggerCanaryScan = () => {
    setCanaryAlertActive(true);
    setRgbState({ r: true, g: true, b: false }); // Yellow/Orange
    cydAudio.playCanaryAlert();
    const newLog = {
      time: new Date().toTimeString().slice(0, 8),
      ip: `192.168.1.${Math.floor(Math.random() * 100) + 100}`,
      port: 80,
      event: 'Escaneo Nmap detectado (HTTP GET /admin)'
    };
    setCanaryLogs((prev) => [newLog, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setCanaryAlertActive(false);
      setRgbState({ r: false, g: true, b: false });
    }, 4000);
  };

  const handleTouch = (actionName: string, callback?: () => void) => {
    cydAudio.playClick();
    if (callback) callback();
  };

  return (
    <div className="space-y-6">
      {/* Top Description bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>HARDWARE VIRTUAL INTERACTIVO</span>
            <span>·</span>
            <span>ESP32-2432S028R</span>
            <span>·</span>
            <span>320x240 ILI9341 + XPT2046</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Simulador de Pantalla y Periféricos CYD
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Experimenta el comportamiento real del hardware: el modo promiscuo Wi-Fi, la lógica invertida del LED RGB, el altavoz integrado y la pantalla táctil en distintos escenarios de ciberseguridad.
          </p>
        </div>

        {/* Global Toolbar controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              soundEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Activar o silenciar zumbador piezoeléctrico de la CYD"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Altavoz ON' : 'Altavoz MUTE'}</span>
          </button>

          <button
            onClick={() => setScanlines(!scanlines)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              scanlines
                ? 'bg-slate-800 border-slate-600 text-slate-200'
                : 'bg-slate-850 border-slate-750 text-slate-400'
            }`}
          >
            Líneas CRT: {scanlines ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => {
              setDeauthCount(0);
              setIsUnderAttack(false);
              setPmkidCaptured(false);
              setRgbState({ r: false, g: true, b: false });
              cydAudio.playClick();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Hardware</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Device on left, Simulation Controls on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* PHYSICAL CYD DEVICE CONTAINER */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* THE CHEAP YELLOW DISPLAY BOARD */}
          <div className="relative w-full max-w-[540px] p-5 sm:p-7 rounded-3xl bg-[#e5ad06] border-4 border-[#c89400] shadow-[0_20px_50px_rgba(0,0,0,0.7)] select-none">
            {/* PCB Screw Holes in corners */}
            <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-600/60 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/30"></div>
            </div>
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-600/60 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/30"></div>
            </div>
            <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-600/60 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/30"></div>
            </div>
            <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-600/60 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/30"></div>
            </div>

            {/* PCB Silkscreen Markings */}
            <div className="flex items-center justify-between px-2 mb-3 text-[10px] font-mono tracking-wider text-slate-900 font-bold">
              <div className="flex items-center gap-2">
                <span>ESP32-2432S028R</span>
                <span>·</span>
                <span className="opacity-80">CHEAP YELLOW DISPLAY</span>
              </div>
              <div className="flex items-center gap-2">
                <span>REV 2.8</span>
                <span className="px-1.5 py-0.2 bg-slate-900 text-amber-300 rounded text-[9px]">TFT+TOUCH</span>
              </div>
            </div>

            {/* Physical Sensors / Indicators on the PCB Face */}
            <div className="flex items-center justify-between px-3 mb-2">
              {/* LDR Optical Sensor (GPIO 34) */}
              <div className="flex items-center gap-2 bg-amber-600/30 px-2 py-0.5 rounded border border-amber-700/40 text-[10px] font-mono text-slate-900">
                <span className="w-2 h-2 rounded-full bg-red-900 border border-slate-900" title="LDR Sensor GPIO 34"></span>
                <span>LDR: {ldrValue}%</span>
              </div>

              {/* RGB LED (Active LOW: GPIO 4, 16, 17) */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-900 text-[10px] font-mono text-slate-300">
                <span className="text-[9px] text-slate-400">LED RGB:</span>
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-150 border border-black/40 shadow-sm ${
                    rgbState.r
                      ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] ring-2 ring-red-400'
                      : rgbState.g
                      ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] ring-1 ring-emerald-300'
                      : rgbState.b
                      ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)] ring-1 ring-blue-300'
                      : 'bg-slate-700'
                  }`}
                  title="LED RGB con Lógica Invertida (Active LOW)"
                />
                <span className="text-[9px] font-bold">
                  {rgbState.r ? 'ROJO (PELIGRO)' : rgbState.g ? 'VERDE (OK)' : rgbState.b ? 'AZUL' : 'OFF'}
                </span>
              </div>

              {/* Onboard Speaker grill (GPIO 26 DAC) */}
              <div className="flex items-center gap-1 bg-amber-600/30 px-2 py-0.5 rounded border border-amber-700/40 text-[10px] font-mono text-slate-900" title="Altavoz DAC GPIO 26">
                <div className="flex gap-0.5">
                  <div className="w-1 h-2 bg-slate-900 rounded-full"></div>
                  <div className="w-1 h-2 bg-slate-900 rounded-full"></div>
                  <div className="w-1 h-2 bg-slate-900 rounded-full"></div>
                </div>
                <span>SPK (IO26)</span>
              </div>
            </div>

            {/* SCREEN BEZEL & ACTIVE TFT DISPLAY (320x240 Aspect Ratio) */}
            <div className="relative p-2 bg-slate-950 rounded-xl border-2 border-slate-900 shadow-2xl overflow-hidden">
              {/* Actual 320x240 Pixel Emulation Canvas/Container */}
              <div 
                className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden font-mono transition-colors duration-200 ${
                  scanlines ? 'cyd-scanlines' : ''
                } ${
                  isUnderAttack 
                    ? 'bg-red-950 border-2 border-red-500' 
                    : mode === 'sentinel' 
                    ? 'bg-[#03090e]' 
                    : mode === 'marauder' 
                    ? 'bg-[#020504]' 
                    : mode === 'ble-hunter'
                    ? 'bg-[#040814]'
                    : 'bg-[#0f0a02]'
                }`}
                style={{
                  filter: `brightness(${0.6 + (ldrValue / 100) * 0.5})`
                }}
              >
                {/* CYD SCREEN HEADER / STATUS BAR */}
                <div className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold border-b border-white/10 bg-black/40">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">CYD-OS</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-300">CH:{channel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      STA_PROMISC
                    </span>
                    <span className="text-slate-400">{packetsPerSec} pkt/s</span>
                  </div>
                </div>

                {/* ===================== MODE 1: CYD SENTINEL IDS ===================== */}
                {mode === 'sentinel' && (
                  <div className="p-3 h-[calc(100%-28px)] flex flex-col justify-between text-slate-200">
                    {isUnderAttack ? (
                      /* ATTACK SCREEN */
                      <div className="h-full flex flex-col justify-between animate-pulse">
                        <div className="bg-red-600 text-white p-2 rounded text-center font-black tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg">
                          <AlertTriangle className="w-4 h-4" />
                          <span>! ALERTA: ATAQUE DEAUTH DETECTADO !</span>
                        </div>

                        <div className="bg-red-900/60 p-2.5 rounded border border-red-500/80 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-red-200">Tipo de trama:</span>
                            <span className="text-white font-bold">802.11 Deauth (0x00c0)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-200">Canal objetivo:</span>
                            <span className="text-white font-bold">{channel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-200">MAC Atacante:</span>
                            <span className="text-amber-300 font-bold">{attackerMac}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-200">MAC Víctima:</span>
                            <span className="text-white font-bold">{victimMac}</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-center text-red-200 bg-black/40 py-1 rounded">
                          Mitigación: Requiere activar 802.11w (PMF) en el punto de acceso.
                        </div>
                      </div>
                    ) : (
                      /* NORMAL MONITORING SCREEN */
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              CYD SENTINEL IDS ACTIVO
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              Total: {totalPackets} tramas
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                              <div className="text-slate-400 text-[10px]">Deauths Vistos</div>
                              <div className="text-base font-bold text-amber-400">{deauthCount}</div>
                            </div>
                            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                              <div className="text-slate-400 text-[10px]">Protección PMF</div>
                              <div className={`text-base font-bold ${pmfEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {pmfEnabled ? 'ACTIVA' : 'DESACTIVADA'}
                              </div>
                            </div>
                          </div>

                          {/* Channel Hopping Spectrum visualizer */}
                          <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-400 mb-1 flex justify-between">
                              <span>Espectro 2.4GHz (Canales 1-13)</span>
                              <span className="text-amber-400">Actual: CH {channel}</span>
                            </div>
                            <div className="flex items-end gap-1 h-10 pt-1">
                              {Array.from({ length: 13 }).map((_, i) => {
                                const chNum = i + 1;
                                const isCurrent = chNum === channel;
                                const heightPercent = isCurrent ? 85 : ((chNum * 7) % 55) + 20;
                                return (
                                  <div key={chNum} className="flex-1 flex flex-col items-center">
                                    <div
                                      style={{ height: `${heightPercent}%` }}
                                      className={`w-full rounded-t transition-all duration-300 ${
                                        isCurrent ? 'bg-amber-400' : 'bg-slate-700'
                                      }`}
                                    />
                                    <span className="text-[8px] text-slate-500 mt-0.5">{chNum}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Touch Buttons inside Screen */}
                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => handleTouch('Ataque Simulado', triggerDeauthAttack)}
                            className="flex-1 py-1.5 px-2 bg-red-600/80 hover:bg-red-500 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <Flame className="w-3 h-3" />
                            <span>Simular Deauth</span>
                          </button>
                          <button
                            onClick={() => handleTouch('Toggle PMF', () => setPmfEnabled(!pmfEnabled))}
                            className={`flex-1 py-1.5 px-2 rounded text-[11px] font-bold border transition-colors ${
                              pmfEnabled
                                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                                : 'bg-slate-800 border-slate-700 text-slate-300'
                            }`}
                          >
                            {pmfEnabled ? 'PMF 802.11w: ON' : 'PMF 802.11w: OFF'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ===================== MODE 2: ESP32 MARAUDER CYD ===================== */}
                {mode === 'marauder' && (
                  <div className="p-3 h-[calc(100%-28px)] flex flex-col justify-between text-slate-200">
                    {marauderScreen === 'main' && (
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-amber-400 mb-2 flex items-center justify-between">
                            <span>MARAUDER CYD v0.13.8</span>
                            <span className="text-[9px] text-slate-400">MicroSD: [FAT32 OK]</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-xs">
                            <button
                              onClick={() => handleTouch('Scan APs', () => setMarauderScreen('scan_ap'))}
                              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-left"
                            >
                              <div className="text-amber-400 font-bold">1. Escanear APs</div>
                              <div className="text-[10px] text-slate-400">Descubrir SSIDs</div>
                            </button>
                            <button
                              onClick={() => handleTouch('Sniff PMKID', () => setMarauderScreen('sniff_pmkid'))}
                              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-left"
                            >
                              <div className="text-cyan-400 font-bold">2. Sniff PMKID</div>
                              <div className="text-[10px] text-slate-400">Handshakes WPA2</div>
                            </button>
                            <button
                              onClick={() => handleTouch('Beacon Spam', () => setMarauderScreen('beacon_spam'))}
                              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-left"
                            >
                              <div className="text-rose-400 font-bold">3. Beacon Flood</div>
                              <div className="text-[10px] text-slate-400">SSIDs simulados</div>
                            </button>
                            <button
                              onClick={() => handleTouch('Guardar PCAP', () => alert('Archivo guardado en SD: /sd/marauder_capture_001.pcap'))}
                              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-left"
                            >
                              <div className="text-emerald-400 font-bold">4. Dump a MicroSD</div>
                              <div className="text-[10px] text-slate-400">Wireshark format</div>
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 text-center">
                          Toca una opción en la pantalla táctil XPT2046
                        </div>
                      </div>
                    )}

                    {marauderScreen === 'scan_ap' && (
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-amber-400 font-bold">APs Encontrados ({foundAps.length})</span>
                          <button
                            onClick={() => handleTouch('Volver', () => setMarauderScreen('main'))}
                            className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-[10px]"
                          >
                            Atrás
                          </button>
                        </div>
                        <div className="space-y-1 overflow-y-auto max-h-[140px] pr-1 text-[10px]">
                          {foundAps.map((ap, idx) => (
                            <div key={idx} className="p-1.5 bg-slate-900/90 rounded border border-slate-800 flex justify-between items-center">
                              <div>
                                <span className="font-bold text-white">{ap.ssid}</span>
                                <span className="text-slate-400 ml-2">CH {ap.ch}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">{ap.rssi} dBm</span>
                                <span className={`px-1 rounded text-[9px] ${ap.enc === 'OPEN' ? 'bg-rose-900 text-rose-300' : 'bg-slate-800 text-amber-300'}`}>
                                  {ap.enc}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-[9px] text-slate-400 flex justify-between pt-1">
                          <span>Modo: Pasivo Beacon Listener</span>
                          <span>MicroSD: Listo</span>
                        </div>
                      </div>
                    )}

                    {marauderScreen === 'sniff_pmkid' && (
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-cyan-400 font-bold">PMKID Sniffer (WPA/WPA2)</span>
                            <button
                              onClick={() => handleTouch('Volver', () => setMarauderScreen('main'))}
                              className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-[10px]"
                            >
                              Atrás
                            </button>
                          </div>
                          <div className="bg-slate-900 p-2 rounded text-[10px] space-y-1 text-slate-300">
                            <div>Escuchando tramas EAPOL 4-Way Handshake...</div>
                            <div className="text-amber-300">Canal fijo: CH 6 (Corp_WiFi_5G)</div>
                            <div className="p-1.5 bg-black/60 rounded font-mono text-[9px] text-emerald-400">
                              {pmkidCaptured ? (
                                <>
                                  <div>[+] PMKID CAPTURADO CON ÉXITO!</div>
                                  <div>BSSID: A4:11:9B:44:01:10</div>
                                  <div>PMKID: e2a8b9f012...890ab</div>
                                  <div>Guardado en /sd/pmkid.16800</div>
                                </>
                              ) : (
                                <div>Esperando autenticación o trama de respuesta EAPOL...</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleTouch('Capturar', () => {
                            setPmkidCaptured(true);
                            cydAudio.playSonarPing();
                          })}
                          className="w-full py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs font-bold"
                        >
                          {pmkidCaptured ? 'Volver a Escanear' : 'Simular Captura PMKID'}
                        </button>
                      </div>
                    )}

                    {marauderScreen === 'beacon_spam' && (
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-rose-400 font-bold">Beacon Flooding (Educativo)</span>
                          <button
                            onClick={() => handleTouch('Volver', () => setMarauderScreen('main'))}
                            className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-[10px]"
                          >
                            Atrás
                          </button>
                        </div>
                        <div className="bg-slate-900 p-2 rounded text-[10px] space-y-1">
                          <div className="text-slate-300">Generando 50 SSIDs falsos en el aire:</div>
                          <div className="text-amber-300 font-mono text-[9px]">
                            "Wi-Fi_Audit_01", "Rickroll_Network", "FBI_Surveillance_Van", "NeverGonnaGiveYouUp"...
                          </div>
                          <div className="text-slate-400 text-[9px] mt-1">
                            Demuestra la saturación de listas Wi-Fi en dispositivos cercanos sin cifrado.
                          </div>
                        </div>
                        <div className="text-[10px] text-center text-amber-400 font-bold animate-pulse">
                          Transmisión activa de Beacons [TX: OK]
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ===================== MODE 3: BLE HUNTER (AIRTAG) ===================== */}
                {mode === 'ble-hunter' && (
                  <div className="p-3 h-[calc(100%-28px)] flex flex-col justify-between text-slate-200">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5" />
                          RADAR ANTI-RASTREO BLE
                        </span>
                        <span className="text-[10px] text-slate-400">Empresas: Apple, Tile</span>
                      </div>

                      {/* Radar Screen Graphic */}
                      <div className="relative w-full h-24 bg-slate-950/80 rounded border border-cyan-900/60 flex items-center justify-center overflow-hidden mb-2">
                        {/* Concentric circles */}
                        <div className="absolute w-20 h-20 rounded-full border border-cyan-800/40"></div>
                        <div className="absolute w-12 h-12 rounded-full border border-cyan-800/60"></div>
                        <div className="absolute w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400"></div>

                        {/* Radar sweep line */}
                        <div
                          className="absolute w-12 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 origin-left"
                          style={{
                            transform: `rotate(${bleRadarDegree}deg)`,
                            left: '50%'
                          }}
                        />

                        {/* Tracker Blip */}
                        <div className="absolute top-6 right-16 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                        <div className="absolute top-6 right-16 w-2 h-2 rounded-full bg-red-500" title="AirTag detectado"></div>
                      </div>

                      {/* Detected devices */}
                      <div className="space-y-1 text-[10px]">
                        {bleBeacons.map((b) => (
                          <div key={b.id} className="p-1.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                            <div>
                              <div className="font-bold text-amber-300">{b.type}</div>
                              <div className="text-slate-400 text-[9px]">{b.mac}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">{b.dist}</div>
                              <div className="text-cyan-400 text-[9px]">{b.rssi} dBm</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[9px] text-center text-slate-400">
                      Alerta sonora activada si la baliza persiste más de 10 min.
                    </div>
                  </div>
                )}

                {/* ===================== MODE 4: IOT CANARY HONEYPOT ===================== */}
                {mode === 'honeypot' && (
                  <div className="p-3 h-[calc(100%-28px)] flex flex-col justify-between text-slate-200">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Bug className="w-3.5 h-3.5" />
                          CYD IOT CANARY HONEYPOT
                        </span>
                        <span className="text-[10px] text-emerald-400">IP: 192.168.1.185</span>
                      </div>

                      <div className="text-[10px] text-slate-400 mb-2">
                        Puertos señuelo abiertos: 23 (Telnet), 80 (Web Cam Falsa), 502 (Modbus PLC)
                      </div>

                      {/* Live honeypot log */}
                      <div className="space-y-1 max-h-[115px] overflow-y-auto text-[9px]">
                        {canaryLogs.map((log, i) => (
                          <div key={i} className="p-1 bg-slate-900/90 rounded border border-amber-900/40 font-mono">
                            <span className="text-slate-500">[{log.time}] </span>
                            <span className="text-amber-400">{log.ip}:{log.port} </span>
                            <span className="text-slate-200">- {log.event}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleTouch('Nmap Scan', triggerCanaryScan)}
                      className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs transition-colors"
                    >
                      Simular Escaneo Nmap desde la Red
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Ports on the Board: MicroSD & Dual USB Ports */}
            <div className="flex items-center justify-between px-3 mt-3 text-[10px] font-mono text-slate-900 font-bold">
              {/* MicroSD Slot */}
              <div className="flex items-center gap-1 bg-amber-600/30 px-2 py-0.5 rounded border border-amber-700/40">
                <span className="w-2.5 h-1.5 bg-slate-900 rounded-sm"></span>
                <span>MicroSD (VSPI: IO5)</span>
              </div>

              {/* Expansion CN1 header indication */}
              <div className="text-[9px] text-slate-900/80">
                PORT CN1: IO22, IO27, IO35 (RF/GPS)
              </div>

              {/* USB ports */}
              <div className="flex items-center gap-1.5">
                <div className="px-1.5 py-0.5 bg-slate-900 text-amber-300 rounded text-[9px]">
                  USB-C
                </div>
                <div className="px-1.5 py-0.5 bg-slate-900 text-amber-300 rounded text-[9px]">
                  CH340
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTROL DOCK & EXPERIMENTATION PANEL */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Selecciona Firmware a Simular</span>
            </h3>

            {/* Segmented controls / buttons for mode */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => {
                  setMode('sentinel');
                  cydAudio.playClick();
                }}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  mode === 'sentinel'
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs">CYD Sentinel IDS</div>
                <div className="text-[10px] opacity-75">Detección de Deauth Wi-Fi</div>
              </button>

              <button
                onClick={() => {
                  setMode('marauder');
                  cydAudio.playClick();
                }}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  mode === 'marauder'
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs">ESP32 Marauder</div>
                <div className="text-[10px] opacity-75">Suite Red Team 802.11</div>
              </button>

              <button
                onClick={() => {
                  setMode('ble-hunter');
                  cydAudio.playClick();
                }}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  mode === 'ble-hunter'
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs">BLE AirTag Hunter</div>
                <div className="text-[10px] opacity-75">Scanner Anti-Rastreo</div>
              </button>

              <button
                onClick={() => {
                  setMode('honeypot');
                  cydAudio.playClick();
                }}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  mode === 'honeypot'
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs">Canary Honeypot</div>
                <div className="text-[10px] opacity-75">Señuelo Físico de Red</div>
              </button>
            </div>

            {/* Hardware Sensor Adjustments */}
            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Simular Sensor de Luz LDR (GPIO 34)</span>
                  <span className="text-amber-400 font-mono">{ldrValue}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={ldrValue}
                  onChange={(e) => setLdrValue(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Ajusta el brillo relativo de la pantalla como lo haría el control PWM en GPIO 21 según la luz ambiental.
                </p>
              </div>

              {/* Hardware Quirks quick note */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5 mb-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Peculiaridad de Hardware CYD:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  El LED RGB en la placa utiliza <strong>lógica invertida (Active LOW)</strong>.
                  Para encender el LED Rojo debes escribir <code className="text-amber-300">digitalWrite(4, LOW)</code>. Si envías <code className="text-amber-300">HIGH</code>, el LED se apaga.
                </p>
              </div>
            </div>
          </div>

          {/* Educational Insights Box */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>¿Qué está sucediendo internamente?</span>
            </div>
            {mode === 'sentinel' && (
              <p className="text-slate-400 leading-relaxed">
                El chip ESP32 ejecuta <code className="text-slate-300">esp_wifi_set_promiscuous(true)</code> para capturar tramas aéreas sin asociarse a ningún AP. El código analiza el byte de Frame Control buscando tramas de desautenticación (0x00c0) y dispara el DAC de audio (GPIO 26) para advertir inmediatamente al administrador.
              </p>
            )}
            {mode === 'marauder' && (
              <p className="text-slate-400 leading-relaxed">
                Marauder es capaz de capturar el hash PMKID del primer mensaje del 4-way handshake en routers WPA/WPA2 vulnerables. Ese hash se vuelca a la tarjeta MicroSD (conectada por el bus VSPI en el GPIO 5) para transferirlo luego a Hashcat en tu estación de trabajo.
              </p>
            )}
            {mode === 'ble-hunter' && (
              <p className="text-slate-400 leading-relaxed">
                Los AirTags rotan sus direcciones MAC constantemente por privacidad, pero su paquete de anuncio contiene la carga útil <code className="text-slate-300">0x4C 0x00 0x12</code> de Apple Find My. La CYD filtra estos anuncios y mide la señal RSSI para calcular la distancia estimada en metros.
              </p>
            )}
            {mode === 'honeypot' && (
              <p className="text-slate-400 leading-relaxed">
                Un atacante que realiza movimiento lateral en la red escanea con Nmap buscando servidores web o Telnet. Al intentar interactuar con la CYD señuelo, se genera una alarma acústica in situ y un webhook hacia el equipo de seguridad sin falsos positivos.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Technical Debugging: Serial Monitor & AT Command Console */}
      <SerialMonitorPanel
        currentChannel={channel}
        isUnderAttack={isUnderAttack}
        deauthCount={deauthCount}
        ldrValue={ldrValue}
        onChannelChange={(ch) => setChannel(ch)}
        onTriggerDeauth={triggerDeauthAttack}
      />
    </div>
  );
};
