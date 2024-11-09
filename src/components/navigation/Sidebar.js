import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHome, FaTicketAlt, FaListAlt, FaAward, FaTachometerAlt, FaClock, FaCog, FaCopy } from 'react-icons/fa';
import { ethers } from 'ethers';
import MetaMaskLogo from '../../assets/ProfileMetamask.png';
import '../../styles/components/Sidebar.css';

const Sidebar = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [showSettingsSubMenu, setShowSettingsSubMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    const address = localStorage.getItem('metamaskAddress');

    if (name) setUserName(name);
    if (role) setUserRole(role);
    if (address) setWalletAddress(address);

    checkConnection();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleNetworkChange);
      return () => {
        window.ethereum.removeListener('chainChanged', handleNetworkChange);
      };
    }
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();
      setIsConnected(accounts.length > 0);
      setSelectedNetwork(getNetworkName(network.chainId));
    }
  };

  const handleNetworkChange = async (chainId) => {
    const networkName = getNetworkName(parseInt(chainId, 16));
    setSelectedNetwork(networkName);
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return 'Mainnet';
      case 11155111:
        return 'Sepolia';
      case 0x4268:
        return 'Holesky';
      default:
        return 'Unknown';
    }
  };

  const switchNetwork = async (event) => {
    const network = event.target.value;
    const networkParams = getNetworkParams(network);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkParams.chainId }],
      });
      setSelectedNetwork(networkParams.chainName);
    } catch (error) {
      console.error('Error al cambiar de red:', error);
    }
  };

  const getNetworkParams = (network) => {
    switch (network) {
      case 'mainnet':
        return { chainId: '0x1', chainName: 'Mainnet' };
      case 'sepolia':
        return { chainId: '0xaa36a7', chainName: 'Sepolia' };
      case 'holesky':
        return { chainId: '0x4268', chainName: 'Holesky' };
      default:
        return { chainId: '0x1', chainName: 'Mainnet' };
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Dirección copiada al portapapeles");
  };

  const abbreviateAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleSettingsSubMenuToggle = () => setShowSettingsSubMenu(!showSettingsSubMenu);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('metamaskAddress');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="wallet-info">
        <div className="network-info">
          <img src={MetaMaskLogo} alt="MetaMask" className="metamask-logo" />
          <select
            className="network-select"
            value={selectedNetwork.toLowerCase()}
            onChange={switchNetwork}
          >
            <option value="mainnet">Mainnet</option>
            <option value="sepolia">Sepolia</option>
            <option value="holesky">Holesky</option>
          </select>
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
        </div>
      </div>

      <div className="profile">
        <img src={require('../../assets/profilePerson.png')} alt="User Avatar" className="profile-pic" />
        <div className="wallet-address-container">
          <p className="wallet-address">{abbreviateAddress(walletAddress)}</p>
          <FaCopy className="copy-icon" onClick={handleCopyAddress} />
        </div>
        <p className="role">{userRole === 'contractor' ? 'CONTRATISTA' : 'USUARIO'}</p>
        <h3 className="name">{userName || 'Usuario'}</h3>
      </div>

      <div className="menu">
        <Link to="/inicio" className="menu-item"><FaHome className="icon" /> Inicio</Link>

        {userRole === 'contractor' && (
          <Link to="/create-route" className="menu-item">
            <FaMapMarkerAlt className="icon" /> Crear Ruta
          </Link>
        )}

        <Link to="/purchases" className="menu-item"><FaTicketAlt className="icon" /> Compras de Pasaje</Link>
        {/* <Link to="/transaction-details" className="menu-item"><FaListAlt className="icon" /> Detalles de la Transacción</Link> */}
        {/* <Link to="/rewards" className="menu-item"><FaAward className="icon" /> Recompensas</Link> */}
        {/* <Link to="/route-monitoring" className="menu-item"><FaTachometerAlt className="icon" /> Monitoreo de Ruta</Link> */}
        {/* <Link to="/schedules" className="menu-item"><FaClock className="icon" /> Horarios</Link> */}

        <div className="menu-item" onClick={handleSettingsSubMenuToggle}>
          <FaCog className="icon" /> Configuración
          <span className="arrow">{showSettingsSubMenu ? "▲" : "▼"}</span>
        </div>
        {showSettingsSubMenu && (
          <div className="sub-menu">
            <Link to="/profile" className="sub-menu-item">Perfil</Link>
            <a href="#logout" onClick={handleLogout} className="sub-menu-item">Salir</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
