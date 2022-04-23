// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const SucursalesRutas = require('./src/routes/sucursales.routes');
const ProductosRutas = require('./src/routes/producto.routes');
const ProductoSucRutas = require('./src/routes/productoSucursales.routes')

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuarioRutas, SucursalesRutas, ProductosRutas, ProductoSucRutas);


module.exports = app;