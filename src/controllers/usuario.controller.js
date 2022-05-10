const Usuarios = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


// BUSQUEDAS
function ObtenerEmpresas (req, res) {

    Usuarios.find((err, empresasObtenidas) => {
        
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ usuarios: empresasObtenidas })
    })
}

function ObtenerEmpresaId(req, res){
    var idEmpresa = req.params.idEmpresa

    Usuarios.findById(idEmpresa,(err,empresaEncontrada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!empresaEncontrada) return res.status(404).send( { mensaje: 'Error al obtener la Empresa' });

        return res.status(200).send({ usuarios: empresaEncontrada });
    })
}

//LOGIN
function login(req,res){
    var paramentros = req.body;

    Usuarios.findOne({email: paramentros.email},(err,usuarioGuardado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'})
        if(usuarioGuardado){
            bcrypt.compare(paramentros.password,usuarioGuardado.password,(err,verificacionPassword)=>{
                if(verificacionPassword){
                    if(paramentros.obtenerToken === 'true'){
                        return res.status(200).send({
                            token: jwt.crearToken(usuarioGuardado)
                        })
                    }else{
                        usuarioGuardado.password = undefined;
                        return res.status(200).send({usuario: usuarioGuardado})
                    }
                }else{
                    return res.status(500).send({mensaje:'La contrasena no coincide'})
                }
            })
        }else{
            return res.status(500).send({mensaje: 'El usuario no se encuentra o no se identifica'})
        }
    })
}

//AGREGAR ADMIN -- AL INSTANTE
function RegistrarAdmin(req, res){
    var usuariosModel = new Usuarios();   
    usuariosModel.nombre = 'superAdmin';
    usuariosModel.email = 'Admin@gmail.com';
    usuariosModel.rol = 'ROL_ADMINISTRADOR';

    Usuarios.find({ nombre: 'superAdmin', email: 'Admin@gmail.com'}, (err, usuarioEncontrato) => {
        if (usuarioEncontrato.length == 0) {
            bcrypt.hash("123456",null, null, (err, passswordEncypt) => { 
                usuariosModel.password = passswordEncypt
                usuariosModel.save((err, usuarioGuardado) => {
                console.log(err)
                })
            })
        } else {
            console.log('Este usuario con el puesto de Administrador ya esta creado')
        }
    })
}

function registrarEmpresa(req, res){
    var parametros = req.body;
    var usuariosModel = new Usuarios();
  
    if(parametros.nombre, parametros.email, parametros.tipo, parametros.municipio){
        usuariosModel.nombre = parametros.nombre;
        usuariosModel.email =  parametros.email;
        usuariosModel.tipo = parametros.tipo;
        usuariosModel.municipio = parametros.municipio;
        usuariosModel.rol = 'ROL_EMPRESA';
            Usuarios.find({nombre: parametros.nombre}
                ,(err, empresaGuardada)=>{
                if(empresaGuardada.length == 0){
                    bcrypt.hash(parametros.password, null,null, (err, passwordEncriptada)=>{
                        usuariosModel.password = passwordEncriptada;
                        usuariosModel.save((err, empGuardada) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!empGuardada) return res.status(404).send({mensaje: 'No se agrego la empresa'});
  
                            return res.status(201).send({usuarios: empGuardada});
                         })
                    })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Error en la peticion agregar' });
        }
}

function registrarUsuario(req, res){
    var parametros = req.body;
    var usuariosModel = new Usuarios();
  
    if(parametros.nombre, parametros.email, parametros.tipo, parametros.municipio){
        usuariosModel.nombre = parametros.nombre;
        usuariosModel.email =  parametros.email;
        usuariosModel.tipo = parametros.tipo;
        usuariosModel.municipio = parametros.municipio;
        usuariosModel.rol = 'ROL_EMPRESA';
            Usuarios.find({nombre: parametros.nombre}
                ,(err, usuarioGuardado)=>{
                if(usuarioGuardado.length == 0){
                    bcrypt.hash(parametros.password, null,null, (err, passwordEncriptada)=>{
                        usuariosModel.password = passwordEncriptada;
                        usuariosModel.save((err, usGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!usGuardado) return res.status(404).send({mensaje: 'No se agrego la empresa'});
  
                            return res.status(201).send({usuarios: usGuardado});
                         })
                    })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
    }else{
        return res.status(500).send({ mensaje: 'Error en la peticion agregar' });
    }
}

function editarEmpresa(req, res){
    var idUser = req.params.idUsuario;
    var paramentros = req.body;

        Usuarios.findByIdAndUpdate({_id: idUser, email: paramentros.email, password: paramentros.password, tipo: paramentros.tipo, rol: paramentros.rol}, paramentros,{new:true},
            (err, empresaEditada)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!empresaEditada) return res.status(400).send({mensaje: 'No se puede ediar la empresa'});
                
                return res.status(200).send({usuarios: empresaEditada});
            })
}


function eliminarEmpresa(req, res){
    var idUser = req.params.idUsuario;
    var paramentros = req.body;

        Usuarios.findByIdAndDelete({_id: idUser},(err, empresaEliminada)=>{
                
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!empresaEliminada) return res.status(400).send({mensaje: 'No es puede eliminar la empresa'});
                
                return res.status(200).send({usuarios: empresaEliminada});
            })
}

function ObtenerEmpresaId(req, res){
    var idEmpresa = req.params.idEmpresa

    Usuarios.findById(idEmpresa,(err,empresaEncontrada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!empresaEncontrada) return res.status(404).send( { mensaje: 'Error al obtener la Empresa' });

        return res.status(200).send({ usuarios: empresaEncontrada });
    })
}

module.exports = {
    login,
    RegistrarAdmin,
    registrarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    ObtenerEmpresas,
    registrarUsuario,
    ObtenerEmpresaId
}