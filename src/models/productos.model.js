const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productosSchema = Schema ({
    nombreProducto: String,
    nombreProveedor: String,
    stock:Number,
    idEmpresa:{type:Schema.Types.ObjectId, ref:'usuarios'}

});

module.exports = mongoose.model('productos', productosSchema);