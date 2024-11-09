import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import Torus from "@toruslabs/torus-embed";
import Fortmatic from "fortmatic";
import Authereum from "authereum";
import { Bitski } from "bitski";
import Swal from 'sweetalert2';
import '../../styles/account/LoginPage.css';

const providerOptions = {
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: process.env.REACT_APP_INFURA_KEY,
    },
  },
  torus: {
    package: Torus,
  },
  fortmatic: {
    package: Fortmatic,
    options: {
      key: process.env.REACT_APP_FORTMATIC_KEY,
    },
  },
  authereum: {
    package: Authereum,
  },
  bitski: {
    package: Bitski,
    options: {
      clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
      callbackUrl: window.location.href,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
  },
};

let web3Modal;

function LoginPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [library, setLibrary] = useState(null);
  const [network, setNetwork] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });
  }, []);

  const alertStyles = {
    customClass: {
      container: 'alert-container',
      popup: 'alert-popup',
      title: 'alert-title',
      content: 'alert-content',
      confirmButton: 'alert-confirm-button',
    },
    buttonsStyling: false,
  };

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();

      setLibrary(library);
      setWalletConnected(true);
      setSelectedAccount(accounts[0]);
      setNetwork(network);
      localStorage.setItem('metamaskAddress', accounts[0]);

      Swal.fire({
        ...alertStyles,
        title: 'Billetera Conectada',
        text: `Dirección: ${accounts[0]}`,
        icon: 'success',
        confirmButtonText: '¡Entendido!',
      });
    } catch (error) {
      console.error("Error al conectar la billetera:", error);
      Swal.fire({
        ...alertStyles,
        title: 'Error',
        text: 'No se pudo conectar a la billetera',
        icon: 'error',
        confirmButtonText: 'Reintentar',
      });
    }
  };

  const handleLogin = async () => {
    const metamaskAddress = localStorage.getItem('metamaskAddress');
    if (!metamaskAddress) {
      Swal.fire({
        ...alertStyles,
        title: 'Error',
        text: 'No se encontró la dirección de MetaMask. Asegúrate de estar conectado.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metamaskAddress }),
      });
      const data = await response.json();

      if (response.ok) {
        // Guarda el nombre y el rol en localStorage
        localStorage.setItem('userName', data.userName || 'Usuario');
        localStorage.setItem('userRole', data.role || 'user');

        Swal.fire('Éxito', 'Inicio de sesión exitoso', 'success');
        navigate('/inicio');
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      Swal.fire({
        ...alertStyles,
        title: 'Error',
        text: 'No se pudo iniciar sesión. Por favor intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Reintentar',
      });
    }
  };

  return (
    <div className="login-container">
      <h1>Bienvenido a MoviBusPay</h1>
      <p>Conéctate y descubre el poder de una billetera segura y sencilla</p>
      <div className="login-form">
        <button type="button" onClick={connectWallet} className="connect-button">
          {walletConnected ? 'Billetera Conectada' : 'Conectar Billetera'}
        </button>
        {walletConnected && (
          <div>
            <p className="address">Dirección seleccionada: {selectedAccount}</p>
            <p>Red: {network?.name}</p>
          </div>
        )}
        <button type="button" onClick={handleLogin} className="login-button" disabled={!walletConnected}>
          Iniciar Sesión
        </button>
        <p className="register-prompt">
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
