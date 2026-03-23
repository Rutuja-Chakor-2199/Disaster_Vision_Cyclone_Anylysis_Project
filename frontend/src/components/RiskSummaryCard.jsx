import { useEffect, useState } from "react";
import config from "../config";

function getRiskColor(risk) {
  const normalized = String(risk || "").toLowerCase();
  if (normalized.includes("high")) return "text-red-600";
  if (normalized.includes("medium")) return "text-yellow-600";
  return "text-green-600";
}

function RiskSummaryCard() {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRiskSummary() {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/forecast/Odisha`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Risk summary API error: ${res.status}`);
        }

        const payload = await res.json();
        setForecast(payload);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching risk summary:", err);
        setError("Unable to load risk summary");
      }
    }

    fetchRiskSummary();
    return () => controller.abort();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!forecast) return <p className="text-gray-600">Loading risk summary...</p>;

  const path = Array.isArray(forecast.predicted_path) ? forecast.predicted_path : [];
  const lastStep = path[path.length - 1];
  const predictedRisk = lastStep?.predicted_risk || "Unknown";
  const confidence = Math.round((forecast.confidence || 0) * 100);

  return (
    <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-lg shadow text-center">
      <h3 className="text-lg font-bold">⚠️ Upcoming Cyclone Risk</h3>
      <p className="mt-2 font-semibold">{forecast.cyclone_name}</p>
      <p className="mt-1">Confidence: {confidence}%</p>
      <p className="mt-1">
        Predicted Risk: <span className={getRiskColor(predictedRisk)}>{predictedRisk}</span>
      </p>
    </div>
  );
}

export default RiskSummaryCard;
