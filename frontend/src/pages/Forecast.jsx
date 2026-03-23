import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import config from "../config";

const REGIONS = ["Odisha", "Andhra Pradesh"];

function formatDateLabel(timestamp) {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return timestamp;
  return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function Forecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [region, setRegion] = useState("Odisha");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchForecast() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${config.API_BASE_URL}/api/forecast/${encodeURIComponent(region)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`Forecast API error: ${res.status}`);
        }

        const data = await res.json();
        setForecast(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching forecast:", err);
        setError("Unable to load forecast right now. Please try again.");
        setForecast(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchForecast();
    return () => controller.abort();
  }, [region]);

  const path = Array.isArray(forecast?.predicted_path) ? forecast.predicted_path : [];
  const hasData = path.length > 0;
  const confidence = Math.round((forecast?.confidence || 0) * 100);
  const chartData = path.map((step) => ({
    ...step,
    label: formatDateLabel(step.timestamp),
  }));
  const peakWind = hasData ? Math.max(...path.map((step) => step.windspeed)) : 0;
  const lowestPressure = hasData ? Math.min(...path.map((step) => step.pressure)) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cyclone Forecast</h1>
            <p className="mt-1 text-sm text-gray-600">
              Track windspeed and pressure trends for exposed coastal regions.
            </p>
          </div>

          <label className="text-sm font-medium text-gray-700">
            Region
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="ml-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {REGIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
            Loading forecast...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && !hasData && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700">
            No active cyclone forecast available for {region}.
          </div>
        )}

        {!loading && !error && hasData && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Cyclone</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{forecast.cyclone_name}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{confidence}%</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Peak Wind / Lowest Pressure</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {peakWind} km/h / {lowestPressure} hPa
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Cyclone path trend for {forecast.region}
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }} />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="windspeed"
                    name="Windspeed (km/h)"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="pressure"
                    name="Pressure (hPa)"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                  <defs>
                    <linearGradient id="windspeedFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="windspeed"
                    stroke="none"
                    fill="url(#windspeedFill)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Forecast;
