import KpiCards from "../components/KpiCards";
import RiskSummaryCard from "../components/RiskSummaryCard";
import WeatherCard from "../components/WeatherCard";
import RiskPredictor from "../components/RiskPredictor"; // ✅ import
import MapView from "../components/MapView";
import ChartsPanel from "../components/ChartsPanel";
import AlertsFeed from "../components/AlertsFeed";

function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCards />
        <RiskSummaryCard />
        <WeatherCard />
        <RiskPredictor /> {/* ✅ Added here */}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MapView />
        <ChartsPanel />
      </div>

      {/* Alerts Section */}
      <AlertsFeed />
    </div>
  );
}

export default Dashboard;
