
// ==========================================
// SISTEMA DE GESTIÓN DE PRODUCTOS
// ==========================================

// Elementos del formulario
const formulario = document.getElementById("formularioProducto");

const campoNombre = document.getElementById("nombre");
const campoDescripcion = document.getElementById("descripcion");
const campoPrecio = document.getElementById("precio");
const campoCantidad = document.getElementById("cantidad");

const tablaProductos = document.getElementById("tablaProductos");
const tituloFormulario = document.getElementById("tituloFormulario");
const btnGuardar = document.getElementById("btnGuardar");

// ID del producto que estamos modificando
let productoEditando = null;

// ==========================================
// FUNCIÓN: CONSULTAR PRODUCTOS
// ==========================================

async function cargarProductos() {
    try {
        const respuesta = await fetch("/api/productos");

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los productos.");
        }

        const productos = await respuesta.json();

        tablaProductos.innerHTML = "";

        if (productos.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 6;
            celda.className = "mensaje-vacio";
            celda.textContent = "No hay productos registrados.";

            fila.appendChild(celda);
            tablaProductos.appendChild(fila);

            return;
        }

        productos.forEach(producto => {
            const fila = document.createElement("tr");

            const datos = [
                producto.id,
                producto.nombre,
                producto.descripcion || "Sin descripción",
                Number(producto.precio).toFixed(2),
                producto.cantidad
            ];

            datos.forEach(dato => {
                const celda = document.createElement("td");

                celda.textContent = dato;
                fila.appendChild(celda);
            });

            // Celda de acciones
            const celdaAcciones = document.createElement("td");

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.className = "btn-editar";
            btnEditar.dataset.accion = "editar";
            btnEditar.dataset.id = producto.id;

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "btn-eliminar";
            btnEliminar.dataset.accion = "eliminar";
            btnEliminar.dataset.id = producto.id;

            celdaAcciones.appendChild(btnEditar);
            celdaAcciones.appendChild(btnEliminar);

            fila.appendChild(celdaAcciones);

            tablaProductos.appendChild(fila);
        });

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// ==========================================
// FUNCIÓN: REGISTRAR O MODIFICAR
// ==========================================

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    // Validar nombre
if (campoNombre.value.trim() === "") {
    alert("El nombre del producto es obligatorio.");
    campoNombre.focus();
    return;
}

// Validar precio
if (
    campoPrecio.value === "" ||
    !Number.isFinite(Number(campoPrecio.value)) ||
    Number(campoPrecio.value) <= 0
) {
    alert("El precio debe ser mayor que cero.");
    campoPrecio.focus();
    return;
}

// Validar cantidad
if (
    campoCantidad.value === "" ||
    !Number.isInteger(Number(campoCantidad.value)) ||
    Number(campoCantidad.value) < 0
) {
    alert("La cantidad debe ser un número entero igual o mayor que cero.");
    campoCantidad.focus();
    return;
}

    const producto = {
        nombre: campoNombre.value.trim(),
        descripcion: campoDescripcion.value.trim(),
        precio: Number(campoPrecio.value),
        cantidad: Number(campoCantidad.value)
    };

    const esEdicion = productoEditando !== null;

    const url = esEdicion
        ? `/api/productos/${productoEditando}`
        : "/api/productos";

    const metodo = esEdicion ? "PUT" : "POST";

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "Error al guardar.");
        }

        alert(resultado.mensaje);

        formulario.reset();

        await cargarProductos();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

// ==========================================
// FUNCIÓN: EDITAR PRODUCTO
// ==========================================

async function editarProducto(id) {
    try {
        const respuesta = await fetch(`/api/productos/${id}`);

        const producto = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(producto.mensaje);
        }

        productoEditando = id;

        campoNombre.value = producto.nombre;
        campoDescripcion.value = producto.descripcion || "";
        campoPrecio.value = producto.precio;
        campoCantidad.value = producto.cantidad;

        tituloFormulario.textContent = "Modificar producto";
        btnGuardar.textContent = "Actualizar producto";

        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// ==========================================
// FUNCIÓN: ELIMINAR PRODUCTO
// ==========================================

async function eliminarProducto(id) {
    const confirmar = confirm(
        "¿Estás seguro de que deseas eliminar este producto?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`/api/productos/${id}`, {
            method: "DELETE"
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje);
        }

        alert(resultado.mensaje);

        // Si se estaba editando el producto eliminado,
        // limpiar el formulario.
        if (productoEditando === id) {
            formulario.reset();
        }

        await cargarProductos();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// ==========================================
// DETECTAR BOTONES DE LA TABLA
// ==========================================

tablaProductos.addEventListener("click", function(evento) {
    const boton = evento.target.closest("button");

    if (!boton) {
        return;
    }

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.accion;

    if (accion === "editar") {
        editarProducto(id);
    }

    if (accion === "eliminar") {
        eliminarProducto(id);
    }
});

// ==========================================
// RESTABLECER FORMULARIO
// ==========================================

formulario.addEventListener("reset", function() {
    productoEditando = null;

    tituloFormulario.textContent = "Registrar producto";
    btnGuardar.textContent = "Guardar producto";
});

// ==========================================
// INICIAR APLICACIÓN
// ==========================================

cargarProductos();

console.log("Sistema CRUD iniciado correctamente.");
