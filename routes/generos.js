// ===============================================
// RUTAS DE GÉNEROS - ENDPOINTS PARA NAVEGACIÓN
// ===============================================

import express from "express"; // Framework para crear rutas HTTP
const router = express.Router(); // Router específico para géneros
import cancionesController from "../controllers/cancionesController.js"; // Reutiliza el controlador principal

// ===============================================
// ENDPOINTS DE GÉNEROS MUSICALES
// ===============================================

// GET /generos - Obtiene todos los géneros musicales disponibles
// Utilizado por el frontend para mostrar las opciones de navegación inicial
// Respuesta: Array de objetos [{_id, genero}]
router.get("/", cancionesController.getAllGeneros);

// Nota: Este router reutiliza métodos del cancionesController porque
// los géneros están almacenados en la misma colección que las canciones
// en una estructura anidada (géneros -> álbumes -> canciones)

// Exportar el router para ser registrado en app.js
export default router;