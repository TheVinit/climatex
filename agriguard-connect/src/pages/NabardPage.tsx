import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hazard, DistrictData } from '@/lib/types';
import { useRiskData } from '@/hooks/useRiskData';
import { DISTRICT_NAMES, getRiskColor } from '@/lib/data';
import { nabardActions } from '@/lib/actions';
import MaharashtraMap from '@/components/MaharashtraMap';
import {
  Building2, MapPin, AlertTriangle, TrendingUp, ChevronLeft,
  Droplets, Waves, Thermometer, Activity, Home, DollarSign
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const HAZARDS: { key: Hazard; label: string; icon: typeof Droplets }[] = [
  { key: 'drought', icon: Droplets, label: 'Drought' },
  { key: 'flood',   icon: Waves,    label: 'Flood' },
  { key: 'heat',    icon: Thermometer, label: 'Heat' },
];

function getHazardLevel(d: DistrictData, h: Hazard) {
  return h === 'drought' ? d.droughtLevel : h === 'flood' ? d.floodLevel : d.heatLevel;
}

export default function NabardPage() {
  const [district, setDistrict] = useState('Solapur');
  const [hazard, setHazard] = useState<Hazard>('drought');

  const { data, isLoading, isLive } = useRiskData(district);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading credit risk data...</p>
        </div>
      </div>
    );
  }

  const hazardLabel = hazard === 'drought' ? 'Drought' : hazard === 'flood' ? 'Flood' : 'Heat Wave';
  const riskColor = getRiskColor(getHazardLevel(data, hazard));
  const riskLevel = getHazardLevel(data, hazard);

  // Mock credit risk data
  const creditData = [
    { district: 'Solapur', npaRisk: 'HIGH', kccLimit: 50000, reduction: 15 },
    { district: 'Ahmednagar', npaRisk: 'MEDIUM', kccLimit: 45000, reduction: 10 },
    { district: 'Pune', npaRisk: 'LOW', kccLimit: 55000, reduction: 5 },
    { district: 'Satara', npaRisk: 'MEDIUM', kccLimit: 48000, reduction: 8 },
    { district: 'Sangli', npaRisk: 'HIGH', kccLimit: 42000, reduction: 12 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Home size={20} />
                <span className="font-medium">Home</span>
              </Link>
              <ChevronLeft size={16} className="text-gray-400" />
              <div className="flex items-center gap-2">
                <Building2 size={20} className="text-purple-600" />
                <span className="font-semibold text-gray-900">NABARD Credit Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* District Selector */}
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {DISTRICT_NAMES.map(d => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>

              {/* Live Status */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600">{isLive ? 'Live Data' : 'Demo Mode'}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Kisan Credit Card Risk Center</h1>
              <p className="text-purple-100 mb-4">Dynamic credit limits for {district}, Maharashtra</p>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm opacity-90">Current Risk</div>
                  <div className="font-semibold">{hazardLabel}: {riskLevel}</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm opacity-90">KCC Adjustment</div>
                  <div className="font-semibold">-{data.kccReduction}% Limit</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Building2 size={80} className="text-purple-200 opacity-80" />
            </div>
          </div>
        </div>

        {/* Hazard Selector */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assess Credit Risk Factors</h2>
          <div className="flex gap-4">
            {HAZARDS.map(h => {
              const Icon = h.icon;
              const active = hazard === h.key;
              return (
                <button
                  key={h.key}
                  onClick={() => setHazard(h.key)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 transition-all ${
                    active
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{h.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Map - {district}</h2>
              <MaharashtraMap district={district} hazard={hazard} onSelect={setDistrict} />
            </div>
          </div>

          {/* Credit Risk Panel */}
          <div className="space-y-6">
            {/* Current Risk Assessment */}
            <div className={`rounded-lg p-6 border-2 ${
              riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' :
              riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <DollarSign size={24} className={
                  riskLevel === 'HIGH' ? 'text-red-600' :
                  riskLevel === 'MEDIUM' ? 'text-yellow-600' :
                  'text-green-600'
                } />
                <div>
                  <h3 className="font-semibold text-gray-900">KCC Credit Assessment</h3>
                  <p className="text-sm text-gray-600">{district} District</p>
                </div>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: riskColor }}>
                {hazard === 'drought' ? data.drought : hazard === 'flood' ? data.flood : data.heat}%
              </div>
              <div className="text-lg font-semibold mb-2" style={{ color: riskColor }}>
                {riskLevel} RISK ZONE
              </div>
              <p className="text-sm text-gray-700">
                Recommended: Reduce KCC limit by <strong>{data.kccReduction}%</strong>
              </p>
            </div>

            {/* Credit Metrics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Credit Risk Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">KCC Limit Reduction</span>
                  <span className="font-bold text-red-600">-{data.kccReduction}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Stress Buffer Required</span>
                  <span className="font-bold text-blue-600">+{data.stressBuffer}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">NPA Risk Level</span>
                  <span className={`font-bold px-2 py-1 rounded text-sm ${
                    data.kccRisk === 'HIGH' ? 'bg-red-100 text-red-800' :
                    data.kccRisk === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {data.kccRisk}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* District Risk Ranking */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">District Credit Risk Ranking (Drought)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={creditData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="district" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="reduction" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p>Percentage reduction in KCC limits based on climate risk assessment</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Credit Operations</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button onClick={() => nabardActions.adjustLimits(district)} className="flex items-center justify-center gap-3 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:scale-95 transition-all">
              <DollarSign size={20} />
              <span className="font-medium">Adjust Limits</span>
            </button>
            <button onClick={() => nabardActions.generateRiskReport(district)} className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
              <TrendingUp size={20} />
              <span className="font-medium">Risk Reports</span>
            </button>
            <button onClick={() => nabardActions.reviewPortfolio()} className="flex items-center justify-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all">
              <Building2 size={20} />
              <span className="font-medium">Portfolio Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}