import "dotenv/config";
import express from "express";

const app = express();

try {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (error) {
  console.log(error.message);
}

app.get("/", (req, res) => {
  res.send("¡Hola desde el servidor Express en localhost:5100!");
});

export default app;

