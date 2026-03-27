import { TrendingUp, Database, MapPin, Wind, Sun, CloudRain, Shield } from 'lucide-react';
import { DistrictData, Hazard } from '@/lib/types';
import { YEARS, MH_AVERAGE, getRiskColor } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface SharedDataPanelsProps {
  data: DistrictData;
  district: string;
  hazard: Hazard;
  year: number;
  isLive: boolean;
}

export default function SharedDataPanels({ data, district, hazard, year, isLive }: SharedDataPanelsProps) {
  const trendArray = hazard === 'drought' ? data.trend : (hazard === 'flood' ? data.floodTrend : data.heatTrend);
  const riskLevel = hazard === 'drought' ? data.droughtLevel : (hazard === 'flood' ? data.floodLevel : data.heatLevel);
  // Defaulting to Tailwind colors since custom vars are removed
  const riskColor = riskLevel === 'HIGH' ? '#ef4444' : riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981';

  const chartData = YEARS.map((y, i) => ({ 
    year: y, 
    district: trendArray[i] || 0, 
    mhAvg: MH_AVERAGE[i] || 0 
  }));

  const dicraBars = [
    { label: 'Soil Organic Carbon', value: `${data.soc}%`, pct: data.soc * 100, color: '#16a34a', icon: Wind },
    { label: 'NDVI Vegetation Index', value: `${data.ndvi}`, pct: data.ndvi * 100, color: '#16a34a', icon: Sun },
    { label: 'Soil Moisture Level', value: `${data.soilMoisture}%`, pct: Math.min(data.soilMoisture * 2.5, 100), color: data.soilMoisture < 20 ? '#ef4444' : (data.soilMoisture < 30 ? '#f59e0b' : '#10b981'), icon: CloudRain },
    { label: 'Crop Fire Probability', value: `${data.cropFire}%`, pct: data.cropFire, color: data.cropFire > 60 ? '#ef4444' : (data.cropFire > 30 ? '#f59e0b' : '#10b981'), icon: Wind },
    { label: 'Agricultural Land Usage', value: `${data.landUse}%`, pct: data.landUse, color: '#3b82f6', icon: MapPin },
    { label: 'Composite Vulnerability', value: `${data.vulnIndex}`, pct: data.vulnIndex * 100, color: data.vulnIndex > 0.6 ? '#ef4444' : (data.vulnIndex > 0.4 ? '#f59e0b' : '#10b981'), icon: Database },
  ];

  const profileCells = [
    { label: 'Population', value: data.pop, sub: 'Regional Estimate' },
    { label: 'Agri Area', value: data.agri, sub: 'Cultivated Hectares' },
    { label: 'Precipitation', value: data.rain, sub: 'Meteorological Baseline' },
    { label: 'Kharif Crops', value: data.crops, sub: 'Historical Dominance' },
  ];

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 animate-fade-slide">
      {/* Risk Trajectory Module */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col text-left">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-100 shadow-sm">
                <TrendingUp size={20} />
             </div>
             <span className="font-bold text-gray-900 text-sm uppercase tracking-widest">Risk Trajectory Matrix</span>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: riskColor }} />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">District</span>
             </div>
             <div className="flex items-center gap-2 opacity-60">
                <div className="w-4 h-0.5 border-t-2 border-dashed border-gray-400" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">MH Avg</span>
             </div>
          </div>
        </div>
        
        <div className="flex-1 min-h-[250px] -ml-6">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                 <CartesianGrid horizontal strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }} axisLine={false} tickLine={false}
                   tickFormatter={(v, i) => i % 3 === 0 ? String(v) : ''} />
                 <YAxis tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }} axisLine={false} tickLine={false}
                   tickFormatter={(v) => `${v}%`} />
                 <ReferenceLine x={year} stroke="#16a34a" strokeDasharray="3 3" strokeWidth={2} opacity={0.4} />
                 <Line type="monotone" dataKey="district" stroke={riskColor} strokeWidth={3} dot={false} animationDuration={1000} className="filter drop-shadow-sm" />
                 <Line type="monotone" dataKey="mhAvg" stroke="#9ca3af" strokeWidth={2} strokeDasharray="4 4" dot={false} opacity={0.5} />
                 <RechartsTooltip
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: '#6b7280', fontSize: 12, fontWeight: 700, marginBottom: '8px' }}
                    itemStyle={{ fontSize: 14, fontWeight: 700 }}
                 />
              </LineChart>
           </ResponsiveContainer>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Forecast: {data[hazard]}% at {year}</span>
            <div className={cn("px-3 py-1 rounded-md text-[10px] border font-bold uppercase shadow-sm",
              riskLevel === 'HIGH' ? 'bg-red-50 border-red-200 text-red-600' : 
              riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 
              'bg-green-50 border-green-200 text-green-600')}>
               {riskLevel} Threat
            </div>
        </div>
      </div>

      {/* Geospatial Telemetry Feed */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col text-left relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-left">
             <div className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-100 shadow-sm">
                <Database size={20} />
             </div>
             <span className="font-bold text-gray-900 text-sm uppercase tracking-widest">Geospatial Telemetry</span>
          </div>
          <div className={cn("px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider shadow-sm", 
            isLive ? "bg-green-100 text-green-700 border border-green-200 animate-pulse" : "bg-gray-100 text-gray-600 border border-gray-200")}>
            {isLive ? 'SYSTEM_LIVE' : 'CACHE_READ'}
          </div>
        </div>
        
        <div className="space-y-5 flex-1 pr-2 overflow-auto">
          {dicraBars.map(b => (
            <div key={b.label} className="group">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                   <b.icon size={14} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                   <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">{b.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 italic">{b.value}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(b.pct, 100)}%`, backgroundColor: b.color }} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between opacity-70">
           <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Sync: Stable / -42dBm</span>
           <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{district.toUpperCase()}_SCAN_07</span>
        </div>
      </div>

      {/* Regional Intelligence Node */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col text-left relative">
        <div className="flex items-center gap-3 mb-8 text-left">
          <div className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-100 shadow-sm">
            <MapPin size={20} />
          </div>
          <span className="font-bold text-gray-900 text-sm uppercase tracking-widest">Regional Intelligence Node</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 flex-1 pb-4">
          {profileCells.map(c => (
            <div key={c.label} className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col justify-between group hover:border-green-300 hover:bg-white transition-all">
              <div className="text-left">
                 <span className="text-[10px] tracking-widest text-gray-500 uppercase font-bold block mb-2">{c.label}</span>
                 <div className="text-2xl lg:text-3xl text-gray-900 font-extrabold group-hover:text-green-600 transition-colors leading-tight">{c.value}</div>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-4 block border-t border-gray-200 pt-3 font-semibold">{c.sub}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-5 rounded-xl bg-green-50 border border-green-100 flex items-center gap-4 shadow-sm">
           <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center text-white shadow-sm">
              <Shield size={18} strokeWidth={2.5} />
           </div>
           <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-green-700 uppercase tracking-widest leading-none">Security Status</span>
              <span className="text-[10px] text-green-600/80 uppercase tracking-wider mt-1.5 font-semibold">Verification Level: High Scan Active</span>
           </div>
        </div>
      </div>
    </div>
  );
}
