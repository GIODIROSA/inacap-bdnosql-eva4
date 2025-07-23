# 📦 Información del Package.json

## **Configuración del Proyecto**

### **📋 Metadatos Básicos**
- **name**: `inacap-bdnosql-eva4` - Nombre del proyecto (evaluación 4 de bases de datos NoSQL)
- **version**: `1.0.0` - Versión actual del proyecto
- **main**: `app.js` - Punto de entrada principal del backend
- **type**: `module` - **IMPORTANTE**: Habilita ES6 modules (import/export)

### **🚀 Scripts de Ejecución**

#### **`npm run server`**
```bash
nodemon -L
```
- **Función**: Inicia el servidor backend con reinicio automático
- **nodemon**: Monitorea cambios en archivos y reinicia automáticamente
- **-L**: Flag para monitoreo legacy (útil en algunos sistemas de archivos)
- **Usa**: nodemon.json para configuración específica

#### **`npm run client`**
```bash
node --no-warnings menu.js
```
- **Función**: Inicia la interfaz CLI para usuarios finales
- **--no-warnings**: Suprime warnings de Node.js para mejor UX
- **Ejecuta**: El menú interactivo para navegación y gestión

#### **`npm run dev`**
```bash
npx concurrently --raw -k --names "SERVER,CLIENT" -c "bgBlue.bold,bgGreen.bold" "npm:server" "npm:client"
```
- **Función**: Ejecuta servidor y cliente simultáneamente (modo desarrollo)
- **concurrently**: Ejecuta múltiples comandos en paralelo
- **--raw**: Output sin procesar
- **-k**: Mata todos los procesos si uno falla
- **--names**: Etiquetas para identificar cada proceso
- **-c**: Colores para diferencias visual (azul para server, verde para client)

### **📚 Dependencias de Producción**

#### **Backend (API)**
- **`express`** (^5.1.0): Framework web para crear APIs REST
- **`mongodb`** (^6.17.0): Driver oficial de MongoDB para Node.js
- **`mongoose`** (^8.16.3): ODM para MongoDB (actualmente sin usar)
- **`dotenv`** (^17.2.0): Carga variables de entorno desde .env

#### **Frontend (CLI)**
- **`inquirer`** (^12.8.1): Crea interfaces CLI interactivas con menús
- **`axios`** (^1.10.0): Cliente HTTP para comunicarse con la API

### **🛠️ Dependencias de Desarrollo**

- **`nodemon`** (^3.1.10): Monitorea archivos y reinicia el servidor automáticamente
- **`concurrently`** (^8.2.2): Ejecuta múltiples comandos npm en paralelo

### **⚙️ Configuración Técnica**

#### **ES6 Modules**
```json
"type": "module"
```
- Permite usar `import`/`export` en lugar de `require`/`module.exports`
- Sintaxis moderna de JavaScript
- **Importante**: Todos los archivos .js son tratados como módulos ES6

#### **Versionado**
- Todas las dependencias usan `^` (compatible con versiones menores)
- Permite actualizaciones de parches y características menores
- Evita breaking changes en versiones mayores

### **🎯 Flujo de Trabajo Recomendado**

1. **Desarrollo completo**: `npm run dev` (servidor + cliente)
2. **Solo backend**: `npm run server` 
3. **Solo frontend**: `npm run client`
4. **Producción**: `node app.js` para servidor, `node menu.js` para cliente

### **📁 Archivos de Configuración Relacionados**

- **`.env`**: Variables de entorno (URLs, credenciales)
- **`nodemon.json`**: Configuración específica de nodemon
- **`.gitignore`**: Archivos ignorados por git (incluye node_modules)
