const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db/connection');
const fileRoutes = require('./routes/fileRoutes'); // Importa el router

const app = express();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Conectar a MongoDB
connectDB(MONGO_URI);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar el router para las rutas
app.use('/', fileRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
