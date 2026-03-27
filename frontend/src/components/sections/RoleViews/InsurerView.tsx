import { Shield, Zap, AlertTriangle, CheckCircle, Waves, Timer, Orbit } from 'lucide-react';
import { DistrictData, TriggerStatus } from '@/lib/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  data: DistrictData;
}

function Gauge({ value, max, threshold, unit, label }: { value: number; max: number; threshold: number; unit: string; label: string }) {
  const pct = Math.min(value / max, 1);
  const arcLen = pct * 188.5;
  const belowThreshold = value < threshold;
  const color = belowThreshold ? '#ef4444' : '#10b981';

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 120 120" className="filter drop-shadow-sm">
        <circle cx="60" cy="60" r="40" strokeWidth="10" stroke="#f3f4f6" fill="none"
          strokeDasharray="188.5 251.3" strokeLinecap="round"
          transform="rotate(135 60 60)" />
        <circle cx="60" cy="60" r="40" strokeWidth="10" stroke={color} fill="none"
          strokeDasharray={`${arcLen} 251.3`} strokeLinecap="round"
          transform="rotate(135 60 60)" className="transition-all duration-1000 ease-out" />
        <text x="60" y="58" textAnchor="middle" className="text-3xl font-bold" fill="#111827">
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}{unit}
        </text>
        <text x="60" y="78" textAnchor="middle" fill="#6b7280" fontSize="10" className="font-semibold uppercase tracking-wider">
          limit: {threshold}{unit}
        </text>
      </svg>
      <span className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function triggerBanner(status: TriggerStatus) {
  switch (status) {
    case 'ARMED': return { bg: 'bg-red-50', border: 'border-red-200', icon: Zap, color: 'text-red-600', text: 'PAYOUT TRIGGER ARMED' };
    case 'MONITOR': return { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle, color: 'text-yellow-600', text: 'SYSTEM MONITOR ACTIVE' };
    case 'FLOOD_WATCH': return { bg: 'bg-blue-50', border: 'border-blue-200', icon: Waves, color: 'text-blue-500', text: 'FLOOD WATCH ACTIVE' };
    default: return { bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, color: 'text-green-600', text: 'STABLE PARAMETRIC STATUS' };
  }
}

export default function InsurerView({ data }: Props) {
  const [coverage, setCoverage] = useState(10);
  const [crop, setCrop] = useState('Bajra');
  const [season, setSeason] = useState<'Kharif' | 'Rabi'>('Kharif');

  const banner = triggerBanner(data.insuranceTrigger);
  const BannerIcon = banner.icon;

  const riskLoading = Math.min((data.drought / 100) * 15, 15);
  const standardPremium = coverage * 100000 * 0.02;
  const adjusted = Math.round(standardPremium * (1 + riskLoading / 100));

  const beforeAfter = [
    { label: 'Payout latency', before: '180-360 days', after: '72 hours' },
    { label: 'Trigger source', before: 'CCE Audit', after: 'GIS Sync' },
    { label: 'Verification risk', before: 'High (Human)', after: 'None (Data)' },
  ];

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 animate-fade-slide">
      {/* Parametric Trigger Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
        
        {/* Target UI Hero Replacement */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">GIS Parametric Protocol</h1>
              <p className="text-blue-100 mb-4">Live Satellite Telemetry Status</p>
            </div>
            <Orbit size={80} className="text-blue-200 opacity-80" />
          </div>
        </div>

        <div className={cn("rounded-xl p-5 flex items-center justify-between border-2 shadow-sm", banner.bg, banner.border)}>
           <div className="flex items-center gap-3">
              <BannerIcon size={24} className={banner.color} />
              <span className={cn("text-sm font-bold uppercase tracking-widest", banner.color)}>{banner.text}</span>
           </div>
           <Shield size={24} className={cn("opacity-40", banner.color)} />
        </div>

        <div className="flex gap-8 justify-center my-6">
          <Gauge value={data.soilMoisture} max={50} threshold={20} unit="%" label="Soil Moisture" />
          <Gauge value={data.ndvi} max={1} threshold={0.30} unit="" label="NDVI Index" />
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center px-1 mb-4">
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Legacy Framework</span>
             <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Agriguard Protocol</span>
          </div>
          {beforeAfter.map((row, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
              <div className="flex flex-col gap-1 w-28">
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Metric</span>
                 <span className="text-sm text-gray-900 font-bold leading-none">{row.label}</span>
              </div>
              <span className="text-gray-400 line-through text-xs font-semibold">{row.before.toUpperCase()}</span>
              <div className="h-px flex-1 mx-4 bg-gray-200" />
              <span className="text-blue-600 text-xl font-bold tracking-tight">{row.after.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Premium Calculation Hub */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
        
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
               <Shield size={20} />
             </div>
             <span className="text-lg font-semibold text-gray-900">Risk Underwriting</span>
          </div>
          <div className="flex items-center gap-2">
             <Timer size={16} className="text-gray-400" />
             <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Update: Live Sync</span>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-3">
               <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Coverage Amount</span>
               <span className="text-xl text-blue-600 font-bold tracking-tight">₹{coverage}L</span>
            </div>
            <input type="range" min={1} max={50} value={coverage} onChange={e => setCoverage(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #2563eb ${((coverage - 1) / 49) * 100}%, #e5e7eb ${((coverage - 1) / 49) * 100}%)` }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Crop Type</span>
                <select value={crop} onChange={e => setCrop(e.target.value)}
                   className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 text-sm font-semibold focus:border-blue-300 focus:outline-none appearance-none cursor-pointer">
                   {['Bajra', 'Jowar', 'Sugarcane', 'Cotton', 'Wheat'].map(c => (
                     <option key={c} value={c}>{c}</option>
                   ))}
                </select>
             </div>
             <div className="flex flex-col gap-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Season</span>
                <div className="flex p-1 bg-gray-50 border border-gray-200 rounded-lg">
                   {(['Kharif', 'Rabi'] as const).map((s) => (
                     <button key={s} onClick={() => setSeason(s)}
                       className={cn(
                         "flex-1 py-2 text-[11px] rounded-md transition-shadow font-bold uppercase tracking-wider",
                         season === s ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-500'
                       )}>
                       {s}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mt-4 border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
              <Shield size={120} className="text-blue-600" />
           </div>
           
           <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-4">
                <span className="text-gray-600 font-semibold uppercase tracking-wide">Core PMFBY Base (2%)</span>
                <span className="text-gray-900 font-bold text-base">₹{standardPremium.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-4">
                <div className="flex flex-col">
                   <span className="text-gray-600 font-semibold uppercase tracking-wide">Geospatial Risk Factor</span>
                   <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-0.5">Adjusted via {data.drought}% drought prob.</span>
                </div>
                <span className="font-bold text-base" style={{ color: riskLoading > 8 ? '#ef4444' : '#f59e0b' }}>+{riskLoading.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-gray-900 font-bold uppercase tracking-widest text-lg">Final Premium</span>
                <div className="text-right">
                   <span className="text-4xl font-black tracking-tight" style={{ color: riskLoading > 8 ? '#ef4444' : '#f59e0b' }}>₹{adjusted.toLocaleString()}</span>
                </div>
              </div>
           </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest font-semibold flex-grow flex items-end justify-center pb-2">
          Systematic underwriting applied via satellite telemetry v4.2
        </p>
      </div>
    </div>
  );
}
