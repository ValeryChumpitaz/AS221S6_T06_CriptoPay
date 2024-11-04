import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/navigation/Sidebar';
import { initializeProvider } from '../../services/MoviBusPayService';
import "../../styles/dashboard/TransactionDetailsPage.css";

const TransactionDetailsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [contract, setContract] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [busRoutes, setBusRoutes] = useState([
        { id: 1, title: "Ruta A - Valery", destination: "Centro" },
        { id: 2, title: "Ruta B - Shirley", destination: "Plaza" },
        { id: 3, title: "Ruta C", destination: "Parque" },
        { id: 4, title: "Ruta D", destination: "Estadio" },
        { id: 5, title: "Ruta E", destination: "Playa" },
        { id: 6, title: "Ruta F", destination: "Centro Comercial" },
    ]);

    useEffect(() => {
        const connectToMetaMask = async () => {
            const connection = await initializeProvider();
            if (connection) {
                setContract(connection.contract);
                setUserAddress(connection.userAddress);
                loadTransactions(connection.contract, connection.userAddress);
            }
        };
        connectToMetaMask();
    }, []);

    const loadTransactions = async (contract, userAddress) => {
        if (!userAddress) {
            console.error("No hay dirección de usuario para filtrar las transacciones.");
            return;
        }

        try {
            const totalPayments = await contract.getTotalPayments();
            const allPayments = [];

            for (let i = 0; i < totalPayments; i++) {
                const payment = await contract.getPaymentDetails(i);
                allPayments.push({
                    user: payment.user,
                    amount: payment.amount.toString(),
                    contractor: payment.contractor,
                    paid: payment.paid,
                    route: payment.contractor // Ajusta esto según tu lógica
                });
            }

            const userTransactions = allPayments.filter(payment => payment.user.toLowerCase() === userAddress.toLowerCase());
            setTransactions(userTransactions);
        } catch (error) {
            console.error("Error al cargar las transacciones:", error.message);
        }
    };

    const filteredTransactions = selectedRoute
        ? transactions.filter(tx => tx.route === selectedRoute)
        : transactions;

    return (
        <div className="transaction-container">
            <Sidebar />
            <div className="transaction-content">
                <h1>Detalles de la Transacción</h1>
                <h2>Historial de Pagos</h2>

                <label htmlFor="route-select">Selecciona una ruta:</label>
                <select
                    id="route-select"
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                >
                    <option value="">Todas las Rutas</option>
                    {busRoutes.map(route => (
                        <option key={route.id} value={route.destination}>
                            {route.title}
                        </option>
                    ))}
                </select>

                {filteredTransactions.length === 0 ? (
                    <p className="no-transactions">No hay transacciones para mostrar.</p>
                ) : (
                    <ul className="transaction-list">
                        {filteredTransactions.map((tx, index) => (
                            <li key={index} className="transaction-item">
                                <p><strong>Usuario:</strong> {tx.user}</p>
                                <p><strong>Monto (ETH):</strong> {tx.amount}</p>
                                <p><strong>Contratista:</strong> {tx.contractor}</p>
                                <p><strong>Estado:</strong> {tx.paid ? 'Pagado' : 'No Pagado'}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TransactionDetailsPage;
