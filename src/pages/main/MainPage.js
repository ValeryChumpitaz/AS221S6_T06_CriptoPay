import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/main/MainPage.css";

function MainPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  useEffect(() => {
    const ModelViewer = require('@metamask/logo');
    const container = document.getElementById('logo-container');

    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      const viewer = ModelViewer({
        pxNotRatio: true,
        width: 500,
        height: 400,
        followMouse: false,
        slowDrift: false,
      });

      container.appendChild(viewer.container);
      viewer.lookAt({ x: 100, y: 100 });
      viewer.setFollowMouse(true);

      return () => {
        viewer.stopAnimation();
      };
    }
  }, []);

  return (
    <div className="main-container">
      <h1>Explora las posibilidades con nuestra DApp</h1>
      <div id="logo-container"></div>
      <div className="button-container">
        <button onClick={handleLoginClick} className="main-button">Iniciar Sesión</button>
        <button onClick={handleRegisterClick} className="main-button">Únete ahora</button>
      </div>
    </div>
  );
}

export default MainPage;
