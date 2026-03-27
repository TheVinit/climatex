import pandas as pd
import requests
import json
import os
import time

# Configuration
DATA_DIR = "d:/ClimatX/ClimatX"
UID_FILE = f"{DATA_DIR}/backend/data/maharashtra_uids.json"
OUTPUT_FILE = f"{DATA_DIR}/backend/data/training_master.csv"

# Layer IDs for DiCRA
LAYER_RAINFALL = 163
LAYER_TEMP = 156
LAYER_NDVI = 19
REGION_ID = 3

def fetch_trend(dist_uid, layer_id):
    """Fetches yearly trend for a specific district and layer."""
    url = "https://dicra-api.centralindia.cloudapp.azure.com/api/v2/gettrend"
    payload = {
        "regionid": REGION_ID,
        "layerid": layer_id,
        "uid": dist_uid,
        "type": "yearly"
    }
    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data.get('data', [])
    except Exception as e:
        print(f"  [Error] Failed to fetch trend for {dist_uid} (Layer {layer_id}): {e}")
        return []

def ingest():
    print("🚀 Starting Data Ingestion Engine...")
    
    # 1. Load UIDs
    with open(UID_FILE, 'r') as f:
        uids = json.load(f)
    print(f"📍 Loaded {len(uids)} district mappings.")

    # 2. Load Local NDVI Data
    ndvi_df = pd.read_csv(f"{DATA_DIR}/india_ndvi_jan2020.csv")
    mha_ndvi = ndvi_df[ndvi_df['ADM1_NAME'] == 'Maharashtra'][['ADM2_NAME', 'mean']]
    mha_ndvi.rename(columns={'ADM2_NAME': 'District', 'mean': 'NDVI_Baseline'}, inplace=True)
    print(f"📊 Processed NDVI baselines for {len(mha_ndvi)} districts.")

    # 3. Load Soil Moisture Data
    moisture_df = pd.read_csv(f"{DATA_DIR}/moisture_full_data.csv")
    # Take latest SMI per district
    latest_smi = moisture_df.groupby('district')['avg_smlvl_at15cm'].mean().reset_index()
    latest_smi.rename(columns={'district': 'District', 'avg_smlvl_at15cm': 'Avg_Soil_Moisture'}, inplace=True)
    print(f"💧 Processed SMI trends for {len(latest_smi)} districts.")

    # 4. Fetch Live API Data (Rainfall & Temp)
    master_records = []
    
    for dist_name, dist_uid in uids.items():
        print(f"🔍 Fetching API trends for {dist_name} ({dist_uid})...")
        
        rain_trend = fetch_trend(dist_uid, LAYER_RAINFALL)
        temp_trend = fetch_trend(dist_uid, LAYER_TEMP)
        
        # Merge by year
        combined_years = {}
        for r in rain_trend:
            year = r.get('label')
            combined_years[year] = {'Year': year, 'Rainfall': r.get('value'), 'Temperature': None}
            
        for t in temp_trend:
            year = t.get('label')
            if year in combined_years:
                combined_years[year]['Temperature'] = t.get('value')
            else:
                combined_years[year] = {'Year': year, 'Rainfall': None, 'Temperature': t.get('value')}
        
        for year, data in combined_years.items():
            record = {
                'District': dist_name,
                'Year': data['Year'],
                'Rainfall': data['Rainfall'],
                'Temperature': data['Temperature']
            }
            master_records.append(record)
        
        time.sleep(0.5) # Be kind to the API

    api_df = pd.DataFrame(master_records)
    print(f"✅ Fetched {len(api_df)} records from DiCRA API.")

    # 5. Final Merge
    print("🔗 Merging all datasets...")
    final_df = api_df.merge(mha_ndvi, on='District', how='left')
    final_df = final_df.merge(latest_smi, on='District', how='left')

    # Fill NaNs with column means as a simple fallback
    final_df['NDVI_Baseline'] = final_df['NDVI_Baseline'].fillna(final_df['NDVI_Baseline'].mean())
    final_df['Avg_Soil_Moisture'] = final_df['Avg_Soil_Moisture'].fillna(final_df['Avg_Soil_Moisture'].mean())
    final_df['Rainfall'] = final_df['Rainfall'].fillna(final_df['Rainfall'].mean())
    final_df['Temperature'] = final_df['Temperature'].fillna(final_df['Temperature'].mean())

    # Save
    final_df.to_csv(OUTPUT_FILE, index=False)
    print(f"📦 Master Training Data saved to {OUTPUT_FILE}")
    print(final_df.head())

if __name__ == "__main__":
    ingest()
