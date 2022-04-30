const ProductoSucursal = require('../models/pruductoSucursal.model');
const Sucursales = require('../models/sucursales.model');
const Productos = require('../models/productos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function obtenerProductosSucursales(req, res){
    var idSucursal = req.params.idSucursal;

            ProductoSucursal.find({idSucursal: idSucursal}, (err, sucursalProductos)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
                if(!sucursalProductos) return res.status(404).send({mensaje : "Error, no se encuentran productos en dicha sucursal"});

                return res.status(200).send({productosSucursal : sucursalProductos});
            }).populate('idSucursal')

}

//OBTENER POR ID 
function ObtenerProductoSucursalId(req, res){
    var idProducto = req.params.idProducto

    ProductoSucursal.findOne({_id:idProducto, idEmpresa: req.user.sub},(err,productoEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEncontrado) return res.status(404).send( { mensaje: 'Error al obtener la Empresa' });

        return res.status(200).send({ productosSucursal: productoEncontrado });
    })
}

//OBTNER POR NOMBRE
function ObtenerProductoSucursalNombre(req, res){
    var nombreProductoSucursal = req.params.nombreProductoSucursal;

        ProductoSucursal.find({nombreProductoSucursal: {$regex:nombreProductoSucursal,$options:'i'}}, (err, sucursalProductos) =>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!sucursalProductos) return res.status(404).send({mensaje : "Error, no se encuentran productos con ese nombre"});
            return res.status(200).send({productosSucursal : sucursalProductos});
        })
}

//OBTNER POR STOCK MAYOR A MENOR
function ObtenerProductoSucursalStock(req, res){
    ProductoSucursal.find().sort({stockSucursal : -1 }).exec((err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!productoEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran productos con ese nombre"});
            return res.status(200).send({productosSucursal : productoEncontrado});
    })
}

//OBTNER POR STOCK MENOR A MAYOR
function ObtenerProductoSucursalStockMenor(req, res){
    ProductoSucursal.find().sort({stockSucursal : +1 }).exec((err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!productoEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran productos con ese nombre"});
            return res.status(200).send({productosSucursal : productoEncontrado});
    })
}

function enviarProductoSucursales(req, res) {
    var parametros = req.body;

    if (parametros.nombreProductoSucursal && parametros.stockSucursal && parametros.nombreSucursal) {

        Sucursales.findOne({ nombreSucursal: parametros.nombreSucursal, idEmpresa: req.user.sub }, 
            (err, sucursalEncontrada) => {

            if (err) return res.status(400).send({ message: 'Sucursal inexistente' });
            if (!sucursalEncontrada) return res.status(400).send({ message: 'Sucursal inexistente en la empresa' })

            ProductoSucursal.findOne({ nombreProductoSucursal: parametros.nombreProductoSucursal, idSucursal: sucursalEncontrada._id }, 
                (err, productoEncontradoSucursal) => {

                if (err) return res.status(404).send({ message: 'Datos incorrectos' })
                if (productoEncontradoSucursal == null) {

                    Productos.findOne({ nombreProducto: parametros.nombreProductoSucursal, idEmpresa: req.user.sub }, 
                        (err, productoEmpresaStock) => {

                        var ProductoSucursalModel = new ProductoSucursal();
                        ProductoSucursalModel.nombreProductoSucursal = parametros.nombreProductoSucursal;
                        ProductoSucursalModel.stockSucursal = parametros.stockSucursal;
                        ProductoSucursalModel.idSucursal = sucursalEncontrada._id;
                        ProductoSucursalModel.idEmpresa = req.user.sub;      

                        if (err) return res.status(400).send({ message: 'Sucursal inexistente. Nombre incorrecto' });                     
                        if (parametros.stockSucursal > productoEmpresaStock.stock) {
                        return res.status(500).send({ message: 'La cantidad sobrepasa el stock.'});}

                        Productos.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { stock: parametros.stockSucursal*-1 } }, { new: true }, 
                            (err, productoEmpresaEditado) => {

                            if (err) return res.status(500).send({ message: 'No se puede editar el producto de empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'No existen productos a editar en la empresa' });
                            ProductoSucursalModel.save(
                                (err, ProductoGuardado) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!ProductoGuardado) return res.status(404).send({ message: 'No existen productos para ser guardados' });
                                return res.status(200).send({ productosSucursal: ProductoGuardado });
                            });
                        })
                    })
                } else {
                    Productos.findOne({ nombreProducto: parametros.nombreProductoSucursal, idEmpresa: req.user.sub }, 
                        (err, controlStock) => {
                        if (err) return res.status(400).send({ message: 'Dicha Sucursal no existe' });
                        if (parametros.stockSucursal > controlStock.stock) 
                        return res.status(500).send({ message: 'La cantidad sobrepasa el stock.' })

                        Productos.findOneAndUpdate({ _id: controlStock._id, idEmpresa: req.user.sub }, {$inc:{stock:parametros.stockSucursal*-1 } }, {new: true}, 
                            (err, stockEmpresa) => {
                            if (err) return res.status(500).send({ message: 'No se puede editar el producto de empresa' });
                            if (!stockEmpresa) return res.status(404).send({ message: 'No existen productos a editar en la empresa' });
                            ProductoSucursal.findOneAndUpdate({ _id: productoEncontradoSucursal._id }, { $inc: { stockSucursal: parametros.stockSucursal } }, { new: true }, 
                                (err, stockSucursal) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!stockSucursal) return res.status(404).send({ message: 'No existen productos a editar en la sucursal' });
                                return res.status(200).send({ productosSucursal: stockSucursal });
                            });
                        })
                        
                    })
                }
            })
        })
    } else {
        return res.status(500).send({ message: 'Complete todos los datos' });
    }
}


function ventaSucursal (req, res){
    var idSucursal = req.params.idSucursal;
    var parametros = req.body;

    Sucursales.findOne({_id: idSucursal, idEmpresa: req.user.sub},(err, sucursalEncontrada)=>{

        if (err) return res.status(400).send({ message: 'Dicha Sucursal es inexistente'});
        if (!sucursalEncontrada) return res.status(400).send({ message: 'Sucursal no existe en tu empresa' })
        if (parametros.nombreProductoSucursal, parametros.nombreProductoSucursal != "", parametros.cantidadVendida, parametros.cantidadVendida != ""){

            ProductoSucursal.findOne({nombreProductoSucursal: parametros.nombreProductoSucursal, idSucursal: sucursalEncontrada._id},
                (err, productoEncontradoSucursal)=>{
                    if (err) return res.status(400).send({ message: 'El producto no se encuentra sucursal'});
                    if (!productoEncontradoSucursal) return res.status(400).send({ message: 'El producto no se encuentra sucursal'})
                    if(productoEncontradoSucursal.stockSucursal == 0) return res.status(500).send({mensaje: 'Producto Agotado actualmente'})
                    if(parametros.cantidadVendida > productoEncontradoSucursal.stockSucursal){
                    return res.status(500).send({mensaje:'Cantidad mayor al stock'})
                }

                ProductoSucursal.findOneAndUpdate({_id: productoEncontradoSucursal._id}, {$inc: {stockSucursal: parametros.cantidadVendida * -1, cantidadVendida: parametros.cantidadVendida}},{new: true},
                    (err, productoEditado)=>{
                        if(err) return res.status(500).send({ message: "error en la peticion" })
                        if (!productoEditado) return res.status(404).send({mensaje: 'no se encuentran productos'})
                        return res.status(200).send({productosSucursal: productoEditado})
                })
            })
        }else{
            return res.status(500).send({mensaje: 'Revisa los datos, pueden que esten incorrectos'})
        }

    })
}



module.exports ={
    obtenerProductosSucursales,
    ObtenerProductoSucursalId,
    enviarProductoSucursales,
    ObtenerProductoSucursalNombre,
    ObtenerProductoSucursalStock,
    ObtenerProductoSucursalStockMenor,
    ventaSucursal
}