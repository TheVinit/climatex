import { useState } from 'react';
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

  const { data, isLive, isLoading } = useRiskData(district);

  if (!role || !['farmer', 'nabard', 'insurer', 'supplier'].includes(role)) {
    return <Navigate to="/" replace />;
  }

  const validRole = role as Role;

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

          <RiskScoreStrip data={data} hazard={hazard} district={district} onHazardChange={setHazard} />

          <div key={validRole} className="animate-fade-slide">
            {validRole === 'farmer' && <FarmerView data={data} year={year} />}
            {validRole === 'nabard' && <NabardView data={data} district={district} year={year} />}
            {validRole === 'insurer' && <InsurerView data={data} />}
            {validRole === 'supplier' && <SupplierView data={data} district={district} />}
          </div>

          <SharedDataPanels data={data} district={district} hazard={hazard} year={year} isLive={isLive} />
          
          <EcosystemPanel data={data} district={district} />
          
          <ApiPlayground data={data} district={district} year={year} hazard={hazard} role={validRole} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
