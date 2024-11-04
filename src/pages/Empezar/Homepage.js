import React from "react";
import { useNavigate } from 'react-router-dom';
import "../../styles/empezar/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/other');
  };

  return (
    <div className="homepage-container">
      {/* Cabezera con el texto CryptoPay */}
      <header className="homepage-header">
        <h1 className="homepage-title">CryptoPay</h1>
      </header>

      <div className="homepage-left">
        <img src={require('../../assets/metamask.png')} alt="CryptoPay" className="homepage-image" />
      </div>
      
      <div className="homepage-right">
        <h1 className="homepage-welcome">Bienvenido a CryptoPay</h1>
        <p className="homepage-tagline">Facilita tus pagos de transporte con Ethereum</p>
        
        <button className="homepage-start-button" onClick={handleStartClick}>
          Comenzar
        </button>
      </div>

      <footer className="homepage-footer">
        <p>© 2024 CryptoPay. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;
