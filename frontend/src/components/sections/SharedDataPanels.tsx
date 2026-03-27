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
  const riskColor = getRiskColor(riskLevel);

  const chartData = YEARS.map((y, i) => ({ 
    year: y, 
    district: trendArray[i] || 0, 
    mhAvg: MH_AVERAGE[i] || 0 
  }));

  const dicraBars = [
    { label: 'Soil Organic Carbon', value: `${data.soc}%`, pct: data.soc * 100, color: 'var(--brand)', icon: Wind },
    { label: 'NDVI Vegetation Index', value: `${data.ndvi}`, pct: data.ndvi * 100, color: 'var(--brand)', icon: Sun },
    { label: 'Soil Moisture Level', value: `${data.soilMoisture}%`, pct: Math.min(data.soilMoisture * 2.5, 100), color: data.soilMoisture < 20 ? 'var(--risk-h)' : (data.soilMoisture < 30 ? 'var(--risk-m)' : 'var(--risk-l)'), icon: CloudRain },
    { label: 'Crop Fire Probability', value: `${data.cropFire}%`, pct: data.cropFire, color: data.cropFire > 60 ? 'var(--risk-h)' : (data.cropFire > 30 ? 'var(--risk-m)' : 'var(--risk-l)'), icon: Wind },
    { label: 'Agricultural Land Usage', value: `${data.landUse}%`, pct: data.landUse, color: '#3b82f6', icon: MapPin },
    { label: 'Composite Vulnerability', value: `${data.vulnIndex}`, pct: data.vulnIndex * 100, color: data.vulnIndex > 0.6 ? 'var(--risk-h)' : (data.vulnIndex > 0.4 ? 'var(--risk-m)' : 'var(--risk-l)'), icon: Database },
  ];

  const profileCells = [
    { label: 'Population', value: data.pop, sub: 'Regional Estimate' },
    { label: 'Agri Area', value: data.agri, sub: 'Cultivated Hectares' },
    { label: 'Precipitation', value: data.rain, sub: 'Meteorological Baseline' },
    { label: 'Kharif Crops', value: data.crops, sub: 'Historical Dominance' },
  ];

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-8 animate-fade-slide">
      {/* Risk Trajectory Module */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl flex flex-col text-left">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
                <TrendingUp size={20} />
             </div>
             <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">Risk Trajectory Matrix</span>
          </div>
          <div className="flex gap-6">
             <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: riskColor }} />
                <span className="text-[10px] font-mono text-t-dim uppercase tracking-widest font-black">District</span>
             </div>
             <div className="flex items-center gap-2.5 opacity-50">
                <div className="w-4 h-0.5 border-t-2 border-dashed border-t-dim" />
                <span className="text-[10px] font-mono text-t-dim uppercase tracking-widest font-black">MH Avg</span>
             </div>
          </div>
        </div>
        
        <div className="flex-1 min-h-[250px] -ml-6">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                 <CartesianGrid horizontal vertical={false} stroke="rgba(0,0,0,0.05)" strokeDasharray="6 6" />
                 <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'var(--t-dim)', fontFamily: 'JetBrains Mono', fontWeight: 800 }} axisLine={false} tickLine={false}
                   tickFormatter={(v, i) => i % 3 === 0 ? String(v) : ''} />
                 <YAxis tick={{ fontSize: 10, fill: 'var(--t-dim)', fontFamily: 'JetBrains Mono', fontWeight: 800 }} axisLine={false} tickLine={false}
                   tickFormatter={(v) => `${v}%`} />
                 <ReferenceLine x={year} stroke="var(--brand)" strokeDasharray="4 4" strokeWidth={2} opacity={0.3} />
                 <Line type="monotone" dataKey="district" stroke={riskColor} strokeWidth={4} dot={false} animationDuration={1000} className="filter drop-shadow-md" />
                 <Line type="monotone" dataKey="mhAvg" stroke="var(--t-dim)" strokeWidth={2} strokeDasharray="8 4" dot={false} opacity={0.3} />
                 <RechartsTooltip
                    contentStyle={{ backgroundColor: 'white', border: '2px solid var(--bdr)', borderRadius: '20px', padding: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: 'var(--t-dim)', fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    itemStyle={{ fontSize: 14, fontWeight: 900, padding: '4px 0', textTransform: 'uppercase' }}
                 />
              </LineChart>
           </ResponsiveContainer>
        </div>
        <div className="mt-8 pt-8 border-t-2 border-bdr flex items-center justify-between">
            <span className="text-[10px] font-mono text-t-dim uppercase tracking-[0.25em] leading-none font-black italic">Forecast: {data[hazard]}% at {year}</span>
            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-mono border-2 font-black tracking-widest uppercase shadow-sm ${riskLevel === 'HIGH' ? 'bg-risk-hbg border-risk-hb text-risk-h' : 'bg-risk-lbg border-risk-lb text-risk-l'}`}>
               {riskLevel} Threat
            </div>
        </div>
      </div>

      {/* Geospatial Telemetry Feed */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl overflow-hidden flex flex-col text-left relative">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4 text-left">
             <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
                <Database size={20} />
             </div>
             <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">Geospatial Telemetry</span>
          </div>
          <div className={cn("px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 font-black shadow-sm", 
            isLive ? "bg-brand/10 text-brand border-2 border-brand/20 animate-pulse" : "bg-bg-panel text-t-dim border-2 border-bdr")}>
            {isLive ? 'SYSTEM_LIVE' : 'CACHE_READ'}
          </div>
        </div>
        
        <div className="space-y-6 flex-1 pr-2 -mx-2 overflow-auto custom-scrollbar">
          {dicraBars.map(b => (
            <div key={b.label} className="group cursor-help">
              <div className="flex justify-between items-center mb-2.5 leading-none">
                <div className="flex items-center gap-3">
                   <b.icon size={16} className="text-t-dim group-hover:text-brand transition-all" />
                   <span className="text-[11px] text-t-secondary uppercase tracking-[0.15em] font-black group-hover:text-t-primary transition-colors">{b.label}</span>
                </div>
                <span className="font-mono text-base text-t-primary font-black italic tracking-tighter">{b.value}</span>
              </div>
              <div className="h-3 bg-bg-panel rounded-full overflow-hidden border border-bdr shadow-inner p-[1px]">
                <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: `${Math.min(b.pct, 100)}%`, backgroundColor: b.color }} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 pt-8 border-t-2 border-bdr flex items-center justify-between opacity-50">
           <span className="text-[10px] font-mono text-t-dim uppercase tracking-[0.2em] italic font-black">Sync: Stable / -42dBm</span>
           <span className="text-[10px] font-mono text-t-dim uppercase tracking-[0.2em] font-black italic">{district.toUpperCase()}_SCAN_07</span>
        </div>
      </div>

      {/* Regional Intelligence Node */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl flex flex-col text-left relative">
        <div className="flex items-center gap-4 mb-10 text-left">
          <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
            <MapPin size={20} />
          </div>
          <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">Regional Intelligence Node</span>
        </div>
        
        <div className="grid grid-cols-2 gap-5 flex-1 pb-4">
          {profileCells.map(c => (
            <div key={c.label} className="bg-bg-panel/40 rounded-3xl p-6 border-2 border-bdr flex flex-col justify-between group hover:border-brand-border hover:bg-white transition-all shadow-sm">
              <div className="text-left">
                 <span className="font-mono text-[10px] tracking-[0.25em] text-t-dim uppercase leading-none block mb-3 font-black">{c.label}</span>
                 <div className="font-display italic text-3xl text-t-primary group-hover:text-brand transition-all whitespace-nowrap overflow-hidden text-ellipsis font-black tracking-tighter">{c.value}</div>
              </div>
              <span className="text-[10px] font-mono text-t-secondary uppercase tracking-[0.2em] mt-4 block border-t-2 border-bdr/50 pt-4 font-black italic opacity-60">{c.sub}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-10 p-6 rounded-[2rem] bg-brand/5 border-2 border-brand/20 flex items-center gap-5 shadow-inner">
           <div className="w-12 h-12 rounded-[18px] bg-brand flex items-center justify-center text-white shadow-xl">
              <Shield size={20} strokeWidth={3} />
           </div>
           <div className="flex flex-col text-left">
              <span className="text-sm font-outfit font-black text-brand uppercase tracking-[0.2em] leading-none">Security Status</span>
              <span className="text-[10px] font-mono text-t-secondary uppercase tracking-[0.2em] leading-none mt-2 font-black italic">Verification Level: High Scan Active</span>
           </div>
        </div>
      </div>
    </div>
  );
}
