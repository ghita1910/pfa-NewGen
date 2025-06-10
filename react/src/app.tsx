import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import ClientsPage from "./pages/admin/ClientsPage";
import PrestatairesPage from "./pages/admin/PrestatairesPage";
import DemandePresta from "./pages/admin/DemandePresta";
import RequireAdminAuth from "./components/RequireAdminAuth"; // ✅ import du garde
import SettingsPage from "./pages/admin/SettingsPage";
import HelpCenterPage from "./pages/admin/HelpCenterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/home" element={<RequireAdminAuth><AdminHome /></RequireAdminAuth>} />
        <Route path="/admin/clients" element={<RequireAdminAuth><ClientsPage /></RequireAdminAuth>} />
        <Route path="/admin/prestataires" element={<RequireAdminAuth><PrestatairesPage /></RequireAdminAuth>} />
        
        <Route path="/admin/demandes" element={<RequireAdminAuth>< DemandePresta/></RequireAdminAuth>} />
        <Route path="/admin/settings" element={<RequireAdminAuth><SettingsPage /></RequireAdminAuth>} />
        <Route path="/admin/help" element={<RequireAdminAuth><HelpCenterPage /></RequireAdminAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
