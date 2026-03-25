#!/usr/bin/env python3
"""
KISANSURAKSHA - COMPLETE SYSTEM SETUP & DEPLOYMENT
Run this script to set up the entire application with optimized models and web UI
"""

import subprocess
import sys
import time
from datetime import datetime

def print_banner(text):
    print("\n" + "="*80)
    print(f"  {text}")
    print("="*80)

def run_command(cmd, description):
    """Run a command and report status"""
    print(f"\n▶️  {description}")
    print("-" * 80)
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=False)
        if result.returncode == 0:
            print(f"✓ {description} - SUCCESS")
            return True
        else:
            print(f"✗ {description} - FAILED")
            return False
    except Exception as e:
        print(f"✗ {description} - ERROR: {e}")
        return False

def main():
    print_banner("🌾 KISANSURAKSHA - COMPLETE SYSTEM DEPLOYMENT")
    print(f"Start Time: {datetime.now()}")
    
    steps = [
        ("py train_optimized.py", "Step 1: Train Optimized ML Models (with hyperparameter tuning)"),
    ]
    
    success = True
    for cmd, desc in steps:
        if not run_command(cmd, desc):
            success = False
            print(f"\n⚠️  Continuing despite error...")
    
    if success:
        print_banner("✓ SYSTEM SETUP COMPLETE - READY FOR DEPLOYMENT")
        
        print("\n📊 KISANSURAKSHA SYSTEM CONFIGURATION:")
        print("""
        ✓ ML Models: Optimized Random Forest Classifiers
        ✓ Districts: 36 Maharashtra (All covered)
        ✓ Hazards: Drought, Flood, Heat Wave
        ✓ Use Cases: 3 (Crop Advisory, Insurance, Credit Risk)
        ✓ Data Source: DiCRA API (Real climate data)
        ✓ Historical Validation: 2012, 2015, 2016, 2018
        ✓ Feature Engineering: Temporal lags + seasonal patterns
        ✓ Hyperparameter Optimization: GridSearchCV enabled
        ✓ Model Validation: 5-fold cross-validation
        """)
        
        print("\n🚀 NEXT STEPS:")
        print("""
        1️⃣  Start the Web Dashboard:
            py web_app.py
        
        2️⃣  Open your browser:
            http://localhost:5000
        
        3️⃣  Use the three decision-ready tools:
            • Crop Advisory: Get seasonal farming recommendations
            • Insurance Trigger: Auto-detect PMFBY insurance events
            • Credit Risk: Assess lending risk for farmers
        
        4️⃣  REST API Endpoints (for integration):
            POST /api/v1/forecast - Get hazard scores
            POST /api/v1/insurance-trigger - Check insurance
            POST /api/v1/credit-risk - Assess credit
            GET  /api/v1/health - System status
        """)
        
        print("\n" + "="*80)
        print(f"✓ End Time: {datetime.now()}")
        print("="*80)
        
    else:
        print_banner("⚠️  SETUP COMPLETED WITH ISSUES")

if __name__ == '__main__':
    main()
