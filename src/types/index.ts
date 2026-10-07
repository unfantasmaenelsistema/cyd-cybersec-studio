export type TabType = 
  | 'overview' 
  | 'simulator' 
  | 'use-cases' 
  | 'hardware-pinout' 
  | 'firmware-generator' 
  | 'builder-flasher'
  | 'community-firmware' 
  | '3d-enclosure'
  | 'pro-academy'
  | 'ethics-methodology';

export interface CustomProjectConfig {
  projectName: string;
  author: string;
  version: string;
  description: string;
  projectType?: 'marauder' | 'sentinel' | 'ble-hunter' | 'wardriving' | 'badusb' | 'subghz' | 'canary';
  enableWiFiPromiscuous: boolean;
  enableDeauthDetection: boolean;
  enablePmkidCapture: boolean;
  enableBeaconSpam: boolean;
  enableProbeSniffer: boolean;
  enableBleHunter: boolean;
  enableBleSpam: boolean;
  enableMicroSDStorage: boolean;
  enableSpeakerAlerts: boolean;
  enableRgbLed: boolean;
  enableTftDisplay: boolean;
  enableTouchControl: boolean;
  enableCC1101SubGhz: boolean;
  enableGpsWardriving: boolean;
  enableBadUsbHid?: boolean;
  enableCanaryAP?: boolean;
  defaultChannel: number;
}

export interface HardwarePin {
  gpio: number;
  label: string;
  category: 'display' | 'touch' | 'sd' | 'peripherals' | 'expansion' | 'power';
  description: string;
  protocol?: string;
  notes?: string;
  warning?: string;
}

export interface UseCase {
  id: string;
  title: string;
  team: 'red' | 'blue' | 'purple' | 'hardware';
  category: string;
  summary: string;
  description: string;
  hardwareNeeded: string[];
  firmwareRecommended: string;
  cydFeaturesUsed: string[];
  howItWorks: string;
  defenseMitigation: string;
  dangerLevel: 'Bajo' | 'Medio' | 'Alto';
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
}

export interface FirmwareTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  filename: string;
  libraries: string[];
  code: string;
  platformioIni: string;
  setupInstructions: string[];
}

export interface CommunityFirmware {
  name: string;
  author: string;
  repoUrl: string;
  description: string;
  highlights: string[];
  requirements: string[];
  flashCommand: string;
  webFlasherUrl?: string;
  category: string;
}
