// ===============================================
// SERVIDOR PRINCIPAL - API REST VINYLROAR
// ===============================================

// Configuración de variables de entorno
import "dotenv/config"; // Carga automáticamente las variables del archivo .env

// Importaciones del framework y rutas
import express from "express"; // Framework web para Node.js
import routeCanciones from "./routes/canciones.js"; // Rutas para operaciones con canciones
import routerPlaylists from "./routes/playlists.js"; // Rutas para gestión de playlists
import generosRouter from "./routes/generos.js"; // Rutas para operaciones con géneros
import albumesRouter from "./routes/albumes.js"; // Rutas para operaciones con álbumes

// Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 8080; // Puerto del servidor (desde .env o 8080 por defecto)

// ===============================================
// CONFIGURACIÓN DE MIDDLEWARES
// ===============================================

// Middleware para parsear JSON en las peticiones
// Reemplaza la funcionalidad de body-parser (incluido en Express desde v4.16+)
app.use(express.json());

// Middleware para parsear datos de formularios URL-encoded
// extended: true permite objetos anidados y arrays
app.use(express.urlencoded({ extended: true }));

// ===============================================
// CONFIGURACIÓN DE RUTAS DE LA API
// ===============================================

// Registrar las rutas con sus prefijos correspondientes
app.use("/canciones", routeCanciones);   // Endpoints: /canciones/*
app.use("/playlists", routerPlaylists);  // Endpoints: /playlists/*
app.use("/generos", generosRouter);      // Endpoints: /generos/*
app.use("/albumes", albumesRouter);      // Endpoints: /albumes/*

// Ruta raíz - Endpoint de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.send("¡Hola desde el servidor Express en localhost: 8080!");
});

// ===============================================
// INICIALIZACIÓN DEL SERVIDOR
// ===============================================

// Iniciar el servidor HTTP en el puerto especificado
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
  .on('error', (error) => console.log('Error al iniciar el servidor:', error.message));

// Exportar la instancia de la aplicación (útil para testing)
export default app;
