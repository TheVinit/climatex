import { useState } from 'react';
import { Role, Hazard } from '@/lib/types';
import { useRiskData } from '@/hooks/useRiskData';
import Header from '@/components/layout/Header';
import ControlBar from '@/components/layout/ControlBar';
import RoleSwitcher from '@/components/layout/RoleSwitcher';
import MaharashtraMap from '@/components/MaharashtraMap';
import RiskScoreStrip from '@/components/sections/RiskScoreStrip';
import FarmerView from '@/components/sections/RoleViews/FarmerView';
import NabardView from '@/components/sections/RoleViews/NabardView';
import InsurerView from '@/components/sections/RoleViews/InsurerView';
import SupplierView from '@/components/sections/RoleViews/SupplierView';
import SharedDataPanels from '@/components/sections/SharedDataPanels';
import EcosystemPanel from '@/components/sections/EcosystemPanel';
import ApiPlayground from '@/components/sections/ApiPlayground';
import Footer from '@/components/sections/Footer';
import { Activity, LayoutDashboard, Database, Globe } from 'lucide-react';

export default function Dashboard() {
  const [district, setDistrict] = useState('Solapur');
  const [year, setYear] = useState(2030);
  const [hazard, setHazard] = useState<Hazard>('drought');
  const [role, setRole] = useState<Role>('farmer');

  const { data, isLive, isLoading } = useRiskData(district);

  return (
    <div className="bg-bg-base min-h-screen font-sans text-t-primary selection:bg-brand selection:text-bg-base">
      <Header isLive={isLive} />

      {/* Main Layout Container */}
      <div className="pt-20 pb-10">
        <div className="max-w-[1600px] mx-auto px-6">
          
          {/* Top Control Section */}
          <div className="flex flex-col gap-6 mb-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1 items-start">
                   <div className="flex items-center gap-2">
                      <LayoutDashboard size={14} className="text-brand" />
                      <span className="font-mono text-[10px] text-brand tracking-[0.4em] uppercase font-black">Strategic Response Dashboard</span>
                   </div>
                   <h1 className="font-display italic text-4xl md:text-5xl text-t-primary leading-tight mt-1 uppercase tracking-tighter">
                      Global Climate Surveillance / <span className="text-brand">{district}</span>
                   </h1>
                   <p className="font-mono text-[9px] text-t-dim uppercase tracking-widest mt-1 opacity-60">
                      Latitude: 18.6200° N • Longitude: 73.7483° E • Node_V4_SECURE
                   </p>
                </div>
                
                <RoleSwitcher activeRole={role} onRoleChange={setRole} />
             </div>

             <div className="h-px w-full bg-gradient-to-r from-brand/50 via-bdr to-transparent" />

             <ControlBar
                district={district}
                year={year}
                hazard={hazard}
                role={role}
                onDistrictChange={setDistrict}
                onYearChange={setYear}
                onHazardChange={setHazard}
                onRoleChange={setRole}
             />
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Left Column: Visual GIS Intelligence */}
            <div className="xl:col-span-4 space-y-6">
               <div className="bg-bg-surface border border-bdr rounded-[24px] overflow-hidden shadow-2xl relative group h-[600px]">
                  <div className="absolute top-6 left-6 z-10 p-3 bg-bg-base/80 border border-bdr rounded-xl backdrop-blur-md">
                     <div className="flex items-center gap-2">
                        <Globe size={14} className="text-brand animate-spin-slow" />
                        <span className="font-mono text-[10px] text-brand font-bold uppercase tracking-widest">Live GIS Feed</span>
                     </div>
                  </div>
                  <MaharashtraMap district={district} onSelect={setDistrict} hazard={hazard} />
               </div>
               
               <div className="bg-bg-surface border border-bdr rounded-[24px] p-6 shadow-2xl glass-glow">
                  <div className="flex items-center gap-3 mb-4">
                     <Activity size={16} className="text-brand" />
                     <span className="font-mono text-[10px] text-t-dim uppercase tracking-[0.3em]">System Entropy Monitor</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col gap-1">
                        <span className="text-[20px] font-display italic text-t-primary">ALPHA_NODE_OK</span>
                        <span className="text-[10px] font-mono text-t-dim uppercase tracking-widest leading-none italic">Status: Fully Operational</span>
                     </div>
                     <div className="flex gap-1.5 h-6 items-end">
                        {[40, 70, 50, 90, 60, 80, 50, 70, 40].map((h, i) => (
                           <div key={i} className="w-1 bg-brand/40 group-hover:bg-brand transition-all rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Strategic HUD */}
            <div className="xl:col-span-8 space-y-6">
               {/* Primary Risk HUD */}
               <RiskScoreStrip data={data} hazard={hazard} district={district} onHazardChange={setHazard} />

               {/* Role-Specific Command Module */}
               <div className="min-h-[460px] relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-base/40 backdrop-blur-sm z-30 rounded-3xl">
                       <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
                       <span className="font-mono text-xs text-brand uppercase tracking-[0.4em] animate-pulse">Synchronizing Federated Data...</span>
                    </div>
                  ) : (
                    <div key={role} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                      {role === 'farmer' && <FarmerView data={data} year={year} />}
                      {role === 'nabard' && <NabardView data={data} district={district} year={year} />}
                      {role === 'insurer' && <InsurerView data={data} />}
                      {role === 'supplier' && <SupplierView data={data} district={district} />}
                    </div>
                  )}
               </div>

               {/* Shared Intelligence Overlays */}
               <SharedDataPanels data={data} district={district} hazard={hazard} year={year} isLive={isLive} />
            </div>
          </div>

          {/* Deep Systems Layout */}
          <div className="mt-12 space-y-12">
             <div className="flex items-center gap-6">
                <div className="h-px flex-1 bg-bdr" />
                <div className="flex items-center gap-3">
                   <Database size={16} className="text-t-dim" />
                   <span className="font-mono text-[11px] text-t-dim uppercase tracking-[0.4em] font-medium">Coordinate Layer Integration</span>
                </div>
                <div className="h-px flex-1 bg-bdr" />
             </div>
             
             <EcosystemPanel data={data} district={district} />
             
             <div className="space-y-6">
               <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-2">
                  <div className="px-3 py-1 rounded bg-brand/10 border border-brand/20">
                     <span className="font-mono text-[9px] text-brand font-black uppercase tracking-[0.3em] leading-none">Developer Playground</span>
                  </div>
                  <h2 className="font-display italic text-3xl text-t-primary uppercase tracking-tight">Access the Prediction Matrix</h2>
                  <p className="text-xs text-t-secondary font-medium tracking-wide leading-relaxed">Cross-platform REST synchronization for institutional partners including NABARD DiCRA, MoA, and Agricultural Universities.</p>
               </div>
               <ApiPlayground data={data} district={district} year={year} hazard={hazard} role={role} />
             </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Global Aesthetics */}
      <style>{`
        @keyframes fade-slide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide {
          animation: fade-slide 0.7s ease-out forwards;
        }
        .glass-glow {
          position: relative;
        }
        .glass-glow::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(126,211,72,0.1), transparent 50%, rgba(126,211,72,0.05));
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(126,211,72,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(126,211,72,0.4);
        }
      `}</style>
    </div>
  );
}
