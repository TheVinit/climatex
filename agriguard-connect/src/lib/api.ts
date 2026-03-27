const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function post(path: string, body: Record<string, unknown>) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function get(path: string) {
  try {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function checkHealth() { return get('/health'); }
export function getDistricts() { return get('/api/v1/districts'); }
export function getForecast(district: string) {
  return post('/api/v1/forecast', { district });
}
export function getInsuranceTrigger(district: string) {
  return post('/api/v1/insurance-trigger', { district });
}
export function getCreditRisk(district: string) {
  return post('/api/v1/credit-risk', { district });
}
export function getForecastHorizon(district: string) {
  return post('/api/v1/forecast-horizon', { district });
}
