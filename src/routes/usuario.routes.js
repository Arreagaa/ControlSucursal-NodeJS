//IMPORTACIONES
const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autentificacion = require('../middlewares/autentificacion');

//RUTAS
var api = express.Router();

//LOGIN
api.post('/login', usuarioController.login);

module.exports = api;