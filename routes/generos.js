// routes/generos.js
import express from "express";
const router = express.Router();
import generosController from "../controllers/generosController.js"; // Asegúrate de que la ruta sea correcta

// Rutas para la gestión de géneros
router.post("/", generosController.create); // Crea un nuevo género
router.get("/:id", generosController.getOne); // Obtiene un género por su ID
router.get("/", generosController.getAll); // Obtiene todos los géneros (¡Esta es la que necesita tu frontend!)
router.put("/:id", generosController.update); // Actualiza un género por su ID
router.delete("/:id", generosController.delete); // Elimina un género por su ID

// Si necesitas una ruta para obtener los álbumes anidados directamente dentro de un género
// router.get("/:id/albumes", generosController.getAlbumesPorGenero);

export default router;