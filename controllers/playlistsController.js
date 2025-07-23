// ===============================================
// CONTROLADOR DE PLAYLISTS - GESTIÓN DE COLECCIONES MUSICALES
// ===============================================

import playlistsModelo from "../models/playlists.js"; // Modelo de datos para playlists

/**
 * Controlador especializado para manejar todas las operaciones relacionadas con playlists.
 * Las playlists son colecciones personalizadas de canciones creadas por los usuarios.
 * 
 * Funcionalidades principales:
 * - CRUD completo de playlists
 * - Gestión de canciones dentro de playlists (agregar, editar, eliminar)
 * - Renombrado de playlists
 * 
 * Estructura de datos de playlist:
 * {
 *   _id: ObjectId,
 *   nombre: String,
 *   canciones: [{ titulo, artista, album, ... }]
 * }
 */
class playlistsController {
  /**
   * Obtiene todas las playlists existentes
   * Utilizado por el frontend para mostrar la lista completa de playlists disponibles
   * @param {Object} req - Request (no necesita parámetros)
   * @param {Object} res - Response con array de todas las playlists
   */
  async getAll(req, res) {
    try {
      const data = await playlistsModelo.getAll();
      res.json(data); // Retorna array de playlists con sus canciones
    } catch (error) {
      res.status(500).send("Error al obtener playlists"); // 500: Internal Server Error
    }
  }

  /**
   * Obtiene una playlist específica por su ID
   * Utilizado para mostrar detalles completos de una playlist, incluyendo todas sus canciones
   * @param {Object} req - Request con el ID de la playlist en params
   * @param {Object} res - Response con los datos completos de la playlist
   */
  async getOne(req, res) {
    try {
      const { id } = req.params; // Extrae el ID de la URL
      const data = await playlistsModelo.getOne(id);
      
      if (!data) return res.status(404).send("Playlist no encontrada"); // 404: Not Found
      
      res.json(data); // Retorna la playlist con todas sus canciones
    } catch (error) {
      res.status(500).send("Error al obtener la playlist");
    }
  }

  /**
   * Crea una nueva playlist
   * Valida que tenga nombre y inicializa el array de canciones vacío si no se proporciona
   * @param {Object} req - Request con los datos de la playlist en body {nombre, canciones?}
   * @param {Object} res - Response confirmando la creación
   */
  async create(req, res) {
    try {
      const playlist = req.body;
      
      // Validación: El nombre es obligatorio
      if (!playlist.nombre) return res.status(400).send("Falta el nombre de la playlist"); // 400: Bad Request
      
      // Crear playlist con array de canciones vacío si no se proporciona
      await playlistsModelo.create({ ...playlist, canciones: playlist.canciones || [] });
      res.status(201).send("Playlist creada"); // 201: Created
    } catch (error) {
      res.status(500).send("Error al crear la playlist");
    }
  }

  /**
   * Agrega una nueva canción a una playlist existente
   * Funcionalidad principal del sistema - permite a los usuarios construir sus colecciones
   * @param {Object} req - Request con playlistId en params y datos de canción en body
   * @param {Object} res - Response confirmando que la canción fue agregada
   */
  async addSong(req, res) {
    try {
      const { id } = req.params; // ID de la playlist
      const cancion = req.body;   // Datos de la canción a agregar
      
      // Validación: El título de la canción es obligatorio
      if (!cancion.titulo) return res.status(400).send("Falta el título de la canción");
      
      // Agregar la canción al array de canciones de la playlist
      const result = await playlistsModelo.addSongToPlaylist(id, cancion);
      
      // Verificar si la playlist fue encontrada y modificada
      if (result.modifiedCount === 0) return res.status(404).send("Playlist no encontrada");
      
      res.status(201).send("Canción agregada"); // 201: Created
    } catch (error) {
      res.status(500).send("Error al agregar la canción");
    }
  }

  /**
   * Actualiza/edita una canción específica dentro de una playlist
   * Permite modificar los datos de una canción ya existente en la playlist
   * @param {Object} req - Request con playlistId e index en params, nuevos datos en body
   * @param {Object} res - Response confirmando la actualización
   */
  async updateSong(req, res) {
    try {
      const { id, index } = req.params; // ID de playlist e índice de la canción
      const nuevaCancion = req.body;     // Nuevos datos de la canción
      
      // Verificar que la playlist existe
      const playlist = await playlistsModelo.getOne(id);
      if (!playlist) return res.status(404).send("Playlist no encontrada");
      
      // Verificar que la canción existe en el índice especificado
      if (!playlist.canciones || !playlist.canciones[index]) {
        return res.status(404).send("Canción no encontrada en la playlist");
      }
      
      // Actualizar la canción en el índice específico
      await playlistsModelo.updateSongInPlaylist(id, index, nuevaCancion);
      res.status(200).send("Canción actualizada"); // 200: OK
    } catch (error) {
      res.status(500).send("Error al actualizar la canción");
    }
  }

  /**
   * Elimina una canción específica de una playlist
   * Remueve la canción del array de canciones basándose en su índice
   * @param {Object} req - Request con playlistId e index en params
   * @param {Object} res - Response confirmando la eliminación
   */
  async deleteSong(req, res) {
    try {
      const { id, index } = req.params; // ID de playlist e índice de la canción
      
      // Verificar que la playlist existe
      const playlist = await playlistsModelo.getOne(id);
      if (!playlist) return res.status(404).send("Playlist no encontrada");
      
      // Verificar que la canción existe en el índice especificado
      if (!playlist.canciones || !playlist.canciones[index]) {
        return res.status(404).send("Canción no encontrada en la playlist");
      }
      
      // Eliminar la canción del array
      await playlistsModelo.deleteSongFromPlaylist(id, index);
      res.status(200).send("Canción eliminada"); // 200: OK
    } catch (error) {
      res.status(500).send("Error al eliminar la canción");
    }
  }

  /**
   * Renombra una playlist existente
   * Permite a los usuarios cambiar el nombre de sus playlists sin afectar las canciones
   * @param {Object} req - Request con playlistId en params y {nombre} en body
   * @param {Object} res - Response confirmando el renombrado
   */
  async renamePlaylist(req, res) {
    try {
      const { id } = req.params;   // ID de la playlist a renombrar
      const { nombre } = req.body; // Nuevo nombre para la playlist
      
      // Validación: El nuevo nombre es obligatorio
      if (!nombre) return res.status(400).send("Falta el nombre");
      
      // Actualizar solo el campo nombre de la playlist
      const result = await playlistsModelo.renamePlaylist(id, nombre);
      
      // Verificar si la playlist fue encontrada y modificada
      if (result.modifiedCount === 0) return res.status(404).send("Playlist no encontrada");
      
      res.status(200).send("Playlist renombrada"); // 200: OK
    } catch (error) {
      res.status(500).send("Error al renombrar la playlist");
    }
  }

  /**
   * Elimina completamente una playlist y todas sus canciones
   * Operación destructiva que remueve la playlist de la base de datos
   * @param {Object} req - Request con playlistId en params
   * @param {Object} res - Response confirmando la eliminación
   */
  async deletePlaylist(req, res) {
    try {
      const { id } = req.params; // ID de la playlist a eliminar
      
      // Eliminar la playlist completa de la base de datos
      const result = await playlistsModelo.deletePlaylist(id);
      
      // Verificar si la playlist fue encontrada y eliminada
      if (result.deletedCount === 0) return res.status(404).send("Playlist no encontrada");
      
      res.status(200).send("Playlist eliminada"); // 200: OK
    } catch (error) {
      res.status(500).send("Error al eliminar la playlist");
    }
  }
}

// Exportar una instancia única del controlador (patrón Singleton)
// Esto asegura que todas las rutas de playlists usen la misma instancia
export default new playlistsController();