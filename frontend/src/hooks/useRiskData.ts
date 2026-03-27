import { useEffect, useRef, useState } from 'react';
import { DistrictData } from '@/lib/types';
import { DISTRICT_DATA_MAP } from '@/lib/data';
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

export function useRiskData(district: string, year: number = 2030): RiskResult {
  const fallback = DISTRICT_DATA_MAP[district] || DISTRICT_DATA_MAP['Solapur'];
  const [data, setData] = useState<DistrictData>(fallback);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const cacheKey = `${district}-${year}`;
    // Check cache first
    const cached = dataCache.get(cacheKey);
    if (cached) {
      setData(cached);
      setIsLive(true);
      setIsLoading(false);
      return;
    }

    // Immediately show fallback data
    // Important: we don't wipe data immediately if we already have it to avoid jarring flashes
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
      getForecast(district, year),
      getInsuranceTrigger(district, year),
      getCreditRisk(district, year),
      getForecastHorizon(district, year),
    ])
      .then(([forecast, insurance, credit, horizon]) => {
        clearTimeout(timeoutId);

        let merged = { ...fallback };
        let anyLive = false;

        // Use the forecast scores if available
        if (forecast.status === 'fulfilled' && forecast.value) {
          const f = forecast.value;
          anyLive = true;
          // Map backend fields to frontend types
          const d_score = f.drought_risk ?? f.drought_score;
          const f_score = f.flood_risk ?? f.flood_score;
          const h_score = f.heat_wave_risk ?? f.heat_wave_score;

          merged = {
            ...merged,
            drought: (d_score !== undefined) ? d_score * 100 : merged.drought,
            flood: (f_score !== undefined) ? f_score * 100 : merged.flood,
            heat: (h_score !== undefined) ? h_score * 100 : merged.heat,
            droughtLevel: (d_score > 0.65) ? 'HIGH' : (d_score > 0.4 ? 'MEDIUM' : 'LOW') as any,
            floodLevel: (f_score > 0.6) ? 'HIGH' : (f_score > 0.35 ? 'MEDIUM' : 'LOW') as any,
            heatLevel: (h_score > 0.7) ? 'HIGH' : (h_score > 0.5 ? 'MEDIUM' : 'LOW') as any,
            primaryCrop: f.recommendations?.primary_crop ?? (f.primary_crop ?? merged.primaryCrop),
            avoidCrops: f.recommendations?.crops_to_avoid ?? (f.avoid_crops ?? merged.avoidCrops),
            advisory: f.crop_advisory ?? (f.recommendations?.advisory ?? merged.advisory),
          };
        }

        if (insurance.status === 'fulfilled' && insurance.value) {
          const ins = insurance.value;
          anyLive = true;
          merged = {
            ...merged,
            insuranceTrigger: ins.trigger_insurance ? 'ARMED' : (ins.trigger ? 'ARMED' : merged.insuranceTrigger),
            soilMoisture: (ins.drought_risk !== undefined) ? (1 - ins.drought_risk) * 40 : merged.soilMoisture,
          };
        }

        if (credit.status === 'fulfilled' && credit.value) {
          const cr = credit.value;
          anyLive = true;
          merged = {
            ...merged,
            kccRisk: cr.credit_risk_flag ?? (cr.risk_level ?? merged.kccRisk),
            kccReduction: (cr.max_hazard_risk > 0.7) ? 25 : merged.kccReduction,
            stressBuffer: (cr.max_hazard_risk !== undefined) ? cr.max_hazard_risk * 15 : merged.stressBuffer,
          };
        }

        if (horizon.status === 'fulfilled' && horizon.value) {
          anyLive = true;
        }

        dataCache.set(cacheKey, merged);
        setData(merged);
        setIsLive(anyLive);
        setIsLoading(false);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        if ((err as Error).name !== 'AbortError') {
          console.error('Data fetch error:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          // We don't set isLive(false) here to allow keeping the last successful data
        }
        setIsLoading(false);
      });

    return () => {
      abortControllerRef.current?.abort();
      clearTimeout(timeoutId);
    };
  }, [district, year, fallback]);

  return { data, isLoading, isLive, error };
}
