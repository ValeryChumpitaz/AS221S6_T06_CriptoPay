import { BrowserProvider, Contract, parseEther } from 'ethers';
import contractABI from '../abi/MoviBusPay.json';

const contractAddress = '0x23FF1cACd4b2F28529581314628A9Cc926250bDd'; 

export const initializeProvider = async () => {
    if (window.ethereum) {
        try {
            // Solicitar acceso a MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);
            const userAddress = await signer.getAddress();

            // Obtener todas las cuentas disponibles
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            
            // Log de las direcciones de las cuentas
            console.log('Cuentas disponibles en MetaMask:', accounts); // Aquí se registran las cuentas

            return { provider, signer, contract, userAddress, accounts }; // Retorna las cuentas
        } catch (error) {
            console.error('Error conectando con MetaMask:', error);
            throw error;
        }
    } else {
        console.error('MetaMask no está instalado');
        alert('MetaMask no está instalado');
        return null;
    }
};


export const payForBusRide = async (contract, destination, amount) => {
    try {
        const tx = await contract.payForBusRide(destination, { value: parseEther(amount) });
        console.log('Pago exitoso:', tx);
        return tx;
    } catch (error) {
        console.error('Error en el pago:', error);
        throw error;
    }
};

// Función para verificar si el usuario ha pagado
export const hasPaid = async (contract, userAddress) => {
    try {
        const paid = await contract.hasPaid(userAddress);
        console.log(`El usuario ha pagado: ${paid}`);
        return paid;
    } catch (error) {
        console.error('Error al verificar si ha pagado:', error);
        return false;
    }
};