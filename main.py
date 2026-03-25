#!/usr/bin/env python3
"""
KisanSuraksha - Climate Hazard Forecasting Pipeline
Automated end-to-end system for 36 Maharashtra districts
"""

import sys
import argparse
import os
from data_fetcher import DiCRADataFetcher
from forecaster import ClimateHazardForecaster
from api import app
from config import TRAIN_START_DATE, TRAIN_END_DATE, MAHARASHTRA_DISTRICTS, API_HOST, API_PORT

def run_full_pipeline():
    """Execute complete automated pipeline: fetch → train → visualize → serve."""
    print("\n" + "="*70)
    print("KISANSURAKSHA - AUTOMATED CLIMATE HAZARD FORECASTING PIPELINE")
    print("="*70)
    
    # Step 1: Fetch Data
    print("\n[1/4] Fetching Climate Data for 36 Maharashtra Districts...")
    fetcher = DiCRADataFetcher()
    parameters = ["soil_moisture_index", "ndvi", "rainfall", "temperature"]
    
    df = fetcher.get_maharashtra_data(parameters, TRAIN_START_DATE, TRAIN_END_DATE)
    fetcher.save_data(df, 'maharashtra_climate_data.csv')
    print(f"✓ Data: {len(df)} records across {df['district'].nunique()} districts")
    
    # Step 2: Train Models
    print("\n[2/4] Training Random Forest Models for 3 Hazards...")
    forecaster = ClimateHazardForecaster()
    success = forecaster.train_random_forest(df)
    
    if success:
        forecaster.save_model()
        print("✓ Models trained:")
        for hazard, metrics in forecaster.metrics.items():
            f1 = metrics['f1_score']
            print(f"  - {hazard.upper()}: F1 Score = {f1:.4f}")
    else:
        print("✗ Model training failed")
        return False
    
    # Step 3: Generate Performance Summary
    print("\n[3/4] Generating Performance Report...")
    print("\nModel Performance Summary:")
    print("-" * 50)
    for hazard, metrics in forecaster.metrics.items():
        print(f"\n{hazard.upper()}:")
        print(f"  F1 Score: {metrics['f1_score']:.4f}")
        cm = metrics['confusion_matrix']
        print(f"  Confusion Matrix: {cm}")
    print("-" * 50)
    
    # Step 4: API Ready
    print("\n[4/4] API Server Ready for Deployment")
    print(f"✓ Health endpoint: http://{API_HOST}:{API_PORT}/health")
    print(f"✓ Forecast endpoint: http://{API_HOST}:{API_PORT}/api/v1/forecast")
    print(f"✓ Insurance trigger: http://{API_HOST}:{API_PORT}/api/v1/insurance-trigger")
    print(f"✓ Credit risk: http://{API_HOST}:{API_PORT}/api/v1/credit-risk")
    
    print("\n" + "="*70)
    print("✓ PIPELINE COMPLETE!")
    print("="*70)
    print("\nSystem Features:")
    print("  • 36 Maharashtra districts covered")
    print("  • 3 hazard predictions: Drought, Flood, Heat Wave")
    print("  • 3 use cases: Crop Advisory, PMFBY Insurance, NABARD Credit Risk")
    print("  • Real-time predictions via REST API")
    print("  • Validation against historical drought years (2012, 2015, 2016, 2018)")
    print("\nReady to serve predictions!\n")
    
    return True

def fetch_data():
    """Fetch climate data from DiCRA."""
    print("Fetching climate data from DiCRA...")
    fetcher = DiCRADataFetcher()
    
    parameters = ["soil_moisture_index", "ndvi", "rainfall", "temperature"]
    df = fetcher.get_maharashtra_data(parameters, TRAIN_START_DATE, TRAIN_END_DATE)
    
    if len(df) > 0:
        fetcher.save_data(df, 'maharashtra_climate_data.csv')
        print(f"✓ Fetched {len(df)} records from DiCRA")
        return True
    else:
        print("✗ No data fetched")
        return False

def train_models():
    """Train forecasting models."""
    print("Training forecasting models...")
    fetcher = DiCRADataFetcher()
    forecaster = ClimateHazardForecaster()
    
    df = fetcher.load_data('maharashtra_climate_data.csv')
    if df is None:
        print("✗ Data not available. Run 'fetch' command first.")
        return False
    
    if forecaster.train_random_forest(df):
        forecaster.save_model()
        print(f"✓ Models trained successfully")
        print(f"Metrics: {forecaster.metrics}")
        return True
    else:
        print("✗ Training failed")
        return False

def run_api():
    """Start the Flask API server."""
    print(f"Starting KisanSuraksha API on {API_HOST}:{API_PORT}...")
    print(f"Documentation: http://{API_HOST}:{API_PORT}/health")
    app.run(host=API_HOST, port=API_PORT, debug=True)

def main():
    parser = argparse.ArgumentParser(
        description='KisanSuraksha - Climate Hazard Forecasting',
        formatter_class=argparse.RawTextHelpFormatter
    )
    
    parser.add_argument(
        'command',
        choices=['fetch', 'train', 'api', 'full', 'auto'],
        help='Command to execute',
        nargs='?',
        default='auto'
    )
    
    args = parser.parse_args()
    
    if args.command == 'fetch':
        fetch_data()
    elif args.command == 'train':
        train_models()
    elif args.command == 'api':
        run_api()
    elif args.command == 'full' or args.command == 'auto':
        # Automated end-to-end pipeline
        if run_full_pipeline():
            print("\nStarting API server...")
            run_api()

if __name__ == '__main__':
    main()