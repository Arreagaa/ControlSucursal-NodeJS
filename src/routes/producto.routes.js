//IMPORTACIONES
const express = require('express');
const productosController = require('../controllers/productos.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//RUTAS
var api = express.Router();

//LOGIN
api.get('/obtenerProductos',[md_autentificacion.Auth, md_roles.verEmpresa],productosController.obtenerProductoEmpresa);
api.get('/obtenerProductosId/:idProducto',[md_autentificacion.Auth, md_roles.verEmpresa],productosController.ObtenerProductoId)
api.post('/agregarProducto', [md_autentificacion.Auth,md_roles.verEmpresa], productosController.agregarProductoEmpresa);
api.put('/editarProducto/:idProducto',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.editarProductoEmpresa);
api.delete('/eliminarProducto/:idProducto',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.eliminarProductoEmpresa);

api.get('/buscarNombreProducto/:nombreProducto',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoNombre);
api.get('/buscarStockProducto',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoStock);
api.get('/buscarProveedorProducto/:nombreProveedor',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoProveedor);
api.get('/buscarStockProductoMenor',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoStockMenor);

module.exports = api;