import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hazard, DistrictData } from '@/lib/types';
import { useRiskData } from '@/hooks/useRiskData';
import { DISTRICT_NAMES, getRiskColor, getRiskBg } from '@/lib/data';
import { farmerActions } from '@/lib/actions';
import MaharashtraMap from '@/components/MaharashtraMap';
import {
  Sprout, MapPin, AlertTriangle, TrendingUp, ChevronLeft,
  Droplets, Waves, Thermometer, Activity, Home
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const HAZARDS: { key: Hazard; label: string; icon: typeof Droplets }[] = [
  { key: 'drought', icon: Droplets, label: 'Drought' },
  { key: 'flood',   icon: Waves,    label: 'Flood' },
  { key: 'heat',    icon: Thermometer, label: 'Heat' },
];

function getHazardTrend(d: DistrictData, h: Hazard) {
  return h === 'drought' ? d.trend : h === 'flood' ? d.floodTrend : d.heatTrend;
}

function getHazardLevel(d: DistrictData, h: Hazard) {
  return h === 'drought' ? d.droughtLevel : h === 'flood' ? d.floodLevel : d.heatLevel;
}

export default function FarmerPage() {
  const [district, setDistrict] = useState('Solapur');
  const [hazard, setHazard] = useState<Hazard>('drought');

  const { data, isLoading, isLive } = useRiskData(district);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading climate data...</p>
        </div>
      </div>
    );
  }

  const trendArray = getHazardTrend(data, hazard);
  const trendData = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040].map((y, i) => ({
    year: y,
    district: trendArray[i],
    mhAvg: [25, 28, 22, 35, 30, 20, 25, 32, 28, 18, 22, 30, 26, 15, 20, 25][i] // Mock MH average
  }));

  const hazardLabel = hazard === 'drought' ? 'Drought' : hazard === 'flood' ? 'Flood' : 'Heat Wave';
  const riskColor = getRiskColor(getHazardLevel(data, hazard));
  const riskLevel = getHazardLevel(data, hazard);

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
                <Sprout size={20} className="text-green-600" />
                <span className="font-semibold text-gray-900">Farmer Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* District Selector */}
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, Farmer</h1>
              <p className="text-green-100 mb-4">Climate-smart farming decisions for {district}, Maharashtra</p>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm opacity-90">Primary Crop</div>
                  <div className="font-semibold">{data.primaryCrop}</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm opacity-90">Current Risk</div>
                  <div className="font-semibold">{hazardLabel}: {riskLevel}</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Sprout size={80} className="text-green-200 opacity-80" />
            </div>
          </div>
        </div>

        {/* Hazard Selector */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Hazard to Monitor</h2>
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
                      ? 'border-green-500 bg-green-50 text-green-700'
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

          {/* Advisory Panel */}
          <div className="space-y-6">
            {/* Current Risk Alert */}
            <div className={`rounded-lg p-6 border-2 ${
              riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' :
              riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={24} className={
                  riskLevel === 'HIGH' ? 'text-red-600' :
                  riskLevel === 'MEDIUM' ? 'text-yellow-600' :
                  'text-green-600'
                } />
                <div>
                  <h3 className="font-semibold text-gray-900">{hazardLabel} Risk Alert</h3>
                  <p className="text-sm text-gray-600">{district} District</p>
                </div>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: riskColor }}>
                {hazard === 'drought' ? data.drought : hazard === 'flood' ? data.flood : data.heat}%
              </div>
              <p className="text-sm text-gray-700">{data.advisory}</p>
            </div>

            {/* Crop Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recommended Crops</h3>
              <div className="space-y-3">
                {data.primaryCrop.split(' / ').map(crop => (
                  <div key={crop} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">{crop.trim()}</span>
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Safe</span>
                  </div>
                ))}
                {data.avoidCrops.map(crop => (
                  <div key={crop} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">{crop}</span>
                    <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">Avoid</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{hazardLabel} Risk Trend (2025-2040)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="district" stroke={riskColor} strokeWidth={3} />
              <Line type="monotone" dataKey="mhAvg" stroke="#94a3b8" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 rounded" style={{ backgroundColor: riskColor }} />
              <span>{district}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 rounded bg-gray-400" style={{ borderStyle: 'dashed' }} />
              <span>Maharashtra Average</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button onClick={() => farmerActions.viewCropCalendar(district)} className="flex items-center justify-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all">
              <Sprout size={20} />
              <span className="font-medium">View Crop Calendar</span>
            </button>
            <button onClick={() => farmerActions.emergencyContacts(district)} className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
              <AlertTriangle size={20} />
              <span className="font-medium">Emergency Contacts</span>
            </button>
            <button onClick={() => farmerActions.marketPrices(district)} className="flex items-center justify-center gap-3 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:scale-95 transition-all">
              <TrendingUp size={20} />
              <span className="font-medium">Market Prices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}