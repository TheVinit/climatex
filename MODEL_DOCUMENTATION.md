# KisanSuraksha Model Documentation

## 1. Overview
KisanSuraksha is an end-to-end climate hazard risk forecasting system for Maharashtra districts. It uses real DiCRA climate data and Optimized Random Forest models to support:
- Crop Advisory (farm guidance)
- PMFBY insurance trigger (drought/flood alerts)
- NABARD credit risk flagging

## 2. Data Source
- Primary: DiCRA API `/api/v2/getallregion`
- Parameters used:
  - `soil_moisture_index`
  - `ndvi`Not Found
The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.
  - `rainfall`
  - `temperature`
- Geographical scope: Maharashtra, 33-36 districts
- Historical range: 1990-01-01 to 2024-12-31
- Records: ~1,687,488

## 3. Project Structure
- `data/` — cached climate CSV.
- `models/` — saved model pickle files.
- `data_fetcher.py` — API ingest + region filters.
- `forecaster.py` — Random Forest pipeline.
- `train_optimized.py` — feature engineering + hyperparameter tuning.
- `api.py` — production REST endpoints.
- `web_app.py` — user interface + chart dashboard.
- `README_COMPLETE.md` — separate full readme.

## 4. Feature Engineering
- Pivot climate data by `district/date/parameter`.
- Forward/backfill missing values.
- Rolling and lag features (e.g., 7-day, 30-day) added in training script.
- Normalize via `StandardScaler`.

## 5. Label Logic (Auto hazard labels)
- Drought = low SMI & low rainfall (25th percentile). 
- Flood = top 10% rainfall.
- Heat wave = top 10% temperature.

## 6. Model Training
- `ClimateHazardForecaster.train_random_forest(df)` trains 3 classifiers:
  - drought
  - flood
  - heat_wave
- Hyperparams from `config.RANDOM_FOREST_PARAMS` (100 trees, max_depth 15).
- Uses `train_test_split(test_size=0.2)`.
- Stores metrics in `forecaster.metrics`.

## 7. Model Serialization
- `ClimateHazardForecaster.save_model()` ⇒ `models/hazard_model.pkl`.
- `load_model()` restores `self.models` and `self.scaler`.

## 8. REST API Endpoints (Implementations)
- `GET /api/v1/health`
- `GET /api/v1/districts`
- `POST /api/v1/fetch-data` (data ingestion)
- `POST /api/v1/train` (train + save)
- `POST /api/v1/forecast` (hazard + advisory)
- `POST /api/v1/insurance-trigger`
- `POST /api/v1/credit-risk`
- `POST /api/v1/forecast-horizon` (10-15 year trend)

## 9. Horizon Forecast Logic
- Loads historical district data from CSV.
- Uses yearly mean
  - soil moisture (drought proxy)
  - rainfall (flood proxy)
  - temperature (heat proxy)
- Linearly projects next 10-15 years and clamps risk.

## 10. Quick validation commands
1. `py validate.py`
2. `py train_optimized.py`
3. `py api.py` + new terminal `py web_app.py`
4. `py -c "import requests; print(requests.get('http://localhost:5000/api/v1/health').json())"`
5. `py -c "import requests, json; r=requests.post('http://localhost:5000/api/v1/forecast', json={'district':'Nashik'}); print(r.status_code, r.json())"`

## 11. Diagnosis pointers
- Ensure no conflicting process uses port 5000:
  `netstat -ano | findstr :5000`
- Kill stale Python if needed:
  `Get-Process python | Stop-Process -Force`

## 12. Important Notes
- `web_app.py` currently simulates `forecast`, `insurance-trigger`, `credit-risk` with deterministic random values for UI speed, but `api.py` has true model inference.
- Use district names exactly as in CSV e.g. `Nashik`, `Aurangabad`, `Akola`.
- Data-driven answer quality depends on training run completion.
