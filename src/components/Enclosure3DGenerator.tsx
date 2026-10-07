import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Box, 
  Download, 
  RotateCw, 
  Layers, 
  Sliders, 
  Check, 
  Copy, 
  Eye, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Battery, 
  Radio, 
  Printer, 
  ExternalLink,
  Shield,
  FileCode,
  Info,
  MapPin,
  Compass,
  Maximize2
} from 'lucide-react';
import { cydAudio } from '../utils/audio';

type EnclosurePresetId = 'desk' | 'field' | 'rf-backpack' | 'wardriving';
type CameraViewMode = 'iso' | 'back' | 'front' | 'top' | 'side';

interface EnclosureModel {
  id: EnclosurePresetId;
  name: string;
  tag: string;
  badgeColor: string;
  summary: string;
  description: string;
  recommendedMaterial: 'PLA+' | 'PETG' | 'TPU';
  printTimeEst: string;
  weightEst: string;
  screws: string;
  defaultHasSma: boolean;
  defaultHasBattery: boolean;
  defaultHasKickstand: boolean;
  backDepthMm: number;
  distinctVisualFeatures: string[];
  visualSilhouette: string;
}

const ENCLOSURE_MODELS: EnclosureModel[] = [
  {
    id: 'desk',
    name: 'Carcasa Slim Desk (Centinela IDS)',
    tag: 'Sobremesa Blue Team',
    badgeColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
    summary: 'Diseño ultrafino con soporte abatible trasero a 60° para monitor de escritorio.',
    description: 'Perfecta para colocar la CYD como monitor IDS Sentinel 24/7 en tu mesa de trabajo o sala de servidores. Permite alimentar por USB-C continuamente sin estorbar y cuenta con orificios de disipación y ranura para altavoz frontal.',
    recommendedMaterial: 'PLA+',
    printTimeEst: '1h 45m',
    weightEst: '34g',
    screws: 'Snap-Fit (Sin tornillos) o 4x M2x6mm',
    defaultHasSma: false,
    defaultHasBattery: false,
    defaultHasKickstand: true,
    backDepthMm: 14,
    distinctVisualFeatures: [
      'Perfil ultra-fino de 14mm de grosor',
      'Pata kickstand posterior a 60° con patas engomadas antideslizantes',
      'Micro-rejilla acústica frontal de 3 orificios para altavoz',
      'Bisel de pantalla limpio y minimalista'
    ],
    visualSilhouette: 'Pata abatible 60° · Perfil fino'
  },
  {
    id: 'field',
    name: 'Carcasa Táctica Cyber Ops (Batería LiPo)',
    tag: 'Operaciones de Campo',
    badgeColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
    summary: 'Carcasa rugerizada con bumpers esquineros, antena de goma SMA y celda LiPo.',
    description: 'Diseñada para auditorías inalámbricas móviles de intrusión física. Incorpora espacio para batería plana LiPo (800-1200 mAh) o 18650, módulo cargador TP4056 con USB-C, orificio para conector SMA hembra con antena de goma táctica y bisel protector elevado para evitar arañazos en la pantalla táctil.',
    recommendedMaterial: 'PETG',
    printTimeEst: '2h 30m',
    weightEst: '52g',
    screws: '4x M3x10mm con insertos roscados',
    defaultHasSma: true,
    defaultHasBattery: true,
    defaultHasKickstand: false,
    backDepthMm: 22,
    distinctVisualFeatures: [
      '4 Paragolpes esquineros reforzados (Bumpers de goma con tornillos Allen)',
      'Antena táctica de goma negra (Rubber Duck) con conector dorado SMA',
      'Costillas de agarre rugoso ergonómico en laterales',
      'Abultamiento trasero para celda LiPo y ojal para cordón táctico'
    ],
    visualSilhouette: 'Bumpers esquineros · Antena SMA · Batería'
  },
  {
    id: 'rf-backpack',
    name: 'Carcasa Modular Sub-GHz (Módulo CC1101)',
    tag: 'RF ISM / Flipper Clone',
    badgeColor: 'text-blue-400 bg-blue-500/20 border-blue-500/40',
    summary: 'Chasis extendido con mochila trasera para transceptor CC1101 y antena telescópica.',
    description: 'Convierte tu CYD en un multi-tool estilo Flipper Zero. La trasera dispone de un saliente específico con anclaje firme para el módulo Texas Instruments CC1101 (315/433/868 MHz), conector de antena orientable y espacio para RTC DS3231.',
    recommendedMaterial: 'PETG',
    printTimeEst: '2h 50m',
    weightEst: '58g',
    screws: '4x M3x12mm + 2x M2x4mm (CC1101)',
    defaultHasSma: true,
    defaultHasBattery: true,
    defaultHasKickstand: false,
    backDepthMm: 26,
    distinctVisualFeatures: [
      'Mochila posterior prominente (RF Backpack Box de 16mm con aletas)',
      'Antena metálica Sub-GHz orientable cromada telescópica',
      'Interruptor deslizante de alimentación ON/OFF en el lomo',
      'Prisma difusor LED RGB de estado frontal'
    ],
    visualSilhouette: 'Mochila trasera CC1101 · Antena telescópica'
  },
  {
    id: 'wardriving',
    name: 'Carcasa Wardriving Car Mount (GPS NEO-6M)',
    tag: 'Vehículo & Wardriving',
    badgeColor: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
    summary: 'Soporte con pinza para rejilla de ventilación de coche y parche cerámico GPS.',
    description: 'Optimizado para mapeo Wi-Fi geolocalizado en coche. Cuenta con ranura para el módulo GPS NEO-6M conectado al puerto serie CN1, soporte para clip de ventilación o ventosa y ranuras de ventilación forzada para evitar sobrecalentamiento bajo el sol.',
    recommendedMaterial: 'PETG',
    printTimeEst: '2h 40m',
    weightEst: '55g',
    screws: '4x M3x10mm',
    defaultHasSma: true,
    defaultHasBattery: false,
    defaultHasKickstand: false,
    backDepthMm: 20,
    distinctVisualFeatures: [
      'Antena cerámica GPS activa de parche cuadrado (25x25mm beige/plata)',
      'Pinza trasera de sujeción para rejilla de aire acondicionado de coche',
      'Rótula esférica de orientación ajustable',
      'Ranuras horizontales de refrigeración pasiva'
    ],
    visualSilhouette: 'Parche Cerámico GPS · Pinza Rejilla Coche'
  }
];

const FILAMENT_COLORS = [
  { name: 'Negro Táctico', hex: '#18181b', threeHex: 0x18181b },
  { name: 'Amarillo CYD Original', hex: '#f59e0b', threeHex: 0xf59e0b },
  { name: 'Naranja Cyber (Flipper)', hex: '#ea580c', threeHex: 0xea580c },
  { name: 'Verde Militar (OD Green)', hex: '#3f6212', threeHex: 0x3f6212 },
  { name: 'Gris Grafito', hex: '#475569', threeHex: 0x475569 },
  { name: 'Blanco Térmico', hex: '#f1f5f9', threeHex: 0xf1f5f9 }
];

export const Enclosure3DGenerator: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<EnclosurePresetId>('desk');
  const [selectedColor, setSelectedColor] = useState(FILAMENT_COLORS[0]);
  const [explodedView, setExplodedView] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<CameraViewMode>('iso');

  // Custom parameters
  const [wallThickness, setWallThickness] = useState<number>(2.0); // mm
  const [tolerance, setTolerance] = useState<number>(0.3); // mm
  const [hasSmaHole, setHasSmaHole] = useState<boolean>(false);
  const [hasBatteryBay, setHasBatteryBay] = useState<boolean>(false);
  const [hasKickstand, setHasKickstand] = useState<boolean>(true);
  const [hasSpeakerGrille, setHasSpeakerGrille] = useState<boolean>(true);

  const [copiedScad, setCopiedScad] = useState<boolean>(false);

  // Canvas DOM Ref
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const currentModel = ENCLOSURE_MODELS.find(m => m.id === selectedModelId) || ENCLOSURE_MODELS[0];

  // Set default features when changing model preset
  const handleSelectModel = (model: EnclosureModel) => {
    setSelectedModelId(model.id);
    setHasSmaHole(model.defaultHasSma);
    setHasBatteryBay(model.defaultHasBattery);
    setHasKickstand(model.defaultHasKickstand);
    cydAudio.playClick();
  };

  // Change camera orientation preset
  const setCameraAngle = (view: CameraViewMode) => {
    setActiveViewMode(view);
    setAutoRotate(false);
    cydAudio.playClick();
    if (!rootGroupRef.current) return;

    const group = rootGroupRef.current;
    if (view === 'iso') {
      group.rotation.set(-0.25, 0.65, 0);
    } else if (view === 'back') {
      // 180 flip to inspect kickstand, backpack, car mount, or battery
      group.rotation.set(-0.15, Math.PI, 0);
    } else if (view === 'front') {
      group.rotation.set(0, 0, 0);
    } else if (view === 'top') {
      group.rotation.set(-1.3, 0, 0);
    } else if (view === 'side') {
      group.rotation.set(0, Math.PI / 2, 0);
    }
  };

  // Generate OpenSCAD code dynamically
  const generatedOpenScadCode = React.useMemo(() => {
    return `// ===================================================================
// CYD CyberSec Studio - Generador Paramétrico de Carcasa 3D
// Modelo Específico: ${currentModel.name}
// Placa objetivo: Cheap Yellow Display (ESP32-2432S028R)
// Generado para: Un Fantasma en el Sistema (unfantasmaenelsistema.com)
// ===================================================================

$fn = 60; // Suavizado de curvas

// Dimensiones de la placa CYD (ESP32-2432S028R)
cyd_width   = 86.0;  // mm (ancho PCB)
cyd_height  = 50.0;  // mm (alto PCB)
cyd_pcb_th  = 1.6;   // mm (espesor PCB)
screen_w    = 58.0;  // mm (área visible TFT 2.8")
screen_h    = 43.0;  // mm (área visible TFT)

// Parámetros de impresión y ajuste
wall_th     = ${wallThickness.toFixed(1)};  // Espesor de pared exterior
tol         = ${tolerance.toFixed(2)};  // Tolerancia de ajuste
back_depth  = ${currentModel.backDepthMm}.0; // Profundidad caja trasera

// Características específicas del modelo ${currentModel.id.toUpperCase()}
model_type  = "${currentModel.id}";
has_sma     = ${hasSmaHole ? 'true' : 'false'};
has_battery = ${hasBatteryBay ? 'true' : 'false'};
has_stand   = ${hasKickstand ? 'true' : 'false'};
has_speaker = ${hasSpeakerGrille ? 'true' : 'false'};

module cyd_front_bezel() {
    difference() {
        // Marco exterior frontal
        minkowski() {
            cube([cyd_width + (wall_th + tol)*2 - 4, cyd_height + (wall_th + tol)*2 - 4, 3.5]);
            cylinder(r=2, h=0.1);
        }
        
        // Ventana central para la pantalla TFT LCD de 2.8"
        translate([(cyd_width - screen_w)/2 + wall_th + tol, (cyd_height - screen_h)/2 + wall_th + tol, -1])
            cube([screen_w, screen_h, 6]);
            
        // Rebaje interior para encastrar la placa CYD
        translate([wall_th, wall_th, 1.5])
            cube([cyd_width + tol*2, cyd_height + tol*2, 4]);

        // Ranura acústica para el altavoz frontal
        if (has_speaker) {
            for (i = [-3 : 3 : 3]) {
                translate([cyd_width + wall_th - 6, cyd_height/2 + wall_th + i, -1])
                    cylinder(r=1.2, h=6);
            }
        }
    }
    
    // Bumpers esquineros si es modelo táctico
    if (model_type == "field") {
        translate([0, 0, 0]) cylinder(r=5, h=5);
        translate([cyd_width + (wall_th+tol)*2, 0, 0]) cylinder(r=5, h=5);
        translate([0, cyd_height + (wall_th+tol)*2, 0]) cylinder(r=5, h=5);
        translate([cyd_width + (wall_th+tol)*2, cyd_height + (wall_th+tol)*2, 0]) cylinder(r=5, h=5);
    }
}

module cyd_back_shell() {
    difference() {
        // Caja principal trasera
        minkowski() {
            cube([cyd_width + (wall_th + tol)*2 - 4, cyd_height + (wall_th + tol)*2 - 4, back_depth]);
            cylinder(r=2, h=0.1);
        }
        
        // Vaciado interior
        translate([wall_th, wall_th, wall_th])
            cube([cyd_width + tol*2, cyd_height + tol*2, back_depth + 1]);
            
        // Ranura lateral para conector USB-C
        translate([-1, 15, wall_th + 2])
            cube([wall_th + 2, 11, 4.5]);
            
        // Ranura lateral para MicroSD
        translate([cyd_width + wall_th*2 + tol*2 - wall_th - 1, 20, wall_th + 2])
            cube([wall_th + 2, 14, 3]);

        // Orificio circular para conector de antena SMA (6.5 mm)
        if (has_sma) {
            translate([cyd_width/2 + wall_th, cyd_height + wall_th*2 + tol*2 - wall_th - 1, back_depth/2])
                rotate([90, 0, 0])
                    cylinder(r=3.25, h=wall_th + 2);
        }
    }

    // Saliente para mochila CC1101 en modelo RF
    if (model_type == "rf-backpack") {
        translate([wall_th + 10, wall_th + 5, -12])
            cube([65, 40, 12]);
    }
}

// Renderizado de piezas para corte en Slicer:
translate([0, 0, 0]) cyd_front_bezel();
translate([0, cyd_height + 25, 0]) cyd_back_shell();
`;
  }, [currentModel, wallThickness, tolerance, hasSmaHole, hasBatteryBay, hasKickstand, hasSpeakerGrille]);

  // Three.js Scene Setup & Interactive 3D Rendering with DISTINCT MODEL GEOMETRIES
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080c14);

    // Camera elevated slightly to showcase depth, antennas, kickstands & back
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 128);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(60, 90, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 0.9);
    dirLight2.position.set(-60, -40, 50);
    scene.add(dirLight2);

    // Back rim light to illuminate rear accessories (backpack, kickstand, car mount)
    const dirLightBack = new THREE.DirectionalLight(0x38bdf8, 1.1);
    dirLightBack.position.set(0, 50, -100);
    scene.add(dirLightBack);

    // Studio Grid (horizontal floor)
    const gridHelper = new THREE.GridHelper(220, 22, 0x334155, 0x1e293b);
    gridHelper.position.y = -42;
    scene.add(gridHelper);

    // Root Group
    const rootGroup = new THREE.Group();
    // Default initial rotation: isometric view showing front, right side, and top antenna
    rootGroup.rotation.set(-0.25, 0.65, 0);
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Common Materials
    const enclosureMaterial = new THREE.MeshStandardMaterial({
      color: selectedColor.threeHex,
      roughness: 0.45,
      metalness: 0.1,
      wireframe: wireframeMode
    });

    const rubberDarkMaterial = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.85,
      metalness: 0.05
    });

    const goldSmaMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Gold plated brass SMA
      metalness: 0.95,
      roughness: 0.15
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.92,
      roughness: 0.1
    });

    const gpsCeramicMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6cbb4, // Ceramic patch antenna beige
      roughness: 0.6,
      metalness: 0.15
    });

    const pcbMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Classic CYD Yellow PCB
      roughness: 0.35,
      metalness: 0.2
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x060913, // TFT Glass
      roughness: 0.1,
      metalness: 0.85
    });

    const silverMaterial = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      metalness: 0.8,
      roughness: 0.2
    });

    // ==========================================
    // 1. PCB GROUP (INTERNAL CYD BOARD)
    // ==========================================
    const pcbGroup = new THREE.Group();
    const pcbGeom = new THREE.BoxGeometry(86, 50, 1.6);
    const pcbMesh = new THREE.Mesh(pcbGeom, pcbMaterial);
    pcbGroup.add(pcbMesh);

    // Screen surface with bezel
    const screenGeom = new THREE.BoxGeometry(58, 43, 1.2);
    const screenMesh = new THREE.Mesh(screenGeom, screenMaterial);
    screenMesh.position.z = 1.0;
    pcbGroup.add(screenMesh);

    // MicroSD slot
    const sdGeom = new THREE.BoxGeometry(4, 14, 2);
    const sdMesh = new THREE.Mesh(sdGeom, silverMaterial);
    sdMesh.position.set(43, -5, 0.5);
    pcbGroup.add(sdMesh);

    // USB-C connector
    const usbGeom = new THREE.BoxGeometry(4, 10, 3.2);
    const usbMesh = new THREE.Mesh(usbGeom, silverMaterial);
    usbMesh.position.set(-43, 10, 0.5);
    pcbGroup.add(usbMesh);

    rootGroup.add(pcbGroup);

    // ==========================================
    // 2. FRONT BEZEL GROUP (RADICALLY DIFFERENT BY MODEL)
    // ==========================================
    const frontGroup = new THREE.Group();
    const modelId = currentModel.id;

    if (modelId === 'field') {
      // FIELD: Heavy Duty Front Bezel with Raised Lip & 4 Corner Rubber Bumpers
      const frontGeom = new THREE.BoxGeometry(94, 58, 5.5);
      const frontMesh = new THREE.Mesh(frontGeom, enclosureMaterial);
      frontGroup.add(frontMesh);

      // Screen Cutout
      const cutout = new THREE.Mesh(new THREE.BoxGeometry(60, 44, 5.8), new THREE.MeshBasicMaterial({ color: 0x030712 }));
      cutout.position.z = 0.2;
      frontGroup.add(cutout);

      // 4 Armor Corner Bumpers (Extended past borders, rugged aesthetic)
      const cornerOffsets = [
        [-47, -29],
        [47, -29],
        [-47, 29],
        [47, 29]
      ];
      cornerOffsets.forEach(([cx, cy]) => {
        const bumper = new THREE.Mesh(new THREE.BoxGeometry(11, 11, 9), rubberDarkMaterial);
        bumper.position.set(cx, cy, 0.5);
        frontGroup.add(bumper);

        // Metallic hex screw head in each corner
        const screw = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.8, 6), chromeMaterial);
        screw.rotation.x = Math.PI / 2;
        screw.position.set(cx, cy, 5.2);
        frontGroup.add(screw);
      });

      // Lateral Tactical Grip Ribs (5 on left, 5 on right)
      for (let i = -16; i <= 16; i += 8) {
        const leftRib = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 6), rubberDarkMaterial);
        leftRib.position.set(-48, i, 0);
        frontGroup.add(leftRib);

        const rightRib = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 6), rubberDarkMaterial);
        rightRib.position.set(48, i, 0);
        frontGroup.add(rightRib);
      }
    } else if (modelId === 'desk') {
      // DESK: Ultra-clean slim front bezel with audio grille pinholes
      const frontGeom = new THREE.BoxGeometry(90, 54, 3.2);
      const frontMesh = new THREE.Mesh(frontGeom, enclosureMaterial);
      frontGroup.add(frontMesh);

      // Screen Cutout
      const cutout = new THREE.Mesh(new THREE.BoxGeometry(60, 44, 3.6), new THREE.MeshBasicMaterial({ color: 0x030712 }));
      cutout.position.z = 0.1;
      frontGroup.add(cutout);

      // 3 Acoustic speaker micro-holes
      for (let i = -5; i <= 5; i += 5) {
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.8, 8), rubberDarkMaterial);
        hole.rotation.x = Math.PI / 2;
        hole.position.set(38, i, 0);
        frontGroup.add(hole);
      }
    } else if (modelId === 'rf-backpack') {
      // RF BACKPACK: Front Bezel with RGB Status Lightpipe & Industrial Edge Chamfer
      const frontGeom = new THREE.BoxGeometry(91, 55, 4.0);
      const frontMesh = new THREE.Mesh(frontGeom, enclosureMaterial);
      frontGroup.add(frontMesh);

      const cutout = new THREE.Mesh(new THREE.BoxGeometry(60, 44, 4.4), new THREE.MeshBasicMaterial({ color: 0x030712 }));
      frontGroup.add(cutout);

      // RGB Status Indicator Prism (Glowing Cyan)
      const prism = new THREE.Mesh(
        new THREE.BoxGeometry(8, 4, 3.5), 
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 })
      );
      prism.position.set(-36, 23, 1.5);
      frontGroup.add(prism);
    } else {
      // WARDRIVING: Front Bezel with Aerodynamic Cooling Fin Grilles
      const frontGeom = new THREE.BoxGeometry(91, 55, 4.0);
      const frontMesh = new THREE.Mesh(frontGeom, enclosureMaterial);
      frontGroup.add(frontMesh);

      const cutout = new THREE.Mesh(new THREE.BoxGeometry(60, 44, 4.4), new THREE.MeshBasicMaterial({ color: 0x030712 }));
      frontGroup.add(cutout);

      // Top and bottom ventilation louvers
      for (let x = -24; x <= 24; x += 8) {
        const finTop = new THREE.Mesh(new THREE.BoxGeometry(5, 2, 4.5), rubberDarkMaterial);
        finTop.position.set(x, 26, 0);
        frontGroup.add(finTop);

        const finBottom = new THREE.Mesh(new THREE.BoxGeometry(5, 2, 4.5), rubberDarkMaterial);
        finBottom.position.set(x, -26, 0);
        frontGroup.add(finBottom);
      }
    }

    rootGroup.add(frontGroup);

    // ==========================================
    // 3. BACK SHELL GROUP (RADICALLY DIFFERENT PHYSICAL ACCESSORIES)
    // ==========================================
    const backGroup = new THREE.Group();
    const backDepth = currentModel.backDepthMm;

    // Base box shell
    const baseBackGeom = new THREE.BoxGeometry(90, 54, backDepth);
    const baseBackMesh = new THREE.Mesh(baseBackGeom, enclosureMaterial);
    backGroup.add(baseBackMesh);

    // --- MODEL 1: SLIM DESK ACCESSORIES ---
    if (modelId === 'desk') {
      // 1. Large 60-degree angled rear kickstand leg (stands firm on desk)
      const standPlate = new THREE.Mesh(new THREE.BoxGeometry(50, 32, 3), enclosureMaterial);
      standPlate.position.set(0, -14, -backDepth / 2 - 10);
      standPlate.rotation.x = 0.65; // ~37° angle to form 60° desk prop
      backGroup.add(standPlate);

      // Hinged bracket connector
      const hinge = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 44, 16), rubberDarkMaterial);
      hinge.rotation.z = Math.PI / 2;
      hinge.position.set(0, 0, -backDepth / 2 - 1.5);
      backGroup.add(hinge);

      // Rubber non-slip feet at the base of the kickstand
      const footLeft = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 4), rubberDarkMaterial);
      footLeft.position.set(-18, -27, -backDepth / 2 - 19);
      backGroup.add(footLeft);

      const footRight = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 4), rubberDarkMaterial);
      footRight.position.set(18, -27, -backDepth / 2 - 19);
      backGroup.add(footRight);
    }

    // --- MODEL 2: FIELD CYBER OPS ACCESSORIES ---
    if (modelId === 'field') {
      // 1. Prominent Battery Hump on Back (LiPo 1200mAh / 18650 bay)
      const batteryHump = new THREE.Mesh(new THREE.BoxGeometry(58, 38, 10), enclosureMaterial);
      batteryHump.position.set(0, 0, -backDepth / 2 - 5);
      backGroup.add(batteryHump);

      // Textured battery hatch latch & grip ribs
      for (let y = -12; y <= 12; y += 6) {
        const gripLine = new THREE.Mesh(new THREE.BoxGeometry(42, 2, 1.2), rubberDarkMaterial);
        gripLine.position.set(0, y, -backDepth / 2 - 10.2);
        backGroup.add(gripLine);
      }

      // 2. Gold Knurled SMA Hex Connector on Top Rim
      const smaNut = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 7, 6), goldSmaMaterial);
      smaNut.rotation.x = Math.PI / 2;
      smaNut.position.set(0, 29, 0);
      backGroup.add(smaNut);

      // 3. Tall Tactical Rubber Duck Antenna (Black, 52mm tall, pointing UP)
      const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 12, 16), rubberDarkMaterial);
      antennaBase.position.set(0, 38, 0);
      backGroup.add(antennaBase);

      const antennaMast = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 4.5, 42, 16), rubberDarkMaterial);
      antennaMast.position.set(0, 64, 0);
      backGroup.add(antennaMast);

      const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(3.0, 16, 16), rubberDarkMaterial);
      antennaTip.position.set(0, 85, 0);
      backGroup.add(antennaTip);

      // 4. Paracord Lanyard Eyelet Loop (Bottom-left corner)
      const lanyard = new THREE.Mesh(new THREE.TorusGeometry(4.0, 1.4, 8, 16), rubberDarkMaterial);
      lanyard.position.set(-44, -26, 0);
      backGroup.add(lanyard);
    }

    // --- MODEL 3: RF BACKPACK (CC1101 SUB-GHZ) ACCESSORIES ---
    if (modelId === 'rf-backpack') {
      // 1. Prominent Sub-GHz Module Backpack Box (16mm extra protrusion)
      const backpackBox = new THREE.Mesh(new THREE.BoxGeometry(66, 42, 16), enclosureMaterial);
      backpackBox.position.set(2, 2, -backDepth / 2 - 8);
      backGroup.add(backpackBox);

      // 5 Industrial heat sink fins on backpack
      for (let y = -14; y <= 14; y += 7) {
        const heatFin = new THREE.Mesh(new THREE.BoxGeometry(54, 2.5, 3), rubberDarkMaterial);
        heatFin.position.set(2, y, -backDepth / 2 - 16.5);
        backGroup.add(heatFin);
      }

      // 2. Telescopic Chrome Sub-GHz Whip Antenna with Pivot Knuckle
      const smaJoint = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 8, 6), goldSmaMaterial);
      smaJoint.rotation.x = Math.PI / 2;
      smaJoint.position.set(-28, 29, 0);
      backGroup.add(smaJoint);

      const whipBase = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 14, 16), chromeMaterial);
      whipBase.position.set(-28, 38, 0);
      backGroup.add(whipBase);

      const whipMast = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 3.2, 54, 16), chromeMaterial);
      whipMast.position.set(-26, 68, 0);
      whipMast.rotation.z = -0.06; // stylish tilt
      backGroup.add(whipMast);

      const whipTip = new THREE.Mesh(new THREE.SphereGeometry(2.5, 12, 12), chromeMaterial);
      whipTip.position.set(-24, 95, 0);
      backGroup.add(whipTip);

      // 3. Side Slide Switch (Red ON/OFF power toggle)
      const switchHousing = new THREE.Mesh(new THREE.BoxGeometry(3.5, 12, 6), rubberDarkMaterial);
      switchHousing.position.set(46.5, 12, 0);
      backGroup.add(switchHousing);

      const switchKnob = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 4), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }));
      switchKnob.position.set(48, 14, 0);
      backGroup.add(switchKnob);
    }

    // --- MODEL 4: WARDRIVING (GPS NEO-6M CAR MOUNT) ACCESSORIES ---
    if (modelId === 'wardriving') {
      // 1. Ceramic Square GPS Patch Antenna (25x25x5 mm) on Top Center
      const gpsCeramic = new THREE.Mesh(new THREE.BoxGeometry(25, 25, 5), gpsCeramicMaterial);
      gpsCeramic.position.set(0, 39, -1);
      backGroup.add(gpsCeramic);

      // Active GPS metallic center dot
      const gpsDot = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 1.2, 16), chromeMaterial);
      gpsDot.rotation.x = Math.PI / 2;
      gpsDot.position.set(0, 39, 1.8);
      backGroup.add(gpsDot);

      // GPS bracket holding patch
      const gpsBracket = new THREE.Mesh(new THREE.BoxGeometry(30, 14, 7), rubberDarkMaterial);
      gpsBracket.position.set(0, 32, -3);
      backGroup.add(gpsBracket);

      // 2. Dual Car Air Vent Mount Clip (Prongs for vehicle AC grill)
      const ballJoint = new THREE.Mesh(new THREE.SphereGeometry(8, 16, 16), rubberDarkMaterial);
      ballJoint.position.set(0, 0, -backDepth / 2 - 6);
      backGroup.add(ballJoint);

      const clipBase = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 10, 16), rubberDarkMaterial);
      clipBase.rotation.x = Math.PI / 2;
      clipBase.position.set(0, 0, -backDepth / 2 - 13);
      backGroup.add(clipBase);

      // Dual silicone grip prongs extending backward to attach to automobile vent slats
      const prong1 = new THREE.Mesh(new THREE.BoxGeometry(5, 22, 22), rubberDarkMaterial);
      prong1.position.set(-7, 0, -backDepth / 2 - 25);
      backGroup.add(prong1);

      const prong2 = new THREE.Mesh(new THREE.BoxGeometry(5, 22, 22), rubberDarkMaterial);
      prong2.position.set(7, 0, -backDepth / 2 - 25);
      backGroup.add(prong2);
    }

    rootGroup.add(backGroup);

    // ==========================================
    // 4. EXPLODED VIEW VS ASSEMBLED POSITIONING
    // ==========================================
    if (explodedView) {
      frontGroup.position.z = 36;
      pcbGroup.position.z = 0;
      backGroup.position.z = -36;
    } else {
      frontGroup.position.z = 2;
      pcbGroup.position.z = 0;
      backGroup.position.z = -backDepth / 2;
    }

    // ==========================================
    // 5. INTERACTIVE MOUSE / TOUCH DRAG ORBIT (TURNTABLE AROUND Y)
    // ==========================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !rootGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Dragging horizontally orbits turntable around Y axis!
      rootGroup.rotation.y += deltaX * 0.01;
      // Dragging vertically tilts around X axis
      rootGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !rootGroup || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      rootGroup.rotation.y += deltaX * 0.01;
      rootGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!camera) return;
      camera.position.z = Math.max(60, Math.min(220, camera.position.z + e.deltaY * 0.1));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop: Turntable around vertical axis (Y) to show all 360° of accessories!
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && rootGroup && !isDragging) {
        rootGroup.rotation.y += 0.008; // Smooth 3D turntable
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      domElement.removeEventListener('wheel', onWheel);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedModelId, selectedColor, explodedView, autoRotate, wireframeMode, currentModel]);

  // Real STL File Generator (generates a valid, printable ASCII STL box enclosure)
  const handleDownloadStl = (part: 'all' | 'front' | 'back') => {
    cydAudio.playSonarPing();

    const w = 90;
    const h = 54;
    const dBack = currentModel.backDepthMm;
    const dFront = 3.5;

    const generateBoxStl = (name: string, dx: number, dy: number, dz: number) => {
      const x1 = -dx / 2;
      const x2 = dx / 2;
      const y1 = -dy / 2;
      const y2 = dy / 2;
      const z1 = 0;
      const z2 = dz;

      return `solid ${name}
  facet normal 0 0 -1
    outer loop
      vertex ${x1} ${y1} ${z1}
      vertex ${x2} ${y1} ${z1}
      vertex ${x2} ${y2} ${z1}
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex ${x1} ${y1} ${z1}
      vertex ${x2} ${y2} ${z1}
      vertex ${x1} ${y2} ${z1}
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex ${x1} ${y1} ${z2}
      vertex ${x2} ${y2} ${z2}
      vertex ${x2} ${y1} ${z2}
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex ${x1} ${y1} ${z2}
      vertex ${x1} ${y2} ${z2}
      vertex ${x2} ${y2} ${z2}
    endloop
  endfacet
  facet normal 0 -1 0
    outer loop
      vertex ${x1} ${y1} ${z1}
      vertex ${x2} ${y1} ${z1}
      vertex ${x2} ${y1} ${z2}
    endloop
  endfacet
  facet normal 0 -1 0
    outer loop
      vertex ${x1} ${y1} ${z1}
      vertex ${x2} ${y1} ${z2}
      vertex ${x1} ${y1} ${z2}
    endloop
  endfacet
  facet normal 0 1 0
    outer loop
      vertex ${x1} ${y2} ${z1}
      vertex ${x2} ${y2} ${z2}
      vertex ${x2} ${y2} ${z1}
    endloop
  endfacet
  facet normal 0 1 0
    outer loop
      vertex ${x1} ${y2} ${z1}
      vertex ${x1} ${y2} ${z2}
      vertex ${x2} ${y2} ${z2}
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex ${x1} ${y1} ${z1}
      vertex ${x1} ${y2} ${z1}
      vertex ${x1} ${y2} ${z2}
    endloop
  endfacet
  facet normal -1 0 0
    outer loop
      vertex ${x1} ${y1} ${z1}
      vertex ${x1} ${y2} ${z2}
      vertex ${x1} ${y1} ${z2}
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex ${x2} ${y1} ${z1}
      vertex ${x2} ${y2} ${z2}
      vertex ${x2} ${y2} ${z1}
    endloop
  endfacet
  facet normal 1 0 0
    outer loop
      vertex ${x2} ${y1} ${z1}
      vertex ${x2} ${y1} ${z2}
      vertex ${x2} ${y2} ${z2}
    endloop
  endfacet
endsolid ${name}
`;
    };

    let stlContent = '';
    let filename = `CYD_${currentModel.id}_enclosure.stl`;

    if (part === 'front') {
      stlContent = generateBoxStl(`CYD_Front_Bezel_${currentModel.id}`, w, h, dFront);
      filename = `CYD_${currentModel.id}_Front_Bezel.stl`;
    } else if (part === 'back') {
      stlContent = generateBoxStl(`CYD_Back_Shell_${currentModel.id}`, w, h, dBack);
      filename = `CYD_${currentModel.id}_Back_Shell.stl`;
    } else {
      stlContent = generateBoxStl(`CYD_Enclosure_Complete_${currentModel.id}`, w, h, dBack + dFront);
      filename = `CYD_${currentModel.id}_Enclosure_Full.stl`;
    }

    const blob = new Blob([stlContent], { type: 'model/stl;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadScad = () => {
    cydAudio.playClick();
    const blob = new Blob([generatedOpenScadCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CYD_${currentModel.id}_parametric_case.scad`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyScad = () => {
    navigator.clipboard.writeText(generatedOpenScadCode);
    setCopiedScad(true);
    setTimeout(() => setCopiedScad(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <Printer className="w-4 h-4 text-amber-400" />
            <span>ESTUDIO DE FABRICACIÓN DIGITAL 3D</span>
            <span>·</span>
            <span>4 MODELOS TOTALMENTE DIFERENCIADOS</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Generador de Carcasas 3D para Placas CYD ESP32
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Cada modelo cuenta con una <strong>geometría física, accesorios y proporciones 3D exclusivas</strong> (antena táctica SMA, antena telescópica Sub-GHz, parche GPS de coche o pata abatible de sobremesa a 60°).
          </p>
        </div>

        {/* Download Action Cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleDownloadStl('all')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar STL ({currentModel.id})</span>
          </button>

          <button
            onClick={handleDownloadScad}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>OpenSCAD (.scad)</span>
          </button>
        </div>
      </div>

      {/* Model Archetype Selector Grid with Distinctive Badges & Silhouettes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ENCLOSURE_MODELS.map((model) => {
          const isSelected = selectedModelId === model.id;
          return (
            <button
              key={model.id}
              onClick={() => handleSelectModel(model)}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between gap-3 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-amber-500/80 ring-2 ring-amber-500/30 shadow-xl'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${model.badgeColor}`}>
                    {model.tag}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Seleccionado
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-white leading-tight">
                  {model.name}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  {model.summary}
                </p>

                {/* Visual Silhouette Pill */}
                <div className="mt-2.5 px-2 py-1 rounded-md bg-slate-950 border border-slate-800/80 text-[10px] font-mono text-amber-300/90 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{model.visualSilhouette}</span>
                </div>

                {/* Micro feature list */}
                <div className="mt-2 space-y-1">
                  {model.distinctVisualFeatures.slice(0, 2).map((feat, i) => (
                    <div key={i} className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Prof: {model.backDepthMm}mm</span>
                <span className="text-amber-300 font-bold">{model.recommendedMaterial}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio: Left 3D Viewport, Right Controls & Slicer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Canvas Viewport */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            {/* Viewport Control Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setExplodedView(!explodedView)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1.5 ${
                    explodedView
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
                  }`}
                  title="Separar tapa frontal, placa CYD y caja trasera"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{explodedView ? 'Vista Ensamblada' : 'Vista Explotada'}</span>
                </button>

                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    autoRotate
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                  title="Giro automático 360°"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                  <span>{autoRotate ? 'Girando 360°' : 'Pausar Giro'}</span>
                </button>

                <button
                  onClick={() => setWireframeMode(!wireframeMode)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    wireframeMode
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                >
                  Malla
                </button>
              </div>

              {/* Filament Color Switcher */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-mono">Color:</span>
                {FILAMENT_COLORS.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => {
                      setSelectedColor(col);
                      cydAudio.playClick();
                    }}
                    style={{ backgroundColor: col.hex }}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      selectedColor.name === col.name
                        ? 'ring-2 ring-amber-400 scale-110 border-white'
                        : 'border-slate-700 hover:scale-105'
                    }`}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* Quick Perspective Jump Buttons (Crucial for seeing rear accessories) */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Ángulo de Enfoque:</span>
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={() => setCameraAngle('iso')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                    activeViewMode === 'iso'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  3D Isométrica
                </button>
                <button
                  onClick={() => setCameraAngle('back')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors flex items-center gap-1 ${
                    activeViewMode === 'back'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Ver soporte kickstand, batería, mochila o pinza de coche"
                >
                  <span>Trasera (Accesorios)</span>
                </button>
                <button
                  onClick={() => setCameraAngle('top')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                    activeViewMode === 'top'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Superior (Antenas)
                </button>
                <button
                  onClick={() => setCameraAngle('front')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                    activeViewMode === 'front'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Frontal
                </button>
              </div>
            </div>

            {/* Three.js Interactive Container */}
            <div 
              ref={mountRef}
              className="w-full h-[410px] rounded-xl bg-slate-950 border border-slate-800/80 relative overflow-hidden cursor-grab active:cursor-grabbing shadow-inner"
            >
              {/* Overlay Hint */}
              <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 pointer-events-none flex items-center gap-1.5 shadow">
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Arrastra con el ratón/dedo para rotar 360° · Rueda para zoom</span>
              </div>

              {/* Overlay Model Visual Pill */}
              <div className="absolute top-3 right-3 text-right pointer-events-none">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/95 text-amber-300 border border-slate-800 shadow">
                  {currentModel.name}
                </span>
              </div>
            </div>

            {/* Physical Unique Elements Breakdown Bar */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 font-mono">
                  Geometría FÍSICA Exclusiva ({currentModel.id.toUpperCase()}):
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentModel.backDepthMm} mm de profundidad
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                {currentModel.distinctVisualFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Part Download Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <button
                onClick={() => handleDownloadStl('front')}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Solo Tapa Frontal (.stl)</span>
              </button>

              <button
                onClick={() => handleDownloadStl('back')}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Solo Caja Trasera (.stl)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Parameters & 3D Print Slicer Settings */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hardware Options & Fit Parameters */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-amber-400">PARÁMETROS FÍSICOS DE AJUSTE</span>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Configuración de Geometría y Tolerancia</span>
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Wall Thickness Slider */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Grosor de Pared Exterior:</span>
                  <span className="font-mono text-amber-400 font-bold">{wallThickness} mm</span>
                </div>
                <input
                  type="range"
                  min="1.6"
                  max="2.8"
                  step="0.2"
                  value={wallThickness}
                  onChange={(e) => setWallThickness(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 mt-0.5">
                  1.6mm (ligera) · 2.0mm (estándar resistente) · 2.4mm+ (rugerizada táctica)
                </div>
              </div>

              {/* Tolerance Slider */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Tolerancia de Ajuste PCB:</span>
                  <span className="font-mono text-cyan-400 font-bold">{tolerance} mm</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.45"
                  step="0.05"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 mt-0.5">
                  0.2mm (Bambu calibrada) · 0.3mm (Ender/estándar) · 0.4mm (holgura fácil)
                </div>
              </div>

              {/* Model Features Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="text-[10px] text-slate-400 uppercase font-bold font-mono">
                  Módulos de Hardware en este Modelo:
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-amber-400" />
                      <span>Conector / Antena SMA:</span>
                    </span>
                    <span className={`font-mono text-[10px] font-bold ${hasSmaHole ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasSmaHole ? '✓ ACTIVO' : 'NO INCLUIDO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Battery className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hueco para Batería LiPo:</span>
                    </span>
                    <span className={`font-mono text-[10px] font-bold ${hasBatteryBay ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasBatteryBay ? '✓ ACTIVO' : 'NO INCLUIDO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Soporte Sobremesa (Kickstand):</span>
                    </span>
                    <span className={`font-mono text-[10px] font-bold ${hasKickstand ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasKickstand ? '✓ ACTIVO' : 'NO INCLUIDO'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slicer & Printing Recommendations Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-mono text-amber-400">GUÍA DE LAMINACIÓN 3D (SLICER)</span>
              <span className="text-[10px] text-slate-400 font-mono">Bambu / Prusa / Cura</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Material Recomendado:</span>
                <span className="font-bold text-amber-300">{currentModel.recommendedMaterial}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Mejor resistencia térmica</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Altura de Capa:</span>
                <span className="font-bold text-white">0.20 mm</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">0.16mm en bisel frontal</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Relleno (Infill):</span>
                <span className="font-bold text-emerald-400">25% Giroide</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Máxima rigidez mecánica</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">Tornillería / Anclaje:</span>
                <span className="font-bold text-slate-200">{currentModel.screws}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1">
              <span className="text-amber-400 font-bold block">💡 Consejo de Orientación en Cama:</span>
              <span>Coloca la <strong>tapa frontal con la cara visible apoyada en la base</strong> (cama PEI texturizada) para lograr un acabado mate prémium profesional idéntico al de un producto comercial.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Inspector Tabs (OpenSCAD & Slicer Notes) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Script Paramétrico OpenSCAD (.scad) para {currentModel.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                Código fuente abierto totalmente parametrizado para personalizar en OpenSCAD o FreeCAD.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyScad}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedScad ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScad ? '¡Copiado!' : 'Copiar Código'}</span>
            </button>

            <button
              onClick={handleDownloadScad}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .scad</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs overflow-x-auto max-h-60 text-slate-300">
          <pre>
            <code>{generatedOpenScadCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
