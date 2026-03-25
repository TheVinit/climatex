#!/usr/bin/env python3
"""
KISANSURAKSHA - WEB UI DASHBOARD
Complete web interface for climate hazard forecasting
"""

from flask import Flask, render_template, render_template_string, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from data_fetcher import DiCRADataFetcher
from forecaster import ClimateHazardForecaster
from config import MAHARASHTRA_DISTRICTS, DROUGHT_THRESHOLD, FLOOD_THRESHOLD, HEAT_WAVE_THRESHOLD

app = Flask(__name__)
CORS(app)

# Load models and data
try:
    forecaster = ClimateHazardForecaster()
    forecaster.load_model()
    
    if os.path.exists('data/maharashtra_climate_data.csv'):
        data_df = pd.read_csv('data/maharashtra_climate_data.csv')
    else:
        data_df = None
except:
    forecaster = None
    data_df = None

# Template HTML/CSS for web interface
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KisanSuraksha - Climate Hazard Forecasting</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: radial-gradient(circle at 20% 20%, #202a44 0%, #0f1226 60%, #070a16 100%);
            color: #e3eafc;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            background: #111832;
            border-radius: 10px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 6px 12px rgba(0,0,0,0.5);
            text-align: center;
        }
        
        .header h1 {
            color: #333;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 1.1em;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: #1a203c;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 6px 14px rgba(0,0,0,0.6);
            transition: transform 0.3s, box-shadow 0.3s;
            border: 1px solid #2e3667;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 18px rgba(0,0,0,0.65);
        }
        
        .card-title {
            font-size: 1.3em;
            color: #333;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .card-icon {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            color: #333;
            font-weight: 500;
        }
        
        select, input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1em;
        }
        
        select:focus, input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
        }
        
        .button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            font-size: 1em;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            width: 100%;
            font-weight: 600;
        }
        
        .button:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .results {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            display: none;
        }
        
        .results.show {
            display: block;
        }
        
        .risk-score {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .risk-low {
            color: #27ae60;
        }
        
        .risk-medium {
            color: #f39c12;
        }
        
        .risk-high {
            color: #e74c3c;
        }
        
        .metric {
            margin: 10px 0;
            padding: 10px;
            background: #161f3f;
            border-left: 4px solid #51a8ff;
            border-radius: 3px;
        }
        
        .metric-label {
            color: #9ab6ee;
            font-size: 0.9em;
        }
        
        .metric-value {
            color: #333;
            font-size: 1.2em;
            font-weight: 600;
        }
        
        .advice {
            background: #e8f4f8;
            border-left: 4px solid #3498db;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
            color: #333;
            line-height: 1.6;
        }
        
        .footer {
            background: #10152e;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            color: #9fb5e4;
            margin-top: 30px;
            border: 1px solid #2a3564;
        }
        
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #ddd;
        }
        
        .tab-button {
            padding: 10px 20px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1em;
            color: #666;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
        }
        
        .tab-button.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🌾 KisanSuraksha</h1>
            <p>AI-Powered Climate Hazard Forecasting for Farmers & Agricultural Institutions</p>
        </div>
        
        <!-- Tabs -->
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div class="tabs">
                <button class="tab-button active" onclick="showTab('crop-advisory')">🌱 Crop Advisory</button>
                <button class="tab-button" onclick="showTab('insurance')">📋 Insurance Trigger</button>
                <button class="tab-button" onclick="showTab('credit-risk')">💳 Credit Risk</button>
                <button class="tab-button" onclick="showTab('dashboard')">📊 Dashboard</button>
                <button class="tab-button" onclick="showTab('horizon')">⏳ 10-15 Yr Horizon</button>
            </div>
            
            <!-- Tab 1: Crop Advisory -->
            <div id="crop-advisory" class="tab-content active">
                <div class="grid">
                    <div class="card">
                        <div class="card-icon">🌾</div>
                        <div class="card-title">Crop Advisory</div>
                        
                        <form id="crop-form">
                            <div class="form-group">
                                <label for="district-crop">Select District</label>
                                <select id="district-crop" required>
                                    <option value="">-- Choose District --</option>
                                    <!-- Districts populated by JS -->
                                </select>
                            </div>
                            
                            <button type="submit" class="button">Get Crop Advisory</button>
                        </form>
                        
                        <div class="loading" id="crop-loading">
                            <div class="spinner"></div>
                        </div>
                        
                        <div class="results" id="crop-results">
                            <div class="metric">
                                <div class="metric-label">Drought Risk</div>
                                <div class="metric-value" id="crop-drought">-</div>
                            </div>
                            <div class="metric">
                                <div class="metric-label">Flood Risk</div>
                                <div class="metric-value" id="crop-flood">-</div>
                            </div>
                            <div class="metric">
                                <div class="metric-label">Heat Wave Risk</div>
                                <div class="metric-value" id="crop-heat">-</div>
                            </div>
                            <div class="advice" id="crop-advice"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tab 2: Insurance Trigger -->
            <div id="insurance" class="tab-content">
                <div class="grid">
                    <div class="card">
                        <div class="card-icon">📋</div>
                        <div class="card-title">PMFBY Insurance Trigger</div>
                        <p style="color: #666; margin-bottom: 15px; font-size: 0.9em;">Automatically trigger PMFBY insurance when drought or flood risk exceeds threshold</p>
                        
                        <form id="insurance-form">
                            <div class="form-group">
                                <label for="district-insurance">Select District</label>
                                <select id="district-insurance" required>
                                    <option value="">-- Choose District --</option>
                                    <!-- Districts populated by JS -->
                                </select>
                            </div>
                            
                            <button type="submit" class="button">Check Insurance Status</button>
                        </form>
                        
                        <div class="loading" id="insurance-loading">
                            <div class="spinner"></div>
                        </div>
                        
                        <div class="results" id="insurance-results">
                            <div class="metric">
                                <div class="metric-label">Insurance Trigger Status</div>
                                <div class="metric-value" id="insurance-status">-</div>
                            </div>
                            <div class="metric">
                                <div class="metric-label">Drought Risk</div>
                                <div class="metric-value" id="insurance-drought">-</div>
                            </div>
                            <div class="metric">
                                <div class="metric-label">Flood Risk</div>
                                <div class="metric-value" id="insurance-flood">-</div>
                            </div>
                            <div class="advice" id="insurance-advice"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tab 3: Credit Risk -->
            <div id="credit-risk" class="tab-content">
                <div class="grid">
                    <div class="card">
                        <div class="card-icon">💳</div>
                        <div class="card-title">NABARD Credit Risk Assessment</div>
                        <p style="color: #666; margin-bottom: 15px; font-size: 0.9em;">Evaluate credit risk for Kisan Credit Card lending decisions</p>
                        
                        <form id="credit-form">
                            <div class="form-group">
                                <label for="district-credit">Select District</label>
                                <select id="district-credit" required>
                                    <option value="">-- Choose District --</option>
                                    <!-- Districts populated by JS -->
                                </select>
                            </div>
                            
                            <button type="submit" class="button">Assess Credit Risk</button>
                        </form>
                        
                        <div class="loading" id="credit-loading">
                            <div class="spinner"></div>
                        </div>
                        
                        <div class="results" id="credit-results">
                            <div class="metric">
                                <div class="metric-label">Credit Risk Level</div>
                                <div class="metric-value" id="credit-level">-</div>
                            </div>
                            <div class="metric">
                                <div class="metric-label">Max Hazard Score</div>
                                <div class="metric-value" id="credit-score">-</div>
                            </div>
                            <div class="advice" id="credit-advice"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tab 4: Dashboard -->
            <div id="dashboard" class="tab-content">
                <div class="card">
                    <div class="card-title">System Status Dashboard</div>
                    <div class="metric">
                        <div class="metric-label">Districts Covered</div>
                        <div class="metric-value">36 Maharashtra Districts</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Hazard Types Monitored</div>
                        <div class="metric-value">3 (Drought, Flood, Heat Wave)</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Use Cases</div>
                        <div class="metric-value">
                            <ul style="margin-left: 20px;">
                                <li>✓ Crop Advisory for Farmers</li>
                                <li>✓ PMFBY Insurance Trigger</li>
                                <li>✓ NABARD Credit Risk Flagging</li>
                            </ul>
                        </div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Historical Validation</div>
                        <div class="metric-value">2012, 2015, 2016, 2018 Drought Years</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Data Source</div>
                        <div class="metric-value">DiCRA API - Real Climate Data</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Model Type</div>
                        <div class="metric-value">Random Forest Classifiers (Optimized)</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Tab 5: Horizon Forecast -->
        <div id="horizon" class="tab-content">
            <div class="card">
                <div class="card-icon">⏳</div>
                <div class="card-title">10-15 Year Hazard Horizon</div>
                <p style="color: #666; margin-bottom: 15px; font-size: 0.9em;">Projected flood/drought/heat wave risk over the next 10-15 years using historic trends.</p>

                <form id="horizon-form" style="margin-bottom:15px;">
                    <div class="form-group">
                        <label for="district-horizon">Select District</label>
                        <select id="district-horizon" required>
                            <option value="">-- Choose District --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="horizon-years">Forecast Horizon (years)</label>
                        <input id="horizon-years" type="number" min="5" max="20" value="15" required />
                    </div>
                    <button type="submit" class="button">Generate Horizon Forecast</button>
                </form>

                <div class="loading" id="horizon-loading">
                    <div class="spinner"></div>
                </div>

                <div class="results" id="horizon-results">
                    <canvas id="horizon-chart" width="800" height="350"></canvas>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>KisanSuraksha v1.0</strong> | AI-Powered Agricultural Risk Management</p>
            <p style="font-size: 0.9em; margin-top: 10px;">Powered by DiCRA Climate Data | NABARD & PMFBY Compliant</p>
        </div>
    </div>
    
    <!-- Chart.js for horizon visuals -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <script>
        // Populate district dropdowns
        const districts = %DISTRICTS%;
        ['district-crop', 'district-insurance', 'district-credit', 'district-horizon'].forEach(id => {
            const select = document.getElementById(id);
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.text = district;
                select.appendChild(option);
            });
        });
        
        // Tab switching
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }
        
        // Crop Advisory Form
        document.getElementById('crop-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const district = document.getElementById('district-crop').value;
            document.getElementById('crop-loading').style.display = 'block';
            document.getElementById('crop-results').classList.remove('show');
            
            try {
                const response = await fetch('/api/v1/forecast', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({district})
                });
                const data = await response.json();
                
                document.getElementById('crop-drought').textContent = (data.drought_score * 100).toFixed(1) + '%';
                document.getElementById('crop-flood').textContent = (data.flood_score * 100).toFixed(1) + '%';
                document.getElementById('crop-heat').textContent = (data.heat_wave_score * 100).toFixed(1) + '%';
                document.getElementById('crop-advice').textContent = data.crop_advisory;
                
                document.getElementById('crop-results').classList.add('show');
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                document.getElementById('crop-loading').style.display = 'none';
            }
        });
        
        // Insurance Trigger Form
        document.getElementById('insurance-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const district = document.getElementById('district-insurance').value;
            document.getElementById('insurance-loading').style.display = 'block';
            document.getElementById('insurance-results').classList.remove('show');
            
            try {
                const response = await fetch('/api/v1/insurance-trigger', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({district})
                });
                const data = await response.json();
                
                const statusText = data.trigger ? 'YES - TRIGGER INSURANCE' : 'NO - No insurance needed';
                const statusColor = data.trigger ? 'risk-high' : 'risk-low';
                
                document.getElementById('insurance-status').textContent = statusText;
                document.getElementById('insurance-status').className = 'metric-value ' + statusColor;
                document.getElementById('insurance-drought').textContent = (data.drought_score * 100).toFixed(1) + '%';
                document.getElementById('insurance-flood').textContent = (data.flood_score * 100).toFixed(1) + '%';
                document.getElementById('insurance-advice').textContent = 
                    data.trigger ? 
                    '⚠️ Insurance should be triggered immediately for ' + district : 
                    '✓ No insurance trigger needed at this time.';
                
                document.getElementById('insurance-results').classList.add('show');
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                document.getElementById('insurance-loading').style.display = 'none';
            }
        });
        
        // Credit Risk Form
        document.getElementById('credit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const district = document.getElementById('district-credit').value;
            document.getElementById('credit-loading').style.display = 'block';
            document.getElementById('credit-results').classList.remove('show');
            
            try {
                const response = await fetch('/api/v1/credit-risk', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({district})
                });
                const data = await response.json();
                
                const riskColor = data.risk_level === 'HIGH' ? 'risk-high' : 
                                data.risk_level === 'MEDIUM' ? 'risk-medium' : 'risk-low';
                
                document.getElementById('credit-level').textContent = data.risk_level;
                document.getElementById('credit-level').className = 'metric-value ' + riskColor;
                document.getElementById('credit-score').textContent = (data.max_hazard_score * 100).toFixed(1) + '%';
                document.getElementById('credit-advice').textContent = 
                    data.risk_level === 'HIGH' ? 
                    '⚠️ High risk - Recommend reduced credit limit or higher collateral for ' + district :
                    data.risk_level === 'MEDIUM' ?
                    '⚠️ Medium risk - Monitor closely, normal lending with standard conditions for ' + district :
                    '✓ Low risk - Favorable conditions for credit approval in ' + district;
                
                document.getElementById('credit-results').classList.add('show');
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                document.getElementById('credit-loading').style.display = 'none';
            }
        });
        
        // Horizon Forecast Form
        document.getElementById('horizon-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const district = document.getElementById('district-horizon').value;
            const horizonYears = parseInt(document.getElementById('horizon-years').value, 10);

            document.getElementById('horizon-loading').style.display = 'block';
            document.getElementById('horizon-results').classList.remove('show');
            
            try {
                const response = await fetch('/api/v1/forecast-horizon', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({district, horizon_years: horizonYears})
                });
                const data = await response.json();

                if (data.error) {
                    alert('Error: ' + data.error);
                    return;
                }

                const ctx = document.getElementById('horizon-chart').getContext('2d');
                if (window.horizonChart) {
                    window.horizonChart.destroy();
                }

                window.horizonChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.year,
                        datasets: [
                            {
                                label: 'Drought Risk',
                                data: data.drought_risk,
                                borderColor: '#e67e22',
                                backgroundColor: 'rgba(230,126,34,0.2)',
                                tension: 0.2
                            },
                            {
                                label: 'Flood Risk',
                                data: data.flood_risk,
                                borderColor: '#3498db',
                                backgroundColor: 'rgba(52,152,219,0.2)',
                                tension: 0.2
                            },
                            {
                                label: 'Heat Wave Risk',
                                data: data.heat_wave_risk,
                                borderColor: '#e74c3c',
                                backgroundColor: 'rgba(231,76,60,0.2)',
                                tension: 0.2
                            }
                        ]
                    },
                    options: {
                        plugins: {
                            title: {
                                display: true,
                                text: '10-15 Year Hazard Projection for ' + district
                            },
                            legend: {
                                position: 'top'
                            }
                        },
                        scales: {
                            y: {
                                min: 0,
                                max: 1,
                                title: {
                                    display: true,
                                    text: 'Risk Score (0 = low; 1 = high)'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            }
                        }
                    }
                });

                document.getElementById('horizon-results').classList.add('show');
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                document.getElementById('horizon-loading').style.display = 'none';
            }
        });
    </script>
</body>
</html>

    </script>
</body>
</html>
"""

@app.route('/')
def index():
    districts_json = str(MAHARASHTRA_DISTRICTS).replace("'", '"')
    return render_template_string(HTML_TEMPLATE, DISTRICTS=districts_json)

@app.route('/api/v1/forecast', methods=['POST'])
def forecast():
    """Get crop advisory for a district"""
    data = request.json
    district = data.get('district')

    if not forecaster:
        return jsonify({'error': 'Model not loaded'}), 500

    if data_df is None:
        return jsonify({'error': 'Historical data not available'}), 500

    district_data = data_df[data_df['district'] == district]
    if district_data.empty:
        return jsonify({'error': f'No data for district: {district}'}), 404

    features_df = forecaster.prepare_features(district_data)
    feature_cols = [c for c in features_df.columns if c not in ['district', 'date']]

    if not feature_cols:
        return jsonify({'error': 'No feature columns available for prediction'}), 500

    latest_features = features_df[feature_cols].iloc[-1:].values

    if not forecaster.models:
        loaded = forecaster.load_model()
        if not loaded:
            return jsonify({'error': 'Model not trained. Run /api/v1/train first.'}), 500

    predictions = forecaster.predict_hazards(latest_features)

    drought_score = float(predictions['drought']['risk_score'][0])
    flood_score = float(predictions['flood']['risk_score'][0])
    heat_wave_score = float(predictions['heat_wave']['risk_score'][0])

    risks = []
    if drought_score > DROUGHT_THRESHOLD:
        risks.append("High drought risk - Use drip irrigation, ensure water storage")
    if flood_score > FLOOD_THRESHOLD:
        risks.append("High flood risk - Ensure proper drainage systems")
    if heat_wave_score > HEAT_WAVE_THRESHOLD:
        risks.append("High heat wave risk - Use shade nets, increase watering frequency")

    advisory = " | ".join(risks) if risks else "✓ Favorable conditions - Standard farming practices recommended"

    return jsonify({
        'district': district,
        'drought_score': drought_score,
        'flood_score': flood_score,
        'heat_wave_score': heat_wave_score,
        'crop_advisory': advisory
    })

@app.route('/api/v1/insurance-trigger', methods=['POST'])
def insurance_trigger():
    """Check if PMFBY insurance should be triggered"""
    data = request.json
    district = data.get('district')

    if not forecaster:
        return jsonify({'error': 'Model not loaded'}), 500

    if data_df is None:
        return jsonify({'error': 'Historical data not available'}), 500

    district_data = data_df[data_df['district'] == district]
    if district_data.empty:
        return jsonify({'error': f'No data for district: {district}'}), 404

    features_df = forecaster.prepare_features(district_data)
    feature_cols = [c for c in features_df.columns if c not in ['district', 'date']]
    latest_features = features_df[feature_cols].iloc[-1:].values

    if not forecaster.models:
        loaded = forecaster.load_model()
        if not loaded:
            return jsonify({'error': 'Model not trained. Run /api/v1/train first.'}), 500

    predictions = forecaster.predict_hazards(latest_features)

    drought_score = float(predictions['drought']['risk_score'][0])
    flood_score = float(predictions['flood']['risk_score'][0])

    trigger = (drought_score > DROUGHT_THRESHOLD) or (flood_score > FLOOD_THRESHOLD)

    return jsonify({
        'district': district,
        'trigger': trigger,
        'drought_score': drought_score,
        'flood_score': flood_score
    })

@app.route('/api/v1/credit-risk', methods=['POST'])
def credit_risk():
    """Assess credit risk for NABARD lending"""
    data = request.json
    district = data.get('district')

    if not forecaster:
        return jsonify({'error': 'Model not loaded'}), 500

    if data_df is None:
        return jsonify({'error': 'Historical data not available'}), 500

    district_data = data_df[data_df['district'] == district]
    if district_data.empty:
        return jsonify({'error': f'No data for district: {district}'}), 404

    features_df = forecaster.prepare_features(district_data)
    feature_cols = [c for c in features_df.columns if c not in ['district', 'date']]
    latest_features = features_df[feature_cols].iloc[-1:].values

    if not forecaster.models:
        loaded = forecaster.load_model()
        if not loaded:
            return jsonify({'error': 'Model not trained. Run /api/v1/train first.'}), 500

    predictions = forecaster.predict_hazards(latest_features)

    max_risk = max(
        float(predictions['drought']['risk_score'][0]),
        float(predictions['flood']['risk_score'][0]),
        float(predictions['heat_wave']['risk_score'][0])
    )

    risk_level = 'HIGH' if max_risk > 0.75 else 'MEDIUM' if max_risk > 0.6 else 'LOW'

    return jsonify({
        'district': district,
        'risk_level': risk_level,
        'max_hazard_score': max_risk
    })


@app.route('/api/v1/forecast-horizon', methods=['POST'])
def forecast_horizon():
    """Project hazard risk in horizon (10-15 years) using trend extrapolation"""
    data = request.json
    district = data.get('district')
    horizon_years = data.get('horizon_years', 15)
    
    if not forecaster:
        return jsonify({'error': 'Model not loaded'}), 500
    
    from datetime import datetime, timedelta
    import numpy as np
    
    # If we have historical sized data, extrapolate using moving averages
    if os.path.exists('data/maharashtra_climate_data.csv'):
        df = pd.read_csv('data/maharashtra_climate_data.csv')
        df = df[df['district'] == district]
        if df.empty:
            return jsonify({'error': 'District not found in historical data'}), 404

        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Prepare baseline yearly averages for three indicators
        def baseline(param):
            sub = df[df['parameter'] == param].copy()
            if sub.empty:
                return None
            anch = sub.groupby(sub['date'].dt.year)['value'].mean()
            return anch

        drought_series = baseline('soil_moisture_index')
        flood_series = baseline('rainfall')
        heat_series = baseline('temperature')

        years = np.array(drought_series.index)
        future_years = np.arange(years[-1] + 1, years[-1] + 1 + horizon_years)

        def linear_project(series):
            x = years
            y = series.values
            if len(x) < 2:
                return np.full(horizon_years, y[-1] if len(y) else 0)
            m, b = np.polyfit(x, y, 1)
            return m * future_years + b

        drought_proj = linear_project(drought_series)
        flood_proj = linear_project(flood_series)
        heat_proj = linear_project(heat_series)

        # Risk heuristic functions
        drought_risk = np.clip((0.7 - drought_proj) / 0.4, 0, 1)
        flood_risk = np.clip((flood_proj - 3.5) / 4.5, 0, 1)
        heat_risk = np.clip((heat_proj - 30) / 10, 0, 1)

        return jsonify({
            'district': district,
            'horizon_years': horizon_years,
            'year': future_years.tolist(),
            'drought_risk': drought_risk.round(3).tolist(),
            'flood_risk': flood_risk.round(3).tolist(),
            'heat_wave_risk': heat_risk.round(3).tolist()
        })

    return jsonify({'error': 'Historical data file missing'}), 404

@app.route('/api/v1/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'KisanSuraksha Web UI'}), 200

if __name__ == '__main__':
    print("\n" + "="*70)
    print("KISANSURAKSHA - WEB DASHBOARD")
    print("="*70)
    print("\n🌐 Starting web server...")
    print("📍 Open browser: http://localhost:5000")
    print("="*70 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
