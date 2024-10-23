// get-cert-hash.js
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Leer el certificado
const certPath = path.join(__dirname, 'cert', 'server.crt');
const certificate = fs.readFileSync(certPath);

// Generar el hash SHA-256
const hash = crypto.createHash('sha256').update(certificate).digest('hex');

console.log('Hash del certificado (SHA-256):');
console.log(hash);
