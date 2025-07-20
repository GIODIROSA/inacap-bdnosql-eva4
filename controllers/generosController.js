import generosModelo from "../models/generos.js";

class generosController {
  async create(req, res) {
    try {
      const data = await generosModelo.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async getAll(req, res) {
    try {
      const data = await generosModelo.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const data = await generosModelo.getOne(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await generosModelo.update(id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await generosModelo.delete(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
}

export default new generosController();