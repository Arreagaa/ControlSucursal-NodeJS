const Sucursales = require('../models/sucursales.model');
const jwt = require('../services/jwt');

function ObtenerSucursales (req, res) {
    idEmpresas = req.params.idSucursal
    if(req.user.rol == 'ROL_ADMINISTRADOR'){
        Sucursales.find({idEmpresa: idEmpresas},(err, sucursalesObtenidas) =>{
            if(err) return res.send({mensaje:"Error: "+err})
            return res.send({sucursales: sucursalesObtenidas})
        })
        
    }else{
        Sucursales.find({idEmpresa: req.user.sub},(err, sucursalesObtenidas) =>{
            if(err) return res.send({mensaje:"Error: "+err})
       
            return res.send({sucursales: sucursalesObtenidas})
        })
    }
        
}

function ObtenerSucursalId(req, res){
    var idSucursal = req.params.idSucursal

    Sucursales.findOne({_id:idSucursal,idEmpresa:req.user.sub},(err,sucursalEncontrada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!sucursalEncontrada) return res.status(404).send( { mensaje: 'Error al obtener la Empresa' });

        return res.status(200).send({ sucursales: sucursalEncontrada });
    })
}

function agregarSucursal(req, res) {
    var parametros = req.body;
    var sucursalModel = new Sucursales();

    if (parametros.nombreSucursal && parametros.direccionSucursal) {
        sucursalModel.nombreSucursal = parametros.nombreSucursal;
        sucursalModel.direccionSucursal = parametros.direccionSucursal;
        sucursalModel.idEmpresa = req.user.sub; 

    Sucursales.find({ nombreSucursal: parametros.nombreSucursal,direccionSucursal:parametros.direccionSucursal,idEmpresa:req.user.sub},
        (err, sucursalGuardada) => {
        if (sucursalGuardada.length==0) {
            sucursalModel.save((err, sucGuardada) => {
                console.log(err)
                if (err) return res.status(500).send({ message: "error en la peticion" });
                if (!sucGuardada) return res.status(404).send({ message: "No se puede agregar una sucursal" });
                return res.status(200).send({ sucursales: sucGuardada  });
            })  
        } else {
            return res.status(500).send({ message: 'sucursal existente' });
        }
    })
    }else {
        return res.status(500).send({ message: "error" })
    }
}

function editarSucursal(req,res){
    var idSuc = req.params.idSucursal;
    var paramentros = req.body; 

    Sucursales.findOneAndUpdate({_id:idSuc, idEmpresa:req.user.sub},paramentros,{new:true},
        (err,sucursalEditada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!sucursalEditada) return res.status(400).send({mensaje: 'No se puede editar la sucursal'});
        return res.status(200).send({sucursales: sucursalEditada});
    })
}

function eliminarSucursal(req,res){
    var idSuc = req.params.idSucursal; 

    Sucursales.findOneAndDelete({_id:idSuc, idEmpresa:req.user.sub},
        (err,sucursalEliminada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!sucursalEliminada) return res.status(400).send({mensaje: 'No se puede eliminar la sucursal'});
        return res.status(200).send({sucursales: sucursalEliminada});

    })
}

module.exports = {
    ObtenerSucursales,
    agregarSucursal,
    editarSucursal,
    eliminarSucursal,
    ObtenerSucursalId
}