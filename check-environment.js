const fs = require('fs');
const path = require('path');

function checkEnvironment() {
    console.log('Verificando entorno...\n');

    // Verificar versión de Node.js
    const nodeVersion = process.version;
    console.log(`Versión de Node.js: ${nodeVersion}`);
    if (nodeVersion.slice(1).split('.')[0] < 14) {
        console.error('⚠️  Se requiere Node.js versión 14 o superior');
        process.exit(1);
    }

    // Verificar existencia de directorios
    const directories = ['cert', 'public'];
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            console.log(`Creando directorio: ${dir}`);
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Verificar package.json
    if (!fs.existsSync('package.json')) {
        console.error('⚠️  No se encontró package.json');
        process.exit(1);
    }

    // Verificar node_modules
    if (!fs.existsSync('node_modules')) {
        console.error('⚠️  No se encontró node_modules. Ejecuta: npm install');
        process.exit(1);
    }

    // Verificar certificados SSL
    const certFiles = ['server.crt', 'server.key'];
    const missingCerts = certFiles.filter(file => 
        !fs.existsSync(path.join('cert', file))
    );

    if (missingCerts.length > 0) {
        console.error('⚠️  Faltan certificados SSL:', missingCerts.join(', '));
        console.log('Ejecuta: ./generate-cert.sh');
        process.exit(1);
    }

    console.log('\n✅ Entorno verificado correctamente');
}

checkEnvironment();
