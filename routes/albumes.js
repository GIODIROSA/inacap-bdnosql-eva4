import express from "express";
const route = express.Router();
import albumesController from "../controllers/albumesController.js";

route.post("/", albumesController.create);
route.get("/", albumesController.getAll);
route.get("/genero/:generoId", albumesController.getByGenero);
route.get("/:id", albumesController.getOne);
route.put("/:id", albumesController.update);
route.delete("/:id", albumesController.delete);

export default route;