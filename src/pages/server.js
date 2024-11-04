const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

// Conexión con MongoDB
mongoose.connect('mongodb+srv://gabrielgutierrezq:rlM9Eq5qjWA7S268@artemio.uowgugn.mongodb.net/ARTEMIO?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB', err));

// Datos para el User
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    metamaskAddress: { type: String, unique: true },
    role: String, 
    contractorType: String, 
    companyName: String, 
    carConfirmation: Boolean 
});

const User = mongoose.model('User', userSchema);

// Crear usuario
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, metamaskAddress, role, contractorType, companyName, carConfirmation } = req.body;
    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            metamaskAddress,
            role,
            contractorType,
            companyName,
            carConfirmation,
            contractAddress: String 
        });

        await newUser.save();
        res.status(201).json({ message: 'Registro exitoso', user: newUser });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

// Iniciar sesión
app.post('/login', async (req, res) => {
    const { metamaskAddress } = req.body; // Aquí asegúrate de que estás utilizando el nombre correcto

    // Verifica si el usuario existe en la base de datos
    const user = await User.findOne({ metamaskAddress });
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Inicio de sesión exitoso' });
});


app.get('/contracts/:userAddress', async (req, res) => {
    const userAddress = req.params.userAddress;
    try {
        const user = await User.findOne({ metamaskAddress: userAddress });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Suponiendo que tienes un campo contractAddress en el modelo User
        const contractAddress = user.contractAddress; // Asegúrate de que este campo exista

        if (!contractAddress) {
            return res.status(404).json({ message: 'Dirección de contrato no encontrada' });
        }

        res.json({ contractAddress });
    } catch (error) {
        console.error('Error al obtener la dirección del contrato:', error);
        res.status(500).json({ message: 'Error al obtener la dirección del contrato' });
    }
});


// Obtener todos los usuarios
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});

// Actualizar los datos del usuario
app.put('/user/:metamaskAddress', async (req, res) => {
    const { metamaskAddress } = req.params;
    const { firstName, lastName, email } = req.body; 

    try {
        const user = await User.findOneAndUpdate(
            { metamaskAddress },
            { firstName, lastName, email },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Información actualizada exitosamente', user });
    } catch (error) {
        console.error('Error al actualizar los datos del usuario:', error);
        res.status(500).json({ message: 'Error al actualizar los datos del usuario' });
    }
});

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
