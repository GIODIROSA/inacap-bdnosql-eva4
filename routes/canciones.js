import express from "express";
const route = express.Router();
import cancionesController from "../controllers/cancionesController.js";

route.post("/", cancionesController.create);
route.get("/:id", cancionesController.getOne);
route.get("/", cancionesController.getAll);
route.put("/:id", cancionesController.update);
route.delete("/:id", cancionesController.delete);
route.get("/album/:albumId", cancionesController.getCancionesPorAlbum);
route.get("/estructura-completa", cancionesController.getEstructuraCompleta);

export default route;