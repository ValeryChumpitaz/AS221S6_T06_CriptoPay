import React from 'react';
import Sidebar from '../../components/navigation/Sidebar';
import '../../styles/dashboard/Inicio.css';

function Inicio() {
    return (
      <div className="inicio-container">
        <Sidebar />
        <div className="inicio-content">
          <header className="inicio-header">
            <h1>Bienvenido a CriptoPay</h1>
            <p>Descubre la forma más avanzada de gestionar el transporte con blockchain.</p>
          </header>
          <section className="project-info">
            <h2>Sobre el Proyecto</h2>
            <p>
              CriptoPay es una innovadora aplicación descentralizada (DApp) que revoluciona la gestión de transportes mediante el uso de blockchain y MetaMask. 
              Nuestra plataforma proporciona una forma segura, transparente y eficiente de gestionar operaciones de transporte, garantizando la integridad y la trazabilidad de cada transacción.
            </p>
          </section>
          <section className="team-members">
            <h2>Nuestro Equipo</h2>
            <ul>
              <li>Valery Chumpitaz</li>
              <li>Shirley Asencio</li>
              <li>Gabriel Gutiérrez</li>
            </ul>
          </section>
        </div>
      </div>
    );
}

export default Inicio;
