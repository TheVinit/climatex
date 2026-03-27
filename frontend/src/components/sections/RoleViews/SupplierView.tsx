import { Leaf, AlertTriangle, CheckCircle, Circle, Box, Truck, BarChart3 } from 'lucide-react';
import { DistrictData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  data: DistrictData;
  district: string;
}

const seedColors: Record<string, string> = {
  bajra: 'var(--brand)', jowar: '#5ab87a', cotton: '#f59e0b', turDal: '#3b82f6', chickpea: '#10b981',
};
const seedNames: Record<string, string> = {
  bajra: 'BAJRA SEED', jowar: 'JOWAR SEED', cotton: 'COTTON SEED', turDal: 'TUR DAL SEED', chickpea: 'CHICKPEA SEED',
};

const westernDistricts = ['Pune', 'Nashik', 'Kolhapur', 'Palghar', 'Thane', 'Raigad', 'Ratnagiri', 'Sindhudurg'];
const centralDistricts = ['Aurangabad', 'Jalna', 'Parbhani', 'Hingoli', 'Nanded', 'Beed', 'Osmanabad', 'Latur'];

function getZone(d: string) {
  if (westernDistricts.includes(d)) return 0;
  if (centralDistricts.includes(d)) return 1;
  return 2;
}

export default function SupplierView({ data, district }: Props) {
  const seeds = Object.entries(data.seedDemand);
  const maxVal = Math.max(...seeds.map(([, v]) => v));
  const zone = getZone(district);

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 animate-fade-slide">
      {/* Demand Forecaster Hub */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl overflow-hidden relative flex flex-col text-left">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
            <BarChart3 size={20} />
          </div>
          <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">Logistics Forecasting Engine</span>
        </div>

        <div className="relative mb-10">
           <span className="font-mono text-[11px] text-t-dim uppercase tracking-[0.3em] font-black">INPUT_DEMAND_PROJECTION</span>
           <div className="font-display italic text-4xl text-brand mt-3 uppercase tracking-tight font-black">Demand Trace: {district}</div>
           <p className="text-[11px] font-mono text-t-secondary mt-3 uppercase tracking-[0.25em] leading-none font-black italic">Satellite Correlated - Node V4.2.1 Alpha</p>
        </div>

        <div className="flex-1 space-y-5 pr-2 -mx-2">
          {seeds.map(([key, val]) => (
            <div key={key} className="flex flex-col gap-4 p-6 bg-white border-2 border-bdr rounded-2xl group transition-all hover:border-brand-border shadow-sm">
              <div className="flex justify-between items-center leading-none text-left">
                <span className="text-[11px] font-mono text-t-primary font-black tracking-[0.2em] group-hover:text-brand transition-colors uppercase">{seedNames[key]}</span>
                <span className="font-mono text-xs text-t-dim font-black italic">{val.toLocaleString()} KG PROJECTION</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex-1 h-3 bg-bg-panel rounded-full overflow-hidden border border-bdr shadow-inner">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: `${(val / maxVal) * 100}%`, backgroundColor: seedColors[key] }} />
                 </div>
                 <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: seedColors[key] }} />
              </div>
            </div>
          ))}
        </div>

        {data.drought > 60 && (
          <div className="bg-risk-hbg border-2 border-risk-hb rounded-[2rem] p-8 mt-10 flex items-start gap-5 shadow-lg">
            <AlertTriangle size={24} className="text-risk-h mt-1 shrink-0 animate-pulse" />
            <div className="flex flex-col gap-2">
               <span className="font-black text-risk-h text-sm uppercase tracking-[0.25em] leading-none">SUPPLY_CHAIN_ALERT</span>
               <p className="text-xs text-risk-h/80 italic font-bold leading-relaxed opacity-90">
                 Critical drought node: Scale down water-intensive input dispatches. Target -{Math.round(data.drought * 0.6)}% adjustment on high-water seeds.
               </p>
            </div>
          </div>
        )}
      </div>

      {/* Strategic Deployment Map Hub */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl overflow-hidden relative flex flex-col text-left">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
            <Truck size={20} />
          </div>
          <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">Strategic Deployment HUB</span>
        </div>

        <div className="bg-bg-panel/40 rounded-[2.5rem] p-6 border-2 border-bdr shadow-inner mb-10">
           <svg width="100%" height="280" viewBox="0 0 400 240" className="mt-4 filter drop-shadow-xl">
             <g className="group/node cursor-pointer">
                <rect x="20" y="10" width="360" height="65" rx="16" fill="rgba(46,125,50,0.06)" className="stroke-2 stroke-[#e2e8e2] group-hover:stroke-brand transition-all" />
                <text x="200" y="34" textAnchor="middle" fill="var(--brand)" fontSize="11" className="font-mono uppercase font-black tracking-[0.25em]">COASTAL-WESTERN MATRIX</text>
                <text x="200" y="52" textAnchor="middle" fill="var(--t-dim)" fontSize="9" className="font-mono uppercase tracking-[0.2em] font-bold italic">Stable / Standard Lead-Times</text>
             </g>

             <g className="group/node cursor-pointer">
                <rect x="20" y="85" width="360" height="65" rx="16" fill="rgba(249,168,37,0.06)" className="stroke-2 stroke-[#e2e8e2] group-hover:stroke-risk-m transition-all" />
                <text x="200" y="109" textAnchor="middle" fill="var(--risk-m)" fontSize="11" className="font-mono uppercase font-black tracking-[0.25em]">CENTRAL-NEXUS NODE</text>
                <text x="200" y="127" textAnchor="middle" fill="var(--t-dim)" fontSize="9" className="font-mono uppercase tracking-[0.2em] font-bold italic">Elevated Demand Trace Verified</text>
             </g>

             <g className="group/node cursor-pointer">
                <rect x="20" y="160" width="360" height="70" rx="16" fill="rgba(211,47,47,0.06)" className="stroke-2 stroke-[#e2e8e2] group-hover:stroke-risk-h transition-all" />
                <text x="200" y="186" textAnchor="middle" fill="var(--risk-h)" fontSize="11" className="font-mono uppercase font-black tracking-[0.25em]">MARATHWADA-VIDARBHA CORE</text>
                <text x="200" y="204" textAnchor="middle" fill="var(--t-dim)" fontSize="9" className="font-mono uppercase tracking-[0.2em] font-bold italic">Critical / Pre-Deployment Active</text>
             </g>

             <g transform={`translate(200, ${zone === 0 ? 35 : zone === 1 ? 110 : 185})`} className="animate-in fade-in duration-1000">
                <circle r="8" fill={zone === 0 ? 'var(--brand)' : zone === 1 ? 'var(--risk-m)' : 'var(--risk-h)'} className="shadow-2xl" />
                <circle r="14" fill="none" stroke={zone === 0 ? 'var(--brand)' : zone === 1 ? 'var(--risk-m)' : 'var(--risk-h)'} strokeWidth="2" opacity="0.4" className="animate-ping" />
                <text y="-30" textAnchor="middle" fill="var(--brand)" fontSize="9" className="font-mono font-black uppercase tracking-[0.3em] italic">{district.toUpperCase()} NODE</text>
             </g>
           </svg>
        </div>

        <div className="space-y-5 px-2">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border-2 border-bdr group hover:bg-bg-panel hover:border-brand transition-all shadow-sm">
            <CheckCircle size={20} className="text-brand shrink-0 mt-1" />
            <div className="flex flex-col gap-1.5">
               <span className="text-[11px] font-mono text-t-primary font-black uppercase tracking-[0.2em] leading-none group-hover:text-brand">Command: INVENTORY SHIFT</span>
               <span className="text-[11px] text-t-dim font-bold uppercase leading-relaxed tracking-tight group-hover:text-t-primary">Stock 40% more drought-tolerant varieties at {district} regional depot.</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border-2 border-bdr group hover:bg-bg-panel hover:border-brand transition-all shadow-sm">
            <CheckCircle size={20} className="text-brand shrink-0 mt-1" />
            <div className="flex flex-col gap-1.5">
               <span className="text-[11px] font-mono text-t-primary font-black uppercase tracking-[0.2em] leading-none group-hover:text-brand">Command: LOGISTICS STRATEGY</span>
               <span className="text-[11px] text-t-dim font-bold uppercase leading-relaxed tracking-tight group-hover:text-t-primary">Reduce water-intensive input supply in {district} by {data.kccReduction}% to prevent waste.</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-bg-panel border-2 border-bdr opacity-40 grayscale group hover:grayscale-0 transition-all">
            <Circle size={20} className="text-t-dim shrink-0 mt-1" />
            <div className="flex flex-col gap-1.5">
               <span className="text-[11px] font-mono text-t-dim uppercase tracking-[0.2em] leading-none font-black italic">PENDING: FEDERATED STORAGE SYNC</span>
               <span className="text-[11px] text-t-dim italic uppercase leading-relaxed tracking-tight font-bold">Awaiting regional warehouse satellite telemetry link.</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-10 border-t-2 border-bdr flex items-center justify-between opacity-60">
           <div className="flex items-center gap-3">
              <Box size={18} className="text-t-dim" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-t-dim font-black italic">Logistics Grid: SECURE</span>
           </div>
           <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-t-dim font-black italic opacity-50">Last Update: 228ms Sync</span>
        </div>
      </div>
    </div>
  );
}
