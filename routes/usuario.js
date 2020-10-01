const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../models/usuario');
require('../models/Postagem')
require('../models/posts')
require('../models/Categoria')
const Categoria = mongoose.model('categorias') //reaproveitando a model categoria
const Usuario = mongoose.model('usuarios');

//user rotes

router.get('/', (req, res) => {
    Categoria.find()
        .then((categoria) => {
            res.render("./usuario/index", {
                categoria: categoria.map(categoria => categoria.toJSON())
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as postagens" + err)
            res.redirect("/")
        });
});


router.get('/cadastro', (req, res) => {
    res.render('usuario/cadastro');
});

router.post('/cadastro', (req, res) => {

    //validação do cadastro do usuario

    let erro = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erro.push({
            text: "Nome invalido!"
        });
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erro.push({
            text: "Senha invalida!"
        });
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erro.push({
            text: "E-mail invalido!"
        });
    }

    if (req.body.senha.length < 4) {
        erro.push({
            text: "Digite uma senha maior!"
        });
    }

    if (req.body.senha.length > 16) {
        erro.push({
            text: "Digite uma senha menor!"
        });
    }

    if (req.body.senha != req.body.senha2) {
        erro.push({
            text: "Senhas nao coincidem!"
        });
    }


    if (erro.length > 0) {
        res.render('usuario/cadastro', {
            erro: erro
        });

    } else {
        Usuario.findOne({
            email: req.body.email
        }).lean().then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Este e-mail já esta sendo utilizado por outro usuario");
                res.redirect('/usuario/cadastro');
            } else {
                const newUser = new Usuario({
                    nome: req.body.nome,
                    senha: req.body.senha,
                    email: req.body.email,
                    // eAdmin: 1 caso queira criar uma conta Admin
                })

                //gerando um hash de encriptação da ==> senha <==

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUser.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro ao cadastrar usuario");
                            res.redirect('/');
                        }
                        newUser.senha = hash

                        newUser.save().then(() => {
                            req.flash("success_msg", "Usuario cadastrado com sucesso");
                            res.redirect('/');
                        }).catch((err) => {
                            req.flash("error_msg", "Não foi possivel cadastrar usuario");
                            res.redirect('/usuario/cadastro');
                        })

                    })
                })

            }
        }).catch((err) => {
            req.flash("error_msg", "Erro interno" + err);
            res.redirect('/cadastro');
        });
    }
});

router.get('/login', (req, res) => {
    res.render("usuario/login");
})

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true,

    })(req, res, next)
})


router.get('/logout', (req, res) => {
    req.logOut()
    req.flash("success_msg", "Deslogado com sucesso")
    res.redirect('/')
})

router.get('/postar', (req, res) => {
    res.render('usuario/postar')
})

router.post('/postar', (req, res) => {

    let erro = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erro.push({
            text: "Nome inválido!"
        });
    }


    if (!req.body.nome || typeof req.body.sobrenome == undefined || req.body.sobrenome == null) {
        erro.push({
            text: "Sobrenome inválido!"
        });
    }


    if (!req.body.feedback || typeof req.body.feedback == undefined || req.body.nome == null) {
        erro.push({
            text: "Por favor, preencha o feedback corretamente!"
        });
    }


    if (erro.length > 0) {
        res.render('usuario/postar', {
            erro: erro
        });

    } else {
        const novoPost = {
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            feedback: req.body.feedback
        };

        new Categoria(novoPost).save().then(() => {
            req.flash("success_msg", "Postagem registrada com sucesso! :)");
            res.redirect('/');
        }).catch((err) => {
            req.flash("error_msg", "Nao foi possivel registrar postagem :(" + err);
            res.redirect('/usuario/postar');
        });

    };
})




module.exports = router;