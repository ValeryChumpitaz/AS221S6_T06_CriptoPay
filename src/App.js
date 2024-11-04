import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/account/LoginPage";
import RegisterPage from "./pages/account/RegisterPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import PurchasesPage from "./pages/dashboard/PurchasesPage";
import TransactionDetailsPage from "./pages/dashboard/TransactionDetailsPage";
import RewardsPage from "./pages/dashboard/RewardsPage";
import RouteMonitoringPage from "./pages/dashboard/RouteMonitoringPage";
import SchedulesPage from "./pages/dashboard/SchedulesPage";
import MainPage from "./pages/main/MainPage";
import Inicio from "./pages/dashboard/Inicio";
import PrivateRoute from "./routes/PrivateRoute";
import HomePage from "./pages/Empezar/Homepage";
import OtherPage from "./pages/landingPage/OtherPage";
import { LanguageProvider } from "./pages/landingPage/translate/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/other" element={<OtherPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/inicio"
            element={
              <PrivateRoute>
                <Inicio />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/purchases"
            element={
              <PrivateRoute>
                <PurchasesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction-details"
            element={
              <PrivateRoute>
                <TransactionDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <PrivateRoute>
                <RewardsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/route-monitoring"
            element={
              <PrivateRoute>
                <RouteMonitoringPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <PrivateRoute>
                <SchedulesPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
