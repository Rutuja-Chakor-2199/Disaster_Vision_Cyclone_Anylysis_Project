from sqlalchemy import Column, Integer, Float, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    windspeed = Column(Float, nullable=False)
    pressure = Column(Float, nullable=False)
    predicted_risk = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(String(45))  # Store client IP for analytics
    
    def __repr__(self):
        return f"<Prediction(windspeed={self.windspeed}, pressure={self.pressure}, risk={self.predicted_risk})>"

class WeatherData(Base):
    __tablename__ = "weather_data"
    
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), nullable=False)
    temperature = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    pressure = Column(Float, nullable=False)
    description = Column(String(200), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<WeatherData(city={self.city}, temp={self.temperature})>"

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False)  # low, medium, high, critical
    region = Column(String(100), nullable=False)
    is_active = Column(String(10), default="true")  # true/false as string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    
    def __repr__(self):
        return f"<Alert(title={self.title}, severity={self.severity}, region={self.region})>"
