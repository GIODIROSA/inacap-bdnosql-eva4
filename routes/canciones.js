// ===============================================
// RUTAS DE CANCIONES - DEFINICIÓN DE ENDPOINTS
// ===============================================

import express from "express"; // Framework para crear rutas HTTP
const route = express.Router(); // Router para agrupar rutas relacionadas
import cancionesController from "../controllers/cancionesController.js"; // Controlador con la lógica

// ===============================================
// ENDPOINTS CRUD BÁSICOS
// ===============================================

// POST /canciones - Crear una nueva canción
route.post("/", cancionesController.create);

// GET /canciones/:id - Obtener una canción específica por ID
route.get("/:id", cancionesController.getOne);

// GET /canciones - Obtener todas las canciones
route.get("/", cancionesController.getAll);

// PUT /canciones/:id - Actualizar una canción existente
route.put("/:id", cancionesController.update);

// DELETE /canciones/:id - Eliminar una canción
route.delete("/:id", cancionesController.delete);

// ===============================================
// ENDPOINTS ESPECIALIZADOS PARA EL FRONTEND
// ===============================================

// GET /canciones/album/:albumId - Obtener canciones de un álbum específico
// Utilizado por el menu.js para navegación jerárquica
route.get("/album/:albumId", cancionesController.getCancionesPorAlbum);

// GET /canciones/estructura-completa - Obtener toda la estructura de datos
// Utilizado para búsquedas y operaciones que necesitan acceso completo
route.get("/estructura-completa", cancionesController.getEstructuraCompleta);

// Exportar el router para ser usado en app.js
export default route;