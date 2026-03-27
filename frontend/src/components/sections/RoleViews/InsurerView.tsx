import { Shield, Zap, AlertTriangle, CheckCircle, Waves, Timer, Orbit } from 'lucide-react';
import { DistrictData, TriggerStatus } from '@/lib/types';
import { getRiskColor } from '@/lib/data';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  data: DistrictData;
}

function Gauge({ value, max, threshold, unit, label }: { value: number; max: number; threshold: number; unit: string; label: string }) {
  const pct = Math.min(value / max, 1);
  const arcLen = pct * 188.5;
  const belowThreshold = value < threshold;
  const color = belowThreshold ? 'var(--risk-h)' : 'var(--risk-l)';

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 120 120" className="filter drop-shadow-lg">
        <circle cx="60" cy="60" r="40" strokeWidth="10" stroke="#f0f2f0" fill="none"
          strokeDasharray="188.5 251.3" strokeLinecap="round"
          transform="rotate(135 60 60)" />
        <circle cx="60" cy="60" r="40" strokeWidth="10" stroke={color} fill="none"
          strokeDasharray={`${arcLen} 251.3`} strokeLinecap="round"
          transform="rotate(135 60 60)" className="transition-all duration-1000 ease-out" />
        <text x="60" y="58" textAnchor="middle" className="font-display italic text-3xl font-black" fill="var(--t-primary)">
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}{unit}
        </text>
        <text x="60" y="78" textAnchor="middle" fill="var(--t-dim)" fontSize="10" className="font-mono uppercase tracking-widest font-black">
          limit: {threshold}{unit}
        </text>
      </svg>
      <span className="text-[11px] font-mono text-t-dim mt-4 uppercase tracking-[0.3em] font-black">{label}</span>
    </div>
  );
}

function triggerBanner(status: TriggerStatus) {
  switch (status) {
    case 'ARMED': return { bg: 'rgba(211,47,47,0.1)', border: 'rgba(211,47,47,0.2)', icon: Zap, color: 'var(--risk-h)', text: 'PAYOUT TRIGGER ARMED' };
    case 'MONITOR': return { bg: 'rgba(249,168,37,0.1)', border: 'rgba(249,168,37,0.2)', icon: AlertTriangle, color: 'var(--risk-m)', text: 'SYSTEM MONITOR ACTIVE' };
    case 'FLOOD_WATCH': return { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', icon: Waves, color: '#3b82f6', text: 'FLOOD WATCH ACTIVE' };
    default: return { bg: 'rgba(46,125,50,0.1)', border: 'rgba(46,125,50,0.2)', icon: CheckCircle, color: 'var(--risk-l)', text: 'STABLE PARAMETRIC STATUS' };
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
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 animate-fade-slide">
      {/* Parametric Trigger Status */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl overflow-hidden relative text-left">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
            <Orbit size={20} />
          </div>
          <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">GIS Parametric Protocol</span>
        </div>

        <div className="rounded-3xl p-6 mb-12 flex items-center justify-between border-4 animate-pulse shadow-lg" style={{ backgroundColor: banner.bg, borderColor: banner.border }}>
           <div className="flex items-center gap-4">
              <BannerIcon size={24} style={{ color: banner.color }} />
              <span className="text-base font-black uppercase tracking-[0.25em]" style={{ color: banner.color }}>{banner.text}</span>
           </div>
           <Shield size={24} style={{ color: banner.color }} opacity={0.4} />
        </div>

        <div className="flex gap-12 justify-center my-14">
          <Gauge value={data.soilMoisture} max={50} threshold={20} unit="%" label="Soil Moisture" />
          <Gauge value={data.ndvi} max={1} threshold={0.30} unit="" label="NDVI Index" />
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex justify-between items-center px-2 mb-6 border-b-2 border-bdr pb-2">
             <span className="font-mono text-[10px] text-t-dim uppercase tracking-[0.3em] font-black">Legacy Framework</span>
             <span className="font-mono text-[10px] text-brand uppercase tracking-[0.3em] font-black">Agriguard Protocol</span>
          </div>
          {beforeAfter.map((row, i) => (
            <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-bg-panel border border-bdr hover:bg-white transition-all shadow-sm">
              <div className="flex flex-col gap-1.5 w-32">
                 <span className="text-[10px] font-mono text-t-dim uppercase tracking-[0.2em] leading-none font-black">Metric</span>
                 <span className="text-sm text-t-primary font-black leading-none uppercase tracking-tight">{row.label}</span>
              </div>
              <span className="text-t-dim/60 line-through italic text-xs font-mono font-bold">{row.before.toUpperCase()}</span>
              <div className="h-0.5 flex-1 mx-6 bg-bdr rounded-full" />
              <span className="text-brand font-display italic text-2xl font-black uppercase tracking-tighter">{row.after.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Premium Calculation Hub */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl relative overflow-hidden text-left">
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
               <Shield size={20} />
             </div>
             <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">Risk Underwriting</span>
          </div>
          <div className="flex items-center gap-3">
             <Timer size={18} className="text-t-dim" />
             <span className="text-[10px] font-mono text-t-dim uppercase tracking-widest leading-none italic font-bold">Update: Live Sync</span>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <div className="flex justify-between mb-5 leading-none">
               <span className="font-mono text-[10px] text-t-dim uppercase tracking-[0.3em] font-black">Coverage Quantum</span>
               <span className="font-mono text-2xl text-brand font-black italic tracking-tighter">₹{coverage}L</span>
            </div>
            <input type="range" min={1} max={50} value={coverage} onChange={e => setCoverage(Number(e.target.value))}
              className="w-full h-2 bg-bg-panel rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, var(--brand) ${((coverage - 1) / 49) * 100}%, #e2e8e2 ${((coverage - 1) / 49) * 100}%)` }} />
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-t-dim uppercase tracking-[0.3em] leading-none px-2 font-black">CROP_TYPE</span>
                <select value={crop} onChange={e => setCrop(e.target.value)}
                   className="w-full bg-bg-panel border-2 border-bdr text-t-primary rounded-2xl px-5 py-4 text-sm font-mono font-black focus:border-brand-border focus:outline-none appearance-none cursor-pointer hover:bg-white transition-all shadow-sm">
                   {['Bajra', 'Jowar', 'Sugarcane', 'Cotton', 'Wheat'].map(c => (
                     <option key={c} value={c} className="bg-white">{c.toUpperCase()}</option>
                   ))}
                </select>
             </div>
             <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-t-dim uppercase tracking-[0.3em] leading-none px-2 font-black">SEASON_MATRIX</span>
                <div className="flex p-1.5 bg-bg-panel border-2 border-bdr rounded-2xl shadow-sm">
                   {(['Kharif', 'Rabi'] as const).map((s) => (
                     <button key={s} onClick={() => setSeason(s)}
                       className={cn(
                         "flex-1 py-3 text-[10px] font-mono border-2 rounded-xl transition-all duration-300 font-black tracking-widest",
                         season === s ? 'bg-white border-brand-border text-brand shadow-lg' : 'bg-transparent border-transparent text-t-dim opacity-50'
                       )}>
                       {s.toUpperCase()}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="bg-bg-panel/40 rounded-[2.5rem] p-10 mt-12 border-2 border-bdr relative overflow-hidden shadow-inner">
           <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none">
              <Shield size={160} strokeWidth={0.5} className="text-brand" />
           </div>
           
           <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center text-base border-b-2 border-bdr/50 pb-5 last:border-0 last:pb-0">
                <span className="text-t-secondary font-black uppercase tracking-tight">Core PMFBY Base (2%)</span>
                <span className="font-mono text-t-primary font-black text-lg">₹{standardPremium.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-base border-b-2 border-bdr/50 pb-5 last:border-0 last:pb-0">
                <div className="flex flex-col">
                   <span className="text-t-secondary font-black uppercase tracking-tight text-sm">Geospatial Risk Factor</span>
                   <span className="text-[10px] font-mono text-t-dim uppercase tracking-[0.2em] font-black italic">Adjusted via {data.drought}% drought prob.</span>
                </div>
                <span className="font-mono font-black text-lg" style={{ color: riskLoading > 8 ? 'var(--risk-h)' : 'var(--risk-m)' }}>+{riskLoading.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center pt-5">
                <span className="text-t-primary font-outfit font-black uppercase tracking-[0.2em] text-xl">FINAL PREMIUM</span>
                <div className="text-right">
                   <span className="font-display italic text-5xl font-black tracking-tighter" style={{ color: getRiskColor(data.droughtLevel) }}>₹{adjusted.toLocaleString()}</span>
                   <p className="text-[10px] font-mono text-t-dim uppercase tracking-[0.25em] mt-2 font-black opacity-80 italic">Verified via Satellite Telemetry Protocol</p>
                </div>
              </div>
           </div>
        </div>

        <p className="italic text-[10px] font-mono text-t-dim text-center mt-8 uppercase tracking-[0.25em] leading-relaxed font-black opacity-60">Systematic underwriting applied via federated satellite loading algorithm v4.2.1-secure stack</p>
      </div>
    </div>
  );
}
