import { Sprout, ArrowRight, Zap, Droplets, Leaf } from 'lucide-react';
import { DistrictData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  data: DistrictData;
  year: number;
}

const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];

function getMonthColor(i: number): string {
  if (i >= 5 && i <= 8) return 'rgba(76,166,28,0.25)'; // Monsoon - Green
  if (i === 3 || i === 4 || i === 9) return 'rgba(249,168,37,0.2)'; // Summer/Transition - Amber
  return 'rgba(211,47,47,0.1)'; // Dry - Red
}

export default function FarmerView({ data, year }: Props) {
  const steps = [
    { month: 'MARCH', title: 'Systematic Risk Check', detail: `${data.drought}% drought projection for ${year}` },
    { month: 'APRIL', title: `Smart Crop Selection: ${data.primaryCrop}`, detail: 'Bank-verified climate resilience data linked' },
    { month: 'OCTOBER', title: 'Automated Payout Trigger', detail: '72hr transfer if threshold is breached' },
  ];

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 animate-fade-slide">
      {/* Crop Strategy Module */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl relative overflow-hidden text-left">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-brand/10 text-brand border border-brand/20 shadow-sm">
            <Sprout size={20} />
          </div>
          <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em]">Crop Performance Hub</span>
        </div>

        <div className="relative mb-10">
           <span className="font-mono text-[11px] text-t-dim uppercase tracking-[0.3em] font-black">AI-OPTIMIZED RECOMMENDATION</span>
           <div className="font-display italic text-5xl text-brand mt-3 uppercase tracking-tight font-black">{data.primaryCrop}</div>
           <p className="text-base text-t-secondary mt-3 leading-relaxed font-medium">Top-tier resilience for {data.drought}% drought probability by {year}</p>
        </div>

        <div className="h-0.5 bg-bdr w-full mb-10 rounded-full" />

        <div className="space-y-4 mb-10">
           <span className="font-mono text-[10px] text-t-dim uppercase tracking-[0.3em] block mb-4 font-black">Variant Analysis</span>
           {data.primaryCrop.split(' / ').map(crop => (
             <div key={crop} className="flex items-center justify-between p-5 rounded-2xl bg-bg-panel border border-bdr hover:border-brand-border transition-all group">
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-brand shadow-[0_0_8px_rgba(76,166,28,0.5)]" />
                   <span className="text-base text-t-primary font-black uppercase tracking-tight group-hover:text-brand transition-colors">{crop.trim()}</span>
                </div>
                <span className="text-[10px] font-mono px-3 py-1.5 rounded-xl bg-brand text-white font-black uppercase tracking-widest shadow-sm">RESILIENT</span>
             </div>
           ))}
           {data.avoidCrops.map(crop => (
             <div key={crop} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-bdr opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-risk-h shadow-[0_0_8px_rgba(211,47,47,0.3)]" />
                   <span className="text-base text-t-secondary font-bold uppercase tracking-tight">{crop}</span>
                </div>
                <span className="text-[10px] font-mono px-3 py-1.5 rounded-xl bg-risk-hbg text-risk-h border-2 border-risk-hb font-black uppercase tracking-widest">HIGH WATER NEED</span>
             </div>
           ))}
        </div>

        {/* Dynamic Sowing Timeline */}
        <div className="pt-8 border-t-2 border-bdr">
           <div className="flex items-center justify-between mb-5 leading-none px-2">
              <span className="font-mono text-[11px] text-t-dim uppercase tracking-[0.25em] font-black">Operational Sowing Matrix</span>
              <div className="flex items-center gap-2">
                 <Leaf size={14} className="text-brand" />
                 <span className="text-[11px] font-mono text-brand font-black uppercase tracking-widest leading-none">KHARIF CYCLE</span>
              </div>
           </div>
           <div className="flex gap-2.5 py-4">
             {months.map((m, i) => (
               <div key={i} className="flex-1 flex flex-col items-center">
                 <div className="w-full h-12 rounded-xl transition-all duration-500 hover:scale-y-110 shadow-sm" style={{ backgroundColor: getMonthColor(i) }} />
                 <span className={cn("text-[10px] font-mono mt-3 uppercase tracking-tighter font-bold", i >= 5 && i <= 8 ? "text-brand font-black" : "text-t-dim")}>{m}</span>
               </div>
             ))}
           </div>
        </div>

        {data.drought > 60 && (
          <div className="border-l-[6px] border-risk-h bg-risk-hbg rounded-r-3xl p-6 mt-10 flex items-start gap-4 shadow-sm">
            <Zap size={20} className="text-risk-h mt-1 shrink-0 animate-pulse" />
            <p className="italic text-sm text-risk-h font-black uppercase tracking-widest leading-relaxed">{data.advisory}</p>
          </div>
        )}
      </div>

      {/* Institutional Connectivity Roadmap */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl overflow-hidden relative text-left">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
            <ArrowRight size={20} />
          </div>
          <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">Institutional Sync</span>
        </div>

        <div className="relative px-4">
          <div className="absolute left-[31px] top-0 bottom-0 w-1 bg-bdr rounded-full" />
          {steps.map((s, i) => (
            <div key={i} className="pl-16 relative mb-12 group">
              <div className={cn(
                "absolute left-0 w-16 h-16 rounded-3xl flex items-center justify-center text-[11px] font-mono border-4 bg-white z-10 transition-all duration-500 shadow-md font-black",
                i === 0 ? 'border-brand text-brand shadow-xl bg-brand/5 scale-110' : 'border-bdr text-t-dim group-hover:border-brand-border group-hover:text-brand'
              )}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="pt-2">
                 <span className="font-mono text-[10px] text-brand uppercase tracking-[0.3em] font-black">{s.month}</span>
                 <p className="font-display italic text-2xl text-t-primary leading-tight mt-1.5 font-black uppercase tracking-tighter">{s.title}</p>
                 <p className="text-sm text-t-secondary font-bold mt-2 pr-6 leading-relaxed opacity-80">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Global Impact Grid */}
        <div className="mt-10 pt-10 border-t-2 border-bdr grid grid-cols-3 gap-8 text-center px-4">
          <div className="p-6 rounded-[2rem] bg-bg-panel border border-bdr shadow-inner hover:translate-y-[-4px] transition-all">
            <Droplets size={20} className="mx-auto mb-3 text-risk-h" />
            <div className="font-display italic text-3xl text-t-primary font-black uppercase tracking-tighter">{data.drought}%</div>
            <div className="text-[10px] font-mono text-t-dim uppercase tracking-[0.2em] mt-2 font-black">Drought Risk</div>
          </div>
          <div className="p-6 rounded-[2rem] bg-bg-panel border border-bdr shadow-inner hover:translate-y-[-4px] transition-all">
            <Leaf size={20} className="mx-auto mb-3 text-brand" />
            <div className="font-display italic text-3xl text-t-primary font-black uppercase tracking-tighter">₹0</div>
            <div className="text-[10px] font-mono text-t-dim uppercase tracking-[0.2em] mt-2 font-black">Extra Cost</div>
          </div>
          <div className="p-6 rounded-[2rem] bg-bg-panel border border-bdr shadow-inner hover:translate-y-[-4px] transition-all">
            <svg className="mx-auto mb-3 text-brand" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            <div className="font-display italic text-3xl text-t-primary font-black uppercase tracking-tighter">72hr</div>
            <div className="text-[10px] font-mono text-t-dim uppercase tracking-[0.2em] mt-2 font-black">Transfer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
