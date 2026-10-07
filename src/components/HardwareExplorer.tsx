import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Radio, 
  Battery, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  Sliders,
  Sparkles
} from 'lucide-react';
import { CYD_PINS } from '../data/cydData';
import { HardwarePin } from '../types';

export const HardwareExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePin, setActivePin] = useState<HardwarePin | null>(CYD_PINS[0]);
  const [activeTab, setActiveTab] = useState<'pinout' | 'mods' | 'troubleshooting'>('pinout');

  const filteredPins = CYD_PINS.filter((pin) => {
    const matchesCat = selectedCategory === 'all' || pin.category === selectedCategory;
    const matchesSearch = 
      pin.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.gpio.toString().includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>ARQUITECTURA HARDWARE</span>
            <span>·</span>
            <span>ESP32-2432S028R</span>
            <span>·</span>
            <span>PINOUT & MODS</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Anatomía, Pinout y Modificaciones Físicas de la CYD
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Todo lo que necesitas saber sobre el bus SPI compartido, la lógica invertida del LED RGB, los puertos de expansión para módulos de radiofrecuencia (CC1101, GPS) y cómo evitar la pantalla en blanco.
          </p>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('pinout')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'pinout'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matriz de Pines
          </button>
          <button
            onClick={() => setActiveTab('mods')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'mods'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mods de Hardware (Antena/RF)
          </button>
          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'troubleshooting'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Solución de Problemas
          </button>
        </div>
      </div>

      {activeTab === 'pinout' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Filters and Pin Table */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search and category filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por GPIO, etiqueta o función (ej: 21, LED, SPI, MicroSD)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'display', label: 'Pantalla' },
                  { id: 'touch', label: 'Táctil' },
                  { id: 'sd', label: 'MicroSD' },
                  { id: 'peripherals', label: 'Periféricos' },
                  { id: 'expansion', label: 'Expansión' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table of pins */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 text-[11px]">
                      <th className="py-2.5 px-3 font-semibold">GPIO</th>
                      <th className="py-2.5 px-3 font-semibold">Función / Etiqueta</th>
                      <th className="py-2.5 px-3 font-semibold">Bus / Protocolo</th>
                      <th className="py-2.5 px-3 font-semibold">Descripción</th>
                      <th className="py-2.5 px-3 font-semibold">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredPins.map((pin) => {
                      const isSelected = activePin?.gpio === pin.gpio;
                      return (
                        <tr
                          key={pin.gpio}
                          onClick={() => setActivePin(pin)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-500/15 text-amber-200'
                              : 'hover:bg-slate-800/50 text-slate-300'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-bold text-amber-400">
                            GPIO {pin.gpio}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">
                            {pin.label}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                            {pin.protocol || 'GPIO'}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-300 text-[11px] truncate max-w-[200px]">
                            {pin.description}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            <span className="text-[10px] text-amber-400/80 hover:text-amber-300 underline">
                              Detalles
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Detailed inspector card for selected pin */}
          <div className="lg:col-span-4 space-y-4">
            {activePin ? (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono">DETALLE DE HARDWARE</span>
                    <h3 className="text-lg font-bold text-white">
                      GPIO {activePin.gpio} : {activePin.label}
                    </h3>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-300 uppercase">
                    {activePin.category}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px] mb-0.5">Propósito:</div>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      {activePin.description}
                    </p>
                  </div>

                  {activePin.protocol && (
                    <div>
                      <div className="text-slate-400 text-[11px] mb-0.5">Bus / Protocolo:</div>
                      <div className="p-2 rounded bg-slate-950 font-mono text-amber-300 border border-slate-800">
                        {activePin.protocol}
                      </div>
                    </div>
                  )}

                  {activePin.notes && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                      <div className="font-bold flex items-center gap-1.5 mb-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Nota Crítica de Fabricación:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed font-sans">
                        {activePin.notes}
                      </p>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                    <div className="text-slate-400 font-bold mb-1">Snippet en Arduino C++:</div>
                    <pre className="text-emerald-400 overflow-x-auto text-[10px]">
{activePin.category === 'peripherals' && activePin.gpio === 4
  ? `// Encender LED Rojo (Active LOW)\npinMode(4, OUTPUT);\ndigitalWrite(4, LOW); // LOW = ENCENDIDO`
  : activePin.gpio === 21
  ? `// Control de brillo por PWM\nledcSetup(0, 5000, 8);\nledcAttachPin(21, 0);\nledcWrite(0, 180); // Brillo medio`
  : `pinMode(${activePin.gpio}, INPUT);\nint val = digitalRead(${activePin.gpio});`}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
                Selecciona un pin en la tabla para inspeccionar sus características.
              </div>
            )}

            {/* Quick Summary of Buses on CYD */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Distribución de Buses SPI en la CYD</span>
              </div>
              <ul className="text-slate-400 space-y-1 text-[11px]">
                <li>• <strong>HSPI (Display ILI9341):</strong> Pines 12, 13, 14, 15</li>
                <li>• <strong>VSPI (MicroSD Slot):</strong> Pines 18, 19, 23, 5</li>
                <li>• <strong>Touch SPI (XPT2046):</strong> Pines 25, 32, 39, 33, 36</li>
                <li className="text-amber-300/90 pt-1">
                  ✓ Al estar separados físicamente, la tarjeta MicroSD y la pantalla pueden funcionar simultáneamente a alta velocidad sin interferir.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* HARDWARE MODS TAB */}
      {activeTab === 'mods' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MOD 1: External Antenna SMA */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-mono">MOD 1 · RED TEAM & WARDRIVING</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">Alcance x5</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Antena Externa SMA / Conector IPEX (u.FL)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              La CYD viene de fábrica con una antena de pista PCB de baja ganancia (~1.5 dBi). Para auditar redes a larga distancia o hacer wardriving en vehículo, puedes modificar la antena:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-200">Pasos de Soldadura:</div>
              <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[11px]">
                <li>Localiza la resistencia 0Ω cerca de la esquina superior de la antena PCB.</li>
                <li>Con un soldador fino, desoldar la resistencia para desconectar la antena integrada.</li>
                <li>Solda un cable pigtail u.FL / IPEX o conector SMA hembra en el pad adyacente.</li>
                <li>Conecta una antena omnidireccional de +5dBi o una directiva Yagi de 2.4 GHz.</li>
              </ol>
            </div>
            <div className="text-[11px] text-amber-300/90 font-mono">
              Resultado: Permite capturar handshakes y beacons a más de 200 metros de distancia.
            </div>
          </div>

          {/* MOD 2: CC1101 Sub-GHz Bruce */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-400 font-mono">MOD 2 · RADIOFRECUENCIA SUB-GHZ</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">Flipper-Style</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Módulo Transceptor CC1101 (315 / 433 / 868 MHz)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Permite auditar mandos de garaje, sensores meteorológicos ISM y alarmas inalámbricas con el firmware Bruce:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-200">Cableado en Puerto CN1 / P3:</div>
              <ul className="text-slate-400 space-y-1 text-[11px] font-mono">
                <li>• CC1101 VCC  → CYD 3.3V (¡No 5V!)</li>
                <li>• CC1101 GND  → CYD GND</li>
                <li>• CC1101 CSN  → GPIO 27 (Conector CN1)</li>
                <li>• CC1101 MOSI → GPIO 22 (Conector CN1)</li>
                <li>• CC1101 MISO → GPIO 35 (Conector P3)</li>
                <li>• CC1101 SCK  → GPIO 21 o pin SPI libre</li>
              </ul>
            </div>
            <div className="text-[11px] text-cyan-300 font-mono">
              Compatible 100% de fábrica con la app Sub-GHz de Bruce Firmware.
            </div>
          </div>

          {/* MOD 3: Batería LiPo 3.7V + TP4056 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-mono">MOD 3 · PORTABILIDAD TOTAL</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Autonomía 6h+</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Mochila de Batería LiPo 18650 / 3.7V con Cargador
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              La CYD consume aproximadamente 180mA con pantalla encendida y Wi-Fi en modo promiscuo. Con una celda LiPo 18650 de 2500mAh puedes lograr más de 8 horas de auditoría ininterrumpida:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1 text-[11px] text-slate-400">
              <div>• Conecta la celda LiPo a una placa de carga y protección TP4056 (USB-C).</div>
              <div>• Usa un regulador Boost a 5V conectado al pin VIN de la CYD, o alimenta a 3.3V directo con LDO.</div>
              <div>• Añade un interruptor deslizante miniatura (SPDT) para encendido y apagado cómodo.</div>
            </div>
          </div>

          {/* MOD 4: Módulo GPS Serial */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-400 font-mono">MOD 4 · WARDRIVING GEOLOCALIZADO</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">WiGLE Ready</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Módulo GPS NEO-6M / BN-220 en UART
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mapea redes Wi-Fi vulnerables y genera mapas de calor geográficos durante auditorías físicas de perímetro:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1 text-[11px] text-slate-400 font-mono">
              <div>• GPS TX → CYD RX (GPIO 3 o SoftwareSerial en GPIO 22)</div>
              <div>• GPS RX → CYD TX (GPIO 1 o GPIO 27)</div>
              <div>• GPS VCC → CYD 3.3V</div>
              <div>• Formato de salida: Registra sentencias NMEA y exporta a formato WiGLE CSV en la tarjeta MicroSD.</div>
            </div>
          </div>
        </div>
      )}

      {/* TROUBLESHOOTING TAB */}
      {activeTab === 'troubleshooting' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Problema #1: ¿Por qué mi pantalla se queda completamente en blanco (White Screen)?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Este es el problema más común al usar la librería <code className="text-amber-300">TFT_eSPI</code>. Por defecto, la librería intenta usar un controlador genérico en pines erróneos.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1 text-slate-400">
              <div className="text-emerald-400 font-bold">Solución Definitiva:</div>
              <div>1. Reemplazar el archivo <code className="text-amber-300">User_Setup.h</code> dentro de <code className="text-slate-300">Arduino/libraries/TFT_eSPI/</code> con la plantilla que proporcionamos en la pestaña <strong>Generador de Código</strong>.</div>
              <div>2. Asegurarse de que el pin de backlight esté encendido: <code className="text-amber-300">pinMode(21, OUTPUT); digitalWrite(21, HIGH);</code>.</div>
              <div>3. Si tu placa es la variante de 2 conectores USB-C o usa panel ST7789, cambiar el driver a <code className="text-amber-300">#define ST7789_DRIVER</code> en lugar de <code className="text-amber-300">#define ILI9341_2_DRIVER</code>.</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Problema #2: El LED RGB se enciende cuando pongo HIGH y se apaga en LOW</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              La placa CYD tiene el ánodo común de los LEDs conectado a VCC (+3.3V), por lo que los transistores/GPIOs controlan el cátodo hacia masa. Esto se conoce como <strong>Active LOW</strong>.
            </p>
            <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-emerald-400">
              digitalWrite(4, LOW);  // ENCIENDE el LED Rojo<br/>
              digitalWrite(4, HIGH); // APAGA el LED Rojo
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Problema #3: La tarjeta MicroSD no inicializa (SD Card Mount Failed)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              La tarjeta MicroSD en la CYD utiliza el bus VSPI en el pin Chip Select <code className="text-amber-300">GPIO 5</code>. 
              Debes formatear la tarjeta MicroSD obligatoriamente en <strong>FAT32</strong> (no exFAT ni NTFS) y con un tamaño preferente menor o igual a 32GB. En código, inicializa con:
            </p>
            <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-emerald-400">
              SPIClass sdSPI(VSPI);<br/>
              sdSPI.begin(18, 19, 23, 5); // SCK, MISO, MOSI, SS<br/>
              if(!SD.begin(5, sdSPI)) &#123; Serial.println("Fallo al montar SD"); &#125;
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
