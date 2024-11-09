import React, { useState, useEffect } from "react";
import Sidebar from "../../components/navigation/Sidebar.js";
import { initializeProvider, payForBusRide } from "../../services/MoviBusPayService.js";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/dashboard/PurchasesPage.css";
import { ethers } from "ethers";

const PurchasesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [selectedContract, setSelectedContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    // Conectar automáticamente a MetaMask al cargar la página
    const connectToMetaMask = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();

          setWalletAddress(address);
          console.log(`Conectado a MetaMask con la dirección ${address}`);
        } catch (error) {
          console.error("Error al conectar con MetaMask:", error);
          Swal.fire("Error", "Por favor, conecta MetaMask primero.", "error");
        }
      } else {
        Swal.fire("Error", "MetaMask no está instalado.", "error");
      }
    };

    connectToMetaMask();

    // Llamada a la API para obtener las rutas
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://localhost:5000/routes");
        const data = await response.json();
        setRoutes(data);
      } catch (error) {
        console.error("Error al cargar las rutas:", error);
      }
    };

    fetchRoutes();
  }, []);

  const handleAmountChange = (routeId, value) => {
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [routeId]: value,
    }));
  };

  const handlePayment = async (route) => {
    console.log("Intentando realizar pago para:", route.contractorAddress);
    
    const amount = amounts[route._id]?.toString() || route.price?.toString();

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        Swal.fire("Error", "Por favor, ingrese una cantidad válida", "error");
        return;
    }

    if (!route.contractorAddress) {
        Swal.fire("Error", "Dirección del contratista no disponible", "error");
        return;
    }

    try {
        const connection = await initializeProvider(route.contractorAddress);
        console.log("Conexión obtenida:", connection);

        if (connection) {
            await payForBusRide(connection.contract, route.contractorAddress, amount);
            Swal.fire("Éxito", "Pago realizado con éxito", "success");
        }
    } catch (error) {
        Swal.fire("Error", "Error en el pago", "error");
        console.error("Error en el pago:", error);
    }
};

  

  return (
    <div className="profile-page">
      <Sidebar />
      <h1>Servicios de Autobús</h1>

      <div className="card-grid">
        {routes.map((route) => (
          <div key={route._id} className="card">
            <h2>{route.title}</h2>
            <p><strong>Destino:</strong> {route.destination}</p>
            <p><strong>Hora:</strong> {route.time}</p>
            <p><strong>Precio Sugerido:</strong> {route.price} ETH</p>

            <div className="map">
              <MapContainer
                center={route.coordinates || [0, 0]} 
                zoom={13}
                style={{ height: "150px", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={route.coordinates || [0, 0]} />
              </MapContainer>
            </div>

            <input
              type="number"
              placeholder="Cantidad en ETH"
              value={amounts[route._id] || ""}
              onChange={(e) => handleAmountChange(route._id, e.target.value)}
              min="0"
              step="0.01"
            />

            <button onClick={() => handlePayment(route)}>Pagar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasesPage;
