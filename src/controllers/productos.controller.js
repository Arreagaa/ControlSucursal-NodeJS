const Productos = require('../models/productos.model');
const Sucursales = require('../models/sucursales.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function obtenerProductoEmpresa (req, res) {

    Productos.find({idEmpresa: req.user.sub},(err, productosObtenidos) =>{
        if(err) return res.send({mensaje:"Error: "+err})
   
        return res.send({productos: productosObtenidos})
    })
}

function ObtenerProductoId(req, res){
    var idProducto = req.params.idProducto

    Productos.findOne({_id:idProducto, idEmpresa: req.user.sub},(err,productoEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEncontrado) return res.status(404).send( { mensaje: 'Error al obtener la Empresa' });

        return res.status(200).send({ productos: productoEncontrado });
    })
}

//OBTNER POR NOMBRE
function ObtenerProductoNombre(req, res){
    var nombreProducto = req.params.nombreProducto;

        Productos.find({nombreProducto: {$regex:nombreProducto,$options:'i'}}, (err, productoEncontrado) =>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!productoEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran productos con ese nombre"});
            return res.status(200).send({productos : productoEncontrado});
        })
}

//OBTNER POR STOCK MAYOR A MENOR
function ObtenerProductoStock(req, res){
    Productos.find().sort({stock : -1 }).exec((err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!productoEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran productos con ese nombre"});
            return res.status(200).send({productos : productoEncontrado});
    })
}

//OBTNER POR STOCK MENOR A MAYOR
function ObtenerProductoStockMenor(req, res){
    Productos.find().sort({stock : +1 }).exec((err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!productoEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran productos con ese nombre"});
            return res.status(200).send({productos : productoEncontrado});
    })
}

//OBTNER POR NOMBRE PROVEEDOR
function ObtenerProductoProveedor(req, res){
    var nombreProveedor = req.params.nombreProveedor;

        Productos.find({nombreProveedor: {$regex:nombreProveedor,$options:'i'}}, (err, productoEncontrado) =>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!productoEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran productos con ese proveedor"});
            return res.status(200).send({productos : productoEncontrado});
        })
}

function agregarProductoEmpresa(req, res) {
var parametros = req.body;
var productoModel = new Productos();

if (parametros.nombreProducto && parametros.nombreProducto && parametros.stock) {
    productoModel.nombreProducto = parametros.nombreProducto;
    productoModel.nombreProveedor = parametros.nombreProveedor;
    productoModel.stock = parametros.stock;
    productoModel.idEmpresa = req.user.sub;
}else {
    return res.status(500).send({ message: "error" })
}

Productos.find({ nombre: parametros.nombreProducto, nombreProveedor:parametros.nombreProveedor, stock: parametros.stock,idEmpresa:req.user.sub},
    (err, productoGuardado) => {
    if (productoGuardado.length==0) {
        productoModel.save((err, productosGuardados) => {
            console.log(err)
            if (err) return res.status(500).send({ message: "error en la peticion" });
            if (!productosGuardados) return res.status(404).send({ message: "No se puede agregar un producto" });
            return res.status(200).send({ productos: productosGuardados  });
        });
        
    } else {
        return res.status(500).send({ message: 'producto existente' });
    }
})
}


function editarProductoEmpresa(req,res){
var idProd = req.params.idProducto;
var paramentros = req.body; 

Productos.findOneAndUpdate({_id:idProd, idEmpresa:req.user.sub},paramentros,{new:true},
    (err,productoEditado)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
    if(!productoEditado) return res.status(400).send({mensaje: 'No se puede editar el producto'});
    return res.status(200).send({productos: productoEditado});
})
}

function eliminarProductoEmpresa(req,res){
var idProd = req.params.idProducto; 

Productos.findOneAndDelete({_id:idProd, idEmpresa:req.user.sub},
    (err,productoEliminado)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
    if(!productoEliminado) return res.status(400).send({mensaje: 'No se puede eliminar el producto'});
    return res.status(200).send({productos: productoEliminado});

})
}

module.exports = {
    obtenerProductoEmpresa,
    agregarProductoEmpresa,
    editarProductoEmpresa,
    eliminarProductoEmpresa,
    ObtenerProductoId,
    ObtenerProductoNombre,
    ObtenerProductoStock,
    ObtenerProductoProveedor,
    ObtenerProductoStockMenor
}