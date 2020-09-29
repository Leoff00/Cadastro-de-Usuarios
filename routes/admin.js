const express = require('express');
const mongoose = require('mongoose');
const { eAdmin } = require('../helpers/passAdmin');
const router = express.Router();
require('../models/Categoria'); //importando o codigo da pasta model
const Categoria = mongoose.model('categorias');
require('../models/Postagem');
const Postagem = mongoose.model('postagens');
/*usando o model criado para dentro da pasta de rotas para o arquivo reconhecer
e fazer uso da tabela(model) */

//Todas as rotas do codigo...


router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('./admin/categorias', {
            categorias: categorias.map(Categoria => Categoria.toJSON())
        });
    }).catch((error) => {
        console.log('houve um erro ao listar as categorias ' + erro);
        res.redirect('/admin/home');
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

    if (!req.body.feedback || req.body.feedback == null || typeof req.body.nome == undefined) {
        erro.push({
            text: "Feedback invalido"
        });
    };


    if (!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined) {
        erro.push({
            text: "Nome invalido."
        });
    };

    if (!req.body.sobrenome || req.body.sobrenome == null || typeof req.body.sobrenome == undefined) {
        erro.push({
            text: "Sobrenome invalido."
        });
    };

    if (req.body.nome.length < 2) {
        erro.push({
            text: "Insira um nome maior."
        });
    };

    if (req.body.sobrenome.length < 2) {
        erro.push({
            text: "Insira um sobrenome maior."
        });
    };

    if (erro.length > 0) {
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


// rota de postagem

router.get('/postagens', eAdmin, (req, res) => {
    Postagem.find().lean().populate("categoria").sort({
        data: -1
    }).then((postagens) => {
        res.render("admin/postagens", {
            postagens: postagens
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    });
});


router.get('/postagens/add', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/addpostagens', {
            categorias: categorias
        });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar cadastro");
        res.redirect('/admin');
    });
});

router.post('/postagens/nova', (req, res) => {

    //validacao de cadastro

    var erro = [];

    if (!req.body.feedback || req.body.feedback == null || typeof req.body.nome == undefined) {
        erro.push({
            text: "Feedback invalido"
        });
    };

    if (req.body.categoria == '0') {
        erro.push({
            text: "Categoria invalida"
        })
    }


    if (erro.length > 0) {
        res.render('admin/addpostagens', {
            erro: erro
        });

    } else {
        const novaPostagem = {
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            feedback: req.body.feedback
        };

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Cadastro criado com sucesso");
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash("error_msg", "Nao foi possivel cadastrar pessoa" + err);
            res.redirect('/admin/postagens');
        });

    };

});


//editando postagens 

router.get('/postagens/edit/:id', (req, res) => {
    Postagem.findOne({
        _id: req.params.id
    }).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render('admin/editpostagens', {
                categorias: categorias,
                postagem: postagem
            })

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar categorias" + err);
            res.redirect('/admin/postagens');
        });

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar formulario de edicao");
        res.redirect('/admin/postagens');
    });

});


//aplicando edicao

router.post("/postagens/edit", (req,res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem)=> {
            
        postagem.nome = req.body.nome
        postagem.sobrenome = req.body.sobrenome 
        postagem.feedback = req.body.feedback 
      
        
        postagem.save().then(() => {
            req.flash('success_msg', 'Postagem editada com sucesso!');
            res.redirect('/admin/postagens');
           }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Houve um erro ao salvar edição' +err);
            res.redirect('/admin/postagens');


                }).catch((err) => {
                    console.log(err)
                    req.flash("error_msg","Houve um erro ao salvar edição")
                    res.redirect("/admin/postagens");
                });
      });
});

router.get('/postagens/deletar/:id', (req, res) => {
    Postagem.deleteOne({_id: req.params.id}).then( () => {
        req.flash("success_msg", "Postagem deletada com sucesso");
        res.redirect('/admin/postagens');
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar postagem" + err);
        res.redirect('/admin/postagens');
    });
})

module.exports = router;