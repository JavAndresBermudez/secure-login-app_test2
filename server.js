const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(express.static('public'));

// Usuarios predeterminados
const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'usuario1', password: 'pass123' },
    { username: 'usuario2', password: 'secure456' }
];

// Configuración SSL
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.crt'))
};

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener el certificado (para SSL Pinning)
app.get('/cert/server.crt', (req, res) => {
    res.sendFile(path.join(__dirname, 'cert', 'server.crt'));
});

// Endpoint de autenticación
app.post('/auth', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ success: true, message: 'Login exitoso' });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
});

// Iniciar servidor HTTPS
const server = https.createServer(sslOptions, app);
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Servidor seguro corriendo en https://localhost:${PORT}`);
    console.log('Para acceder desde otros dispositivos, usa la IP de tu computadora');
});
