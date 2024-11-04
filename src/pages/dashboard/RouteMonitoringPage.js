import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Sidebar from '../../components/navigation/Sidebar';
import '../../styles/dashboard/RouteMonitoringPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const RouteMonitoring = () => {
    const [selectedCompany, setSelectedCompany] = useState("Empresa A");
    const [selectedRoute, setSelectedRoute] = useState("Ruta A");
    const [position, setPosition] = useState([-13.0323, -76.8404]);

    const routesByCompany = {
        "Empresa A": {
            "Ruta A": [
                [-13.0323, -76.8404],
                [-13.0340, -76.8450],
                [-13.0350, -76.8500],
            ],
            "Ruta B": [
                [-13.0330, -76.8420],
                [-13.0345, -76.8435],
                [-13.0360, -76.8450],
            ],
        },
        "Empresa B": {
            "Ruta A": [
                [-13.0300, -76.8350],
                [-13.0315, -76.8400],
                [-13.0325, -76.8420],
            ],
            "Ruta B": [
                [-13.0280, -76.8340],
                [-13.0290, -76.8355],
                [-13.0300, -76.8365],
            ],
        },
    };

    const route = routesByCompany[selectedCompany][selectedRoute];

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prev) => {
                const nextIndex = (route.indexOf(prev) + 1) % route.length;
                return route[nextIndex];
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [route]);

    return (
        <div className="route-monitoring-container">
            <Sidebar />
            <div className="route-monitoring-content">
                <h1 className="route-monitoring-title">Monitoreo de Rutas</h1>
                <div className="route-selector">
                    <label htmlFor="route-select">Selecciona la Ruta:</label>
                    <select id="route-select" value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
                        {Object.keys(routesByCompany[selectedCompany]).map(routeName => (
                            <option key={routeName} value={routeName}>{routeName}</option>
                        ))}
                    </select>
                </div>
                <MapContainer center={position} zoom={13} className="route-map">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright"></a>'
                    />
                    <Marker position={position} />
                    <Polyline positions={route} color="blue" weight={5} />
                </MapContainer>
                <section className="route-info">
                    <h2>Información de la Ruta</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Ruta</th>
                                <th>Coordenadas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {route.map((point, index) => (
                                <tr key={index}>
                                    <td>Ruta {index + 1}</td>
                                    <td>{point[0]}, {point[1]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};

export default RouteMonitoring;
