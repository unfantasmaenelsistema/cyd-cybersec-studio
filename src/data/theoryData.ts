import { TabType } from '../types';

// ==========================================================
// CYD CyberSec Studio · Curso Teórico
// Contenido de los módulos de teoría que acompañan a las
// herramientas interactivas (Simulador, Builder, Academia CTF).
// ==========================================================

export type TheoryLevel = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface TheorySection {
  heading: string;
  paragraphs: string[];
  keyPoints?: string[];
}

export interface TheoryQuizOption {
  id: string;
  text: string;
  correct: boolean;
  explanation: string;
}

export interface TheoryQuizQuestion {
  id: string;
  question: string;
  options: TheoryQuizOption[];
}

export interface TheoryPracticeLink {
  label: string;
  targetTab: TabType;
}

export interface TheoryModule {
  id: string;
  order: number;
  level: TheoryLevel;
  title: string;
  tag: string;
  estimatedMinutes: number;
  summary: string;
  sections: TheorySection[];
  practiceLinks: TheoryPracticeLink[];
  quiz: TheoryQuizQuestion[];
}

export const THEORY_MODULES: TheoryModule[] = [
  // ======================================================
  // MÓDULO 1 — HARDWARE
  // ======================================================
  {
    id: 'mod-hardware',
    order: 1,
    level: 'Principiante',
    title: 'Arquitectura de la CYD y el SoC ESP32',
    tag: 'Hardware & Buses SPI',
    estimatedMinutes: 15,
    summary: 'Qué hay realmente dentro de una placa de 12€: el doble núcleo del ESP32, por qué la pantalla y la MicroSD "pelean" por el mismo bus, y la lógica invertida del LED RGB.',
    sections: [
      {
        heading: '¿Qué es exactamente la "Cheap Yellow Display"?',
        paragraphs: [
          'La CYD no es una marca comercial, sino un apodo que la comunidad maker puso a un módulo de desarrollo genérico fabricado en China con referencia ESP32-2432S028R: un microcontrolador ESP32 soldado a una placa amarilla con pantalla TFT de 2.8" integrada. Al no tener una única empresa detrás, circulan varias revisiones de hardware (con o sin conector de cámara, con uno o dos puertos USB), lo que explica por qué algunos tutoriales de internet no funcionan igual en todas las placas.',
          'Su popularidad en ciberseguridad no viene de ser potente, sino de ser completa: en un solo PCB de 12-15€ ya vienen soldados la pantalla táctil, el lector de tarjetas, el altavoz y el LED de estado. Eso elimina la fase de "montar el prototipo en una protoboard" y deja al estudiante centrarse directamente en el código y el protocolo que está auditando.'
        ],
        keyPoints: [
          'ESP32-2432S028R: doble núcleo Xtensa LX6 a 240 MHz, 520 KB de SRAM, Wi-Fi b/g/n + Bluetooth Classic/BLE integrados.',
          'No existe un único fabricante: comprueba siempre la revisión de tu placa antes de copiar un pinout de internet.'
        ]
      },
      {
        heading: 'El conflicto de bus HSPI vs VSPI',
        paragraphs: [
          'El ESP32 tiene dos controladores SPI de propósito general (HSPI y VSPI) además del que usa internamente para la memoria flash. En la CYD, la pantalla ILI9341 y el panel táctil XPT2046 comparten el bus HSPI (pines 12/13/14/15), mientras que el lector MicroSD usa el bus VSPI (pines 5/18/19/23) de forma independiente.',
          'Este reparto no es casualidad: si pantalla y tarjeta SD compartieran el mismo bus, cada vez que el firmware escribiera un archivo .pcap en la SD, la pantalla parpadearía o se congelaría momentáneamente porque ambos periféricos competirían por las mismas líneas de reloj y datos. Entender esta separación es la razón por la que las librerías TFT_eSPI mal configuradas (apuntando SD y TFT al mismo SPIClass) son la causa número uno de "la pantalla se queda en negro" en los foros de la comunidad.'
        ],
        keyPoints: [
          'HSPI (pines 12,13,14,15): pantalla TFT + panel táctil resistivo.',
          'VSPI (pines 5,18,19,23): lector MicroSD, completamente independiente.'
        ]
      },
      {
        heading: 'Lógica invertida y periféricos auxiliares',
        paragraphs: [
          'Un detalle que sorprende a quien programa su primera CYD: el LED RGB (GPIO 4, 16, 17) funciona en lógica invertida (Active LOW). Para encender el LED rojo hay que escribir digitalWrite(4, LOW), no HIGH. Si lo haces al revés, el LED se queda apagado y parece que el componente está roto.',
          'El resto de periféricos relevantes para ciberseguridad son: el altavoz piezoeléctrico conectado al DAC del GPIO 26 (útil para alarmas acústicas de un IDS), el sensor de luz LDR en el GPIO 34 (solo lectura, sirve para atenuar el brillo automáticamente) y dos conectores de expansión (CN1 y P3) con líneas UART y GPIO libres donde se sueldan módulos externos como el GPS NEO-6M o el transceptor CC1101.'
        ]
      }
    ],
    practiceLinks: [
      { label: 'Explorar el pinout interactivo completo', targetTab: 'hardware-pinout' },
      { label: 'Ver el LED RGB en acción en el simulador', targetTab: 'simulator' }
    ],
    quiz: [
      {
        id: 'q1-1',
        question: '¿Por qué la pantalla TFT y la MicroSD de la CYD NO comparten el mismo bus SPI?',
        options: [
          { id: 'a', text: 'Porque el ESP32 solo soporta un periférico por bus SPI.', correct: false, explanation: 'Incorrecto: un bus SPI admite varios periféricos siempre que cada uno tenga su propia línea CS (Chip Select).' },
          { id: 'b', text: 'Para evitar que ambos periféricos compitan por el bus y provoquen parpadeos o cuelgues al escribir en la SD.', correct: true, explanation: '¡Correcto! Por eso TFT_eSPI (HSPI) y la SD (VSPI) se configuran en SPIClass distintas en el firmware.' },
          { id: 'c', text: 'Porque la MicroSD necesita más voltaje que la pantalla.', correct: false, explanation: 'Incorrecto: ambos periféricos trabajan a 3.3V en la CYD; el problema es de contención de bus, no de voltaje.' }
        ]
      },
      {
        id: 'q1-2',
        question: 'Para encender el LED RGB en rojo en la CYD, ¿qué instrucción es correcta?',
        options: [
          { id: 'a', text: 'digitalWrite(CYD_LED_RED, HIGH);', correct: false, explanation: 'Incorrecto: con lógica invertida (Active LOW), HIGH apaga el LED.' },
          { id: 'b', text: 'digitalWrite(CYD_LED_RED, LOW);', correct: true, explanation: '¡Correcto! El LED RGB de la CYD es Active LOW: LOW enciende, HIGH apaga.' },
          { id: 'c', text: 'analogWrite(CYD_LED_RED, 255);', correct: false, explanation: 'Incorrecto: el LED RGB de la CYD no es PWM por defecto, se controla con digitalWrite simple.' }
        ]
      }
    ]
  },

  // ======================================================
  // MÓDULO 2 — FUNDAMENTOS 802.11
  // ======================================================
  {
    id: 'mod-80211',
    order: 2,
    level: 'Principiante',
    title: 'Fundamentos de las Tramas IEEE 802.11',
    tag: 'Wi-Fi · Capa de Enlace',
    estimatedMinutes: 20,
    summary: 'El lenguaje que hablan todos los dispositivos Wi-Fi del aire: tipos de trama, el campo Frame Control y por qué una trama de desautenticación no necesita ninguna contraseña para funcionar.',
    sections: [
      {
        heading: 'Tres familias de tramas, un solo medio compartido',
        paragraphs: [
          'Todo lo que viaja por el aire en una red Wi-Fi 802.11 clásica (anterior a 802.11w) se divide en tres categorías: tramas de gestión (management), que organizan la red —beacons, probe request/response, autenticación, asociación, desautenticación—; tramas de control, que coordinan el acceso al medio —ACK, RTS/CTS—; y tramas de datos, que transportan el tráfico real del usuario.',
          'Cuando el ESP32 de la CYD activa el "modo promiscuo" (esp_wifi_set_promiscuous(true)), deja de comportarse como un cliente normal y empieza a recibir y entregar al firmware absolutamente todas las tramas que detecta en el canal, estén o no dirigidas a él. Esto es legal porque no requiere asociarse a ninguna red: el radio simplemente escucha lo que ya viaja por el aire libre, igual que una radio FM sintoniza una emisora sin "hackear" nada.'
        ]
      },
      {
        heading: 'El campo Frame Control: 2 bytes que lo dicen todo',
        paragraphs: [
          'Los dos primeros bytes de cualquier trama 802.11 forman el campo Frame Control, y dentro de él, los bits 2-3 (Type) y 4-7 (Subtype) identifican exactamente qué tipo de trama es. Una trama de desautenticación tiene Type=00 (Management) y Subtype=1100, lo que en hexadecimal se traduce al byte 0xC0 que verás repetido constantemente en los desensambladores de la Academia CTF.',
          'El problema de seguridad histórico de 802.11 es que, hasta la llegada de 802.11w, estas tramas de gestión viajaban sin ningún tipo de firma ni cifrado. Cualquier adaptador Wi-Fi capaz de inyectar paquetes (como el del ESP32) puede forjar el campo "dirección origen" con la MAC real de un router y enviar una trama de desautenticación válida en apariencia: el cliente la recibe, la cree legítima y se desconecta obedientemente.'
        ],
        keyPoints: [
          'Deauth (0x00C0): Type=Management, Subtype=Deauthentication.',
          'Disassoc (0x00A0): Type=Management, Subtype=Disassociation.',
          'Beacon (0x0080): anuncio periódico de un punto de acceso (cada ~100ms).'
        ]
      },
      {
        heading: 'Beacons, Probe Requests y la fuga de información del móvil',
        paragraphs: [
          'Cada punto de acceso emite un beacon aproximadamente cada 100 milisegundos anunciando su SSID, canal y capacidades de seguridad: es la base de que tu móvil "vea" las redes disponibles sin que nadie haga nada activo. En el otro sentido, tu propio móvil envía Probe Requests buscando activamente redes a las que ya se ha conectado antes, y en dispositivos antiguos o mal configurados esos probe requests pueden filtrar el nombre de redes privadas (tu casa, tu empresa) incluso cuando estás fuera de su alcance.',
          'Esta es la base técnica del módulo CYD Marauder "Probe Sniffer": escuchando pasivamente esos Probe Requests, un auditor puede mapear a qué redes se ha conectado un dispositivo en el pasado, sin necesidad de romper ningún cifrado.'
        ]
      }
    ],
    practiceLinks: [
      { label: 'Diseccionar una trama Deauth byte a byte', targetTab: 'pro-academy' },
      { label: 'Activar el modo promiscuo en el Simulador (CYD Sentinel)', targetTab: 'simulator' }
    ],
    quiz: [
      {
        id: 'q2-1',
        question: '¿Por qué un ESP32 en modo promiscuo puede "escuchar" redes a las que no está conectado sin cometer un delito?',
        options: [
          { id: 'a', text: 'Porque descifra las claves WPA2 automáticamente.', correct: false, explanation: 'Incorrecto: el modo promiscuo no descifra nada, solo recibe las tramas que ya viajan sin cifrar por el aire (gestión y control).' },
          { id: 'b', text: 'Porque solo recibe pasivamente tramas que ya son públicas en el medio radioeléctrico, sin asociarse a ninguna red ni interferir en ella.', correct: true, explanation: '¡Correcto! Escuchar pasivamente el espectro es análogo a sintonizar una emisora de radio: no hay acceso no autorizado a ningún sistema.' },
          { id: 'c', text: 'Porque tiene autorización legal automática al ser un dispositivo educativo.', correct: false, explanation: 'Incorrecto: la legalidad depende de la acción (escuchar pasivo vs. inyectar tramas), no del propósito declarado del dispositivo.' }
        ]
      },
      {
        id: 'q2-2',
        question: '¿Qué hace posible, a nivel de protocolo, que cualquiera pueda forjar una trama de desautenticación contra un cliente ajeno?',
        options: [
          { id: 'a', text: 'Que las tramas de gestión clásicas (pre-802.11w) no llevan firma ni cifrado, así que el campo "MAC origen" se puede falsificar libremente.', correct: true, explanation: '¡Correcto! Sin PMF (802.11w), el receptor no tiene forma de verificar que la trama realmente proviene del AP legítimo.' },
          { id: 'b', text: 'Que el protocolo WPA2 tiene una puerta trasera conocida desde 2003.', correct: false, explanation: 'Incorrecto: no es una puerta trasera de WPA2, es una debilidad de diseño en las tramas de gestión no autenticadas del propio estándar 802.11.' },
          { id: 'c', text: 'Que todos los routers domésticos comparten la misma clave de fábrica.', correct: false, explanation: 'Incorrecto: esto no tiene relación con el ataque de desautenticación, que no depende de ninguna clave.' }
        ]
      }
    ]
  },

  // ======================================================
  // MÓDULO 3 — WPA2/WPA3 Y PMKID
  // ======================================================
  {
    id: 'mod-wpa',
    order: 3,
    level: 'Intermedio',
    title: 'El 4-Way Handshake, PMKID y la Debilidad de WPA2',
    tag: 'Criptografía Wi-Fi',
    estimatedMinutes: 25,
    summary: 'Cómo dos dispositivos que nunca se han visto antes acuerdan una clave de sesión sin transmitirla nunca por el aire, y el atajo (PMKID) que permite auditar esa clave sin esperar a que nadie se conecte.',
    sections: [
      {
        heading: 'Por qué existe el 4-Way Handshake',
        paragraphs: [
          'La contraseña Wi-Fi (PSK) nunca viaja por el aire, ni cifrada ni en claro: sería demasiado arriesgado. En su lugar, el punto de acceso y el cliente ejecutan el 4-Way Handshake, un intercambio de 4 mensajes EAPOL en el que ambos demuestran que conocen la misma clave maestra (PMK, derivada de la contraseña + el SSID mediante PBKDF2) sin llegar a transmitirla jamás. De ese intercambio surge la PTK (Pairwise Transient Key), la clave real que cifrará los datos de esa sesión concreta.',
          'Cuando un auditor "captura un handshake" con herramientas como ESP32 Marauder, lo que realmente obtiene son los mensajes 1 y 2 de ese intercambio (que sí contienen suficiente material criptográfico para intentar fuerza bruta offline), nunca la contraseña en sí. Por eso, si la contraseña es robusta (más de 12 caracteres aleatorios), capturar el handshake no sirve de nada práctico.'
        ],
        keyPoints: [
          'PMK = PBKDF2(contraseña, SSID, 4096 iteraciones) — se calcula una vez.',
          'PTK = función de PMK + nonces de ambas partes + MACs — única por sesión.',
          'El handshake prueba conocimiento de la clave sin transmitirla nunca.'
        ]
      },
      {
        heading: 'El atajo PMKID: auditar sin esperar a ningún cliente',
        paragraphs: [
          'En 2018 se descubrió que muchos routers incluyen el PMKID —un hash derivado de la PMK, pensado originalmente para acelerar el roaming entre puntos de acceso de una misma red empresarial— directamente en el primer mensaje EAPOL que el propio AP envía nada más iniciarse la asociación. Eso significa que un atacante (o auditor) puede solicitar ese primer mensaje activamente, sin necesidad de esperar a que un cliente legítimo se conecte ni de forzar ninguna desautenticación.',
          'Esta es la técnica que simula el módulo "Sniff PMKID" de la CYD Marauder en este estudio: escucha ese primer mensaje EAPOL, extrae el PMKID, y lo vuelca a la MicroSD en el formato que exige Hashcat (modo -m 22000) para intentar un ataque de diccionario offline contra la contraseña.'
        ]
      },
      {
        heading: 'WPA3 y por qué SAE cambia las reglas',
        paragraphs: [
          'WPA3 sustituye el PSK clásico por SAE (Simultaneous Authentication of Equals), también conocido como "Dragonfly Handshake". La diferencia clave es que SAE proporciona secreto perfecto hacia adelante (forward secrecy): incluso si un atacante capturara todo el tráfico cifrado de una sesión y después consiguiera la contraseña, no podría descifrar retroactivamente esas capturas antiguas, algo que sí era posible con WPA2-PSK.',
          'Además, SAE está diseñado para resistir ataques de diccionario offline: cada intento de autenticación requiere una interacción en vivo con el punto de acceso, lo que hace inviable probar millones de contraseñas contra un solo paquete capturado. Esto explica por qué, en el comparativo de esta suite, las redes WPA3 aparecen marcadas como mucho más resistentes frente a la captura de PMKID.'
        ]
      }
    ],
    practiceLinks: [
      { label: 'Simular la captura de un PMKID (Marauder)', targetTab: 'simulator' },
      { label: 'Generar el preset "CYD Marauder Suite" en el Builder', targetTab: 'builder-flasher' },
      { label: 'Convertir una captura al formato Hashcat 22000', targetTab: 'pro-academy' }
    ],
    quiz: [
      {
        id: 'q3-1',
        question: '¿Qué permite capturar la técnica PMKID que NO requiere el método clásico del 4-way handshake?',
        options: [
          { id: 'a', text: 'La contraseña Wi-Fi en texto plano directamente.', correct: false, explanation: 'Incorrecto: ni el PMKID ni el handshake exponen nunca la contraseña en claro, solo material para intentar fuerza bruta offline.' },
          { id: 'b', text: 'No tener que esperar a que un cliente legítimo se conecte, porque el AP lo envía solo en el primer mensaje EAPOL.', correct: true, explanation: '¡Correcto! Esto hace el ataque/auditoría mucho más rápida: no hace falta forzar una desautenticación ni esperar clientes.' },
          { id: 'c', text: 'Acceso root al punto de acceso.', correct: false, explanation: 'Incorrecto: el PMKID es solo un hash criptográfico relacionado con la contraseña, no otorga ningún tipo de acceso administrativo.' }
        ]
      },
      {
        id: 'q3-2',
        question: '¿Cuál es la ventaja principal de WPA3-SAE frente a WPA2-PSK en este contexto?',
        options: [
          { id: 'a', text: 'Usa una velocidad de Wi-Fi superior.', correct: false, explanation: 'Incorrecto: SAE es un mecanismo de autenticación, no afecta a la velocidad de transmisión de datos.' },
          { id: 'b', text: 'Resiste el ataque de diccionario offline porque cada intento exige interactuar en vivo con el AP, y aporta forward secrecy.', correct: true, explanation: '¡Correcto! Por eso capturar un intercambio SAE no sirve para probar contraseñas sin conexión como sí ocurre con un PMKID de WPA2.' },
          { id: 'c', text: 'Elimina la necesidad de contraseña por completo.', correct: false, explanation: 'Incorrecto: WPA3-Personal sigue usando una contraseña compartida, solo cambia cómo se demuestra su conocimiento.' }
        ]
      }
    ]
  },

  // ======================================================
  // MÓDULO 4 — PMF / 802.11w
  // ======================================================
  {
    id: 'mod-pmf',
    order: 4,
    level: 'Intermedio',
    title: 'Protected Management Frames (802.11w): la vacuna contra el Deauth',
    tag: 'Blue Team · Mitigación',
    estimatedMinutes: 15,
    summary: 'La extensión del estándar que, bien configurada, hace que los ataques de desautenticación forjados dejen de funcionar — y por qué todavía no está activada por defecto en la mayoría de routers.',
    sections: [
      {
        heading: 'Firmar lo que antes viajaba en claro',
        paragraphs: [
          'IEEE 802.11w (ratificado en 2009 pero adoptado masivamente mucho después) añade una firma criptográfica BIP (Broadcast Integrity Protocol, basada en CMAC) a las tramas de gestión unicast más sensibles, incluyendo precisamente la desautenticación y la desasociación. Con PMF activado, cuando un cliente recibe una trama de deauth, primero verifica su firma; si no coincide con la clave de sesión ya negociada, la descarta silenciosamente en lugar de desconectarse.',
          'Esto no significa que la trama de deauth "no llegue": el radio la recibe igual, porque PMF no cifra el medio físico, solo invalida criptográficamente las tramas de gestión que no proceden realmente de un extremo autenticado de la conexión ya establecida.'
        ]
      },
      {
        heading: 'Modos de PMF: desactivado, opcional y obligatorio',
        paragraphs: [
          'La mayoría de routers ofrecen tres estados para PMF: Desactivado (vulnerable, compatibilidad máxima con dispositivos antiguos), Opcional/Capable (el AP lo soporta pero no lo exige, así que un cliente sin PMF se sigue conectando sin protección) y Obligatorio/Required (el AP rechaza cualquier cliente que no soporte 802.11w). Solo este último modo cierra realmente la puerta a los ataques de deauth clásicos.',
          'WPA3 obliga a PMF como parte del estándar, lo que explica por qué, en el Simulador CYD Sentinel de este estudio, al activar el toggle "PMF 802.11w: ON" el botón "Simular Deauth" deja de surtir efecto: el firmware simula exactamente ese comportamiento de descarte criptográfico que ocurriría en un dispositivo real.'
        ],
        keyPoints: [
          'PMF Desactivado: vulnerable a deauth/disassoc forjados (comportamiento por defecto en muchos routers domésticos antiguos).',
          'PMF Obligatorio: única configuración que neutraliza por completo el vector de desautenticación clásico.'
        ]
      }
    ],
    practiceLinks: [
      { label: 'Probar el toggle PMF ON/OFF contra un Deauth simulado', targetTab: 'simulator' },
      { label: 'Ver el reto CTF sobre PMF en la Academia', targetTab: 'pro-academy' }
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'Con PMF en modo "Obligatorio", ¿qué ocurre exactamente cuando llega una trama de deauth forjada?',
        options: [
          { id: 'a', text: 'El radio del cliente deja de recibir cualquier señal del canal.', correct: false, explanation: 'Incorrecto: PMF no actúa a nivel de radiofrecuencia, sino verificando la firma de las tramas de gestión ya recibidas.' },
          { id: 'b', text: 'El cliente recibe la trama, verifica su firma BIP/CMAC, no coincide y la descarta sin desconectarse.', correct: true, explanation: '¡Correcto! Esa verificación criptográfica es exactamente lo que falta en las redes sin PMF.' },
          { id: 'c', text: 'El router bloquea automáticamente la MAC del atacante.', correct: false, explanation: 'Incorrecto: PMF no incluye ningún mecanismo de bloqueo de direcciones MAC, solo invalida la trama concreta.' }
        ]
      }
    ]
  },

  // ======================================================
  // MÓDULO 5 — BLE Y PRIVACIDAD
  // ======================================================
  {
    id: 'mod-ble',
    order: 5,
    level: 'Intermedio',
    title: 'Bluetooth Low Energy: Advertising y Balizas de Rastreo',
    tag: 'BLE · Privacidad',
    estimatedMinutes: 20,
    summary: 'Cómo un AirTag "habla" con el mundo sin emparejarse con nada, por qué rota su dirección MAC y qué patrón delata su presencia incluso así.',
    sections: [
      {
        heading: 'El paquete de Advertising: la tarjeta de visita de un dispositivo BLE',
        paragraphs: [
          'A diferencia del Bluetooth Classic (pensado para streaming de audio continuo), BLE está optimizado para transmitir ráfagas cortas de datos con un consumo mínimo. Un dispositivo en modo "advertising" emite periódicamente un paquete de hasta 31 bytes de carga útil anunciando su presencia: ahí caben desde el nombre del dispositivo hasta datos propietarios de fabricante, identificados por un Company ID de 2 bytes asignado por el Bluetooth SIG (0x004C corresponde a Apple Inc.).',
          'Un rastreador tipo AirTag no necesita emparejarse con el teléfono para funcionar: simplemente emite constantemente un paquete de advertising con un payload específico (prefijo 0x4C 0x12 en la carga de fabricante) que cualquier iPhone cercano capta pasivamente y retransmite de forma cifrada a los servidores de Apple a través de la red Find My, sin que el dueño del iPhone se entere ni participe activamente.'
        ]
      },
      {
        heading: 'MAC aleatoria: privacidad por diseño, con un matiz',
        paragraphs: [
          'Para evitar que cualquiera pueda rastrear a una persona por la dirección MAC fija de su teléfono o sus auriculares, la especificación BLE define direcciones privadas resolubles (RPA) que rotan cada cierto intervalo (habitualmente 15 minutos). A simple vista, cada nueva dirección parece pertenecer a un dispositivo distinto.',
          'Sin embargo, el propio payload de fabricante (Company ID + tipo de anuncio) no cambia con la rotación de MAC. Esa es la grieta que explota el módulo "BLE AirTag Hunter" de este estudio: aunque la MAC cambie cada 15 minutos, si el radar sigue viendo el mismo patrón 0x4C 0x12 de forma persistente y con un RSSI que se mantiene estable mientras te desplazas, la conclusión —hay una baliza viajando contigo— sigue siendo válida.'
        ],
        keyPoints: [
          'Company ID 0x004C = Apple Inc. (usado por AirTag y dispositivos Find My compatibles).',
          'La MAC rota, pero el patrón de payload y la persistencia geográfica no engañan a un analizador atento.'
        ]
      },
      {
        heading: 'Por qué esto importa legalmente',
        paragraphs: [
          'Detectar una baliza de rastreo no consentida en tu vehículo o equipaje con un escáner BLE pasivo como el de esta suite es una práctica defensiva legítima y cada vez más recomendada por fabricantes y asociaciones de consumidores ante el aumento de casos de stalking tecnológico. Apple y Google han añadido alertas nativas en iOS/Android precisamente para mitigar este riesgo, y herramientas como la CYD permiten una capa adicional de verificación física independiente del propio ecosistema del fabricante.'
        ]
      }
    ],
    practiceLinks: [
      { label: 'Detectar balizas en el radar BLE del Simulador', targetTab: 'simulator' },
      { label: 'Resolver el reto CTF de Apple Find My', targetTab: 'pro-academy' }
    ],
    quiz: [
      {
        id: 'q5-1',
        question: 'Si la dirección MAC de un AirTag rota cada 15 minutos, ¿cómo puede un analizador seguir identificándolo como la misma baliza?',
        options: [
          { id: 'a', text: 'Es imposible; cada rotación de MAC hace indetectable al dispositivo.', correct: false, explanation: 'Incorrecto: precisamente ese es el fallo que explota la detección — el payload de fabricante no rota con la MAC.' },
          { id: 'b', text: 'Por el patrón de payload de fabricante (Company ID + tipo de anuncio), que permanece igual, combinado con la persistencia del RSSI en el tiempo.', correct: true, explanation: '¡Correcto! La rotación de MAC protege contra rastreo trivial por dirección fija, pero no oculta el "tipo" de dispositivo que sigue anunciándose.' },
          { id: 'c', text: 'Porque el AirTag emite su número de serie en texto plano.', correct: false, explanation: 'Incorrecto: el número de serie no se transmite en claro en el advertising BLE estándar.' }
        ]
      }
    ]
  },

  // ======================================================
  // MÓDULO 6 — RF SUB-GHZ
  // ======================================================
  {
    id: 'mod-subghz',
    order: 6,
    level: 'Avanzado',
    title: 'Radiofrecuencia Sub-GHz: del CC1101 a los Rolling Codes',
    tag: 'RF · Bandas ISM',
    estimatedMinutes: 20,
    summary: 'Por qué un mando de garaje antiguo se puede clonar con un módulo de 3€ y cómo los mandos modernos (KeeLoq) lo impiden sin que el usuario note ningún cambio en su uso diario.',
    sections: [
      {
        heading: 'Fuera del Wi-Fi: las bandas ISM libres',
        paragraphs: [
          'Las bandas Industrial, Scientific and Medical (ISM) —315, 433.92 y 868 MHz en Europa, 915 MHz en EE.UU.— están reservadas por regulación para dispositivos de corto alcance sin necesidad de licencia individual: mandos de garaje, sensores de temperatura, estaciones meteorológicas, llaves de coche y sistemas de alarma. El ESP32 de la CYD no tiene radio nativa para estas frecuencias, por eso los proyectos Sub-GHz de esta suite requieren soldar un módulo transceptor externo como el CC1101, conectado por SPI a los pines libres de los conectores de expansión CN1/P3.',
          'Técnicamente, la mayoría de estos dispositivos usan modulación OOK (On-Off Keying) o ASK (Amplitude-Shift Keying): la información se codifica simplemente encendiendo y apagando la portadora de radio en una secuencia de pulsos, lo que hace que capturar y analizar la señal con herramientas como el CC1101 sea mucho más sencillo que descifrar la modulación OFDM compleja del Wi-Fi.'
        ]
      },
      {
        heading: 'El ataque de "repetición" (Replay) y por qué funciona en hardware antiguo',
        paragraphs: [
          'Un mando de garaje de los años 90-2000 típico envía siempre el mismo código fijo cada vez que se pulsa el botón. Si un atacante captura esa señal con un receptor Sub-GHz y simplemente la retransmite más tarde (ataque de repetición o "replay"), el receptor del garaje no tiene forma de distinguir la señal original de la copia, porque nunca cambia.',
          'Esta es una de las demostraciones educativas más potentes del módulo Sub-GHz de esta suite: capturar y reproducir (con autorización, sobre equipamiento propio) un código fijo ilustra de forma muy visual por qué la industria tuvo que evolucionar hacia sistemas de código variable.'
        ]
      },
      {
        heading: 'KeeLoq y los códigos variables (rolling codes)',
        paragraphs: [
          'Los sistemas modernos (KeeLoq y derivados, usados en la mayoría de llaves de coche y garajes desde los 2000) resuelven el problema del replay con un contador sincronizado: cada pulsación cifra el contador actual con una clave secreta compartida y lo envía junto con el identificador del mando. El receptor descifra, comprueba que el contador recibido es mayor que el último aceptado (dentro de una ventana de tolerancia) y, si es así, lo acepta y actualiza su propio contador interno.',
          'Esto significa que una señal capturada y repetida más tarde será rechazada, porque su contador ya quedó "usado". Los ataques reales contra KeeLoq (como el "RollJam") no capturan y repiten sin más: interfieren la señal original para que nunca llegue al receptor mientras la graban, de modo que el código capturado sigue siendo "el siguiente válido" cuando se reproduce después — una técnica deliberadamente fuera del alcance de esta suite educativa, que se limita a la demostración conceptual de replay sobre código fijo.'
        ],
        keyPoints: [
          'OOK/ASK: modulación simple, fácil de capturar pero vulnerable a replay si el código es fijo.',
          'KeeLoq (rolling code): contador cifrado sincronizado, inmune a un replay simple.'
        ]
      }
    ],
    practiceLinks: [
      { label: 'Configurar el preset Sub-GHz CC1101 en el Builder', targetTab: 'builder-flasher' },
      { label: 'Ver la carcasa "Mochila Sub-GHz" para el módulo CC1101', targetTab: '3d-enclosure' }
    ],
    quiz: [
      {
        id: 'q6-1',
        question: '¿Por qué un ataque de repetición simple (replay) NO funciona contra un sistema KeeLoq con rolling code?',
        options: [
          { id: 'a', text: 'Porque KeeLoq usa una frecuencia distinta cada vez.', correct: false, explanation: 'Incorrecto: la frecuencia portadora no cambia; lo que cambia es el contenido cifrado del mensaje.' },
          { id: 'b', text: 'Porque cada mensaje incluye un contador cifrado que el receptor solo acepta si es mayor que el último usado, invalidando cualquier copia posterior.', correct: true, explanation: '¡Correcto! Esa sincronización de contador es precisamente lo que neutraliza la repetición simple de una captura antigua.' },
          { id: 'c', text: 'Porque los receptores modernos ignoran cualquier señal Sub-GHz por defecto.', correct: false, explanation: 'Incorrecto: los receptores siguen aceptando señales Sub-GHz válidas; el filtro está en la lógica del contador, no en ignorar la banda.' }
        ]
      }
    ]
  },

  // ======================================================
  // MÓDULO 7 — METODOLOGÍA Y MARCO LEGAL
  // ======================================================
  {
    id: 'mod-legal',
    order: 7,
    level: 'Principiante',
    title: 'Metodología Red/Blue Team y Marco Legal del Hardware Hacking',
    tag: 'Ética · Legislación',
    estimatedMinutes: 15,
    summary: 'Dónde está la línea entre auditoría de seguridad y delito, y cómo estructurar una prueba de intrusión con la CYD sin salir nunca de ese lado legal.',
    sections: [
      {
        heading: 'El documento que lo cambia todo: Rules of Engagement',
        paragraphs: [
          'La diferencia legal entre "investigador de seguridad" y "delincuente informático" casi nunca está en la técnica empleada —el mismo ataque de deauth es idéntico en ambos casos a nivel de bytes— sino en la autorización. Un documento de Rules of Engagement (RoE) o Scope of Work firmado por el responsable legítimo del sistema, especificando qué se puede probar, cuándo y con qué límites, es el requisito mínimo antes de ejecutar cualquier prueba activa (deauth, captura de PMKID, beacon spam) fuera de tu propia infraestructura.',
          'En España, el Código Penal tipifica como delito tanto el acceso no autorizado a sistemas (art. 197 bis) como la interrupción deliberada de las telecomunicaciones de terceros (art. 264), en línea con la Directiva 2013/40/UE sobre ataques a sistemas de información. La falta de intención maliciosa no exime de responsabilidad si no existe autorización formal: practicar un deauth "solo para aprender" contra la red del vecino es ilegal independientemente de la intención.'
        ]
      },
      {
        heading: 'Red Team, Blue Team y Purple Team con la misma placa',
        paragraphs: [
          'Lo interesante de un dispositivo como la CYD es que el mismo hardware sirve para los dos lados de la auditoría. En modo Red Team (Marauder, BadUSB, Beacon Spam) se simulan las técnicas de un atacante para encontrar debilidades antes de que lo haga alguien con intenciones reales. En modo Blue Team (Sentinel IDS, Canary Honeypot) se despliega como sensor defensivo pasivo que detecta esas mismas técnicas cuando las usa un tercero contra tu red.',
          'El enfoque Purple Team combina ambos: usar la CYD en modo ofensivo contra tu propio laboratorio mientras otra CYD (o la misma, en una segunda fase) registra en modo defensivo qué detecta y qué se le escapa, cerrando el ciclo completo de mejora continua.'
        ]
      },
      {
        heading: 'La regla de oro antes de pulsar cualquier botón ofensivo',
        paragraphs: [
          'Antes de usar cualquier función activa de esta suite (deauth, beacon spam, captura PMKID, BadUSB, replay Sub-GHz) pregúntate: ¿soy el propietario legítimo de este sistema, o tengo autorización por escrito de quien lo es? Si la respuesta es no en ambos casos, esa función debe quedarse en el Simulador virtual —que reproduce fielmente el comportamiento sin emitir una sola trama real— en lugar de ejecutarse sobre hardware físico.'
        ],
        keyPoints: [
          'Sin RoE firmado → ninguna prueba activa fuera de tu propia red.',
          'El Simulador de esta suite existe precisamente para practicar sin ese riesgo legal.'
        ]
      }
    ],
    practiceLinks: [
      { label: 'Leer el marco legal completo (Art. 197 bis / 264 CP)', targetTab: 'ethics-methodology' },
      { label: 'Practicar el honeypot defensivo CYD Canary', targetTab: 'simulator' }
    ],
    quiz: [
      {
        id: 'q7-1',
        question: '¿Qué es lo que legalmente distingue una auditoría de seguridad de un delito informático, cuando la técnica usada es idéntica?',
        options: [
          { id: 'a', text: 'La intención declarada del operador.', correct: false, explanation: 'Incorrecto: la buena intención no exime de responsabilidad penal si no hay autorización formal del propietario del sistema.' },
          { id: 'b', text: 'La existencia de autorización formal (RoE / Scope of Work) del propietario legítimo del sistema.', correct: true, explanation: '¡Correcto! Sin esa autorización por escrito, la misma técnica deja de ser una auditoría y pasa a ser un delito tipificado.' },
          { id: 'c', text: 'Que el atacante use software de código abierto en vez de comercial.', correct: false, explanation: 'Incorrecto: la naturaleza (abierta o comercial) de la herramienta empleada no tiene relevancia legal alguna.' }
        ]
      }
    ]
  }
];
