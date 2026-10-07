import React, { useState } from 'react';
import { 
  Scale, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Award, 
  AlertTriangle, 
  Sliders, 
  MapPin, 
  Lock,
  ArrowRight
} from 'lucide-react';

export const EthicsMethodology: React.FC = () => {
  const [calcRssi, setCalcRssi] = useState<number>(-65);
  const [environmentFactor, setEnvironmentFactor] = useState<number>(2.5); // 2.0 = free space, 3.0 = office with walls

  // Log-distance path loss model: Distance = 10 ^ ((Measured Power at 1m - RSSI) / (10 * n))
  const txPowerAt1m = -59; // Typical for 2.4GHz Wi-Fi / BLE at 1 meter
  const calculatedDistance = Math.max(0.1, Math.pow(10, (txPowerAt1m - calcRssi) / (10 * environmentFactor)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span>MARCO ÉTICO Y LEGAL</span>
            <span>·</span>
            <span>HACKING ÉTICO · AUDITORÍAS AUTORIZADAS</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Buenas Prácticas, Legislación y Roadmap de Aprendizaje
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            La potencia de una placa de 12€ como la CYD conlleva responsabilidad legal. Conoce los límites entre la investigación de seguridad defensiva y las infracciones de telecomunicaciones.
          </p>
        </div>
      </div>

      {/* Legal & Ethical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Legal Considerations */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>MARCO JURÍDICO Y LEY</span>
            </span>
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded text-[10px] font-bold">
              Imprescindible Conocer
            </span>
          </div>

          <h3 className="text-base font-bold text-white">
            Límites Penales y Regulatorios
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
            <p>
              • <strong>Ataques de Desautenticación (Deauth):</strong> Emitir tramas 802.11 de desautenticación en redes ajenas constituye una interrupción deliberada de las comunicaciones telemáticas (delito tipificado en el Código Penal español, Art. 197 bis y Art. 264 ter, y leyes equivalentes internacionales como la Computer Fraud and Abuse Act de EE. UU.).
            </p>
            <p>
              • <strong>Invasión de Privacidad BLE:</strong> Usar escáneres BLE o emisores de spam en lugares públicos no autorizados puede vulnerar leyes de protección de datos (RGPD) o interferir con dispositivos médicos de asistencia (audífonos Bluetooth, marcapasos con telemetría).
            </p>
            <p>
              • <strong>Auditorías Autorizadas (Regla de Oro):</strong> Toda prueba de intrusión o test de estrés con la CYD debe realizarse <em>exclusivamente</em> sobre tu propia infraestructura o con autorización formal por escrito (Scope of Work / RoE).
            </p>
          </div>
        </div>

        {/* Card 2: Defensive & White-Hat Approach */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>ENFOQUE WHITE-HAT (BLUE TEAM)</span>
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">
              100% Legal y Recomendado
            </span>
          </div>

          <h3 className="text-base font-bold text-white">
            Uso Defensivo y Formativo sin Riesgos
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
            <p>
              • <strong>Monitoreo Pasivo (IDS CYD Sentinel):</strong> Poner la radio en modo promiscuo para escuchar el tráfico que ya está en el aire de tu propio entorno para detectar si alguien está atacando tu red no emite radiación ni paquetes, siendo completamente legal.
            </p>
            <p>
              • <strong>Detección de Balizas Espía (Anti-Stalking):</strong> Escanear anuncios BLE para verificar que nadie ha colocado un AirTag en tu vehículo o mochila es un derecho fundamental de autoprotección física y privacidad.
            </p>
            <p>
              • <strong>Honeypot de Red Local (CYD Canary):</strong> Colocar un dispositivo señuelo en tu propia red doméstica o corporativa para detectar intrusos o malware que intente propagarse es una de las mejores prácticas de ciberseguridad defensiva.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool: Signal RSSI to Distance Calculator */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono text-amber-400">HERRAMIENTA FORENSE DE RADIOFRECUENCIA</span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400" />
              <span>Calculadora de Proximidad Física por RSSI (dBm a Metros)</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Modelo Log-Distance Path Loss
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Cuando tu CYD detecta un punto de acceso o una baliza AirTag, mide la potencia de señal recibida en decibelios-milivatio (<strong>RSSI</strong>). Con esta fórmula puedes estimar a qué distancia física se encuentra el transmisor en tu entorno:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Slider 1: RSSI */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Señal Medida por la CYD:</span>
              <span className="font-mono text-amber-400 font-bold">{calcRssi} dBm</span>
            </div>
            <input
              type="range"
              min="-95"
              max="-35"
              value={calcRssi}
              onChange={(e) => setCalcRssi(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-95 dBm (Muy débil)</span>
              <span>-35 dBm (Pegado al chip)</span>
            </div>
          </div>

          {/* Slider 2: Environmental Obstacle Factor */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Atenuación del Entorno (n):</span>
              <span className="font-mono text-cyan-400 font-bold">{environmentFactor.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="4.0"
              step="0.1"
              value={environmentFactor}
              onChange={(e) => setEnvironmentFactor(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>2.0 (Espacio abierto)</span>
              <span>4.0 (Paredes de hormigón)</span>
            </div>
          </div>

          {/* Calculated Output Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center items-center text-center">
            <span className="text-[11px] text-slate-400 mb-1">Distancia Estimada:</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {calculatedDistance < 1 
                ? `${(calculatedDistance * 100).toFixed(0)} cm` 
                : `${calculatedDistance.toFixed(1)} metros`}
            </div>
            <span className="text-[10px] text-slate-500 mt-1">
              {calculatedDistance < 2 ? 'Inmediata proximidad' : calculatedDistance < 10 ? 'Misma habitación' : 'Zona distante o con muros'}
            </span>
          </div>
        </div>
      </div>

      {/* Learning Roadmap */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Ruta de Aprendizaje Recomendada con la Placa CYD</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold font-mono text-xs">NIVEL 1 · PRINCIPIANTE</div>
            <div className="font-bold text-white text-sm">CYD Sentinel IDS</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aprende cómo funciona el modo promiscuo en el ESP32 y el formato de cabecera IEEE 802.11 sin emitir un solo paquete.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold font-mono text-xs">NIVEL 2 · INTERMEDIO</div>
            <div className="font-bold text-white text-sm">BLE Hunter & Trackers</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Descifra paquetes de anuncio BLE (Company ID de Apple y Samsung) y aprende a proteger tu privacidad personal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold font-mono text-xs">NIVEL 3 · AVANZADO</div>
            <div className="font-bold text-white text-sm">Marauder & Wardriving</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conecta una tarjeta microSD, captura handshakes PMKID y comprende las debilidades del cifrado WPA2 frente a WPA3.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold font-mono text-xs">NIVEL 4 · EXPERTO</div>
            <div className="font-bold text-white text-sm">Módulo Sub-GHz CC1101</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integra el chip CC1101 en los pines de expansión libres y analiza ondas de radiofrecuencia en bandas ISM (315/433/868 MHz).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
