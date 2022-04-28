//IMPORTACIONES
const express = require('express');
const productosController = require('../controllers/productoSucursal.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//RUTAS
var api = express.Router();

//LOGIN
//api.get('/obtenerProductos',[md_autentificacion.Auth, md_roles.verEmpresa],productosController.obtenerProductoEmpresa);
//api.get('/obtenerProductosSucursal/:nombreSucursal',[md_autentificacion.Auth, md_roles.verEmpresa],productosController.obtenerProductosSucursales);
api.get('/buscarProductoSucursal/:idSucursal', [md_autentificacion.Auth, md_roles.verEmpresa],productosController.obtenerProductosSucursales);
api.post('/enviarProducto', [md_autentificacion.Auth,md_roles.verEmpresa], productosController.enviarProductoSucursales);
//api.put('/editarProducto/:idProducto',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.editarProductoEmpresa);
//api.delete('/eliminarProducto/:idProducto',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.eliminarProductoEmpresa);
//api.put('/enviarProducto/:idProducto', [md_autentificacion.Auth,md_roles.verEmpresa], productosController.enviarProductosSucursal);

api.get('/buscarNombreProductoSucursal/:nombreProductoSucursal',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoSucursalNombre);
api.get('/buscarStockProductoSucursal',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoSucursalStock);
api.get('/buscarStockProductoSucursalMenor',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoSucursalStockMenor);

module.exports = api;