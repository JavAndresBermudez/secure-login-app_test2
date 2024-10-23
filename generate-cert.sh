#!/bin/bash

# Crear directorio para certificados
mkdir -p cert

# Generar certificado autofirmado
openssl req -x509 \
    -newkey rsa:4096 \
    -keyout cert/server.key \
    -out cert/server.crt \
    -days 365 \
    -nodes \
    -subj "/C=ES/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

# Ajustar permisos
chmod 600 cert/server.key
chmod 644 cert/server.crt

echo "Certificados generados exitosamente en el directorio 'cert/'"
