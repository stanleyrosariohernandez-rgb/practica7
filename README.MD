# Sistema de Gestión de Productos

## Descripción

Sistema web desarrollado para administrar productos mediante operaciones CRUD (Crear, Consultar, Modificar y Eliminar), utilizando una base de datos MySQL.

El proyecto permite registrar productos, consultar el inventario, actualizar información y eliminar registros.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- MySQL
- MySQL2
- Git y GitHub

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm.
- MySQL Server.
- Una base de datos llamada `tienda_db`.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone URL_DEL_REPOSITORIO
   ```

2. Entrar en la carpeta:

   ```bash
   cd sistema-productos
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Crear la base de datos y la tabla:

   ```sql
   CREATE DATABASE tienda_db;
   USE tienda_db;

   CREATE TABLE productos (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nombre VARCHAR(100) NOT NULL,
       descripcion TEXT,
       precio DECIMAL(10,2) NOT NULL,
       cantidad INT NOT NULL
   );
   ```

5. Crear un archivo `.env` en la raíz, tomando como referencia `.env.example`, y completar los datos de conexión de MySQL.

6. Iniciar el servidor:

   ```bash
   npm run dev
   ```

7. Abrir en el navegador:

   `http://localhost:3000`

## Endpoints de la API

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/productos` | Consultar todos los productos |
| GET | `/api/productos/:id` | Consultar un producto |
| POST | `/api/productos` | Registrar un producto |
| PUT | `/api/productos/:id` | Modificar un producto |
| DELETE | `/api/productos/:id` | Eliminar un producto |

## Códigos HTTP

- 200: Operación realizada correctamente.
- 201: Producto registrado.
- 400: Datos incorrectos o inválidos.
- 404: Recurso no encontrado.
- 500: Error interno del servidor.

## Pruebas

Se realizaron pruebas de las operaciones CRUD, validación de datos, consulta de registros inexistentes y manejo de errores.

Las evidencias se encuentran en la carpeta `evidencias`.

## Base de datos

Gestor utilizado: MySQL.

Base de datos: `tienda_db`.

Tabla principal: `productos`.

## Uso de inteligencia artificial

Se utilizó inteligencia artificial como herramienta de apoyo para orientar el desarrollo, resolver dudas, revisar código y comprender las operaciones de conexión, validación y administración de registros.