import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";
import albumesModelo from "../models/albumes.js";

class albumesController {
  async create(req, res) {
    try {
      const data = await albumesModelo.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async getAll(req, res) {
    try {
      const data = await albumesModelo.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async getByGenero(req, res) {
    try {
      const { generoId } = req.params;
      console.log("Buscando álbumes para género:", generoId);
      // Validar que el ID es válido
      if (!ObjectId.isValid(generoId)) {
        return res.status(400).json({ message: "ID de género inválido" });
      }
      const colGeneros = dbClient.db.collection("canciones");
      const genero = await colGeneros.findOne({ _id: new ObjectId(generoId) });
      console.log("Resultado de la búsqueda:", genero);
      if (!genero) {
        return res.status(404).json({ message: "Género no encontrado" });
      }
      res.status(200).json(genero.albumes || []);
    } catch (error) {
      console.error("Error en getByGenero:", error);
      res.status(500).json({ message: "Error al obtener álbumes", error: error.message });
    }
  }
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const data = await albumesModelo.getOne(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await albumesModelo.update(id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await albumesModelo.delete(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
}

export default new albumesController();