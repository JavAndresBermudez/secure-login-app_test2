const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Verificación de existencia de certificados
const certPath = path.join(__dirname, 'cert', 'server.crt');
const keyPath = path.join(__dirname, 'cert', 'server.key');

// Verificar si los certificados existen
if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.error('Error: Certificados SSL no encontrados.');
    console.log('Por favor, ejecuta primero el script generate-cert.sh');
    process.exit(1);
}

const app = express();

// Verificar que los directorios necesarios existan
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Directorio public creado');
}

// Middleware para parsear JSON con manejo de errores
app.use(bodyParser.json({
    limit: '1mb',
    strict: true,
    type: 'application/json'
}));
app.use(express.static('public'));

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error en la aplicación:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Usuarios predeterminados
const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'usuario1', password: 'pass123' },
    { username: 'usuario2', password: 'secure456' }
];

// Configuración SSL con manejo de errores
let sslOptions;
try {
    sslOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    };
} catch (error) {
    console.error('Error al cargar los certificados SSL:', error);
    process.exit(1);
}

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener el certificado
app.get('/cert/server.crt', (req, res) => {
    res.sendFile(certPath);
});

// Endpoint de autenticación
app.post('/auth', (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Usuario y contraseña son requeridos' 
            });
        }

        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            res.json({ success: true, message: 'Login exitoso' });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Iniciar servidor HTTPS con manejo de errores
const server = https.createServer(sslOptions, app);
const PORT = process.env.PORT || 3000;

server.on('error', (error) => {
    console.error('Error en el servidor:', error);
    process.exit(1);
});

try {
    server.listen(PORT, () => {
        console.log(`Servidor seguro corriendo en https://localhost:${PORT}`);
        console.log('Para acceder desde otros dispositivos, usa la IP de tu computadora');
    });
} catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
}

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('Recibida señal SIGTERM. Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
    process.exit(1);
});
