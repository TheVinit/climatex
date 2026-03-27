import { Leaf, AlertTriangle, CheckCircle, Circle, Box, Truck, BarChart3 } from 'lucide-react';
import { DistrictData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  data: DistrictData;
  district: string;
}

const seedColors: Record<string, string> = {
  bajra: '#10b981', jowar: '#34d399', cotton: '#f59e0b', turDal: '#3b82f6', chickpea: '#8b5cf6',
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
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 animate-fade-slide">
      {/* Demand Forecaster Hub */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
        
        {/* Target UI Hero Replacement */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Demand Trace: {district}</h1>
              <p className="text-amber-100 mb-4">Satellite Correlated Logistics Node</p>
            </div>
            <BarChart3 size={80} className="text-amber-200 opacity-80" />
          </div>
        </div>

        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block -mb-4 pt-2">Input Demand Projection</span>

        <div className="flex-1 space-y-4">
          {seeds.map(([key, val]) => (
            <div key={key} className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-amber-200 group">
              <div className="flex justify-between items-center text-left">
                <span className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors uppercase">{seedNames[key]}</span>
                <span className="text-xs font-semibold text-gray-500">{val.toLocaleString()} KG</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(val / maxVal) * 100}%`, backgroundColor: seedColors[key] }} />
                 </div>
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seedColors[key] }} />
              </div>
            </div>
          ))}
        </div>

        {data.drought > 60 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-4 flex items-start gap-4 shadow-sm">
            <AlertTriangle size={20} className="text-red-600 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1">
               <span className="font-bold text-red-700 text-sm uppercase tracking-wider">Supply Chain Alert</span>
               <p className="text-sm text-red-800 font-medium">
                 Critical drought node: Scale down water-intensive input dispatches. Target -{Math.round(data.drought * 0.6)}% adjustment on high-water seeds.
               </p>
            </div>
          </div>
        )}
      </div>

      {/* Strategic Deployment Map Hub */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2 pt-2">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
            <Truck size={20} />
          </div>
          <span className="text-lg font-semibold text-gray-900">Strategic Deployment Hub</span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
           <svg width="100%" height="240" viewBox="0 0 400 240" className="mt-2 filter drop-shadow-sm">
             <g className="group/node cursor-pointer">
                <rect x="20" y="10" width="360" height="65" rx="12" fill="#ecfdf5" className="stroke-2 stroke-gray-200 group-hover:stroke-green-400 transition-all opacity-80" />
                <text x="200" y="34" textAnchor="middle" fill="#10b981" fontSize="11" className="uppercase font-bold tracking-widest">COASTAL-WESTERN MATRIX</text>
                <text x="200" y="52" textAnchor="middle" fill="#6b7280" fontSize="9" className="uppercase tracking-wider font-semibold">Stable / Standard Lead-Times</text>
             </g>

             <g className="group/node cursor-pointer">
                <rect x="20" y="85" width="360" height="65" rx="12" fill="#fffbeb" className="stroke-2 stroke-gray-200 group-hover:stroke-amber-400 transition-all opacity-80" />
                <text x="200" y="109" textAnchor="middle" fill="#f59e0b" fontSize="11" className="uppercase font-bold tracking-widest">CENTRAL-NEXUS NODE</text>
                <text x="200" y="127" textAnchor="middle" fill="#6b7280" fontSize="9" className="uppercase tracking-wider font-semibold">Elevated Demand Trace Verified</text>
             </g>

             <g className="group/node cursor-pointer">
                <rect x="20" y="160" width="360" height="70" rx="12" fill="#fef2f2" className="stroke-2 stroke-gray-200 group-hover:stroke-red-400 transition-all opacity-80" />
                <text x="200" y="186" textAnchor="middle" fill="#ef4444" fontSize="11" className="uppercase font-bold tracking-widest">MARATHWADA-VIDARBHA CORE</text>
                <text x="200" y="204" textAnchor="middle" fill="#6b7280" fontSize="9" className="uppercase tracking-wider font-semibold">Critical / Pre-Deployment Active</text>
             </g>

             <g transform={`translate(200, ${zone === 0 ? 35 : zone === 1 ? 110 : 185})`} className="animate-in fade-in duration-1000">
                <circle r="8" fill={zone === 0 ? '#10b981' : zone === 1 ? '#f59e0b' : '#ef4444'} className="drop-shadow-md" />
                <circle r="14" fill="none" stroke={zone === 0 ? '#10b981' : zone === 1 ? '#f59e0b' : '#ef4444'} strokeWidth="2" opacity="0.4" className="animate-ping" />
                <text y="-25" textAnchor="middle" fill={zone === 0 ? '#059669' : zone === 1 ? '#d97706' : '#b91c1c'} fontSize="10" className="font-bold uppercase tracking-widest">{district.toUpperCase()} NODE</text>
             </g>
           </svg>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all">
            <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
               <span className="text-xs text-gray-900 font-bold uppercase tracking-wider">Command: INVENTORY SHIFT</span>
               <span className="text-sm text-gray-600 font-medium">Stock 40% more drought-tolerant varieties at {district} regional depot.</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all">
            <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
               <span className="text-xs text-gray-900 font-bold uppercase tracking-wider">Command: LOGISTICS STRATEGY</span>
               <span className="text-sm text-gray-600 font-medium">Reduce water-intensive input supply in {district} by {data.kccReduction}% to prevent waste.</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 opacity-60">
            <Circle size={20} className="text-gray-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
               <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">PENDING: FEDERATED STORAGE SYNC</span>
               <span className="text-sm text-gray-500 font-medium">Awaiting regional warehouse satellite telemetry link.</span>
            </div>
          </div>
        </div>
        
        <div className="mb-0 mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Box size={16} className="text-gray-400" />
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Logistics Grid: SECURE</span>
           </div>
           <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Last Update: 228ms Sync</span>
        </div>
      </div>
    </div>
  );
}
