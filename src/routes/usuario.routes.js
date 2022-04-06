//IMPORTACIONES
const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//RUTAS
var api = express.Router();

//LOGIN
api.post('/login', usuarioController.login);

api.post('/registrarEmpresa', [md_autentificacion.Auth,md_roles.verAdmin],usuarioController.registrarEmpresa);

api.post('/registrarUsuario', /*[md_autentificacion.Auth, md_roles.verAdmin],*/usuarioController.registrarUsuario);

api.put('/editarEmpresa/:idUsuario',[md_autentificacion.Auth],usuarioController.editarEmpresa);

api.delete('/eliminarEmpresa/:idUsuario', [md_autentificacion.Auth,md_roles.verAdmin],usuarioController.eliminarEmpresa);

api.get('/obtenerEmpresas',[md_autentificacion.Auth, md_roles.verAdmin],usuarioController.ObtenerEmpresas);

module.exports = api;