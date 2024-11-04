import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeProvider } from '../../services/MoviBusPayService';
import Swal from 'sweetalert2';
import '../../styles/account/LoginPage.css'; 

function LoginPage() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [metamaskAddress, setMetamaskAddress] = useState(''); 
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(''); 
    const navigate = useNavigate(); 

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

    const connectMetaMask = async () => {
        if (typeof window.ethereum === 'undefined') {
            Swal.fire({
                ...alertStyles,
                title: 'MetaMask no detectado',
                text: 'Por favor, instala MetaMask para continuar.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        try {
            const providerData = await initializeProvider(metamaskAddress); // Intenta conectar MetaMask
            if (providerData) {
                console.log("Cuentas disponibles en MetaMask:", providerData.accounts);
                setMetamaskAddress(providerData.userAddress); 
                setAccounts(providerData.accounts); 
                setSelectedAccount(providerData.userAddress); 
                setWalletConnected(true);
                Swal.fire({
                    ...alertStyles,
                    title: 'MetaMask conectado',
                    html: `<p style="font-size: 1.2rem; color: #ff7e5f;">Dirección: ${providerData.userAddress}</p>`,
                    icon: 'success',
                    confirmButtonText: '¡Entendido!',
                });
            } else {
                Swal.fire({
                    ...alertStyles,
                    title: 'Error',
                    text: 'No se pudo conectar a MetaMask',
                    icon: 'error',
                    confirmButtonText: 'Reintentar',
                });
            }
        } catch (error) {
            console.error('Error al conectar MetaMask:', error);
            Swal.fire({
                ...alertStyles,
                title: 'Error',
                text: 'No se pudo conectar a MetaMask',
                icon: 'error',
                confirmButtonText: 'Reintentar',
            });
        }
    };
    
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ metamaskAddress: selectedAccount }),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`Error ${response.status}: ${errorResponse.message}`);
            }
    
            const data = await response.json();
            console.log('Usuario encontrado:', data);
    
            if (data.message === 'Inicio de sesión exitoso') {
                localStorage.setItem('userName', selectedAccount); // Guarda el usuario en localStorage
                console.log(localStorage.getItem('userName')); // Verifica que esté guardado
                navigate('/inicio'); // Navega solo después de guardar
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
        }
    };
    
      
  

    return (
        <div className="login-container">
            <h1>Bienvenido a MoviBusPay</h1>
            <p>Conéctate y descubre el poder de una billetera segura y sencilla</p>
            <div className="login-form">
                <button type="button" onClick={connectMetaMask} className="connect-button">
                    {walletConnected ? 'MetaMask Conectado' : 'Conectar MetaMask'}
                </button>
                {walletConnected && (
                    <div>
                        <p className="address">Dirección seleccionada: {selectedAccount}</p>
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