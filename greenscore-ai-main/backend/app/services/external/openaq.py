import httpx
from typing import Dict, Any, Optional
from app.core.config import settings

class OpenAQAdapter:
    def __init__(self):
        self.api_key = settings.OPENAQ_API_KEY
        self.base_url = "https://api.openaq.org/v3"

    async def fetch_latest_sensor_data(self, location_id: str = "2178") -> Dict[str, Any]:
        """
        Fetches live OpenAQ particulate concentrations. Falls back smoothly if unavailable.
        """
        if self.api_key and len(self.api_key) > 5 and not self.api_key.startswith("YOUR"):
            try:
                headers = {"X-API-Key": self.api_key}
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(f"{self.base_url}/locations/{location_id}", headers=headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        results = data.get("results", {})
                        return {
                            "is_live": True,
                            "source": "OpenAQ API v3 (Station 2178)",
                            "data": results
                        }
            except Exception:
                pass

        # Graceful fallback demo metrics
        return {
            "is_live": False,
            "source": "Demo Dataset (Lucknow Station Baseline)",
            "data": {
                "pm25": 48.2,
                "pm10": 112.5,
                "no2": 34.0,
                "so2": 12.8,
                "co": 1.1,
                "o3": 26.4,
                "aqi": 118.0
            }
        }

openaq_client = OpenAQAdapter()
