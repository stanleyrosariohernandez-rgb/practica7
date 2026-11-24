
const express = require("express");
const router = express.Router();

const { conexion } = require("../config/database");

// =====================================
// READ: CONSULTAR TODOS LOS PRODUCTOS
// =====================================

router.get("/", async (req, res) => {
    try {
        const [productos] = await conexion.query(
            "SELECT * FROM productos ORDER BY id DESC"
        );

        res.status(200).json(productos);

    } catch (error) {
        console.error("Error al consultar:", error);

        res.status(500).json({
            mensaje: "Error al consultar los productos."
        });
    }
});

// =====================================
// READ: CONSULTAR UN PRODUCTO POR ID
// =====================================

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID debe ser un número válido."
            });
        }

        const [productos] = await conexion.query(
            "SELECT * FROM productos WHERE id = ?",
            [id]
        );

        if (productos.length === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado."
            });
        }

        res.status(200).json(productos[0]);

    } catch (error) {
        console.error("Error al buscar:", error);

        res.status(500).json({
            mensaje: "Error al consultar el producto."
        });
    }
});

// =====================================
// CREATE: REGISTRAR PRODUCTO
// =====================================

router.post("/", async (req, res) => {
    try {
        const { nombre, descripcion, precio, cantidad } = req.body;

        if (
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            nombre.trim().length > 100
        ) {
            return res.status(400).json({
                mensaje: "El nombre es obligatorio y debe tener máximo 100 caracteres."
            });
        }

        if (
            typeof precio !== "number" ||
            !Number.isFinite(precio) ||
            precio <= 0
        ) {
            return res.status(400).json({
                mensaje: "El precio debe ser un número mayor que cero."
            });
        }

        if (
            typeof cantidad !== "number" ||
            !Number.isInteger(cantidad) ||
            cantidad < 0
        ) {
            return res.status(400).json({
                mensaje: "La cantidad debe ser un número entero igual o mayor que cero."
            });
        }

        const descripcionFinal =
            descripcion === undefined ? "" : descripcion;

        if (
            typeof descripcionFinal !== "string" ||
            descripcionFinal.length > 5000
        ) {
            return res.status(400).json({
                mensaje: "La descripción no es válida."
            });
        }

        const [resultado] = await conexion.query(
            `INSERT INTO productos
            (nombre, descripcion, precio, cantidad)
            VALUES (?, ?, ?, ?)`,
            [
                nombre.trim(),
                descripcionFinal.trim(),
                precio,
                cantidad
            ]
        );

        res.status(201).json({
            mensaje: "Producto registrado correctamente.",
            id: resultado.insertId
        });

    } catch (error) {
        console.error("Error al registrar:", error);

        res.status(500).json({
            mensaje: "Error al registrar el producto."
        });
    }
});

// =====================================
// UPDATE: MODIFICAR PRODUCTO
// =====================================

router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID debe ser válido."
            });
        }

        const { nombre, descripcion, precio, cantidad } = req.body;

        if (
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            nombre.trim().length > 100
        ) {
            return res.status(400).json({
                mensaje: "El nombre es obligatorio y debe tener máximo 100 caracteres."
            });
        }

        if (
            typeof precio !== "number" ||
            !Number.isFinite(precio) ||
            precio <= 0
        ) {
            return res.status(400).json({
                mensaje: "El precio debe ser mayor que cero."
            });
        }

        if (
            typeof cantidad !== "number" ||
            !Number.isInteger(cantidad) ||
            cantidad < 0
        ) {
            return res.status(400).json({
                mensaje: "La cantidad debe ser un entero igual o mayor que cero."
            });
        }

        const descripcionFinal =
            descripcion === undefined ? "" : descripcion;

        if (
            typeof descripcionFinal !== "string" ||
            descripcionFinal.length > 5000
        ) {
            return res.status(400).json({
                mensaje: "La descripción no es válida."
            });
        }

        const [existentes] = await conexion.query(
    "SELECT id FROM productos WHERE id = ?",
    [id]
);

if (existentes.length === 0) {
    return res.status(404).json({
        mensaje: "Producto no encontrado."
    });
}

        const [resultado] = await conexion.query(
            `UPDATE productos
            SET nombre = ?, descripcion = ?, precio = ?, cantidad = ?
            WHERE id = ?`,
            [
                nombre.trim(),
                descripcionFinal.trim(),
                precio,
                cantidad,
                id
            ]
        );

        

        res.status(200).json({
            mensaje: "Producto actualizado correctamente."
        });

    } catch (error) {
        console.error("Error al modificar:", error);

        res.status(500).json({
            mensaje: "Error al modificar el producto."
        });
    }
});

// =====================================
// DELETE: ELIMINAR PRODUCTO
// =====================================

router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID debe ser válido."
            });
        }

        const [resultado] = await conexion.query(
            "DELETE FROM productos WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado."
            });
        }

        res.status(200).json({
            mensaje: "Producto eliminado correctamente."
        });

    } catch (error) {
        console.error("Error al eliminar:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el producto."
        });
    }
});

module.exports = router;

