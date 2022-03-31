const Usuarios = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

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
                            toke: jwt.crearToken(usuarioGuardado)
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

module.exports = {
    login,
    RegistrarAdmin
}