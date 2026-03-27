import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hazard, DistrictData } from '@/lib/types';
import { useRiskData } from '@/hooks/useRiskData';
import { DISTRICT_NAMES, getRiskColor } from '@/lib/data';
import { insurerActions } from '@/lib/actions';
import MaharashtraMap from '@/components/MaharashtraMap';
import {
  Shield, MapPin, AlertTriangle, TrendingUp, ChevronLeft,
  Droplets, Waves, Thermometer, Activity, Home, Zap
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

export default function InsurerPage() {
  const [district, setDistrict] = useState('Solapur');
  const [hazard, setHazard] = useState<Hazard>('drought');

  const { data, isLoading, isLive } = useRiskData(district);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insurance data...</p>
        </div>
      </div>
    );
  }

  const hazardLabel = hazard === 'drought' ? 'Drought' : hazard === 'flood' ? 'Flood' : 'Heat Wave';
  const riskColor = getRiskColor(getHazardLevel(data, hazard));
  const riskLevel = getHazardLevel(data, hazard);

  // Mock payout data for visualization
  const payoutData = [
    { district: 'Solapur', amount: 2500000, claims: 45 },
    { district: 'Ahmednagar', amount: 1800000, claims: 32 },
    { district: 'Pune', amount: 3200000, claims: 58 },
    { district: 'Satara', amount: 1500000, claims: 28 },
    { district: 'Sangli', amount: 2100000, claims: 38 },
  ];

  const triggerStatus = riskLevel === 'HIGH' ? 'TRIGGERED' : riskLevel === 'MEDIUM' ? 'MONITORING' : 'CLEAR';

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
                <Shield size={20} className="text-blue-600" />
                <span className="font-semibold text-gray-900">Insurance Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* District Selector */}
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">PMFBY Insurance Control Center</h1>
              <p className="text-blue-100 mb-4">Automated parametric triggers for {district}, Maharashtra</p>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm opacity-90">Current Risk</div>
                  <div className="font-semibold">{hazardLabel}: {riskLevel}</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm opacity-90">Trigger Status</div>
                  <div className="font-semibold">{triggerStatus}</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Shield size={80} className="text-blue-200 opacity-80" />
            </div>
          </div>
        </div>

        {/* Hazard Selector */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monitor Hazard Triggers</h2>
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
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
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

          {/* Trigger Panel */}
          <div className="space-y-6">
            {/* Current Trigger Status */}
            <div className={`rounded-lg p-6 border-2 ${
              riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' :
              riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Zap size={24} className={
                  riskLevel === 'HIGH' ? 'text-red-600' :
                  riskLevel === 'MEDIUM' ? 'text-yellow-600' :
                  'text-green-600'
                } />
                <div>
                  <h3 className="font-semibold text-gray-900">PMFBY Trigger Status</h3>
                  <p className="text-sm text-gray-600">{district} District</p>
                </div>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: riskColor }}>
                {hazard === 'drought' ? data.drought : hazard === 'flood' ? data.flood : data.heat}%
              </div>
              <div className="text-lg font-semibold mb-2" style={{ color: riskColor }}>
                {triggerStatus}
              </div>
              <p className="text-sm text-gray-700">
                {riskLevel === 'HIGH'
                  ? 'Automatic payout trigger activated. Claims processing initiated.'
                  : riskLevel === 'MEDIUM'
                  ? 'Enhanced monitoring active. Prepare contingency measures.'
                  : 'All triggers clear. Normal operations continue.'}
              </p>
            </div>

            {/* Trigger Metrics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Trigger Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Soil Moisture</span>
                  <span className="font-mono font-semibold">{data.soilMoisture}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(data.soilMoisture * 2, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">Trigger: &lt; 20%</div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">NDVI Index</span>
                  <span className="font-mono font-semibold">{data.ndvi}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${data.ndvi * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">Trigger: &lt; 0.30</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Analytics */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payout Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payoutData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'amount' ? `₹${value.toLocaleString()}` : value,
                name === 'amount' ? 'Payout Amount' : 'Claims'
              ]} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p>Total payouts in last quarter: ₹11.1M across 5 districts</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Insurance Operations</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => insurerActions.processClaims()}
              className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <AlertTriangle size={20} />
              <span className="font-medium">Process Claims</span>
            </button>
            <button
              onClick={() => insurerActions.generateRiskReport(district)}
              className="flex items-center justify-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <TrendingUp size={20} />
              <span className="font-medium">Risk Reports</span>
            </button>
            <button
              onClick={() => insurerActions.managePolicy('PMFBY-2025')}
              className="flex items-center justify-center gap-3 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Shield size={20} />
              <span className="font-medium">Policy Management</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}