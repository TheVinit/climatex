from flask import Flask, jsonify, request
from flask_cors import CORS
from data_fetcher import DiCRADataFetcher
from forecaster import ClimateHazardForecaster
from config import API_HOST, API_PORT, DEBUG_MODE, DROUGHT_THRESHOLD, FLOOD_THRESHOLD, HEAT_WAVE_THRESHOLD
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Initialize components
fetcher = DiCRADataFetcher()
forecaster = ClimateHazardForecaster()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'KisanSuraksha API'}), 200

@app.route('/api/v1/districts', methods=['GET'])
def get_districts():
    """Get list of Maharashtra districts."""
    try:
        districts = fetcher.get_districts()
        maharashtra_dists = [d for d in districts if d.get('state') == 'Maharashtra']
        return jsonify({'districts': maharashtra_dists}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/fetch-data', methods=['POST'])
def fetch_data():
    """Fetch data from DiCRA for training."""
    try:
        data = request.json
        parameters = data.get('parameters', ['soil_moisture_index', 'ndvi', 'rainfall', 'temperature'])
        start_date = data.get('start_date', '2020-01-01')
        end_date = data.get('end_date', '2024-12-31')
        
        df = fetcher.get_maharashtra_data(parameters, start_date, end_date)
        fetcher.save_data(df, 'maharashtra_climate_data.csv')
        
        return jsonify({
            'message': 'Data fetched successfully',
            'rows': len(df),
            'parameters': parameters
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/train', methods=['POST'])
def train_model():
    """Train forecasting models."""
    try:
        # Load data
        df = fetcher.load_data('maharashtra_climate_data.csv')
        if df is None:
            return jsonify({'error': 'Data not available. Run /fetch-data first.'}), 400
        
        # Train models
        success = forecaster.train_random_forest(df)
        if success:
            forecaster.save_model()
            return jsonify({
                'message': 'Models trained successfully',
                'metrics': forecaster.metrics
            }), 200
        else:
            return jsonify({'error': 'Training failed'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/forecast', methods=['POST'])
def forecast_hazards():
    """Get hazard forecasts for a district."""
    try:
        data = request.json
        district = data.get('district')
        date_range = data.get('date_range', 'next_30_days')
        
        # Load model if not already loaded
        if not forecaster.models:
            forecaster.load_model()
        
        if not forecaster.models:
            return jsonify({'error': 'Model not trained. Run /train first.'}), 400
        
        # Get recent data for the district
        df = fetcher.load_data('maharashtra_climate_data.csv')
        district_data = df[df['district'] == district].copy()
        
        if district_data.empty:
            return jsonify({'error': f'No data for district: {district}'}), 404
        
        # Prepare features for prediction
        features_df = forecaster.prepare_features(district_data)
        feature_cols = [col for col in features_df.columns 
                       if col not in ['district', 'date']]
        
        latest_features = features_df[feature_cols].iloc[-1:].values
        predictions = forecaster.predict_hazards(latest_features)
        
        # Generate crop advisory based on hazard scores
        drought_risk = predictions['drought']['risk_score'][0]
        flood_risk = predictions['flood']['risk_score'][0]
        heat_risk = predictions['heat_wave']['risk_score'][0]
        
        advisory = generate_crop_advisory(drought_risk, flood_risk, heat_risk)
        
        return jsonify({
            'district': district,
            'drought_risk': float(drought_risk),
            'flood_risk': float(flood_risk),
            'heat_wave_risk': float(heat_risk),
            'crop_advisory': advisory
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/insurance-trigger', methods=['POST'])
def check_insurance_trigger():
    """Check if automatic PMFBY insurance trigger is warranted."""
    try:
        data = request.json
        district = data.get('district')
        
        if not forecaster.models:
            forecaster.load_model()
        
        df = fetcher.load_data('maharashtra_climate_data.csv')
        district_data = df[df['district'] == district]
        
        features_df = forecaster.prepare_features(district_data)
        feature_cols = [col for col in features_df.columns 
                       if col not in ['district', 'date']]
        
        latest_features = features_df[feature_cols].iloc[-1:].values
        predictions = forecaster.predict_hazards(latest_features)
        
        drought_risk = predictions['drought']['risk_score'][0]
        flood_risk = predictions['flood']['risk_score'][0]
        
        trigger = drought_risk > DROUGHT_THRESHOLD or flood_risk > FLOOD_THRESHOLD
        
        return jsonify({
            'district': district,
            'trigger_insurance': trigger,
            'drought_risk': float(drought_risk),
            'flood_risk': float(flood_risk),
            'reason': f"Drought: {drought_risk:.2f}, Flood: {flood_risk:.2f}"
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/credit-risk', methods=['POST'])
def check_credit_risk():
    """Check NABARD credit risk flag for Kisan Credit Card lending."""
    try:
        data = request.json
        district = data.get('district')
        
        if not forecaster.models:
            forecaster.load_model()
        
        df = fetcher.load_data('maharashtra_climate_data.csv')
        district_data = df[df['district'] == district]
        
        features_df = forecaster.prepare_features(district_data)
        feature_cols = [col for col in features_df.columns 
                       if col not in ['district', 'date']]
        
        latest_features = features_df[feature_cols].iloc[-1:].values
        predictions = forecaster.predict_hazards(latest_features)
        
        max_risk = max(predictions['drought']['risk_score'][0],
                      predictions['flood']['risk_score'][0],
                      predictions['heat_wave']['risk_score'][0])
        
        risk_level = 'HIGH' if max_risk > 0.7 else 'MEDIUM' if max_risk > 0.5 else 'LOW'
        
        return jsonify({
            'district': district,
            'credit_risk_flag': risk_level,
            'max_hazard_risk': float(max_risk)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_crop_advisory(drought_risk, flood_risk, heat_risk):
    """Generate crop advisory based on hazard scores."""
    advisory = []
    
    if drought_risk > DROUGHT_THRESHOLD:
        advisory.append("DROUGHT WARNING: Use drought-resistant varieties. Increase irrigation frequency.")
    
    if flood_risk > FLOOD_THRESHOLD:
        advisory.append("FLOOD WARNING: Ensure drainage systems are clear. Avoid planting in low-lying areas.")
    
    if heat_risk > HEAT_WAVE_THRESHOLD:
        advisory.append("HEAT WAVE WARNING: Provide mulching. Increase soil moisture retention.")
    
    if not advisory:
        advisory.append("CONDITIONS FAVORABLE: Current hazard risks are low. Standard crop management recommended.")
    
    return " | ".join(advisory)

if __name__ == '__main__':
    app.run(host=API_HOST, port=API_PORT, debug=DEBUG_MODE)