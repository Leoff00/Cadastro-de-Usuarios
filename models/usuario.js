const mongoose = require('mongoose');

const schema = mongoose.Schema

const usuario = new schema({
    nome: {
        type: String,
        required: true
    },

    senha: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    eAdmin: { 
        type: Number,
        default: 0
    }
});

mongoose.model('usuarios', usuario);