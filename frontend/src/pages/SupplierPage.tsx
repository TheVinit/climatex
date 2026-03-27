import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hazard } from '@/lib/types';
import { useRiskData } from '@/hooks/useRiskData';
import { DISTRICT_NAMES, getRiskColor } from '@/lib/data';
import { supplierActions } from '@/lib/actions';
import MaharashtraMap from '@/components/MaharashtraMap';
import { 
  Package, MapPin, Home,
  Truck, Activity, Box, BarChart3, ShieldCheck, Droplets, Waves, Thermometer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const HAZARDS: { key: Hazard; label: string; icon: typeof Droplets }[] = [
  { key: 'drought', icon: Droplets, label: 'Demand Node' },
  { key: 'flood',   icon: Waves,    label: 'Logistics Risk' },
  { key: 'heat',    icon: Thermometer, label: 'Yield Impact' },
];

export default function SupplierPage() {
  const [district, setDistrict] = useState('Solapur');
  const [hazard, setHazard] = useState<Hazard>('drought');

  const { data, isLoading, isLive } = useRiskData(district);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFEFE] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-6 text-left"></div>
          <p className="text-slate-500 font-black outfit animate-pulse uppercase tracking-[0.2em] text-[10px]">Synchronizing Supply Chain Node...</p>
        </div>
      </div>
    );
  }

  const riskColor = getRiskColor(hazard === 'drought' ? data.droughtLevel : hazard === 'flood' ? data.floodLevel : data.heatLevel);

  const chartData = (hazard === 'drought' ? data.trend : hazard === 'flood' ? data.floodTrend : data.heatTrend)
    .map((val, i) => ({ day: i + 1, value: val }));

  const stockLevel = data.seedDemand > 5000 ? 40 : 85;

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-left">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 premium-shadow">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20 text-left">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest text-left">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <div className="h-6 w-px bg-slate-100" />
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                  <Package size={20} strokeWidth={2.5} />
                </div>
                <span className="font-black text-slate-900 outfit text-xl tracking-tight uppercase italic whitespace-nowrap overflow-hidden text-ellipsis">Kisan<span className="text-blue-600">Suraksha</span> Supply Chain</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 ring-1 ring-slate-200/50 text-left">
                <MapPin size={16} className="text-blue-500" />
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="bg-transparent font-bold text-sm text-slate-700 focus:outline-none cursor-pointer"
                >
                  {DISTRICT_NAMES.map(d => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <span className={cn("w-2 h-2 rounded-full", isLive ? "bg-blue-500 animate-pulse" : "bg-slate-300")} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">{isLive ? 'Logistics Live' : 'Archive Data'}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 text-left">
        {/* Dynamic Hero Section */}
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[3rem] p-12 text-slate-900 mb-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] text-left">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-left">
            <div className="text-left text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 text-left leading-none italic uppercase">
                <BarChart3 size={12} /> Predictive Logistics Engine Active
              </div>
              <h1 className="text-6xl font-black mb-6 outfit leading-[0.9] tracking-tighter text-left uppercase italic whitespace-nowrap overflow-hidden text-ellipsis">
                Optimization: <span className="text-blue-600">{district}</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed max-w-lg text-left">
                Balancing regional inventory flows by projecting seed demand from localized climate resilience indices.
              </p>
              
              <div className="flex flex-wrap gap-4 text-left text-left">
                <div className="bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 transition-transform hover:scale-105 duration-300">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">Regional Demand</p>
                  <p className="text-2xl font-black outfit text-blue-600">{(data.seedDemand / 1000).toFixed(1)}k kg</p>
                </div>
                <div className="bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 transition-transform hover:scale-105 duration-300">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">Inventory Gap</p>
                  <p className={cn("text-2xl font-black outfit", data.supplyGap > 500 ? "text-red-500" : "text-emerald-500")}>
                    {data.supplyGap}kg
                  </p>
                </div>
                <div className="bg-slate-50 rounded-2xl px-6 py-4 border border-slate-100 transition-transform hover:scale-105 duration-300">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">Stock Buffer</p>
                   <p className="text-2xl font-black outfit text-blue-600">12.5%</p>
                </div>
              </div>
            </div>
            
            <div className="relative flex justify-center text-left text-left">
              <div className="relative bg-slate-900 rounded-[2.5rem] border border-white/10 p-10 w-full max-w-md shadow-2xl text-white text-left">
                 <div className="flex items-center justify-between mb-8 text-left">
                   <h3 className="font-black outfit text-lg uppercase tracking-tight text-white text-left leading-none italic uppercase">Dispatch Readiness</h3>
                   <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Truck size={18} /></div>
                 </div>
                 <div className="space-y-6 text-left">
                    <div className="flex justify-between items-center text-left text-left">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest text-left leading-none">Route Precision</span>
                      <span className="text-lg font-black text-white text-right leading-none">98%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden text-left">
                       <div className="h-full bg-blue-500 w-[98%] rounded-full shadow-[0_0_10px_#3b82f6]" />
                    </div>
                    <div className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-left text-left">
                       <Box size={24} className="text-blue-400" />
                       <div className="text-left text-left">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-left leading-none">Current Stock Level</p>
                         <p className="text-xl font-black text-white leading-none text-left italic">{stockLevel}% CAP</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Demand Map Light */}
        <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] relative mb-12 text-left">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 text-left">
             <div className="text-left text-left">
                <h2 className="text-4xl font-black text-slate-900 outfit tracking-tighter mb-2 italic text-left leading-none uppercase">Regional Demand Monitor</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] text-left leading-none">Supply Chain Surveillance for 36 Maharashtra Segments</p>
             </div>
             <div className="flex flex-wrap gap-4 text-left">
                {HAZARDS.map(h => (
                  <button
                    key={h.key}
                    onClick={() => setHazard(h.key)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300 font-bold outfit text-[11px] uppercase tracking-widest",
                      hazard === h.key
                        ? "bg-slate-900 border-slate-900 text-white shadow-xl -translate-y-1"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    )}
                  >
                    <h.icon size={14} className={hazard === h.key ? "text-blue-400" : "text-slate-300"} />
                    {h.label}
                  </button>
                ))}
              </div>
           </div>
           
           <div className="relative min-h-[500px] text-left">
              <MaharashtraMap district={district} hazard={hazard} onSelect={setDistrict} />
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 text-left text-left">
          {/* Demand Trends */}
          <div className="lg:col-span-2 text-left text-left text-left text-left">
             <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] text-left">
               <h3 className="text-3xl font-black text-slate-900 outfit tracking-tight mb-8 text-left uppercase leading-none italic whitespace-nowrap overflow-hidden text-ellipsis">LOGISTICS DEMAND PROJECTION</h3>
               <div className="h-[300px] text-left">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                     <RechartsTooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', padding: '12px'}}
                     />
                     <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fill="#3b82f6" fillOpacity={0.05} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
             </div>
          </div>

          {/* Core Support Hub */}
          <div className="text-left space-y-8 text-left text-left">
             <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl text-left">
               <h3 className="font-black outfit text-xl mb-8 flex items-center gap-3 text-left leading-none uppercase">
                  <ShieldCheck size={24} className="text-blue-300" /> Logistics HUB
               </h3>
               <div className="space-y-4 text-left">
                 <button onClick={() => supplierActions.checkStock(district)} className="w-full py-4 bg-white text-blue-600 font-bold outfit rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 text-left leading-none uppercase">
                   Optimize Inventory <Box size={18} />
                 </button>
                 <button onClick={() => supplierActions.viewHistory(district, hazard)} className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold outfit rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-white/20 text-left leading-none uppercase">
                   Dispatch Matrix <Truck size={18} />
                 </button>
               </div>
             </div>

             <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 text-left text-left">
               <h3 className="font-black outfit text-lg text-slate-900 mb-6 flex items-center gap-3 text-left leading-none italic uppercase">
                 Supply Readiness
               </h3>
               <div className="p-6 rounded-3xl bg-white border border-slate-100 text-left">
                  <p className="text-xs font-bold text-slate-500 mb-4 text-left leading-none italic">Fleet Status: ACTIVE</p>
                  <div className="flex items-center gap-4 mb-2 text-left">
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden text-left">
                      <div className="h-full bg-blue-600 w-4/5 rounded-full" />
                    </div>
                    <span className="text-[10px] font-black text-slate-900 text-left leading-none">80%</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left leading-none">Transit Load: 4.2 Tons</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}