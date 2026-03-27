import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hazard } from '@/lib/types';
import { useRiskData } from '@/hooks/useRiskData';
import { DISTRICT_NAMES, getRiskColor, getRiskBg } from '@/lib/data';
import { farmerActions } from '@/lib/actions';
import MaharashtraMap from '@/components/MaharashtraMap';
import { 
  Leaf, MapPin, 
  Droplets, Waves, Thermometer, Home,
  Download, Phone, Globe, BarChart3,
  CloudSun, Sprout, ShieldCheck, HeartPulse, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const HAZARDS: { key: Hazard; label: string; icon: typeof Droplets }[] = [
  { key: 'drought', icon: Droplets, label: 'Drought' },
  { key: 'flood',   icon: Waves,    label: 'Flood' },
  { key: 'heat',    icon: Thermometer, label: 'Heat' },
];

export default function FarmerPage() {
  const [district, setDistrict] = useState('Solapur');
  const [hazard, setHazard] = useState<Hazard>('drought');

  const { data, isLoading, isLive } = useRiskData(district);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFEFE] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-500 font-black outfit animate-pulse uppercase tracking-[0.2em] text-[10px]">Accessing KISANSURAKSHA GEOSPATIAL NODE...</p>
        </div>
      </div>
    );
  }

  const riskColor = getRiskColor(hazard === 'drought' ? data.droughtLevel : hazard === 'flood' ? data.floodLevel : data.heatLevel);
  const riskBgClass = getRiskBg(hazard === 'drought' ? data.droughtLevel : hazard === 'flood' ? data.floodLevel : data.heatLevel);

  const chartData = (hazard === 'drought' ? data.trend : hazard === 'flood' ? data.floodTrend : data.heatTrend)
    .map((val, i) => ({ day: i + 1, value: val }));

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-left">
      {/* Premium Light Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 premium-shadow">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20 text-left">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest text-left">
                <Home size={18} />
                <span>Home</span>
              </Link>
              <div className="h-6 w-px bg-slate-100" />
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg transform hover:rotate-3 transition-transform">
                    <Leaf size={20} strokeWidth={2.5} />
                 </div>
                 <span className="font-black text-slate-900 outfit text-xl tracking-tighter uppercase whitespace-nowrap italic">Kisan<span className="text-blue-600">Suraksha</span></span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-6">
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
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">{isLive ? 'Satellite Live' : 'Archive Data'}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 text-left">
        {/* Elite Command Section */}
        <div className="relative overflow-hidden bg-white rounded-[3rem] p-12 text-slate-900 mb-12 border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] text-left">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-left">
            <div className="text-left text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 text-left">
                <CloudSun size={12} /> Agricultural Command Sector
              </div>
              <h1 className="text-6xl font-black mb-6 outfit leading-[0.9] tracking-tighter text-left uppercase italic whitespace-nowrap overflow-hidden text-ellipsis">
                Resilience: <span className="text-blue-600">{district}</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed max-w-lg text-left">
                Empowering farmers through site-specific geospatial advisories and satellite-driven moisture tracking.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                 {[
                   { label: 'Soil Health', val: `${data.soilMoisture}%`, icon: Sprout, col: 'emerald' },
                   { label: 'NDVI Index', val: data.ndvi, icon: BarChart3, col: 'blue' },
                   { label: 'Hazard Score', val: `${data.drought}%`, icon: Activity, col: 'orange' },
                   { label: 'Security', val: 'CERTIFIED', icon: ShieldCheck, col: 'emerald' }
                 ].map(stat => (
                   <div key={stat.label} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 hover:bg-slate-50 transition-colors text-left text-left">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 text-left text-left">
                        <stat.icon size={12} className={`text-${stat.col}-500`} /> {stat.label}
                     </p>
                     <p className="text-lg font-black outfit text-slate-900 leading-none text-left">{stat.val}</p>
                   </div>
                 ))}
              </div>
            </div>
            
            <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-8 text-left text-left">
               <div className="flex items-center justify-between mb-8 text-left">
                 <h3 className="font-black outfit text-lg uppercase tracking-tight text-slate-900 text-left italic">Agronomic Intelligence</h3>
                 <div className="bg-blue-600 p-2 rounded-xl text-white shadow-xl rotate-3"><HeartPulse size={18} /></div>
               </div>
               <div className="space-y-6 text-left">
                 <div className="flex items-center gap-6 text-left">
                   <div className="flex-1 text-left text-left">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-left">Strategic Advisory</p>
                     <p className="text-sm font-bold text-slate-700 text-left italic leading-relaxed">"{data.advisory}"</p>
                   </div>
                   <div className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase text-left whitespace-nowrap", riskBgClass)}>
                     {hazard.toUpperCase()} RISK
                   </div>
                 </div>
                 <div className="h-1 w-full bg-slate-200/50 rounded-full overflow-hidden text-left">
                    <div className="h-full bg-blue-600 w-3/4 rounded-full" />
                 </div>
                 <div className="flex justify-between items-center text-left text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left leading-none italic">Satellite Precision: 98.4%</p>
                    <button onClick={farmerActions.getAdvisory} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline text-right leading-none">Recalibrate Model</button>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Global Surveillance Map Light */}
        <div className="bg-white rounded-[4rem] border border-slate-100 p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] relative mb-12 text-left">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 text-left">
             <div className="text-left text-left">
                <h2 className="text-4xl font-black text-slate-900 outfit tracking-tighter mb-2 italic text-left leading-none uppercase">Geospatial Surveillance</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] text-left leading-none">Real-Time {hazard} Matrix – 36 Node Network</p>
             </div>
             <div className="flex flex-wrap gap-2 text-left text-left">
                {HAZARDS.map(h => (
                  <button
                    key={h.key}
                    onClick={() => setHazard(h.key)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-200 font-bold outfit text-[11px] uppercase tracking-widest",
                      hazard === h.key
                        ? "bg-slate-900 border-slate-900 text-white shadow-xl -translate-y-1"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                    )}
                  >
                    <h.icon size={14} strokeWidth={3} />
                    {h.label}
                  </button>
                ))}
              </div>
           </div>
           
           <div className="relative min-h-[450px] text-left">
              <MaharashtraMap district={district} hazard={hazard} onSelect={setDistrict} />
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 text-left text-left">
          {/* Trend Analysis */}
          <div className="lg:col-span-2 text-left">
             <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.03)] text-left">
               <div className="flex items-center justify-between mb-8 text-left">
                 <h3 className="text-3xl font-black text-slate-900 outfit tracking-tight text-left italic uppercase leading-none">Regional Tendency Trace</h3>
                 <div className="flex gap-2 text-left">
                    <div className="w-10 h-1 bg-slate-900 rounded-full" />
                    <div className="w-4 h-1 bg-slate-200 rounded-full" />
                 </div>
               </div>
               <div className="h-[300px] text-left">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                     <RechartsTooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', padding: '12px'}}
                     />
                     <Area type="monotone" dataKey="value" stroke={riskColor} strokeWidth={4} fill={riskColor} fillOpacity={0.05} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
             </div>
          </div>

          {/* Quick Support Hub */}
          <div className="text-left space-y-8 text-left">
             <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 text-left">
               <h3 className="font-black outfit text-xl mb-8 flex items-center gap-3 text-left leading-none uppercase">
                  <ShieldCheck size={24} className="text-blue-300" /> Security HUB
               </h3>
               <div className="space-y-4 text-left">
                 <button onClick={() => farmerActions.marketPrices(district)} className="w-full py-4 bg-white text-blue-600 font-bold outfit rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 hover:shadow-xl text-left">
                   Live Market Index <Globe size={16} />
                 </button>
                 <button onClick={() => farmerActions.downloadAdvisory(district, hazard)} className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold outfit rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-white/20 text-left">
                   Export Advisory <Download size={16} />
                 </button>
               </div>
             </div>

             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] text-left">
               <h3 className="font-black outfit text-lg text-slate-900 mb-6 flex items-center gap-3 text-left leading-none italic uppercase">
                  <Phone size={20} className="text-emerald-500" /> Emergency Link
               </h3>
               <div className="space-y-3 text-left">
                 {[
                   { name: 'KCC Support', time: '24/7' },
                   { name: 'District Helplines', time: '09:00 - 18:00' }
                 ].map(item => (
                   <button key={item.name} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-colors flex items-center justify-between text-left">
                     <span className="text-xs font-bold text-slate-700">{item.name}</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}