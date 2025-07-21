import { Router } from "express";
import playlistsController from "../controllers/playlistsController.js";

const router = Router();

router.get("/", playlistsController.getAll);
router.get("/:id", playlistsController.getOne);
router.post("/", playlistsController.create);
router.post("/:id/canciones", playlistsController.addSong);
router.put("/:id/canciones/:index", playlistsController.updateSong);
router.delete("/:id/canciones/:index", playlistsController.deleteSong);
router.put("/:id", playlistsController.renamePlaylist);
router.delete("/:id", playlistsController.deletePlaylist);

export default router;