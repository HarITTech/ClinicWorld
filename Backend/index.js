const express = require('express');
const connection = require('./config');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const deleteAppointments = require('./helpers/autoDeleteExpiredAppointments');
const nodeCron = require('./helpers/node-cron');

const app = express();
app.use(express.json());

// ✅ Setup CORS
app.use(cors({
    // origin: ['http://localhost:4200', 'http://192.168.31.215:4200/', 'https://clinic-world-dbyxuca19-aditya-hedaus-projects.vercel.app'], // <-- Angular default port
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// app.options('*', cors());

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const doctorRoutes = require('./routes/doctors');
app.use('/doctors', doctorRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

// deleteAppointments.autoDeleteExpiredAppointments();
nodeCron();

const PORT = process.env.PORT || 4900;

app.listen(PORT, '0.0.0.0', async () => {
    try {
        await connection;
        console.log(`Server in running on http://localhost:${PORT}`);
        app.get('/', (req, res) => {
            res.send('Backend is running fine!');
        });
    } catch (error) {
        console.log(error.message);
    }
})