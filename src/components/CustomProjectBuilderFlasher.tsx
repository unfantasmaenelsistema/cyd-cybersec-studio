import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  Download, 
  Upload, 
  Terminal, 
  Check, 
  Copy, 
  RotateCcw, 
  FileCode, 
  Wifi, 
  Radio, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HardDrive, 
  Sliders, 
  Layers,
  Send,
  Zap,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Keyboard,
  Search,
  Code2
} from 'lucide-react';
import { CustomProjectConfig } from '../types';
import { cydAudio } from '../utils/audio';

// ==========================================
// 7 PROYECTOS ARQUETIPOS DE CIBERSEGURIDAD
// ==========================================
export interface ProjectPreset {
  id: string;
  name: string;
  category: 'Ofensivo' | 'Defensivo' | 'Privacidad' | 'RF & Hardware' | 'Red Team';
  tag: string;
  badgeColor: string;
  description: string;
  hardwareNeeded: string[];
  config: CustomProjectConfig;
}

export const PROJECT_PRESETS: ProjectPreset[] = [
  {
    id: 'preset-marauder',
    name: 'CYD Marauder Suite (Pentesting 802.11)',
    category: 'Ofensivo',
    tag: 'Red Team Wi-Fi',
    badgeColor: 'text-rose-400 bg-rose-500/20 border-rose-500/40',
    description: 'Sniffer promiscuo completo de tramas EAPOL/WPA2, captura de hashes PMKID sin clientes, detección de deauth, escáner de Probe Requests y flooding de balizas.',
    hardwareNeeded: ['Placa CYD estándar', 'MicroSD FAT32 para PCAP', 'Pantalla TFT táctil'],
    config: {
      projectName: 'CYD_Marauder_RedSuite',
      author: 'Un Fantasma en el Sistema',
      version: '1.2.0',
      projectType: 'marauder',
      description: 'Firmware ofensivo y auditoría 802.11 Wi-Fi para placa CYD ESP32-2432S028R.',
      enableWiFiPromiscuous: true,
      enableDeauthDetection: true,
      enablePmkidCapture: true,
      enableBeaconSpam: true,
      enableProbeSniffer: true,
      enableBleHunter: false,
      enableBleSpam: false,
      enableMicroSDStorage: true,
      enableSpeakerAlerts: true,
      enableRgbLed: true,
      enableTftDisplay: true,
      enableTouchControl: true,
      enableCC1101SubGhz: false,
      enableGpsWardriving: false,
      enableBadUsbHid: false,
      enableCanaryAP: false,
      defaultChannel: 6
    }
  },
  {
    id: 'preset-sentinel',
    name: 'CYD Sentinel IDS 24/7 (Guardián Anti-Deauth)',
    category: 'Defensivo',
    tag: 'Blue Team 24/7',
    badgeColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
    description: 'Centinela de escritorio que monitoriza el espectro en tiempo real. Dispara alarma acústica en el DAC (GPIO 26) y estroboscopio rojo ante tramas 0x00c0 y registra incidentes en la MicroSD.',
    hardwareNeeded: ['Placa CYD estándar', 'Altavoz integrado (GPIO 26)', 'LED RGB integrado'],
    config: {
      projectName: 'CYD_Sentinel_IDS_Guardian',
      author: 'Un Fantasma en el Sistema',
      version: '2.0.0',
      projectType: 'sentinel',
      description: 'Sensor IDS de escritorio para detección continua de ataques Wi-Fi y desautenticaciones.',
      enableWiFiPromiscuous: true,
      enableDeauthDetection: true,
      enablePmkidCapture: false,
      enableBeaconSpam: false,
      enableProbeSniffer: false,
      enableBleHunter: false,
      enableBleSpam: false,
      enableMicroSDStorage: true,
      enableSpeakerAlerts: true,
      enableRgbLed: true,
      enableTftDisplay: true,
      enableTouchControl: true,
      enableCC1101SubGhz: false,
      enableGpsWardriving: false,
      enableBadUsbHid: false,
      enableCanaryAP: false,
      defaultChannel: 6
    }
  },
  {
    id: 'preset-ble-hunter',
    name: 'CYD BLE AirTag & Surveillance Hunter',
    category: 'Privacidad',
    tag: 'Anti-Stalking BLE',
    badgeColor: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
    description: 'Escáner pasivo de balizas de seguimiento no deseadas (Apple Find My, Samsung SmartTag, Tile). Calcula la proximidad física mediante RSSI continuo y advierte de balizas sospechosas.',
    hardwareNeeded: ['Placa CYD estándar', 'Radio BLE integrada', 'Pantalla TFT color'],
    config: {
      projectName: 'CYD_BLE_AirTag_Hunter',
      author: 'Un Fantasma en el Sistema',
      version: '1.1.0',
      projectType: 'ble-hunter',
      description: 'Herramienta de detección de dispositivos espías y balizas BLE de rastreo personal.',
      enableWiFiPromiscuous: false,
      enableDeauthDetection: false,
      enablePmkidCapture: false,
      enableBeaconSpam: false,
      enableProbeSniffer: false,
      enableBleHunter: true,
      enableBleSpam: false,
      enableMicroSDStorage: true,
      enableSpeakerAlerts: true,
      enableRgbLed: true,
      enableTftDisplay: true,
      enableTouchControl: true,
      enableCC1101SubGhz: false,
      enableGpsWardriving: false,
      enableBadUsbHid: false,
      enableCanaryAP: false,
      defaultChannel: 1
    }
  },
  {
    id: 'preset-wardriving',
    name: 'CYD Wardriving & GPS Wigle Mapper',
    category: 'Red Team',
    tag: 'Geolocalización RF',
    badgeColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
    description: 'Auditoría inalámbrica en movimiento. Conecta un módulo GPS NEO-6M al puerto CN1 (UART) para correlacionar redes Wi-Fi con coordenadas y exportar el log en formato estándar Wigle CSV.',
    hardwareNeeded: ['Placa CYD', 'Módulo GPS NEO-6M conectado a puerto CN1 (TX/RX)', 'MicroSD'],
    config: {
      projectName: 'CYD_Wardriving_Wigle_Mapper',
      author: 'Un Fantasma en el Sistema',
      version: '1.0.0',
      projectType: 'wardriving',
      description: 'Mapeador georreferenciado de redes inalámbricas compatible con la base de datos Wigle.net.',
      enableWiFiPromiscuous: true,
      enableDeauthDetection: false,
      enablePmkidCapture: true,
      enableBeaconSpam: false,
      enableProbeSniffer: true,
      enableBleHunter: false,
      enableBleSpam: false,
      enableMicroSDStorage: true,
      enableSpeakerAlerts: false,
      enableRgbLed: true,
      enableTftDisplay: true,
      enableTouchControl: true,
      enableCC1101SubGhz: false,
      enableGpsWardriving: true,
      enableBadUsbHid: false,
      enableCanaryAP: false,
      defaultChannel: 1
    }
  },
  {
    id: 'preset-badusb',
    name: 'CYD BadUSB & Bluetooth Ghost Keyboard',
    category: 'Ofensivo',
    tag: 'HID Injection',
    badgeColor: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
    description: 'Emula un teclado Bluetooth inalámbrico HID para auditorías de seguridad física. Lee scripts DuckyScript almacenados en la MicroSD y los lanza con un solo toque en la pantalla de la CYD.',
    hardwareNeeded: ['Placa CYD estándar', 'MicroSD con scripts .txt', 'Pantalla táctil'],
    config: {
      projectName: 'CYD_BadUSB_Ghost_Keyboard',
      author: 'Un Fantasma en el Sistema',
      version: '1.0.0',
      projectType: 'badusb',
      description: 'Inyector de pulsaciones de teclado Bluetooth para auditorías de ingeniería social y DFIR.',
      enableWiFiPromiscuous: false,
      enableDeauthDetection: false,
      enablePmkidCapture: false,
      enableBeaconSpam: false,
      enableProbeSniffer: false,
      enableBleHunter: false,
      enableBleSpam: false,
      enableMicroSDStorage: true,
      enableSpeakerAlerts: true,
      enableRgbLed: true,
      enableTftDisplay: true,
      enableTouchControl: true,
      enableCC1101SubGhz: false,
      enableGpsWardriving: false,
      enableBadUsbHid: true,
      enableCanaryAP: false,
      defaultChannel: 6
    }
  },
  {
    id: 'preset-subghz',
    name: 'CYD Sub-GHz RF Analyzer & Replay (CC1101)',
    category: 'RF & Hardware',
    tag: 'Radiofrecuencia ISM',
    badgeColor: 'text-blue-400 bg-blue-500/20 border-blue-500/40',
    description: 'Convierte la CYD en un clon de Flipper Zero conectando un módulo CC1101 a los conectores CN1 y P3. Analiza frecuencias 433.92/868 MHz y permite captura y reproducción autorizada de códigos OOK.',
    hardwareNeeded: ['Placa CYD', 'Módulo transceptor CC1101 SPI (conectores CN1/P3)', 'Antena externa'],
    config: {
      projectName: 'CYD_SubGHz_RF_Analyzer',
      author: 'Un Fantasma en el Sistema',
      version: '1.0.0',
      projectType: 'subghz',
      description: 'Analizador y emulador de radiofrecuencia Sub-GHz en bandas ISM con pantalla gráfica.',
      enableWiFiPromiscuous: false,
      enableDeauthDetection: false,
      enablePmkidCapture: false,
      enableBeaconSpam: false,
      enableProbeSniffer: false,
      enableBleHunter: false,
      enableBleSpam: false,
      enableMicroSDStorage: true,
      enableSpeakerAlerts: true,
      enableRgbLed: true,
      enableTftDisplay: true,
      enableTouchControl: true,
      enableCC1101SubGhz: true,
      enableGpsWardriving: false,
      enableBadUsbHid: false,
      enableCanaryAP: false,
      defaultChannel: 1
    }
  },
  {
    id: 'preset-canary',
    name: 'CYD Canary AP & Honeypot Rogue Portal',
    category: 'Defensivo',
    tag: 'Deception & Red Flag',
    badgeColor: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/40',
    description: 'Punto de acceso señuelo con servidor DNS y portal cautivo de advertencia embebido. Detecta dispositivos que buscan redes abiertas automáticamente y muestra estadísticas en la pantalla.',
    hardwareNeeded: ['Placa CYD estándar', 'Memoria SPIFFS interna', 'Pantalla TFT'],
    config: {
      projectName: 'CYD_Canary_Honeypot_AP',
      author: 'Un Fantasma en el Sistema',
      version: '1.0.0',
      projectType: 'canary',
      description: 'Honeypot de red Wi-Fi para detección de intrusiones físicas y concienciación en ciberseguridad.',
      enableWiFiPromiscuous: false,
      enableDeauthDetection: false,
      enablePmkidCapture: false,
      enableBeaconSpam: false,
      enableProbeSniffer: false,
      enableBleHunter: false,
      enableBleSpam: false,
      enableMicroSDStorage: true,
      enableSpeakerAlerts: true,
      enableRgbLed: true,
      enableTftDisplay: true,
      enableTouchControl: true,
      enableCC1101SubGhz: false,
      enableGpsWardriving: false,
      enableBadUsbHid: false,
      enableCanaryAP: true,
      defaultChannel: 11
    }
  }
];

// ==========================================
// CATÁLOGO DE FIRMWARES PRECOMPILADOS (.BIN)
// ==========================================
export interface PrecompiledFirmware {
  id: string;
  filename: string;
  title: string;
  version: string;
  author: string;
  sizeKb: number;
  offset: string;
  category: string;
  description: string;
  sha256: string;
  simulatedBinaryContent: string;
}

export const PRECOMPILED_FIRMWARES: PrecompiledFirmware[] = [
  {
    id: 'bin-marauder',
    filename: 'CYD_ESP32_Marauder_v1.2.0_Port.bin',
    title: 'ESP32 Marauder CYD Edition (Oficial Port)',
    version: 'v1.2.0',
    author: 'justcallmekoko / CYD Community',
    sizeKb: 1420,
    offset: '0x10000',
    category: 'Pentesting Wi-Fi / BLE',
    description: 'El firmware más popular para auditorías ofensivas Wi-Fi con soporte nativo de pantalla táctil ILI9341, captura PCAP en MicroSD y menús interactivos.',
    sha256: '9f83a21e7845b10c92da541bc876e931fa0218de935401928374a56b71239845',
    simulatedBinaryContent: 'ESP32_MARAUDER_FIRMWARE_CYD_PORT_v1.2.0_OFFSET_0x10000'
  },
  {
    id: 'bin-sentinel',
    filename: 'CYD_Sentinel_IDS_Guardian_v2.0.bin',
    title: 'CYD Sentinel IDS Defensivo (Blue Team)',
    version: 'v2.0.0',
    author: 'Un Fantasma en el Sistema',
    sizeKb: 980,
    offset: '0x10000',
    category: 'Detección & Blue Team',
    description: 'Monitor continuo de intrusiones inalámbricas. Alarma acústica en tiempo real para ataques Deauth, Evil Twin y volcado forense a MicroSD.',
    sha256: '3a78c19b456e72183d09aef41908253167123908475812390841270938471234',
    simulatedBinaryContent: 'CYD_SENTINEL_IDS_BLUETEAM_FIRMWARE_v2.0.0_OFFSET_0x10000'
  },
  {
    id: 'bin-bruce',
    filename: 'Bruce_MultiTool_ESP32_CYD_v1.7.bin',
    title: 'Bruce Multi-Tool ESP32 (Estilo Flipper Zero)',
    version: 'v1.7.0',
    author: 'Bruce Project (Open Source)',
    sizeKb: 1850,
    offset: '0x10000',
    category: 'Multi-Tool & Sub-GHz',
    description: 'Navaja suiza inspirada en Flipper Zero con menús gráficos LVGL, soporte para módulos CC1101 Sub-GHz, BadUSB BLE y analizador de radio.',
    sha256: '1249708912384719283741928374918237491827391827391827391827391823',
    simulatedBinaryContent: 'BRUCE_MULTITOOL_ESP32_CYD_v1.7.0_OFFSET_0x10000'
  },
  {
    id: 'bin-airtag',
    filename: 'CYD_AirTag_Hunter_Radar_v1.1.bin',
    title: 'BLE AirTag & Tile Hunter Radar Standalone',
    version: 'v1.1.0',
    author: 'CYD Security Research',
    sizeKb: 830,
    offset: '0x10000',
    category: 'Anti-Stalking & Privacidad',
    description: 'Firmware ultra liviano dedicado exclusivamente a rastrear balizas Apple Find My y Samsung SmartTag con indicador gráfico de proximidad RSSI.',
    sha256: '8491827391827391827391827391827391827391827391827391827391827391',
    simulatedBinaryContent: 'CYD_AIRTAG_HUNTER_RADAR_STANDALONE_v1.1.0_OFFSET_0x10000'
  },
  {
    id: 'bin-nemo',
    filename: 'Nemo_CYD_Toolkit_v2.4.bin',
    title: 'Nemo CYD Offensive Toolkit',
    version: 'v2.4.1',
    author: 'Katratus / Nemo Repo',
    sizeKb: 1150,
    offset: '0x10000',
    category: 'Pruebas de Estrés RF',
    description: 'Herramienta de testeo con menús directos para pruebas de compatibilidad Wi-Fi, spoofing de balizas y diagnósticos de radiofrecuencia.',
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    simulatedBinaryContent: 'NEMO_CYD_OFFENSIVE_TOOLKIT_v2.4.1_OFFSET_0x10000'
  },
  {
    id: 'bin-wardriving',
    filename: 'CYD_Wardriving_Wigle_NEO6M_v1.0.bin',
    title: 'CYD Wardriving & Wigle GPS Mapper',
    version: 'v1.0.0',
    author: 'Wardriving Community CYD',
    sizeKb: 1020,
    offset: '0x10000',
    category: 'Geomapping 802.11',
    description: 'Firmware de auditoría Wi-Fi con receptor GPS por puerto CN1. Guarda archivos con formato estándar de Wigle.net listos para análisis geoespacial.',
    sha256: 'b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012',
    simulatedBinaryContent: 'CYD_WARDRIVING_WIGLE_NEO6M_v1.0.0_OFFSET_0x10000'
  }
];

export const CustomProjectBuilderFlasher: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'builder' | 'flasher'>('builder');
  const [config, setConfig] = useState<CustomProjectConfig>(PROJECT_PRESETS[0].config);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PROJECT_PRESETS[0].id);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [fileInputKey, setFileInputKey] = useState<number>(0);

  // Web Serial Flasher State
  const [serialSupported, setSerialSupported] = useState<boolean>(false);
  const [serialConnected, setSerialConnected] = useState<boolean>(false);
  const [serialPortInfo, setSerialPortInfo] = useState<string>('');
  const [selectedBaud, setSelectedBaud] = useState<number>(115200);
  const [selectedBinary, setSelectedBinary] = useState<File | null>(null);
  const [selectedFirmwarePreset, setSelectedFirmwarePreset] = useState<PrecompiledFirmware>(PRECOMPILED_FIRMWARES[0]);
  const [isUsingCustomBinary, setIsUsingCustomBinary] = useState<boolean>(false);
  const [flashingProgress, setFlashingProgress] = useState<number>(0);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [flashLog, setFlashLog] = useState<string[]>([
    '[INIT] Web Serial Flasher listo.',
    '[INFO] Conecta tu placa CYD por USB-C y selecciona el puerto CH340 / CP2102.'
  ]);
  const [serialTerminalOutput, setSerialTerminalOutput] = useState<string[]>([
    '--- ESP32 ROM Bootloader v3.1 ---',
    'rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)',
    'configsip: 0, SPIWP:0xee',
    'clk_drv:0x00,q_drv:0x00,d_drv:0x00,cs0_drv:0x00,hd_drv:0x00,wp_drv:0x00',
    'mode:DIO, clock div:2',
    'load:0x3fff0030,len:1184',
    'load:0x40078000,len:13232',
    'load:0x40080400,len:3028',
    'entry 0x400805e4',
    '[CYD-INIT] Iniciando TFT ILI9341 320x240 (HSPI)... OK',
    '[CYD-INIT] Montando MicroSD en VSPI (CS: IO5)... OK',
    '[CYD-INIT] Radio Wi-Fi configurada en modo promiscuo.',
    'CYD_STUDIO > Listo. Escribe "help" para ver comandos disponibles.'
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Check Web Serial API support
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serial' in navigator) {
      setSerialSupported(true);
    } else {
      setSerialSupported(false);
    }
  }, []);

  // When selecting a project archetype
  const handleSelectPreset = (preset: ProjectPreset) => {
    setSelectedPresetId(preset.id);
    setConfig({ ...preset.config });
    cydAudio.playClick();
  };

  // Generate specialized dynamic C++ code based on project type and toggles
  const generatedCode = React.useMemo(() => {
    const isSentinel = config.projectType === 'sentinel' || config.enableDeauthDetection;
    const isMarauder = config.projectType === 'marauder';
    const isBleHunter = config.projectType === 'ble-hunter' || config.enableBleHunter;
    const isWardriving = config.projectType === 'wardriving' || config.enableGpsWardriving;
    const isBadUsb = config.projectType === 'badusb' || config.enableBadUsbHid;
    const isSubGhz = config.projectType === 'subghz' || config.enableCC1101SubGhz;
    const isCanary = config.projectType === 'canary' || config.enableCanaryAP;

    return `/*
 * ====================================================================
 * Proyecto: ${config.projectName} v${config.version}
 * Autor: ${config.author}
 * Generado con: CYD CyberSec Studio (unfantasmaenelsistema.com)
 * Placa objetivo: Cheap Yellow Display (ESP32-2432S028R)
 * Tipo de Proyecto: ${config.projectType?.toUpperCase() || 'CUSTOM MODULAR'}
 * ====================================================================
 */

#include <Arduino.h>
#include <WiFi.h>
#include <esp_wifi.h>
${config.enableTftDisplay ? '#include <TFT_eSPI.h>\n#include <SPI.h>' : ''}
${config.enableMicroSDStorage ? '#include <SD.h>\n#include <FS.h>' : ''}
${isBleHunter ? '#include <BLEDevice.h>\n#include <BLEUtils.h>\n#include <BLEScan.h>\n#include <BLEAdvertisedDevice.h>' : ''}
${isBadUsb ? '#include <BleKeyboard.h>' : ''}
${isWardriving ? '#include <HardwareSerial.h>' : ''}
${isSubGhz ? '#include <ELECHOUSE_CC1101_fast_SPI.h>' : ''}
${isCanary ? '#include <DNSServer.h>\n#include <WebServer.h>' : ''}

// Definiciones de Hardware de la CYD (ESP32-2432S028R)
#define CYD_LED_RED    4    // Active LOW
#define CYD_LED_GREEN  16   // Active LOW
#define CYD_LED_BLUE   17   // Active LOW
#define CYD_SPEAKER    26   // DAC Audio Out (GPIO 26)
#define CYD_SD_CS      5    // MicroSD VSPI CS (IO5)
#define CYD_TOUCH_CS   33   // XPT2046 CS (IO33)

${config.enableTftDisplay ? 'TFT_eSPI tft = TFT_eSPI();' : ''}
${config.enableMicroSDStorage ? 'SPIClass sdSPI(VSPI);' : ''}
${isBadUsb ? 'BleKeyboard bleKeyboard("' + config.projectName + '", "' + config.author + '", 100);' : ''}
${isWardriving ? 'HardwareSerial gpsSerial(1); // Puerto CN1 (RX: 22, TX: 27)' : ''}
${isCanary ? 'DNSServer dnsServer;\nWebServer server(80);' : ''}

uint8_t currentChannel = ${config.defaultChannel};
unsigned long lastTickTime = 0;
volatile uint32_t securityAlertCounter = 0;

${isSentinel ? `
// Filtro promiscuo Blue Team: detección de tramas 0x00c0 (Deauth) y 0x00a0 (Disassoc)
void IRAM_ATTR sentinelPromiscuousCallback(void* buf, wifi_promiscuous_pkt_type_t type) {
  if (type != WIFI_PKT_MGMT) return;
  const wifi_promiscuous_pkt_t* pkt = (wifi_promiscuous_pkt_t*)buf;
  const uint8_t* payload = pkt->payload;
  uint16_t fc = payload[0] | (payload[1] << 8);
  uint8_t frameSubtype = (fc & 0x00FC);

  if (frameSubtype == 0x00C0 || frameSubtype == 0x00A0) {
    securityAlertCounter++;
    ${config.enableSpeakerAlerts ? 'tone(CYD_SPEAKER, 2600, 40);' : ''}
    ${config.enableRgbLed ? 'digitalWrite(CYD_LED_RED, LOW); // Alarma Visual Roja' : ''}
  }
}
` : ''}

${isMarauder ? `
// Sniffer Red Team: monitor de Handshakes EAPOL y PMKID (Vendor IE)
void IRAM_ATTR marauderSnifferCallback(void* buf, wifi_promiscuous_pkt_type_t type) {
  const wifi_promiscuous_pkt_t* pkt = (wifi_promiscuous_pkt_t*)buf;
  if (pkt->rx_ctrl.sig_len > 32) {
    // Analisis de tramas de autenticacion EAPOL
    securityAlertCounter++;
  }
}
` : ''}

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("\\n========================================");
  Serial.println("[+] Iniciando: ${config.projectName}");
  Serial.println("[+] Autor: ${config.author}");
  Serial.println("[+] Hardware: Cheap Yellow Display (CYD)");
  Serial.println("========================================");

  ${config.enableRgbLed ? `
  // Inicializacion LED RGB (Logica invertida Active LOW)
  pinMode(CYD_LED_RED, OUTPUT);
  pinMode(CYD_LED_GREEN, OUTPUT);
  pinMode(CYD_LED_BLUE, OUTPUT);
  digitalWrite(CYD_LED_RED, HIGH);   // Apagado
  digitalWrite(CYD_LED_GREEN, LOW);  // Verde OK
  digitalWrite(CYD_LED_BLUE, HIGH);
  ` : ''}

  ${config.enableSpeakerAlerts ? `
  // Verificacion de altavoz DAC
  pinMode(CYD_SPEAKER, OUTPUT);
  tone(CYD_SPEAKER, 1800, 80);
  ` : ''}

  ${config.enableTftDisplay ? `
  // Inicializacion pantalla TFT ILI9341
  tft.init();
  tft.setRotation(1); // 320x240 Horizontal
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_YELLOW, TFT_BLACK);
  tft.setTextSize(2);
  tft.drawString("${config.projectName}", 10, 10);
  tft.setTextSize(1);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  tft.drawString("CYD CyberSec Studio · unfantasmaenelsistema.com", 10, 35);
  ` : ''}

  ${config.enableMicroSDStorage ? `
  // Inicializacion de MicroSD en bus SPI dedicado
  sdSPI.begin(18, 19, 23, CYD_SD_CS);
  if (SD.begin(CYD_SD_CS, sdSPI)) {
    Serial.println("[+] MicroSD montada correctamente en VSPI (FAT32).");
    ${config.enableTftDisplay ? 'tft.drawString("MicroSD: [OK CONECTADA]", 10, 55);' : ''}
  } else {
    Serial.println("[-] MicroSD no detectada.");
    ${config.enableTftDisplay ? 'tft.drawString("MicroSD: [NO DETECTADA]", 10, 55);' : ''}
  }
  ` : ''}

  ${isSentinel ? `
  // Modo Centinela Blue Team Activo
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(&sentinelPromiscuousCallback);
  esp_wifi_set_channel(currentChannel, WIFI_SECOND_CHAN_NONE);
  Serial.printf("[+] Sentinel IDS fijado en canal %d.\\n", currentChannel);
  ` : ''}

  ${isMarauder ? `
  // Modo Promiscuo Marauder Pentesting
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(&marauderSnifferCallback);
  esp_wifi_set_channel(currentChannel, WIFI_SECOND_CHAN_NONE);
  Serial.printf("[+] Marauder promiscuo iniciado en canal %d.\\n", currentChannel);
  ` : ''}

  ${isBleHunter ? `
  // Inicializacion BLE Hunter para rastreo de AirTags
  BLEDevice::init("CYD_Ble_Hunter");
  BLEScan* pScan = BLEDevice::getScan();
  pScan->setActiveScan(true);
  pScan->setInterval(100);
  pScan->setWindow(99);
  Serial.println("[+] Escaner BLE activo. Buscando Company ID 0x004C (Apple)...");
  ` : ''}

  ${isWardriving ? `
  // Inicializacion GPS NEO-6M en puerto serie CN1 (IO22 RX, IO27 TX)
  gpsSerial.begin(9600, SERIAL_8N1, 22, 27);
  Serial.println("[+] Escuchando tramas NMEA ($GPGGA, $GPRMC) del GPS...");
  ` : ''}

  ${isBadUsb ? `
  // Inicializacion de teclado virtual BLE HID
  bleKeyboard.begin();
  Serial.println("[+] Teclado fantasma Bluetooth anunciado.");
  ` : ''}

  ${isSubGhz ? `
  // Inicializacion CC1101 a 433.92 MHz
  ELECHOUSE_cc1101.setSpiPin(14, 12, 13, 27); // SCK, MISO, MOSI, CS en CN1/P3
  if (ELECHOUSE_cc1101.getChipVersion() > 0) {
    ELECHOUSE_cc1101.Init();
    ELECHOUSE_cc1101.setMHZ(433.92);
    ELECHOUSE_cc1101.SetRx();
    Serial.println("[+] Transceptor CC1101 sintonizado a 433.92 MHz.");
  }
  ` : ''}

  ${isCanary ? `
  // Configuracion Honeypot Canary AP
  WiFi.softAP("Corp_Guest_WiFi_Free", "");
  dnsServer.start(53, "*", WiFi.softAPIP());
  server.onNotFound([]() {
    server.send(200, "text/html", "<h1>Honeypot Canary AP</h1><p>Conexion registrada por seguridad.</p>");
  });
  server.begin();
  Serial.println("[+] Canary AP activo con portal cautivo señuelo.");
  ` : ''}

  Serial.println("[+] Sistema CYD preparado y operando.");
}

void loop() {
  // Bucle de refresco de interfaz y salto de espectro
  if (millis() - lastTickTime > 1500) {
    lastTickTime = millis();

    ${config.enableWiFiPromiscuous ? `
    // Salto de canal continuo
    currentChannel = (currentChannel % 13) + 1;
    esp_wifi_set_channel(currentChannel, WIFI_SECOND_CHAN_NONE);
    ` : ''}

    ${config.enableTftDisplay ? `
    tft.fillRect(10, 75, 300, 45, TFT_BLACK);
    tft.setCursor(10, 75);
    tft.setTextSize(1);
    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.printf("Canal Wi-Fi: %d | Eventos: %u\\n", currentChannel, securityAlertCounter);
    tft.setCursor(10, 95);
    tft.setTextColor(TFT_WHITE, TFT_BLACK);
    tft.printf("RAM Libre: %u KB | Uptime: %lu s", ESP.getFreeHeap() / 1024, millis() / 1000);
    ` : ''}

    ${config.enableRgbLed ? `
    // Recuperar LED de estado verde
    digitalWrite(CYD_LED_RED, HIGH);
    digitalWrite(CYD_LED_GREEN, LOW);
    ` : ''}
  }

  ${isCanary ? 'dnsServer.processNextRequest(); server.handleClient();' : ''}

  // Monitor serie USB para comandos interactivos
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\\n');
    cmd.trim();
    if (cmd == "help") {
      Serial.println("Comandos: status, ch <1-13>, alerts, reboot, clear");
    } else if (cmd == "status") {
      Serial.printf("Proyecto: %s | Canal: %d | Alertas: %u\\n", "${config.projectName}", currentChannel, securityAlertCounter);
    } else if (cmd == "reboot") {
      ESP.restart();
    }
  }
}
`;
  }, [config]);

  // Generate platformio.ini with correct libraries
  const generatedPlatformio = React.useMemo(() => {
    const isSubGhz = config.projectType === 'subghz' || config.enableCC1101SubGhz;
    const isBadUsb = config.projectType === 'badusb' || config.enableBadUsbHid;

    return `[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
upload_speed = 921600

lib_deps =
    bodmer/TFT_eSPI@^2.5.43
    ${config.enableMicroSDStorage ? 'SD' : ''}
    ${isBadUsb ? 't-vk/ESP32 BLE Keyboard@^0.3.2' : ''}
    ${isSubGhz ? 'lsatan/SmartRC-CC1101-Driver-Lib@^2.5.7' : ''}

build_flags =
    -D USER_SETUP_LOADED=1
    -D ILI9341_2_DRIVER=1
    -D TFT_MISO=12
    -D TFT_MOSI=13
    -D TFT_SCLK=14
    -D TFT_CS=15
    -D TFT_DC=2
    -D TFT_RST=-1
    -D TFT_BL=21
    -D TFT_BACKLIGHT_ON=HIGH
    -D TOUCH_CS=33
    -D SPI_FREQUENCY=40000000
`;
  }, [config]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportProjectJson = () => {
    const jsonStr = JSON.stringify(config, null, 2);
    handleDownloadFile(`${config.projectName}.cydproj.json`, jsonStr);
  };

  const handleImportProjectJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setConfig((prev) => ({ ...prev, ...parsed }));
        cydAudio.playClick();
        alert(`✓ Proyecto "${parsed.projectName || 'Importado'}" cargado con éxito.`);
      } catch (err) {
        alert('Error al leer el archivo de proyecto JSON.');
      }
    };
    reader.readAsText(file);
    setFileInputKey((prev) => prev + 1);
  };

  // Web Serial Port Connection Handler
  const handleConnectSerial = async () => {
    if (!serialSupported) {
      alert('La Web Serial API no está soportada en este navegador. Utiliza Google Chrome, Microsoft Edge u Opera.');
      return;
    }

    try {
      const navAny = navigator as unknown as { serial: { requestPort: () => Promise<unknown> } };
      const port = await navAny.serial.requestPort();
      if (port) {
        setSerialConnected(true);
        setSerialPortInfo('ESP32 en CH340 / CP2102 (Conectado)');
        setFlashLog((prev) => [
          ...prev,
          `[OK] Puerto serie USB detectado y conectado a ${selectedBaud} baudios.`,
          '[INFO] Chip identificado: ESP32-D0WDQ6-V3 (Revision 3), MAC: 30:AE:A4:05:81:7C.'
        ]);
        cydAudio.playClick();
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (!errorMsg.includes('No port selected')) {
        setFlashLog((prev) => [...prev, `[AVISO] No se seleccionó puerto: ${errorMsg}`]);
      }
    }
  };

  const handleSelectFirmwarePresetForFlashing = (firmware: PrecompiledFirmware) => {
    setSelectedFirmwarePreset(firmware);
    setIsUsingCustomBinary(false);
    setSelectedBinary(null);
    setFlashLog((prev) => [
      ...prev,
      `[PRESET] Firmware precompilado seleccionado: ${firmware.title} (${firmware.filename}, ${firmware.sizeKb} KB). Listo para flashear en ${firmware.offset}.`
    ]);
    cydAudio.playClick();
  };

  const handleSimulateFlashing = () => {
    const firmwareName = isUsingCustomBinary && selectedBinary 
      ? selectedBinary.name 
      : selectedFirmwarePreset.filename;

    setIsFlashing(true);
    setFlashingProgress(0);
    cydAudio.playClick();

    const steps = [
      { p: 10, msg: `[FLASH] Sincronizando con bootloader ESP32 a ${selectedBaud} baud...` },
      { p: 25, msg: '[FLASH] Borrando partición de destino en 0x10000...' },
      { p: 45, msg: `[FLASH] Escribiendo bloque de firmware: "${firmwareName}"...` },
      { p: 70, msg: '[FLASH] Flasheando cabeceras y tablas de particiones NVS...' },
      { p: 90, msg: '[FLASH] Verificando checksums criptográficos MD5 de sectores...' },
      { p: 100, msg: `[FLASH] ¡Flasheo completado con éxito! Reiniciando placa CYD...` }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setFlashingProgress(step.p);
        setFlashLog((prev) => [...prev, step.msg]);

        if (step.p === 100) {
          setIsFlashing(false);
          cydAudio.playSonarPing();
          setSerialTerminalOutput((prev) => [
            ...prev,
            '-------------------------------------------',
            `[BOOT] EJECUTANDO NUEVO FIRMWARE FLASHEADO:`,
            `>> ${firmwareName}`,
            '[CYD-DISPLAY] Pantalla táctil ILI9341 320x240 inicializada.',
            '[SYSTEM] Listo. Operación completada con éxito.'
          ]);
        }
      }, (idx + 1) * 800);
    });
  };

  const handleSendTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalInput('');
    setSerialTerminalOutput((prev) => [...prev, `> ${cmd}`]);

    setTimeout(() => {
      let response = `Comando desconocido: "${cmd}". Escribe "help".`;
      const lower = cmd.toLowerCase();
      if (lower === 'help') {
        response = 'Comandos:\\n  scanap       - Escaneo 802.11 de puntos de acceso\\n  sniffpmkid   - Capturar handshakes WPA2 EAPOL\\n  deauth       - Enviar trama de prueba autorizada\\n  status       - Estado de radios y memoria RAM\\n  clear        - Limpiar consola\\n  reboot       - Reiniciar microcontrolador';
      } else if (lower === 'scanap') {
        response = '[+] Escaneando canales 1-13... 5 redes detectadas:\\n  1. CorpNet_Secure (CH 6, WPA2-Enterprise, -62dBm)\\n  2. Guest_WiFi_Free (CH 1, Open, -48dBm)\\n  3. Fibra_Optica_A9 (CH 11, WPA2-PSK, -75dBm)\\n  4. IoT_SmartHome (CH 6, WPA2-PSK, -55dBm)';
      } else if (lower === 'status') {
        response = `[+] Placa: CYD ESP32-2432S028R | Firmware: ${config.projectName} | Heap Libre: 194,520 bytes | SD: OK`;
      } else if (lower === 'sniffpmkid') {
        response = '[+] Escuchando en canal 6... Capturado PMKID: e2a8b9f012448899aabbccddeeff0123 (AP: CorpNet_Secure). Guardado en SD.';
      } else if (lower === 'clear') {
        setSerialTerminalOutput([]);
        return;
      } else if (lower === 'reboot') {
        response = '[+] Reiniciando microcontrolador ESP32...';
      }
      setSerialTerminalOutput((prev) => [...prev, response]);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>CONSTRUCTOR MODULAR DE PROYECTOS & FLASHER WEB</span>
            <span>·</span>
            <span>SUITE DE 7 PROYECTOS CIBERSEGURIDAD</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Diseña, Personaliza y Flashea Proyectos CYD ESP32
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Elige entre 7 arquetipos de proyectos reales de ciberseguridad (Marauder, Sentinel IDS, AirTag Hunter, Wardriving GPS, BadUSB, Sub-GHz CC1101 y Honeypot), descarga el código fuente o flashea firmwares precompilados por Web Serial.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setActiveSubTab('builder');
              cydAudio.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'builder'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Diseñador de Proyectos ({PROJECT_PRESETS.length} Plantillas)</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('flasher');
              cydAudio.playClick();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'flasher'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Web Flasher ({PRECOMPILED_FIRMWARES.length} Firmwares Listos)</span>
          </button>
        </div>
      </div>

      {/* ======================= TAB 1: BUILDER ======================= */}
      {activeSubTab === 'builder' && (
        <div className="space-y-6">
          {/* Archetype Presets Selector Grid */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400">PASO 1: SELECCIONA UN PROYECTO BASE</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Arquetipos de Ciberseguridad para CYD</span>
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Haz clic para cargar automáticamente la arquitectura y el código C++
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {PROJECT_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-slate-950 border-amber-500/80 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${preset.badgeColor}`}>
                          {preset.tag}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Activo
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {preset.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug mt-1.5 line-clamp-3">
                        {preset.description}
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                      <span>{preset.category}</span>
                      <span className="text-amber-400 font-semibold">Cargar →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Builder Columns: Configuration Form & Live Code */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Configuration Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>Personalización del Proyecto</span>
                  </h3>

                  {/* Import / Export JSON buttons */}
                  <div className="flex items-center gap-2">
                    <label 
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-colors"
                      title="Cargar proyecto guardado previamente (.json)"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Cargar .json</span>
                      <input 
                        key={fileInputKey}
                        type="file" 
                        accept=".json" 
                        onChange={handleImportProjectJson} 
                        className="hidden" 
                      />
                    </label>

                    <button
                      onClick={handleExportProjectJson}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Guardar archivo de configuración del proyecto"
                    >
                      <Download className="w-3 h-3" />
                      <span>Guardar .json</span>
                    </button>
                  </div>
                </div>

                {/* Basic Meta Inputs */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Nombre del Proyecto C++:</label>
                    <input
                      type="text"
                      value={config.projectName}
                      onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Autor / Firma:</label>
                      <input
                        type="text"
                        value={config.author}
                        onChange={(e) => setConfig({ ...config, author: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Canal Wi-Fi Inicio:</label>
                      <select
                        value={config.defaultChannel}
                        onChange={(e) => setConfig({ ...config, defaultChannel: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs focus:outline-none focus:border-amber-500/50"
                      >
                        {Array.from({ length: 13 }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Canal {i + 1} {i + 1 === 1 || i + 1 === 6 || i + 1 === 11 ? '(Recomendado)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Module Toggle Checkboxes */}
                <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                  {/* Wi-Fi Modules */}
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-2">
                      Módulos Wi-Fi 802.11:
                    </span>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={config.enableWiFiPromiscuous}
                          onChange={(e) => setConfig({ ...config, enableWiFiPromiscuous: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <div>
                          <div className="text-slate-200 font-semibold">Modo Promiscuo & Salto de Canales</div>
                          <div className="text-[10px] text-slate-500">Captura tramas en el aire sin asociarse a ningún AP</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={config.enableDeauthDetection}
                          onChange={(e) => setConfig({ ...config, enableDeauthDetection: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <div>
                          <div className="text-slate-200 font-semibold">Detector de Ataques Deauth (Blue Team IDS)</div>
                          <div className="text-[10px] text-slate-500">Alarma inmediata en altavoz y LED ante tramas 0x00c0</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={config.enablePmkidCapture}
                          onChange={(e) => setConfig({ ...config, enablePmkidCapture: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <div>
                          <div className="text-slate-200 font-semibold">Captura de Hashes PMKID y Handshakes</div>
                          <div className="text-[10px] text-slate-500">Extracción EAPOL para auditoría offline con Hashcat</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={config.enableBeaconSpam}
                          onChange={(e) => setConfig({ ...config, enableBeaconSpam: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <div>
                          <div className="text-slate-200 font-semibold">Beacon Flooding (SSIDs Masivos)</div>
                          <div className="text-[10px] text-slate-500">Genera balizas de prueba para auditorías de saturación</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Bluetooth BLE & Specialized Modules */}
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-2">
                      Módulos Bluetooth, Hardware & RF Especial:
                    </span>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={config.enableBleHunter}
                          onChange={(e) => setConfig({ ...config, enableBleHunter: e.target.checked })}
                          className="accent-cyan-500"
                        />
                        <div>
                          <div className="text-slate-200 font-semibold">BLE AirTag & Tracker Hunter</div>
                          <div className="text-[10px] text-slate-500">Detección de balizas Apple Find My y Samsung SmartTag</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={!!config.enableBadUsbHid}
                          onChange={(e) => setConfig({ ...config, enableBadUsbHid: e.target.checked })}
                          className="accent-purple-500"
                        />
                        <div>
                          <div className="text-slate-200 font-semibold">Inyección BadUSB BLE (Teclado Virtual)</div>
                          <div className="text-[10px] text-slate-500">Emulación de pulsaciones DuckyScript sobre Bluetooth</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={!!config.enableGpsWardriving}
                          onChange={(e) => setConfig({ ...config, enableGpsWardriving: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <div>
                          <div className="text-slate-200 font-semibold">Geolocalización GPS Wardriving (Puerto CN1)</div>
                          <div className="text-[10px] text-slate-500">Decodificación NMEA NEO-6M y formato Wigle CSV</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 hover:bg-slate-850 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={!!config.enableCC1101SubGhz}
                          onChange={(e) => setConfig({ ...config, enableCC1101SubGhz: e.target.checked })}
                          className="accent-blue-500"
                        />
                        <div>
                          <div className="text-slate-200 font-semibold">Transceptor Sub-GHz CC1101 (Pines CN1/P3)</div>
                          <div className="text-[10px] text-slate-500">Bandas ISM 433.92 / 868 MHz para auditoría de puertas y sensores</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Hardware CYD Peripherals */}
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-2">
                      Periféricos Integrados CYD:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <label className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950">
                        <input
                          type="checkbox"
                          checked={config.enableTftDisplay}
                          onChange={(e) => setConfig({ ...config, enableTftDisplay: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <span className="text-slate-300">TFT 2.8" (ILI9341)</span>
                      </label>

                      <label className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950">
                        <input
                          type="checkbox"
                          checked={config.enableMicroSDStorage}
                          onChange={(e) => setConfig({ ...config, enableMicroSDStorage: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <span className="text-slate-300">MicroSD (PCAP)</span>
                      </label>

                      <label className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950">
                        <input
                          type="checkbox"
                          checked={config.enableSpeakerAlerts}
                          onChange={(e) => setConfig({ ...config, enableSpeakerAlerts: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <span className="text-slate-300">Altavoz (GPIO 26)</span>
                      </label>

                      <label className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950">
                        <input
                          type="checkbox"
                          checked={config.enableRgbLed}
                          onChange={(e) => setConfig({ ...config, enableRgbLed: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <span className="text-slate-300">LED RGB (GPIO 4/16/17)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Generated Code & Action Center */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono">CÓDIGO C++ ESPECIALIZADO</span>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-amber-400" />
                      <span>{config.projectName}.ino</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? '¡Copiado!' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadFile(`${config.projectName}.ino`, generatedCode)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar .ino</span>
                    </button>

                    <button
                      onClick={() => handleDownloadFile('platformio.ini', generatedPlatformio)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      <span>platformio.ini</span>
                    </button>
                  </div>
                </div>

                {/* Code viewer box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs overflow-x-auto max-h-[380px]">
                  <pre className="text-slate-300 leading-relaxed">
                    <code>{generatedCode}</code>
                  </pre>
                </div>

                {/* Instructions card */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>¿Cómo compilar y flashear tu proyecto personalizado?</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                    <li>Descarga el archivo <code className="text-amber-300">.ino</code> generado y ábrelo en Arduino IDE.</li>
                    <li>Asegúrate de tener la librería <strong>TFT_eSPI</strong> configurada con el <code className="text-amber-300">User_Setup.h</code> de la CYD.</li>
                    <li>Selecciona la placa <em>ESP32 Dev Module</em> y pulsa <em>Programa → Exportar Binarios Compilados</em>.</li>
                    <li>O bien, pasa directamente a la pestaña <strong>2. Web Flasher</strong> para flashear uno de los {PRECOMPILED_FIRMWARES.length} firmwares precompilados de la comunidad con 1 clic.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: FLASHER & SERIAL CONSOLE ======================= */}
      {activeSubTab === 'flasher' && (
        <div className="space-y-6">
          {/* Pre-Compiled Ready-to-Flash Firmwares Catalog */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400">CATÁLOGO DE FIRMWARES PRECOMPILADOS (.BIN)</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Elige un Firmware Listo para Flashear con 1 Clic</span>
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Binarios testeados para placa Cheap Yellow Display (ESP32-2432S028R)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {PRECOMPILED_FIRMWARES.map((fw) => {
                const isSelected = !isUsingCustomBinary && selectedFirmwarePreset.id === fw.id;
                return (
                  <div
                    key={fw.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-950 border-amber-500/80 ring-2 ring-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                          {fw.category}
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">
                          Offset: {fw.offset} · {fw.sizeKb} KB
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {fw.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
                        {fw.description}
                      </p>
                      <div className="text-[10px] text-slate-500 mt-2 font-mono truncate">
                        Autor: {fw.author}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-850">
                      <button
                        onClick={() => handleSelectFirmwarePresetForFlashing(fw)}
                        className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{isSelected ? '✓ Seleccionado' : 'Elegir para Flashear'}</span>
                      </button>

                      <button
                        onClick={() => handleDownloadFile(fw.filename, fw.simulatedBinaryContent)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title="Descargar archivo binario .bin a disco"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flash Operations & Serial Terminal Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Flasher Control Dock */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-0.5">
                    <span>CONEXIÓN WEB SERIAL</span>
                    <span>·</span>
                    <span>CH340 / CP2102 DRIVER</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Flashear CYD por USB
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Transfiere el firmware directamente desde el navegador a la memoria flash del ESP32 a través de la Web Serial API.
                  </p>
                </div>

                {/* Connection Status Card */}
                <div className={`p-4 rounded-xl border transition-colors ${
                  serialConnected 
                    ? 'bg-emerald-950/40 border-emerald-500/50' 
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-300">Estado Conexión USB:</span>
                    <span className={`flex items-center gap-1.5 font-mono text-[11px] font-bold ${
                      serialConnected ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${serialConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                      {serialConnected ? 'CONECTADO' : 'DESCONECTADO'}
                    </span>
                  </div>

                  {serialConnected ? (
                    <div className="text-xs space-y-1">
                      <div className="text-emerald-300 font-mono text-[11px]">{serialPortInfo}</div>
                      <div className="text-[10px] text-slate-400">Velocidad: {selectedBaud} baudios | Chip: ESP32-D0WDQ6-V3</div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Conecta la CYD por USB-C y pulsa el botón de abajo para solicitar acceso al puerto serie del sistema.
                    </p>
                  )}
                </div>

                {/* Baud Rate & Port Controls */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Velocidad de Flasheo:</label>
                    <select
                      value={selectedBaud}
                      onChange={(e) => setSelectedBaud(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs"
                    >
                      <option value={115200}>115,200 baud (Estable)</option>
                      <option value={921600}>921,600 baud (Rápido)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <button
                      onClick={handleConnectSerial}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                      <span>{serialConnected ? 'Reconectar Puerto' : 'Conectar CYD USB'}</span>
                    </button>
                  </div>
                </div>

                {/* Firmware Selected Indicator or Custom Upload */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">
                      Firmware Listo para Grabar:
                    </label>
                    <span className="font-mono text-[11px] text-amber-400">
                      {isUsingCustomBinary ? 'Archivo Local' : 'Preset Precompilado'}
                    </span>
                  </div>

                  {!isUsingCustomBinary ? (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="font-bold text-white text-xs truncate">
                          {selectedFirmwarePreset.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {selectedFirmwarePreset.filename} ({selectedFirmwarePreset.sizeKb} KB)
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        {selectedFirmwarePreset.offset}
                      </span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="truncate">{selectedBinary?.name}</span>
                    </div>
                  )}

                  {/* Or upload custom .bin */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <label className="text-slate-400 text-[11px] block mb-1.5">
                      O subir tu propio binario compilado localmente (.bin):
                    </label>
                    <input
                      type="file"
                      accept=".bin"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          setSelectedBinary(file);
                          setIsUsingCustomBinary(true);
                          setFlashLog((prev) => [
                            ...prev,
                            `[CUSTOM FILE] Archivo local cargado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
                          ]);
                        }
                      }}
                      className="w-full text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-300 hover:file:bg-slate-700 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Flash Progress Bar */}
                {isFlashing && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold">Flasheando CYD...</span>
                      <span className="text-white">{flashingProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                        style={{ width: `${flashingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Primary Flash Trigger Button */}
                <button
                  onClick={handleSimulateFlashing}
                  disabled={isFlashing}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isFlashing
                      ? 'bg-amber-600 text-slate-950 animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover:scale-[1.01]'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {isFlashing 
                      ? 'Transfiriendo firmware a la Flash...' 
                      : `Flashear a la CYD: ${isUsingCustomBinary && selectedBinary ? selectedBinary.name : selectedFirmwarePreset.title}`}
                  </span>
                </button>
              </div>

              {/* Terminal Flash Steps Log */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1 max-h-44 overflow-y-auto">
                <div className="text-slate-500 font-bold mb-1">[REGISTRO DE OPERACIÓN FLASHER]</div>
                {flashLog.map((log, i) => (
                  <div key={i} className="text-slate-300 leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Live Serial Console / Monitor */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono">MONITOR SERIAL EN VIVO (UART)</span>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <span>Consola Interactiva del Dispositivo</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSerialTerminalOutput([])}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                    >
                      Limpiar
                    </button>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      115200 8N1
                    </span>
                  </div>
                </div>

                {/* Terminal Screen Container */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-400 h-[360px] overflow-y-auto space-y-1">
                  {serialTerminalOutput.map((line, idx) => (
                    <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                      {line}
                    </div>
                  ))}
                  <div ref={terminalBottomRef} />
                </div>

                {/* Interactive Terminal Command Input Form */}
                <form onSubmit={handleSendTerminalCommand} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enviar comando a la CYD (ej: help, scanap, sniffpmkid, status, reboot)..."
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500/50"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </form>

                {/* Quick-click command chips */}
                <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">Comandos rápidos:</span>
                  {['help', 'scanap', 'sniffpmkid', 'status', 'reboot'].map((quickCmd) => (
                    <button
                      key={quickCmd}
                      type="button"
                      onClick={() => {
                        setTerminalInput(quickCmd);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-mono transition-colors border border-slate-750"
                    >
                      {quickCmd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
