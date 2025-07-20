import express from "express";
const route = express.Router();
import playlistsController from "../controllers/playlistsController.js";

route.post("/", playlistsController.create);
route.get("/", playlistsController.getAll);
route.get("/:id", playlistsController.getOne);
route.put("/:id", playlistsController.update);
route.delete("/:id", playlistsController.delete);

// Agregar y quitar canciones de la playlist
route.post("/:id/canciones", playlistsController.addCancion);
route.delete("/:id/canciones", playlistsController.removeCancion);

export default route;