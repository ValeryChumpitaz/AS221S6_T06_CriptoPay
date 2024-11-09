import { ethers } from 'ethers';
import contractABI from '../abi/MoviBusPay.json';

export const initializeProvider = async (contractorAddress = null) => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            let contract = null;
            if (contractorAddress) {
                // Solo inicializa el contrato si se proporciona contractorAddress
                contract = new ethers.Contract(contractorAddress, contractABI, signer);
            }

            return { provider, signer, contract, userAddress };
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

export const payForBusRide = async (contract, contractorAddress, amount) => {
    if (!contractorAddress) {
        throw new Error("La dirección del contratista no es válida.");
    }

    try {
        const provider = contract.provider;

        const signer = contract.signer;
        const balance = await provider.getBalance(await signer.getAddress());
        const amountInWei = ethers.utils.parseEther(amount);

        if (balance.lt(amountInWei)) {
            alert("Fondos insuficientes para realizar el pago.");
            return;
        }

        
        const tx = await contract.payForBusRide(contractorAddress, { value: amountInWei });
        console.log('Pago exitoso:', tx);
        await tx.wait(); 
        return tx;
    } catch (error) {
        console.error('Error en el pago:', error);
        throw error;
    }
};

// Función para registrar un referidor en el contrato
export const registerReferrer = async (contract, referrerAddress) => {
    try {
        const tx = await contract.registerReferrer(referrerAddress);
        console.log('Referidor registrado:', tx);
        await tx.wait(); 
        return tx;
    } catch (error) {
        console.error('Error al registrar referidor:', error);
        throw error;
    }
};

// Función para verificar si el usuario ha pagado a un contratista específico
export const hasPaid = async (contract, userAddress, contractorAddress) => {
    try {
        const paid = await contract.hasPaid(userAddress, contractorAddress);
        console.log(`El usuario ha pagado: ${paid}`);
        return paid;
    } catch (error) {
        console.error('Error al verificar si ha pagado:', error);
        return false;
    }
};

// Función para obtener los puntos acumulados de un usuario
export const getUserPoints = async (contract, userAddress) => {
    try {
        const points = await contract.getUserPoints(userAddress);
        console.log(`Puntos acumulados del usuario: ${points}`);
        return points;
    } catch (error) {
        console.error('Error al obtener los puntos del usuario:', error);
        throw error;
    }
};

// Función para obtener el total de viajes realizados por un usuario
export const getUserTotalRides = async (contract, userAddress) => {
    try {
        const totalRides = await contract.getUserTotalRides(userAddress);
        console.log(`Total de viajes realizados por el usuario: ${totalRides}`);
        return totalRides;
    } catch (error) {
        console.error('Error al obtener el total de viajes del usuario:', error);
        throw error;
    }
};

// Función para obtener los detalles de un pago específico
export const getPaymentDetails = async (contract, index) => {
    try {
        const payment = await contract.getPaymentDetails(index);
        console.log(`Detalles del pago:`, payment);
        return payment;
    } catch (error) {
        console.error('Error al obtener los detalles del pago:', error);
        throw error;
    }
};

// Función para obtener el número total de pagos registrados en el contrato
export const getTotalPayments = async (contract) => {
    try {
        const totalPayments = await contract.getTotalPayments();
        console.log(`Número total de pagos registrados: ${totalPayments}`);
        return totalPayments;
    } catch (error) {
        console.error('Error al obtener el número total de pagos:', error);
        throw error;
    }
};
