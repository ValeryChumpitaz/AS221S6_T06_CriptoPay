import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/navigation/Sidebar.js";
import "../../styles/dashboard/CreateRouter.css";
import Swal from 'sweetalert2';
import { ethers } from 'ethers';

const locations = [
    { id: 1, name: "Lima" },
    { id: 2, name: "Cusco" },
    { id: 3, name: "Arequipa" },
    { id: 4, name: "Trujillo" },
    { id: 5, name: "Iquitos" },
    { id: 6, name: "Puno" },
    { id: 7, name: "Piura" },
    { id: 8, name: "Chiclayo" },
    { id: 9, name: "Tacna" },
    { id: 10, name: "Huancayo" }
];

const CreateRoutePage = () => {
    const [routeData, setRouteData] = useState({
        title: '',
        origin: '',
        destination: '',
        time: '',
        price: ''
    });
    const [metamaskAddress, setMetamaskAddress] = useState(null);

    useEffect(() => {
        const fetchAddress = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setMetamaskAddress(address);
                } catch (error) {
                    console.error('Error al obtener la dirección de MetaMask:', error);
                    Swal.fire('Error', 'Por favor conecta MetaMask primero.', 'error');
                }
            } else {
                Swal.fire('Error', 'MetaMask no está instalado.', 'error');
            }
        };

        fetchAddress();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRouteData({ ...routeData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!metamaskAddress) {
            Swal.fire('Error', 'No se encontró la dirección de MetaMask. Asegúrate de estar conectado.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...routeData, metamaskAddress })
            });

            const data = await response.json();
            if (response.ok) {
                Swal.fire('Éxito', 'Ruta creada exitosamente', 'success');
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            console.error('Error al crear la ruta:', error);
            Swal.fire('Error', 'No se pudo crear la ruta', 'error');
        }
    };

    return (
        <div className="profile-pages">
            <Sidebar />
            <div className="route-form-container">
                <h2>Crear una nueva ruta</h2>
                <form onSubmit={handleSubmit} className="route-form">
                    <div className="form-group">
                        <label htmlFor="title">Título de la ruta:</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Título de la ruta"
                            value={routeData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="origin">Origen:</label>
                        <select
                            name="origin"
                            value={routeData.origin}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona el origen</option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.name}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="destination">Destino:</label>
                        <select
                            name="destination"
                            value={routeData.destination}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecciona el destino</option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.name}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Hora:</label>
                        <input
                            type="time"
                            name="time"
                            value={routeData.time}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Precio en ETH:</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Precio en ETH"
                            value={routeData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Crear Ruta</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRoutePage;
