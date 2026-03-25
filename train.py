#!/usr/bin/env python3
"""
KISANSURAKSHA - AUTOMATED TRAINING PIPELINE
Complete end-to-end system with all datasets and visualizations
"""

import os
import sys
from data_fetcher import DiCRADataFetcher
from forecaster import ClimateHazardForecaster
from visualizer import ModelVisualizer, generate_summary_dashboard
from config import TRAIN_START_DATE, TRAIN_END_DATE

def main():
    print("\n" + "="*70)
    print("KISANSURAKSHA - AUTOMATED CLIMATE HAZARD FORECASTING")
    print("="*70)
    print(f"Start Time: {__import__('datetime').datetime.now()}\n")
    
    # STEP 1: FETCH REAL DATA FROM DICRA API
    print("[1/4] FETCHING CLIMATE DATA FROM DICRA")
    print("-" * 70)
    
    fetcher = DiCRADataFetcher()
    parameters = ["soil_moisture_index", "ndvi", "rainfall", "temperature"]
    
    print(f"Time Range: {TRAIN_START_DATE} to {TRAIN_END_DATE}")
    print(f"Parameters: {', '.join(parameters)}")
    print(f"Target: 36 Maharashtra Districts\n")
    
    try:
        df = fetcher.get_maharashtra_data(parameters, TRAIN_START_DATE, TRAIN_END_DATE)
    except Exception as e:
        print(f"\n{str(e)}\n")
        print("="*70)
        print("CANNOT CONTINUE: SYSTEM REQUIRES REAL DATA")
        print("="*70)
        return False
    
    if len(df) == 0:
        print("\n❌ ERROR: No data retrieved from API")
        return False
    
    fetcher.save_data(df, 'maharashtra_climate_data.csv')
    
    print(f"✓ Fetched {len(df):,} real data records")
    print(f"✓ Districts: {df['district'].nunique()}")
    print(f"✓ Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"✓ Data saved to: data/maharashtra_climate_data.csv\n")
    
    # STEP 2: TRAIN MODELS
    print("[2/4] TRAINING RANDOM FOREST MODELS")
    print("-" * 70)
    
    forecaster = ClimateHazardForecaster()
    
    print("Training models for 3 hazards:")
    print("  • Drought Detection")
    print("  • Flood Detection")
    print("  • Heat Wave Detection\n")
    
    success = forecaster.train_random_forest(df)
    
    if not success:
        print("✗ ERROR: Model training failed")
        return False
    
    forecaster.save_model()
    
    print("✓ Models trained successfully!\n")
    print("Model Performance (F1 Scores):")
    print("-" * 50)
    for hazard, metrics in forecaster.metrics.items():
        f1_score = metrics['f1_score']
        cm = metrics['confusion_matrix']
        precision = metrics['classification_report']['1']['precision']
        recall = metrics['classification_report']['1']['recall']
        
        print(f"\n{hazard.upper()}:")
        print(f"  F1 Score:        {f1_score:.4f}")
        print(f"  Precision:       {precision:.4f}")
        print(f"  Recall:          {recall:.4f}")
        print(f"  Confusion Matrix: {cm}")
    
    print("\n✓ Models saved to: models/hazard_model.pkl\n")
    
    # STEP 3: GENERATE VISUALIZATIONS
    print("[3/4] GENERATING VISUALIZATIONS")
    print("-" * 70)
    
    visualizer = ModelVisualizer(df, forecaster)
    viz_dir = visualizer.generate_all_visualizations()
    visualizer.generate_performance_report()
    
    print(f"✓ Visualizations saved to: {viz_dir}/")
    print("  • 01_parameter_heatmap.png")
    print("  • 02_hazard_scores_by_district.png")
    print("  • 03_parameter_distributions.png")
    print("  • 04_temporal_trends.png")
    print("  • PERFORMANCE_REPORT.txt\n")
    
    # STEP 4: SUMMARY & DEPLOYMENT
    print("[4/4] SYSTEM READY FOR DEPLOYMENT")
    print("-" * 70)
    
    generate_summary_dashboard()
    
    print("\nDEPLOYMENT INSTRUCTIONS:")
    print("-" * 70)
    print("\n1. Start API Server:")
    print("   py api.py")
    print("\n2. Test Health Endpoint:")
    print("   curl http://localhost:5000/health")
    print("\n3. Get Forecast:")
    print("   curl -X POST http://localhost:5000/api/v1/forecast \\")
    print("     -H 'Content-Type: application/json' \\")
    print("     -d '{\"district\": \"Aurangabad\"}'")
    print("\n4. Check Insurance Trigger:")
    print("   curl -X POST http://localhost:5000/api/v1/insurance-trigger \\")
    print("     -H 'Content-Type: application/json' \\")
    print("     -d '{\"district\": \"Marathwada\"}'")
    print("\n5. Check Credit Risk:")
    print("   curl -X POST http://localhost:5000/api/v1/credit-risk \\")
    print("     -H 'Content-Type: application/json' \\")
    print("     -d '{\"district\": \"Nagpur\"}'")
    
    print("\n" + "="*70)
    print("✓ AUTOMATED PIPELINE COMPLETE - ALL SYSTEMS GO!")
    print("="*70)
    print(f"End Time: {__import__('datetime').datetime.now()}\n")
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
