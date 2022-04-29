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

                        if (err) return res.status(400).send({ message: 'Sucursal inexistente. Nombre incorrecto' });                     
                        if (parametros.stockSucursal > parametros.stock) {
                        return res.status(500).send({ message: 'La cantidad sobrepasa el stock. Stock del Producto: ' + productoEmpresaStock.stock });}

                        var ProductosSucursalModelo = new ProductoSucursal();
                        ProductosSucursalModelo.nombreProductoSucursal = parametros.nombreProductoSucursal;
                        ProductosSucursalModelo.stockSucursal = parametros.stockSucursal;
                        ProductosSucursalModelo.idSucursal = sucursalEncontrada._id;
                        ProductosSucursalModelo.idEmpresa = req.user.sub;      
                        
                        var actualizarStock = (parametros.stockSucursal * -1)

                        Productos.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { stock: actualizarStock } }, { new: true }, 
                            (err, productoEmpresaEditado) => {

                            if (err) return res.status(500).send({ message: 'No se puede editar el producto de empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'No existen productos a editar en la empresa' });
                            ProductosSucursalModelo.save(
                                (err, ProductoGuardado) => {

                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!ProductoGuardado) return res.status(404).send({ message: 'No existen productos para ser guardados' });
                                return res.status(200).send({ productosSucursal: ProductoGuardado });
                            });
                        })
                    })
                } else {

                    var actualizarStock = (parametros.stockSucursal * -1)

                    Productos.findOne({ nombreProducto: parametros.nombreProductoSucursal, idEmpresa: req.user.sub }, 
                        (err, controlStock) => {

                        if (err) return res.status(400).send({ message: 'Sucursal inexistente. Nombre incorrecto' });
                        if (parametros.stockSucursal > controlStock.stock) {
                            return res.status(500).send({ message: 'La cantidad sobrepasa el stock. Stock del Producto: ' + controlStock.stock });
                        }
                        Productos.findOneAndUpdate({ _id: controlStock._id, idEmpresa: req.user.sub }, { $inc: { stock: actualizarStock } }, { new: true }, 
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
                    });
                }
            })
        })
    } else {
        return res.status(500).send({ message: 'Complete todos los datos' });
    }
}


function ventaSucursal (req, res){

    var parametros = req.body;
    var idSuc = req.params.idSucursal;

    Sucursales.findOne({_id: idSuc, idEmpresa: req.user.sub},(err, sucursalEncontrada)=>{
        if(err||sucursalEncontrada == null) return res.status(400).send({mensaje: 'Sucursal inexistente'})

        if (parametros.cantidadVendida <= 0) return res.status(500).send({mensaje: 'la cantidad no puede ser menor a 0'})

        if (parametros.cantidadVendida && parametros.cantidadVendida != ""&&parametros.nombreProductoSucursal && parametros.nombreProductoSucursal != ""){

            ProductoSucursal.findOne({nombreProductoSucursal: parametros.nombreProductoSucursal, idSucursal: sucursalEncontrada._id},(err, productoEncontradoSucursal)=>{

                if(err||!productoEncontradoSucursal) return res.status(404).send({mensaje: 'El producto no existe en la sucursal'})

                if(parametros.cantidadVendida <= 0) return res.status(500).send({mensaje:'la cantidad no puede ser menor a 0'})
                if (productoEncontradoSucursal.stockSucursal == 0) return res.status(500).send({mensaje: 'Producto Agotado'})

                if(parametros.cantidadVendida > productoEncontradoSucursal.stockSucursal){
                    return res.status(500).send({mensaje:'Cantidad mayor al stock, el stock es: '+productoEncontradoSucursal.stockSucursal})
                }

                var restarStockSucursal = (parametros.cantidadVendida * -1)

                ProductoSucursal.findOneAndUpdate({_id: productoEncontradoSucursal._id}, {$inc: {StockSucursal: restarStockSucursal, cantidadVendida: parametros.cantidadVendida}},{new: true},(err, productoEditado)=>{
                    console.log(err)
                    if(err) return res.status(500).send({ message: "error en la peticion" })
                    if (!productoEditado) return res.status(404).send({mensaje: 'no se encuentran productos'})
                    return res.status(200).send({productosSucursal: productoEditado})
                })

            })
        }else{
            return res.status(500).send({mensaje: 'datos incorrectos'})
        }

    })
}



module.exports ={
    obtenerProductosSucursales,
    enviarProductoSucursales,
    ObtenerProductoSucursalNombre,
    ObtenerProductoSucursalStock,
    ObtenerProductoSucursalStockMenor,
    ventaSucursal
}