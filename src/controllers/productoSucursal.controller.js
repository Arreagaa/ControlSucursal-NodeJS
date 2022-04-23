const ProductoSucursal = require('../models/pruductoSucursal.model');
const Sucursales = require('../models/sucursales.model');
const Productos = require('../models/productos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


function obtenerProductosSucursales(req, res){
    var nombreSuc = req.params.nombreSucursal;

        Sucursales.findOne({nombreSucursal: {$regex:nombreSuc,$options:'i'}},(err, sucursalEncontrado)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!sucursalEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran sucursales con ese nombre"});

            ProductoSucursal.find({_idSucursal: sucursalEncontrado._id}, (err, sucursalProductos)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
                if(!sucursalProductos) return res.status(404).send({mensaje : "Error, no se encuentran productos en dicha sucursal"});

                return res.status(200).send({productosSucursal : sucursalProductos});
            }).populate('_id')
        })

}


/*function enviarProductoSucursales(req, res) {
    var parametros = req.body;

    if (parametros.nombreProductoSucursal && parametros.stockSucursal && parametros.nombreSucursal) {

        Sucursales.findOne({ nombreSucursal: parametros.nombreSucursal, idEmpresa: req.user.sub }, 
            (err, sucursalEncontrada) => {

            if (err) return res.status(400).send({ message: 'Sucursal inexistente' });
            if (!sucursalEncontrada) return res.status(400).send({ message: 'Sucursal inexistente en la empresa' })

            ProductoSucursal.findOne({ nombreProductoSucursal: parametros.nombreProductoSucursal, idSucursal: sucursalEncontrada._id }, 
                (err, productoEncontradoSucursal) => {

                    var actualizarStock = (parametros.stockSucursal * -1)

                if (err) return res.status(404).send({ message: 'Datos incorrectos' })
                if (productoEncontradoSucursal == null) {

                    Productos.findOne({ nombreProducto: parametros.nombreProductoSucursal, idEmpresa: req.user.sub }, 
                        (err, productoEmpresaStock) => {

                        if (err) return res.status(400).send({ message: 'Sucursal inexistente. Nombre incorrecto' });                     
                        if (parametros.stockSucursal > productoEmpresaStock.stock) {
                            return res.status(500).send({ message: 'La cantidad sobrepasa el stock. Stock del Producto: ' + productoEmpresaStock.stock });}

                        Productos.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { stock: actualizarStock } }, { new: true }, 
                            (err, productoEmpresaEditado) => {
                            if (err) return res.status(500).send({ message: 'No se puede editar el producto de empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'No existen productos a editar en la empresa' });

                            ProductoSucursal.save(
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
}*/

function enviarProductoSucursales(req, res) {
    var parametros = req.body;
   
    if (parametros.nombreProductoSucursal && parametros.stockSucursal && parametros.nombreSucursal) {
        Sucursales.findOne({ nombreSucursal: parametros.nombreSucursal, idEmpresa: req.user.sub }, (err, sucursalEncontrada) => {
            if (err) return res.status(400).send({ message: 'Error. Esta Sucursal no existe. Verifique el nombre' });
            if (!sucursalEncontrada) return res.status(400).send({ message: 'Esta Sucursal no existe en la empresa. Verifique el nombre' })
            //VERIFICA SI EL PRODUCTO EXISTE EN LA SUCURSAL INDICADA
            ProductoSucursal.findOne({ nombreProductoSucursal: parametros.nombreProductoSucursal, idSucursal: sucursalEncontrada._id }, (err, productoEncontradoSucursal) => {
                if (err) return res.status(404).send({ message: 'Error.Verifique los datos' })
                if (productoEncontradoSucursal == null) {//EL PRODUCTO NO EXISTE EN SUCURSALES Y SE AGREGA NORMAL
                    //VERIFICAR STOCK 
                    Productos.findOne({ nombreProducto: parametros.nombreProductoSucursal, idEmpresa: req.user.sub }, (err, productoEmpresaStock) => {
                        if (err) return res.status(400).send({ message: 'Error. Esta Sucursal no existe. Verifique el nombre' });
                       
                        if (parametros.stockSucursal > productoEmpresaStock.stock) {//VERIFICAR STOCK
                            return res.status(500).send({ message: 'La cantidad del producto es es mayor al stock. El Stock actual del producto es: ' + productoEmpresaStock.Stock });
                        }
                        var ProductosSucursalModelo = new ProductoSucursal();
                        ProductosSucursalModelo.nombreProductoSucursal = parametros.nombreProductoSucursal;
                        ProductosSucursalModelo.stockSucursal = parametros.stockSucursal;
                        ProductosSucursalModelo.idSucursal = sucursalEncontrada._id;
                        ProductosSucursalModelo.idEmpresa = req.user.sub;
                        //REALIZA EL DESCUENTO EN EL STOCK DE EMPRESA
                        var restarStock = (parametros.stockSucursal * -1)
                        Productos.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { Stock: restarStock } }, { new: true }, (err, productoEmpresaEditado) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion de editar producto empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'No se encontraron productos para editar en Empresa' });
                            //GUARDA EL NUEVO PRODUCTO DE LA SUCURSAL
                            ProductosSucursalModelo.save((err, ProductoGuardado) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!ProductoGuardado) return res.status(404).send({ message: 'No se encontraron productos para almacenar' });
                                return res.status(200).send({ ProductosSucursal: ProductoGuardado });
                            });
                        })

                    })
                } else {//EDITA EL PRODUCTO
                    //RESTAR STOCK DE EMPRESA
                    var restarStock = (parametros.stockSucursal * -1)
                    //VERIFICAR STOCK 
                    Productos.findOne({ NombreProducto: parametros.NombreProductoSucursal, idEmpresa: req.user.sub }, (err, productoEmpresaStock) => {
                        if (err) return res.status(400).send({ message: 'Error. Esta Sucursal no existe. Verifique el nombre' });
                       
                        if (parametros.stockSucursal > productoEmpresaStock.Stock) {//VERIFICAR STOCK
                            return res.status(500).send({ message: 'La cantidad del producto es es mayor al stock. El Stock actual del producto es: ' + productoEmpresaStock.stock });
                        }
                        Productos.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { stock: restarStock } }, { new: true }, (err, productoEmpresaEditado) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion de editar producto empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'Error. No se encontraron productos para editar en Empresa' });

                            //EDITAR STOCK DE RODUCTO SUCURSAL
                            ProductoSucursal.findOneAndUpdate({ _id: productoEncontradoSucursal._id }, { $inc: { stockSucursal: parametros.stockSucursal } }, { new: true }, (err, productoSucursalEditado) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion de editar producto empresa' });
                                if (!productoSucursalEditado) return res.status(404).send({ message: 'No se encontraron productos para editar en sucursal' });
                                return res.status(200).send({ ProductosSucursal: productoSucursalEditado });

                            });
                        })
                    });

                }
            })
        })
    } else {
        return res.status(500).send({ message: 'Ingrese todos los datos necesarios' });
    }
}

module.exports ={
    obtenerProductosSucursales,
    enviarProductoSucursales
}