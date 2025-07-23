// ===============================================
// RUTAS DE PLAYLISTS - GESTIÓN DE COLECCIONES MUSICALES
// ===============================================

import { Router } from "express"; // Router de Express para agrupar rutas
import playlistsController from "../controllers/playlistsController.js"; // Controlador con la lógica

const router = Router(); // Instancia del router para playlists

// ===============================================
// ENDPOINTS CRUD DE PLAYLISTS
// ===============================================

// GET /playlists - Obtener todas las playlists
// Utilizado por el frontend para mostrar la lista de playlists disponibles
router.get("/", playlistsController.getAll);

// GET /playlists/:id - Obtener una playlist específica con todas sus canciones
// Utilizado para mostrar detalles completos y contenido de la playlist
router.get("/:id", playlistsController.getOne);

// POST /playlists - Crear una nueva playlist
// Body: {nombre: string, canciones?: array}
router.post("/", playlistsController.create);

// ===============================================
// ENDPOINTS DE GESTIÓN DE CANCIONES EN PLAYLISTS
// ===============================================

// POST /playlists/:id/canciones - Agregar una canción a la playlist
// Body: {titulo: string, artista?: string, album?: string, ...}
router.post("/:id/canciones", playlistsController.addSong);

// PUT /playlists/:id/canciones/:index - Editar una canción específica en la playlist
// Params: id (playlist), index (posición de la canción)
// Body: nuevos datos de la canción
router.put("/:id/canciones/:index", playlistsController.updateSong);

// DELETE /playlists/:id/canciones/:index - Eliminar una canción específica de la playlist
// Params: id (playlist), index (posición de la canción a eliminar)
router.delete("/:id/canciones/:index", playlistsController.deleteSong);

// ===============================================
// ENDPOINTS DE GESTIÓN DE PLAYLISTS
// ===============================================

// PUT /playlists/:id - Renombrar una playlist
// Body: {nombre: string}
router.put("/:id", playlistsController.renamePlaylist);

// DELETE /playlists/:id - Eliminar completamente una playlist
// Elimina la playlist y todas sus canciones
router.delete("/:id", playlistsController.deletePlaylist);

// Exportar el router para ser registrado en app.js
export default router;