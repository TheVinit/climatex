import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hazard, DistrictData } from '@/lib/types';
import { useRiskData } from '@/hooks/useRiskData';
import { DISTRICT_NAMES, getRiskColor } from '@/lib/data';
import { supplierActions } from '@/lib/actions';
import MaharashtraMap from '@/components/MaharashtraMap';
import {
  Leaf, MapPin, AlertTriangle, TrendingUp, ChevronLeft,
  Droplets, Waves, Thermometer, Activity, Home, Package
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

const HAZARDS: { key: Hazard; label: string; icon: typeof Droplets }[] = [
  { key: 'drought', icon: Droplets, label: 'Drought' },
  { key: 'flood',   icon: Waves,    label: 'Flood' },
  { key: 'heat',    icon: Thermometer, label: 'Heat' },
];

function getHazardLevel(d: DistrictData, h: Hazard) {
  return h === 'drought' ? d.droughtLevel : h === 'flood' ? d.floodLevel : d.heatLevel;
}

export default function SupplierPage() {
  const [district, setDistrict] = useState('Solapur');
  const [hazard, setHazard] = useState<Hazard>('drought');

  const { data, isLoading, isLive } = useRiskData(district);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seed demand data...</p>
        </div>
      </div>
    );
  }

  const hazardLabel = hazard === 'drought' ? 'Drought' : hazard === 'flood' ? 'Flood' : 'Heat Wave';
  const riskColor = getRiskColor(getHazardLevel(data, hazard));
  const riskLevel = getHazardLevel(data, hazard);

  // Process seed demand data for visualization
  const seedData = Object.entries(data.seedDemand || {})
    .map(([key, value]) => {
      const names: Record<string, string> = {
        bajra: 'Bajra', jowar: 'Jowar', cotton: 'Cotton',
        turDal: 'Tur Dal', chickpea: 'Chickpea'
      };
      return {
        name: names[key] || key,
        value: value as number,
        key
      };
    })
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#1a56db', '#059669', '#d97706', '#7c3aed', '#dc2626'];
  const maxVal = Math.max(...seedData.map(s => s.value));

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
                <Leaf size={20} className="text-orange-600" />
                <span className="font-semibold text-gray-900">Seed Supplier Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* District Selector */}
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Seed Demand Intelligence</h1>
              <p className="text-orange-100 mb-4">Pre-position resilient varieties for {district}, Maharashtra</p>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm opacity-90">Current Risk</div>
                  <div className="font-semibold">{hazardLabel}: {riskLevel}</div>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-sm opacity-90">Total Demand</div>
                  <div className="font-semibold">{seedData.reduce((sum, s) => sum + s.value, 0).toLocaleString()} kg</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Leaf size={80} className="text-orange-200 opacity-80" />
            </div>
          </div>
        </div>

        {/* Hazard Selector */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan for Hazard Impact</h2>
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
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
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

          {/* Demand Panel */}
          <div className="space-y-6">
            {/* Current Demand Alert */}
            <div className={`rounded-lg p-6 border-2 ${
              riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' :
              riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Package size={24} className={
                  riskLevel === 'HIGH' ? 'text-red-600' :
                  riskLevel === 'MEDIUM' ? 'text-yellow-600' :
                  'text-green-600'
                } />
                <div>
                  <h3 className="font-semibold text-gray-900">Seed Demand Alert</h3>
                  <p className="text-sm text-gray-600">{district} District</p>
                </div>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: riskColor }}>
                {hazard === 'drought' ? data.drought : hazard === 'flood' ? data.flood : data.heat}%
              </div>
              <p className="text-sm text-gray-700">
                {riskLevel === 'HIGH'
                  ? 'High risk detected. Pre-position drought-resistant varieties immediately.'
                  : riskLevel === 'MEDIUM'
                  ? 'Moderate risk. Monitor demand and prepare contingency stock.'
                  : 'Low risk conditions. Maintain normal inventory levels.'}
              </p>
            </div>

            {/* Top Crops */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Priority Crops</h3>
              <div className="space-y-3">
                {seedData.slice(0, 3).map((crop, i) => (
                  <div key={crop.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[i] }}
                      />
                      <span className="font-medium text-gray-900">{crop.name}</span>
                    </div>
                    <span className="font-mono text-gray-600">{crop.value.toLocaleString()} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demand Distribution */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Demand Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={seedData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {seedData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} kg`, 'Demand']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Crop-wise Demand</h2>
            <div className="space-y-4">
              {seedData.map((crop, i) => (
                <div key={crop.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900">{crop.name}</span>
                    <span className="font-mono text-gray-600">{crop.value.toLocaleString()} kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(crop.value / maxVal) * 100}%`,
                        backgroundColor: COLORS[i]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain Operations</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button onClick={() => supplierActions.stockSeeds()} className="flex items-center justify-center gap-3 p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 active:scale-95 transition-all">
              <Package size={20} />
              <span className="font-medium">Stock Seeds</span>
            </button>
            <button onClick={() => supplierActions.forecastDemand(district)} className="flex items-center justify-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all">
              <TrendingUp size={20} />
              <span className="font-medium">Demand Forecast</span>
            </button>
            <button onClick={() => supplierActions.planDistribution()} className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
              <Leaf size={20} />
              <span className="font-medium">Distribution Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}