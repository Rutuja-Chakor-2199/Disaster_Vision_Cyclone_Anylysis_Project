from fastapi import FastAPI, HTTPException, Request
from app.api import predict, forecast, chatbot, weather, realtime
from app.config import settings
from app.utils.logger import setup_logging, logger
from app.utils.exceptions import (
    DisasterVisionException, 
    ExternalAPIException, 
    MLPredictionException,
    disaster_vision_exception_handler,
    validation_exception_handler,
    http_exception_handler
)
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.database import init_db

# Setup logging
setup_logging()

# Initialize database
init_db()

app = FastAPI(title="Cyclone Dashboard API 🚀")

# Exception handlers
app.add_exception_handler(DisasterVisionException, disaster_vision_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Routers
app.include_router(predict.router, prefix="/api", tags=["Prediction"])
app.include_router(forecast.router, prefix="/api", tags=["Forecast"])  # ✅ added
app.include_router(chatbot.router, prefix="/api", tags=["Chatbot"])
app.include_router(weather.router, prefix="/api", tags=["Weather"])
app.include_router(realtime.router, prefix="/api", tags=["Realtime"])

@app.get("/")
def root():
    """Health check endpoint"""
    logger.info("Health check accessed")
    return {"message": "Cyclone Dashboard Backend is running 🚀"}

@app.get("/forecast/{region}")
def get_forecast(region: str):
    """Get forecast data for a specific region"""
    try:
        # TODO: Replace with real data source
        return {
            "region": region,
            "cyclone_name": "Cyclone Fani",
            "confidence": 0.85,
            "predicted_path": [
                {"timestamp": "2023-09-26T00:00:00Z", "windspeed": 120, "pressure": 980},
                {"timestamp": "2023-09-27T00:00:00Z", "windspeed": 135, "pressure": 975},
                {"timestamp": "2023-09-28T00:00:00Z", "windspeed": 150, "pressure": 970},
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching forecast: {str(e)}")


@app.get("/api/safety")
def safety_tips():
    """Get safety tips for cyclone preparedness"""
    try:
        return {
            "tips": [
                "Stay indoors during cyclone 🚪",
                "Keep an emergency kit ready 🧰",
                "Charge your phone and powerbank 🔋",
                "Follow government alerts 📢"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching safety tips: {str(e)}")

