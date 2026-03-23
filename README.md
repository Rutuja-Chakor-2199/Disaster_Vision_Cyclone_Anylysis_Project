# Cyclone Disaster Vision

Full-stack cyclone monitoring dashboard with:
- ML-based cyclone risk prediction
- Forecast visualization (charts + map path)
- Live weather card using browser geolocation + OpenWeather API
- Safety tips endpoint and in-app chatbot assistant

## Project Structure

```text
Disaster_Vision/
|- backend/
|  |- app/
|  |  |- main.py
|  |  |- api/
|  |  |  |- predict.py
|  |  |  |- forecast.py
|  |  |  `- chatbot.py
|  |  `- core/
|  |     |- ml_model.py
|  |     |- train_model.py
|  |     `- cyclone_model.pkl
|  `- requirements.txt
`- frontend/
   |- src/
   |  |- pages/
   |  |- components/
   |  `- App.js
   `- package.json
```

## Tech Stack

- Frontend: React (Create React App), Tailwind CSS, React Router, React Leaflet, Recharts
- Backend: FastAPI, Uvicorn, Pydantic
- ML: scikit-learn RandomForest model loaded via `joblib`

## Features

- Dashboard with KPI cards, risk summary, weather card, risk predictor, map view, chart panel, and alerts feed
- Forecast page with time-series chart for windspeed and pressure
- Safety page backed by API (`/api/safety`)
- Rule-based chatbot (`/api/chat`) available as floating widget on every page
- Risk prediction endpoint (`/api/predict`) powered by pre-trained model

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm

## Local Setup

### 1) Clone

```bash
git clone <your-repo-url>
cd Disaster_Vision
```

### 2) Backend (FastAPI)

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

- Windows (PowerShell):

```bash
venv\Scripts\Activate.ps1
```

- Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
pip install scikit-learn joblib pandas
```

Run backend:

```bash
python -m uvicorn app.main:app --reload
```

Backend will run at `http://127.0.0.1:8000`.

### 3) Frontend (React)

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will run at `http://localhost:3000`.

## API Endpoints

Base URL: `http://127.0.0.1:8000`

1. `GET /`
   - Health check

2. `POST /api/predict`
   - Body:
   ```json
   {
     "windspeed": 120,
     "pressure": 980
   }
   ```
   - Response includes `predicted_risk`

3. `GET /api/forecast/{region}`
   - Example: `/api/forecast/Odisha`
   - Returns cyclone name, confidence, predicted path, and per-step risk labels

4. `POST /api/chat`
   - Body:
   ```json
   {
     "message": "What are cyclone safety tips?"
   }
   ```
   - Returns chatbot reply

5. `GET /api/safety`
   - Returns list of safety tips

6. `GET /forecast/{region}`
   - Legacy duplicate route available in `main.py`

## Quick API Test (curl)

```bash
curl -X POST "http://127.0.0.1:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d "{\"windspeed\":130,\"pressure\":975}"
```

```bash
curl "http://127.0.0.1:8000/api/forecast/Odisha"
```

```bash
curl -X POST "http://127.0.0.1:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"hello\"}"
```

## Model Training

Training script: `backend/app/core/train_model.py`

If you want to retrain locally:

```bash
cd backend/app/core
python train_model.py
```

This writes `cyclone_model.pkl` in the current folder.

## Configuration Notes

- Weather card currently contains a hardcoded OpenWeather API key in `frontend/src/components/WeatherCard.jsx`.
- Replace the `API_KEY` value with your own key before production use.
- Frontend currently calls backend using hardcoded `http://127.0.0.1:8000` URLs.

## Known Limitations

- Forecast data and map path are currently dummy/static demo data.
- Alerts, profile, and team pages use static content.
- Chatbot is rule-based; it is not connected to OpenAI/HuggingFace/Ollama in current code.
- Backend `requirements.txt` does not include all ML dependencies used by the project, so install extra packages listed above.

## Suggested Next Improvements

1. Move secrets/API keys to environment variables.
2. Add `.env` support and configurable backend URL for frontend.
3. Replace dummy forecast/alerts with live data source.
4. Add unit/integration tests for API routes and React components.
5. Containerize with Docker and add CI checks.
"# Disaster_Vision_Cyclone_Anylysis_Project" 
