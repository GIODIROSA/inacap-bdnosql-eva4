// ===============================================
// RUTAS DE ÁLBUMES - ENDPOINTS PARA NAVEGACIÓN JERÁRQUICA
// ===============================================

import express from "express"; // Framework para crear rutas HTTP
const router = express.Router(); // Router específico para álbumes
import cancionesController from "../controllers/cancionesController.js"; // Reutiliza el controlador principal

// ===============================================
// ENDPOINTS DE ÁLBUMES MUSICALES
// ===============================================

// GET /albumes/genero/:generoId - Obtiene todos los álbumes de un género específico
// Utilizado en la navegación jerárquica: Géneros -> Álbumes -> Canciones
// Parámetros: generoId (ObjectId del género en MongoDB)
// Respuesta: Array de álbumes [{_id, titulo, canciones, ...}]
router.get("/genero/:generoId", cancionesController.getAlbumesPorGenero);

// Nota: Este router también reutiliza el cancionesController porque
// la estructura de datos está anidada en una sola colección de MongoDB:
// Colección "canciones" -> Documentos "género" -> Array "álbumes" -> Array "canciones"

// Exportar el router para ser registrado en app.js
export default router;
