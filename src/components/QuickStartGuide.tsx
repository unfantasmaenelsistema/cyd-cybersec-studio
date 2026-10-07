import React, { useState } from 'react';
import { 
  Zap, 
  HardDrive, 
  Cpu, 
  Check, 
  Copy, 
  Terminal, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Usb, 
  Layers, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const QuickStartGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedLinuxCmd, setCopiedLinuxCmd] = useState<boolean>(false);

  const esp32PackageUrl = 'https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json';
  const linuxPermsCmd = 'sudo usermod -a -G dialout $USER';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(esp32PackageUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyLinuxCmd = () => {
    navigator.clipboard.writeText(linuxPermsCmd);
    setCopiedLinuxCmd(true);
    setTimeout(() => setCopiedLinuxCmd(false), 2000);
  };

  const steps = [
    {
      num: 1,
      title: 'Conexión Física de la CYD al PC',
      summary: 'Selección de cable y conector adecuado'
    },
    {
      num: 2,
      title: 'Instalación de Drivers USB (CH340 / CP210x)',
      summary: 'Reconocimiento del puerto COM o ttyUSB'
    },
    {
      num: 3,
      title: 'Configuración de Arduino IDE (ESP32 Core)',
      summary: 'Instalación del SDK de Espressif'
    },
    {
      num: 4,
      title: 'Librería TFT_eSPI (User_Setup.h)',
      summary: 'Configuración gráfica sin pantalla blanca'
    },
    {
      num: 5,
      title: 'Primer Flasheo y Truco del Botón BOOT',
      summary: 'Subida exitosa del primer firmware'
    }
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>GUÍA DE INICIO RÁPIDO · GETTING STARTED</span>
            <span>·</span>
            <span>DE LA CAJA A TU PRIMER FLASHEO</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Paso a Paso: Conectar, Configurar y Flashear tu Placa CYD</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Aprende a conectar la placa CYD al ordenador, instalar los controladores serie necesarios y preparar Arduino IDE en 5 sencillos pasos para evitar los errores comunes.
          </p>
        </div>

        <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
          ESP32-2432S028R Ready
        </span>
      </div>

      {/* Step Progress Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((s) => {
          const isActive = activeStep === s.num;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`p-3 rounded-xl text-left border transition-all ${
                isActive
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-slate-950/70 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-amber-400/90 mb-0.5">
                PASO 0{s.num}
              </div>
              <div className="text-xs font-bold truncate text-white">
                {s.title}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                {s.summary}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Content Card */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
        {/* STEP 1 */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Usb className="w-4 h-4 text-amber-400" />
              <span>PASO 1 DE 5: CONEXIÓN FÍSICA Y ALIMENTACIÓN</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              1. Conexión de la CYD al Ordenador
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p>
                  • <strong>Localiza el puerto USB de programación:</strong> La mayoría de placas Cheap Yellow Display cuentan con dos puertos USB (uno Micro-USB y otro USB-C, o dos puertos USB-C según la remesa). Conecta el cable al puerto inferior junto al chip puente serie.
                </p>
                <p>
                  • <strong>¡Cuidado con los cables "solo carga"!</strong> El 80% de los fallos donde el ordenador no reconoce la placa se deben a cables USB destinados únicamente a cargar teléfonos que carecen de las líneas de datos <strong>D+</strong> y <strong>D-</strong>. Asegúrate de usar un cable de transferencia de datos de buena calidad.
                </p>
                <p>
                  • <strong>Alimentación eléctrica:</strong> El puerto USB de tu PC proporciona los 5V necesarios. Al conectarla, el LED indicador de encendido en la parte trasera de la CYD debe iluminarse de inmediato.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Comprobación Rápida:</span>
                </div>
                <ul className="text-slate-400 space-y-1.5 text-[11px]">
                  <li>✓ ¿Se enciende el LED de power en la placa? (Si no, prueba otro cable o puerto USB).</li>
                  <li>✓ ¿Suena el pitido de dispositivo conectado en Windows/Mac/Linux?</li>
                  <li>✓ No utilices concentradores USB pasivos sin alimentación si la placa se reinicia sola.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>PASO 2 DE 5: INSTALACIÓN DE DRIVERS DEL PUERTO SERIE</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              2. Instalación de Controladores CH340 / CP210x
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Para que tu sistema operativo se comunique con el procesador ESP32 a través del cable USB, necesita el controlador del chip convertidor USB a UART (la gran mayoría de placas CYD integran el chip <strong>WCH CH340C / CH340G</strong> o el <strong>Silicon Labs CP2102</strong>).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Windows */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="text-amber-400 font-mono">1.</span>
                  <span>Windows (10 / 11)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Descarga el instalador oficial <strong>CH341SER.EXE</strong> o el controlador <strong>CP210x Universal Windows Driver</strong>. Ejecuta como administrador y pulsa "INSTALL".
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Aparece en: Adm. de Dispositivos → Puertos (COM y LPT) → USB-SERIAL CH340 (COM3, COM4...)
                </div>
              </div>

              {/* macOS */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="text-amber-400 font-mono">2.</span>
                  <span>macOS (Apple Silicon / Intel)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Descarga el paquete oficial <strong>CH34xVCPDriver.pkg</strong>. Tras instalar, ve a <em>Ajustes del Sistema → Seguridad y Privacidad</em> y autoriza la extensión de kernel.
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Identificador: /dev/cu.usbserial-* o /dev/cu.wchusbserial*
                </div>
              </div>

              {/* Linux */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="text-amber-400 font-mono">3.</span>
                  <span>Linux (Ubuntu / Debian / Arch)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  El módulo viene por defecto en el kernel. Solo necesitas añadir tu usuario al grupo <code className="text-amber-300">dialout</code> para permisos de lectura/escritura:
                </p>
                <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded border border-slate-800 font-mono text-[10px] text-amber-300">
                  <span>{linuxPermsCmd}</span>
                  <button onClick={handleCopyLinuxCmd} className="text-slate-400 hover:text-white">
                    {copiedLinuxCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>PASO 3 DE 5: CONFIGURACIÓN DE ARDUINO IDE</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              3. Preparar el Gestor de Tarjetas ESP32 en Arduino IDE
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-200">
                  A. Añadir la URL oficial del paquete de tarjetas ESP32:
                </span>
                <p className="text-slate-400 text-[11px]">
                  En Arduino IDE, ve a <em>Archivo → Preferencias</em> (o <em>Arduino IDE → Settings</em> en Mac) y pega la siguiente URL en el campo <strong>"Gestor de URLs Adicionales de Tarjetas"</strong>:
                </p>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300">
                  <span className="truncate mr-2">{esp32PackageUrl}</span>
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-sans font-bold transition-colors whitespace-nowrap"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? '¡Copiado!' : 'Copiar URL'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="font-bold text-slate-200">
                  B. Instalar el core ESP32 y seleccionar placa:
                </span>
                <ol className="list-decimal list-inside text-slate-300 space-y-1 text-[11px] leading-relaxed">
                  <li>Ve a <em>Herramientas → Placa → Gestor de Tarjetas</em>, busca <strong>esp32</strong> (por Espressif Systems) e instala la última versión recomendada (v2.0.14 o v3.0+).</li>
                  <li>Selecciona la placa en: <em>Herramientas → Placa → esp32 → <strong>ESP32 Dev Module</strong></em>.</li>
                  <li>Configura los parámetros clave de subida en el menú <em>Herramientas</em>:</li>
                </ol>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500">Upload Speed</div>
                    <div className="text-amber-400 font-bold">921600 (o 115200)</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500">CPU Frequency</div>
                    <div className="text-amber-400 font-bold">240MHz (WiFi/BT)</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500">Flash Frequency</div>
                    <div className="text-amber-400 font-bold">80MHz</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500">Partition Scheme</div>
                    <div className="text-amber-400 font-bold">Huge APP (3MB)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>PASO 4 DE 5: CONFIGURACIÓN DE PANTALLA TFT_eSPI</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              4. Configurar TFT_eSPI para Evitar la Pantalla Blanca
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              La pantalla integrada de la CYD (2.8" ILI9341 320x240) requiere mapear los pines SPI correctos. Si omites este paso, el código compilará pero la pantalla se quedará permanentemente en blanco.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2.5">
              <div className="font-bold text-slate-200">Pasos exactos:</div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
                <li>Instala la librería <strong>TFT_eSPI</strong> (por Bodmer) desde <em>Programa → Incluir Librería → Administrar Bibliotecas</em>.</li>
                <li>Ve a la carpeta de librerías de tu sistema: <code className="text-amber-300">Documentos/Arduino/libraries/TFT_eSPI/</code>.</li>
                <li>Abre el archivo <code className="text-amber-300">User_Setup.h</code> y sustitúyelo por el archivo de configuración que proporcionamos en la pestaña <strong>Generador C++</strong> de esta suite.</li>
                <li>En tu código Arduino, asegúrate de inicializar siempre con:
                  <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-emerald-400 text-[10px]">
                    tft.init();<br/>
                    tft.setRotation(1); // 320x240 horizontal<br/>
                    pinMode(21, OUTPUT); digitalWrite(21, HIGH); // Encender retroiluminación
                  </div>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {activeStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
              <Zap className="w-4 h-4 text-rose-400" />
              <span>PASO 5 DE 5: PRIMER FLASHEO Y BOTÓN BOOT</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              5. Flashear el Firmware y Truco del Botón BOOT
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p>
                  • <strong>Selecciona el puerto COM:</strong> En Arduino IDE, ve a <em>Herramientas → Puerto</em> y selecciona el puerto serie que corresponda a tu CYD (ej: <code className="text-amber-300">COM3</code> o <code className="text-amber-300">/dev/ttyUSB0</code>).
                </p>
                <p>
                  • <strong>Pulsa el botón Subir (Flecha):</strong> El compilador compilará el sketch C++ y comenzará el proceso de subida mediante <em>esptool</em>.
                </p>
                <p>
                  • <strong>¡El truco del botón BOOT!</strong> Si la terminal de Arduino se queda atascada en <code className="text-rose-400">Connecting........_____.....</code>, significa que el circuito de autoreset del CH340 no pudo poner el ESP32 en modo descarga:
                </p>
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-[11px] font-medium">
                  👉 <strong>Solución:</strong> En cuanto veas aparecer los puntos <code className="text-white">Connecting...</code>, mantén pulsado el botón físico <strong>BOOT</strong> de la CYD durante 2 segundos y suéltalo. La transferencia comenzará al instante.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resultado Exitoso del Flasheo:</span>
                </div>
                <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-slate-300 space-y-0.5">
                  <div className="text-slate-500">Writing at 0x00001000... (100%)</div>
                  <div className="text-slate-500">Wrote 1312384 bytes in 15.2 seconds...</div>
                  <div className="text-slate-500">Hash of data verified.</div>
                  <div className="text-emerald-400 font-bold">Hard resetting via RTS pin... [OK]</div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Una vez finalizado, la pantalla táctil de tu CYD arrancará automáticamente mostrando la interfaz del proyecto cargado.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
