import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./translate/LanguageContext";
import "../../styles/landingPage/OtherPage.css";
import { FaMoon, FaSun } from "react-icons/fa";
import NavigationPages from "./NavigationPages.js";

const OtherPage = () => {
  const navigate = useNavigate();
  const { texts, switchLanguage, language } = useLanguage();

  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [zoomLevel, setZoomLevel] = useState(1); // Define zoomLevel en el estado

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLanguageChange = (e) => switchLanguage(e.target.value);

  const handleJoinClick = () => navigate("/main");

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentTime(new Date().toLocaleTimeString()),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`other-page ${darkMode ? "dark-mode" : ""}`}
      style={{ transform: `scale(${zoomLevel})` }}
    >
      {/* CABECERA */}
      <header className="header">
        <div className="logo-container">
          <div className="logo">{texts.title}</div>
        </div>
        <div className="current-time" aria-live="polite">
          {currentTime}
        </div>
        <nav className="nav">
          <ul>
            <li>
              <a href="#description">{texts.navigation.description}</a>
            </li>
            <li>
              <a href="#objectives">{texts.navigation.objectives}</a>
            </li>
            <li>
              <a href="#features">{texts.navigation.features}</a>
            </li>
            <li>
              <a href="#benefits">{texts.navigation.benefits}</a>
            </li>
            <li>
              <a href="#team">{texts.navigation.team}</a>
            </li>
            <li>
              <a href="#conclusions">{texts.navigation.conclusions}</a>
            </li>
          </ul>
        </nav>
        <div className="auth">
          <div className="lang">
            <select
              onChange={handleLanguageChange}
              value={language}
              className="language-select"
              aria-label="Seleccione el idioma"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <button
            className={`toggle-button ${darkMode ? "dark" : "light"}`}
            onClick={toggleDarkMode}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button className="signup-btn" onClick={handleJoinClick}>
            Login
          </button>
        </div>
      </header>

      {/* SECCIÓN PRINCIPAL */}
      <main className="hero-section">
        <div className="text-content">
          <h1>{texts.description}</h1>
          <p>{texts.main.tagline}</p>
          <div className="buttons">
            <button className="play-demo-btn">{texts.main.videoButton}</button>
          </div>
        </div>
        <div className="image-content">
          <img src={require('../../assets/metamask.png')} alt="logo" className="traveler-image" />
        </div>
      </main>
      <NavigationPages />
    </div>
  );
};

export default OtherPage;
