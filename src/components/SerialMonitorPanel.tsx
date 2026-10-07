import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Send, 
  Trash2, 
  Download, 
  Pause, 
  Play, 
  Cpu, 
  Radio, 
  Wifi, 
  Check, 
  Copy, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { cydAudio } from '../utils/audio';

export interface SerialLogEntry {
  id: string;
  time: string;
  type: 'rx' | 'tx' | 'info' | 'alert' | 'at';
  text: string;
}

interface SerialMonitorPanelProps {
  currentChannel: number;
  isUnderAttack: boolean;
  deauthCount: number;
  ldrValue: number;
  onChannelChange?: (ch: number) => void;
  onTriggerDeauth?: () => void;
}

export const SerialMonitorPanel: React.FC<SerialMonitorPanelProps> = ({
  currentChannel,
  isUnderAttack,
  deauthCount,
  ldrValue,
  onChannelChange,
  onTriggerDeauth
}) => {
  const [logs, setLogs] = useState<SerialLogEntry[]>([
    { id: '1', time: '00:00:00.120', type: 'info', text: '--- ESP-IDF v4.4.2-idf Bootloader (HSPI / VSPI Dual Bus) ---' },
    { id: '2', time: '00:00:00.245', type: 'info', text: 'rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)' },
    { id: '3', time: '00:00:00.380', type: 'info', text: '[CYD-TFT] ILI9341 HSPI inicializado a 40 MHz (320x240).' },
    { id: '4', time: '00:00:00.410', type: 'info', text: '[CYD-SD] MicroSD montada en VSPI (CS: GPIO 5).' },
    { id: '5', time: '00:00:00.520', type: 'info', text: '[CYD-WIFI] Radio en modo promiscuo iniciado. UART @ 115200 8N1.' },
    { id: '6', time: '00:00:00.600', type: 'at', text: 'AT Parser activo. Escribe AT o AT+HELP para interactuar.' }
  ]);

  const [inputCommand, setInputCommand] = useState<string>('');
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [showTimestamps, setShowTimestamps] = useState<boolean>(true);
  const [copiedLog, setCopiedLog] = useState<boolean>(false);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Periodic Raw Stream Simulation (UART telemetry from board)
  useEffect(() => {
    if (isPaused) return;

    const streamInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

      const streamEvents = [
        `[RAW-802.11] CH:${currentChannel} | RSSI:-${Math.floor(Math.random() * 35) + 45}dBm | FC:0x0080 | BEACON "CorpNet_Sec"`,
        `[TOUCH-XPT] IRQ low -> X:${Math.floor(Math.random() * 200) + 60}, Y:${Math.floor(Math.random() * 150) + 40}, P:195`,
        `[LDR-ADC] GPIO 34 reading: ${Math.round(ldrValue * 40.95)} (Lux calc: ${ldrValue}%)`,
        `[HEAP-DUMP] Free: ${Math.floor(Math.random() * 5000) + 192000} bytes | Min: 181240 bytes`,
        `[PROMISC] Pkt Rx Len: 128 bytes | CRC32: 0x9A4F | Mac: A4:11:9B:44:01:10`
      ];

      // Add alert event if under attack
      if (isUnderAttack) {
        streamEvents.push(
          `[ALERT-DEAUTH] !!! Subtype 0x00c0 detected on CH:${currentChannel} !!! Attacker: B4:82:C5:11:9E:04`
        );
      }

      const randomEvent = streamEvents[Math.floor(Math.random() * streamEvents.length)];
      const entryType = randomEvent.includes('ALERT') ? 'alert' : 'rx';

      setLogs((prev) => [
        ...prev.slice(-180), // keep last 180 logs in memory
        {
          id: String(Date.now()) + Math.random(),
          time: timeStr,
          type: entryType,
          text: randomEvent
        }
      ]);
    }, 1800);

    return () => clearInterval(streamInterval);
  }, [isPaused, currentChannel, isUnderAttack, ldrValue]);

  // Handle AT Command Execution
  const executeAtCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    // 1. Log sent command (TX)
    const newTxEntry: SerialLogEntry = {
      id: String(Date.now()),
      time: timeStr,
      type: 'tx',
      text: `> ${cmd}`
    };

    cydAudio.playClick();

    // 2. Process Command Response
    const upperCmd = cmd.toUpperCase();
    let responses: string[] = [];
    let respType: 'at' | 'info' | 'alert' = 'at';

    if (upperCmd === 'AT') {
      responses = ['OK'];
    } else if (upperCmd === 'AT+GMR') {
      responses = [
        'AT version: 2.4.0.0 (CYD-ESP32-Build)',
        'SDK version: v4.4.2-idf',
        'Board: ESP32-2432S028R (ILI9341 320x240 HSPI, SD VSPI)',
        'Firmware: CYD_CyberSec_Workbench_v2.0',
        'OK'
      ];
    } else if (upperCmd === 'AT+CWMODE?') {
      responses = ['+CWMODE:1 (STA / Promiscuous Monitor Mode)', 'OK'];
    } else if (upperCmd.startsWith('AT+CWMODE=')) {
      responses = ['OK'];
    } else if (upperCmd === 'AT+CWLAP') {
      responses = [
        '+CWLAP:(4,"Corp_WiFi_5G",-52,"a4:11:9b:44:01:10",6)',
        '+CWLAP:(0,"INVITADOS_FREE",-68,"f8:0f:41:2b:99:32",1)',
        '+CWLAP:(3,"FIBRA_OPTICA_78B2",-74,"30:91:8f:d2:78:b2",11)',
        '+CWLAP:(4,"Smart_Home_IoT",-80,"00:1e:06:55:c3:19",6)',
        '+CWLAP:(4,"Oficina_Directiva",-61,"00:1a:2b:3c:4d:5e",6)',
        'OK'
      ];
    } else if (upperCmd === 'AT+CIFSR') {
      responses = [
        '+CIFSR:STAIP,"192.168.1.105"',
        '+CIFSR:STAMAC,"30:ae:a4:05:81:7c"',
        '+CIFSR:APMAC,"30:ae:a4:05:81:7d"',
        'OK'
      ];
    } else if (upperCmd === 'AT+CH?') {
      responses = [`+CH:${currentChannel}`, 'OK'];
    } else if (upperCmd.startsWith('AT+CH=')) {
      const parts = upperCmd.split('=');
      const targetCh = parseInt(parts[1], 10);
      if (!isNaN(targetCh) && targetCh >= 1 && targetCh <= 13) {
        if (onChannelChange) onChannelChange(targetCh);
        responses = [`+CH: Canales conmutado a ${targetCh}`, 'OK'];
      } else {
        responses = ['+CH: ERROR (Canal inválido 1-13)', 'ERROR'];
      }
    } else if (upperCmd === 'AT+DEAUTH?' || upperCmd === 'AT+IDS?') {
      responses = [
        `+IDS:STATUS=${isUnderAttack ? 'ALERTA_ACTIVA' : 'VIGILANCIA_OK'}`,
        `+IDS:TOTAL_DEAUTHS=${deauthCount}`,
        `+IDS:CANAL=${currentChannel}`,
        'OK'
      ];
      if (isUnderAttack) respType = 'alert';
    } else if (upperCmd === 'AT+TOUCH?') {
      responses = ['+TOUCH:X=142,Y=89,PRESS=190,STATUS=OK', 'OK'];
    } else if (upperCmd === 'AT+LDR?') {
      responses = [`+LDR:ADC=${Math.round(ldrValue * 40.95)},VAL=${ldrValue}%,STATUS=OK`, 'OK'];
    } else if (upperCmd === 'AT+RST') {
      responses = [
        '--- ESP32 REINICIANDO (Software Reset) ---',
        'ets Jun  8 2016 00:22:57',
        'rst:0xc (SW_CPU_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)',
        'configsip: 0, SPIWP:0xee',
        'clk_drv:0x00,q_drv:0x00,d_drv:0x00,cs0_drv:0x00,hd_drv:0x00,wp_drv:0x00',
        'load:0x3fff0030,len:1184',
        'entry 0x400805e4',
        '[CYD-INIT] Sistema reiniciado correctamente.',
        'OK'
      ];
      respType = 'info';
    } else if (upperCmd === 'AT+HELP') {
      responses = [
        '=== COMANDOS AT SOPORTADOS POR CYD CYBERSEC ===',
        '  AT          : Test de comunicación (retorna OK)',
        '  AT+GMR      : Información de versión, chip y firmware',
        '  AT+CWMODE?  : Consultar modo Wi-Fi (Promiscuo / STA)',
        '  AT+CWLAP    : Escanear redes inalámbricas en el aire',
        '  AT+CIFSR    : Consultar direcciones IP y MAC de hardware',
        '  AT+CH?      : Consultar canal Wi-Fi actual',
        '  AT+CH=<1-13>: Fijar canal de escucha específico',
        '  AT+DEAUTH?  : Estado del sensor IDS y recuento de ataques',
        '  AT+TOUCH?   : Coordenadas del panel táctil XPT2046',
        '  AT+LDR?     : Lectura ADC del sensor de luz GPIO 34',
        '  AT+RST      : Reinicio por software del ESP32',
        '================================================',
        'OK'
      ];
    } else {
      responses = [`ERROR: Comando desconocido "${cmd}". Escribe AT+HELP para ver la lista.`, 'ERROR'];
    }

    const newResponseEntries: SerialLogEntry[] = responses.map((r, idx) => ({
      id: String(Date.now() + idx + 1),
      time: timeStr,
      type: respType,
      text: r
    }));

    setLogs((prev) => [...prev, newTxEntry, ...newResponseEntries]);
    setInputCommand('');
  };

  const handleDownloadLog = () => {
    cydAudio.playClick();
    const content = logs.map((l) => `${l.time} [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyd_uart_raw_log_${Date.now()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLogs = () => {
    const content = logs.map((l) => `${l.time} [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(content);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const quickCommands = [
    'AT',
    'AT+GMR',
    'AT+CWMODE?',
    'AT+CWLAP',
    'AT+CIFSR',
    'AT+CH=6',
    'AT+DEAUTH?',
    'AT+RST',
    'AT+HELP'
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      {/* Top Header of Monitor Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-0.5">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>MONITOR SERIAL UART & COMANDOS AT</span>
            <span>·</span>
            <span>DEPURACIÓN TÉCNICA EN TIEMPO REAL</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Flujo de Datos Crudos desde la Placa CYD (ESP32)</span>
          </h3>
        </div>

        {/* Action Controls & Baud Rate */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Baud Rate Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 font-mono text-[11px]">
            <span className="text-slate-500">Baud:</span>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value={9600}>9600</option>
              <option value={115200}>115200 (Std)</option>
              <option value={921600}>921600 (Fast)</option>
            </select>
          </div>

          {/* Pause / Resume */}
          <button
            onClick={() => {
              setIsPaused(!isPaused);
              cydAudio.playClick();
            }}
            className={`px-2.5 py-1 rounded-xl border transition-colors flex items-center gap-1 text-[11px] font-medium ${
              isPaused
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isPaused ? 'Reanudar flujo serie' : 'Pausar flujo serie'}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
          </button>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-medium transition-colors ${
              autoScroll
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Auto-Scroll
          </button>

          {/* Timestamps toggle */}
          <button
            onClick={() => setShowTimestamps(!showTimestamps)}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-medium transition-colors ${
              showTimestamps
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Timestamp
          </button>

          {/* Copy Logs */}
          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors"
            title="Copiar texto del monitor serie"
          >
            {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download Log */}
          <button
            onClick={handleDownloadLog}
            className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors"
            title="Descargar archivo crudo .log"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear Console */}
          <button
            onClick={() => {
              setLogs([]);
              cydAudio.playClick();
            }}
            className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-rose-400 hover:text-rose-300 transition-colors"
            title="Limpiar monitor serie"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Raw Serial Terminal Screen */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs h-[300px] overflow-y-auto space-y-1 select-text scrollbar-thin">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic text-center py-20">
            Monitor serial vacío. Escribe un comando AT o espera el flujo de telemetría.
          </div>
        ) : (
          logs.map((entry) => {
            let textColor = 'text-slate-300';
            if (entry.type === 'tx') textColor = 'text-amber-400 font-bold';
            else if (entry.type === 'at') textColor = 'text-cyan-300 font-bold';
            else if (entry.type === 'info') textColor = 'text-blue-300';
            else if (entry.type === 'alert') textColor = 'text-rose-400 font-bold bg-rose-950/30 px-1 rounded';

            return (
              <div key={entry.id} className="leading-relaxed flex items-start gap-2 break-all">
                {showTimestamps && (
                  <span className="text-slate-500 text-[10px] select-none font-mono flex-shrink-0">
                    [{entry.time}]
                  </span>
                )}
                <span className={textColor}>{entry.text}</span>
              </div>
            );
          })
        )}
        <div ref={consoleEndRef} />
      </div>

      {/* Interactive Command Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeAtCommand(inputCommand);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Escribe un comando AT (ej: AT, AT+GMR, AT+CWLAP, AT+CH=6, AT+HELP)..."
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500/60 pr-16"
          />
          <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500 select-none">
            \r\n
          </span>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enviar</span>
        </button>
      </form>

      {/* Quick-Click AT Command Chips */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1 border-t border-slate-800/80">
        <span className="text-[10px] text-slate-500 font-mono mr-1">Comandos AT rápidos:</span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => executeAtCommand(cmd)}
            className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-800 hover:border-amber-500/40 text-[11px] font-mono transition-colors shadow-sm"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
