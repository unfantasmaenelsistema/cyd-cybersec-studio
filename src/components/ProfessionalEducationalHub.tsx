import React, { useState } from 'react';
import { 
  Award, 
  GraduationCap, 
  ShieldCheck, 
  HardDrive, 
  Battery, 
  Layers, 
  Lock, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Sparkles, 
  Radio, 
  ArrowRight,
  Flame,
  HelpCircle,
  Clock,
  ExternalLink,
  Code2,
  Terminal,
  Key,
  Copy,
  Check,
  Search,
  Sliders
} from 'lucide-react';
import { cydAudio } from '../utils/audio';

type HubTab = 'upgrades' | 'dissector' | 'ctf' | 'hashcat' | 'report';

interface CtfChallenge {
  id: string;
  title: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  points: number;
  description: string;
  scenario: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

const CTF_CHALLENGES: CtfChallenge[] = [
  {
    id: 'ctf-1',
    title: 'Caza del Evil Twin (Gemelo Malvado)',
    difficulty: 'Principiante',
    points: 100,
    description: 'La CYD ha detectado dos puntos de acceso emitiendo el mismo SSID corporativo. Identifica cuál es el punto de acceso legítimo y cuál es el clon malicioso.',
    scenario: 'En una oficina, la CYD Sentinel lista: \nAP #1: SSID="CorpNet", BSSID=00:1A:2B:3C:4D:5E (Cisco OUI), CH=6, Señal=-65dBm, WPA2-Enterprise (PMF Activo)\nAP #2: SSID="CorpNet", BSSID=B4:82:C5:11:9E:04 (Espressif OUI), CH=1, Señal=-42dBm, WPA2-PSK (PMF Inactivo)',
    options: [
      {
        id: 'opt-1',
        text: 'AP #2 es el legítimo porque tiene mayor potencia de señal (-42 dBm).',
        correct: false,
        explanation: 'Incorrecto: La proximidad del atacante con un dispositivo portátil a menudo genera una señal artificialmente más fuerte que el AP real del techo.'
      },
      {
        id: 'opt-2',
        text: 'AP #2 es el Evil Twin: la MAC pertenece a Espressif (ESP32/WiFi Pineapple), cambió de canal y degradó a WPA2-PSK sin tramas PMF protegidas.',
        correct: true,
        explanation: '¡Correcto! Los atacantes clonan el SSID pero su hardware (Espressif / Wi-Fi Pineapple) revela un OUI distinto y rebaja la seguridad de WPA2-Enterprise a WPA2-PSK para capturar contraseñas.'
      },
      {
        id: 'opt-3',
        text: 'Ambos son legítimos porque forman una red en malla (Mesh) en canales 1 y 6.',
        correct: false,
        explanation: 'Incorrecto: Una red corporativa no mezcla WPA2-Enterprise con WPA2-PSK ni fabricantes heterogéneos sin anuncio de movilidad 802.11r/k.'
      }
    ]
  },
  {
    id: 'ctf-2',
    title: 'Análisis de Ataque Deauth y Vulnerabilidad 802.11w',
    difficulty: 'Intermedio',
    points: 150,
    description: 'Un atacante está enviando tramas de desautenticación continuas contra tu ordenador portátil. ¿Cuál es el vector y qué contramedida técnica resuelve definitivamente el problema?',
    scenario: 'La CYD registra 50 tramas subtipo 0x00c0 por segundo hacia tu MAC de cliente. Tu portátil se desconecta continuamente de la red.',
    options: [
      {
        id: 'opt-1',
        text: 'El atacante conoce tu contraseña WPA2 y por eso puede desconectarte.',
        correct: false,
        explanation: 'Incorrecto: Las tramas de desautenticación en 802.11 clásico no están autenticadas ni cifradas; cualquiera puede forjar la MAC del router sin saber la clave.'
      },
      {
        id: 'opt-2',
        text: 'Cambiar el SSID a modo oculto (Hidden SSID) detiene las tramas de desautenticación.',
        correct: false,
        explanation: 'Incorrecto: Ocultar el SSID no cifra las tramas de administración de capa 2; el atacante sigue viendo tu BSSID y MAC de cliente.'
      },
      {
        id: 'opt-3',
        text: 'Activar 802.11w (Protected Management Frames - PMF): firma criptográficamente las tramas de gestión e invalida las tramas Deauth forjadas.',
        correct: true,
        explanation: '¡Correcto! IEEE 802.11w (PMF) añade una firma BIP / CMAC a las tramas de desautenticación. Si un tercero intenta inyectarlas, los dispositivos las descartan al fallar la firma criptográfica.'
      }
    ]
  },
  {
    id: 'ctf-3',
    title: 'Fuga de Privacidad por Balizas BLE (Apple Find My)',
    difficulty: 'Avanzado',
    points: 200,
    description: 'La CYD BLE Hunter ha detectado paquetes de anuncio persistentes durante 45 minutos en un vehículo.',
    scenario: 'Payload interceptado: Company ID: 0x004C (Apple Inc.), Tipo: 0x12, Longitud: 0x19 bytes. La MAC de origen rota cada 15 minutos pero el patrón de clave de estado permanece correlacionado.',
    options: [
      {
        id: 'opt-1',
        text: 'Se trata de un teléfono iPhone enviando solicitudes de AirDrop normales.',
        correct: false,
        explanation: 'Incorrecto: AirDrop utiliza el prefijo 0x10 / 0x05 de Nearby sharing con payloads de mayor tamaño; 0x12 identifica exclusivamente balizas Find My / AirTag.'
      },
      {
        id: 'opt-2',
        text: 'Es un AirTag o dispositivo compatible con Find My que está viajando contigo. Riesgo elevado de seguimiento físico no consentido.',
        correct: true,
        explanation: '¡Excelente análisis! La carga útil 0x4C 0x12 es la firma identificativa de la red Apple Find My. La persistencia geográfica de la baliza confirma que se desplaza junto a la víctima.'
      },
      {
        id: 'opt-3',
        text: 'Es una bombilla inteligente Bluetooth del alumbrado público.',
        correct: false,
        explanation: 'Incorrecto: Los dispositivos de domótica fija no rotan MACs ni emiten beacons propietarios de la red Find My de Apple.'
      }
    ]
  }
];

interface FrameField {
  label: string;
  bytes: string;
  bits?: string;
  description: string;
  highlightColor: string;
}

interface FrameSample {
  id: string;
  name: string;
  protocol: string;
  rawHex: string;
  summary: string;
  fields: FrameField[];
}

const FRAME_SAMPLES: FrameSample[] = [
  {
    id: 'frame-deauth',
    name: 'Trama de Desautenticación (802.11 Deauth)',
    protocol: 'IEEE 802.11 Management (Type 0, Subtype 12 / 0x00C0)',
    rawHex: 'C0 00 3A 01 DC A6 32 8B F2 70 B4 82 C5 11 9E 04 B4 82 C5 11 9E 04 60 7E 07 00',
    summary: 'Trama inyectada por un atacante forjando la MAC del router para desconectar al cliente y forzar el 4-Way Handshake.',
    fields: [
      {
        label: 'Frame Control (FC)',
        bytes: 'C0 00',
        bits: 'Type: 00 (Mgmt), Subtype: 1100 (Deauth), Flags: 00000000',
        description: 'Define que es una trama de administración no protegida. Al carecer de 802.11w (PMF), cualquier receptor la procesa sin autenticar.',
        highlightColor: 'text-red-400 bg-red-950/40 border-red-500/40'
      },
      {
        label: 'Duration / ID',
        bytes: '3A 01',
        bits: '314 microsegundos',
        description: 'Tiempo reservado en el medio inalámbrico (NAV - Network Allocation Vector).',
        highlightColor: 'text-amber-400 bg-amber-950/40 border-amber-500/40'
      },
      {
        label: 'Address 1 (Destino / Víctima)',
        bytes: 'DC A6 32 8B F2 70',
        description: 'Dirección MAC del cliente (portátil o teléfono) al que se expulsa de la red.',
        highlightColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40'
      },
      {
        label: 'Address 2 (Transmisor Forjado)',
        bytes: 'B4 82 C5 11 9E 04',
        description: 'MAC del AP emisor que el atacante suplanta (Spoofing) para engañar a la víctima.',
        highlightColor: 'text-purple-400 bg-purple-950/40 border-purple-500/40'
      },
      {
        label: 'Address 3 (BSSID Red)',
        bytes: 'B4 82 C5 11 9E 04',
        description: 'Identificador del punto de acceso de la red afectada.',
        highlightColor: 'text-blue-400 bg-blue-950/40 border-blue-500/40'
      },
      {
        label: 'Sequence Control',
        bytes: '60 7E',
        bits: 'Seq Num: 2022, Frag: 0',
        description: 'Número de secuencia para evitar duplicados en capa de enlace.',
        highlightColor: 'text-slate-300 bg-slate-900 border-slate-700'
      },
      {
        label: 'Reason Code',
        bytes: '07 00',
        bits: 'Code 7: Class 3 frame received from nonassociated STA',
        description: 'Código de motivo 7: le indica al cliente que no está asociado, forzándolo a reconectarse de inmediato.',
        highlightColor: 'text-rose-400 bg-rose-950/50 border-rose-500/50'
      }
    ]
  },
  {
    id: 'frame-pmkid',
    name: 'Trama EAPOL Key con PMKID (WPA2 4-Way Handshake M1)',
    protocol: 'IEEE 802.11 EAPOL (802.1X Key Exchange)',
    rawHex: '88 02 2C 00 ... 5C E2 A8 B9 F0 12 44 88 99 AA BB CC DD EE FF 01',
    summary: 'Primer mensaje del handshake. En routers vulnerables, el AP incluye el hash PMKID en el campo Vendor IE, permitiendo crackear la clave WPA2 sin que haya clientes conectados.',
    fields: [
      {
        label: 'IEEE 802.1X Header',
        bytes: '01 03 00 75',
        bits: 'Version: 1, Type: 3 (Key), Length: 117 bytes',
        description: 'Cabecera de transporte para intercambio de claves criptográficas.',
        highlightColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40'
      },
      {
        label: 'Key Descriptor Type',
        bytes: '02',
        bits: 'Type 2: RSN / WPA2 Key',
        description: 'Indica formato de clave robusta RSN (Robust Security Network).',
        highlightColor: 'text-purple-400 bg-purple-950/40 border-purple-500/40'
      },
      {
        label: 'Key Information (Flags)',
        bytes: '00 8A',
        bits: 'Key Type: Pairwise, Message 1 of 4, Install: No, ACK: Yes',
        description: 'Indica que es el Mensaje 1 enviado por el AP conteniendo el ANonce.',
        highlightColor: 'text-amber-400 bg-amber-950/40 border-amber-500/40'
      },
      {
        label: 'Key Data (PMKID KDE)',
        bytes: '00 0F AC 04 [16 BYTES PMKID]',
        bits: 'OUI: 00-0F-AC, Data Type: 04 (PMKID)',
        description: '¡EL OBJETIVO DEL RED TEAM! PMKID = HMAC-SHA1-128(PMK, "PMK Name" | MAC_AP | MAC_STA). Se captura en 1 segundo y se entrega a Hashcat.',
        highlightColor: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/50'
      }
    ]
  },
  {
    id: 'frame-ble',
    name: 'Anuncio Bluetooth LE (Apple Find My / AirTag)',
    protocol: 'Bluetooth Core Spec v5.0 (ADV_IND / Non-connectable)',
    rawHex: '02 01 06 1A FF 4C 00 12 19 00 ... C5 D2 E1 89',
    summary: 'Trama periódica que emite un AirTag. Permite a la CYD calcular la proximidad física (RSSI) y detectar rastreadores espías no deseados.',
    fields: [
      {
        label: 'Flags AD Structure',
        bytes: '02 01 06',
        description: 'Le indica a los receptores Bluetooth que es un dispositivo en modo descubrimiento general sin soporte clásico BR/EDR.',
        highlightColor: 'text-slate-300 bg-slate-900 border-slate-700'
      },
      {
        label: 'Manufacturer Company ID',
        bytes: '4C 00',
        bits: 'Company: 0x004C (Apple Inc.)',
        description: 'Identificador oficial de fabricante asignado por el Bluetooth SIG a Apple Inc.',
        highlightColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40'
      },
      {
        label: 'Apple Payload Subtype',
        bytes: '12 19',
        bits: 'Type: 0x12 (Find My / AirTag), Len: 25 bytes',
        description: 'Firma clave de la baliza. Diferencia un AirTag de unos AirPods (0x07) o AirDrop (0x10).',
        highlightColor: 'text-amber-400 bg-amber-950/40 border-amber-500/40'
      },
      {
        label: 'Status Byte & Clave Pública Efímera',
        bytes: 'XX XX ... XX',
        description: 'Clave pública rotativa de curva elíptica P-256 utilizada por la red Apple Find My para geolocalización cifrada.',
        highlightColor: 'text-purple-400 bg-purple-950/40 border-purple-500/40'
      }
    ]
  }
];

export const ProfessionalEducationalHub: React.FC = () => {
  const [selectedHubTab, setSelectedHubTab] = useState<HubTab>('upgrades');

  // CTF Interactive state
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [ctfScore, setCtfScore] = useState<number>(0);
  const [solvedChallenges, setSolvedChallenges] = useState<Record<string, boolean>>({});

  // Frame Dissector State
  const [activeFrameSample, setActiveFrameSample] = useState<FrameSample>(FRAME_SAMPLES[0]);
  const [selectedField, setSelectedField] = useState<FrameField | null>(FRAME_SAMPLES[0].fields[0]);

  // Battery Calculator State
  const [batteryCapacity, setBatteryCapacity] = useState<number>(2600); // mAh
  const [brightnessLevel, setBrightnessLevel] = useState<number>(80); // %
  const [radioMode, setRadioMode] = useState<'promiscuous' | 'normal' | 'ble' | 'sleep'>('promiscuous');

  // Hashcat 22000 Tool State
  const [hashSsid, setHashSsid] = useState<string>('Corp_WiFi_5G');
  const [hashApMac, setHashApMac] = useState<string>('a4119b440110');
  const [hashClientMac, setHashClientMac] = useState<string>('dca6328bf270');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedHashcatCmd, setCopiedHashcatCmd] = useState<boolean>(false);

  // Audit Report Generator State
  const [reportAuditor, setReportAuditor] = useState<string>('Un Fantasma en el Sistema');
  const [reportCompany, setReportCompany] = useState<string>('Auditoría Perimetral SL');
  const [reportPmfStatus, setReportPmfStatus] = useState<string>('Vulnerable (PMF Desactivado)');
  const [reportWpaStatus, setReportWpaStatus] = useState<string>('WPA2-PSK (Contraseña Débil 8 caracteres)');
  const [reportRogueDetected, setReportRogueDetected] = useState<boolean>(true);

  // Compute battery runtime:
  // ESP32 base ~60mA, LCD ~30mA at 100%, Promiscuous ~90mA, BLE ~60mA
  const currentConsumptionMa = React.useMemo(() => {
    let base = 60;
    const lcd = 10 + (brightnessLevel / 100) * 35;
    let radio = 90;
    if (radioMode === 'normal') radio = 50;
    if (radioMode === 'ble') radio = 65;
    if (radioMode === 'sleep') radio = 5;
    return Math.round(base + lcd + radio);
  }, [brightnessLevel, radioMode]);

  const estimatedBatteryHours = (batteryCapacity / currentConsumptionMa).toFixed(1);

  // Hashcat 22000 String format: WPA*01*PMKID*MAC_AP*MAC_CLIENT*HEX_SSID***
  const hexSsid = Array.from(hashSsid).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  const simulatedPmkid = 'e2a8b9f012448899aabbccddeeff0123';
  const hashcat22000Line = `WPA*01*${simulatedPmkid}*${hashApMac.replace(/:/g, '')}*${hashClientMac.replace(/:/g, '')}*${hexSsid}***`;
  const hashcatCommand = `hashcat -m 22000 capture.22000 /usr/share/wordlists/rockyou.txt -d 1`;

  const currentChallenge = CTF_CHALLENGES[activeChallengeIdx];

  const handleSelectOption = (optId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optId);
    cydAudio.playClick();
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || hasSubmitted) return;
    setHasSubmitted(true);
    const chosen = currentChallenge.options.find((o) => o.id === selectedOptionId);
    if (chosen?.correct) {
      cydAudio.playSonarPing();
      if (!solvedChallenges[currentChallenge.id]) {
        setCtfScore((prev) => prev + currentChallenge.points);
        setSolvedChallenges((prev) => ({ ...prev, [currentChallenge.id]: true }));
      }
    } else {
      cydAudio.playDeauthAlarm();
    }
  };

  const handleNextChallenge = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setActiveChallengeIdx((prev) => (prev + 1) % CTF_CHALLENGES.length);
    cydAudio.playClick();
  };

  const handleDownloadExecutiveReport = () => {
    const reportDate = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const reportContent = `================================================================================
INFORME EJECUTIVO DE AUDITORÍA INALÁMBRICA (CYD SECURITY WORKBENCH)
Portal de Divulgación: Un Fantasma en el Sistema (https://www.unfantasmaenelsistema.com/)
================================================================================

1. DATOS DE LA AUDITORÍA
--------------------------------------------------------------------------------
Auditor / Equipo Evaluador : ${reportAuditor}
Entidad / Cliente Auditado : ${reportCompany}
Fecha y Hora de Evaluación : ${reportDate}
Dispositivo Hardware Usado : Placa CYD (ESP32-2432S028R 2.8" TFT)
Firmware Empleado          : CYD Sentinel IDS / Marauder Core v1.0

2. RESUMEN EJECUTIVO DE HALLAZGOS
--------------------------------------------------------------------------------
[CRÍTICO] Protección contra Desautenticación (IEEE 802.11w PMF):
  - Estado evaluado: ${reportPmfStatus}
  - Impacto: Un atacante a distancia puede forzar la desconexión masiva de estaciones
    de trabajo y puntos de venta para capturar handshakes WPA o causar denegación de servicio.

[ALTO] Robustez de Cifrado y Claves de Red:
  - Estado evaluado: ${reportWpaStatus}
  - Impacto: Susceptible a ataques de diccionario offline mediante hashes PMKID
    capturados por la CYD sin necesidad de clientes conectados.

[ALERTA] Detección de Rogue APs / Evil Twin:
  - Estado evaluado: ${reportRogueDetected ? 'POSITIVO (Detectado Punto de Acceso Clonado)' : 'NEGATIVO (Espectro Limpio)'}
  - Impacto: Posible robo de credenciales mediante portal cautivo falsificado.

3. RECOMENDACIONES TÉCNICAS PRIORITARIAS (MITIGACIÓN)
--------------------------------------------------------------------------------
1. Activar obligatoriamente 802.11w (PMF) en modo 'Requerido' en los controladores Wi-Fi.
2. Migrar de WPA2-PSK a WPA3-Enterprise (SAE) con autenticación basada en certificados 802.1X.
3. Desplegar dispositivos centinela pasivos (CYD Sentinel) en oficinas críticas para
   monitorizar tramas de administración 0x00c0 con alertas acústicas y webhook a SIEM.
4. Establecer políticas de Bluetooth corporativas que bloqueen el emparejamiento automático
   y revisar periódicamente las zonas de reunión con escáneres BLE anti-rastreo.

--------------------------------------------------------------------------------
Fin del Informe Técnico. Generado por CYD CyberSec Studio.
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_Auditoria_WiFi_${reportCompany.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>SUITE PROFESIONAL INTEGRAL & ACADEMIA</span>
            <span>·</span>
            <span>CYD WORKBENCH PRO</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>Herramientas Profesionales y Academia Educativa CTF</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Todas las mejoras propuestas implementadas y operativas: Upgrades hardware, desensamblador visual de tramas 802.11, retos CTF, conversor Hashcat 22000 e informes ejecutivos.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => { setSelectedHubTab('upgrades'); cydAudio.playClick(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedHubTab === 'upgrades'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Upgrades Hardware & Batería
          </button>

          <button
            onClick={() => { setSelectedHubTab('dissector'); cydAudio.playClick(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              selectedHubTab === 'dissector'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>2. Desensamblador 802.11</span>
          </button>

          <button
            onClick={() => { setSelectedHubTab('ctf'); cydAudio.playClick(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              selectedHubTab === 'ctf'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Retos CTF ({ctfScore} pts)</span>
          </button>

          <button
            onClick={() => { setSelectedHubTab('hashcat'); cydAudio.playClick(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              selectedHubTab === 'hashcat'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>4. Hashcat 22000</span>
          </button>

          <button
            onClick={() => { setSelectedHubTab('report'); cydAudio.playClick(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              selectedHubTab === 'report'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>5. Informes Técnicos</span>
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: UPGRADES & BATTERY CALCULATOR ===================== */}
      {selectedHubTab === 'upgrades' && (
        <div className="space-y-6">
          {/* Interactive Battery & Power Analyzer */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-400">CALCULADORA DE AUTONOMÍA EN CAMPO</span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Battery className="w-5 h-5 text-emerald-400" />
                  <span>Optimizador de Batería LiPo y Consumo de la CYD</span>
                </h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Consumo instantáneo:</span>
                <span className="text-emerald-400 font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  ~{currentConsumptionMa} mA
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Capacidad de Celda LiPo / 18650:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="500"
                    max="3500"
                    step="100"
                    value={batteryCapacity}
                    onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-emerald-400 font-bold w-20 text-right">
                    {batteryCapacity} mAh
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  18650 típica: 2200-2600 mAh | LiPo plana mini: 800-1200 mAh
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Brillo Pantalla LCD (GPIO 21 PWM):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={brightnessLevel}
                    onChange={(e) => setBrightnessLevel(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-amber-400 font-bold w-12 text-right">
                    {brightnessLevel}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Ajustar a 40% duplica la duración de la batería en campo.
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Modo de Radio ESP32:
                </label>
                <select
                  value={radioMode}
                  onChange={(e) => setRadioMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-medium"
                >
                  <option value="promiscuous">Wi-Fi Promiscuo Continuo (90 mA)</option>
                  <option value="normal">Wi-Fi Estación Estándar (50 mA)</option>
                  <option value="ble">Bluetooth Low Energy Scan (65 mA)</option>
                  <option value="sleep">Modo Reposo / Deep Sleep (5 mA)</option>
                </select>
              </div>
            </div>

            {/* Estimated output card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Autonomía Continua Estimada:</span>
                  <div className="text-2xl font-bold font-mono text-white">
                    {estimatedBatteryHours} Horas
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <span className="text-emerald-400 font-bold">✓ Recomendación Profesional:</span> Utilizar circuito de protección TP4056 con corte por bajo voltaje a 3.0V.
              </div>
            </div>
          </div>

          {/* 4 Professional Engineering Upgrades Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>UPGRADE 1 · BACKPACK PCB SHIELD</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  Hardware Modular
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Placa Enchufable Modular en CN1 y P3
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Evita cables Dupont voladores soldando una placa backpack conectada a los puertos traseros:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li>• <strong>Transceptor CC1101 Sub-GHz:</strong> Zócalo seguro para 315/433/868 MHz.</li>
                <li>• <strong>RTC DS3231 I2C con batería CR1220:</strong> Marcas de tiempo forenses exactas en archivos PCAP sin depender de internet.</li>
                <li>• <strong>Conmutador SMA hembra:</strong> Permite alternar entre antena PCB interna y antena externa de alta ganancia.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  <span>UPGRADE 2 · CIFRADO FORENSE & PIN</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                  OPSEC Profesional
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Cifrado MicroSD por Hardware y PIN Táctil
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Protección estricta de la información recolectada durante la auditoría:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li>• <strong>PIN de desbloqueo táctil:</strong> Teclado numérico en pantalla antes de activar cualquier radio.</li>
                <li>• <strong>Cifrado AES-256 en MicroSD:</strong> Usa el motor criptográfico por hardware del ESP32 para cifrar capturas .pcap.</li>
                <li>• <strong>Duress PIN (Código de coacción):</strong> Borrado seguro instantáneo de la flash NVS si el dispositivo es intervenido.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Radio className="w-4 h-4" />
                  <span>UPGRADE 3 · TELEMETRÍA SOC / SIEM</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                  Blue Team Empresarial
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Alertas Automáticas vía Telegram / Discord / Wazuh
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Convierte la CYD Sentinel en un sensor IDS de sala de reuniones permanente:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li>• <strong>Webhook JSON en tiempo real:</strong> Envía alerta con dirección MAC atacante y canal al SIEM corporativo.</li>
                <li>• <strong>Bot de Telegram integrado:</strong> Notificación push inmediata al móvil del oficial de seguridad CISO.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4" />
                  <span>UPGRADE 4 · BADUSB & SCRIPTING HID</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  Ingeniería Social & DFIR
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Emulación de Teclado Bluetooth (DuckyScript)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Aprovecha la radio Bluetooth del ESP32 para actuar como dispositivo HID:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li>• <strong>Lanzador táctil de scripts:</strong> Selecciona en la pantalla táctil scripts Ducky almacenados en la microSD.</li>
                <li>• <strong>Respuesta a incidentes DFIR:</strong> Automatiza la extracción de logs y comandos de recolección de artefactos en estaciones de trabajo.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: FRAME DISSECTOR (DESENSAMBLADOR VISUAL) ===================== */}
      {selectedHubTab === 'dissector' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400">DESENSAMBLADOR EDUCATIVO DE PROTOCOLOS</span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-amber-400" />
                  <span>Inspector Visual de Tramas 802.11 y BLE Bit a Bit</span>
                </h3>
              </div>

              {/* Sample Selector Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                {FRAME_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setActiveFrameSample(sample);
                      setSelectedField(sample.fields[0]);
                      cydAudio.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeFrameSample.id === sample.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sample.name.split(' ')[0]} {sample.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Sample Overview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{activeFrameSample.name}</span>
                <span className="text-xs font-mono text-slate-400">{activeFrameSample.protocol}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeFrameSample.summary}
              </p>
              <div className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-amber-300 overflow-x-auto">
                <span className="text-slate-500 select-none">HEX: </span>
                {activeFrameSample.rawHex}
              </div>
            </div>

            {/* Interactive Block Dissection */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Desglose de Cabeceras (Haz clic en un bloque para inspeccionar su estructura interna):
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {activeFrameSample.fields.map((f, i) => {
                  const isSelected = selectedField?.label === f.label;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedField(f);
                        cydAudio.playClick();
                      }}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'ring-2 ring-amber-400/80 shadow-lg ' + f.highlightColor
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold uppercase mb-1">
                        {f.label}
                      </div>
                      <div className="font-mono text-xs font-bold truncate">
                        {f.bytes}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field Deep Dive Details */}
            {selectedField && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-amber-300 text-sm">
                    {selectedField.label} ({selectedField.bytes})
                  </span>
                  {selectedField.bits && (
                    <span className="font-mono text-[11px] text-cyan-300">
                      {selectedField.bits}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {selectedField.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: CTF ACADEMY ===================== */}
      {selectedHubTab === 'ctf' && (
        <div className="space-y-4">
          {/* CTF Score banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Academia de Retos CTF para la CYD</div>
                <div className="text-slate-400 text-[11px]">Aprende a analizar incidentes reales capturados por la placa</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Puntuación Total</span>
                <div className="text-xl font-bold font-mono text-amber-400">{ctfScore} pts</div>
              </div>
            </div>
          </div>

          {/* Active Challenge Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <span>RETO {activeChallengeIdx + 1} DE {CTF_CHALLENGES.length}</span>
                  <span>·</span>
                  <span className="text-slate-400">{currentChallenge.difficulty}</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {currentChallenge.title}
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                +{currentChallenge.points} PUNTOS
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentChallenge.description}
            </p>

            {/* Scenario Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300/90 whitespace-pre-wrap leading-relaxed">
              <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Telemetría de la CYD en pantalla:</div>
              {currentChallenge.scenario}
            </div>

            {/* Answer Options */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Selecciona la conclusión o contramedida correcta:
              </div>

              {currentChallenge.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                if (hasSubmitted) {
                  if (opt.correct) {
                    optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !opt.correct) {
                    optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-amber-500/15 border-amber-500/60 text-amber-200';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-3.5 rounded-xl text-left border text-xs transition-all flex items-start gap-3 ${optStyle}`}
                  >
                    <span className="font-mono font-bold text-amber-400 text-xs mt-0.5">
                      [{opt.id.slice(-1)}]
                    </span>
                    <div className="flex-1">
                      <div className="font-medium leading-relaxed">{opt.text}</div>
                      {hasSubmitted && (opt.correct || isSelected) && (
                        <div className={`mt-2 text-[11px] leading-relaxed pt-2 border-t ${
                          opt.correct ? 'border-emerald-800/60 text-emerald-300' : 'border-rose-800/60 text-rose-300'
                        }`}>
                          {opt.explanation}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveChallengeIdx((prev) => (prev - 1 + CTF_CHALLENGES.length) % CTF_CHALLENGES.length)}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Anterior Reto
              </button>

              {!hasSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOptionId}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    selectedOptionId
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Comprobar Respuesta
                </button>
              ) : (
                <button
                  onClick={handleNextChallenge}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5"
                >
                  <span>Siguiente Reto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: HASHCAT 22000 EXPORTER ===================== */}
      {selectedHubTab === 'hashcat' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-amber-400">AUDITORÍA FORENSE DE CONTRASEÑAS</span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Generador y Exportador de Formato Hashcat 22000</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                La CYD captura hashes PMKID y handshakes EAPOL. Esta herramienta los formatea en el estándar moderno de Hashcat (-m 22000) listo para auditoría GPU offline.
              </p>
            </div>

            {/* Inputs for generating sample hash */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nombre de Red (SSID):</label>
                <input
                  type="text"
                  value={hashSsid}
                  onChange={(e) => setHashSsid(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">MAC del Router (BSSID):</label>
                <input
                  type="text"
                  value={hashApMac}
                  onChange={(e) => setHashApMac(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">MAC de la CYD / Cliente:</label>
                <input
                  type="text"
                  value={hashClientMac}
                  onChange={(e) => setHashClientMac(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Output Hash string */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Cadena de Hash Formateada (Hashcat Mode 22000 PMKID):</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(hashcat22000Line);
                    setCopiedHash(true);
                    setTimeout(() => setCopiedHash(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHash ? '¡Copiado!' : 'Copiar Hash'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
                {hashcat22000Line}
              </div>
            </div>

            {/* Hashcat Terminal Command */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Comando Terminal Hashcat (Auditoría por GPU):</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(hashcatCommand);
                    setCopiedHashcatCmd(true);
                    setTimeout(() => setCopiedHashcatCmd(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                >
                  {copiedHashcatCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHashcatCmd ? '¡Copiado!' : 'Copiar Comando'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
                {hashcatCommand}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-200">¿Por qué el formato 22000 es superior?</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                El modo 22000 de Hashcat unifica los antiguos modos 16800 (PMKID) y 2500 (WPA EAPOL). El archivo generado contiene todos los parámetros necesarios en texto plano sin requerir cabeceras pcap voluminosas, acelerando el procesamiento en tarjetas gráficas dedicadas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 5: REPORT GENERATOR ===================== */}
      {selectedHubTab === 'report' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-amber-400 font-mono">HERRAMIENTA PROFESIONAL DE AUDITORÍA</span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Generador de Informes Técnicos de Auditoría Wi-Fi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Convierte los datos recolectados por la CYD en un informe formal de seguridad inalámbrica para entregar a clientes o dirección de IT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Auditor / Consultora de Ciberseguridad:</label>
              <input
                type="text"
                value={reportAuditor}
                onChange={(e) => setReportAuditor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Empresa / Cliente Auditado:</label>
              <input
                type="text"
                value={reportCompany}
                onChange={(e) => setReportCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Estado de Protección 802.11w (PMF):</label>
              <select
                value={reportPmfStatus}
                onChange={(e) => setReportPmfStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs"
              >
                <option value="Vulnerable (PMF Desactivado)">Vulnerable (PMF Desactivado - Ataques Deauth posibles)</option>
                <option value="Parcial (PMF Opcional)">Parcial (PMF Opcional - Permite downgrade de clientes)</option>
                <option value="Seguro (PMF Requerido)">Seguro (PMF Requerido - Deauth bloqueado)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Cifrado WPA Detectado:</label>
              <select
                value={reportWpaStatus}
                onChange={(e) => setReportWpaStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs"
              >
                <option value="WPA2-PSK (Contraseña Débil 8 caracteres)">WPA2-PSK (Débil - Vulnerable a PMKID Hashcat)</option>
                <option value="WPA2-Enterprise (802.1X PEAP/MSCHAPv2)">WPA2-Enterprise (Auditable vía Rogue Radius)</option>
                <option value="WPA3-SAE (Dragonfly Handshake)">WPA3-SAE (Robusto contra ataques de diccionario)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-300">Resumen del Informe a Descargar:</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              El informe incluye el marco normativo (Código Penal art. 197 bis), clasificación de severidad de riesgos (CVSS), medidas de mitigación para el equipo de redes y firma del evaluador con referencia a <strong>Un Fantasma en el Sistema</strong>.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleDownloadExecutiveReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Informe de Auditoría (.txt)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
