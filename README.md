# Aplicación de Login Seguro con SSL Pinning

Esta aplicación implementa un sistema de login seguro utilizando SSL Pinning y certificados autofirmados. Está diseñada para funcionar tanto en navegadores de escritorio como en dispositivos móviles.

## Características

- ✅ Autenticación de usuarios
- 🔒 SSL Pinning
- 📱 Diseño responsive
- 🔑 Certificados SSL autofirmados
- 🚀 Express.js backend
- 💻 Interfaz de usuario moderna

## Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- OpenSSL (para generar certificados)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/JavAndresBermudez/secure-login-app.git
cd secure-login-app
```

2. Instalar dependencias:
```bash
npm install
```

3. Generar certificados SSL:
```bash
chmod +x generate-cert.sh
./generate-cert.sh
```

4. Generar y configurar el hash del certificado:
```bash
node get-cert-hash.js
```
   - Copiar el hash generado
   - Pegar el hash en `public/index.html` en la constante `EXPECTED_CERT_HASH`

5. Verificar entorno:
```bash
node check-environment.js
```

6. Iniciar el servidor:
```bash
npm start
```

## Estructura del Proyecto

```
secure-login-app/
├── cert/                  # Directorio de certificados SSL
│   ├── server.key
│   └── server.crt
├── public/               # Archivos estáticos
│   └── index.html       # Interfaz de usuario
├── generate-cert.sh      # Script para generar certificados
├── get-cert-hash.js      # Script para obtener hash del certificado
├── check-environment.js # Script para verificador el entorno
├── server.js            # Servidor Express
├── package.json         # Configuración del proyecto
└── README.md           # Esta documentación
```

## Usuarios Predeterminados

La aplicación viene con los siguientes usuarios de prueba:

| Usuario   | Contraseña |
|-----------|------------|
| admin     | admin123   |
| usuario1  | pass123    |
| usuario2  | secure456  |

## Uso

### Acceso Local
La aplicación estará disponible en `https://localhost:3000`

### Acceso desde Dispositivos Móviles
1. Asegúrate de que tu dispositivo móvil esté en la misma red que el servidor
2. Accede usando la IP de tu computadora: `https://[IP-DEL-SERVIDOR]:3000`
3. Acepta el certificado autofirmado en tu dispositivo

## Seguridad

### SSL Pinning
La aplicación implementa SSL Pinning para prevenir ataques man-in-the-middle:
- El hash del certificado se verifica en cada conexión
- Las conexiones con certificados no reconocidos son rechazadas
- El sistema alerta sobre posibles problemas de seguridad

### Renovación de Certificados
Cuando necesites renovar los certificados:
1. Ejecuta `./generate-cert.sh` para generar nuevos certificados
2. Ejecuta `node get-cert-hash.js` para obtener el nuevo hash
3. Actualiza `EXPECTED_CERT_HASH` en `index.html`

## Desarrollo

### Configuración del Entorno de Desarrollo
1. Instala las dependencias de desarrollo:
```bash
npm install --save-dev nodemon
```

2. Modifica `package.json` para incluir script de desarrollo:
```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

3. Inicia el servidor en modo desarrollo:
```bash
npm run dev
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu función (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
