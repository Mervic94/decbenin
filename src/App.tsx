
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestForm from "./pages/QuoteRequest";
import AgentDashboard from "./pages/AgentDashboard";
import CookiesPolicy from "@/pages/CookiesPolicy";
import AdminDashboard from "./pages/AdminDashboard";
import InternalMessages from "./pages/InternalMessages";
import Messages from "./pages/Messages";

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
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/internal-messages" element={<InternalMessages />} />
      <Route path="/messages" element={<Messages />} />
    </Routes>
  );
};

export default App;
