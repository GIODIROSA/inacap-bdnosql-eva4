# 🎵 VinylRoar - Sistema de Gestión Musical

## 📋 Descripción

VinylRoar es una aplicación de gestión musical desarrollada con Node.js que permite explorar una base de datos de canciones organizadas por géneros y álbumes, así como gestionar playlists personalizadas. El proyecto utiliza MongoDB como base de datos y ofrece una interfaz de línea de comandos interactiva.

## 🏗️ Arquitectura del Proyecto

### **Tecnologías Utilizadas**

- **Backend**: Node.js con Express.js
- **Base de Datos**: MongoDB Atlas
- **Frontend**: CLI interactivo con Inquirer.js
- **HTTP Client**: Axios
- **Configuración**: dotenv
- **Desarrollo**: Nodemon

### **Estructura del Proyecto**

```
inacap-bdnosql-eva4/
├── 📄 app.js                    # Servidor Express principal
├── 📄 menu.js                   # Cliente CLI interactivo
├── 📄 package.json              # Dependencias y scripts
├── 📄 .env                      # Variables de entorno
├── 📄 nodemon.json              # Configuración de Nodemon
├── 📁 config/
│   └── dbClient.js              # Configuración de MongoDB
├── 📁 controllers/
│   ├── cancionesController.js   # Lógica de canciones y géneros
│   └── playlistsController.js   # Lógica de playlists
├── 📁 models/
│   ├── canciones.js             # Modelo de canciones
│   └── playlists.js             # Modelo de playlists
└── 📁 routes/
    ├── albumes.js               # Rutas de álbumes
    ├── canciones.js             # Rutas de canciones
    ├── generos.js               # Rutas de géneros
    └── playlists.js             # Rutas de playlists
```

## 🚀 Instalación y Configuración

### **Requisitos Previos**

- Node.js v14 o superior
- npm o yarn
- Cuenta en MongoDB Atlas (gratis)

### **Pasos de Instalación**

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/GIODIROSA/inacap-bdnosql-eva4.git
   cd inacap-bdnosql-eva4
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   # Configuración de la base de datos MongoDB
   USER_DATABASE=tu_usuario_mongodb
   PASSWORD_DATABASE=tu_password_mongodb
   SERVER_DB=tu_cluster.mongodb.net

   # URL de la API para el frontend
   URL_INICIAL=http://localhost:8080

   # Puerto del servidor
   PORT=8080
   ```

4. **Configurar MongoDB Atlas**
   - Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crear un cluster gratuito
   - Crear usuario de base de datos
   - Configurar acceso de red (0.0.0.0/0 para desarrollo)
   - Obtener cadena de conexión

## 🎮 Uso de la Aplicación

### **Iniciar el Servidor**

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start
```

### **Ejecutar Cliente Interactivo**

```bash
# En otra terminal
node menu.js
```

## 📚 API Endpoints

### **Géneros**
- `GET /generos` - Obtener todos los géneros
- `GET /generos/:id` - Obtener género específico

### **Álbumes**
- `GET /albumes/genero/:generoId` - Obtener álbumes por género

### **Canciones**
- `GET /canciones` - Obtener todas las canciones
- `GET /canciones/:id` - Obtener canción específica
- `POST /canciones` - Crear nueva canción
- `PUT /canciones/:id` - Actualizar canción
- `DELETE /canciones/:id` - Eliminar canción
- `GET /canciones/album/:albumId` - Obtener canciones por álbum
- `GET /canciones/estructura-completa` - Obtener estructura completa

### **Playlists**
- `GET /playlists` - Obtener todas las playlists
- `GET /playlists/:id` - Obtener playlist específica
- `POST /playlists` - Crear nueva playlist
- `PUT /playlists/:id` - Actualizar playlist
- `DELETE /playlists/:id` - Eliminar playlist
- `POST /playlists/:id/canciones` - Agregar canción a playlist
- `PUT /playlists/:id/canciones/:index` - Actualizar canción en playlist
- `DELETE /playlists/:id/canciones/:index` - Eliminar canción de playlist

## 🎯 Funcionalidades

### **🎭 Exploración de Música**
- Navegar por géneros musicales
- Explorar álbumes por género
- Visualizar canciones de álbumes
- Interfaz intuitiva con navegación por flechas

### **🎵 Gestión de Playlists**
- **Crear** nuevas playlists
- **Ver** todas las playlists con sus canciones
- **Agregar canciones** con tres métodos:
  - 📁 Navegación por géneros → álbumes → canciones
  - 🔍 Búsqueda por título o artista
  - ✏️ Entrada manual de información
- **Editar** canciones en playlists
- **Eliminar** canciones de playlists
- **Renombrar** playlists
- **Eliminar** playlists completas

### **🔍 Búsqueda Avanzada**
- Búsqueda en tiempo real por título
- Búsqueda por artista
- Filtrado case-insensitive
- Resultados con información completa (género, álbum)

## 📊 Estructura de Datos

### **Géneros (Colección: canciones)**
```javascript
{
  _id: ObjectId,
  genero: String,
  albumes: [
    {
      _id: ObjectId,
      titulo: String,
      canciones: [
        {
          titulo: String,
          artista: String,
          duracion: String
        }
      ]
    }
  ]
}
```

### **Playlists (Colección: playlists)**
```javascript
{
  _id: ObjectId,
  nombre: String,
  canciones: [
    {
      titulo: String,
      artista: String,
      album: String
    }
  ]
}
```

## 🛠️ Scripts Disponibles

```json
{
  "start": "node app.js",
  "dev": "nodemon app.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## 📦 Dependencias

### **Producción**
- `express: ^5.1.0` - Framework web
- `mongodb: ^6.17.0` - Driver oficial de MongoDB
- `mongoose: ^8.16.3` - ODM para MongoDB
- `axios: ^1.10.0` - Cliente HTTP
- `inquirer: ^12.8.1` - CLI interactivo
- `body-parser: ^2.2.0` - Parser de cuerpo HTTP
- `dotenv: ^17.2.0` - Variables de entorno

### **Desarrollo**
- `nodemon: ^3.1.10` - Auto-reload en desarrollo

## 🧪 Testing

Para probar la aplicación:

1. **Iniciar servidor**: `npm start`
2. **Verificar API**: Probar endpoints con herramientas como Postman
3. **Probar frontend**: Ejecutar `node menu.js` y navegar por las opciones

### **Endpoints de Prueba**
```bash
# Probar géneros
curl http://localhost:8080/generos

# Probar playlists  
curl http://localhost:8080/playlists

# Probar estructura completa
curl http://localhost:8080/canciones/estructura-completa
```

## 🐛 Resolución de Problemas

### **Error: "res.data.map is not a function"**
- **Causa**: Servidor no iniciado o credenciales incorrectas
- **Solución**: 
  1. Verificar que el servidor esté ejecutándose
  2. Revisar credenciales en `.env`
  3. Reinstalar dependencias: `npm install`

### **Error de conexión a MongoDB**
- **Causa**: Credenciales incorrectas o IP no autorizada
- **Solución**:
  1. Verificar credenciales en MongoDB Atlas
  2. Autorizar IP en Network Access
  3. Verificar cadena de conexión

### **Puerto en uso**
- **Causa**: Puerto 8080 ocupado
- **Solución**: Cambiar `PORT` en `.env` o cerrar proceso que usa el puerto

## 👥 Colaboradores

- **Desarrollador Principal**: [GIODIROSA](https://github.com/GIODIROSA)
- **Repositorio**: [inacap-bdnosql-eva4](https://github.com/GIODIROSA/inacap-bdnosql-eva4)

## 📄 Licencia

Este proyecto utiliza la licencia ISC.

## 🚀 Futuras Mejoras

- [ ] Interfaz web con React/Vue
- [ ] Autenticación de usuarios
- [ ] Reproducción de audio
- [ ] Importación/exportación de playlists
- [ ] Sistema de recomendaciones
- [ ] API REST completa con documentación Swagger
- [ ] Tests unitarios e integración
- [ ] Dockerización del proyecto

---

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, crear un issue en el repositorio de GitHub.

**¡Disfruta explorando tu música con VinylRoar! 🎵**
