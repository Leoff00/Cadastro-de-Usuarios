const express = require('express');
const handlebars = require('express-handlebars');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Categoria');
const Categoria = mongoose.model('categorias');
require('./models/Postagem');
const Postagem = mongoose.model('postagens');
const usuario = require('./routes/usuario');
const passport = require('passport')
require('./config/auth')(passport)
const db = require('./config/db')
const {eAdmin} = require('./helpers/passAdmin')
//configurando express session 

app.use(session({
    secret: "keyword",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//configurando flash...

app.use(flash());

//Middlewares

app.use((req, res, next) => {
    res.locals.sucess_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next();
})

//usando config do mongoose para redes diferentes


mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
//conectando ao mongoose
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI).then(() => {
    console.log('Conectado ao banco de dados com sucesso!!!');
}).catch((err) => {
    console.log('Nao foi possivel se conectar ao banco de dados' + err);
})

//configurando body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

//configurando handlebars 
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//public...
app.use(express.static(path.join(__dirname, 'public')))


//conteudo...


// rotas
app.get('/', (req, res) => {
    Categoria.find().populate("postagens").sort({
        data: -1
    }).lean().then((postagens) => {
        res.render("usuario/index", {
            postagens: postagens
        });
    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao lista na pag. inicial" + err)
        res.redirect("/404")
    })
});


app.get('/cadastro', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('usuario/cadastro', {
            categorias: categorias.map(Categoria => Categoria.toJSON())
        });
    }).catch((error) => {
        console.log('houve um erro ao carregar a aba de cadastro' + error);
        res.redirect('/');
    });
});

app.use('/admin', admin);
app.use('/usuario', usuario);

//outros...
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:3333/`);
});