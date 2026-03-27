import { Leaf, Activity, ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isLive?: boolean;
}

export default function Header({ isLive = true }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-b-2 border-bdr z-50 px-10 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-[14px] bg-brand text-white flex items-center justify-center transition-transform group-hover:rotate-3 shadow-lg">
            <Leaf size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-outfit font-black text-t-primary text-base uppercase tracking-widest leading-none">KISAN<span className="text-brand">SURAKSHA</span></span>
            <span className="text-t-dim text-[9px] font-mono uppercase tracking-[0.3em] leading-none mt-1.5 font-bold italic">Agriguard Connect</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3 px-5 py-2.5 bg-bg-panel border border-bdr2 rounded-2xl shadow-inner">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-brand shadow-[0_0_8px_rgba(76,166,28,0.5)]' : 'bg-t-dim'} animate-pulse`} />
          <span className={`text-[11px] font-mono uppercase tracking-widest font-black ${isLive ? 'text-brand' : 'text-t-dim'}`}>
            {isLive ? 'System Linked' : 'Archive Mode'}
          </span>
        </div>

        <div className="h-8 w-px bg-bdr" />

        <div className="flex items-center gap-6 text-t-secondary">
           <div className="p-2 rounded-xl hover:bg-bg-panel hover:text-brand cursor-pointer transition-all">
             <Activity size={20} />
           </div>
           <div className="p-2 rounded-xl hover:bg-bg-panel hover:text-brand cursor-pointer transition-all">
             <ShieldCheck size={20} />
           </div>
           <div className="w-10 h-10 rounded-2xl bg-bg-panel border border-bdr flex items-center justify-center overflow-hidden hover:border-brand-border transition-all cursor-pointer shadow-sm ml-2">
             <User size={20} />
           </div>
        </div>
      </div>
    </header>
  );
}
