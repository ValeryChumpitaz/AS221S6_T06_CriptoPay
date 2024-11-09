import React, { useState } from 'react';
import { initializeProvider } from '../../services/MoviBusPayService';
import { useNavigate } from 'react-router-dom';
import '../../styles/account/RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    metamaskAddress: '',
    role: 'user',
    contractorType: '',
    companyName: '',
    carConfirmation: false,
  });
  const [walletConnected, setWalletConnected] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
      role: name === 'contractorType' && value ? 'contractor' : prevState.role,
    }));
  };

  const connectMetaMask = async () => {
    const providerData = await initializeProvider();
    if (providerData) {
      setFormData((prevState) => ({
        ...prevState,
        metamaskAddress: providerData.userAddress,
      }));
      setWalletConnected(true);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!walletConnected) {
      alert('Por favor conecta MetaMask primero.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.message);
      navigate('/login');
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un error durante el registro.');
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <label htmlFor="firstName">Nombre:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="lastName">Apellidos:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <button type="button" onClick={connectMetaMask} className="meta-mask-button">
          {walletConnected ? 'MetaMask Conectado' : 'Conectar MetaMask'}
        </button>

        {formData.metamaskAddress && <p>Dirección MetaMask: {formData.metamaskAddress}</p>}

        <div className="select-container">
          <label htmlFor="contractorType">Tipo de Contratista:</label>
          <select
            id="contractorType"
            name="contractorType"
            value={formData.contractorType}
            onChange={handleInputChange}
          >
            <option value="">Selecciona</option>
            <option value="personal">Personal</option>
            <option value="company">Empresa</option>
          </select>
        </div>

        {formData.contractorType === 'company' && (
          <>
            <label htmlFor="companyName">Nombre de la Empresa:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
          </>
        )}

        {formData.contractorType === 'personal' && (
          <>
            <label htmlFor="carConfirmation">¿Confirmas que trabajarás con un vehiculo?</label>
            <input
              type="checkbox"
              id="carConfirmation"
              name="carConfirmation"
              checked={formData.carConfirmation}
              onChange={handleInputChange}
            />
          </>
        )}

        <button type="submit" className="register-button">Registrar</button>
      </form>
    </div>
  );
}

export default RegisterPage;
