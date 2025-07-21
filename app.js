import "dotenv/config";
import express from "express";
import routeCanciones from "./routes/canciones.js";
import routerPlaylists from "./routes/playlists.js";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/canciones", routeCanciones);
app.use("/playlists", routerPlaylists);

try {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (error) {
  console.log(error.message);
}

app.get("/", (req, res) => {
  res.send("¡Hola desde el servidor Express en localhost: 8080!");
});

export default app;
