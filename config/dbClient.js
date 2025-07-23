// ===============================================
// CONFIGURACIÓN DE BASE DE DATOS - MONGODB ATLAS
// ===============================================

// Configuración de variables de entorno
import "dotenv/config"; // Carga las credenciales desde el archivo .env
import { MongoClient } from "mongodb"; // Cliente oficial de MongoDB para Node.js

// Extracción de credenciales desde variables de entorno
const user = process.env.USER_DATABASE;         // Usuario de MongoDB Atlas
const password = process.env.PASSWORD_DATABASE; // Contraseña de MongoDB Atlas
const serverDB = process.env.SERVER_DB;         // Servidor/cluster de MongoDB Atlas

// Descomenta la siguiente línea para debug de conexión
//console.log("Cargando variables de entorno...", user, password, serverDB);

/**
 * Clase para manejar la conexión a MongoDB Atlas
 * Implementa patrón Singleton para asegurar una sola conexión global
 * Gestiona automáticamente la conexión y proporciona acceso a la base de datos
 */
class dbClient {
  constructor() {
    // Construcción de la cadena de conexión para MongoDB Atlas
    // Formato: mongodb+srv://usuario:contraseña@servidor/opciones
    const queryString = `mongodb+srv://${user}:${password}@${serverDB}/?retryWrites=true&w=majority&appName=VynilChilean`;
    
    // Inicialización del cliente de MongoDB
    this.client = new MongoClient(queryString);
    
    // Establecer conexión automáticamente al crear la instancia
    this.conectarBD();
  }

  /**
   * Establece la conexión con MongoDB Atlas
   * Selecciona la base de datos "vinylRoar" como base de datos activa
   * Maneja errores de conexión y proporciona feedback al usuario
   */
  async conectarBD() {
    try {
      // Conectar al cluster de MongoDB Atlas
      await this.client.connect();
      
      // Seleccionar la base de datos específica del proyecto
      this.db = this.client.db("vinylRoar");
      
      console.log("Conexión a la base de datos exitosa=>");
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error.message);
    }
  }
}

// Exportar una instancia única (patrón Singleton)
// Esto asegura que toda la aplicación use la misma conexión
export default new dbClient();
