from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, Field, validator
from sqlalchemy.orm import Session
from app.core.ml_model import predict_risk
from app.utils.logger import log_ml_prediction, logger
from app.utils.exceptions import MLPredictionException, ValidationException
from app.database import get_db
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionResponse

router = APIRouter()

class CycloneInput(BaseModel):
    windspeed: float = Field(..., gt=0, le=500, description="Wind speed in km/h")
    pressure: float = Field(..., gt=800, le=1100, description="Atmospheric pressure in hPa")
    
    @validator('windspeed')
    def validate_windspeed(cls, v):
        if v <= 0 or v > 500:
            raise ValueError('Wind speed must be between 0 and 500 km/h')
        return v
    
    @validator('pressure')
    def validate_pressure(cls, v):
        if v <= 800 or v > 1100:
            raise ValueError('Pressure must be between 800 and 1100 hPa')
        return v

@router.post("/predict")
def get_prediction(data: CycloneInput, request: Request, db: Session = Depends(get_db)):
    """Predict cyclone risk based on wind speed and pressure"""
    try:
        # Get client IP for analytics
        client_ip = request.client.host
        
        logger.info("Prediction request received", windspeed=data.windspeed, pressure=data.pressure, ip=client_ip)
        
        risk = predict_risk(data.windspeed, data.pressure)
        
        if "Error:" in risk:
            raise MLPredictionException(risk)
        
        # Save prediction to database
        prediction = Prediction(
            windspeed=data.windspeed,
            pressure=data.pressure,
            predicted_risk=risk,
            ip_address=client_ip
        )
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        
        log_ml_prediction(data.windspeed, data.pressure, risk)
        
        return {
            "windspeed": data.windspeed, 
            "pressure": data.pressure, 
            "predicted_risk": risk,
            "timestamp": prediction.created_at.isoformat(),
            "prediction_id": prediction.id
        }
    except (MLPredictionException, ValidationException):
        raise
    except Exception as e:
        db.rollback()
        logger.error("Unexpected error in prediction", error=str(e))
        raise MLPredictionException(f"Unexpected error: {str(e)}")

@router.get("/predictions", response_model=list[PredictionResponse])
def get_predictions(db: Session = Depends(get_db), limit: int = 100):
    """Get recent predictions"""
    try:
        predictions = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(limit).all()
        return predictions
    except Exception as e:
        logger.error("Error fetching predictions", error=str(e))
        raise HTTPException(status_code=500, detail="Error fetching predictions")
