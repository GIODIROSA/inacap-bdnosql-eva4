import { ObjectId } from "mongodb";
import dbClient from "../config/dbClient.js";

class generosModelo {
  async create(genero) {
    const colGeneros = dbClient.db.collection("canciones");
    return await colGeneros.insertOne(genero);
  }
  async getAll() {
    const colGeneros = dbClient.db.collection("canciones");
    return await colGeneros.find({}).toArray();
  }
  async getOne(id) {
    const colGeneros = dbClient.db.collection("canciones");
    return await colGeneros.findOne({ _id: new ObjectId(id) });
  }
  async update(id, genero) {
    const colGeneros = dbClient.db.collection("canciones");
    return await colGeneros.updateOne({ _id: new ObjectId(id) }, { $set: genero });
  }
  async delete(id) {
    const colGeneros = dbClient.db.collection("canciones"); 
    return await colGeneros.deleteOne({ _id: new ObjectId(id) });
  }
}

export default new generosModelo();