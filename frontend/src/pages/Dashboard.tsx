import { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Role, Hazard } from '@/lib/types';
import { useRiskData } from '@/hooks/useRiskData';
import Header from '@/components/layout/Header';
import ControlBar from '@/components/layout/ControlBar';
import RiskScoreStrip from '@/components/sections/RiskScoreStrip';
import FarmerView from '@/components/sections/RoleViews/FarmerView';
import NabardView from '@/components/sections/RoleViews/NabardView';
import InsurerView from '@/components/sections/RoleViews/InsurerView';
import SupplierView from '@/components/sections/RoleViews/SupplierView';
import SharedDataPanels from '@/components/sections/SharedDataPanels';
import EcosystemPanel from '@/components/sections/EcosystemPanel';
import ApiPlayground from '@/components/sections/ApiPlayground';
import Footer from '@/components/sections/Footer';

export default function Dashboard() {
  const { role } = useParams<{ role: string }>();
  const [district, setDistrict] = useState('Solapur');
  const [year, setYear] = useState(2030);
  const [hazard, setHazard] = useState<Hazard>('drought');

  const { data, isLive, isLoading } = useRiskData(district, year);

  if (!role || !['farmer', 'nabard', 'insurer', 'supplier'].includes(role)) {
    return <Navigate to="/" replace />;
  }

  const validRole = role as Role;

  // Frontend UI projection logic to mathematically simulate climate progression
  // ONLY applies during "Demo Mode" (if isLive is false).
  // If "Model Online", the backend already calculates these projections.
  const projectedData = useMemo(() => {
    if (!data) return data;
    if (isLive) return data; // Backend already handled projection
    
    const yearDiff = year - 2030;
    const clamp = (val: number) => Math.min(Math.max(Math.round(val), 0), 100);
    
    return {
      ...data,
      drought: clamp(data.drought + (yearDiff * 1.5)),
      flood: clamp(data.flood + (yearDiff * 0.8)),
      heat: clamp(data.heat + (yearDiff * 2.1)),
      soilMoisture: clamp(data.soilMoisture - (yearDiff * 0.8)),
      droughtLevel: (data.drought + (yearDiff * 1.5) > 65) ? 'HIGH' : ((data.drought + (yearDiff * 1.5) > 40) ? 'MEDIUM' : 'LOW') as any,
      heatLevel: (data.heat + (yearDiff * 2.1) > 70) ? 'HIGH' : ((data.heat + (yearDiff * 2.1) > 50) ? 'MEDIUM' : 'LOW') as any,
      floodLevel: (data.flood + (yearDiff * 0.8) > 60) ? 'HIGH' : ((data.flood + (yearDiff * 0.8) > 35) ? 'MEDIUM' : 'LOW') as any,
    };
  }, [data, year, isLive]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 selection:bg-green-600 selection:text-white">
      <Header isLive={isLive} />

      <div className="pt-[64px]">
        <ControlBar
          district={district} year={year} hazard={hazard}
          onDistrictChange={setDistrict} onYearChange={setYear}
          onHazardChange={setHazard}
        />

        <main className="px-6 py-10 space-y-10 max-w-[1400px] mx-auto min-h-screen relative">
          
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-50 rounded-3xl">
               <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mb-4" />
               <span className="text-xs text-green-600 uppercase tracking-[0.2em] font-bold animate-pulse">Synchronizing Logic...</span>
            </div>
          )}

          <RiskScoreStrip data={projectedData} hazard={hazard} district={district} onHazardChange={setHazard} />

          <div key={validRole} className="animate-fade-slide">
            {validRole === 'farmer' && <FarmerView data={projectedData} year={year} />}
            {validRole === 'nabard' && <NabardView data={projectedData} district={district} year={year} />}
            {validRole === 'insurer' && <InsurerView data={projectedData} />}
            {validRole === 'supplier' && <SupplierView data={projectedData} district={district} />}
          </div>

          <SharedDataPanels data={projectedData} district={district} hazard={hazard} year={year} isLive={isLive} />
          
          <EcosystemPanel data={projectedData} district={district} />
          
          <ApiPlayground data={projectedData} district={district} year={year} hazard={hazard} role={validRole} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
