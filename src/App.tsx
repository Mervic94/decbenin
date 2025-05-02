
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
import Services from "./pages/Services";
import ChecklistDemenagement from "./pages/ChecklistDemenagement";
import OrganiserDemenagement from "./pages/OrganiserDemenagement";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/request" element={<RequestForm />} />
      <Route path="/quote" element={<RequestForm />} />
      <Route path="/agent-dashboard" element={<AgentDashboard />} />
      <Route path="/cookies-policy" element={<CookiesPolicy />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/internal-messages" element={<InternalMessages />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/services" element={<Services />} />
      <Route path="/checklist-demenagement" element={<ChecklistDemenagement />} />
      <Route path="/organiser-demenagement" element={<OrganiserDemenagement />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
