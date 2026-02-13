RailOps AI Command Center is an end-to-end AI application that predicts operational risk in real time and presents actionable insights through an enterprise dashboard.

The system demonstrates how machine learning can support safety-critical operations by transforming telemetry data into decision intelligence for operators.

This project focuses on production-style AI engineering — integrating model inference, APIs, visualization, and monitoring into a unified platform.

🎯 Key Features
🧠 AI & Prediction

Real-time risk prediction using ML model
Probability-based risk scoring
Configurable decision thresholds
AI recommendations based on predicted risk

📊 Operations Dashboard

Multi-region risk visualization
Track risk heatmap
Live incident feed
Streaming predictions console
Event replay timeline
KPI metrics panel

📡 System Monitoring

Backend telemetry monitoring
Health checks
Prediction activity tracking

⚙️ Backend Services

FastAPI inference service
REST endpoints for predictions
Modular model loading
Logging and error handling

🏗️ Architecture

Frontend (React Dashboard)
        ↓
Backend API (FastAPI)
        ↓
Machine Learning Model
        ↓
Prediction & Monitoring Layer

Data flows from input features → model inference → risk output → visualization → operator actions.

🛠️ Tech Stack

Backend

Python
FastAPI
Scikit-learn
Joblib

Frontend

React
Vite
TypeScript
Recharts
DevOps & Tooling

Git

Docker (optional)
MLOps foundations (versioning, monitoring)

🚀 Getting Started
Prerequisites
Python 3.9+
Node.js 18+
npm or yarn

Backend Setup
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8001

Backend will run at:
http://127.0.0.1:8001


Swagger docs:
http://127.0.0.1:8001/docs

Frontend Setup
cd frontend
npm install
npm run dev

Open:
http://localhost:5173

🧪 Using the System
Enter feature values in the prediction console
Click Predict Risk
View:
Risk classification
Confidence score
Alerts
Trend updates

Recommendations

📦 Project Structure
railops-risk/
├── backend/
│   ├── app/
│   └── models/
├── frontend/
│   └── src/
├── data/
├── docker-compose.yml
└── README.md

🧠 Motivation

Safety-critical industries such as rail, aviation, energy, and manufacturing require AI systems that are reliable, interpreable, and operationally actionable.
This project explores how AI can augment human decision-making in infrastructure environments where reliability matters.

🔮 Future Improvements

Model versioning and registry
Drift detection and monitoring
Streaming telemetry ingestion
Map-based visualization
Authentication and role-based access
Cloud deployment

📄 License
For educational and demonstration purposes.
