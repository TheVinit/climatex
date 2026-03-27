import { Sprout, Building2, Shield, Leaf } from 'lucide-react';
import { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RoleSwitcherProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

const roles: { key: Role; icon: typeof Sprout; label: string; desc: string }[] = [
  { key: 'farmer', icon: Sprout, label: 'Farmer', desc: 'Crop Selection & Risk' },
  { key: 'nabard', icon: Building2, label: 'NABARD', desc: 'Credit & KCC Policy' },
  { key: 'insurer', icon: Shield, label: 'Insurer', desc: 'Parametric Underwriting' },
  { key: 'supplier', icon: Leaf, label: 'Supplier', desc: 'Input Supply Chain' },
];

export default function RoleSwitcher({ activeRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex bg-bg-panel border border-bdr p-2 rounded-2x; gap-1 shadow-inner rounded-3xl">
      {roles.map((r) => {
        const isActive = activeRole === r.key;
        const Icon = r.icon;
        
        return (
          <button
            key={r.key}
            onClick={() => onRoleChange(r.key)}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-500 group relative overflow-hidden",
              isActive 
                ? "bg-brand text-white shadow-xl translate-y-[-2px]" 
                : "text-t-secondary hover:bg-white hover:text-brand"
            )}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            )}
            
            <Icon size={18} className={cn("shrink-0 transition-transform duration-500", isActive ? "scale-110" : "group-hover:scale-110")} />
            
            <div className="flex flex-col items-start leading-none gap-1.5">
               <span className={cn("text-xs font-outfit uppercase font-black tracking-widest", isActive ? "text-white" : "text-t-primary")}>
                  {r.label}
               </span>
               <span className={cn("text-[9px] font-mono uppercase tracking-widest whitespace-nowrap opacity-70", isActive ? "text-white" : "text-t-dim")}>
                  {r.desc}
               </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
