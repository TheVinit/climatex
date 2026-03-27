import { ExternalLink, Shield, Cpu, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-container bg-white border-t border-bdr px-14 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-14 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand rounded-full opacity-[0.05] blur-[140px] pointer-events-none" />
      
      <div className="flex flex-col gap-6 max-w-sm text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand rounded-[18px] flex items-center justify-center text-white shadow-xl">
            <Leaf size={28} strokeWidth={2.5} />
          </div>
          <span className="font-outfit font-black text-3xl text-t-primary uppercase tracking-tighter">KisanSuraksha<span className="text-brand">.V4</span></span>
        </div>
        <p className="font-mono text-xs text-t-dim uppercase tracking-[0.2em] leading-relaxed italic font-bold">
          Federated Climate Intelligence Stack Developed for the <span className="text-t-secondary font-black">NABARD National Climate Stack Innovation Challenge 2026</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-16">
        <div className="flex flex-col gap-8">
           <span className="font-mono text-[11px] text-brand tracking-[0.4em] uppercase font-black text-left">Internal Documentation</span>
           <div className="flex flex-col gap-4 items-start">
              {[
                { label: 'DiCRA OS', url: 'https://dicra.nabard.org' },
                { label: 'NABARD Hub', url: 'https://nabard.org' },
                { label: 'Secure Documentation', url: '#' },
              ].map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-t-secondary hover:text-brand transition-all flex items-center gap-3 group uppercase tracking-widest px-5 py-2.5 bg-bg-panel border border-bdr rounded-2xl hover:bg-white hover:shadow-xl hover:translate-y-[-2px]">
                  {l.label} <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ))}
           </div>
        </div>
        
        <div className="flex flex-col gap-8">
           <span className="font-mono text-[11px] text-brand tracking-[0.4em] uppercase font-black text-left">Sync Status</span>
           <div className="bg-bg-panel border border-bdr p-6 rounded-[2rem] flex flex-col gap-4 shadow-inner">
              <div className="flex items-center gap-4">
                 <div className="w-2.5 h-2.5 bg-brand rounded-full animate-pulse shadow-[0_0_12px_rgba(76,166,28,0.5)]" />
                 <span className="font-mono text-xs text-t-primary uppercase tracking-widest font-black">Global_Grid_Online</span>
              </div>
              <div className="flex items-center gap-4 opacity-70">
                 <div className="p-1.5 rounded-lg bg-brand/10 text-brand">
                   <Cpu size={14} />
                 </div>
                 <span className="font-mono text-[10px] text-t-dim uppercase tracking-widest font-bold">Protocol: 4.2.1 Alpha SECURE</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:items-end gap-3 text-left md:text-right w-full md:w-auto mt-10 md:mt-0">
         <span className="font-mono text-xs text-t-primary font-black uppercase tracking-widest">System Architecture: RSCOE·Lab·PUNE</span>
         <span className="font-mono text-[10px] text-t-dim uppercase tracking-[0.25em] italic opacity-60 font-bold">Authorized Personnel Only · 18.6200° N, 73.7483° E</span>
         <div className="h-1 w-16 bg-brand mt-4 hidden md:block rounded-full" />
      </div>
    </footer>
  );
}
