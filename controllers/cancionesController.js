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
}

export default new cancionesController();
