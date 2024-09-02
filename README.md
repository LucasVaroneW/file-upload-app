# Proyecto de Gestión de Archivos

Este proyecto es una aplicación de gestión de archivos que permite subir, visualizar y descargar documentos. Está construido con un backend en Node.js y un frontend en React, y ambos servicios se ejecutan en contenedores Docker.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes requisitos:

- [Docker](https://www.docker.com/)

## Configuración del Proyecto

### 1. Clonar el Repositorio

Clona este repositorio en tu máquina local:

```bash
git clone <https://github.com/LucasVaroneW/file-upload-app/>
cd <file-upload-app>
```
2. Configurar Variables de Entorno
Asegúrate de tener un archivo .env en la carpeta raíz del backend con las siguientes variables configuradas:
El archivo .env debe estar ubicado en la carpeta backend.
```bash
MONGO_URI=mongodb://localhost:27017/test_assesment
PORT=3001
```

3. Construir y Ejecutar con Docker
Usa Docker Compose para construir y ejecutar los servicios del backend y frontend:

```bash
docker-compose up --build
```
Esto descargará todas las imágenes necesarias, instalará las dependencias y ejecutará el backend y frontend.

4. Acceder a la Aplicación
Una vez que los contenedores estén en funcionamiento, puedes acceder a la aplicación en tu navegador web:

Frontend: http://localhost:3000
Backend: http://localhost:3001

Instrucciones de Uso
Subir Archivos: Ve al botón "File Upload" y selecciona un archivo para subir.
Ver Archivos Subidos: Ve a la pestaña "Uploaded Files" para ver la lista de archivos subidos, donde puedes filtrar, descargar o eliminar archivos.
Descargar Archivos: Selecciona uno o varios archivos y haz clic en "Download" para descargarlos.
Eliminar Archivos: Haz clic en el botón de "Delete" junto a cualquier archivo para eliminarlo.

Comandos Útiles
Detener los contenedores:
```bash
docker-compose down
```

Reconstruir los contenedores:
```bash
docker-compose up --build
```
### Conclusión

Gracias por revisar el proyecto de Gestión de Archivos. Este README proporciona una guía completa para configurar y ejecutar la aplicación tanto con Docker.

---

Hecho con 💻 por [Lucas Varone](https://github.com/LucasVaroneW)
