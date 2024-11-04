import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/navigation/Sidebar';
import { initializeProvider } from '../../services/MoviBusPayService';
import '../../styles/dashboard/RewardsPage.css';

function Rewards() {
  const [points, setPoints] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [referrer, setReferrer] = useState('');
  const [notification, setNotification] = useState('');
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const connectToBlockchain = async () => {
      const connection = await initializeProvider();
      if (connection) {
        setContract(connection.contract);
        setUserAddress(connection.userAddress);
        loadUserRewards(connection.contract, connection.userAddress);
      }
    };
    connectToBlockchain();
  }, []);

  const loadUserRewards = async (contract, userAddress) => {
    try {
      const userPoints = await contract.getUserPoints(userAddress);
      const userTotalRides = await contract.getUserTotalRides(userAddress);
      setPoints(userPoints.toString());
      setTotalRides(userTotalRides.toString());
    } catch (error) {
      console.error("Error al cargar las recompensas:", error);
    }
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    if (referrer) {
      try {
        await contract.registerReferrer(referrer);
        setNotification(`🎉 ¡Referido registrado exitosamente! ${referrer} ha sido añadido.`);
      } catch (error) {
        console.error("Error al registrar el referido:", error);
        setNotification(`⚠️ Error al registrar el referido. Verifica la dirección.`);
      }
    }
  };

  return (
    <div className="rewards-container">
      <Sidebar />
      <div className="rewards-content">
        <header className="rewards-header">
          <h1>RECOMPENSAS</h1>
          <p>Consulta y gestiona tus recompensas acumuladas.</p>
        </header>
        <section className="rewards-info">
          <h2>Tus Puntos: {points}</h2>
          <h2>Total de Viajes: {totalRides}</h2>
        </section>
        <section className="referral-form">
          <h2>Registrar Referido</h2>
          <form onSubmit={handleReferralSubmit}>
            <div className="form-group">
              <label htmlFor="referrer">Dirección del Referido:</label>
              <input
                type="text"
                id="referrer"
                value={referrer}
                onChange={(e) => setReferrer(e.target.value)}
                required
              />
            </div>
            <button type="submit">Registrar Referido</button>
          </form>
          {notification && <p className="notification">{notification}</p>}
        </section>
      </div>
    </div>
  );
}

export default Rewards;
