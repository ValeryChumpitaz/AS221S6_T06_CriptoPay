# 🚀 Proyecto de Integración Blockchain

Este repositorio contiene una aplicación que interactúa con un contrato inteligente en la blockchain utilizando **Web3.js** o **Ethers.js**, gestionada dentro de un contenedor Docker y desplegada automáticamente mediante una pipeline CI/CD con **GitHub Actions**.

## 🌟 Características principales
- **Interacción con contratos inteligentes**: Implementación de lógica para realizar transacciones utilizando el ABI (Application Binary Interface) del contrato en formato JSON.
- **Docker**: Contenerización de la aplicación para asegurar un entorno de ejecución consistente.
- **Docker Compose**: Orquestación de servicios para facilitar el desarrollo local y la integración.
- **SonarQube**: Análisis estático de código para garantizar calidad y detectar vulnerabilidades.
- **CI/CD con GitHub Actions**: Automatización del flujo de trabajo desde la construcción de imágenes hasta el despliegue en **Docker Hub**.
- **Redes de Blockchain**: Soporte para redes de prueba como **Sepolia** y **Holesky**.

## ⚙️ Tecnologías utilizadas
- **React.js**: Framework principal para el frontend.
- **Web3.js / Ethers.js**: Librerías para interactuar con la blockchain de Ethereum.
- **Docker**: Para contenerizar la aplicación y sus dependencias.
- **SonarQube**: Para análisis de código y aseguramiento de calidad.
- **GitHub Actions**: Para la automatización de CI/CD.
- **Docker Hub**: Para almacenamiento y distribución de imágenes Docker.
- **GitHub Codespaces**: Entorno de desarrollo en la nube para facilitar colaboración.

## 🔄 Flujo de Trabajo
1. **Desarrollo Local**: Inicia el entorno usando Docker Compose.
2. **Análisis de Calidad de Código**: En cada push a la rama principal, se ejecutan:
   - 🔧 Construcción de la imagen Docker.
   - 📊 Ejecución de análisis con SonarQube.
   - 🚀 Subida de la imagen a Docker Hub.
3. **Despliegue**: Las imágenes están disponibles en Docker Hub para producción.

## 📦 Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git

## 📄 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

## 💬 Contribuciones
¡Las contribuciones son bienvenidas! Siéntete libre de abrir un issue o enviar un pull request.
