# ClimatXAgri - Climate Hazard Forecasting System

A production-ready climate risk intelligence platform for Maharashtra's agricultural ecosystem, built with modern web technologies and AI/ML models.

## 🌟 Features

### Multi-Stakeholder Platform
- **Farmers**: Crop advisory, risk alerts, and planting recommendations
- **Insurance Companies**: PMFBY trigger automation and claims processing
- **NABARD**: Dynamic KCC credit limits and risk assessment
- **Seed Suppliers**: Demand forecasting and supply chain optimization

### Advanced Analytics
- Real-time climate hazard prediction (Drought, Flood, Heat Wave)
- 15-year risk projections (2025-2040)
- District-level granularity across 36 Maharashtra districts
- Interactive maps and data visualizations

### Technical Excellence
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + ShadCN UI
- **Backend**: Python Flask + ML models (Random Forest + LSTM)
- **Data Sources**: DiCRA, IMD, Sentinel-2, PMFBY claims data
- **Production Ready**: Error boundaries, loading states, responsive design

## 🚀 Quick Start (Local Development)

### 1. Backend (Flask)
```bash
cd backend
py -m pip install -r requirements.txt
py api.py
```
*The API serves forecast data on port 5000.*

### 2. Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
*Access the dashboard at http://localhost:5173.*

## 📈 Current Project State
- **UI/UX**: Professional overhaul completed. Role-based entry (Farmer, NABARD, etc.) via `/`.
- **Analytics**: Year-slider (2030-2040) synchronized across all graphs.
- **ML Pipeline**: In-progress. Historical NDVI and SMI data processed. API ingestion script prepared (`backend/scripts/ingest_real_data.py`).


## 📁 Project Structure

```
ClimatXAgri/
├── agriguard-connect/          # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Role-based pages
│   │   │   ├── RoleSelector.tsx
│   │   │   ├── FarmerPage.tsx
│   │   │   ├── InsurerPage.tsx
│   │   │   ├── NabardPage.tsx
│   │   │   └── SupplierPage.tsx
│   │   ├── lib/               # Utilities and types
│   │   └── hooks/             # Custom React hooks
│   └── package.json
├── climateX/                  # Python Backend
│   ├── api.py                 # Flask REST API
│   ├── forecaster.py          # ML models
│   ├── data_fetcher.py        # Data ingestion
│   └── requirements.txt
└── README.md
```

## 🎯 User Roles & Features

### 👨‍🌾 Farmer Dashboard
- Real-time risk alerts and crop recommendations
- 15-year climate trend analysis
- Emergency contacts and market information
- Localized farming advice

### 🛡️ Insurance Dashboard
- PMFBY trigger monitoring and automation
- Claims processing workflow
- Payout analytics and risk assessment
- Parametric trigger metrics

### 🏦 NABARD Dashboard
- Dynamic KCC credit limit adjustments
- Portfolio risk assessment
- District-level credit ranking
- Stress buffer calculations

### 🌱 Supplier Dashboard
- Seed demand forecasting by crop variety
- Supply chain optimization
- Distribution planning
- Inventory management alerts

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern component architecture
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **ShadCN UI** - High-quality component library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **React Query** - Data fetching and caching

### Backend
- **Python 3.8+** - Core language
- **Flask** - REST API framework
- **Scikit-learn** - Machine learning models
- **TensorFlow/Keras** - Deep learning (LSTM)
- **Pandas** - Data processing
- **NumPy** - Numerical computing

### Data Sources
- **DiCRA** - District-level climate indicators
- **IMD** - Rainfall and weather data
- **Sentinel-2** - Satellite imagery (NDVI)
- **PMFBY** - Insurance claims data

## 🔧 Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
python main.py api   # Start Flask API
python main.py train # Train ML models
python main.py fetch # Fetch data from sources
```

### Environment Variables

Create `.env` files in respective directories:

**Backend (.env)**
```
DICRA_API_KEY=your_api_key
API_HOST=0.0.0.0
API_PORT=5000
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

## 📊 Data Model

### Core Entities
- **District**: 36 Maharashtra districts with geospatial data
- **Hazard**: Drought, Flood, Heat Wave predictions
- **Risk Level**: HIGH, MEDIUM, LOW classifications
- **Time Series**: 15-year projections (2025-2040)

### ML Models
- **Random Forest Classifier**: Initial hazard prediction
- **LSTM Network**: Temporal pattern recognition
- **Validation**: Historical accuracy against 2012, 2015, 2016, 2018 droughts

## 🚀 Deployment

### Production Build
```bash
# Frontend
npm run build

# Backend (using Gunicorn)
gunicorn -w 4 -b 0.0.0.0:5000 api:app
```

### Docker Support
```dockerfile
# Add Dockerfile configurations for containerized deployment
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DiCRA** for climate data infrastructure
- **Maharashtra Government** for district-level insights
- **NABARD** for agricultural finance framework
- **PMFBY** for insurance scheme data

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for Maharashtra's farming community**
