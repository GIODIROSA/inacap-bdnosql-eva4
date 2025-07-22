import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import cancionesModelo from "../models/canciones.js";

class cancionesController {
  constructor() {}

  async create(req, res) {
    try {
      const data = await cancionesModelo.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      console.error("Error al crear la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await cancionesModelo.update(id, req.body);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error al actualizar la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await cancionesModelo.delete(id);
      res.status(206).json(data);
    } catch (error) {
      console.error("Error al eliminar la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  async getAll(req, res) {
    try {
      const data = await cancionesModelo.getAll();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error al obtener las canciones:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const data = await cancionesModelo.getOne(id);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error al obtener la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  async getCancionesPorAlbum(req, res) {
    try {
      const { albumId } = req.params;
      if (!ObjectId.isValid(albumId)) {
        return res.status(400).json({ message: "ID de álbum inválido" });
      }
      const colGeneros = dbClient.db.collection("canciones");
      const genero = await colGeneros.findOne({ "albumes._id": new ObjectId(albumId) });
      if (!genero) {
        return res.status(404).json({ message: "Álbum no encontrado" });
      }
      const album = genero.albumes.find(a => a._id.toString() === albumId.toString());
      if (!album) {
        return res.status(404).json({ message: "Álbum no encontrado" });
      }
      res.status(200).json(album.canciones || []);
    } catch (error) {
      console.error("Error al obtener canciones por álbum:", error);
      res.status(500).json({ message: "Error al obtener canciones por álbum", error: error.message });
    }
  }

  async getEstructuraCompleta(req, res) {
    try {
      const colGeneros = dbClient.db.collection("canciones");
      const data = await colGeneros.find({}).toArray();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la estructura", error: error.message });
    }
  }

  // Métodos para géneros
  async getAllGeneros(req, res) {
    try {
      const colGeneros = dbClient.db.collection("canciones");
      const generos = await colGeneros.find({}, { 
        projection: { 
          _id: 1, 
          genero: 1 
        } 
      }).toArray();
      res.status(200).json(generos);
    } catch (error) {
      console.error("Error al obtener géneros:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  // Método para obtener álbumes por género
  async getAlbumesPorGenero(req, res) {
    try {
      const { generoId } = req.params;
      if (!ObjectId.isValid(generoId)) {
        return res.status(400).json({ message: "ID de género inválido" });
      }

      const colGeneros = dbClient.db.collection("canciones");
      const genero = await colGeneros.findOne({ _id: new ObjectId(generoId) });
      
      if (!genero) {
        return res.status(404).json({ message: "Género no encontrado" });
      }
      
      res.status(200).json(genero.albumes || []);
    } catch (error) {
      console.error("Error al obtener álbumes por género:", error.message);
      res.status(500).json({ message: "Error al obtener álbumes por género", error: error.message });
    }
  }
}

export default new cancionesController();
