import joblib
import os

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "cyclone_model.pkl")
model = joblib.load(MODEL_PATH)

def predict_risk(windspeed: float, pressure: float) -> str:
    try:
        prediction = model.predict([[windspeed, pressure]])
        return prediction[0]
    except Exception as e:
        return f"Error: {e}"
