import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routesConfig from "./routes/routesConfig";
import { LanguageProvider } from "./pages/landingPage/translate/LanguageContext";

function App() {
  return (
    <LanguageProvider>
        <Router>
          <Routes>
            {routesConfig.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Router>
    </LanguageProvider>
  );
}

export default App;
