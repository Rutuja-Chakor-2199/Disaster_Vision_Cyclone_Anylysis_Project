import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ChatbotFab from "./components/ChatbotFab";
import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import Safety from "./pages/Safety";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/safety" element={<Safety />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ChatbotFab />
    </Router>
  );
}

export default App;
