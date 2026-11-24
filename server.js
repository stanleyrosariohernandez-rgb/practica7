
const express = require("express");
const path = require("path");

const { probarConexion } = require("./config/database");
const rutasProductos = require("./routes/productos");

// Crear aplicación Express
const app = express();

// Configuración del servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", rutasProductos);

// Servir archivos HTML, CSS y JavaScript
app.use(express.static(path.join(__dirname, "public")));

// Ruta de prueba
app.get("/api", (req, res) => {
    res.json({
        mensaje: "API del Sistema de Gestión de Productos funcionando."
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    await probarConexion();

    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}

iniciarServidor();
