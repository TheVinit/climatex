import { useEffect, useRef, useState } from 'react';
import { DistrictData } from '@/lib/types';
import { DISTRICTS_DATA } from '@/lib/data';
import { getForecast, getInsuranceTrigger, getCreditRisk, getForecastHorizon } from '@/lib/api';

interface RiskResult {
  data: DistrictData;
  isLoading: boolean;
  isLive: boolean;
  error?: Error;
}

// Cache with expiration (5 minutes)
const CACHE_DURATION_MS = 5 * 60 * 1000;

interface CacheEntry {
  data: DistrictData;
  timestamp: number;
}

class DataCache {
  private cache = new Map<string, CacheEntry>();

  get(key: string): DistrictData | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION_MS;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: DistrictData) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear() {
    this.cache.clear();
  }
}

const dataCache = new DataCache();

export function useRiskData(district: string): RiskResult {
  const fallback = DISTRICTS_DATA[district] || DISTRICTS_DATA['Solapur'];
  const [data, setData] = useState<DistrictData>(fallback);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Check cache first
    const cached = dataCache.get(district);
    if (cached) {
      setData(cached);
      setIsLive(true);
      setIsLoading(false);
      return;
    }

    // Immediately show fallback data
    setData(fallback);
    setIsLoading(true);
    setError(undefined);

    // Cancel previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    // Fetch fresh data with timeout
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, 8000); // 8 second timeout

    Promise.allSettled([
      getForecast(district),
      getInsuranceTrigger(district),
      getCreditRisk(district),
      getForecastHorizon(district),
    ])
      .then(([forecast, insurance, credit, horizon]) => {
        clearTimeout(timeoutId);

        let merged = { ...fallback };
        let anyLive = false;

        if (forecast.status === 'fulfilled' && forecast.value) {
          const f = forecast.value;
          anyLive = true;
          merged = {
            ...merged,
            drought: (f.drought_score !== undefined) ? f.drought_score * 100 : (f.drought?.probability ?? merged.drought),
            flood: (f.flood_score !== undefined) ? f.flood_score * 100 : (f.flood?.probability ?? merged.flood),
            heat: (f.heat_wave_score !== undefined) ? f.heat_wave_score * 100 : (f.heat_wave?.probability ?? merged.heat),
            droughtLevel: (f.drought_score > 0.7) ? 'HIGH' : (f.drought_score > 0.4 ? 'MEDIUM' : 'LOW'),
            floodLevel: (f.flood_score > 0.6) ? 'HIGH' : (f.flood_score > 0.3 ? 'MEDIUM' : 'LOW'),
            heatLevel: (f.heat_wave_score > 0.75) ? 'HIGH' : (f.heat_wave_score > 0.5 ? 'MEDIUM' : 'LOW'),
            primaryCrop: f.recommendations?.primary_crop ?? merged.primaryCrop,
            avoidCrops: f.recommendations?.crops_to_avoid ?? merged.avoidCrops,
            advisory: f.crop_advisory ?? (f.recommendations?.advisory ?? merged.advisory),
          };
        }

        if (insurance.status === 'fulfilled' && insurance.value) {
          const ins = insurance.value;
          anyLive = true;
          merged = {
            ...merged,
            insuranceTrigger: ins.trigger ? 'ARMED' : (ins.trigger_status ?? merged.insuranceTrigger),
            soilMoisture: (ins.drought_score !== undefined) ? (1 - ins.drought_score) * 40 : (ins.soil_moisture ?? merged.soilMoisture),
            ndvi: (ins.ndvi !== undefined) ? ins.ndvi : (ins.ndvi ?? merged.ndvi),
          };
        }

        if (credit.status === 'fulfilled' && credit.value) {
          const cr = credit.value;
          anyLive = true;
          merged = {
            ...merged,
            kccRisk: cr.risk_level ?? (cr.risk_flag ?? merged.kccRisk),
            kccReduction: (cr.max_hazard_score > 0.7) ? 25 : (cr.kccReduction ?? merged.kccReduction),
            stressBuffer: (cr.max_hazard_score !== undefined) ? cr.max_hazard_score * 15 : (cr.climate_stress_buffer ?? merged.stressBuffer),
          };
        }

        if (horizon.status === 'fulfilled' && horizon.value) {
          anyLive = true;
        }

        dataCache.set(district, merged);
        setData(merged);
        setIsLive(anyLive);
        setIsLoading(false);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        if ((err as Error).name !== 'AbortError') {
          console.error('Data fetch error:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLive(false);
        }
        setIsLoading(false);
      });

    return () => {
      abortControllerRef.current?.abort();
      clearTimeout(timeoutId);
    };
  }, [district, fallback]);

  return { data, isLoading, isLive, error };
}
