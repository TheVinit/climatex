import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, f1_score
import os
from config import MODEL_DIR, RANDOM_FOREST_PARAMS

class ClimateHazardForecaster:
    """Forecast drought, flood, and heat wave hazards using ML models."""
    
    def __init__(self):
        self.rf_model = None
        self.scaler = StandardScaler()
        self.models = {}
        self.metrics = {}
        os.makedirs(MODEL_DIR, exist_ok=True)
    
    def prepare_features(self, df):
        """Prepare features for model training."""
        # Pivot data to have parameters as columns
        pivot_df = df.pivot_table(
            index=['district', 'date'],
            columns='parameter',
            values='value',
            aggfunc='mean'
        ).reset_index()
        
        # Handle missing values
        pivot_df = pivot_df.ffill().bfill()
        
        return pivot_df
    
    def create_labels(self, df):
        """Create binary labels for drought, flood, heat wave."""
        labels = pd.DataFrame({
            'district': df['district'],
            'date': df['date']
        })
        
        # Define hazard thresholds (simplified logic)
        # In production, these should be based on actual climate indices
        moisture_col = 'soil_moisture_index' if 'soil_moisture_index' in df.columns else None
        rainfall_col = 'rainfall' if 'rainfall' in df.columns else None
        temp_col = 'temperature' if 'temperature' in df.columns else None
        
        # Drought: low soil moisture and NDVI, low rainfall
        labels['drought'] = 0
        if moisture_col and rainfall_col:
            labels.loc[
                (df[moisture_col] < df[moisture_col].quantile(0.25)) &
                (df[rainfall_col] < df[rainfall_col].quantile(0.25)),
                'drought'
            ] = 1
        
        # Flood: high rainfall
        labels['flood'] = 0
        if rainfall_col:
            labels.loc[df[rainfall_col] > df[rainfall_col].quantile(0.9), 'flood'] = 1
        
        # Heat Wave: high temperature
        labels['heat_wave'] = 0
        if temp_col:
            labels.loc[df[temp_col] > df[temp_col].quantile(0.9), 'heat_wave'] = 1
        
        return labels
    
    def train_random_forest(self, df):
        """Train Random Forest classifiers for each hazard type."""
        print("Training Random Forest models...")
        
        # Prepare features
        features_df = self.prepare_features(df)
        labels = self.create_labels(features_df)
        
        # Select numeric features
        feature_cols = [col for col in features_df.columns 
                       if col not in ['district', 'date']]
        
        if not feature_cols:
            print("Warning: No numeric features found")
            return False
        
        X = features_df[feature_cols].values
        X_scaled = self.scaler.fit_transform(X)
        
        # Train models for each hazard
        hazards = ['drought', 'flood', 'heat_wave']
        self.models = {}
        self.metrics = {}
        
        for hazard in hazards:
            y = labels[hazard].values
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y, test_size=0.2, random_state=42
            )
            
            # Train model
            model = RandomForestClassifier(**RANDOM_FOREST_PARAMS)
            model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test)
            f1 = f1_score(y_test, y_pred, zero_division=0)
            
            self.models[hazard] = model
            self.metrics[hazard] = {
                'f1_score': f1,
                'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
                'classification_report': classification_report(y_test, y_pred, output_dict=True)
            }
            
            print(f"{hazard.upper()} - F1 Score: {f1:.3f}")
        
        return True
    
    def predict_hazards(self, features):
        """Predict hazard risk scores for given features."""
        if not self.models:
            print("Error: Model not trained yet")
            return None
        
        X_scaled = self.scaler.transform(features)
        
        predictions = {}
        for hazard, model in self.models.items():
            # Get probability scores
            proba = model.predict_proba(X_scaled)
            predictions[hazard] = {
                'risk_score': proba[:, 1].tolist(),
                'prediction': model.predict(X_scaled).tolist()
            }
        
        return predictions
    
    def save_model(self, filename='hazard_model.pkl'):
        """Save trained models to disk."""
        import pickle
        filepath = os.path.join(MODEL_DIR, filename)
        with open(filepath, 'wb') as f:
            pickle.dump({'models': self.models, 'scaler': self.scaler}, f)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filename='hazard_model.pkl'):
        """Load trained models from disk."""
        import pickle
        filepath = os.path.join(MODEL_DIR, filename)
        if os.path.exists(filepath):
            with open(filepath, 'rb') as f:
                data = pickle.load(f)
            self.models = data['models']
            self.scaler = data['scaler']
            return True
        return False