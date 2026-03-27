export type Role = 'farmer' | 'nabard' | 'insurer' | 'supplier';
export type Hazard = 'drought' | 'flood' | 'heat';
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type TriggerStatus = 'ARMED' | 'MONITOR' | 'NORMAL' | 'FLOOD_WATCH';

export interface DistrictData {
  drought: number; flood: number; heat: number;
  droughtLevel: RiskLevel; floodLevel: RiskLevel; heatLevel: RiskLevel;
  primaryCrop: string; avoidCrops: string[]; advisory: string;
  insuranceTrigger: TriggerStatus;
  soilMoisture: number; ndvi: number; soc: number;
  cropFire: number; landUse: number; vulnIndex: number;
  kccRisk: RiskLevel; kccReduction: number; stressBuffer: number;
  pop: string; agri: string; rain: string; crops: string;
  seedDemand: { bajra: number; jowar: number; cotton: number; turDal: number; chickpea: number };
  trend: number[]; floodTrend: number[]; heatTrend: number[];
}

export interface AppState {
  district: string;
  year: number;
  hazard: Hazard;
  role: Role;
}
