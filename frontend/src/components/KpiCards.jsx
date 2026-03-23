import { useEffect, useState } from "react";
import config from "../config";

function KpiCards() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchKpis() {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/forecast/Odisha`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`KPI API error: ${res.status}`);
        }

        const payload = await res.json();
        setData(payload);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching KPI data:", err);
        setError("Could not load KPIs");
      }
    }

    fetchKpis();
    return () => controller.abort();
  }, []);

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!data) return <p className="p-4 text-gray-600">Loading KPIs...</p>;

  const path = Array.isArray(data.predicted_path) ? data.predicted_path : [];
  if (path.length === 0) {
    return <p className="p-4 text-gray-600">No KPI data available.</p>;
  }

  const avgWind =
    path.reduce((sum, step) => sum + step.windspeed, 0) / path.length;

  const highRiskCount = path.filter((step) =>
    String(step.predicted_risk || "").toLowerCase().includes("high")
  ).length;

  return (
    <>
      <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-lg shadow text-center">
        <h3 className="text-lg font-bold">Cyclone</h3>
        <p>{data.cyclone_name}</p>
      </div>

      <div className="p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow text-center">
        <h3 className="text-lg font-bold">Avg Windspeed</h3>
        <p>{avgWind.toFixed(1)} km/h</p>
      </div>

      <div className="p-4 bg-red-100 dark:bg-red-800 rounded-lg shadow text-center">
        <h3 className="text-lg font-bold">High Risk Points</h3>
        <p>{highRiskCount}</p>
      </div>

      <div className="p-4 bg-yellow-100 dark:bg-yellow-700 rounded-lg shadow text-center">
        <h3 className="text-lg font-bold">Confidence</h3>
        <p>{(data.confidence * 100).toFixed(0)}%</p>
      </div>
    </>
  );
}

export default KpiCards;
