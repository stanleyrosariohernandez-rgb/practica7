
const mysql = require("mysql2/promise");
require("dotenv").config();

// Configuración de conexión con MySQL
const conexion = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Comprobar conexión
async function probarConexion() {
    try {
        const connection = await conexion.getConnection();

        console.log("Conexión exitosa con MySQL.");

        connection.release();

    } catch (error) {
        console.error("Error al conectar con MySQL:", error.message);
        process.exit(1);
    }
}

module.exports = {
    conexion,
    probarConexion
};
