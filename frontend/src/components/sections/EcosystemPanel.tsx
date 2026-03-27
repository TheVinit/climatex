import { Sprout, Building2, Shield, Leaf, Activity, ArrowRight } from 'lucide-react';
import { DistrictData } from '@/lib/types';
import { getRiskColor } from '@/lib/data';
import { cn } from '@/lib/utils';

interface EcosystemPanelProps {
  data: DistrictData;
  district: string;
}

const nodePositions = [
  { top: '0', left: '50%', transform: 'translate(-50%, 0)' },
  { top: '50%', right: '0', transform: 'translate(0, -50%)' },
  { bottom: '0', left: '50%', transform: 'translate(-50%, 0)' },
  { top: '50%', left: '0', transform: 'translate(0, -50%)' },
];

const nodeEndpoints = [
  { x: 200, y: 40 },
  { x: 360, y: 160 },
  { x: 200, y: 280 },
  { x: 40, y: 160 },
];

export default function EcosystemPanel({ data, district }: EcosystemPanelProps) {
  const riskColor = data.droughtLevel === 'HIGH' ? '#ef4444' : data.droughtLevel === 'MEDIUM' ? '#f59e0b' : '#10b981';

  const nodes = [
    { role: 'Farmer', icon: Sprout, color: '#16a34a', status: data.droughtLevel === 'HIGH' ? `Plan: ${data.primaryCrop}` : 'Monitor Planting' },
    { role: 'NABARD', icon: Building2, color: '#3b82f6', status: `KCC FLAG: ${data.kccRisk}` },
    { role: 'Insurer', icon: Shield, color: '#f59e0b', status: data.insuranceTrigger === 'ARMED' ? 'Trigger Armed' : 'System Calm' },
    { role: 'Supplier', icon: Leaf, color: '#8b5cf6', status: `Pre-Stocking ${data.primaryCrop.split('/')[0].trim()}` },
  ];

  const beforeAfter = [
    { role: 'Farmer', icon: Sprout, before: 'Zero warning signals', after: '6-Month Early Alert' },
    { role: 'NABARD', icon: Building2, before: 'Static KCC lending', after: 'Dynamic Credit Flow' },
    { role: 'Insurer', icon: Shield, before: '12-Month Survey Lag', after: '72hr Auto-Payout' },
    { role: 'Supplier', icon: Leaf, before: 'Inventory Guesswork', after: 'Demand-Synchronized' },
  ];

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm relative overflow-hidden animate-fade-slide text-left">
      <div className="flex items-center gap-3 mb-10 leading-none">
          <div className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-100 shadow-sm">
             <Activity size={20} />
          </div>
          <div className="text-left">
             <span className="font-bold text-gray-900 text-sm uppercase tracking-widest leading-none">Institutional Coordination Layer</span>
             <p className="text-xs text-gray-500 uppercase tracking-widest mt-1.5 font-semibold">Real-time synchronized risk distribution matrix</p>
          </div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
        {/* Parametric Flow Visualizer */}
        <div className="relative h-[360px] mx-auto w-full max-w-[440px] flex items-center justify-center">
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #9ca3af 1px, transparent 0)', backgroundSize: '32px 32px' }} />

           <div className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center text-center z-20 p-4 shadow-lg bg-white border border-gray-100 transition-transform"
             style={{ borderColor: riskColor }}>
             <span className="text-[10px] text-green-600 tracking-widest uppercase mb-1 font-bold">DATA CORE</span>
             <span className="text-xl text-gray-900 font-bold uppercase tracking-wide mt-1">{district}</span>
             <div className="h-0.5 w-10 bg-gray-200 my-2 rounded-full" />
             <span className="text-xs font-bold uppercase tracking-widest" style={{ color: riskColor }}>RISK: {data.drought}%</span>
           </div>

           <div className="absolute w-40 h-40 border border-gray-200 rounded-full animate-spin-slow" />
           <div className="absolute w-52 h-52 border border-dashed border-gray-200 rounded-full animate-spin-reverse-slow" />

           <svg className="absolute inset-0 pointer-events-none overflow-visible" viewBox="0 0 400 320">
             {nodeEndpoints.map((ep, i) => (
               <g key={i}>
                 <line x1="200" y1="160" x2={ep.x} y2={ep.y}
                   stroke={riskColor} strokeWidth="2" strokeDasharray="6 4" opacity="0.3"
                   className="animate-pulse" />
                 <circle r="4" fill={riskColor} className="animate-ping" style={{ transformOrigin: 'center' }}>
                   <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
                     <mpath xlinkHref={`#path-${i}`} />
                   </animateMotion>
                 </circle>
                 <path id={`path-${i}`} d={`M200,160 L${ep.x},${ep.y}`} fill="none" stroke="none" />
               </g>
             ))}
           </svg>

           {nodes.map((node, i) => {
             const Icon = node.icon;
             return (
               <div key={node.role} className="absolute bg-white border border-gray-200 rounded-xl p-3 text-center z-10 w-[130px] shadow-sm transition-all hover:border-green-300 hover:shadow-md group cursor-default"
                 style={{ ...nodePositions[i] } as React.CSSProperties}>
                 <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: riskColor }} />
                 <Icon size={18} style={{ color: node.color }} className="mx-auto mb-2 transition-transform group-hover:scale-110" />
                 <div className="text-sm text-gray-900 font-bold uppercase tracking-wide">{node.role}</div>
                 <div className="text-[10px] mt-1 uppercase tracking-wider text-gray-500 font-semibold">{node.status}</div>
               </div>
             );
           })}
        </div>

        {/* Impact Matrix */}
        <div className="flex flex-col gap-6">
           <div className="grid grid-cols-2 gap-4">
              {beforeAfter.map(item => (
                <div key={item.role} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:bg-white transition-all flex flex-col gap-4 shadow-sm group">
                   <div className="flex items-center gap-3 text-left">
                      <div className="p-1.5 rounded-lg bg-white border border-gray-200 shadow-sm">
                         <item.icon size={14} className="text-gray-500" />
                      </div>
                      <span className="font-bold text-gray-900 text-xs uppercase tracking-wider leading-none">{item.role} Grid</span>
                   </div>
                   
                   <div className="space-y-2">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-60" />
                         <span className="text-[10px] text-gray-500 line-through uppercase tracking-widest font-semibold">{item.before}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <ArrowRight size={10} className="text-green-600 shrink-0" />
                         <span className="text-xs text-gray-900 font-bold uppercase tracking-wider leading-tight">{item.after}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center justify-between shadow-sm mt-2">
              <div className="flex items-center gap-3 text-left">
                 <Shield size={18} className="text-green-600" />
                 <p className="text-[10px] text-green-700 uppercase tracking-widest leading-none font-bold">Sync Status: SECURE SYSTEMIC OVERHAUL V4</p>
              </div>
              <div className="flex gap-1 pr-1">
                 {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
