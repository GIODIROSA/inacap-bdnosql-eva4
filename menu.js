import "dotenv/config";
import inquirer from "inquirer";
import axios from "axios";

const url = process.env.URL_INICIAL;
const API_URL = url;

async function mainMenu() {
  const { opcion } = await inquirer.prompt([
    {
      type: "list",
      name: "opcion",
      message: "¿Qué deseas hacer?",
      choices: ["Explorar géneros y álbumes", "Salir"],
    },
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
        choices: res.data.map((g) => ({
          name: g.genero,
          value: g._id,
        })),
      },
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
        choices: res.data.map((a) => ({
          name: a.titulo,
          value: a._id,
        })),
      },
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
        message: "Presiona ENTER para volver al menú principal",
      },
    ]);
  } catch (error) {
    console.error("Error al obtener canciones:", error.message);
  }
}

// --- Gestión de playlists ---

async function gestionarPlaylists() {
  const { accion } = await inquirer.prompt([
    {
      type: "list",
      name: "accion",
      message: "¿Qué deseas hacer con las playlists?",
      choices: [
        "Ver playlists",
        "Crear playlist",
        "Agregar canción a playlist",
        "Renombrar playlist",
        "Eliminar playlist",
        "Volver",
      ],
    },
  ]);

  switch (accion) {
    case "Ver playlists":
      await verPlaylists();
      break;
    case "Crear playlist":
      await crearPlaylist();
      break;
    case "Agregar canción a playlist":
      await agregarCancionAPlaylist();
      break;
    case "Renombrar playlist":
      await renombrarPlaylist();
      break;
    case "Eliminar playlist":
      await eliminarPlaylist();
      break;
    case "Volver":
      return;
  }
  await gestionarPlaylists();
}

async function verPlaylists() {
  try {
    const res = await axios.get(`${API_URL}/playlists`);
    if (!res.data.length) {
      console.log("No hay playlists disponibles.");
      return;
    }
    res.data.forEach((pl) => {
      console.log(`- ${pl.nombre} (${pl.canciones.length} canciones)`);
    });
    await inquirer.prompt([
      {
        type: "input",
        name: "continuar",
        message: "Presiona ENTER para continuar",
      },
    ]);
  } catch (error) {
    console.error("Error al obtener playlists:", error.message);
  }
}

async function crearPlaylist() {
  const { nombre } = await inquirer.prompt([
    { type: "input", name: "nombre", message: "Nombre de la playlist:" },
  ]);
  try {
    await axios.post(`${API_URL}/playlists`, { nombre, canciones: [] });
    console.log("Playlist creada.");
  } catch (error) {
    console.error("Error al crear playlist:", error.message);
  }
}

async function agregarCancionAPlaylist() {
  try {
    const res = await axios.get(`${API_URL}/playlists`);
    if (!res.data.length) {
      console.log("No hay playlists disponibles.");
      return;
    }
    const { playlistId } = await inquirer.prompt([
      {
        type: "list",
        name: "playlistId",
        message: "Selecciona una playlist:",
        choices: res.data.map((pl) => ({ name: pl.nombre, value: pl._id })),
      },
    ]);
    const { titulo, artista, album } = await inquirer.prompt([
      { type: "input", name: "titulo", message: "Título de la canción:" },
      { type: "input", name: "artista", message: "Artista:" },
      { type: "input", name: "album", message: "Álbum:" },
    ]);
    await axios.post(`${API_URL}/playlists/${playlistId}/canciones`, {
      titulo,
      artista,
      album,
    });
    console.log("Canción agregada.");
  } catch (error) {
    console.error("Error al agregar canción:", error.message);
  }
}

async function renombrarPlaylist() {
  try {
    const res = await axios.get(`${API_URL}/playlists`);
    if (!res.data.length) {
      console.log("No hay playlists disponibles.");
      return;
    }
    const { playlistId } = await inquirer.prompt([
      {
        type: "list",
        name: "playlistId",
        message: "Selecciona una playlist:",
        choices: res.data.map((pl) => ({ name: pl.nombre, value: pl._id })),
      },
    ]);
    const { nombre } = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "Nuevo nombre de la playlist:",
      },
    ]);
    await axios.put(`${API_URL}/playlists/${playlistId}`, { nombre });
    console.log("Playlist renombrada.");
  } catch (error) {
    console.error("Error al renombrar playlist:", error.message);
  }
}

async function eliminarPlaylist() {
  try {
    const res = await axios.get(`${API_URL}/playlists`);
    if (!res.data.length) {
      console.log("No hay playlists disponibles.");
      return;
    }
    const { playlistId } = await inquirer.prompt([
      {
        type: "list",
        name: "playlistId",
        message: "Selecciona una playlist para eliminar:",
        choices: res.data.map((pl) => ({ name: pl.nombre, value: pl._id })),
      },
    ]);
    await axios.delete(`${API_URL}/playlists/${playlistId}`);
    console.log("Playlist eliminada.");
  } catch (error) {
    console.error("Error al eliminar playlist:", error.message);
  }
}
mainMenu();
