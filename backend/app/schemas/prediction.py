from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PredictionCreate(BaseModel):
    windspeed: float = Field(..., gt=0, le=500)
    pressure: float = Field(..., gt=800, le=1100)
    predicted_risk: str
    ip_address: Optional[str] = None

class PredictionResponse(BaseModel):
    id: int
    windspeed: float
    pressure: float
    predicted_risk: str
    created_at: datetime
    ip_address: Optional[str] = None
    
    class Config:
        from_attributes = True

class WeatherDataCreate(BaseModel):
    city: str
    temperature: float
    wind_speed: float
    pressure: float
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class WeatherDataResponse(BaseModel):
    id: int
    city: str
    temperature: float
    wind_speed: float
    pressure: float
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class AlertCreate(BaseModel):
    title: str
    description: str
    severity: str = Field(..., regex="^(low|medium|high|critical)$")
    region: str
    is_active: bool = True
    expires_at: Optional[datetime] = None

class AlertResponse(BaseModel):
    id: int
    title: str
    description: str
    severity: str
    region: str
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
