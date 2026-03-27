import { Sprout, ArrowRight, Zap, Droplets, Leaf } from 'lucide-react';
import { DistrictData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  data: DistrictData;
  year: number;
}

const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];

function getMonthColor(i: number): string {
  if (i >= 5 && i <= 8) return 'var(--risk-lbg)'; // Monsoon
  if (i === 3 || i === 4 || i === 9) return 'var(--risk-mbg)'; // Summer
  return 'var(--risk-hbg)'; // Dry
}

export default function FarmerView({ data, year }: Props) {
  const steps = [
    { month: 'MARCH', title: 'Systematic Risk Check', detail: `${data.drought}% drought projection for ${year}` },
    { month: 'APRIL', title: `Smart Crop Selection: ${data.primaryCrop}`, detail: 'Bank-verified climate resilience data linked' },
    { month: 'OCTOBER', title: 'Automated Payout Trigger', detail: '72hr transfer if threshold is breached' },
  ];

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 animate-fade-slide">
      {/* Crop Strategy Module */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
        
        {/* Target UI Hero Replacement */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{data.primaryCrop}</h1>
              <p className="text-green-100 mb-4">Top-tier resilience for {data.drought}% drought probability by {year}</p>
            </div>
            <Sprout size={80} className="text-green-200 opacity-80" />
          </div>
        </div>

        <div className="space-y-4">
           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-4">Variant Analysis</span>
           {data.primaryCrop.split(' / ').map(crop => (
             <div key={crop} className="flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50 transition-all group">
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                   <span className="text-base text-gray-900 font-semibold group-hover:text-green-700 transition-colors">{crop.trim()}</span>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded bg-green-600 text-white shadow-sm">RESILIENT</span>
             </div>
           ))}
           {data.avoidCrops.map(crop => (
             <div key={crop} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200 opacity-70">
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                   <span className="text-base text-gray-600 font-semibold">{crop}</span>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded bg-red-100 text-red-700 border border-red-200">HIGH WATER NEED</span>
             </div>
           ))}
        </div>

        {/* Dynamic Sowing Timeline */}
        <div className="pt-6 border-t border-gray-100">
           <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Operational Sowing Matrix</span>
              <div className="flex items-center gap-2">
                 <Leaf size={14} className="text-green-600" />
                 <span className="text-xs text-green-600 font-semibold uppercase tracking-wider">KHARIF CYCLE</span>
              </div>
           </div>
           <div className="flex gap-2 py-2">
             {months.map((m, i) => (
               <div key={i} className="flex-1 flex flex-col items-center">
                 <div className="w-full h-8 rounded-md transition-all duration-300" style={{ backgroundColor: getMonthColor(i) }} />
                 <span className={cn("text-xs mt-2 font-medium", i >= 5 && i <= 8 ? "text-green-600 font-bold" : "text-gray-400")}>{m}</span>
               </div>
             ))}
           </div>
        </div>

        {data.drought > 60 && (
          <div className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-4 mt-4 flex items-start gap-3 shadow-sm">
            <Zap size={18} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 font-medium leading-relaxed">{data.advisory}</p>
          </div>
        )}
      </div>

      {/* Institutional Connectivity Roadmap */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-100">
            <ArrowRight size={20} />
          </div>
          <span className="text-lg font-semibold text-gray-900">Institutional Sync</span>
        </div>

        <div className="relative px-2 flex-grow">
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gray-200" />
          {steps.map((s, i) => (
            <div key={i} className="pl-14 relative mb-10 group">
              <div className={cn(
                "absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300 z-10",
                i === 0 ? 'bg-green-600 text-white shadow-md scale-105' : 'bg-white border-2 border-gray-200 text-gray-500 group-hover:border-green-300'
              )}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="pt-1">
                 <span className="text-xs text-green-600 font-semibold uppercase tracking-wider">{s.month}</span>
                 <p className="text-xl text-gray-900 font-bold mt-1">{s.title}</p>
                 <p className="text-sm text-gray-600 mt-1">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Global Impact Grid */}
        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
            <Droplets size={20} className="mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold text-gray-900">{data.drought}%</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Drought Risk</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
            <Leaf size={20} className="mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">₹0</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Extra Cost</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
            <svg className="mx-auto mb-2 text-green-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            <div className="text-2xl font-bold text-gray-900">72hr</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Transfer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
