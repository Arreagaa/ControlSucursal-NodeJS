const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EncuestaSchema = Schema({
    descripcion: String,
    categoria: String,
    respuestas: [{
        textoRespuesta: String,
        idUsuarioRespuesta: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
    }],
    idCreadorEncuesta: { type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

module.exports = mongoose.model('Encuestas', EncuestaSchema);