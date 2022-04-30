//IMPORTACIONES
const express = require('express');
const productosController = require('../controllers/productoSucursal.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//api
var api = express.Router();

//rutas
api.get('/buscarProductoSucursal/:idSucursal', [md_autentificacion.Auth, md_roles.verEmpresa],productosController.obtenerProductosSucursales);
api.post('/enviarProducto', [md_autentificacion.Auth,md_roles.verEmpresa], productosController.enviarProductoSucursales);
api.put('/venta/:idSucursal',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ventaSucursal);
api.get('/buscarNombreProductoSucursal/:nombreProductoSucursal',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoSucursalNombre);
api.get('/buscarStockProductoSucursal',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoSucursalStock);
api.get('/buscarStockProductoSucursalMenor',[md_autentificacion.Auth,md_roles.verEmpresa], productosController.ObtenerProductoSucursalStockMenor);
api.get('/obtenerProductosSucursalId/:idProducto',[md_autentificacion.Auth, md_roles.verEmpresa],productosController.ObtenerProductoSucursalId)

module.exports = api;