import { Link } from 'react-router-dom';

interface HeaderProps {
  isLive?: boolean;
}

export default function Header({ isLive = true }: HeaderProps) {
  const chips = ['DiCRA', 'IMD', 'NASA POWER', 'Sentinel-2'];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 flex items-center px-6 shadow-sm">
      <div className="flex items-center gap-2 flex-1">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block group-hover:scale-125 transition-transform" />
          <span className="font-bold text-gray-900 text-base tracking-widest uppercase">KisanSuraksha</span>
          <span className="text-gray-300 mx-2 font-black italic">/</span>
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Climate Risk Intelligence</span>
        </Link>
      </div>

      <div className="flex-1 flex justify-center items-center gap-2 opacity-80">
        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse inline-block" />
        <span className="text-[10px] uppercase tracking-widest text-green-600 font-bold">ACTIVE FORECAST · 2025–2040</span>
      </div>

      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full inline-block ${isLive ? 'bg-green-600' : 'bg-yellow-500'}`} />
           <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{isLive ? 'Model online' : 'Demo mode'}</span>
        </div>
        <div className="flex gap-2 ml-2 hidden lg:flex">
          {chips.map(c => (
            <span key={c} className="border border-gray-200 bg-gray-50 rounded-full px-3 py-1 text-[9px] uppercase tracking-widest font-bold text-gray-500 shadow-sm whitespace-nowrap">{c}</span>
          ))}
          <div className="w-px h-6 bg-gray-200 mx-2 self-center" />
          <Link to="/" className="border border-gray-200 bg-white hover:border-green-300 hover:text-green-600 transition-colors rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold text-gray-600 shadow-sm flex items-center whitespace-nowrap">
            Switch Role
          </Link>
        </div>
      </div>
    </header>
  );
}
