const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Función para calcular el hash de un certificado
function calculateCertHash(certPath) {
    const cert = fs.readFileSync(certPath);
    return crypto.createHash('sha256').update(cert).digest('hex');
}

// Función para crear un certificado inválido
function createInvalidCert() {
    console.log('Creando certificado inválido para pruebas...');
    
    // Hacer una copia del certificado original
    const originalCert = path.join(__dirname, 'cert', 'server.crt');
    const backupCert = path.join(__dirname, 'cert', 'server.crt.backup');
    
    // Crear backup si no existe
    if (!fs.existsSync(backupCert)) {
        fs.copyFileSync(originalCert, backupCert);
        console.log('Backup del certificado original creado');
    }

    // Modificar algunos bytes del certificado
    const cert = fs.readFileSync(originalCert);
    const modifiedCert = Buffer.from(cert);
    modifiedCert[100] = modifiedCert[100] ^ 0xFF; // Invertir algunos bits
    
    // Guardar certificado modificado
    fs.writeFileSync(originalCert, modifiedCert);
    console.log('Certificado modificado guardado');
}

// Función para restaurar el certificado original
function restoreOriginalCert() {
    const originalCert = path.join(__dirname, 'cert', 'server.crt');
    const backupCert = path.join(__dirname, 'cert', 'server.crt.backup');
    
    if (fs.existsSync(backupCert)) {
        fs.copyFileSync(backupCert, originalCert);
        console.log('Certificado original restaurado');
    } else {
        console.error('No se encuentra el backup del certificado');
    }
}

// Función principal de pruebas
async function runTests() {
    console.log('Iniciando pruebas de certificados...\n');

    // 1. Calcular hash del certificado original
    const originalHash = calculateCertHash(path.join(__dirname, 'cert', 'server.crt'));
    console.log('Hash del certificado original:', originalHash);
    console.log('Copia este hash en el archivo index.html en la constante EXPECTED_CERT_HASH\n');

    // 2. Crear certificado inválido
    createInvalidCert();
    const invalidHash = calculateCertHash(path.join(__dirname, 'cert', 'server.crt'));
    console.log('Hash del certificado inválido:', invalidHash);

    // 3. Mostrar instrucciones
    console.log('\nPruebas preparadas. Sigue estos pasos:');
    console.log('1. Copia el hash original en index.html');
    console.log('2. Inicia el servidor: npm start');
    console.log('3. Intenta hacer login - debería fallar la verificación');
    console.log('4. Ejecuta este script con --restore para restaurar el certificado original');
    console.log('\nPara restaurar el certificado original:');
    console.log('node test-certificates.js --restore');
}

// Procesar argumentos de línea de comandos
if (process.argv.includes('--restore')) {
    restoreOriginalCert();
} else {
    runTests();
}
