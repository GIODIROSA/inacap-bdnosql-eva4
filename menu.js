import inquirer from "inquirer";
import axios from "axios";

const API_URL = "http://localhost:8080";

async function mainMenu() {
  const { opcion } = await inquirer.prompt([
    {
      type: "list",
      name: "opcion",
      message: "¿Qué deseas hacer?",
      choices: [
        "Explorar géneros y álbumes",
        "Salir"
      ]
    }
  ]);

  switch (opcion) {
    case "Explorar géneros y álbumes":
      await explorarGeneros();
      break;
    case "Salir":
      console.log("¡Hasta luego!");
      process.exit(0);
  }
  mainMenu();
}

async function explorarGeneros() {
  try {
    const res = await axios.get(`${API_URL}/generos`);
    if (!res.data.length) {
      console.log("No hay géneros disponibles.");
      return;
    }
    const { generoId } = await inquirer.prompt([
      {
        type: "list",
        name: "generoId",
        message: "Selecciona un género:",
        choices: res.data.map(g => ({
          name: g.genero,
          value: g._id
        }))
      }
    ]);
    await explorarAlbumes(generoId);
  } catch (error) {
    console.error("Error al obtener géneros:", error.message);
  }
}

async function explorarAlbumes(generoId) {
  try {
    const res = await axios.get(`${API_URL}/albumes/genero/${generoId}`);
    if (!res.data.length) {
      console.log("No hay álbumes para este género.");
      return;
    }
    const { albumId } = await inquirer.prompt([
      {
        type: "list",
        name: "albumId",
        message: "Selecciona un álbum:",
        choices: res.data.map(a => ({
          name: a.titulo,
          value: a._id
        }))
      }
    ]);
    await mostrarCanciones(albumId);
  } catch (error) {
    console.error("Error al obtener álbumes:", error.message);
  }
}

async function mostrarCanciones(albumId) {
  try {
    const res = await axios.get(`${API_URL}/canciones/album/${albumId}`);
    if (!res.data.length) {
      console.log("No hay canciones en este álbum.");
      return;
    }
    console.log("\nCanciones del álbum:");
    res.data.forEach((c, idx) => {
      console.log(`- ${idx + 1}. ${c.titulo || JSON.stringify(c)}`);
    });
    await inquirer.prompt([
      {
        type: "input",
        name: "continuar",
        message: "Presiona ENTER para volver al menú principal"
      }
    ]);
  } catch (error) {
    console.error("Error al obtener canciones:", error.message);
  }
}

mainMenu();