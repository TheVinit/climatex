import { ExternalLink, Shield, Cpu, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-8 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative overflow-hidden mt-10">
      
      <div className="flex flex-col gap-4 max-w-sm text-left relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Leaf size={24} />
          </div>
          <span className="font-bold text-2xl text-gray-900 tracking-wide">KisanSuraksha</span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed font-medium">
          Federated Climate Intelligence Stack Developed for the <span className="text-gray-700 font-bold">NABARD National Climate Stack Innovation Challenge 2026</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-12 relative z-10">
        <div className="flex flex-col gap-5">
           <span className="text-xs text-green-600 tracking-widest uppercase font-bold text-left">Internal Documentation</span>
           <div className="flex flex-col gap-3 items-start">
              {[
                { label: 'DiCRA OS', url: 'https://dicra.nabard.org' },
                { label: 'NABARD Hub', url: 'https://nabard.org' },
                { label: 'Secure Documentation', url: '#' },
              ].map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2 group">
                  {l.label} <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ))}
           </div>
        </div>
        
        <div className="flex flex-col gap-5">
           <span className="text-xs text-green-600 tracking-widest uppercase font-bold text-left">Sync Status</span>
           <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm" />
                 <span className="text-xs text-gray-900 uppercase tracking-wider font-bold">Global Grid Online</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="p-1 rounded bg-green-100 text-green-700">
                   <Cpu size={12} />
                 </div>
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Protocol: 4.2.1 Alpha SECURE</span>
              </div>
         </div>
        </div>
      </div>

      <div className="flex flex-col md:items-end gap-2 text-left md:text-right w-full md:w-auto mt-6 md:mt-0 relative z-10">
         <span className="text-xs text-gray-900 font-bold uppercase tracking-widest">System Architecture: RSCOE·Lab·PUNE</span>
         <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Authorized Personnel Only · 18.6200° N, 73.7483° E</span>
         <div className="h-0.5 w-12 bg-green-600 mt-3 hidden md:block rounded-full" />
      </div>
    </footer>
  );
}
