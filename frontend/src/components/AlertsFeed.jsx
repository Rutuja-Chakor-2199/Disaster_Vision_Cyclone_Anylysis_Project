import { useEffect, useState } from "react";

const severityColors = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-400 text-gray-900",
  Low: "bg-green-500 text-white",
};

function AlertsFeed() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Dummy alerts, backend se bhi laa sakte ho
    setAlerts([
      {
        message: "Cyclone Fani approaching Odisha",
        severity: "High",
        time: "2023-09-26 10:00",
      },
      {
        message: "Heavy rainfall warning in coastal areas",
        severity: "Medium",
        time: "2023-09-25 18:00",
      },
      {
        message: "Fishermen advised not to venture into sea",
        severity: "Low",
        time: "2023-09-25 08:00",
      },
    ]);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-gray-100">
        📢 Recent Alerts
      </h2>
      <div className="space-y-4">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition"
          >
            <div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {alert.message}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {alert.time}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${severityColors[alert.severity]}`}
            >
              {alert.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertsFeed;
