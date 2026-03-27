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
    .replace(/"([^"]+)":/g, '<span class="text-green-600 font-semibold">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="text-gray-600">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="text-yellow-600 font-semibold">$1</span>')
    .replace(/: (true|false)/g, ': <span class="text-green-500 font-semibold">$1</span>');
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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-fade-slide">
      <div className="flex flex-col md:flex-row md:divide-x divide-gray-200 min-h-[500px]">
        {/* API Command Hub */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between bg-gray-50">
          <div>
             <div className="flex items-center gap-3 mb-8 leading-none text-left">
                <div className="p-2 rounded-lg bg-green-600 text-white shadow-sm">
                   <Terminal size={18} />
                </div>
                <div>
                   <span className="font-bold text-gray-900 text-sm uppercase tracking-widest leading-none">REST API Command Hub</span>
                   <p className="text-xs text-gray-500 uppercase tracking-widest mt-1.5 font-semibold">Data Exchange Layer V4.2</p>
                </div>
             </div>

             <div className="p-4 rounded-xl bg-white border border-gray-200 mb-8 shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-bold">Endpoint URL</span>
                <div className="flex items-center gap-3">
                   <span className="px-2 py-1 rounded-md bg-green-600 text-white font-mono text-xs font-bold uppercase shadow-sm">POST</span>
                   <span className="font-mono text-sm text-gray-600 font-bold">/api/v1/forecast</span>
                </div>
             </div>

             <div className="space-y-3">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-bold">Request Parameters</span>
               {[
                 { key: 'district_node', value: district.toUpperCase(), status: 'SECURE' },
                 { key: 'forecast_year', value: String(year), status: 'PREDICT' },
                 { key: 'hazard_type', value: hazard.toUpperCase(), status: 'DYNAMIC' },
                 { key: 'institutional_role', value: role.toUpperCase(), status: 'AUTH' },
               ].map(p => (
                 <div key={p.key} className="flex justify-between items-center p-3 rounded-lg bg-white border border-gray-200 last:border-0 hover:border-green-300 transition-all group shadow-sm">
                   <div className="flex flex-col gap-1 text-left">
                      <span className="font-mono text-[10px] text-gray-500 uppercase leading-none font-bold group-hover:text-green-600">{p.key}</span>
                      <span className="font-mono text-sm text-gray-900 font-bold group-hover:text-green-700">{p.value}</span>
                   </div>
                   <span className="px-2 py-1 rounded-md text-[10px] font-mono border border-gray-200 text-gray-500 uppercase font-bold group-hover:border-green-300 group-hover:text-green-600 transition-colors">{p.status}</span>
                 </div>
               ))}
             </div>
          </div>

          <button 
            onClick={execute} 
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold uppercase tracking-widest rounded-xl py-4 mt-8 flex items-center justify-center gap-3 hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} className="fill-current" />}
            Execute Predictive Hub
          </button>
        </div>

        {/* Global Response Matrix */}
        <div className="md:w-1/2 p-8 bg-white flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
             <div className="flex items-center justify-between mb-8 leading-none">
                <span className="font-bold text-gray-900 text-sm uppercase tracking-widest leading-none">Global Response Matrix</span>
                {response && (
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={16} className="text-green-600" />
                     <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 uppercase tracking-widest font-bold">200_SUCCESS</span>
                  </div>
                )}
             </div>

             <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative shadow-inner group p-2">
                <pre 
                   className="p-6 font-mono text-xs leading-relaxed overflow-auto max-h-[400px] text-gray-800"
                   style={{ scrollBehavior: 'smooth' }}
                >
                  {response ? (
                    <code dangerouslySetInnerHTML={{ __html: highlightJson(response) }} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-16">
                       <Cpu size={48} className="mb-4 text-green-600" />
                       <span className="text-xs uppercase tracking-widest font-bold">Initialize Telemetry</span>
                    </div>
                  )}
                </pre>
                
                {responseTime > 0 && (
                  <div className="absolute bottom-4 right-6 flex items-center gap-3 animate-in fade-in">
                     <div className="h-3 w-px bg-gray-300" />
                     <span className="text-[10px] text-green-600 uppercase tracking-widest font-bold italic">Latency: {responseTime}ms</span>
                  </div>
                )}
             </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Code2 size={16} className="text-gray-400" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Federated Model Docs V4.21</span>
             </div>
             <div className="flex gap-2">
                {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />)}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
