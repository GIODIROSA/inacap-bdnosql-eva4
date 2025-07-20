import playlistsModelo from "../models/playlists.js";

class playlistsController {
  async create(req, res) {
    try {
      const data = await playlistsModelo.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async getAll(req, res) {
    try {
      const data = await playlistsModelo.getAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const data = await playlistsModelo.getOne(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await playlistsModelo.update(id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await playlistsModelo.delete(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async addCancion(req, res) {
    try {
      const { id } = req.params;
      const { cancionId } = req.body;
      const data = await playlistsModelo.addCancion(id, cancionId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async removeCancion(req, res) {
    try {
      const { id } = req.params;
      const { cancionId } = req.body;
      const data = await playlistsModelo.removeCancion(id, cancionId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
}

export default new playlistsController();