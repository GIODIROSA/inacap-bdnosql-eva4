import express from "express";
const router = express.Router();
import cancionesController from "../controllers/cancionesController.js"; // Usando el controlador de canciones

// Ruta para obtener álbumes por género
router.get("/genero/:generoId", cancionesController.getAlbumesPorGenero);

export default router;
