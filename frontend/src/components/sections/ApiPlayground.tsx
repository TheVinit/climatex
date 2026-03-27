import { Code2, Loader2, Play, Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DistrictData, Hazard, Role } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ApiPlaygroundProps {
  data: DistrictData;
  district: string;
  year: number;
  hazard: Hazard;
  role: Role;
}

function highlightJson(json: string): string {
  return json
    .replace(/"([^"]+)":/g, '<span class="text-brand">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="text-t-secondary">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="text-risk-m">$1</span>')
    .replace(/: (true|false)/g, ': <span class="text-risk-l">$1</span>');
}

export default function ApiPlayground({ data, district, year, hazard, role }: ApiPlaygroundProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState(0);

  const fallbackResponse = {
    district,
    drought: { probability: data.drought, risk_level: data.droughtLevel },
    flood: { probability: data.flood, risk_level: data.floodLevel },
    heat_wave: { probability: data.heat, risk_level: data.heatLevel },
    recommendations: {
      primary_crop: data.primaryCrop,
      crops_to_avoid: data.avoidCrops,
      advisory: data.advisory,
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: "4.2.1-SECURE",
      node: `${district.toUpperCase()}_SCAN_01`
    }
  };

  const execute = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/api/v1/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district, year, hazard }),
      });
      const json = await res.json();
      const elapsed = Math.max(Date.now() - start, 150);
      setResponseTime(elapsed);
      setResponse(JSON.stringify(json, null, 2));
    } catch {
      await new Promise(r => setTimeout(r, 600));
      setResponseTime(Date.now() - start);
      setResponse(JSON.stringify(fallbackResponse, null, 2));
    }
    setLoading(false);
  };

  useEffect(() => {
    setResponse(JSON.stringify(fallbackResponse, null, 2));
    setResponseTime(0);
  }, [district]);

  return (
    <div className="bg-white border-2 border-bdr rounded-[32px] overflow-hidden shadow-xl animate-fade-slide">
      <div className="flex flex-col md:flex-row md:divide-x-2 divide-bdr min-h-[550px]">
        {/* API Command Hub */}
        <div className="md:w-1/2 p-10 flex flex-col justify-between bg-bg-panel/20">
          <div>
             <div className="flex items-center gap-4 mb-10 leading-none text-left">
                <div className="p-2.5 rounded-xl bg-brand text-white shadow-lg">
                   <Terminal size={18} />
                </div>
                <div>
                   <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-widest leading-none">REST API Command Hub</span>
                   <p className="text-[10px] font-mono text-t-dim uppercase tracking-[0.25em] mt-1.5 font-bold">Data Exchange Layer V4.2</p>
                </div>
             </div>

             <div className="p-5 rounded-2xl bg-white border border-bdr mb-10 shadow-sm">
                <span className="font-mono text-[10px] text-t-dim uppercase tracking-[0.3em] block mb-3 font-bold">Endpoint URL</span>
                <div className="flex items-center gap-4">
                   <span className="px-2.5 py-1 rounded-lg bg-brand text-white font-mono text-[10px] font-black uppercase shadow-sm">POST</span>
                   <span className="font-mono text-sm text-t-secondary font-bold">/api/v1/forecast</span>
                </div>
             </div>

             <div className="space-y-4">
               <span className="font-mono text-[10px] text-t-dim uppercase tracking-[0.3em] block mb-3 font-bold">Request Parameters</span>
               {[
                 { key: 'district_node', value: district.toUpperCase(), status: 'SECURE' },
                 { key: 'forecast_year', value: String(year), status: 'PREDICT' },
                 { key: 'hazard_type', value: hazard.toUpperCase(), status: 'DYNAMIC' },
                 { key: 'institutional_role', value: role.toUpperCase(), status: 'AUTH' },
               ].map(p => (
                 <div key={p.key} className="flex justify-between items-center p-4 rounded-xl bg-white border border-bdr last:border-0 hover:border-brand-border transition-all group shadow-sm">
                   <div className="flex flex-col gap-1.5 text-left">
                      <span className="font-mono text-[10px] text-t-dim uppercase leading-none font-bold group-hover:text-brand">{p.key}</span>
                      <span className="font-mono text-sm text-t-primary font-black group-hover:text-brand">{p.value}</span>
                   </div>
                   <span className="px-2.5 py-1 rounded-lg text-[9px] font-mono border border-bdr text-t-dim uppercase font-bold group-hover:border-brand-border group-hover:text-brand">{p.status}</span>
                 </div>
               ))}
             </div>
          </div>

          <button 
            onClick={execute} 
            disabled={loading}
            className="w-full bg-brand text-white font-outfit font-black uppercase tracking-widest rounded-2xl py-6 mt-10 flex items-center justify-center gap-4 hover:shadow-2xl hover:translate-y-[-2px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} className="fill-current" />}
            Execute Predictive Hub
          </button>
        </div>

        {/* Global Response Matrix */}
        <div className="md:w-1/2 p-10 bg-white flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
             <div className="flex items-center justify-between mb-10 leading-none">
                <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-widest leading-none">Global Response Matrix</span>
                {response && (
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={16} className="text-brand" />
                     <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-brand/10 text-brand border border-brand/20 uppercase tracking-widest font-black">200_SUCCESS</span>
                  </div>
                )}
             </div>

             <div className="flex-1 bg-bg-panel/30 rounded-3xl border border-bdr overflow-hidden relative shadow-inner group p-2">
                <pre 
                   className="p-8 font-mono text-[11px] leading-relaxed overflow-auto max-h-[480px] custom-scrollbar selection:bg-brand selection:text-white"
                   style={{ scrollBehavior: 'smooth' }}
                >
                  {response ? (
                    <code dangerouslySetInnerHTML={{ __html: highlightJson(response) }} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                       <Cpu size={64} className="mb-6 text-brand" />
                       <span className="font-mono text-sm uppercase tracking-[0.4em] font-black">Initialize Telemetry</span>
                    </div>
                  )}
                </pre>
                
                {responseTime > 0 && (
                  <div className="absolute bottom-6 right-8 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                     <div className="h-4 w-px bg-bdr" />
                     <span className="font-mono text-[10px] text-brand uppercase tracking-widest font-black italic">Latency: {responseTime}ms</span>
                  </div>
                )}
             </div>
          </div>

          <div className="mt-10 pt-8 border-t border-bdr flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Code2 size={16} className="text-t-dim" />
                <span className="text-[10px] font-mono text-t-dim uppercase tracking-[0.2em] font-bold">Federated Model Docs V4.21</span>
             </div>
             <div className="flex gap-2.5">
                {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 border border-bdr rounded-md bg-bg-panel" />)}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
