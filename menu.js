// ===============================================
// INTERFAZ CLI - FRONTEND INTERACTIVO VINYLROAR
// ===============================================

// Configuración de variables de entorno
import "dotenv/config"; // Carga las variables del archivo .env

// Importaciones para la interfaz de usuario
import inquirer from "inquirer"; // Biblioteca para crear interfaces CLI interactivas
import axios from "axios"; // Cliente HTTP para comunicarse con la API

// Configuración de la URL base de la API
const url = process.env.URL_INICIAL; // URL desde las variables de entorno
const API_URL = url; // URL base para todas las peticiones a la API

/**
 * Función principal del menú - Punto de entrada de la aplicación CLI
 * Presenta las opciones principales y maneja la navegación del usuario
 * Bucle principal que se ejecuta hasta que el usuario decida salir
 */
async function mainMenu() {
  let salir = false; // Flag para controlar el bucle principal
  
  while (!salir) {
    // Limpiar pantalla antes de mostrar el menú para mejor UX
    console.clear();
    console.log("\n--- Menú Principal ---");
    
    // Presentar opciones principales al usuario
    const { opcion } = await inquirer.prompt([
      {
        type: "list", // Tipo de input: lista de opciones
        name: "opcion", // Nombre de la variable que recibirá la respuesta
        message: "¿Qué deseas hacer?",
        choices: ["Explorar música", "Gestionar playlists", "Salir"],
        pageSize: 10, // Número máximo de opciones visibles
        loop: false   // Desactivar navegación circular
      },
    ]);

    // Manejar la opción seleccionada por el usuario
    switch (opcion) {
      case "Explorar música":
        await explorarGeneros(); // Navegar por géneros → álbumes → canciones
        break;
      case "Gestionar playlists":
        await gestionarPlaylists(); // Crear, editar, eliminar playlists
        break;
      case "Salir":
        salir = true; // Cambiar flag para terminar el bucle principal
        break;
    }
  }
  console.log("¡Hasta luego!"); // Mensaje de despedida al salir
}

// ===============================================
// FUNCIONES DE NAVEGACIÓN MUSICAL
// ===============================================

/**
 * Explora géneros musicales disponibles con navegación jerárquica
 * Primer nivel de navegación: Géneros → Álbumes → Canciones
 * Incluye opciones de retorno para mejor experiencia de usuario
 */

async function explorarGeneros() {
  let continuar = true;
  while (continuar) {
    try {
      const res = await axios.get(`${API_URL}/generos`);
      if (!res.data.length) {
        console.log("No hay géneros disponibles.");
        return;
      }
      const choices = res.data.map((g) => ({
        name: g.genero,
        value: g._id,
      }));
      choices.push({ name: "🔙 Volver al menú principal", value: "volver" });
      
      const { generoId } = await inquirer.prompt([
        {
          type: "list",
          name: "generoId",
          message: "Selecciona un género:",
          choices: choices,
        },
      ]);
      
      if (generoId === "volver") {
        continuar = false;
      } else {
        const resultado = await explorarAlbumes(generoId);
        if (resultado === "menu") {
          continuar = false;
        }
        // Si no devuelve nada o devuelve otra cosa, continúa en el bucle
      }
    } catch (error) {
      console.error("Error al obtener géneros:", error.message);
      continuar = false;
    }
  }
}

async function explorarAlbumes(generoId) {
  let continuar = true;
  while (continuar) {
    try {
      const res = await axios.get(`${API_URL}/albumes/genero/${generoId}`);
      if (!res.data.length) {
        console.log("No hay álbumes para este género.");
        return;
      }
      const choices = res.data.map((a) => ({
        name: a.titulo,
        value: a._id,
      }));
      choices.push({ name: "🔙 Volver a géneros", value: "volver" });
      
      const { albumId } = await inquirer.prompt([
        {
          type: "list",
          name: "albumId",
          message: "Selecciona un álbum:",
          choices: choices,
        },
      ]);
      
      if (albumId === "volver") {
        continuar = false;
      } else {
        const accion = await mostrarCanciones(albumId);
        if (accion === "generos") {
          continuar = false;
        } else if (accion === "menu") {
          return "menu";
        }
        // Si es "volver", continúa en el bucle de álbumes
      }
    } catch (error) {
      console.error("Error al obtener álbumes:", error.message);
      continuar = false;
    }
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
    
    const { accion } = await inquirer.prompt([
      {
        type: "list",
        name: "accion",
        message: "¿Qué quieres hacer?",
        choices: [
          { name: "🔙 Volver a álbumes", value: "volver" },
          { name: "🔙 Volver a géneros", value: "generos" },
          { name: "🏠 Volver al menú principal", value: "menu" }
        ],
      },
    ]);
    
    return accion;
  } catch (error) {
    console.error("Error al obtener canciones:", error.message);
  }
}

// --- Gestión de playlists ---

async function gestionarPlaylists() {
  let volver = false;
  while (!volver) {
    console.clear();
    console.log("\n--- Gestión de Playlists ---");
    const { accion } = await inquirer.prompt([
      {
        type: "list",
        name: "accion",
        message: "¿Qué deseas hacer con las playlists?",
        choices: [
          "Ver todas las playlists",
          "Crear nueva playlist",
          "Agregar canción a una playlist",
          "Renombrar una playlist",
          "Editar canción en una playlist",
          "Eliminar canción de una playlist",
          "Eliminar una playlist",
          "Volver al menú principal",
        ],
        pageSize: 10,
        loop: false
      },
    ]);

    switch (accion) {
      case "Ver todas las playlists":
        await verPlaylists();
        break;
      case "Crear nueva playlist":
        await crearPlaylist();
        break;
      case "Agregar canción a una playlist":
        await agregarCancionAPlaylist();
        break;
      case "Renombrar una playlist":
        await renombrarPlaylist();
        break;
      case "Editar canción en una playlist":
        await editarCancionEnPlaylist();
        break;
      case "Eliminar canción de una playlist":
        await eliminarCancionDePlaylist();
        break;
      case "Eliminar una playlist":
        await eliminarPlaylist();
        break;
      case "Volver al menú principal":
        volver = true;
        break;
    }
  }
}

async function verPlaylists() {
  try {
    const res = await axios.get(`${API_URL}/playlists`);
    if (!res.data.length) {
      console.log("No hay playlists disponibles.");
      return;
    }
    res.data.forEach((pl) => {
      console.log(`\nPlaylist: ${pl.nombre}`);
      if (pl.canciones && pl.canciones.length > 0) {
        pl.canciones.forEach((cancion, index) => {
          console.log(`  ${index + 1}. ${cancion.titulo} - ${cancion.artista}`);
        });
      } else {
        console.log("  (Esta playlist está vacía)");
      }
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
    const playlistId = await seleccionarPlaylist(
      "¿A qué playlist quieres agregar una canción?"
    );
    if (!playlistId) return; // El usuario canceló o no hay playlists

    // Ofrecer opciones para agregar la canción
    const { metodo } = await inquirer.prompt([
      {
        type: "list",
        name: "metodo",
        message: "¿Cómo quieres agregar la canción?",
        choices: [
          "📁 Navegar por géneros y álbumes",
          "🔍 Buscar canción por título",
          "✏️ Escribir información manualmente",
          "🔙 Cancelar",
        ],
        pageSize: 5,
        loop: false
      },
    ]);

    if (metodo === "🔙 Cancelar") {
      console.log("Operación cancelada.");
      return;
    }

    let cancionData;
    
    if (metodo === "📁 Navegar por géneros y álbumes") {
      cancionData = await seleccionarCancionPorNavegacion();
    } else if (metodo === "🔍 Buscar canción por título") {
      cancionData = await buscarCancionPorTitulo();
    } else {
      cancionData = await ingresarCancionManual();
    }

    if (cancionData) {
      await axios.post(`${API_URL}/playlists/${playlistId}/canciones`, cancionData);
      console.log("✅ Canción agregada exitosamente a la playlist.");
    }
  } catch (error) {
    console.error("❌ Error al agregar canción:", error.message);
  }
}

async function renombrarPlaylist() {
  try {
    const playlistId = await seleccionarPlaylist("¿Qué playlist quieres renombrar?");
    if (!playlistId) return;

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

async function editarCancionEnPlaylist() {
  try {
    const playlistId = await seleccionarPlaylist(
      "¿De qué playlist quieres editar una canción?"
    );
    if (!playlistId) return;

    const { cancion, index } = await seleccionarCancion(
      playlistId,
      "¿Qué canción quieres editar?"
    );
    if (!cancion) return;

    console.log(`Editando: ${cancion.titulo} - ${cancion.artista}`);
    const { titulo, artista } = await inquirer.prompt([
      { type: "input", name: "titulo", message: "Nuevo título:", default: cancion.titulo },
      { type: "input", name: "artista", message: "Nuevo artista:", default: cancion.artista },
    ]);

    await axios.put(`${API_URL}/playlists/${playlistId}/canciones/${index}`, { titulo, artista });
    console.log("Canción actualizada correctamente.");
  } catch (error) {
    console.error("Error al editar la canción:", error.message);
  }
}

async function eliminarCancionDePlaylist() {
  try {
    const playlistId = await seleccionarPlaylist(
      "¿De qué playlist quieres eliminar una canción?"
    );
    if (!playlistId) return;

    const { index } = await seleccionarCancion(playlistId, "¿Qué canción quieres eliminar?");
    if (index === null) return;

    await axios.delete(`${API_URL}/playlists/${playlistId}/canciones/${index}`);
    console.log("Canción eliminada correctamente.");
  } catch (error) {
    console.error("Error al eliminar la canción:", error.message);
  }
}

async function eliminarPlaylist() {
  try {
    const playlistId = await seleccionarPlaylist("¿Qué playlist quieres eliminar?");
    if (!playlistId) return;

    await axios.delete(`${API_URL}/playlists/${playlistId}`);
    console.log("Playlist eliminada.");
  } catch (error) {
    console.error("Error al eliminar playlist:", error.message);
  }
}

/**
 * Función auxiliar para obtener playlists y pedir al usuario que seleccione una.
 * @param {string} message - El mensaje a mostrar al usuario.
 * @returns {Promise<string|null>} El ID de la playlist seleccionada o null si no hay o se cancela.
 */
async function seleccionarPlaylist(message) {
  try {
    const res = await axios.get(`${API_URL}/playlists`);
    if (!res.data.length) {
      console.log("❌ No hay playlists disponibles.");
      return null;
    }
    
    const choices = res.data.map((pl) => ({ 
      name: `🎵 ${pl.nombre} (${pl.canciones?.length || 0} canciones)`, 
      value: pl._id 
    }));
    choices.push({ name: "🔙 Cancelar", value: "cancelar" });
    
    const { playlistId } = await inquirer.prompt([
      {
        type: "list",
        name: "playlistId",
        message: message,
        choices: choices,
        pageSize: 10,
        loop: false
      },
    ]);
    
    return playlistId === "cancelar" ? null : playlistId;
  } catch (error) {
    console.error("Error al obtener las playlists:", error.message);
    return null;
  }
}

// Función para navegar por géneros → álbumes → canciones
async function seleccionarCancionPorNavegacion() {
  try {
    console.log("\n🎭 Seleccionando género...");
    
    // Primero seleccionar género
    const res = await axios.get(`${API_URL}/generos`);
    if (!Array.isArray(res.data) || !res.data.length) {
      console.log("❌ No hay géneros disponibles.");
      return null;
    }

    const generoChoices = res.data.map((g) => ({
      name: `🎵 ${g.genero}`,
      value: g._id,
    }));
    generoChoices.push({ name: "🔙 Cancelar", value: "cancelar" });

    const { generoId } = await inquirer.prompt([
      {
        type: "list",
        name: "generoId",
        message: "🎭 Selecciona un género:",
        choices: generoChoices,
        pageSize: 10,
        loop: false
      },
    ]);

    if (generoId === "cancelar") return null;

    console.log("\n💿 Seleccionando álbum...");
    
    // Luego seleccionar álbum
    const albumRes = await axios.get(`${API_URL}/albumes/genero/${generoId}`);
    if (!albumRes.data.length) {
      console.log("❌ No hay álbumes disponibles para este género.");
      return null;
    }

    const albumChoices = albumRes.data.map((a) => ({
      name: `💿 ${a.titulo} (${a.canciones?.length || 0} canciones)`,
      value: a._id,
    }));
    albumChoices.push({ name: "🔙 Volver a géneros", value: "volver" });
    albumChoices.push({ name: "🔙 Cancelar", value: "cancelar" });

    const { albumId } = await inquirer.prompt([
      {
        type: "list",
        name: "albumId",
        message: "💿 Selecciona un álbum:",
        choices: albumChoices,
        pageSize: 10,
        loop: false
      },
    ]);

    if (albumId === "cancelar") return null;
    if (albumId === "volver") return await seleccionarCancionPorNavegacion(); // Reiniciar desde géneros

    console.log("\n🎶 Seleccionando canción...");
    
    // Finalmente seleccionar canción
    const cancionRes = await axios.get(`${API_URL}/canciones/album/${albumId}`);
    if (!cancionRes.data.length) {
      console.log("❌ No hay canciones disponibles en este álbum.");
      return null;
    }

    const cancionChoices = cancionRes.data.map((c, index) => ({
      name: `🎵 ${c.titulo} - ${c.artista || 'Artista desconocido'}`,
      value: index,
    }));
    cancionChoices.push({ name: "🔙 Volver a álbumes", value: "volver" });
    cancionChoices.push({ name: "🔙 Cancelar", value: "cancelar" });

    const { cancionIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "cancionIndex",
        message: "🎶 Selecciona una canción:",
        choices: cancionChoices,
        pageSize: 15,
        loop: false
      },
    ]);

    if (cancionIndex === "cancelar") return null;
    if (cancionIndex === "volver") {
      // Volver a seleccionar álbum (mantener el género seleccionado)
      console.log("\n💿 Seleccionando álbum...");
      return await seleccionarCancionEnAlbum(generoId);
    }

    const cancionSeleccionada = cancionRes.data[cancionIndex];
    console.log(`✅ Canción seleccionada: ${cancionSeleccionada.titulo}`);
    return cancionSeleccionada;
    
  } catch (error) {
    console.error("❌ Error al seleccionar canción:", error.message);
    return null;
  }
}

// Función auxiliar para seleccionar canción en álbum (cuando se vuelve desde canciones)
async function seleccionarCancionEnAlbum(generoId) {
  try {
    const albumRes = await axios.get(`${API_URL}/albumes/genero/${generoId}`);
    if (!albumRes.data.length) {
      console.log("❌ No hay álbumes disponibles para este género.");
      return null;
    }

    const albumChoices = albumRes.data.map((a) => ({
      name: `💿 ${a.titulo} (${a.canciones?.length || 0} canciones)`,
      value: a._id,
    }));
    albumChoices.push({ name: "🔙 Volver a géneros", value: "volver" });
    albumChoices.push({ name: "🔙 Cancelar", value: "cancelar" });

    const { albumId } = await inquirer.prompt([
      {
        type: "list",
        name: "albumId",
        message: "💿 Selecciona un álbum:",
        choices: albumChoices,
        pageSize: 10,
        loop: false
      },
    ]);

    if (albumId === "cancelar") return null;
    if (albumId === "volver") return await seleccionarCancionPorNavegacion();

    console.log("\n🎶 Seleccionando canción...");
    
    const cancionRes = await axios.get(`${API_URL}/canciones/album/${albumId}`);
    if (!cancionRes.data.length) {
      console.log("❌ No hay canciones disponibles en este álbum.");
      return null;
    }

    const cancionChoices = cancionRes.data.map((c, index) => ({
      name: `🎵 ${c.titulo} - ${c.artista || 'Artista desconocido'}`,
      value: index,
    }));
    cancionChoices.push({ name: "🔙 Volver a álbumes", value: "volver" });
    cancionChoices.push({ name: "🔙 Cancelar", value: "cancelar" });

    const { cancionIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "cancionIndex",
        message: "🎶 Selecciona una canción:",
        choices: cancionChoices,
        pageSize: 15,
        loop: false
      },
    ]);

    if (cancionIndex === "cancelar") return null;
    if (cancionIndex === "volver") return await seleccionarCancionEnAlbum(generoId);

    const cancionSeleccionada = cancionRes.data[cancionIndex];
    console.log(`✅ Canción seleccionada: ${cancionSeleccionada.titulo}`);
    return cancionSeleccionada;
    
  } catch (error) {
    console.error("❌ Error al seleccionar canción:", error.message);
    return null;
  }
}

// Función para buscar canción por título
async function buscarCancionPorTitulo() {
  try {
    const { busqueda } = await inquirer.prompt([
      { 
        type: "input", 
        name: "busqueda", 
        message: "🔍 Escribe parte del título de la canción que buscas (o deja vacío para cancelar):" 
      },
    ]);

    if (!busqueda.trim()) {
      console.log("🔙 Búsqueda cancelada.");
      return null;
    }

    console.log("\n🔍 Buscando canciones...");
    
    // Obtener todas las canciones y filtrar localmente
    const res = await axios.get(`${API_URL}/canciones/estructura-completa`);
    const todasLasCanciones = [];
    
    // Extraer todas las canciones de todos los géneros y álbumes
    res.data.forEach(genero => {
      if (genero.albumes) {
        genero.albumes.forEach(album => {
          if (album.canciones) {
            album.canciones.forEach(cancion => {
              todasLasCanciones.push({
                ...cancion,
                genero: genero.genero,
                album: album.titulo
              });
            });
          }
        });
      }
    });

    // Filtrar canciones que coincidan con la búsqueda
    const cancionesFiltradas = todasLasCanciones.filter(cancion => 
      cancion.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      cancion.artista?.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (!cancionesFiltradas.length) {
      console.log(`❌ No se encontraron canciones que contengan "${busqueda}".`);
      
      const { intentarDeNuevo } = await inquirer.prompt([
        {
          type: "confirm",
          name: "intentarDeNuevo",
          message: "¿Quieres intentar con otra búsqueda?",
          default: true
        }
      ]);
      
      if (intentarDeNuevo) {
        return await buscarCancionPorTitulo();
      }
      return null;
    }

    console.log(`✅ Se encontraron ${cancionesFiltradas.length} canción(es):`);

    const choices = cancionesFiltradas.map((c, index) => ({
      name: `🎵 ${c.titulo} - ${c.artista || 'Artista desconocido'} (${c.genero} - ${c.album})`,
      value: c,
    }));
    choices.push({ name: "🔙 Buscar otra canción", value: "buscar_otra" });
    choices.push({ name: "🔙 Cancelar", value: "cancelar" });

    const { cancionSeleccionada } = await inquirer.prompt([
      {
        type: "list",
        name: "cancionSeleccionada",
        message: "🎶 Selecciona la canción que deseas agregar:",
        choices: choices,
        pageSize: 15,
        loop: false
      },
    ]);

    if (cancionSeleccionada === "cancelar") return null;
    if (cancionSeleccionada === "buscar_otra") return await buscarCancionPorTitulo();

    console.log(`✅ Canción seleccionada: ${cancionSeleccionada.titulo}`);
    return cancionSeleccionada;
    
  } catch (error) {
    console.error("❌ Error al buscar canción:", error.message);
    return null;
  }
}

// Función para ingresar canción manualmente
async function ingresarCancionManual() {
  try {
    console.log("\n✏️ Ingresando información manualmente...");
    
    const { titulo, artista, album, confirmar } = await inquirer.prompt([
      { 
        type: "input", 
        name: "titulo", 
        message: "🎵 Título de la canción (obligatorio):" 
      },
      { 
        type: "input", 
        name: "artista", 
        message: "👤 Artista (opcional):" 
      },
      { 
        type: "input", 
        name: "album", 
        message: "💿 Álbum (opcional):" 
      },
      {
        type: "confirm",
        name: "confirmar",
        message: "¿Confirmas que quieres agregar esta canción?",
        default: true
      }
    ]);

    if (!confirmar) {
      console.log("🔙 Operación cancelada.");
      return null;
    }

    if (!titulo.trim()) {
      console.log("❌ El título es obligatorio.");
      
      const { intentarDeNuevo } = await inquirer.prompt([
        {
          type: "confirm",
          name: "intentarDeNuevo",
          message: "¿Quieres intentar de nuevo?",
          default: true
        }
      ]);
      
      if (intentarDeNuevo) {
        return await ingresarCancionManual();
      }
      return null;
    }

    const cancionData = { 
      titulo: titulo.trim(), 
      artista: artista.trim() || 'Artista desconocido', 
      album: album.trim() || 'Álbum desconocido' 
    };
    
    console.log(`✅ Canción creada: ${cancionData.titulo} - ${cancionData.artista}`);
    return cancionData;
    
  } catch (error) {
    console.error("❌ Error al ingresar canción:", error.message);
    return null;
  }
}

/**
 * Función auxiliar para obtener las canciones de una playlist y pedir al usuario que seleccione una.
 * @param {string} playlistId - El ID de la playlist.
 * @param {string} message - El mensaje a mostrar al usuario.
 * @returns {Promise<{cancion: object, index: number}|{cancion: null, index: null}>} El objeto de la canción y su índice.
 */
async function seleccionarCancion(playlistId, message) {
  try {
    const res = await axios.get(`${API_URL}/playlists/${playlistId}`);
    const playlist = res.data;

    if (!playlist.canciones || playlist.canciones.length === 0) {
      console.log("Esta playlist no tiene canciones.");
      return { cancion: null, index: null };
    }

    const { index } = await inquirer.prompt([
      {
        type: "list",
        name: "index",
        message: message,
        choices: playlist.canciones.map((c, i) => ({ name: `${c.titulo} - ${c.artista}`, value: i })),
      },
    ]);
    return { cancion: playlist.canciones[index], index };
  } catch (error) {
    console.error("Error al obtener las canciones de la playlist:", error.message);
    return { cancion: null, index: null };
  }
}

// Inicia la aplicación de menú
mainMenu();