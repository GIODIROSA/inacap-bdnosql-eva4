import express from "express";
const route = express.Router();
import generosController from "../controllers/generosController.js";

route.post("/", generosController.create);
route.get("/", generosController.getAll);
route.get("/:id", generosController.getOne);
route.put("/:id", generosController.update);
route.delete("/:id", generosController.delete);

export default route;