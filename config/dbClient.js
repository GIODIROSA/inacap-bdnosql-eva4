import "dotenv/config";
import { MongoClient } from "mongodb";

const user = process.env.USER_DATABASE;
const password = process.env.PASSWORD_DATABASE;
const serverDB = process.env.SERVER_DB;

console.log("Cargando variables de entorno...", user, password, serverDB);

class dbClient {
  constructor() {
    const queryString = `mongodb+srv://${user}:${password}@${serverDB}/?retryWrites=true&w=majority&appName=VynilChilean`;
    this.client = new MongoClient(queryString);
    this.conectarBD();
  }

  async conectarBD() {
    try {
      await this.client.connect();
      this.db = this.client.db("vinylRoar");
      console.log("Conexión a la base de datos exitosa=>");
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error.message);
    }
  }
}

export default new dbClient();
