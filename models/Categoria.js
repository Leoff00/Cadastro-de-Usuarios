const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cad = new Schema({
    nome: {
        type: String,
        required: true,
    },
    sobrenome: {
        type: String,
        required: true,
    },

    feedback: {
        type: String,
        required: false
    },

    data: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

mongoose.model("categorias", Cad);