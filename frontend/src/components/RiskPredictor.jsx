import { useState } from "react";
import config from "../config";

function getRiskColorClass(prediction) {
  const normalized = String(prediction || "").toLowerCase();
  if (normalized.includes("high")) return "text-red-600";
  if (normalized.includes("medium")) return "text-yellow-600";
  return "text-green-600";
}

function RiskPredictor() {
  const [windspeed, setWindspeed] = useState("");
  const [pressure, setPressure] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    const wind = parseFloat(windspeed);
    const press = parseFloat(pressure);
    if (Number.isNaN(wind) || Number.isNaN(press)) {
      setError("Enter valid windspeed and pressure values.");
      return;
    }

    setError("");
    setPrediction(null);
    setLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ windspeed: wind, pressure: press }),
      });

      if (!res.ok) {
        throw new Error(`Prediction API error: ${res.status}`);
      }

      const data = await res.json();
      setPrediction(data.predicted_risk);
    } catch (err) {
      console.error("Error fetching prediction:", err);
      setError("Unable to fetch prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow text-center">
      <h3 className="text-lg font-bold">🤖 Cyclone Risk Predictor</h3>

      <div className="mt-3 space-y-2">
        <input
          type="number"
          placeholder="Enter Windspeed (km/h)"
          value={windspeed}
          onChange={(e) => setWindspeed(e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none text-black"
        />
        <input
          type="number"
          placeholder="Enter Pressure (hPa)"
          value={pressure}
          onChange={(e) => setPressure(e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none text-black"
        />
        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Predict Risk"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}

      {prediction && (
        <p className="mt-3 text-lg font-semibold">
          Predicted Risk:{" "}
          <span className={getRiskColorClass(prediction)}>
            {prediction}
          </span>
        </p>
      )}
    </div>
  );
}

export default RiskPredictor;
