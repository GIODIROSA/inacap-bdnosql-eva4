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
      res.status(200).json({ status: "ok update" });
    } catch (error) {
      console.error("Error al actualizar la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  async delete(req, res) {
    try {
      res.status(200).json({ status: "ok delete" });
    } catch (error) {
      console.error("Error al eliminar la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  async getAll(req, res) {
    try {
      res.status(200).json({ status: "ok getAll" });
    } catch (error) {
      console.error("Error al obtener las canciones:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }

  async getOne(req, res) {
    try {
      res.status(200).send(`Canción con ID: ${req.params.id}`);
    } catch (error) {
      console.error("Error al obtener la canción:", error.message);
      res.status(500).send("Error interno del servidor");
    }
  }
}

export default new cancionesController();
