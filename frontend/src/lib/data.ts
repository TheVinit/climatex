import { DistrictData, RiskLevel } from './types';

export const YEARS = [2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039];
export const MH_AVERAGE = [38,39,40,41,42,43,43,44,45,46,46,47,47,48,48];

export const DISTRICT_DATA_MAP: Record<string, DistrictData> = {
  'Palghar': {
    drought: 32, flood: 72, heat: 38, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'MEDIUM',
    primaryCrop: 'Rice / Cashew', avoidCrops: ['Wheat'],
    advisory: 'Flood risk high in coastal zones. Ensure drainage for Kharif rice.',
    insuranceTrigger: 'FLOOD_WATCH', soilMoisture: 48.2, ndvi: 0.58, soc: 0.72, cropFire: 12, landUse: 45, vulnIndex: 0.42,
    kccRisk: 'LOW', kccReduction: 5, stressBuffer: 8,
    pop: '29.9L', agri: '3.2L ha', rain: '2400mm', crops: 'Rice, Cashew',
    seedDemand: { bajra: 2000, jowar: 1500, cotton: 500, turDal: 8000, chickpea: 4000 },
    trend: [30,31,31,32,32,33,33,34,34,34,35,35,36,36,36],
    floodTrend: [65,68,70,71,72,72,72,72,72,72,72,72,72,72,72],
    heatTrend: [35,36,36,37,38,38,38,38,38,38,38,38,38,38,38]
  },
  'Thane': {
    drought: 28, flood: 65, heat: 42, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'MEDIUM',
    primaryCrop: 'Rice / Vegetables', avoidCrops: [],
    advisory: 'Monitor monsoon intensity; saline ingress risk in low-lying fields.',
    insuranceTrigger: 'NORMAL', soilMoisture: 42.5, ndvi: 0.45, soc: 0.65, cropFire: 8, landUse: 38, vulnIndex: 0.38,
    kccRisk: 'LOW', kccReduction: 5, stressBuffer: 5,
    pop: '110.6L', agri: '1.8L ha', rain: '2200mm', crops: 'Rice, Veg',
    seedDemand: { bajra: 1000, jowar: 800, cotton: 200, turDal: 5000, chickpea: 3000 },
    trend: [25,26,26,27,27,28,28,28,29,29,29,29,30,30,30],
    floodTrend: [60,62,63,64,65,65,65,65,65,65,65,65,65,65,65],
    heatTrend: [40,41,41,42,42,42,42,42,42,42,42,42,42,42,42]
  },
  'Mumbai': {
    drought: 25, flood: 85, heat: 45, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'MEDIUM',
    primaryCrop: 'Urban Farming / Fisheries', avoidCrops: [],
    advisory: 'Severe flood inundation risk. Infrastructure protection prioritized.',
    insuranceTrigger: 'FLOOD_WATCH', soilMoisture: 12.0, ndvi: 0.12, soc: 0.25, cropFire: 5, landUse: 95, vulnIndex: 0.55,
    kccRisk: 'LOW', kccReduction: 0, stressBuffer: 2,
    pop: '124.4L', agri: '0.05L ha', rain: '2100mm', crops: 'Fisheries',
    seedDemand: { bajra: 0, jowar: 0, cotton: 0, turDal: 100, chickpea: 50 },
    trend: [22,23,23,24,24,25,25,25,25,25,25,25,25,25,25],
    floodTrend: [80,82,83,84,85,85,85,85,85,85,85,85,85,85,85],
    heatTrend: [42,43,44,44,45,45,45,45,45,45,45,45,45,45,45]
  },
  'Raigad': {
    drought: 30, flood: 68, heat: 35, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'LOW',
    primaryCrop: 'Rice / Coconut', avoidCrops: ['Sugarcane'],
    advisory: 'Protect coastal plantations from storm surges.',
    insuranceTrigger: 'NORMAL', soilMoisture: 45.4, ndvi: 0.52, soc: 0.68, cropFire: 10, landUse: 42, vulnIndex: 0.35,
    kccRisk: 'LOW', kccReduction: 5, stressBuffer: 6,
    pop: '26.3L', agri: '2.5L ha', rain: '3100mm', crops: 'Rice, Coconut',
    seedDemand: { bajra: 500, jowar: 400, cotton: 100, turDal: 6000, chickpea: 2000 },
    trend: [28,29,29,30,30,30,30,31,31,31,31,31,31,31,31],
    floodTrend: [62,65,66,67,68,68,68,68,68,68,68,68,68,68,68],
    heatTrend: [32,33,34,34,35,35,35,35,35,35,35,35,35,35,35]
  },
  'Ratnagiri': {
    drought: 22, flood: 62, heat: 32, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'LOW',
    primaryCrop: 'Alphonso Mango / Cashew', avoidCrops: [],
    advisory: 'Ideal for tropical fruit. Monitor landslides in hilly terrain.',
    insuranceTrigger: 'NORMAL', soilMoisture: 52.8, ndvi: 0.65, soc: 0.88, cropFire: 5, landUse: 35, vulnIndex: 0.28,
    kccRisk: 'LOW', kccReduction: 2, stressBuffer: 4,
    pop: '16.1L', agri: '2.2L ha', rain: '3300mm', crops: 'Mango, Cashew',
    seedDemand: { bajra: 100, jowar: 100, cotton: 0, turDal: 4000, chickpea: 1500 },
    trend: [20,21,21,22,22,22,22,22,22,22,22,22,22,22,22],
    floodTrend: [58,60,61,62,62,62,62,62,62,62,62,62,62,62,62],
    heatTrend: [30,31,31,32,32,32,32,32,32,32,32,32,32,32,32]
  },
  'Sindhudurg': {
    drought: 18, flood: 58, heat: 30, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'LOW',
    primaryCrop: 'Mango / Spice', avoidCrops: [],
    advisory: 'Minimal drought risk. Focus on spice plantation health.',
    insuranceTrigger: 'NORMAL', soilMoisture: 58.6, ndvi: 0.72, soc: 0.95, cropFire: 2, landUse: 30, vulnIndex: 0.22,
    kccRisk: 'LOW', kccReduction: 2, stressBuffer: 3,
    pop: '8.5L', agri: '1.2L ha', rain: '3500mm', crops: 'Mango, Spices',
    seedDemand: { bajra: 50, jowar: 50, cotton: 0, turDal: 3000, chickpea: 1000 },
    trend: [15,16,17,17,18,18,18,18,18,18,18,18,18,18,18],
    floodTrend: [52,55,56,57,58,58,58,58,58,58,58,58,58,58,58],
    heatTrend: [28,29,29,30,30,30,30,30,30,30,30,30,30,30,30]
  },
  'Nashik': {
    drought: 45, flood: 38, heat: 42, droughtLevel: 'MEDIUM', floodLevel: 'MEDIUM', heatLevel: 'MEDIUM',
    primaryCrop: 'Grapes / Onion', avoidCrops: ['Paddy'],
    advisory: 'Moderate risk. Horticulture requires automated drip triggers.',
    insuranceTrigger: 'NORMAL', soilMoisture: 28.6, ndvi: 0.46, soc: 0.68, cropFire: 22, landUse: 55, vulnIndex: 0.45,
    kccRisk: 'MEDIUM', kccReduction: 12, stressBuffer: 8,
    pop: '61.1L', agri: '6.8L ha', rain: '640mm', crops: 'Grapes, Onion',
    seedDemand: { bajra: 14000, jowar: 12000, cotton: 20000, turDal: 18000, chickpea: 15000 },
    trend: [35,37,38,40,41,42,43,44,44,45,45,46,46,47,47],
    floodTrend: [33,34,35,36,37,37,38,38,38,38,38,38,39,39,39],
    heatTrend: [38,39,39,40,41,41,42,42,42,42,42,42,42,42,42]
  },
  'Pune': {
    drought: 32, flood: 48, heat: 38, droughtLevel: 'LOW', floodLevel: 'MEDIUM', heatLevel: 'MEDIUM',
    primaryCrop: 'Sugarcane / Wheat', avoidCrops: [],
    advisory: 'Low drought risk. Monitor flood zones near river catchments.',
    insuranceTrigger: 'NORMAL', soilMoisture: 34.2, ndvi: 0.54, soc: 0.81, cropFire: 18, landUse: 48, vulnIndex: 0.32,
    kccRisk: 'LOW', kccReduction: 5, stressBuffer: 5,
    pop: '96.2L', agri: '5.1L ha', rain: '720mm', crops: 'Sugarcane, Wheat',
    seedDemand: { bajra: 8000, jowar: 6000, cotton: 12000, turDal: 10000, chickpea: 8000 },
    trend: [28,28,29,29,30,30,30,31,31,31,32,32,32,33,33],
    floodTrend: [42,43,44,45,46,47,47,48,48,48,48,48,48,48,48],
    heatTrend: [34,35,35,36,37,37,38,38,38,38,38,38,38,38,38]
  },
  'Satara': {
    drought: 38, flood: 45, heat: 40, droughtLevel: 'MEDIUM', floodLevel: 'MEDIUM', heatLevel: 'MEDIUM',
    primaryCrop: 'Sugarcane / Jowar', avoidCrops: [],
    advisory: 'Balanced risk. Focus on soil moisture retention in eastern plains.',
    insuranceTrigger: 'MONITOR', soilMoisture: 31.5, ndvi: 0.48, soc: 0.75, cropFire: 25, landUse: 52, vulnIndex: 0.38,
    kccRisk: 'MEDIUM', kccReduction: 8, stressBuffer: 6,
    pop: '30.0L', agri: '4.8L ha', rain: '680mm', crops: 'Sugarcane, Jowar',
    seedDemand: { bajra: 10000, jowar: 15000, cotton: 8000, turDal: 12000, chickpea: 10000 },
    trend: [32,33,34,35,36,37,37,38,38,38,38,38,38,38,38],
    floodTrend: [40,41,42,43,44,44,45,45,45,45,45,45,45,45,45],
    heatTrend: [36,37,38,39,40,40,40,40,40,40,40,40,40,40,40]
  },
  'Sangli': {
    drought: 42, flood: 42, heat: 45, droughtLevel: 'MEDIUM', floodLevel: 'MEDIUM', heatLevel: 'MEDIUM',
    primaryCrop: 'Grapes / Pomegranate', avoidCrops: ['Rice'],
    advisory: 'Water deficit risk in eastern Sangli. Optimize reservoirs.',
    insuranceTrigger: 'NORMAL', soilMoisture: 26.8, ndvi: 0.42, soc: 0.62, cropFire: 30, landUse: 58, vulnIndex: 0.42,
    kccRisk: 'MEDIUM', kccReduction: 10, stressBuffer: 7,
    pop: '28.2L', agri: '5.2L ha', rain: '620mm', crops: 'Grapes, Pom',
    seedDemand: { bajra: 12000, jowar: 18000, cotton: 5000, turDal: 14000, chickpea: 12000 },
    trend: [38,39,40,41,42,42,42,42,42,42,42,42,42,42,42],
    floodTrend: [38,39,40,41,42,42,42,42,42,42,42,42,42,42,42],
    heatTrend: [40,41,42,43,44,45,45,45,45,45,45,45,45,45,45]
  },
  'Kolhapur': {
    drought: 22, flood: 68, heat: 25, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'LOW',
    primaryCrop: 'Sugarcane / Rice', avoidCrops: [],
    advisory: 'Low drought risk. High flood exposure near river basins.',
    insuranceTrigger: 'FLOOD_WATCH', soilMoisture: 52.3, ndvi: 0.68, soc: 0.93, cropFire: 8, landUse: 41, vulnIndex: 0.22,
    kccRisk: 'LOW', kccReduction: 5, stressBuffer: 5,
    pop: '38.6L', agri: '4.2L ha', rain: '1820mm', crops: 'Sugarcane, Rice',
    seedDemand: { bajra: 4000, jowar: 3000, cotton: 6000, turDal: 8000, chickpea: 5000 },
    trend: [20,20,21,21,21,22,22,22,22,22,22,23,23,23,23],
    floodTrend: [60,62,63,64,65,66,67,67,68,68,68,68,68,68,68],
    heatTrend: [22,22,23,23,24,24,25,25,25,25,25,25,25,25,25]
  },
  'Nandurbar': {
    drought: 52, flood: 30, heat: 58, droughtLevel: 'MEDIUM', floodLevel: 'LOW', heatLevel: 'HIGH',
    primaryCrop: 'Maize / Chilli', avoidCrops: ['Sugarcane'],
    advisory: 'Tribal belt risk; prioritize drought-tolerant maize varieties.',
    insuranceTrigger: 'MONITOR', soilMoisture: 24.5, ndvi: 0.40, soc: 0.52, cropFire: 45, landUse: 62, vulnIndex: 0.52,
    kccRisk: 'HIGH', kccReduction: 18, stressBuffer: 10,
    pop: '16.5L', agri: '3.8L ha', rain: '780mm', crops: 'Maize, Chilli',
    seedDemand: { bajra: 15000, jowar: 10000, cotton: 12000, turDal: 14000, chickpea: 8000 },
    trend: [45,47,48,50,51,52,52,52,52,52,52,52,52,52,52],
    floodTrend: [28,29,29,30,30,30,30,30,30,30,30,30,30,30,30],
    heatTrend: [50,52,54,56,57,58,58,58,58,58,58,58,58,58,58]
  },
  'Dhule': {
    drought: 58, flood: 25, heat: 62, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'HIGH',
    primaryCrop: 'Bajra / Cotton', avoidCrops: ['Sugarcane'],
    advisory: 'Arid zone logic. Switch to Bajra for lower moisture reliance.',
    insuranceTrigger: 'ARMED', soilMoisture: 21.2, ndvi: 0.35, soc: 0.48, cropFire: 52, landUse: 65, vulnIndex: 0.58,
    kccRisk: 'HIGH', kccReduction: 20, stressBuffer: 12,
    pop: '20.5L', agri: '4.5L ha', rain: '560mm', crops: 'Bajra, Cotton',
    seedDemand: { bajra: 25000, jowar: 15000, cotton: 28000, turDal: 12000, chickpea: 9000 },
    trend: [50,52,54,56,57,58,58,58,58,58,58,58,58,58,58],
    floodTrend: [22,23,24,24,25,25,25,25,25,25,25,25,25,25,25],
    heatTrend: [55,57,59,60,61,62,62,62,62,62,62,62,62,62,62]
  },
  'Jalgaon': {
    drought: 55, flood: 35, heat: 68, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'HIGH',
    primaryCrop: 'Banana / Cotton', avoidCrops: ['Sugarcane'],
    advisory: 'Banana health under threat from rising heat windows.',
    insuranceTrigger: 'MONITOR', soilMoisture: 22.8, ndvi: 0.38, soc: 0.50, cropFire: 48, landUse: 64, vulnIndex: 0.55,
    kccRisk: 'HIGH', kccReduction: 22, stressBuffer: 15,
    pop: '42.3L', agri: '7.8L ha', rain: '700mm', crops: 'Banana, Cotton',
    seedDemand: { bajra: 18000, jowar: 14000, cotton: 45000, turDal: 16000, chickpea: 11000 },
    trend: [48,50,52,54,55,55,55,55,55,55,55,55,55,55,55],
    floodTrend: [30,32,33,34,35,35,35,35,35,35,35,35,35,35,35],
    heatTrend: [60,62,64,66,67,68,68,68,68,68,68,68,68,68,68]
  },
  'Aurangabad': {
    drought: 60, flood: 32, heat: 55, droughtLevel: 'HIGH', floodLevel: 'MEDIUM', heatLevel: 'MEDIUM',
    primaryCrop: 'Cotton / Maize', avoidCrops: ['Rice'],
    advisory: 'Cotton viable but monitor dry spells in July.',
    insuranceTrigger: 'MONITOR', soilMoisture: 20.8, ndvi: 0.38, soc: 0.49, cropFire: 45, landUse: 65, vulnIndex: 0.60,
    kccRisk: 'MEDIUM', kccReduction: 20, stressBuffer: 10,
    pop: '38.9L', agri: '7.3L ha', rain: '610mm', crops: 'Cotton, Maize',
    seedDemand: { bajra: 20000, jowar: 18000, cotton: 42000, turDal: 16000, chickpea: 10000 },
    trend: [44,47,49,52,54,56,57,58,59,60,60,61,61,62,62],
    floodTrend: [28,28,29,30,31,31,32,32,32,32,32,32,32,33,33],
    heatTrend: [48,49,50,51,52,53,54,54,55,55,55,55,55,55,55]
  },
  'Jalna': {
    drought: 68, flood: 25, heat: 60, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'HIGH',
    primaryCrop: 'Sweet Lime / Cotton', avoidCrops: ['Rice'],
    advisory: 'Marathwada drought core. Horticulture requires subsidy for lining.',
    insuranceTrigger: 'ARMED', soilMoisture: 18.2, ndvi: 0.32, soc: 0.45, cropFire: 55, landUse: 68, vulnIndex: 0.68,
    kccRisk: 'HIGH', kccReduction: 25, stressBuffer: 14,
    pop: '19.6L', agri: '5.8L ha', rain: '580mm', crops: 'Lime, Cotton',
    seedDemand: { bajra: 22000, jowar: 16000, cotton: 38000, turDal: 14000, chickpea: 8000 },
    trend: [60,62,64,66,68,68,68,68,68,68,68,68,68,68,68],
    floodTrend: [20,22,23,24,25,25,25,25,25,25,25,25,25,25,25],
    heatTrend: [54,56,58,59,60,60,60,60,60,60,60,60,60,60,60]
  },
  'Ahmednagar': {
    drought: 65, flood: 28, heat: 58, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'MEDIUM',
    primaryCrop: 'Soybean / Tur Dal', avoidCrops: ['Sugarcane'],
    advisory: 'Shift to short-duration pulses. Rainfall variability increasing.',
    insuranceTrigger: 'MONITOR', soilMoisture: 22.1, ndvi: 0.36, soc: 0.55, cropFire: 48, landUse: 68, vulnIndex: 0.65,
    kccRisk: 'HIGH', kccReduction: 25, stressBuffer: 12,
    pop: '51.6L', agri: '9.2L ha', rain: '580mm', crops: 'Soybean, Tur Dal',
    seedDemand: { bajra: 28000, jowar: 22000, cotton: 35000, turDal: 20000, chickpea: 12000 },
    trend: [48,51,53,56,58,60,61,62,63,64,65,65,66,66,67],
    floodTrend: [24,25,25,26,27,27,28,28,28,28,28,28,28,29,29],
    heatTrend: [52,53,54,55,56,57,57,58,58,58,58,58,58,58,58]
  },
  'Beed': {
    drought: 72, flood: 22, heat: 62, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'HIGH',
    primaryCrop: 'Cotton / Bajra', avoidCrops: ['Sugarcane'],
    advisory: 'Critical drought zone. Seed priming recommended.',
    insuranceTrigger: 'ARMED', soilMoisture: 17.2, ndvi: 0.26, soc: 0.44, cropFire: 68, landUse: 64, vulnIndex: 0.72,
    kccRisk: 'HIGH', kccReduction: 28, stressBuffer: 14,
    pop: '25.9L', agri: '7.1L ha', rain: '520mm', crops: 'Cotton, Bajra',
    seedDemand: { bajra: 38000, jowar: 28000, cotton: 25000, turDal: 12000, chickpea: 8000 },
    trend: [52,55,58,62,65,67,69,70,71,72,72,73,73,74,74],
    floodTrend: [18,19,20,20,21,21,22,22,22,22,22,22,22,22,22],
    heatTrend: [56,57,58,59,60,61,61,62,62,62,62,62,62,62,62]
  },
  'Latur': {
    drought: 66, flood: 20, heat: 58, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'MEDIUM',
    primaryCrop: 'Tur Dal / Soybean', avoidCrops: ['Sugarcane'],
    advisory: 'Crop diversification strongly advised to mitigate J-J dry window.',
    insuranceTrigger: 'ARMED', soilMoisture: 18.9, ndvi: 0.31, soc: 0.48, cropFire: 62, landUse: 63, vulnIndex: 0.66,
    kccRisk: 'HIGH', kccReduction: 24, stressBuffer: 12,
    pop: '24.8L', agri: '6.2L ha', rain: '530mm', crops: 'Tur Dal, Soybean',
    seedDemand: { bajra: 30000, jowar: 26000, cotton: 16000, turDal: 28000, chickpea: 14000 },
    trend: [48,51,54,57,60,62,63,64,65,66,66,67,67,68,68],
    floodTrend: [16,17,18,18,19,19,20,20,20,20,20,20,20,20,20],
    heatTrend: [52,53,54,55,56,57,57,58,58,58,58,58,58,58,58]
  },
  'Osmanabad': {
    drought: 69, flood: 25, heat: 60, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'HIGH',
    primaryCrop: 'Jowar / Tur Dal', avoidCrops: ['Sugarcane'],
    advisory: 'Extreme drought footprint. Promote micro-irrigation only.',
    insuranceTrigger: 'ARMED', soilMoisture: 17.8, ndvi: 0.29, soc: 0.46, cropFire: 65, landUse: 65, vulnIndex: 0.69,
    kccRisk: 'HIGH', kccReduction: 26, stressBuffer: 13,
    pop: '16.5L', agri: '5.8L ha', rain: '510mm', crops: 'Jowar, Tur Dal',
    seedDemand: { bajra: 32000, jowar: 36000, cotton: 14000, turDal: 22000, chickpea: 10000 },
    trend: [50,53,56,60,62,64,66,67,68,69,69,70,70,71,71],
    floodTrend: [20,21,22,23,24,24,25,25,25,25,25,25,25,25,25],
    heatTrend: [54,55,56,57,58,59,60,60,60,60,60,60,60,60,60]
  },
  'Solapur': {
    drought: 78, flood: 15, heat: 65, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'HIGH',
    primaryCrop: 'Bajra / Pomegranate', avoidCrops: ['Sugarcane'],
    advisory: 'Critical drought node. Switch to dryland horticulture.',
    insuranceTrigger: 'ARMED', soilMoisture: 15.4, ndvi: 0.22, soc: 0.40, cropFire: 75, landUse: 60, vulnIndex: 0.78,
    kccRisk: 'HIGH', kccReduction: 30, stressBuffer: 15,
    pop: '43.2L', agri: '8.4L ha', rain: '540mm', crops: 'Bajra, Pom',
    seedDemand: { bajra: 42000, jowar: 31000, cotton: 18000, turDal: 14000, chickpea: 9000 },
    trend: [65,68,71,74,76,78,78,78,78,78,78,78,78,78,78],
    floodTrend: [12,13,13,14,15,15,15,15,15,15,15,15,15,15,15],
    heatTrend: [60,61,62,63,64,65,65,65,65,65,65,65,65,65,65]
  },
  'Nanded': {
    drought: 58, flood: 30, heat: 52, droughtLevel: 'MEDIUM', floodLevel: 'LOW', heatLevel: 'MEDIUM',
    primaryCrop: 'Cotton / Soyabean', avoidCrops: ['Rice'],
    advisory: 'Mixed risk. Ensure crop diversity across farm clusters.',
    insuranceTrigger: 'MONITOR', soilMoisture: 23.4, ndvi: 0.38, soc: 0.56, cropFire: 42, landUse: 60, vulnIndex: 0.58,
    kccRisk: 'MEDIUM', kccReduction: 18, stressBuffer: 9,
    pop: '33.6L', agri: '7.8L ha', rain: '840mm', crops: 'Cotton, Soya',
    seedDemand: { bajra: 22000, jowar: 24000, cotton: 30000, turDal: 18000, chickpea: 12000 },
    trend: [42,44,46,48,50,52,53,54,55,56,57,57,58,58,58],
    floodTrend: [25,26,27,27,28,29,29,30,30,30,30,30,30,30,30],
    heatTrend: [46,47,48,49,50,51,51,52,52,52,52,52,52,52,52]
  },
  'Parbhani': {
    drought: 62, flood: 28, heat: 54, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'MEDIUM',
    primaryCrop: 'Soybean / Cotton', avoidCrops: [],
    advisory: 'Moderate risk. Monitor soil nitrogen loss after heavy J-window rains.',
    insuranceTrigger: 'NORMAL', soilMoisture: 21.5, ndvi: 0.34, soc: 0.52, cropFire: 45, landUse: 62, vulnIndex: 0.62,
    kccRisk: 'MEDIUM', kccReduction: 15, stressBuffer: 8,
    pop: '18.4L', agri: '5.2L ha', rain: '780mm', crops: 'Soya, Cotton',
    seedDemand: { bajra: 20000, jowar: 15000, cotton: 32000, turDal: 16000, chickpea: 10000 },
    trend: [50,52,55,58,60,62,62,62,62,62,62,62,62,62,62],
    floodTrend: [24,25,26,27,28,28,28,28,28,28,28,28,28,28,28],
    heatTrend: [48,50,51,52,53,54,54,54,54,54,54,54,54,54,54]
  },
  'Hingoli': {
    drought: 55, flood: 32, heat: 50, droughtLevel: 'HIGH', floodLevel: 'MEDIUM', heatLevel: 'MEDIUM',
    primaryCrop: 'Turmeric / Cotton', avoidCrops: [],
    advisory: 'Turmeric processing requires water security during summer.',
    insuranceTrigger: 'MONITOR', soilMoisture: 24.2, ndvi: 0.40, soc: 0.55, cropFire: 38, landUse: 58, vulnIndex: 0.55,
    kccRisk: 'MEDIUM', kccReduction: 12, stressBuffer: 6,
    pop: '11.8L', agri: '3.5L ha', rain: '820mm', crops: 'Turmeric, Cotton',
    seedDemand: { bajra: 12000, jowar: 10000, cotton: 24000, turDal: 18000, chickpea: 12000 },
    trend: [45,47,50,52,54,55,55,55,55,55,55,55,55,55,55],
    floodTrend: [28,29,30,31,32,32,32,32,32,32,32,32,32,32,32],
    heatTrend: [44,46,47,48,49,50,50,50,50,50,50,50,50,50,50]
  },
  'Washim': {
    drought: 52, flood: 35, heat: 52, droughtLevel: 'MEDIUM', floodLevel: 'LOW', heatLevel: 'MEDIUM',
    primaryCrop: 'Soybean / Cotton', avoidCrops: [],
    advisory: 'Increasing rainfall variability. Shift to early-sowing varieties.',
    insuranceTrigger: 'NORMAL', soilMoisture: 26.5, ndvi: 0.42, soc: 0.58, cropFire: 35, landUse: 55, vulnIndex: 0.52,
    kccRisk: 'MEDIUM', kccReduction: 10, stressBuffer: 5,
    pop: '13.0L', agri: '4.2L ha', rain: '850mm', crops: 'Soya, Cotton',
    seedDemand: { bajra: 10000, jowar: 9000, cotton: 22000, turDal: 20000, chickpea: 15000 },
    trend: [42,44,47,49,51,52,52,52,52,52,52,52,52,52,52],
    floodTrend: [30,32,33,34,35,35,35,35,35,35,35,35,35,35,35],
    heatTrend: [46,47,48,49,50,51,52,52,52,52,52,52,52,52,52]
  },
  'Buldhana': {
    drought: 64, flood: 22, heat: 58, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'MEDIUM',
    primaryCrop: 'Soybean / Maize', avoidCrops: [],
    advisory: 'Drought window widening. Watershed management critical.',
    insuranceTrigger: 'ARMED', soilMoisture: 19.4, ndvi: 0.32, soc: 0.49, cropFire: 58, landUse: 62, vulnIndex: 0.64,
    kccRisk: 'HIGH', kccReduction: 22, stressBuffer: 10,
    pop: '25.9L', agri: '6.5L ha', rain: '680mm', crops: 'Soya, Maize',
    seedDemand: { bajra: 28000, jowar: 22000, cotton: 20000, turDal: 18000, chickpea: 12000 },
    trend: [52,55,58,61,63,64,64,64,64,64,64,64,64,64,64],
    floodTrend: [18,19,20,21,22,22,22,22,22,22,22,22,22,22,22],
    heatTrend: [50,52,54,56,57,58,58,58,58,58,58,58,58,58,58]
  },
  'Akola': {
    drought: 58, flood: 25, heat: 64, droughtLevel: 'HIGH', floodLevel: 'LOW', heatLevel: 'HIGH',
    primaryCrop: 'Cotton / Pigeon Pea', avoidCrops: [],
    advisory: 'High thermal heat stress. Heat-resistant varieties required.',
    insuranceTrigger: 'MONITOR', soilMoisture: 22.1, ndvi: 0.36, soc: 0.51, cropFire: 50, landUse: 60, vulnIndex: 0.58,
    kccRisk: 'HIGH', kccReduction: 20, stressBuffer: 11,
    pop: '18.2L', agri: '4.8L ha', rain: '730mm', crops: 'Cotton, Pea',
    seedDemand: { bajra: 20000, jowar: 15000, cotton: 42000, turDal: 14000, chickpea: 10000 },
    trend: [48,51,53,56,58,58,58,58,58,58,58,58,58,58,58],
    floodTrend: [22,23,24,24,25,25,25,25,25,25,25,25,25,25,25],
    heatTrend: [55,57,59,61,63,64,64,64,64,64,64,64,64,64,64]
  },
  'Amravati': {
    drought: 50, flood: 38, heat: 62, droughtLevel: 'MEDIUM', floodLevel: 'MEDIUM', heatLevel: 'HIGH',
    primaryCrop: 'Cotton / Orange', avoidCrops: [],
    advisory: 'Orange belt under threat from rising temperatures.',
    insuranceTrigger: 'NORMAL', soilMoisture: 26.2, ndvi: 0.42, soc: 0.56, cropFire: 32, landUse: 52, vulnIndex: 0.50,
    kccRisk: 'MEDIUM', kccReduction: 15, stressBuffer: 8,
    pop: '28.9L', agri: '6.2L ha', rain: '820mm', crops: 'Cotton, Orange',
    seedDemand: { bajra: 15000, jowar: 12000, cotton: 38000, turDal: 18000, chickpea: 14000 },
    trend: [42,44,47,49,50,50,50,50,50,50,50,50,50,50,50],
    floodTrend: [32,34,35,36,37,38,38,38,38,38,38,38,38,38,38],
    heatTrend: [54,56,58,60,61,62,62,62,62,62,62,62,62,62,62]
  },
  'Wardha': {
    drought: 42, flood: 45, heat: 58, droughtLevel: 'MEDIUM', floodLevel: 'MEDIUM', heatLevel: 'HIGH',
    primaryCrop: 'Cotton / Tur Dal', avoidCrops: [],
    advisory: 'Flood windows increasing along Wardha river clusters.',
    insuranceTrigger: 'NORMAL', soilMoisture: 30.5, ndvi: 0.48, soc: 0.62, cropFire: 25, landUse: 45, vulnIndex: 0.42,
    kccRisk: 'MEDIUM', kccReduction: 10, stressBuffer: 6,
    pop: '13.0L', agri: '4.2L ha', rain: '920mm', crops: 'Cotton, Tur',
    seedDemand: { bajra: 8000, jowar: 10000, cotton: 28000, turDal: 16000, chickpea: 12000 },
    trend: [35,37,39,41,42,42,42,42,42,42,42,42,42,42,42],
    floodTrend: [38,40,42,44,45,45,45,45,45,45,45,45,45,45,45],
    heatTrend: [50,52,54,56,57,58,58,58,58,58,58,58,58,58,58]
  },
  'Nagpur': {
    drought: 35, flood: 55, heat: 65, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'HIGH',
    primaryCrop: 'Orange / Cotton', avoidCrops: [],
    advisory: 'Extreme heat risk. Irrigation timing critical for oranges.',
    insuranceTrigger: 'NORMAL', soilMoisture: 34.2, ndvi: 0.52, soc: 0.68, cropFire: 20, landUse: 40, vulnIndex: 0.35,
    kccRisk: 'MEDIUM', kccReduction: 12, stressBuffer: 9,
    pop: '46.5L', agri: '5.8L ha', rain: '1100mm', crops: 'Orange, Cotton',
    seedDemand: { bajra: 5000, jowar: 8000, cotton: 42000, turDal: 14000, chickpea: 10000 },
    trend: [28,30,32,34,35,35,35,35,35,35,35,35,35,35,35],
    floodTrend: [45,48,50,53,55,55,55,55,55,55,55,55,55,55,55],
    heatTrend: [58,60,62,64,65,65,65,65,65,65,65,65,65,65,65]
  },
  'Bhandara': {
    drought: 22, flood: 72, heat: 52, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'MEDIUM',
    primaryCrop: 'Rice / Wheat', avoidCrops: [],
    advisory: 'Lake district logic. Inundation risk very high in August.',
    insuranceTrigger: 'FLOOD_WATCH', soilMoisture: 52.4, ndvi: 0.68, soc: 0.88, cropFire: 10, landUse: 35, vulnIndex: 0.22,
    kccRisk: 'LOW', kccReduction: 5, stressBuffer: 5,
    pop: '12.0L', agri: '3.5L ha', rain: '1400mm', crops: 'Rice, Wheat',
    seedDemand: { bajra: 2000, jowar: 3000, cotton: 5000, turDal: 10000, chickpea: 8000 },
    trend: [18,19,20,21,22,22,22,22,22,22,22,22,22,22,22],
    floodTrend: [60,64,67,70,72,72,72,72,72,72,72,72,72,72,72],
    heatTrend: [46,47,48,50,51,52,52,52,52,52,52,52,52,52,52]
  },
  'Gondia': {
    drought: 20, flood: 75, heat: 50, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'LOW',
    primaryCrop: 'Rice / Pulses', avoidCrops: [],
    advisory: 'Dense lake network maintains soil moisture. High flood risk.',
    insuranceTrigger: 'FLOOD_WATCH', soilMoisture: 55.6, ndvi: 0.72, soc: 0.92, cropFire: 8, landUse: 32, vulnIndex: 0.20,
    kccRisk: 'LOW', kccReduction: 4, stressBuffer: 4,
    pop: '13.2L', agri: '3.8L ha', rain: '1500mm', crops: 'Rice, Pulses',
    seedDemand: { bajra: 1500, jowar: 2000, cotton: 4000, turDal: 12000, chickpea: 9000 },
    trend: [15,17,18,19,20,20,20,20,20,20,20,20,20,20,20],
    floodTrend: [65,68,71,73,75,75,75,75,75,75,75,75,75,75,75],
    heatTrend: [44,46,47,48,49,50,50,50,50,50,50,50,50,50,50]
  },
  'Chandrapur': {
    drought: 32, flood: 55, heat: 75, droughtLevel: 'LOW', floodLevel: 'HIGH', heatLevel: 'HIGH',
    primaryCrop: 'Rice / Soybean', avoidCrops: [],
    advisory: 'Industrial heat nexus. Thermal stress peak in May/June.',
    insuranceTrigger: 'NORMAL', soilMoisture: 38.6, ndvi: 0.52, soc: 0.65, cropFire: 45, landUse: 35, vulnIndex: 0.32,
    kccRisk: 'MEDIUM', kccReduction: 15, stressBuffer: 10,
    pop: '22.0L', agri: '5.2L ha', rain: '1250mm', crops: 'Rice, Soya',
    seedDemand: { bajra: 5000, jowar: 6000, cotton: 15000, turDal: 18000, chickpea: 12000 },
    trend: [25,27,29,31,32,32,32,32,32,32,32,32,32,32,32],
    floodTrend: [45,48,51,53,55,55,55,55,55,55,55,55,55,55,55],
    heatTrend: [65,68,71,73,75,75,75,75,75,75,75,75,75,75,75]
  },
  'Yavatmal': {
    drought: 55, flood: 32, heat: 68, droughtLevel: 'HIGH', floodLevel: 'MEDIUM', heatLevel: 'HIGH',
    primaryCrop: 'Cotton / Soyabean', avoidCrops: [],
    advisory: 'Vidarbha cotton core. High climate vulnerability observed.',
    insuranceTrigger: 'MONITOR', soilMoisture: 22.8, ndvi: 0.38, soc: 0.52, cropFire: 42, landUse: 58, vulnIndex: 0.55,
    kccRisk: 'HIGH', kccReduction: 20, stressBuffer: 12,
    pop: '27.7L', agri: '6.8L ha', rain: '950mm', crops: 'Cotton, Soya',
    seedDemand: { bajra: 15000, jowar: 12000, cotton: 48000, turDal: 16000, chickpea: 10000 },
    trend: [48,51,53,55,55,55,55,55,55,55,55,55,55,55,55],
    floodTrend: [28,30,31,31,32,32,32,32,32,32,32,32,32,32,32],
    heatTrend: [60,62,64,66,68,68,68,68,68,68,68,68,68,68,68]
  },
  'Gadchiroli': {
    drought: 20, flood: 52, heat: 45, droughtLevel: 'LOW', floodLevel: 'MEDIUM', heatLevel: 'MEDIUM',
    primaryCrop: 'Rice / Forest Produce', avoidCrops: [],
    advisory: 'Minimal drought risk. Dense forest maintains hydrothermal link.',
    insuranceTrigger: 'NORMAL', soilMoisture: 56.4, ndvi: 0.78, soc: 0.98, cropFire: 5, landUse: 25, vulnIndex: 0.20,
    kccRisk: 'LOW', kccReduction: 2, stressBuffer: 2,
    pop: '10.7L', agri: '2.5L ha', rain: '1550mm', crops: 'Rice, Forest',
    seedDemand: { bajra: 500, jowar: 800, cotton: 1000, turDal: 12000, chickpea: 11000 },
    trend: [15,17,19,20,20,20,20,20,20,20,20,20,20,20,20],
    floodTrend: [45,48,50,51,52,52,52,52,52,52,52,52,52,52,52],
    heatTrend: [40,42,43,44,45,45,45,45,45,45,45,45,45,45,45]
  }
};

export const DISTRICT_NAMES = Object.keys(DISTRICT_DATA_MAP);

export function getRiskColor(level: string): string {
  if (level === 'HIGH') return '#d32f2f';
  if (level === 'MEDIUM') return '#f9a825';
  return '#2e7d32';
}

export function getRiskBg(level: string): string {
  if (level === 'HIGH') return 'rgba(211,47,47,0.08)';
  if (level === 'MEDIUM') return 'rgba(249,168,37,0.08)';
  return 'rgba(46,125,50,0.08)';
}

export function getRiskBorder(level: string): string {
  if (level === 'HIGH') return 'rgba(211,47,47,0.18)';
  if (level === 'MEDIUM') return 'rgba(249,168,37,0.18)';
  return 'rgba(46,125,50,0.18)';
}
