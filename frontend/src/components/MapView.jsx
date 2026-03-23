import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import config from "../config";

const riskColors = {
  Low: "green",
  Medium: "orange",
  High: "red",
};

// Cyclone animated icon 🌪️
const cycloneIcon = L.divIcon({
  className: "cyclone-icon",
  html: `<span style="font-size:28px;">🌪️</span>`,
});

const CYCLONE_PATH = [
  [20.3, 86.9],
  [20.5, 86.5],
  [20.7, 86.2],
];

function MapView() {
  const [forecast, setForecast] = useState(null);
  const [positionIndex, setPositionIndex] = useState(0);
  const [error, setError] = useState("");

  // ✅ Backend se forecast fetch
  useEffect(() => {
    const controller = new AbortController();

    async function fetchForecast() {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/forecast/Odisha`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Map forecast API error: ${res.status}`);
        }

        const data = await res.json();
        setForecast(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error loading forecast:", err);
        setError("Unable to load cyclone map.");
      }
    }

    fetchForecast();
    return () => controller.abort();
  }, []);

  // Dummy Lat/Lon points for demo cyclone path
  // ✅ Animate cyclone marker along the path
  useEffect(() => {
    if (!forecast) return;
    const interval = setInterval(() => {
      setPositionIndex((prev) => (prev + 1) % CYCLONE_PATH.length);
    }, 2000); // move every 2 seconds
    return () => clearInterval(interval);
  }, [forecast]);

  const getRiskMeta = (risk) => {
    const normalized = String(risk || "").toLowerCase();
    if (normalized.includes("high")) return { label: "High", color: riskColors.High };
    if (normalized.includes("medium")) return { label: "Medium", color: riskColors.Medium };
    return { label: "Low", color: riskColors.Low };
  };

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!forecast || !forecast.predicted_path) {
    return <p>Loading map...</p>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="font-bold mb-3 text-gray-900 dark:text-gray-100">
        🌪 Cyclone Path (Live Animation)
      </h2>
      <MapContainer
        center={[20.3, 86.9]}
        zoom={6}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* ✅ Polyline for cyclone path */}
        <Polyline positions={CYCLONE_PATH} color="red" weight={3} dashArray="10,6" />

        {/* ✅ Static risk markers */}
        {forecast.predicted_path.map((step, idx) => {
          const latlng = CYCLONE_PATH[idx] || CYCLONE_PATH[0]; // fallback agar path chhota ho
          const riskMeta = getRiskMeta(step.predicted_risk);
          return (
            <Marker
              key={idx}
              position={latlng}
              icon={L.divIcon({
                className: "risk-icon",
                html: `<span style="color:${riskMeta.color}; font-size:22px;">●</span>`,
              })}
            >
              <Popup>
                <strong>Timestamp:</strong> {step.timestamp} <br />
                <strong>Windspeed:</strong> {step.windspeed} km/h <br />
                <strong>Pressure:</strong> {step.pressure} hPa <br />
                <strong>Risk:</strong>{" "}
                <span style={{ color: riskMeta.color }}>{riskMeta.label}</span>
              </Popup>
            </Marker>
          );
        })}

        {/* ✅ Moving cyclone icon */}
        <Marker position={CYCLONE_PATH[positionIndex]} icon={cycloneIcon}>
          <Popup>🌪️ Cyclone moving...</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;
