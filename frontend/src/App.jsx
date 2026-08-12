import { Routes, Route } from "react-router-dom";

import UserSelection from "./pages/UserSelection";
import History from "./pages/History";
import PublicLayout from "./layouts/PublicLayout";
import ReportIssue from "./pages/ReportIssue";
import PublicHome from "./pages/PublicHome";
import Notices from "./pages/Notices";
import Track from "./pages/Track";
import OfficeLayout from "./layouts/OfficeLayout";
import NagarPalikaMap from "./pages/NagarPalikaMap";
import OfficeNotice from "./pages/OfficeNotice";
import OfficerInfo from "./pages/Officer";
import Login from "./pages/Login";
import Combo from "./pages/combo";
import Verifyer from "./pages/Verifyer";
import TempOffice from "./pages/tempOffice";
import Authe from "./pages/Authe";


import "./i18n";
import "./App.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<UserSelection />} />
      <Route path="login" element={<Login />} />


      {/* Public pages */}
      <Route path="/public" element={<PublicLayout />}>
        <Route path="signIn" element={<Authe type="signin" />} />
        <Route path="signUp" element={<Authe type="signup" />} />
        <Route index element={<PublicHome />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="track" element={<Track />} />
        <Route path="history" element={<History />} />
        <Route path="notices" element={<Notices />} />
      </Route>

      {/* Protected routes with Navbar */}
      <Route path="/office" element={<OfficeLayout mode="office" />}>
        <Route path="" element={<TempOffice mode="office" />} />
        <Route path="notices" element={<OfficeNotice mode="office" />} />
        <Route path="map" element={<NagarPalikaMap mode="office" />} />
        <Route path="officers" element={<OfficerInfo mode="office" />} />
      </Route>

      {/* Route for a specific sub officer */}
      <Route path="verify" element={<Verifyer />} />

      <Route
        path="/department/:deptId"
        element={<OfficeLayout mode="department" />}
      >
        <Route path="" element={<TempOffice mode="department" />} />
        <Route path="notices" element={<OfficeNotice mode="department" />} />
        <Route path="officers" element={<OfficerInfo mode="department" />} />
        <Route path="map" element={<NagarPalikaMap mode="department" />} />
      </Route>

      <Route path="/state" element={<Combo mode="department" />} />
    </Routes>
  );
}

export default App;