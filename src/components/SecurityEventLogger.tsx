import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Trash2, 
  Download, 
  Pause, 
  Play, 
  Search, 
  Radio, 
  Flame, 
  Wifi, 
  Cpu,
  FileSpreadsheet
} from 'lucide-react';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'WARN' | 'INFO';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: SeverityLevel;
  type: string;
  source: string;
  target?: string;
  channel?: number;
  rssi?: number;
  message: string;
  hardwareModule: 'Wi-Fi Promiscuous' | 'BLE Scanner' | 'Canary Socket' | 'MicroSD Logger';
}

const INITIAL_EVENTS: SecurityEvent[] = [
  {
    id: 'evt-1',
    timestamp: '02:37:14',
    severity: 'INFO',
    type: 'SCAN_HOP',
    source: 'CYD_RADIO_0',
    channel: 6,
    message: 'Salto de canal completado a CH 6. 18 APs identificados en el espectro.',
    hardwareModule: 'Wi-Fi Promiscuous'
  },
  {
    id: 'evt-2',
    timestamp: '02:37:28',
    severity: 'WARN',
    type: 'BLE_TRACKER_DETECT',
    source: '4C:90:D1:6A:88:2E',
    rssi: -64,
    message: 'Baliza Apple Find My (AirTag) detectada con persistencia > 8 minutos.',
    hardwareModule: 'BLE Scanner'
  },
  {
    id: 'evt-3',
    timestamp: '02:37:41',
    severity: 'CRITICAL',
    type: 'DEAUTH_FLOOD',
    source: 'B4:82:C5:11:9E:04',
    target: 'DC:A6:32:8B:F2:70',
    channel: 6,
    rssi: -48,
    message: 'Ráfaga de 32 tramas 802.11 Deauth (0x00c0). Posible forzado de 4-way handshake.',
    hardwareModule: 'Wi-Fi Promiscuous'
  },
  {
    id: 'evt-4',
    timestamp: '02:37:55',
    severity: 'HIGH',
    type: 'PMKID_INTERCEPT',
    source: 'A4:11:9B:44:01:10 (Corp_WiFi_5G)',
    channel: 6,
    rssi: -52,
    message: 'Primer mensaje EAPOL capturado. Hash PMKID volcado a /sd/captures/pmkid_06.16800',
    hardwareModule: 'MicroSD Logger'
  },
  {
    id: 'evt-5',
    timestamp: '02:38:09',
    severity: 'WARN',
    type: 'CANARY_PROBE',
    source: '192.168.1.189',
    message: 'Conexión TCP SYN entrante en puerto trampa 23 (Telnet señuelo). Intruso en LAN.',
    hardwareModule: 'Canary Socket'
  }
];

const RANDOM_EVENT_POOL: Omit<SecurityEvent, 'id' | 'timestamp'>[] = [
  {
    severity: 'CRITICAL',
    type: 'DEAUTH_BURST',
    source: '00:C0:CA:91:DE:01',
    target: 'FF:FF:FF:FF:FF:FF (Broadcast)',
    channel: 1,
    rssi: -45,
    message: 'Ataque de desautenticación masivo a nivel Broadcast. Desconexión general de clientes.',
    hardwareModule: 'Wi-Fi Promiscuous'
  },
  {
    severity: 'HIGH',
    type: 'EVIL_TWIN_ALERT',
    source: 'Corp_WiFi_5G [FALSIFICADO]',
    channel: 11,
    rssi: -38,
    message: 'Detectado BSSID duplicado con diferente fabricante OUI. Posible Evil Twin / Rogue AP.',
    hardwareModule: 'Wi-Fi Promiscuous'
  },
  {
    severity: 'HIGH',
    type: 'HANDSHAKE_WPA2',
    source: '30:91:8F:D2:78:B2',
    target: '68:DB:F5:12:3A:99',
    channel: 11,
    rssi: -62,
    message: 'Handshake EAPOL completo (M1, M2, M3, M4) verificado. Guardado en PCAP para análisis.',
    hardwareModule: 'MicroSD Logger'
  },
  {
    severity: 'WARN',
    type: 'PROBE_FLOOD',
    source: 'Smartphone Desconocido',
    channel: 6,
    rssi: -71,
    message: 'Fuga masiva de SSIDs recordados en tramas Probe Request (8 redes históricas descubiertas).',
    hardwareModule: 'Wi-Fi Promiscuous'
  },
  {
    severity: 'WARN',
    type: 'BLE_SPAM_BURST',
    source: 'Anunciante BLE Transitorio',
    rssi: -58,
    message: 'Ráfaga de anuncios de emparejamiento rápido de iOS/Android (Sour Apple / Swift Pair).',
    hardwareModule: 'BLE Scanner'
  },
  {
    severity: 'INFO',
    type: 'SD_FLUSH_OK',
    source: 'CYD_SD_CONTROLLER',
    message: 'Sincronización de búfer completada: 1,280 bytes escritos en /sd/sniff_dump.pcap (FAT32).',
    hardwareModule: 'MicroSD Logger'
  },
  {
    severity: 'INFO',
    type: 'CANARY_HEARTBEAT',
    source: 'CYD_HONEYPOT_DAEMON',
    message: 'Estado del canario de red: 3 puertos trampa a la escucha (23, 80, 502). Cero intrusiones.',
    hardwareModule: 'Canary Socket'
  }
];

export interface SecurityEventLoggerProps {
  onScanRequested?: boolean;
  onScanCompleted?: () => void;
}

export const SecurityEventLogger: React.FC<SecurityEventLoggerProps> = ({
  onScanRequested,
  onScanCompleted
}) => {
  const [events, setEvents] = useState<SecurityEvent[]>(INITIAL_EVENTS);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgressText, setScanProgressText] = useState<string>('');

  // Function to run a full simulated Wi-Fi Scan with realistic timing and detected SSIDs
  const triggerWiFiScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgressText('Iniciando escaneo Wi-Fi en modo promiscuo (canales 1-13)...');

    const scanStartTime = new Date().toTimeString().slice(0, 8);

    // Initial event: Scan Start
    const startEvent: SecurityEvent = {
      id: `scan-start-${Date.now()}`,
      timestamp: scanStartTime,
      severity: 'INFO',
      type: 'SCAN_START',
      source: 'CYD_ESP32_STA',
      channel: 1,
      message: 'Iniciando escaneo Wi-Fi activo/pasivo en canales 1 a 13 del ESP32...',
      hardwareModule: 'Wi-Fi Promiscuous'
    };

    setEvents((prev) => [startEvent, ...prev]);

    // Simulated detected SSIDs list with RSSI signal levels
    const detectedNetworks = [
      {
        delay: 500,
        ssid: 'Corp_WiFi_5G',
        bssid: 'A4:11:9B:44:01:10',
        channel: 6,
        rssi: -48,
        enc: 'WPA2-Enterprise',
        signalQuality: 'Excelente',
        severity: 'INFO' as SeverityLevel
      },
      {
        delay: 1000,
        ssid: 'GUEST_OPEN_HOTSPOT',
        bssid: 'F8:0F:41:2B:99:32',
        channel: 1,
        rssi: -62,
        enc: 'OPEN (Sin cifrado)',
        signalQuality: 'Buena',
        severity: 'WARN' as SeverityLevel
      },
      {
        delay: 1500,
        ssid: 'FIBRA_OPTICA_78B2',
        bssid: '30:91:8F:D2:78:B2',
        channel: 11,
        rssi: -74,
        enc: 'WPA3/WPA2-PSK',
        signalQuality: 'Media',
        severity: 'INFO' as SeverityLevel
      },
      {
        delay: 2000,
        ssid: 'Smart_Home_IoT_Mesh',
        bssid: '00:1E:06:55:C3:19',
        channel: 6,
        rssi: -82,
        enc: 'WPA2-PSK',
        signalQuality: 'Débil',
        severity: 'INFO' as SeverityLevel
      },
      {
        delay: 2500,
        ssid: '[SSID Oculto / Cloaked]',
        bssid: '52:54:00:12:34:56',
        channel: 3,
        rssi: -56,
        enc: 'WPA2-PSK (Beacon Oculto)',
        signalQuality: 'Buena',
        severity: 'WARN' as SeverityLevel
      }
    ];

    detectedNetworks.forEach((net) => {
      setTimeout(() => {
        const timeNow = new Date().toTimeString().slice(0, 8);
        setScanProgressText(`Detectado: ${net.ssid} (${net.rssi} dBm en CH ${net.channel})`);

        const netEvent: SecurityEvent = {
          id: `scan-net-${Date.now()}-${net.channel}`,
          timestamp: timeNow,
          severity: net.severity,
          type: 'SSID_DETECTED',
          source: net.bssid,
          target: net.ssid,
          channel: net.channel,
          rssi: net.rssi,
          message: `Red Wi-Fi identificada: "${net.ssid}" | Señal: ${net.rssi} dBm (${net.signalQuality}) | Cifrado: ${net.enc}`,
          hardwareModule: 'Wi-Fi Promiscuous'
        };

        setEvents((prev) => [netEvent, ...prev]);
      }, net.delay);
    });

    // Final event: Scan Complete
    setTimeout(() => {
      const timeEnd = new Date().toTimeString().slice(0, 8);
      setIsScanning(false);
      setScanProgressText('');

      const completeEvent: SecurityEvent = {
        id: `scan-end-${Date.now()}`,
        timestamp: timeEnd,
        severity: 'INFO',
        type: 'SCAN_COMPLETE',
        source: 'CYD_ESP32_STA',
        message: 'Escaneo Wi-Fi completado: 5 puntos de acceso indexados y sincronizados en tarjeta MicroSD.',
        hardwareModule: 'MicroSD Logger'
      };

      setEvents((prev) => [completeEvent, ...prev]);
      if (onScanCompleted) onScanCompleted();
    }, 3100);
  };

  // Listen to external scan request
  useEffect(() => {
    if (onScanRequested) {
      triggerWiFiScan();
    }
  }, [onScanRequested]);

  // Auto append events periodically
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randomTemplate = RANDOM_EVENT_POOL[Math.floor(Math.random() * RANDOM_EVENT_POOL.length)];
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);

      const newEvent: SecurityEvent = {
        ...randomTemplate,
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: timeStr
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
    }, 4500);

    return () => clearInterval(interval);
  }, [isLive]);

  const handleManualInject = () => {
    const now = new Date().toTimeString().slice(0, 8);
    const criticalEvent: SecurityEvent = {
      id: `evt-manual-${Date.now()}`,
      timestamp: now,
      severity: 'CRITICAL',
      type: 'INYECCIÓN_DEAUTH_MANUAL',
      source: 'C0:25:E9:55:00:19',
      target: 'B8:27:EB:AA:11:FE',
      channel: 6,
      rssi: -42,
      message: 'Ataque forzado de prueba inyectado. Alerta acústica en pin DAC 26 y pantalla en rojo.',
      hardwareModule: 'Wi-Fi Promiscuous'
    };
    setEvents((prev) => [criticalEvent, ...prev]);
  };

  const handleClearLogs = () => {
    setEvents([]);
  };

  const handleExportLogs = () => {
    const textContent = events
      .map(
        (e) =>
          `[${e.timestamp}] [${e.severity}] [${e.type}] Mod:${e.hardwareModule} Src:${e.source}${
            e.channel ? ` Ch:${e.channel}` : ''
          }${e.rssi ? ` RSSI:${e.rssi}dBm` : ''} - ${e.message}`
      )
      .join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyd_security_events_${new Date().toISOString().slice(0, 10)}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Marca_Tiempo',
      'Severidad',
      'Tipo_Evento',
      'Modulo_Hardware',
      'Origen_MAC_IP',
      'Destino_MAC_SSID',
      'Canal_WiFi',
      'Potencia_RSSI_dBm',
      'Mensaje_Detallado'
    ];

    const escapeCsv = (val: string | number | undefined) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = events.map((e) => [
      escapeCsv(e.id),
      escapeCsv(e.timestamp),
      escapeCsv(e.severity),
      escapeCsv(e.type),
      escapeCsv(e.hardwareModule),
      escapeCsv(e.source),
      escapeCsv(e.target || ''),
      escapeCsv(e.channel !== undefined ? e.channel : ''),
      escapeCsv(e.rssi !== undefined ? e.rssi : ''),
      escapeCsv(e.message)
    ].join(','));

    // UTF-8 BOM (\uFEFF) to guarantee correct accent and character display in Microsoft Excel and external spreadsheet viewers
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyd_security_events_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter((e) => {
    const matchesSev = severityFilter === 'ALL' || e.severity === severityFilter;
    const matchesSearch =
      e.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.hardwareModule.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>REGISTRO FORENSE EN TIEMPO REAL</span>
            <span>·</span>
            <span>CYD EVENT AUDIT LOG</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <span>Registro de Eventos de Seguridad Detectados</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            Trazabilidad detallada de incidentes 802.11, capturas de handshakes, balizas BLE y sondas de red generadas por el firmware de la CYD.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={triggerWiFiScan}
            disabled={isScanning}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              isScanning
                ? 'bg-amber-600 text-slate-950 animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover:scale-[1.02]'
            }`}
          >
            <Wifi className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Escaneando...' : 'Scan Wi-Fi'}</span>
          </button>

          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isLive
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Pausar Flujo' : 'Reanudar Flujo'}</span>
          </button>

          <button
            onClick={handleManualInject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Inyectar Evento Crítico</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition-colors shadow-sm"
            title="Exportar incidentes a archivo CSV estructurado para análisis en Excel, Google Sheets o herramientas SIEM"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Exportar archivo de log en texto plano compatible con MicroSD de CYD"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar .log</span>
          </button>

          <button
            onClick={handleClearLogs}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            title="Limpiar registro actual"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Scanning Progress Banner */}
      {isScanning && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-200 animate-pulse shadow-lg">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-amber-400 animate-spin" />
            <div>
              <span className="font-bold text-amber-300 mr-2">Iniciando escaneo Wi-Fi...</span>
              <span className="text-slate-300 text-[11px] font-mono">{scanProgressText}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] self-end sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="bg-slate-950 px-2 py-0.5 rounded text-amber-400 font-bold border border-amber-500/30">
              RX PROMISCUO CH 1-13
            </span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Severity segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'CRITICAL', label: 'Crítico' },
            { id: 'HIGH', label: 'Alto' },
            { id: 'WARN', label: 'Advertencia' },
            { id: 'INFO', label: 'Info' }
          ].map((sev) => (
            <button
              key={sev.id}
              onClick={() => setSeverityFilter(sev.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                severityFilter === sev.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por MAC, tipo o texto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Events Stream Terminal Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden font-mono text-xs">
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-2.5 rounded-lg hover:bg-slate-900/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-2"
              >
                <div className="space-y-1">
                  {/* Metadata line */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="text-slate-500">[{event.timestamp}]</span>

                    {/* Severity text with color */}
                    <span
                      className={`font-bold ${
                        event.severity === 'CRITICAL'
                          ? 'text-red-400'
                          : event.severity === 'HIGH'
                          ? 'text-orange-400'
                          : event.severity === 'WARN'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {event.severity}
                    </span>

                    <span className="text-slate-400">·</span>

                    <span className="text-white font-semibold">{event.type}</span>

                    <span className="text-slate-400">·</span>

                    <span className="text-slate-400 text-[10px]">{event.hardwareModule}</span>

                    {event.channel && (
                      <>
                        <span className="text-slate-400">·</span>
                        <span className="text-amber-300 text-[10px]">CH {event.channel}</span>
                      </>
                    )}

                    {event.rssi && (
                      <>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400 text-[10px]">{event.rssi} dBm</span>
                      </>
                    )}
                  </div>

                  {/* Message body */}
                  <p className="text-slate-200 text-xs font-sans leading-relaxed">
                    {event.message}
                  </p>

                  {/* Source and target details */}
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>Origen: <span className="text-amber-300 font-mono">{event.source}</span></span>
                    {event.target && (
                      <span>→ Destino: <span className="text-slate-300 font-mono">{event.target}</span></span>
                    )}
                  </div>
                </div>

                {/* Status indicator badge */}
                <div className="self-start sm:self-center">
                  {event.severity === 'CRITICAL' && (
                    <span className="text-[10px] text-red-400 font-bold flex items-center gap-1 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
                      <Flame className="w-3 h-3 text-red-400" />
                      ALERTA DAC
                    </span>
                  )}
                  {event.severity === 'HIGH' && (
                    <span className="text-[10px] text-orange-400 font-bold flex items-center gap-1 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800/60">
                      <AlertTriangle className="w-3 h-3 text-orange-400" />
                      VOLCADO SD
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 font-sans text-xs">
              No hay eventos que coincidan con los filtros seleccionados.
            </div>
          )}
        </div>

        {/* Footer of log stream */}
        <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Buffer en memoria: {events.length} / 50</span>
            <span>·</span>
            <span>MicroSD: /sd/events.log</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>STREAM ACTIVO</span>
          </div>
        </div>
      </div>
    </div>
  );
};
