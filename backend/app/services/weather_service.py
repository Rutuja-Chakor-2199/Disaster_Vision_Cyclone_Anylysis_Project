import requests
import asyncio
from typing import Dict, Optional, List
from datetime import datetime, timedelta
from app.config import settings
from app.utils.logger import logger
from app.utils.exceptions import ExternalAPIException

class WeatherService:
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.geo_url = "http://api.openweathermap.org/geo/1.0"
        
    async def get_current_weather(self, lat: float, lon: float) -> Dict:
        """Get current weather for coordinates"""
        if not self.api_key:
            raise ExternalAPIException("OpenWeather", "API key not configured")
            
        try:
            url = f"{self.base_url}/weather"
            params = {
                "lat": lat,
                "lon": lon,
                "units": "metric",
                "appid": self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            logger.info("Weather data fetched", lat=lat, lon=lon, city=data.get("name"))
            
            return {
                "city": data["name"],
                "temperature": data["main"]["temp"],
                "wind_speed": data["wind"]["speed"],
                "pressure": data["main"]["pressure"],
                "description": data["weather"][0]["description"],
                "humidity": data["main"]["humidity"],
                "latitude": lat,
                "longitude": lon,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except requests.RequestException as e:
            logger.error("Weather API error", error=str(e), lat=lat, lon=lon)
            raise ExternalAPIException("OpenWeather", str(e))
        except KeyError as e:
            logger.error("Invalid weather data format", error=str(e))
            raise ExternalAPIException("OpenWeather", f"Invalid data format: {str(e)}")
    
    async def get_forecast(self, lat: float, lon: float, days: int = 5) -> List[Dict]:
        """Get weather forecast for coordinates"""
        if not self.api_key:
            raise ExternalAPIException("OpenWeather", "API key not configured")
            
        try:
            url = f"{self.base_url}/forecast"
            params = {
                "lat": lat,
                "lon": lon,
                "units": "metric",
                "appid": self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Process forecast data (3-hour intervals)
            forecast_data = []
            for item in data["list"][:days * 8]:  # 8 forecasts per day (3-hour intervals)
                forecast_data.append({
                    "timestamp": item["dt_txt"],
                    "temperature": item["main"]["temp"],
                    "wind_speed": item["wind"]["speed"],
                    "pressure": item["main"]["pressure"],
                    "description": item["weather"][0]["description"],
                    "humidity": item["main"]["humidity"]
                })
            
            logger.info("Forecast data fetched", lat=lat, lon=lon, days=days, count=len(forecast_data))
            return forecast_data
            
        except requests.RequestException as e:
            logger.error("Forecast API error", error=str(e), lat=lat, lon=lon)
            raise ExternalAPIException("OpenWeather", str(e))
        except KeyError as e:
            logger.error("Invalid forecast data format", error=str(e))
            raise ExternalAPIException("OpenWeather", f"Invalid data format: {str(e)}")
    
    async def get_coordinates(self, city: str) -> tuple[float, float]:
        """Get coordinates for a city name"""
        if not self.api_key:
            raise ExternalAPIException("OpenWeather", "API key not configured")
            
        try:
            url = f"{self.geo_url}/direct"
            params = {
                "q": city,
                "limit": 1,
                "appid": self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            if not data:
                raise ExternalAPIException("OpenWeather", f"City '{city}' not found")
            
            return data[0]["lat"], data[0]["lon"]
            
        except requests.RequestException as e:
            logger.error("Geocoding API error", error=str(e), city=city)
            raise ExternalAPIException("OpenWeather", str(e))
    
    async def get_cyclone_risk_areas(self) -> List[Dict]:
        """Get areas with potential cyclone risk based on weather conditions"""
        # This is a simplified implementation
        # In production, you'd use specialized meteorological APIs
        
        risk_areas = []
        
        # Example: Check major coastal cities for cyclone conditions
        coastal_cities = [
            {"name": "Miami", "lat": 25.7617, "lon": -80.1918},
            {"name": "New Orleans", "lat": 29.9511, "lon": -90.0715},
            {"name": "Houston", "lat": 29.7604, "lon": -95.3698},
            {"name": "Tampa", "lat": 27.9506, "lon": -82.4572},
        ]
        
        for city in coastal_cities:
            try:
                weather = await self.get_current_weather(city["lat"], city["lon"])
                
                # Simple risk assessment based on wind speed and pressure
                wind_speed = weather["wind_speed"]
                pressure = weather["pressure"]
                
                risk_level = "low"
                if wind_speed > 20 or pressure < 1000:
                    risk_level = "medium"
                if wind_speed > 30 or pressure < 990:
                    risk_level = "high"
                if wind_speed > 40 or pressure < 980:
                    risk_level = "critical"
                
                if risk_level != "low":
                    risk_areas.append({
                        "city": city["name"],
                        "latitude": city["lat"],
                        "longitude": city["lon"],
                        "risk_level": risk_level,
                        "wind_speed": wind_speed,
                        "pressure": pressure,
                        "timestamp": weather["timestamp"]
                    })
                    
            except Exception as e:
                logger.warning("Failed to assess risk for city", city=city["name"], error=str(e))
                continue
        
        logger.info("Cyclone risk assessment completed", risk_areas_count=len(risk_areas))
        return risk_areas

# Global weather service instance
weather_service = WeatherService()
