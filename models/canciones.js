
import dbClient from "../config/dbClient.js"

class cancionesModelo{

    async create(cancion){
        const colCanciones = dbClient.db.collection("canciones");
        return await colCanciones.insertOne(cancion);
    }


}

export default new cancionesModelo();