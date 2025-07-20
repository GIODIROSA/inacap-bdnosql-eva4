import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";

class playlistsModelo {
  async create(playlist) {
    const colPlaylists = dbClient.db.collection("playlists");
    return await colPlaylists.insertOne({ ...playlist, canciones: [] });
  }
  async getAll() {
    const colPlaylists = dbClient.db.collection("playlists");
    return await colPlaylists.find({}).toArray();
  }
  async getOne(id) {
    const colPlaylists = dbClient.db.collection("playlists");
    return await colPlaylists.findOne({ _id: new ObjectId(id) });
  }
  async update(id, playlist) {
    const colPlaylists = dbClient.db.collection("playlists");
    return await colPlaylists.updateOne({ _id: new ObjectId(id) }, { $set: playlist });
  }
  async delete(id) {
    const colPlaylists = dbClient.db.collection("playlists");
    return await colPlaylists.deleteOne({ _id: new ObjectId(id) });
  }
  async addCancion(id, cancionId) {
    const colPlaylists = dbClient.db.collection("playlists");
    return await colPlaylists.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { canciones: cancionId } }
    );
  }
  async removeCancion(id, cancionId) {
    const colPlaylists = dbClient.db.collection("playlists");
    return await colPlaylists.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { canciones: cancionId } }
    );
  }
}

export default new playlistsModelo();