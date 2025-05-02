import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestForm from "./pages/RequestForm";
import AgentDashboard from "./pages/AgentDashboard";
import CookiesPolicy from "@/pages/CookiesPolicy";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/request" element={<RequestForm />} />
      <Route path="/agent-dashboard" element={<AgentDashboard />} />
      <Route path="/cookies-policy" element={<CookiesPolicy />} />
    </Routes>
  );
};

export default App;
