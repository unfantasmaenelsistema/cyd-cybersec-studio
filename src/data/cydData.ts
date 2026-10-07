import { HardwarePin, UseCase, FirmwareTemplate, CommunityFirmware } from '../types';

export const CYD_PINS: HardwarePin[] = [
  // Display pins (ILI9341 - HSPI)
  { gpio: 14, label: 'TFT_SCLK', category: 'display', protocol: 'SPI', description: 'Reloj SPI de la pantalla LCD ILI9341' },
  { gpio: 13, label: 'TFT_MOSI', category: 'display', protocol: 'SPI', description: 'Línea de datos MOSI hacia pantalla' },
  { gpio: 12, label: 'TFT_MISO', category: 'display', protocol: 'SPI', description: 'Línea MISO de pantalla (a menudo no conectada a nivel lógico)' },
  { gpio: 15, label: 'TFT_CS', category: 'display', protocol: 'GPIO/SPI', description: 'Chip Select para la pantalla LCD ILI9341' },
  { gpio: 2, label: 'TFT_DC / RS', category: 'display', protocol: 'GPIO', description: 'Data / Command selector para la pantalla' },
  { gpio: 21, label: 'TFT_BL', category: 'display', protocol: 'PWM/GPIO', description: 'Retroiluminación (Backlight). Controlable vía PWM para brillo' },

  // Touch pins (XPT2046)
  { gpio: 25, label: 'TOUCH_CLK', category: 'touch', protocol: 'SPI', description: 'Reloj SPI dedicado para controlador táctil XPT2046' },
  { gpio: 32, label: 'TOUCH_MOSI', category: 'touch', protocol: 'SPI', description: 'Datos MOSI hacia controlador táctil' },
  { gpio: 39, label: 'TOUCH_MISO', category: 'touch', protocol: 'SPI (Input Only)', description: 'Datos MISO de respuesta táctil (GPIO 39 es Input-Only en ESP32)' },
  { gpio: 33, label: 'TOUCH_CS', category: 'touch', protocol: 'GPIO/SPI', description: 'Chip Select del panel táctil resistivo' },
  { gpio: 36, label: 'TOUCH_IRQ', category: 'touch', protocol: 'Interrupt (Input Only)', description: 'Interrupción cuando se detecta presión en pantalla' },

  // MicroSD Slot (VSPI)
  { gpio: 18, label: 'SD_SCK', category: 'sd', protocol: 'SPI', description: 'Reloj SPI para lector de tarjeta MicroSD' },
  { gpio: 19, label: 'SD_MISO', category: 'sd', protocol: 'SPI', description: 'Línea MISO de la tarjeta MicroSD' },
  { gpio: 23, label: 'SD_MOSI', category: 'sd', protocol: 'SPI', description: 'Línea MOSI de la tarjeta MicroSD' },
  { gpio: 5, label: 'SD_CS', category: 'sd', protocol: 'GPIO/SPI', description: 'Chip Select para MicroSD (usar CS en LOW)' },

  // Onboard Peripherals
  { gpio: 4, label: 'RGB_LED_RED', category: 'peripherals', protocol: 'GPIO/PWM', description: 'LED RGB Canal Rojo', notes: 'Lógica invertida (Active LOW): LOW = Encendido, HIGH = Apagado' },
  { gpio: 16, label: 'RGB_LED_GREEN', category: 'peripherals', protocol: 'GPIO/PWM', description: 'LED RGB Canal Verde', notes: 'Lógica invertida (Active LOW)' },
  { gpio: 17, label: 'RGB_LED_BLUE', category: 'peripherals', protocol: 'GPIO/PWM', description: 'LED RGB Canal Azul', notes: 'Lógica invertida (Active LOW)' },
  { gpio: 34, label: 'LDR_LIGHT', category: 'peripherals', protocol: 'ADC (Input Only)', description: 'Fotorresistor LDR para medir luz ambiental' },
  { gpio: 26, label: 'SPEAKER_DAC', category: 'peripherals', protocol: 'DAC / Audio', description: 'Altavoz integrado con amplificador PAM8302A (Alertas sonoras y beeps)' },

  // Expansion Port CN1 / P3 (Available GPIOs for Sub-GHz, GPS, etc.)
  { gpio: 35, label: 'EXT_IO35', category: 'expansion', protocol: 'Input Only', description: 'Pin analógico/digital disponible en conector P3 (Solo entrada)', notes: 'Ideal para sensores o entradas de pulsos' },
  { gpio: 22, label: 'EXT_IO22', category: 'expansion', protocol: 'I2C SCL / GPIO', description: 'Pin bidireccional I2C / GPIO en conector CN1', notes: 'Perfecto para módulo CC1101, NRF24 o GPS' },
  { gpio: 27, label: 'EXT_IO27', category: 'expansion', protocol: 'I2C SDA / GPIO', description: 'Pin bidireccional I2C / GPIO en conector CN1', notes: 'Excelente para conectar buses externos' },
  { gpio: 1, label: 'UART0_TX', category: 'expansion', protocol: 'UART', description: 'Transmisión Serial USB (Programación y telemetría)' },
  { gpio: 3, label: 'UART0_RX', category: 'expansion', protocol: 'UART', description: 'Recepción Serial USB (Programación y telemetría)' },
];

export const USE_CASES: UseCase[] = [
  {
    id: 'wifi-ids-sentinel',
    title: 'CYD Sentinel: Sistema IDS Detector de Ataques Wi-Fi',
    team: 'blue',
    category: 'Defensa de Redes & Detección',
    summary: 'Monitor pasivo de escritorio que alerta visualmente en la pantalla y con sonido ante ataques de desautenticación o Evil Twin.',
    description: 'El ESP32 se coloca en modo promiscuo escuchando tramas de administración 802.11 (tipo 0x00c0 y 0x00a0). Si un atacante lanza un Deauth Flood con Aircrack-ng, Flipper Zero o Marauder para forzar la reconexión de clientes y capturar el 4-way handshake, la CYD tiñe su pantalla de rojo, emite pitidos con el altavoz integrado y muestra la dirección MAC atacante y el BSSID objetivo.',
    hardwareNeeded: ['Placa CYD ESP32-2432S028R', 'Cable USB de alimentación', 'Opcional: Batería LiPo 3.7V'],
    firmwareRecommended: 'CYD Wi-Fi Sentinel IDS (Código propio o fork Marauder)',
    cydFeaturesUsed: ['Pantalla 2.8" TFT (alertas visuales)', 'Altavoz integrado GPIO 26 (alarma sonora)', 'LED RGB GPIO 4/16/17 (parpadeo de emergencia)', 'Wi-Fi Promiscuous Mode'],
    howItWorks: 'Configura la radio Wi-Fi en esp_wifi_set_promiscuous(true) y procesa las tramas raw en un callback. Filtra subtipos de tramas de desautenticación y disociación. Calcula una ventana deslizante de frecuencia para evitar falsos positivos.',
    defenseMitigation: 'Habilitar 802.11w (Protected Management Frames - PMF) en el router Wi-Fi en modo requerido u opcional, impidiendo que terceros forjen tramas de desautenticación.',
    dangerLevel: 'Bajo',
    difficulty: 'Principiante'
  },
  {
    id: 'esp32-marauder-cyd',
    title: 'Auditoría Wi-Fi Móvil con ESP32 Marauder CYD',
    team: 'red',
    category: 'Pentesting Inalámbrico',
    summary: 'Suite completa de auditoría 802.11 táctil: escaneo de redes, beacon flooding, captura de PMKID y wardriving con GPS.',
    description: 'Adaptación del proyecto insignia de ciberseguridad ESP32 Marauder a la pantalla táctil de la CYD. Permite realizar auditorías autorizadas sobre puntos de acceso: descubrir redes ocultas, analizar canales congestionados, monitorear peticiones de sondeo (probe requests) de dispositivos cercanos y capturar hashes PMKID para auditar la fortaleza de contraseñas WPA2.',
    hardwareNeeded: ['Placa CYD', 'Tarjeta MicroSD (FAT32) para guardar PCAPs', 'Opcional: Módulo GPS NEO-6M en puerto serial'],
    firmwareRecommended: 'ESP32 Marauder CYD (Puerto de smoochiee / justcallmekoko)',
    cydFeaturesUsed: ['Touch XPT2046 para navegación completa', 'MicroSD para exportar logs en formato Wireshark .pcap', 'Pantalla TFT a color con interfaz tipo terminal'],
    howItWorks: 'Utiliza el SDK de Espressif para forzar el canal y capturar paquetes EAPOL (handshake WPA) o tramas beacon. Guarda los paquetes brutos directamente en la microSD para abrirlos luego con Wireshark o Hashcat.',
    defenseMitigation: 'Utilizar contraseñas WPA2/WPA3 de más de 16 caracteres aleatorios, deshabilitar WPS y monitorizar redes con un IDS como CYD Sentinel.',
    dangerLevel: 'Alto',
    difficulty: 'Intermedio'
  },
  {
    id: 'bruce-multitool-rf',
    title: 'Estación Multi-Herramienta RF y Sub-GHz (Estilo Flipper)',
    team: 'purple',
    category: 'Hardware Hacking & Radiofrecuencia',
    summary: 'Convierte la CYD en un centro de auditoría portátil añadiendo un módulo CC1101 de 433/868 MHz mediante los puertos de expansión.',
    description: 'El firmware Bruce transforma la CYD en un potente dispositivo estilo Flipper Zero pero de código abierto y coste reducido (< 15€). Al conectar un transceptor Sub-GHz CC1101 en los pines de expansión libres (CN1), puedes analizar señales de radiofrecuencia (mandos de garaje con código fijo, sensores meteorológicos ISM, Keeloq análisis) además de Wi-Fi, BLE y BadUSB.',
    hardwareNeeded: ['Placa CYD', 'Módulo CC1101 (SPI)', 'Cables Dupont hembra-hembra', 'Tarjeta MicroSD'],
    firmwareRecommended: 'Bruce Firmware (pradoman / Bruce-Firmware)',
    cydFeaturesUsed: ['Puertos CN1/P3 (conexión SPI externa)', 'Pantalla táctil y UI basada en LVGL', 'Lector MicroSD para almacenar capturas Sub-GHz (.sub)'],
    howItWorks: 'El CC1101 demodula modulaciones ASK/OOK/2-FSK en bandas ISM (315, 433, 868 MHz). Bruce permite grabar la señal de radio bruta y reproducirla o analizar los pulsos de sincronización y datos binarios.',
    defenseMitigation: 'Migrar mandos y sistemas inalámbricos a rolling codes con cifrado criptográfico moderno (AES-128) y evitar dispositivos de código fijo no autenticado.',
    dangerLevel: 'Alto',
    difficulty: 'Avanzado'
  },
  {
    id: 'airtag-ble-detector',
    title: 'Detector Anti-Rastreo BLE (AirTag, SmartTag & Tile Hunter)',
    team: 'blue',
    category: 'Privacidad & OPSEC',
    summary: 'Escáner continuo de balizas Bluetooth Low Energy no deseadas que viajan con el usuario, alertando de posibles rastreos ilegales.',
    description: 'Los dispositivos como Apple AirTag o Samsung SmartTag emiten anuncios BLE periódicos usando direcciones MAC rotativas pero con identificadores de servicio específicos (ej: Company ID 0x004C con prefijo de datos 0x12 para Apple Find My). La CYD analiza el tráfico BLE circundante, calcula la persistencia del dispositivo en el tiempo y muestra una barra de proximidad RSSI con alerta vibratoria o sonora si una baliza te sigue.',
    hardwareNeeded: ['Placa CYD', 'Powerbank pequeña o carcasa con batería'],
    firmwareRecommended: 'CYD BLE Hunter / Custom BLE Scanner',
    cydFeaturesUsed: ['Radio Bluetooth BLE del ESP32', 'Pantalla TFT para ver RSSI y fabricante', 'LED RGB para indicar cercanía (Verde -> Amarillo -> Rojo)'],
    howItWorks: 'Inicia un BLEScan en modo continuo. Decodifica los paquetes de anuncio (Advertisement Data), extrae el campo Manufacturer Specific Data y compara patrones contra bases de datos de trackers conocidos.',
    defenseMitigation: 'Herramienta de defensa personal y contramedida para auditorías de seguridad física y protección de ejecutivos / periodistas frente a espionaje físico.',
    dangerLevel: 'Bajo',
    difficulty: 'Principiante'
  },
  {
    id: 'iot-canary-honeypot',
    title: 'CYD Canary: Honeypot Físico IoT para Redes Corporativas',
    team: 'blue',
    category: 'Detección de Intrusos Internos',
    summary: 'Un señuelo físico de bajo coste conectado a la red que simula un PLC Modbus o cámara IP vulnerable para cazar atacantes en movimiento lateral.',
    description: 'En una red empresarial o doméstica, este dispositivo actúa como "canario en la mina de carbón". Expone puertos típicos de IoT (puerto 80 con login web falso, puerto 23 Telnet, puerto 502 Modbus). Ningún usuario legítimo debería conectarse jamás a esta IP. En el momento en que un atacante ejecuta un escaneo con Nmap o intenta credenciales por defecto, la CYD emite alarma acústica en la oficina y envía un Webhook seguro a Slack/Telegram/SIEM.',
    hardwareNeeded: ['Placa CYD', 'Conexión Wi-Fi a la VLAN objetivo'],
    firmwareRecommended: 'CYD IoT Canary (Código Arduino ESP32)',
    cydFeaturesUsed: ['Stack TCP/IP Wi-Fi', 'Pantalla TFT con dashboard de intentos de intrusión', 'Altavoz para alerta inmediata in situ'],
    howItWorks: 'Abre sockets TCP en puertos trampa. Al recibir un SYN o conexión, registra la IP de origen, registra los comandos tecleados en el login señuelo y dispara la alerta antes de que el intruso comprometa activos reales.',
    defenseMitigation: 'Estrategia defensiva de engaño cibernético (Deception Technology). Permite detectar ataques dirigidos con tasa cero de falsos positivos.',
    dangerLevel: 'Bajo',
    difficulty: 'Intermedio'
  },
  {
    id: 'ble-spammer-audit',
    title: 'Auditoría de Resiliencia BLE (Spam Flood Stress Testing)',
    team: 'red',
    category: 'Auditoría BLE & DoS Local',
    summary: 'Evaluación del impacto de tramas BLE masivas (Apple Action Modals, Android Fast Pair, Windows Swift Pair) en entornos críticos.',
    description: 'Ataque que envía ráfagas de paquetes de anuncio BLE falsificados con identificadores de emparejamiento rápido. Provoca que teléfonos iOS, Android y portátiles Windows muestren constantes ventanas emergentes de emparejamiento, pudiendo causar congelamiento de interfaz o denegación de servicio temporal (DoS). Se utiliza en pentesting para evaluar la política de Bluetooth en salas seguras o quirófanos.',
    hardwareNeeded: ['Placa CYD'],
    firmwareRecommended: 'Bruce Firmware / Nemo Firmware / ESP32-Sour-Apple',
    cydFeaturesUsed: ['BLE Advertising Engine', 'Interfaz táctil para seleccionar objetivos (iOS, Android, Windows)'],
    howItWorks: 'Genera tramas de anuncio de tipo ADV_IND con payloads específicos (ej: AirDrop, AirPods Pro transfer modal). No requiere emparejamiento previo porque se aprovecha de la fase de descubrimiento.',
    defenseMitigation: 'Desactivar Bluetooth en el Centro de Control real (Ajustes de sistema, no solo botón rápido) o mantener el sistema operativo actualizado con los parches de mitigación de Apple/Google/Microsoft.',
    dangerLevel: 'Medio',
    difficulty: 'Principiante'
  },
  {
    id: 'hardware-totp-2fa',
    title: 'Autenticador Hardware 2FA / TOTP Air-Gapped',
    team: 'blue',
    category: 'Criptografía & Hardening',
    summary: 'Generador de códigos de verificación de doble factor 100% offline y seguro, inmune a malware en PCs o teléfonos móviles.',
    description: 'Convierte la CYD en un token de seguridad hardware físico (estilo YubiKey con pantalla). Almacena las claves secretas TOTP en la memoria no volátil cifrada (NVS) del ESP32. Protegido por un PIN numérico en la pantalla táctil. No tiene conexión Wi-Fi activa durante el uso diario, eliminando la superficie de ataque por red.',
    hardwareNeeded: ['Placa CYD', 'Módulo RTC DS3231 (opcional para precisión de reloj sin internet)'],
    firmwareRecommended: 'CYD TOTP Authenticator',
    cydFeaturesUsed: ['Pantalla táctil para teclado PIN numérico', 'Criptografía SHA-1 / HMAC por hardware en ESP32', 'Almacenamiento seguro NVS'],
    howItWorks: 'Calcula HMAC-SHA1(K, T) donde K es la clave base32 y T es el paso temporal Unix de 30 segundos. Muestra el código de 6 dígitos en la pantalla TFT con barra de cuenta regresiva.',
    defenseMitigation: 'Solución defensiva de alta seguridad contra phishing de credenciales y SIM Swapping.',
    dangerLevel: 'Bajo',
    difficulty: 'Intermedio'
  }
];

export const COMMUNITY_FIRMWARES: CommunityFirmware[] = [
  {
    name: 'Bruce Firmware',
    author: 'pradoman & comunidad',
    repoUrl: 'https://github.com/pradoman/Bruce',
    description: 'El firmware más completo e interactivo estilo "Flipper Zero" para la CYD. Incluye interfaz gráfica táctil LVGL completa, herramientas de Wi-Fi, BLE, Sub-GHz con CC1101, BadUSB, escáneres y reproducción de archivos.',
    highlights: [
      'Soporte nativo para pantalla táctil ILI9341 + XPT2046',
      'Módulo Sub-GHz CC1101 en pines libres',
      'BLE Spam (Apple, Android, Windows)',
      'Wi-Fi Sniffer, Deauth, Beacon Spam',
      'BadUSB vía Bluetooth LE HID',
      'Lector de tarjetas MicroSD con explorador de archivos'
    ],
    requirements: ['CYD ESP32-2432S028R', 'MicroSD recomendada', 'Opcional: CC1101 para RF'],
    flashCommand: 'esptool.py --chip esp32 --port /dev/ttyUSB0 --baud 921600 write_flash 0x0 bruce-cyd.bin',
    category: 'Multi-Herramienta Integral'
  },
  {
    name: 'ESP32 Marauder (CYD Port)',
    author: 'smoochiee / justcallmekoko',
    repoUrl: 'https://github.com/smoochiee/ESP32-Marauder-Cheap-Yellow-Display',
    description: 'La versión adaptada del proyecto rey de pentesting Wi-Fi/BLE ESP32 Marauder específicamente para la Cheap Yellow Display. Permite capturar handshakes, analizar espectro y guardar tráfico en formato PCAP.',
    highlights: [
      'Captura de PMKID y handshakes EAPOL directo a microSD',
      'Detector de tramas de desautenticación en tiempo real',
      'Monitoreo de peticiones de sondeo (Probe Requests)',
      'Interfaz gráfica con teclado virtual táctil',
      'Soporte de GPS serial para wardriving'
    ],
    requirements: ['CYD ESP32-2432S028R', 'Tarjeta MicroSD formateada en FAT32'],
    flashCommand: 'esptool.py --chip esp32 --port /dev/ttyUSB0 --baud 921600 write_flash 0x1000 esp32_marauder_cyd.bin',
    category: 'Pentesting Wi-Fi & BLE'
  },
  {
    name: 'Nemo CYD',
    author: 'Cathedrow / Nemo Community',
    repoUrl: 'https://github.com/Cathedrow/Nemo',
    description: 'Firmware ofensivo y defensivo con una estética cyberpunk retro, optimizado para pruebas rápidas de BLE y Wi-Fi en eventos y conferencias de seguridad.',
    highlights: [
      'Interfaz retro monocromática de alto contraste',
      'Ataques rápidos de denegación de servicio BLE',
      'Generador de balizas Wi-Fi masivas (Rickroll beacons)',
      'Bajo consumo de memoria RAM'
    ],
    requirements: ['CYD ESP32-2432S028R'],
    flashCommand: 'esptool.py --chip esp32 --port /dev/ttyUSB0 write_flash 0x0 nemo_cyd.bin',
    category: 'Herramienta Ofensiva Ligera'
  }
];

export const FIRMWARE_TEMPLATES: FirmwareTemplate[] = [
  {
    id: 'wifi-deauth-ids',
    title: 'CYD Wi-Fi Deauth IDS (Detector de Ataques)',
    category: 'Blue Team / Alerta Temprana',
    description: 'Código C++ para Arduino IDE / PlatformIO que pone la CYD en modo promiscuo, detecta paquetes 802.11 de desautenticación, hace parpadear el LED RGB en rojo y emite alarma sonora con el altavoz.',
    filename: 'CYD_WiFi_Deauth_IDS.ino',
    libraries: ['TFT_eSPI (por Bodmer)', 'esp_wifi.h (incluido en ESP32 Core)'],
    setupInstructions: [
      'Instala la librería "TFT_eSPI" desde el gestor de librerías de Arduino IDE.',
      'IMPORTANTE: Copia el archivo User_Setup.h incluido abajo en la carpeta Arduino/libraries/TFT_eSPI/User_Setup.h para que la pantalla de la CYD funcione.',
      'Conecta la placa CYD mediante el puerto micro-USB o USB-C inferior (asegúrate de que el cable tenga líneas de datos, no solo carga).',
      'Selecciona la placa "ESP32 Dev Module" en Herramientas -> Placa.',
      'Sube el sketch a 115200 o 921600 baudios.'
    ],
    code: `/*
 * ====================================================================
 * CYD Wi-Fi Sentinel IDS - Detector de Ataques de Desautenticación
 * Placa: Cheap Yellow Display (ESP32-2432S028R)
 * ====================================================================
 * Escucha tramas 802.11 de administración en modo promiscuo.
 * Si detecta una ráfaga de paquetes Deauth (subtipo 0x00c0), activa:
 *  - Pantalla TFT en rojo con detalles del atacante y víctima
 *  - Alarma sonora con altavoz integrado (GPIO 26)
 *  - Parpadeo de LED RGB en rojo (GPIO 4 - Lógica Invertida)
 */

#include <Arduino.h>
#include <WiFi.h>
#include <esp_wifi.h>
#include <TFT_eSPI.h>
#include <SPI.h>

// Definición de pines específicos de la CYD
#define CYD_LED_RED   4   // LED RGB Canal Rojo (Active LOW)
#define CYD_LED_GREEN 16  // LED RGB Canal Verde (Active LOW)
#define CYD_LED_BLUE  17  // LED RGB Canal Azul (Active LOW)
#define CYD_SPEAKER   26  // Altavoz integrado (DAC / Tono)

TFT_eSPI tft = TFT_eSPI();

// Estructura de cabecera IEEE 802.11 mínima
struct MacHeader {
  uint16_t frame_control;
  uint16_t duration;
  uint8_t  addr1[6]; // Receptor
  uint8_t  addr2[6]; // Transmisor (Atacante / AP)
  uint8_t  addr3[6]; // BSSID
  uint16_t seq_ctrl;
};

volatile uint32_t deauthCount = 0;
volatile uint32_t totalPackets = 0;
volatile bool attackAlert = false;
uint8_t lastAttacker[6] = {0};
uint8_t lastVictim[6]   = {0};
uint8_t currentChannel  = 1;
unsigned long lastHopTime = 0;
unsigned long lastAlertReset = 0;

// Callback de modo promiscuo en el ESP32
void wifiPromiscuousCallback(void* buf, wifi_promiscuous_pkt_type_t type) {
  if (type != WIFI_PKT_MGMT) return;

  const wifi_promiscuous_pkt_t* pkt = (wifi_promiscuous_pkt_t*)buf;
  const uint8_t* payload = pkt->payload;
  totalPackets++;

  // Subtipo de trama 802.11: 0x00c0 = Deauthentication, 0x00a0 = Disassociation
  uint16_t frameControl = payload[0] | (payload[1] << 8);
  uint8_t frameType = (frameControl & 0x00FC);

  if (frameType == 0x00C0 || frameType == 0x00A0) {
    deauthCount++;
    attackAlert = true;
    
    // Extraer direcciones MAC
    memcpy(lastVictim,   &payload[4],  6);
    memcpy(lastAttacker, &payload[10], 6);
  }
}

void soundAlarm() {
  // Beep de alarma en altavoz GPIO 26
  for (int i = 0; i < 3; i++) {
    tone(CYD_SPEAKER, 2400, 70);
    delay(80);
    tone(CYD_SPEAKER, 1800, 70);
    delay(80);
  }
}

void drawNormalUI() {
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_GREEN, TFT_BLACK);
  tft.setTextSize(2);
  tft.setCursor(10, 10);
  tft.println("CYD SENTINEL IDS");
  
  tft.setTextSize(1);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  tft.drawFastHLine(10, 32, 300, TFT_DARKGREY);
  
  tft.setCursor(10, 45);
  tft.printf("Estado: MONITORIZANDO (Ch: %d)\\n", currentChannel);
  tft.setCursor(10, 65);
  tft.printf("Paquetes totales: %u\\n", totalPackets);
  tft.setCursor(10, 85);
  tft.printf("Deauths detectados: %u\\n", deauthCount);
  
  tft.drawRect(10, 110, 300, 100, TFT_GREEN);
  tft.setTextColor(TFT_GREEN, TFT_BLACK);
  tft.setTextSize(2);
  tft.setCursor(35, 145);
  tft.println("SISTEMA SEGURO [OK]");
}

void drawAttackUI() {
  tft.fillScreen(TFT_RED);
  tft.setTextColor(TFT_WHITE, TFT_RED);
  tft.setTextSize(2);
  tft.setCursor(10, 10);
  tft.println("ALERTA: ATAQUE DEAUTH!");
  
  tft.setTextSize(1);
  tft.drawFastHLine(10, 32, 300, TFT_WHITE);
  
  tft.setCursor(10, 45);
  tft.printf("Canal atacado: %d\\n", currentChannel);
  
  tft.setCursor(10, 70);
  tft.printf("Transmisor (Atacante):\\n%02X:%02X:%02X:%02X:%02X:%02X\\n",
             lastAttacker[0], lastAttacker[1], lastAttacker[2],
             lastAttacker[3], lastAttacker[4], lastAttacker[5]);
             
  tft.setCursor(10, 110);
  tft.printf("Objetivo (Victima):\\n%02X:%02X:%02X:%02X:%02X:%02X\\n",
             lastVictim[0], lastVictim[1], lastVictim[2],
             lastVictim[3], lastVictim[4], lastVictim[5]);
             
  tft.setCursor(10, 160);
  tft.println("Accion recomendada: Activar 802.11w (PMF)");
}

void setup() {
  Serial.begin(115200);
  
  // Configurar pines de periféricos CYD
  pinMode(CYD_LED_RED, OUTPUT);
  pinMode(CYD_LED_GREEN, OUTPUT);
  pinMode(CYD_LED_BLUE, OUTPUT);
  pinMode(CYD_SPEAKER, OUTPUT);
  
  // Apagar LEDs (lógica active LOW en la CYD)
  digitalWrite(CYD_LED_RED, HIGH);
  digitalWrite(CYD_LED_GREEN, HIGH);
  digitalWrite(CYD_LED_BLUE, HIGH);
  
  // Inicializar pantalla TFT
  tft.init();
  tft.setRotation(1); // Orientación horizontal 320x240
  drawNormalUI();
  
  // Encender LED Verde (Seguro)
  digitalWrite(CYD_LED_GREEN, LOW);

  // Inicializar Wi-Fi en modo promiscuo
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_promiscuous_rx_cb(&wifiPromiscuousCallback);
  esp_wifi_set_channel(currentChannel, WIFI_SECOND_CHAN_NONE);
}

void loop() {
  // Salto de canal cada 1 segundo (Channel Hopping 1-13)
  if (millis() - lastHopTime > 1000) {
    lastHopTime = millis();
    currentChannel = (currentChannel % 13) + 1;
    esp_wifi_set_channel(currentChannel, WIFI_SECOND_CHAN_NONE);
    if (!attackAlert) {
      drawNormalUI();
    }
  }

  // Si se detecta un ataque de desautenticación
  if (attackAlert) {
    // Encender LED Rojo y apagar Verde
    digitalWrite(CYD_LED_GREEN, HIGH);
    digitalWrite(CYD_LED_RED, LOW);
    
    drawAttackUI();
    soundAlarm();
    
    // Parpadeo de advertencia
    for (int i = 0; i < 5; i++) {
      digitalWrite(CYD_LED_RED, HIGH);
      delay(80);
      digitalWrite(CYD_LED_RED, LOW);
      delay(80);
    }
    
    attackAlert = false;
    lastAlertReset = millis();
  } else if (millis() - lastAlertReset > 4000) {
    // Volver a estado normal seguro tras 4 segundos
    digitalWrite(CYD_LED_RED, HIGH);
    digitalWrite(CYD_LED_GREEN, LOW);
  }
}
`,
    platformioIni: `[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
upload_speed = 921600
lib_deps = 
    bodmer/TFT_eSPI@^2.5.43
build_flags =
    -D USER_SETUP_LOADED=1
    -D ILI9341_2_DRIVER=1
    -D TFT_WIDTH=240
    -D TFT_HEIGHT=320
    -D TFT_MISO=12
    -D TFT_MOSI=13
    -D TFT_SCLK=14
    -D TFT_CS=15
    -D TFT_DC=2
    -D TFT_RST=-1
    -D TFT_BL=21
    -D TFT_BACKLIGHT_ON=HIGH
    -D SPI_FREQUENCY=40000000
`
  },
  {
    id: 'cyd-airtag-detector',
    title: 'CYD BLE Hunter: Detector de AirTags y Balizas Anti-Stalking',
    category: 'Privacidad / OPSEC',
    description: 'Escáner Bluetooth Low Energy especializado en identificar anuncios de Apple Find My (AirTags) y Samsung SmartTags cercanos.',
    filename: 'CYD_BLE_Hunter.ino',
    libraries: ['TFT_eSPI', 'BLEDevice.h (ESP32 BLE)'],
    setupInstructions: [
      'Utiliza la librería BLE oficial del core ESP32 (incluida por defecto).',
      'Configura TFT_eSPI con el User_Setup.h de la CYD.',
      'Sube el sketch y camina por la zona para auditar balizas que te sigan.'
    ],
    code: `/*
 * ====================================================================
 * CYD BLE Hunter - Detector de Balizas Apple AirTag y Rastreadores BLE
 * Placa: Cheap Yellow Display (ESP32-2432S028R)
 * ====================================================================
 */

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <TFT_eSPI.h>

#define CYD_LED_RED   4
#define CYD_LED_GREEN 16
#define CYD_LED_BLUE  17
#define CYD_SPEAKER   26

TFT_eSPI tft = TFT_eSPI();
BLEScan* pBLEScan;

int airtagsFound = 0;
String lastTrackerMAC = "";
int lastTrackerRSSI = 0;
bool trackerDetected = false;

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      // Comprobar datos de fabricante de Apple (Company ID 0x004C)
      if (advertisedDevice.haveManufacturerData()) {
        std::string strManufacturerData = advertisedDevice.getManufacturerData();
        uint8_t cManufacturerData[100];
        strManufacturerData.copy((char*)cManufacturerData, strManufacturerData.length(), 0);

        // Apple Find My / AirTag usa 0x4C 0x00 y tipo 0x12 (FindMy payload)
        if (strManufacturerData.length() >= 4) {
          if (cManufacturerData[0] == 0x4C && cManufacturerData[1] == 0x00 && cManufacturerData[2] == 0x12) {
            airtagsFound++;
            trackerDetected = true;
            lastTrackerMAC = advertisedDevice.getAddress().toString().c_str();
            lastTrackerRSSI = advertisedDevice.getRSSI();
            Serial.printf("[ALERTA] AirTag detectado! MAC: %s, RSSI: %d dBm\\n", 
                          lastTrackerMAC.c_str(), lastTrackerRSSI);
          }
        }
      }
    }
};

void drawScannerUI() {
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_CYAN, TFT_BLACK);
  tft.setTextSize(2);
  tft.setCursor(10, 10);
  tft.println("CYD BLE HUNTER");
  
  tft.drawFastHLine(10, 32, 300, TFT_DARKGREY);
  tft.setTextSize(1);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  tft.setCursor(10, 45);
  tft.println("Escaneando balizas AirTag / Find My...");
  
  if (trackerDetected) {
    tft.fillRect(10, 80, 300, 130, TFT_NAVY);
    tft.drawRect(10, 80, 300, 130, TFT_RED);
    tft.setTextColor(TFT_YELLOW, TFT_NAVY);
    tft.setTextSize(2);
    tft.setCursor(20, 95);
    tft.println("! BALIZA DETECTADA !");
    
    tft.setTextSize(1);
    tft.setTextColor(TFT_WHITE, TFT_NAVY);
    tft.setCursor(20, 130);
    tft.printf("MAC: %s\\n", lastTrackerMAC.c_str());
    tft.setCursor(20, 150);
    tft.printf("Potencia RSSI: %d dBm\\n", lastTrackerRSSI);
    
    // Barra de proximidad
    int barWidth = map(constrain(lastTrackerRSSI, -90, -40), -90, -40, 20, 260);
    tft.fillRect(20, 175, barWidth, 15, TFT_RED);
    tft.drawRect(20, 175, 260, 15, TFT_WHITE);
  } else {
    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.setTextSize(2);
    tft.setCursor(40, 120);
    tft.println("Area Despejada [0 Trackers]");
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(CYD_LED_RED, OUTPUT);
  pinMode(CYD_LED_GREEN, OUTPUT);
  pinMode(CYD_LED_BLUE, OUTPUT);
  pinMode(CYD_SPEAKER, OUTPUT);
  
  digitalWrite(CYD_LED_RED, HIGH);
  digitalWrite(CYD_LED_GREEN, LOW); // Verde OK
  digitalWrite(CYD_LED_BLUE, HIGH);

  tft.init();
  tft.setRotation(1);
  drawScannerUI();

  BLEDevice::init("CYD_Hunter");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);
}

void loop() {
  pBLEScan->start(4, false); // Escaneo de 4 segundos
  
  if (trackerDetected) {
    digitalWrite(CYD_LED_GREEN, HIGH);
    digitalWrite(CYD_LED_RED, LOW);
    tone(CYD_SPEAKER, 3000, 150);
  } else {
    digitalWrite(CYD_LED_RED, HIGH);
    digitalWrite(CYD_LED_GREEN, LOW);
  }
  
  drawScannerUI();
  pBLEScan->clearResults();
  delay(1000);
}
`,
    platformioIni: `[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
lib_deps = bodmer/TFT_eSPI@^2.5.43
`
  },
  {
    id: 'cyd-tft-setup',
    title: 'Archivo de Configuración User_Setup.h para TFT_eSPI (Crítico)',
    category: 'Configuración Hardware CYD',
    description: 'Este es el archivo de configuración obligatorio para que la pantalla ILI9341 de la placa Cheap Yellow Display no se quede en blanco ni muestre artefactos.',
    filename: 'User_Setup.h',
    libraries: ['TFT_eSPI'],
    setupInstructions: [
      'Dirígete a la carpeta de librerías de tu ordenador: Documentos/Arduino/libraries/TFT_eSPI/',
      'Abre el archivo User_Setup.h o sustitúyelo por este contenido.',
      'Asegúrate de que no haya otros setups descomentados en User_Setup_Select.h.'
    ],
    code: `// ====================================================================
// User_Setup.h para ESP32-2432S028R (Cheap Yellow Display / CYD)
// Copiar en: Arduino/libraries/TFT_eSPI/User_Setup.h
// ====================================================================

#define USER_SETUP_INFO "CYD_ESP32_2432S028R"

// 1. Controlador de Pantalla
#define ILI9341_2_DRIVER     // Usar ILI9341_2_DRIVER o ST7789 según revisión

// 2. Pines de la Pantalla LCD (HSPI en CYD)
#define TFT_MISO 12
#define TFT_MOSI 13
#define TFT_SCLK 14
#define TFT_CS   15  // Chip Select
#define TFT_DC    2  // Data Command
#define TFT_RST  -1  // Reset conectado a EN del ESP32

// 3. Control de Retroiluminación (Backlight)
#define TFT_BL   21  // GPIO de retroiluminación
#define TFT_BACKLIGHT_ON HIGH

// 4. Pines del Panel Táctil (XPT2046)
#define TOUCH_CS 33  // Chip Select del táctil XPT2046

// 5. Fuentes a Cargar
#define LOAD_GLCD   // Fuente 1 básica
#define LOAD_FONT2  // Fuente pequeña 16pt
#define LOAD_FONT4  // Fuente media 26pt
#define LOAD_FONT6  // Fuente grande 48pt
#define LOAD_FONT7  // Fuente tipo reloj 7 segmentos
#define LOAD_FONT8  // Fuente extra grande
#define LOAD_GFXFF  // Soporte fuentes FreeFonts
#define SMOOTH_FONT

// 6. Frecuencias SPI
#define SPI_FREQUENCY       40000000 // 40 MHz para display fluido
#define SPI_READ_FREQUENCY  20000000
#define SPI_TOUCH_FREQUENCY  2500000 // 2.5 MHz para touch XPT2046
`,
    platformioIni: `# En PlatformIO no necesitas modificar archivos dentro de librerías,
# solo incluye estos build_flags en tu platformio.ini:
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
`
  }
];
