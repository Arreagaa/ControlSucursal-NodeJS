//IMPORTACIONES
const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//ini
var api = express.Router();

//rutas
api.post('/login', usuarioController.login);

api.post('/registrarEmpresa', [md_autentificacion.Auth,md_roles.verAdmin],usuarioController.registrarEmpresa);

api.post('/registrarUsuario', usuarioController.registrarUsuario);

api.put('/editarEmpresa/:idUsuario',[md_autentificacion.Auth],usuarioController.editarEmpresa);

api.delete('/eliminarEmpresa/:idUsuario', [md_autentificacion.Auth,md_roles.verAdmin],usuarioController.eliminarEmpresa);

api.get('/obtenerEmpresas',[md_autentificacion.Auth, md_roles.verAdmin],usuarioController.ObtenerEmpresas);

api.get('/obtenerEmpresaId/:idEmpresa',[md_autentificacion.Auth, md_roles.verAdmin],usuarioController.ObtenerEmpresaId);

module.exports = api;