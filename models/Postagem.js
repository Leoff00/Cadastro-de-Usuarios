const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema({
    nome: {
        type: String,
        required: true
    },

    sobrenome: {
        type: String,
        required: true
    },

    feedback: { 
        type: String,
        required: false,

    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: false
    },

    data: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model("postagens", Postagem);