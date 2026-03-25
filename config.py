import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
DICRA_API_BASE_URL = "https://dicra-api.centralindia.cloudapp.azure.com/api/v2/"
DICRA_API_SECONDARY_URL = "https://dicra-api.centralindia.cloudapp.azure.com/"  # Secondary endpoint
DICRA_API_KEY = os.getenv("DICRA_API_KEY", "")

# Data Configuration
DATA_DIR = "data"
MODEL_DIR = "models"
CACHE_DIR = "cache"

# Model Configuration
RANDOM_FOREST_PARAMS = {
    "n_estimators": 100,
    "max_depth": 15,
    "random_state": 42,
    "n_jobs": -1
}

LSTM_PARAMS = {
    "units": 64,
    "epochs": 50,
    "batch_size": 32,
    "validation_split": 0.2
}

# Thresholds for Risk Scoring
DROUGHT_THRESHOLD = 0.7
FLOOD_THRESHOLD = 0.6
HEAT_WAVE_THRESHOLD = 0.75

# Maharashtra Districts (36 districts)
MAHARASHTRA_DISTRICTS = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad",
    "Beed", "Bhandara", "Buldhana",
    "Chandrapur", "Dhule",
    "Gadchiroli", "Gondia", "Hingoli",
    "Jalgaon", "Jalna", "Jhalawar",
    "Kolhapur",
    "Latur",
    "Madhya Pradesh", "Nagpur", "Nanded", "Nashik",
    "Navi Mumbai", "Nozari",
    "Osmanabd",
    "Parbhani", "Pimpri-Chinchwad", "Pune",
    "Raigad", "Ratnagiri",
    "Sambhajinagar", "Sangli", "Satara", "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Yavatmal"
]

# Historical Validation Years
VALIDATION_YEARS = [2012, 2015, 2016, 2018]

# Date Range for Training
TRAIN_START_DATE = "1990-01-01"
TRAIN_END_DATE = "2024-12-31"

# API Server Configuration
API_HOST = "0.0.0.0"
API_PORT = 5000
DEBUG_MODE = os.getenv("DEBUG_MODE", "False") == "True"