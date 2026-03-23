from fastapi import APIRouter
from app.core.ml_model import predict_risk

router = APIRouter()

dummy_data = {
    "Odisha": {
        "cyclone_name": "Cyclone Fani",
        "confidence": 0.85,
        "predicted_path": [
            {"timestamp": "2023-09-26", "windspeed": 120, "pressure": 980},
            {"timestamp": "2023-09-27", "windspeed": 135, "pressure": 975},
            {"timestamp": "2023-09-28", "windspeed": 150, "pressure": 970},
        ],
    },
    "Andhra Pradesh": {
        "cyclone_name": "Cyclone Vayu",
        "confidence": 0.78,
        "predicted_path": [
            {"timestamp": "2023-09-26", "windspeed": 100, "pressure": 985},
            {"timestamp": "2023-09-27", "windspeed": 115, "pressure": 978},
            {"timestamp": "2023-09-28", "windspeed": 130, "pressure": 974},
        ],
    },
}

@router.get("/forecast/{region}")
def get_forecast(region: str):
    if region in dummy_data:
        forecast = dummy_data[region]
        # add ML risk prediction for each step
        for step in forecast["predicted_path"]:
            step["predicted_risk"] = predict_risk(step["windspeed"], step["pressure"])
        return {"region": region, **forecast}
    else:
        return {"region": region, "cyclone_name": "No Cyclone", "confidence": 0, "predicted_path": []}
