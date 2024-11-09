import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/navigation/Sidebar';
import Swal from 'sweetalert2';
import '../../styles/dashboard/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    metamaskAddress: '',
    nickname: '',
    description: '',
  });

  useEffect(() => {
    const metamaskAddress = localStorage.getItem('metamaskAddress'); 

    if (!metamaskAddress) {
      Swal.fire('Error', 'Dirección de MetaMask no encontrada', 'error');
      return;
    }

    fetch(`http://localhost:5000/user/${metamaskAddress}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
        return response.json();
      })
      .then(data => setUserData(data))
      .catch(error => {
        console.error('Error al obtener los datos del usuario:', error);
        Swal.fire('Error', 'Error al obtener los datos del usuario', 'error');
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Información actualizada');
  };

  return (
    <div className="profile-container">
      <Sidebar />
      <h2 className="profile-title">Perfil Profesional</h2>
      <div className="profile-image">
        <img src={require('../../assets/profilePerson.png')} alt="User Avatar" />
      </div>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">Nombre:</label>
            <input 
              type="text" 
              name="firstName" 
              value={userData.firstName} 
              onChange={handleInputChange} 
              placeholder="Juan" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Apellidos:</label>
            <input 
              type="text" 
              name="lastName" 
              value={userData.lastName} 
              onChange={handleInputChange} 
              placeholder="Pérez" 
              required 
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="email">Correo Electrónico:</label>
            <input 
              type="email" 
              name="email" 
              value={userData.email} 
              onChange={handleInputChange} 
              placeholder="juan.perez@gmail.com" 
              required 
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="metamaskAddress">Dirección de MetaMask:</label>
            <input 
              type="text" 
              name="metamaskAddress" 
              value={userData.metamaskAddress} 
              disabled 
              placeholder="0x1234567890abcdef..." 
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="nickname">Apodo:</label>
          <input 
            type="text" 
            name="nickname" 
            value={userData.nickname} 
            onChange={handleInputChange} 
            placeholder="ElGato" 
            required 
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="description">Descripción:</label>
          <textarea 
            name="description" 
            value={userData.description} 
            onChange={handleInputChange} 
            placeholder="Escribe una breve descripción sobre ti..." 
            required 
          ></textarea>
        </div>
        <button type="submit" className="submit-button">Actualizar Información</button>
      </form>
    </div>
  );
};

export default ProfilePage;
