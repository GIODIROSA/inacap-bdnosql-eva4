import dbClient from "../config/dbClient.js";
import { ObjectId } from "mongodb";

class playlistsModelo {
  // Obtener todas las playlists
  async getAll() {
    const col = dbClient.db.collection("playlists");
    return await col.find({}).toArray();
  }
  // Obtener una playlist por ID
  async getOne(id) {
    const col = dbClient.db.collection("playlists");
    return await col.findOne({ _id: new ObjectId(id) });
  }
  // Obtener una playlist por nombre
  async create(playlist) {
    const col = dbClient.db.collection("playlists");
    return await col.insertOne(playlist);
  }
  
  async addSongToPlaylist(playlistId, cancion) {
    const col = dbClient.db.collection("playlists");
    return await col.updateOne(
      { _id: new ObjectId(playlistId) },
      { $push: { canciones: cancion } }
    );
  }

  async updateSongInPlaylist(playlistId, songIndex, nuevaCancion) {
    const col = dbClient.db.collection("playlists");
    const updateField = {};
    updateField[`canciones.${songIndex}`] = nuevaCancion;
    return await col.updateOne(
      { _id: new ObjectId(playlistId) },
      { $set: updateField }
    );
  }

  async deleteSongFromPlaylist(playlistId, songIndex) {
    const col = dbClient.db.collection("playlists");
    // Elimina el elemento y luego limpia los nulls
    await col.updateOne(
      { _id: new ObjectId(playlistId) },
      { $unset: { [`canciones.${songIndex}`]: 1 } }
    );
    return await col.updateOne(
      { _id: new ObjectId(playlistId) },
      { $pull: { canciones: null } }
    );
  }

  async renamePlaylist(id, nombre) {
    const col = dbClient.db.collection("playlists");
    return await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { nombre } }
    );
  }

  async deletePlaylist(id) {
    const col = dbClient.db.collection("playlists");
    return await col.deleteOne({ _id: new ObjectId(id) });
  }
}

export default new playlistsModelo();