const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const mongoUri = 'mongodb+srv://gabrielgutierrezq:rlM9Eq5qjWA7S268@artemio.uowgugn.mongodb.net/ARTEMIO?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    metamaskAddress: { type: String, unique: true },
    role: { type: String, default: 'user' },
    contractorType: String,
    companyName: String,
    carConfirmation: Boolean
});
const User = mongoose.model('User', userSchema);

// Esquema y modelo de Route
const routeSchema = new mongoose.Schema({
    title: String,
    contractorAddress: String,
    origin: String,
    destination: String,
    time: String,
    price: Number
});
const Route = mongoose.model('Route', routeSchema);

// Endpoint para registrar usuario
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, metamaskAddress, contractorType, companyName, carConfirmation } = req.body;
    const role = contractorType ? 'contractor' : 'user';

    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            metamaskAddress,
            role,
            contractorType,
            companyName,
            carConfirmation
        });
        await newUser.save();
        res.status(201).json({ message: 'Registro exitoso', user: newUser });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

// Endpoint para inicio de sesión
app.post('/login', async (req, res) => {
    const { metamaskAddress } = req.body;

    try {
        const user = await User.findOne({ metamaskAddress });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            role: user.role,
            userName: `${user.firstName} ${user.lastName}`
        });
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
});

// Endpoint para crear rutas
app.post('/routes', async (req, res) => {
    const { title, destination, time, price, metamaskAddress} = req.body;

    try {
        const user = await User.findOne({ metamaskAddress });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const newRoute = new Route({
            title,
            contractorAddress: metamaskAddress,
            destination,
            time,
            price
        });

        await newRoute.save();
        res.status(201).json({ message: 'Ruta creada exitosamente', route: newRoute });
    } catch (error) {
        console.error('Error al crear la ruta:', error);
        res.status(500).json({ message: 'Error al crear la ruta' });
    }
});

// Endpoint para obtener todas las rutas
app.get('/routes', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (error) {
        console.error('Error al obtener las rutas:', error);
        res.status(500).json({ message: 'Error al obtener las rutas' });
    }
});

// Endpoint para obtener todos los usuarios
app.get('/user/:metamaskAddress', async (req, res) => {
    const { metamaskAddress } = req.params;

    try {
        const user = await User.findOne({ metamaskAddress });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
});

// Endpoint para actualizar datos del usuario
app.put('/users/:metamaskAddress', async (req, res) => {
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
