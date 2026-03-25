# KisanSuraksha Deployment Guide

## Quick Start

### 1. Validate Environment
```bash
python validate.py
```

This checks:
- Python version (3.8+)
- All dependencies installed
- Project structure
- Module imports

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

For development with linting and testing:
```bash
pip install -r requirements-dev.txt
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your DiCRA API key
```

### 4. Fetch Climate Data
```bash
python main.py fetch
```

This will:
- Connect to DiCRA API
- Download climate data for all 36 Maharashtra districts
- Save data to `data/maharashtra_climate_data.csv`

### 5. Train Forecasting Models
```bash
python main.py train
```

This will:
- Load climate data
- Prepare features for training
- Train Random Forest classifiers for drought, flood, heat wave
- Save models to `models/hazard_model.pkl`
- Display F1 scores and confusion matrices

### 6. Start API Server
```bash
python api.py
```

The API will be available at: `http://localhost:5000`

## API Endpoints Reference

### Health Check
```bash
curl http://localhost:5000/health
```

### Fetch Districts
```bash
curl http://localhost:5000/api/v1/districts
```

### Fetch Data from DiCRA
```bash
curl -X POST http://localhost:5000/api/v1/fetch-data \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": ["soil_moisture_index", "ndvi", "rainfall", "temperature"],
    "start_date": "2020-01-01",
    "end_date": "2024-12-31"
  }'
```

### Train Models
```bash
curl -X POST http://localhost:5000/api/v1/train
```

### Get Hazard Forecast
```bash
curl -X POST http://localhost:5000/api/v1/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "district": "Aurangabad",
    "date_range": "next_30_days"
  }'
```

Response:
```json
{
  "district": "Aurangabad",
  "drought_risk": 0.45,
  "flood_risk": 0.32,
  "heat_wave_risk": 0.68,
  "crop_advisory": "HEAT WAVE WARNING: Provide mulching. Increase soil moisture retention."
}
```

### Check Insurance Trigger
```bash
curl -X POST http://localhost:5000/api/v1/insurance-trigger \
  -H "Content-Type: application/json" \
  -d '{"district": "Marathwada"}'
```

Response:
```json
{
  "district": "Marathwada",
  "trigger_insurance": true,
  "drought_risk": 0.82,
  "flood_risk": 0.45,
  "reason": "Drought: 0.82, Flood: 0.45"
}
```

### Check Credit Risk
```bash
curl -X POST http://localhost:5000/api/v1/credit-risk \
  -H "Content-Type: application/json" \
  -d '{"district": "Aurangabad"}'
```

Response:
```json
{
  "district": "Aurangabad",
  "credit_risk_flag": "MEDIUM",
  "max_hazard_risk": 0.68
}
```

## VS Code Integration

### Run Tasks
Press `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac) to see available tasks:

- **Install Dependencies** - Install required packages
- **Fetch DiCRA Data** - Run data fetching
- **Train Models** - Train ML models
- **Run API Server** - Start Flask server
- **Run Full Pipeline** - Complete workflow
- **Lint Code** - Check code quality
- **Format Code** - Auto-format Python

### Debug Configurations
1. Select debug config from Run menu (Ctrl+Shift+D)
2. Available configs:
   - **Python: Current File** - Debug active file
   - **Python: Main Script** - Debug main.py
   - **Python: Validation** - Debug validate.py
   - **Flask: API Server** - Debug Flask app

## Troubleshooting

### Import Errors
If you get import errors, ensure all dependencies are installed:
```bash
pip install -r requirements.txt --upgrade
```

### DiCRA API Connection Issues
1. Check your internet connection
2. Verify API key in .env file
3. Check DiCRA API status at dicra.nabard.org
4. Look for error messages in Flask logs

### Model Training Failures
1. Ensure data has been fetched: `python main.py fetch`
2. Check CSV file exists: `data/maharashtra_climate_data.csv`
3. Verify CSV has necessary columns
4. Check console output for specific errors

### Port Already in Use
If port 5000 is busy, modify in config.py:
```python
API_PORT = 5001  # Change to different port
```

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api:app
```

### Using Docker
Create a `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "api:app"]
```

Build and run:
```bash
docker build -t kisansuraksha .
docker run -p 5000:5000 kisansuraksha
```

### Environment Variables for Production
```bash
export FLASK_ENV=production
export DEBUG_MODE=False
export DICRA_API_KEY=your_production_key
```

## Monitoring Model Performance

Check trained model metrics:
```python
from forecaster import ClimateHazardForecaster
forecaster = ClimateHazardForecaster()
forecaster.load_model()
print(forecaster.metrics)
```

## Data Updates

To refresh models with new data:
```bash
python main.py fetch  # Get latest data
python main.py train  # Retrain models
```

## Support

For issues or questions:
- Check error messages in console output
- Review API response status codes
- Verify all required files exist
- Check .env configuration
- Run validation script: `python validate.py`