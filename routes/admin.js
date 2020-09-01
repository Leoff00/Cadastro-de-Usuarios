const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
require('../models/Categoria'); //importando o codigo da pasta model
const Categoria = mongoose.model('categorias');
/*usando o model criado para dentro da pasta de rotas para o arquivo reconhecer
e fazer uso da tabela(model) */

//Todas as rotas do codigo...

router.get('/home', (req, res) => {
    res.render('admin/home');
});

router.get('/categorias', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('./admin/categorias', {
            categorias: categorias.map(Categoria => Categoria.toJSON())
        })
    }).catch((error) => {
        console.log('houve um erro ao listar as categorias ' + erro);
        res.redirect('/admin');
    });
});

router.get('/categorias/add', (req, res) => {
    res.render('admin/add');
    
});


router.get('/categorias/edit/:id', (req, res) => {
    //pegando o cadastro
    Categoria.findOne({
        _id: req.params.id
    }).lean().then((categoria) => {
        res.render('admin/editcategorias', {
            categoria: categoria
        });
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria nao existe");
        res.redirect('/admin/categorias');
    });
});

router.post('/categorias/edit', (req, res) => {
    //aplicando o cadastro, validando a edicao

    let erro = [];

    if (!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined) {
        erro.push({
            text: "Nome invalido."
        });
    }

    if (!req.body.sobrenome || req.body.sobrenome == null || typeof req.body.sobrenome == undefined) {
        erro.push({
            text: "Sobrenome invalido."
        });
    }

    if (req.body.nome.length < 2) {
        erro.push({
            text: "Insira um nome maior."
        });
    }

    if (req.body.sobrenome.length < 2) {
        erro.push({
            text: "Insira um sobrenome maior."
        });
    }

    if (erro.length) {
        res.render("admin/add", {
            erros: erro
        });
    } else {

        Categoria.findOne({
            _id: req.body.id
        }).then((categoria) => {
            categoria.nome = req.body.nome;
            categoria.sobrenome = req.body.sobrenome;
            categoria.feedback = req.body.feedback;

            categoria.save().then(() => {
                req.flash("success_msg", "Edição salva com sucesso");
                res.redirect('/admin/categorias');
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao editar cadastro");
                res.redirect('/admin/categorias');
            });
        });
    }
});

//deletar
router.post('/categorias/del', (req, res) => {
    Categoria.deleteOne({
        _id: req.body.id
    }).lean().then(() => {
        req.flash("success_msg", "Cadastro deletado com sucesso.");
        res.redirect('/admin/categorias');
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar cadastro");
        res.redirect('/admin/categorias');
    });
});


router.post('/categorias/new', (req, res) => {

    //validacao de formulario

    let erro = [];

    if(!req.body.feedback) { 
        req.flash("error_msg", "Por favor, preencha e me envie o feedback");
    }

    if (!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined) {
        erro.push({
            text: "Nome invalido."
        });
    }

    if (!req.body.sobrenome || req.body.sobrenome == null || typeof req.body.sobrenome == undefined) {
        erro.push({
            text: "Sobrenome invalido."
        });
    }

    if (req.body.nome.length < 2) {
        erro.push({
            text: "Insira um nome maior."
        });
    }

    if (req.body.sobrenome.length < 2) {
        erro.push({
            text: "Insira um sobrenome maior."
        });
    }

    if (erro.length) {
        res.render("admin/add", {
            erros: erro
        });
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            feedback: req.body.feedback
        };
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Cadastro salvo com sucesso")
            console.log('Cadastro salvo com sucesso');
            res.redirect("/admin/categorias");

        }).catch((err) => {
            req.flash("error_msg", "Erro ao criar cadastro");
            console.log('Nao foi possivel salvar cadastro' + err);

        });
    }

});


module.exports = router;