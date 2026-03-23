from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.prediction import WeatherData
from app.schemas.prediction import WeatherDataResponse, WeatherDataCreate
from app.utils.logger import logger
from app.config import settings
import requests
from typing import Optional

router = APIRouter()

@router.post("/weather", response_model=WeatherDataResponse)
def save_weather_data(weather: WeatherDataCreate, db: Session = Depends(get_db)):
    """Save weather data to database"""
    try:
        db_weather = WeatherData(**weather.dict())
        db.add(db_weather)
        db.commit()
        db.refresh(db_weather)
        
        logger.info("Weather data saved", city=weather.city, temp=weather.temperature)
        return db_weather
    except Exception as e:
        db.rollback()
        logger.error("Error saving weather data", error=str(e))
        raise HTTPException(status_code=500, detail="Error saving weather data")

@router.get("/weather/{city}", response_model=WeatherDataResponse)
def get_weather_by_city(city: str, db: Session = Depends(get_db)):
    """Get latest weather data for a city"""
    try:
        weather = db.query(WeatherData).filter(
            WeatherData.city.ilike(f"%{city}%")
        ).order_by(WeatherData.created_at.desc()).first()
        
        if not weather:
            raise HTTPException(status_code=404, detail=f"Weather data for {city} not found")
        
        return weather
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error fetching weather data", error=str(e), city=city)
        raise HTTPException(status_code=500, detail="Error fetching weather data")

@router.get("/weather", response_model=list[WeatherDataResponse])
def get_all_weather_data(limit: int = 100, db: Session = Depends(get_db)):
    """Get all weather data"""
    try:
        weather_data = db.query(WeatherData).order_by(
            WeatherData.created_at.desc()
        ).limit(limit).all()
        return weather_data
    except Exception as e:
        logger.error("Error fetching weather data", error=str(e))
        raise HTTPException(status_code=500, detail="Error fetching weather data")

@router.post("/weather/fetch/{city}")
async def fetch_weather_from_api(city: str, db: Session = Depends(get_db)):
    """Fetch weather data from OpenWeather API and save to database"""
    if not settings.OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeather API key not configured")
    
    try:
        # Get coordinates for the city
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={settings.OPENWEATHER_API_KEY}"
        geo_response = requests.get(geo_url)
        geo_response.raise_for_status()
        geo_data = geo_response.json()
        
        if not geo_data:
            raise HTTPException(status_code=404, detail=f"City {city} not found")
        
        lat, lon = geo_data[0]['lat'], geo_data[0]['lon']
        
        # Get weather data
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={settings.OPENWEATHER_API_KEY}"
        weather_response = requests.get(weather_url)
        weather_response.raise_for_status()
        weather_data = weather_response.json()
        
        # Save to database
        weather_record = WeatherDataCreate(
            city=weather_data['name'],
            temperature=weather_data['main']['temp'],
            wind_speed=weather_data['wind']['speed'],
            pressure=weather_data['main']['pressure'],
            description=weather_data['weather'][0]['description'],
            latitude=lat,
            longitude=lon
        )
        
        db_weather = WeatherData(**weather_record.dict())
        db.add(db_weather)
        db.commit()
        db.refresh(db_weather)
        
        logger.info("Weather data fetched and saved", city=city, temp=weather_record.temperature)
        return db_weather
        
    except requests.RequestException as e:
        logger.error("External API error", error=str(e), city=city)
        raise HTTPException(status_code=503, detail="Error fetching weather data from external API")
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Error in weather fetch", error=str(e), city=city)
        raise HTTPException(status_code=500, detail="Error processing weather data")
