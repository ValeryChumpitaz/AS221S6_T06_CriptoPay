import React, { useState, useEffect } from "react";
import Sidebar from "../../components/navigation/Sidebar.js";
import {
  initializeProvider,
  payForBusRide,
  hasPaid,
} from "../../services/MoviBusPayService.js";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/dashboard/PurchasesPage.css";

const DEFAULT_CONTRACT_ADDRESS = '0xE04db286842532273c1Ac7aF1eF0671fEa0eA450';

const PurchasesPage = () => {
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [amounts, setAmounts] = useState({});
  const [selectedNetwork, setSelectedNetwork] = useState("sepolia");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [customContractorAddress, setCustomContractorAddress] = useState("");

  const switchNetwork = async (network) => {
    let networkParams;

    if (network === "sepolia") {
      networkParams = {
        chainId: "0xaa36a7",
        chainName: "Sepolia Testnet",
        rpcUrls: ["https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
        nativeCurrency: {
          name: "SepoliaETH",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
      };
    } else if (network === "holesky") {
      networkParams = {
        chainId: "0x4268",
        chainName: "Ethereum Holesky",
        rpcUrls: ["https://holesky.drpc.org"],
        nativeCurrency: {
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://holesky.beaconcha.in"],
      };
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkParams.chainId }],
      });
      Swal.fire("Éxito", `Red cambiada a ${networkParams.chainName}`, "success");
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [networkParams],
          });
          Swal.fire("Éxito", `${networkParams.chainName} agregada y cambiada`, "success");
        } catch (addError) {
          Swal.fire("Error", `No se pudo agregar la red ${networkParams.chainName}`, "error");
        }
      } else {
        Swal.fire("Error", `No se pudo cambiar a la red ${networkParams.chainName}`, "error");
      }
    }
  };

  useEffect(() => {
    const connectToMetaMask = async () => {
      const connection = await initializeProvider(customContractorAddress || DEFAULT_CONTRACT_ADDRESS);
      if (connection) {
        setContract(connection.contract);
        setAccounts(connection.accounts || []);
        setUserAddress(connection.userAddress);
        setSelectedAccount(connection.userAddress);
      }
    };
    connectToMetaMask();
  }, [customContractorAddress]);

  const handleNetworkChange = (e) => {
    const network = e.target.value;
    setSelectedNetwork(network);
    switchNetwork(network);
  };

  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };

  const busRoutes = [
    {
      id: 1,
      title: "Ruta A - Valery",
      time: "10:00 AM",
      destination: "Centro",
      coordinates: [-12.0464, -77.0428],
    },
    {
      id: 2,
      title: "Ruta B - Shirley",
      time: "12:00 PM",
      destination: "Plaza",
      coordinates: [-12.0465, -77.043],
    },
    {
      id: 3,
      title: "Ruta C - Gabriel",
      time: "02:00 PM",
      destination: "Parque",
      coordinates: [-12.0466, -77.0432],
    },
  ];

  const handlePayment = async (route) => {
    const amount = amounts[DEFAULT_CONTRACT_ADDRESS];
    console.log("Valor de amount:", amount); // Depuración

    try {
        if (amount && !isNaN(amount) && amount > 0) {
            await payForBusRide(contract, DEFAULT_CONTRACT_ADDRESS, amount);
            Swal.fire("Éxito", "Pago realizado con éxito", "success");
        } else {
            Swal.fire("Error", "Por favor, ingrese una cantidad válida", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Error en el pago", "error");
    }
};


  const checkPaymentStatus = async () => {
    if (contract && userAddress && customContractorAddress) {
      const status = await hasPaid(contract, userAddress, customContractorAddress);
      setPaymentStatus(status);
      Swal.fire(
        "Estado del pago",
        status ? "El usuario ha pagado" : "El usuario no ha pagado",
        "info"
      );
    }
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <h1>Servicios de Autobús</h1>
      <p>Cuenta conectada: {selectedAccount}</p>
      <label htmlFor="network-select">Selecciona una red:</label>
      <select
        id="network-select"
        value={selectedNetwork}
        onChange={handleNetworkChange}
      >
        <option value="sepolia">Sepolia</option>
        <option value="holesky">Holesky</option>
      </select>

      <label htmlFor="network-select">Ingresar Dirección de Cuenta en uso:</label>
      <input
        type="text"
        placeholder="Dirección"
        value={customContractorAddress}
        onChange={(e) => setCustomContractorAddress(e.target.value)}
        style={{ width: "98%" }} // Ajusta el valor según el ancho deseado
      />

      <div className="card-grid">
        {busRoutes.map((route) => (
          <div key={route.id} className="card">
            <h2>{route.title}</h2>
            <p><strong>Hora:</strong> {route.time}</p>
            <p><strong>Ruta:</strong> {route.destination}</p>
            <div className="map">
              <MapContainer
                center={route.coordinates}
                zoom={13}
                style={{ height: "150px", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright"></a>'
                />
                <Marker position={route.coordinates} />
              </MapContainer>
            </div>
            <input
    type="text"
    placeholder="Cantidad en ETH"
    onChange={(e) =>
        setAmounts({
            ...amounts,
            [DEFAULT_CONTRACT_ADDRESS]: e.target.value,
        })
    }
/>

            <button onClick={() => handlePayment(route)}>
              Pagar
            </button>
            <button onClick={() => checkPaymentStatus()}>
              Verificar Pago
            </button>
          </div>
        ))}
      </div>
      {paymentStatus !== null && (
        <p className="payment-status">
          {paymentStatus ? "El usuario ha pagado" : "El usuario no ha pagado"}
        </p>
      )}
    </div>
  );
};

export default PurchasesPage;
