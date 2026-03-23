from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.services.weather_service import weather_service
from app.utils.logger import logger
from typing import List, Dict
import asyncio

router = APIRouter()

@router.get("/realtime/weather/{city}")
async def get_realtime_weather(city: str):
    """Get real-time weather data for a city"""
    try:
        lat, lon = await weather_service.get_coordinates(city)
        weather_data = await weather_service.get_current_weather(lat, lon)
        return weather_data
    except Exception as e:
        logger.error("Error fetching realtime weather", error=str(e), city=city)
        raise HTTPException(status_code=500, detail="Error fetching weather data")

@router.get("/realtime/forecast/{city}")
async def get_realtime_forecast(city: str, days: int = 5):
    """Get real-time forecast data for a city"""
    try:
        lat, lon = await weather_service.get_coordinates(city)
        forecast_data = await weather_service.get_forecast(lat, lon, days)
        return {
            "city": city,
            "latitude": lat,
            "longitude": lon,
            "forecast": forecast_data
        }
    except Exception as e:
        logger.error("Error fetching realtime forecast", error=str(e), city=city)
        raise HTTPException(status_code=500, detail="Error fetching forecast data")

@router.get("/realtime/cyclone-risk")
async def get_cyclone_risk_areas():
    """Get areas with potential cyclone risk"""
    try:
        risk_areas = await weather_service.get_cyclone_risk_areas()
        return {
            "risk_areas": risk_areas,
            "total_areas": len(risk_areas),
            "timestamp": "2023-09-26T00:00:00Z"
        }
    except Exception as e:
        logger.error("Error fetching cyclone risk areas", error=str(e))
        raise HTTPException(status_code=500, detail="Error fetching risk data")

@router.get("/realtime/dashboard")
async def get_dashboard_data():
    """Get comprehensive dashboard data"""
    try:
        # Get risk areas
        risk_areas_task = weather_service.get_cyclone_risk_areas()
        
        # Get weather for major cities (can be expanded)
        major_cities = ["New York", "Los Angeles", "Miami", "Houston", "Chicago"]
        weather_tasks = []
        
        for city in major_cities:
            try:
                lat, lon = await weather_service.get_coordinates(city)
                weather_tasks.append(weather_service.get_current_weather(lat, lon))
            except:
                continue  # Skip cities that can't be found
        
        # Execute all tasks concurrently
        risk_areas = await risk_areas_task
        weather_data = await asyncio.gather(*weather_tasks, return_exceptions=True)
        
        # Filter out exceptions from weather data
        valid_weather = [w for w in weather_data if not isinstance(w, Exception)]
        
        return {
            "risk_areas": risk_areas,
            "weather_data": valid_weather,
            "summary": {
                "high_risk_areas": len([a for a in risk_areas if a.get("risk_level") in ["high", "critical"]]),
                "total_cities_monitored": len(valid_weather),
                "last_updated": "2023-09-26T00:00:00Z"
            }
        }
        
    except Exception as e:
        logger.error("Error fetching dashboard data", error=str(e))
        raise HTTPException(status_code=500, detail="Error fetching dashboard data")
