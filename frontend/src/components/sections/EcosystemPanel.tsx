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
  { x: 200, y: 35 },
  { x: 365, y: 160 },
  { x: 200, y: 285 },
  { x: 35, y: 160 },
];

export default function EcosystemPanel({ data, district }: EcosystemPanelProps) {
  const riskColor = getRiskColor(data.droughtLevel);

  const nodes = [
    { role: 'Farmer', icon: Sprout, color: '#4da11c', status: data.droughtLevel === 'HIGH' ? `Plan: ${data.primaryCrop}` : 'Monitor Planting' },
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
    <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl relative overflow-hidden animate-fade-slide text-left">
      <div className="flex items-center gap-4 mb-12 leading-none">
          <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
             <Activity size={20} />
          </div>
          <div className="text-left">
             <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">Institutional Coordination Layer</span>
             <p className="text-[11px] font-mono text-t-dim uppercase tracking-[0.25em] mt-2 italic font-black">Real-time synchronized risk distribution matrix</p>
          </div>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-16 items-center">
        {/* Parametric Flow Visualizer */}
        <div className="relative h-[380px] mx-auto w-full max-w-[480px] flex items-center justify-center">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 0)', backgroundSize: '48px 48px' }} />

           <div className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center text-center z-20 p-6 animate-in zoom-in duration-1000 shadow-2xl bg-white border-2 hover:scale-105 transition-transform"
             style={{ borderColor: riskColor }}>
             <span className="font-mono text-[10px] text-brand tracking-[0.4em] uppercase mb-1 font-black leading-none">DATA CORE</span>
             <span className="font-display italic text-2xl text-t-primary leading-none uppercase font-black tracking-tighter mt-1">{district}</span>
             <div className="h-0.5 w-10 bg-brand/30 my-3 rounded-full" />
             <span className="font-mono text-[10px] font-black uppercase tracking-widest" style={{ color: riskColor }}>RISK: {data.drought}%</span>
           </div>

           <div className="absolute w-44 h-44 border-2 border-brand/10 rounded-full animate-spin-slow" />
           <div className="absolute w-56 h-56 border-2 border-dashed border-brand/5 rounded-full animate-spin-reverse-slow" />

           <svg className="absolute inset-0 pointer-events-none overflow-visible" viewBox="0 0 400 320">
             {nodeEndpoints.map((ep, i) => (
               <g key={i}>
                 <line x1="200" y1="160" x2={ep.x} y2={ep.y}
                   stroke={riskColor} strokeWidth="2" strokeDasharray="10 6" opacity="0.25"
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
               <div key={node.role} className="absolute bg-white border-2 border-bdr rounded-[20px] p-4 text-center z-10 w-[150px] shadow-xl transition-all hover:border-brand-border hover:translate-y-[-2px] group cursor-default"
                 style={{ ...nodePositions[i] } as React.CSSProperties}>
                 <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(76,166,28,0.5)]" style={{ backgroundColor: riskColor }} />
                 <Icon size={20} style={{ color: node.color }} className="mx-auto mb-2 transition-transform group-hover:scale-110" />
                 <div className="font-display italic text-base text-t-primary leading-none font-black uppercase tracking-tighter">{node.role}</div>
                 <div className="text-[9px] font-mono mt-2 leading-tight uppercase tracking-[0.2em] text-t-dim transition-colors group-hover:text-t-primary font-black italic">{node.status}</div>
               </div>
             );
           })}
        </div>

        {/* Impact Matrix */}
        <div className="flex flex-col gap-8">
           <div className="grid grid-cols-2 gap-6">
              {beforeAfter.map(item => (
                <div key={item.role} className="p-6 rounded-[2rem] bg-bg-panel/40 border-2 border-bdr hover:border-brand-border hover:bg-white transition-all flex flex-col gap-5 shadow-sm group">
                   <div className="flex items-center gap-4 text-left">
                      <div className="p-2.5 rounded-xl bg-white border border-bdr shadow-sm group-hover:text-brand transition-colors">
                         <item.icon size={16} className="text-t-secondary" />
                      </div>
                      <span className="font-outfit font-black text-t-primary text-xs uppercase tracking-[0.2em] leading-none group-hover:text-brand transition-colors">{item.role} Grid</span>
                   </div>
                   
                   <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-risk-h/40" />
                         <span className="text-[10px] text-t-dim line-through italic uppercase tracking-[0.2em] font-bold">{item.before}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <ArrowRight size={12} className="text-brand shrink-0" />
                         <span className="text-[11px] text-t-primary font-black uppercase tracking-[0.2em] leading-tight">{item.after}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="p-6 rounded-[2rem] bg-brand/5 border-2 border-brand/20 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-4 text-left">
                 <Shield size={20} className="text-brand" />
                 <p className="text-[11px] font-mono text-t-secondary uppercase tracking-[0.25em] leading-none font-black italic">Sync Status: SECURE SYSTEMIC OVERHAUL V4</p>
              </div>
              <div className="flex gap-1.5 pr-2">
                 {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
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
