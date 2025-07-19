import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";

class cancionesModelo {
  async create(cancion) {
    const colCanciones = dbClient.db.collection("canciones");
    return await colCanciones.insertOne(cancion);
  }

  async getAll() {
    const colCanciones = dbClient.db.collection("canciones");
    return await colCanciones.find({}).toArray();
  }

  async getOne(id) {
    const colCanciones = dbClient.db.collection("canciones");
    return await colCanciones.findOne({ _id: new ObjectId(id) });
  }

  async update(id, cancion) {
    const colCanciones = dbClient.db.collection("canciones");
    return await colCanciones.updateOne({ _id: new ObjectId(id) }, {$set: cancion});
  }

  async delete(id) {
    const colCanciones = dbClient.db.collection("canciones");
    return await colCanciones.deleteOne({ _id: new ObjectId(id) });
  }
}

export default new cancionesModelo();
