//IMPORTACIONES
const express = require('express');
const sucursalesController = require('../controllers/sucursales.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//RUTAS
var api = express.Router();

//LOGIN
api.get('/obtenerSucurales/:idSucursal?',md_autentificacion.Auth,sucursalesController.ObtenerSucursales)
api.post('/agregarSucursal', [md_autentificacion.Auth,md_roles.verEmpresa], sucursalesController.agregarSucursal);
api.put('/editarSucursal/:idSucursal',[md_autentificacion.Auth,md_roles.verEmpresa], sucursalesController.editarSucursal);
api.delete('/eliminarSucursal/:idSucursal',[md_autentificacion.Auth,md_roles.verEmpresa], sucursalesController.eliminarSucursal);
api.get('/ObtenerSucursalId/:idSucursal',[md_autentificacion.Auth, md_roles.verEmpresa],sucursalesController.ObtenerSucursalId);



module.exports = api;