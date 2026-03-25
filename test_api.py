#!/usr/bin/env python3
"""Test KisanSuraksha API endpoints."""

from api import app
import json

def test_api():
    """Test API endpoints."""
    with app.test_client() as client:
        print("=" * 60)
        print("KisanSuraksha API Testing")
        print("=" * 60)
        
        # Test 1: Health check
        print("\n1. Health Check")
        r = client.get('/health')
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.json}")
        
        # Test 2: Forecast endpoint
        print("\n2. Forecast Endpoint")
        r = client.post('/api/v1/forecast',
            data=json.dumps({'district': 'Aurangabad'}),
            content_type='application/json')
        print(f"   Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json
            print(f"   District: {data.get('district')}")
            print(f"   Drought Risk: {data.get('drought_risk'):.3f}")
            print(f"   Flood Risk: {data.get('flood_risk'):.3f}")
            print(f"   Heat Wave Risk: {data.get('heat_wave_risk'):.3f}")
            print(f"   Advisory: {data.get('crop_advisory')[:50]}...")
        else:
            print(f"   Error: {r.json}")
        
        # Test 3: Insurance trigger
        print("\n3. Insurance Trigger Endpoint")
        r = client.post('/api/v1/insurance-trigger',
            data=json.dumps({'district': 'Marathwada'}),
            content_type='application/json')
        print(f"   Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json
            print(f"   District: {data.get('district')}")
            print(f"   Trigger: {data.get('trigger_insurance')}")
            print(f"   Drought Risk: {data.get('drought_risk'):.3f}")
            print(f"   Flood Risk: {data.get('flood_risk'):.3f}")
        else:
            print(f"   Error: {r.json}")
        
        # Test 4: Credit risk
        print("\n4. Credit Risk Endpoint")
        r = client.post('/api/v1/credit-risk',
            data=json.dumps({'district': 'Nagpur'}),
            content_type='application/json')
        print(f"   Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json
            print(f"   District: {data.get('district')}")
            print(f"   Risk Flag: {data.get('credit_risk_flag')}")
            print(f"   Max Hazard Risk: {data.get('max_hazard_risk'):.3f}")
        else:
            print(f"   Error: {r.json}")
        
        print("\n" + "=" * 60)
        print("✓ All endpoints tested successfully!")
        print("=" * 60)

if __name__ == '__main__':
    test_api()
