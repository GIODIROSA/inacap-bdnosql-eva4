import playlistsModelo from "../models/playlists.js";

class playlistsController {
  async getAll(req, res) {
    try {
      const data = await playlistsModelo.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).send("Error al obtener playlists");
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const data = await playlistsModelo.getOne(id);
      if (!data) return res.status(404).send("Playlist no encontrada");
      res.json(data);
    } catch (error) {
      res.status(500).send("Error al obtener la playlist");
    }
  }

  async create(req, res) {
    try {
      const playlist = req.body;
      if (!playlist.nombre) return res.status(400).send("Falta el nombre de la playlist");
      await playlistsModelo.create({ ...playlist, canciones: playlist.canciones || [] });
      res.status(201).send("Playlist creada");
    } catch (error) {
      res.status(500).send("Error al crear la playlist");
    }
  }

  async addSong(req, res) {
    try {
      const { id } = req.params;
      const cancion = req.body;
      if (!cancion.titulo) return res.status(400).send("Falta el título de la canción");
      const result = await playlistsModelo.addSongToPlaylist(id, cancion);
      if (result.modifiedCount === 0) return res.status(404).send("Playlist no encontrada");
      res.status(201).send("Canción agregada");
    } catch (error) {
      res.status(500).send("Error al agregar la canción");
    }
  }

  async updateSong(req, res) {
    try {
      const { id, index } = req.params;
      const nuevaCancion = req.body;
      const playlist = await playlistsModelo.getOne(id);
      if (!playlist) return res.status(404).send("Playlist no encontrada");
      if (!playlist.canciones || !playlist.canciones[index]) return res.status(404).send("Canción no encontrada en la playlist");
      await playlistsModelo.updateSongInPlaylist(id, index, nuevaCancion);
      res.status(200).send("Canción actualizada");
    } catch (error) {
      res.status(500).send("Error al actualizar la canción");
    }
  }

  async deleteSong(req, res) {
    try {
      const { id, index } = req.params;
      const playlist = await playlistsModelo.getOne(id);
      if (!playlist) return res.status(404).send("Playlist no encontrada");
      if (!playlist.canciones || !playlist.canciones[index]) return res.status(404).send("Canción no encontrada en la playlist");
      await playlistsModelo.deleteSongFromPlaylist(id, index);
      res.status(200).send("Canción eliminada");
    } catch (error) {
      res.status(500).send("Error al eliminar la canción");
    }
  }

  async renamePlaylist(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      if (!nombre) return res.status(400).send("Falta el nombre");
      const result = await playlistsModelo.renamePlaylist(id, nombre);
      if (result.modifiedCount === 0) return res.status(404).send("Playlist no encontrada");
      res.status(200).send("Playlist renombrada");
    } catch (error) {
      res.status(500).send("Error al renombrar la playlist");
    }
  }

  async deletePlaylist(req, res) {
    try {
      const { id } = req.params;
      const result = await playlistsModelo.deletePlaylist(id);
      if (result.deletedCount === 0) return res.status(404).send("Playlist no encontrada");
      res.status(200).send("Playlist eliminada");
    } catch (error) {
      res.status(500).send("Error al eliminar la playlist");
    }
  }
}

export default new playlistsController();