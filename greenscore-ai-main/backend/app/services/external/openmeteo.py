import httpx
from typing import Dict, Any

class OpenMeteoAdapter:
    def __init__(self):
        self.base_url = "https://api.open-meteo.com/v1/forecast"

    async def get_lucknow_weather(self, lat: float = 26.8467, lon: float = 80.9462) -> Dict[str, Any]:
        try:
            params = {
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code",
                "timezone": "Asia/Kolkata"
            }
            async with httpx.AsyncClient(timeout=4.0) as client:
                resp = await client.get(self.base_url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    current = data.get("current", {})
                    return {
                        "is_live": True,
                        "source": "Open-Meteo API",
                        "temperature_c": current.get("temperature_2m", 31.5),
                        "humidity_pct": current.get("relative_humidity_2m", 58.0),
                        "precipitation_mm": current.get("precipitation", 0.0),
                        "wind_speed_kmh": current.get("wind_speed_10m", 8.2),
                        "condition": "Partly Cloudy" if current.get("weather_code", 0) <= 3 else "Hazy"
                    }
        except Exception:
            pass

        return {
            "is_live": False,
            "source": "Demo Dataset (Seasonal Averages)",
            "temperature_c": 31.0,
            "humidity_pct": 60.0,
            "precipitation_mm": 0.0,
            "wind_speed_kmh": 7.5,
            "condition": "Hazy Sunshine"
        }

openmeteo_client = OpenMeteoAdapter()
