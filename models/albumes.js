import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";

class albumesModelo {
  async create(album) {
    const colAlbumes = dbClient.db.collection("albumes");
    return await colAlbumes.insertOne(album);
  }
  async getAll() {
    const colAlbumes = dbClient.db.collection("albumes");
    return await colAlbumes.find({}).toArray();
  }
  async getByGenero(idGenero) {
    const colAlbumes = dbClient.db.collection("albumes");
    return await colAlbumes.find({ generoId: idGenero }).toArray();
  }
  async getOne(id) {
    const colAlbumes = dbClient.db.collection("albumes");
    return await colAlbumes.findOne({ _id: new ObjectId(id) });
  }
  async update(id, album) {
    const colAlbumes = dbClient.db.collection("albumes");
    return await colAlbumes.updateOne({ _id: new ObjectId(id) }, { $set: album });
  }
  async delete(id) {
    const colAlbumes = dbClient.db.collection("albumes");
    return await colAlbumes.deleteOne({ _id: new ObjectId(id) });
  }
}

export default new albumesModelo();