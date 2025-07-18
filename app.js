import "dotenv/config";
import express from "express";
import routeCanciones from "./routes/canciones.js";

const app = express();

app.use("/canciones", routeCanciones);

try {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (error) {
  console.log(error.message);
}

app.get("/", (req, res) => {
  res.send("¡Hola desde el servidor Express en localhost: 8080!");
});

export default app;
