// Importaciones necesarias para el controlador
import { ObjectId } from "mongodb"; // Para manejar IDs de MongoDB
import dbClient from "../config/dbClient.js"; // Cliente de conexión a la base de datos
import cancionesModelo from "../models/canciones.js"; // Modelo de datos para canciones

/**
 * Controlador principal para manejar todas las operaciones relacionadas con canciones.
 * Contiene métodos CRUD básicos y métodos especializados para la navegación del frontend.
 * 
 * Estructura de datos en MongoDB:
 * - Colección "canciones" contiene géneros
 * - Cada género tiene álbumes anidados
 * - Cada álbum tiene canciones anidadas
 */
class cancionesController {
  constructor() {}

  /**
   * Crea una nueva canción en la base de datos
   * @param {Object} req - Request con los datos de la canción en req.body
   * @param {Object} res - Response para enviar la respuesta
   */

  /**
   * Crea una nueva canción en la base de datos
   * @param {Object} req - Request con los datos de la canción en req.body
   * @param {Object} res - Response para enviar la respuesta
   */
  async create(req, res) {
    try {
      const data = await cancionesModelo.create(req.body);
      res.status(201).json(data); // 201: Created - Recurso creado exitosamente
    } catch (error) {
      console.error("Error al crear la canción:", error.message);
      res.status(500).send("Error interno del servidor"); // 500: Internal Server Error
    }
  }

  /**
   * Actualiza una canción existente por su ID
   * @param {Object} req - Request con el ID en params y nuevos datos en body
   * @param {Object} res - Response para enviar la respuesta
   */
  async update(req, res) {
    try {
      const { id } = req.params; // Extrae el ID de los parámetros de la URL
      const data = await cancionesModelo.update(id, req.body);
      res.status(200).json(data); // 200: OK - Operación exitosa
    } catch (error) {
      console.error("Error al actualizar la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  /**
   * Elimina una canción por su ID
   * @param {Object} req - Request con el ID en params
   * @param {Object} res - Response para enviar la respuesta
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await cancionesModelo.delete(id);
      res.status(200).json(data); // Retorna información sobre la eliminación
    } catch (error) {
      console.error("Error al eliminar la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  /**
   * Obtiene todas las canciones de la base de datos
   * @param {Object} req - Request (no necesita parámetros)
   * @param {Object} res - Response con el array de canciones
   */
  async getAll(req, res) {
    try {
      const data = await cancionesModelo.getAll();
      res.status(200).json(data); // Retorna array de todas las canciones
    } catch (error) {
      console.error("Error al obtener las canciones:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  /**
   * Obtiene una canción específica por su ID
   * @param {Object} req - Request con el ID en params
   * @param {Object} res - Response con los datos de la canción
   */
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const data = await cancionesModelo.getOne(id);
      res.status(200).json(data); // Retorna objeto de la canción específica
    } catch (error) {
      console.error("Error al obtener la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  /**
   * Obtiene todas las canciones de un álbum específico
   * Método especializado para el frontend - navega la estructura anidada de MongoDB
   * @param {Object} req - Request con albumId en params
   * @param {Object} res - Response con array de canciones del álbum
   */
  async getCancionesPorAlbum(req, res) {
    try {
      const { albumId } = req.params;
      
      // Validación: Verificar que el ID sea válido para MongoDB
      if (!ObjectId.isValid(albumId)) {
        return res.status(400).json({ message: "ID de álbum inválido" }); // 400: Bad Request
      }
      
      // Buscar en la colección "canciones" (que contiene géneros)
      const colGeneros = dbClient.db.collection("canciones");
      
      // Encontrar el género que contiene el álbum con este ID
      const genero = await colGeneros.findOne({ "albumes._id": new ObjectId(albumId) });
      
      if (!genero) {
        return res.status(404).json({ message: "Álbum no encontrado" }); // 404: Not Found
      }
      
      // Buscar el álbum específico dentro del género
      const album = genero.albumes.find(a => a._id.toString() === albumId.toString());
      
      if (!album) {
        return res.status(404).json({ message: "Álbum no encontrado" });
      }
      
      // Retornar las canciones del álbum (o array vacío si no hay canciones)
      res.status(200).json(album.canciones || []);
    } catch (error) {
      console.error("Error al obtener canciones por álbum:", error);
      res.status(500).json({ message: "Error al obtener canciones por álbum", error: error.message });
    }
  }

  /**
   * Obtiene la estructura completa de la base de datos
   * Utilizado para búsquedas y operaciones que necesitan acceso a todos los datos
   * @param {Object} req - Request (no necesita parámetros)
   * @param {Object} res - Response con toda la estructura: géneros -> álbumes -> canciones
   */
  async getEstructuraCompleta(req, res) {
    try {
      const colGeneros = dbClient.db.collection("canciones");
      // Obtiene todos los documentos de la colección (estructura completa)
      const data = await colGeneros.find({}).toArray();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la estructura", error: error.message });
    }
  }

  // ===============================================
  // MÉTODOS ESPECIALIZADOS PARA EL FRONTEND CLI
  // ===============================================

  /**
   * Obtiene todos los géneros musicales disponibles
   * Método optimizado que solo retorna ID y nombre del género
   * Utilizado por el menú principal para mostrar opciones de navegación
   * @param {Object} req - Request (no necesita parámetros)
   * @param {Object} res - Response con array de géneros [{_id, genero}]
   */
  async getAllGeneros(req, res) {
    try {
      const colGeneros = dbClient.db.collection("canciones");
      
      // Proyección: Solo obtener los campos necesarios (_id y genero)
      // Esto optimiza la consulta y reduce el tráfico de red
      const generos = await colGeneros.find({}, { 
        projection: { 
          _id: 1,      // 1 = incluir campo
          genero: 1    // 1 = incluir campo
          // albumes: 0 (implícito) = excluir campo
        } 
      }).toArray();
      
      res.status(200).json(generos);
    } catch (error) {
      console.error("Error al obtener géneros:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  /**
   * Obtiene todos los álbumes de un género específico
   * Método especializado para la navegación jerárquica del frontend
   * Permite al usuario navegar: Género -> Álbumes -> Canciones
   * @param {Object} req - Request con generoId en params
   * @param {Object} res - Response con array de álbumes del género
   */
  async getAlbumesPorGenero(req, res) {
    try {
      const { generoId } = req.params;
      
      // Validación: Verificar que el ID sea un ObjectId válido de MongoDB
      if (!ObjectId.isValid(generoId)) {
        return res.status(400).json({ message: "ID de género inválido" });
      }

      const colGeneros = dbClient.db.collection("canciones");
      
      // Buscar el género específico por su _id
      const genero = await colGeneros.findOne({ _id: new ObjectId(generoId) });
      
      if (!genero) {
        return res.status(404).json({ message: "Género no encontrado" });
      }
      
      // Retornar los álbumes del género (o array vacío si no tiene álbumes)
      res.status(200).json(genero.albumes || []);
    } catch (error) {
      console.error("Error al obtener álbumes por género:", error.message);
      res.status(500).json({ message: "Error al obtener álbumes por género", error: error.message });
    }
  }
}

// Exportar una instancia única del controlador (patrón Singleton)
// Esto asegura que todas las rutas usen la misma instancia
export default new cancionesController();
