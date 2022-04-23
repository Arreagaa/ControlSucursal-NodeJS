const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSucursalSchema = Schema ({

    nombreProductoSucursal: String,
    stockSucursal: Number,
    cantidadVendida: Number,
    idSucursal: { type: Schema.Types.ObjectId, ref: 'sucursales'},
    idEmpresa:{type:Schema.Types.ObjectId, ref:'usuarios'}
    
});

module.exports = mongoose.model('productoSucursal', productoSucursalSchema);