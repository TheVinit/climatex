import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

class ModelVisualizer:
    """Generate district-wise visualizations and performance reports."""
    
    def __init__(self, df, forecaster):
        self.df = df
        self.forecaster = forecaster
        self.viz_dir = 'visualizations'
        os.makedirs(self.viz_dir, exist_ok=True)
        sns.set_style("whitegrid")
        plt.rcParams['figure.figsize'] = (14, 6)
    
    def generate_all_visualizations(self):
        """Generate all district-wise visualizations."""
        print("Generating visualizations...")
        
        self._plot_parameter_heatmap()
        self._plot_district_hazard_scores()
        self._plot_parameter_distributions()
        self._plot_temporal_trends()
        
        return self.viz_dir
    
    def _plot_parameter_heatmap(self):
        """Create heatmap of climate parameters by district."""
        pivot = self.df.pivot_table(
            index='district',
            columns='parameter',
            values='value',
            aggfunc='mean'
        )
        
        plt.figure(figsize=(10, 10))
        sns.heatmap(pivot, annot=True, fmt='.2f', cmap='RdYlGn', cbar_kws={'label': 'Mean Value'})
        plt.title('Climate Parameters by District (Mean Values)', fontsize=14, fontweight='bold')
        plt.ylabel('District')
        plt.xlabel('Climate Parameter')
        plt.tight_layout()
        plt.savefig(f'{self.viz_dir}/01_parameter_heatmap.png', dpi=300)
        plt.close()
        print(f"  ✓ Parameter heatmap saved")
    
    def _plot_district_hazard_scores(self):
        """Plot hazard risk scores for each district."""
        districts = sorted(self.df['district'].unique())
        
        drought_scores = []
        flood_scores = []
        heat_scores = []
        
        for district in districts:
            district_data = self.df[self.df['district'] == district]
            features = self._prepare_district_features(district_data)
            
            if features is not None:
                predictions = self.forecaster.predict_hazards(features)
                drought_scores.append(predictions['drought']['risk_score'][0])
                flood_scores.append(predictions['flood']['risk_score'][0])
                heat_scores.append(predictions['heat_wave']['risk_score'][0])
            else:
                drought_scores.append(0)
                flood_scores.append(0)
                heat_scores.append(0)
        
        x = np.arange(len(districts))
        width = 0.25
        
        fig, ax = plt.subplots(figsize=(16, 6))
        ax.bar(x - width, drought_scores, width, label='Drought', color='#FF6B6B')
        ax.bar(x, flood_scores, width, label='Flood', color='#4ECDC4')
        ax.bar(x + width, heat_scores, width, label='Heat Wave', color='#FFE66D')
        
        ax.set_xlabel('District')
        ax.set_ylabel('Risk Score')
        ax.set_title('Hazard Risk Scores by District', fontsize=14, fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels(districts, rotation=45, ha='right')
        ax.legend()
        ax.set_ylim(0, 1)
        ax.axhline(y=0.7, color='red', linestyle='--', alpha=0.3, label='High Risk Threshold')
        
        plt.tight_layout()
        plt.savefig(f'{self.viz_dir}/02_hazard_scores_by_district.png', dpi=300)
        plt.close()
        print(f"  ✓ Hazard scores by district saved")
    
    def _plot_parameter_distributions(self):
        """Plot distributions of climate parameters."""
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        
        parameters = ['soil_moisture_index', 'ndvi', 'rainfall', 'temperature']
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFE66D']
        
        for idx, (param, color) in enumerate(zip(parameters, colors)):
            ax = axes[idx//2, idx%2]
            param_data = self.df[self.df['parameter'] == param]['value']
            
            ax.hist(param_data, bins=50, color=color, alpha=0.7, edgecolor='black')
            ax.set_title(f'Distribution of {param.replace("_", " ").title()}', fontweight='bold')
            ax.set_xlabel('Value')
            ax.set_ylabel('Frequency')
            ax.grid(alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(f'{self.viz_dir}/03_parameter_distributions.png', dpi=300)
        plt.close()
        print(f"  ✓ Parameter distributions saved")
    
    def _plot_temporal_trends(self):
        """Plot temporal trends for each parameter by district."""
        fig, axes = plt.subplots(2, 2, figsize=(16, 10))
        
        parameters = ['soil_moisture_index', 'ndvi', 'rainfall', 'temperature']
        sample_districts = sorted(self.df['district'].unique())[:3]  # Top 3 for clarity
        
        for idx, param in enumerate(parameters):
            ax = axes[idx//2, idx%2]
            
            for district in sample_districts:
                district_param = self.df[(self.df['district'] == district) & 
                                        (self.df['parameter'] == param)].sort_values('date')
                if len(district_param) > 0:
                    ax.plot(range(len(district_param)), district_param['value'], 
                           label=district, alpha=0.7, linewidth=2)
            
            ax.set_title(f'Temporal Trend: {param.replace("_", " ").title()}', fontweight='bold')
            ax.set_xlabel('Time Period')
            ax.set_ylabel('Value')
            ax.legend()
            ax.grid(alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(f'{self.viz_dir}/04_temporal_trends.png', dpi=300)
        plt.close()
        print(f"  ✓ Temporal trends saved")
    
    def _prepare_district_features(self, district_data):
        """Prepare features for a single district."""
        pivot = district_data.pivot_table(
            index='date',
            columns='parameter',
            values='value',
            aggfunc='mean'
        ).ffill().bfill()
        
        if len(pivot) == 0 or pivot.isna().all().all():
            return None
        
        feature_cols = [col for col in pivot.columns if col in 
                       ['soil_moisture_index', 'ndvi', 'rainfall', 'temperature']]
        
        if len(feature_cols) == 0:
            return None
        
        return pivot[feature_cols].iloc[-1:].values
    
    def generate_performance_report(self):
        """Generate comprehensive performance report."""
        report_path = f'{self.viz_dir}/PERFORMANCE_REPORT.txt'
        
        with open(report_path, 'w') as f:
            f.write("="*70 + "\n")
            f.write("KISANSURAKSHA - MODEL PERFORMANCE REPORT\n")
            f.write("="*70 + "\n\n")
            
            f.write("SYSTEM OVERVIEW\n")
            f.write("-"*70 + "\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Training Data: {len(self.df)} records\n")
            f.write(f"Districts Covered: {self.df['district'].nunique()}\n")
            f.write(f"Climate Parameters: {self.df['parameter'].nunique()}\n\n")
            
            f.write("MODEL PERFORMANCE - F1 SCORES\n")
            f.write("-"*70 + "\n")
            for hazard, metrics in self.forecaster.metrics.items():
                f1_score = metrics['f1_score']
                cm = metrics['confusion_matrix']
                f.write(f"\n{hazard.upper()}:\n")
                f.write(f"  F1 Score: {f1_score:.4f}\n")
                f.write(f"  Confusion Matrix: {cm}\n")
            
            f.write("\n" + "="*70 + "\n")
            f.write("USE CASES\n")
            f.write("="*70 + "\n")
            f.write("1. CROP ADVISORY\n")
            f.write("   - Real-time hazard forecasts for farmers\n")
            f.write("   - Endpoints: /api/v1/forecast\n")
            f.write("   - Returns: Drought, Flood, Heat Wave risk scores + advisory\n\n")
            f.write("2. PMFBY INSURANCE TRIGGER\n")
            f.write("   - Automatic insurance activation based on risk threshold\n")
            f.write("   - Endpoints: /api/v1/insurance-trigger\n")
            f.write("   - Drought Threshold: 0.7, Flood Threshold: 0.6\n\n")
            f.write("3. NABARD CREDIT RISK\n")
            f.write("   - District-level credit risk assessment\n")
            f.write("   - Endpoints: /api/v1/credit-risk\n")
            f.write("   - Risk Levels: HIGH (>0.7), MEDIUM (0.5-0.7), LOW (<0.5)\n\n")
            
            f.write("="*70 + "\n")
            f.write("VALIDATION\n")
            f.write("="*70 + "\n")
            f.write("Historical Drought Years: 2012, 2015, 2016, 2018\n")
            f.write("Marathwada Region Focus: Aurangabad, Marathwada, Parbhani\n\n")
            
            f.write("="*70 + "\n")
            f.write("DATA SOURCES\n")
            f.write("="*70 + "\n")
            f.write("• DiCRA API (dicra.nabard.org)\n")
            f.write("• IMD Gridded Rainfall Data (imdpune.gov.in)\n")
            f.write("• Sentinel-2 NDVI (Google Earth Engine)\n")
            f.write("• PMFBY Claims Data (pmfby.gov.in)\n\n")
        
        print(f"✓ Performance report saved: {report_path}")


def generate_summary_dashboard():
    """Generate a summary dashboard of system performance."""
    print("\n" + "="*70)
    print("KISANSURAKSHA DASHBOARD SUMMARY")
    print("="*70)
    print("\nKey Metrics:")
    print("  • Districts Covered: 36 Maharashtra")
    print("  • Hazards Predicted: Drought, Flood, Heat Wave")
    print("  • Use Cases: 3 (Crop Advisory, PMFBY Trigger, Credit Risk)")
    print("  • API Endpoints: 5 REST endpoints")
    print("  • Model Type: Random Forest Classifier")
    print("  • Features: Soil Moisture, NDVI, Rainfall, Temperature")
    print("\nValidation:")
    print("  • Historical Drought Years: 2012, 2015, 2016, 2018")
    print("  • Primary Focus: Marathwada Region")
    print("\nViz Export:")
    print("  • Location: visualizations/")
    print("  • Files: Heatmaps, Risk Scores, Distributions, Trends")
    print("="*70 + "\n")
