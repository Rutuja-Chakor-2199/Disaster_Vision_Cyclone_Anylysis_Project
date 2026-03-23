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

function ChartsPanel() {
  // Dummy data (later backend se aayega)
  const data = [
    { time: "Day 1", windspeed: 80, pressure: 1000 },
    { time: "Day 2", windspeed: 100, pressure: 990 },
    { time: "Day 3", windspeed: 120, pressure: 980 },
    { time: "Day 4", windspeed: 140, pressure: 975 },
    { time: "Day 5", windspeed: 160, pressure: 970 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Cyclone Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* Background grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* Axes */}
          <XAxis dataKey="time" stroke="#374151" />
          <YAxis stroke="#374151" />

          {/* Tooltip & Legend */}
          <Tooltip
            contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }}
          />
          <Legend />

          {/* Windspeed Line */}
          <Line
            type="monotone"
            dataKey="windspeed"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          {/* Pressure Line */}
          <Line
            type="monotone"
            dataKey="pressure"
            stroke="#dc2626"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          {/* Gradient Area for Windspeed */}
          <defs>
            <linearGradient id="windspeedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="windspeed"
            stroke="none"
            fill="url(#windspeedGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartsPanel;
