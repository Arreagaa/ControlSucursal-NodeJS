// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const SucursalesRutas = require('./src/routes/sucursales.routes');
const ProductosRutas = require('./src/routes/producto.routes');
//const EmpresaRutas = require('./src/routes/empresa.routes');

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuarioRutas, /*EmpresaRutas*/SucursalesRutas, ProductosRutas);


module.exports = app;