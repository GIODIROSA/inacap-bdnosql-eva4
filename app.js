import "dotenv/config";
import express from "express";
import routeCanciones from "./routes/canciones.js";
import routerPlaylists from "./routes/playlists.js";
import generosRouter from "./routes/generos.js";
import albumesRouter from "./routes/albumes.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares para parsear JSON y datos de formularios (funcionalidad antes en body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use("/canciones", routeCanciones);
app.use("/playlists", routerPlaylists);
app.use("/generos", generosRouter);
app.use("/albumes", albumesRouter); 

app.get("/", (req, res) => {
  res.send("¡Hola desde el servidor Express en localhost: 8080!");
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
  .on('error', (error) => console.log('Error al iniciar el servidor:', error.message));

export default app;
