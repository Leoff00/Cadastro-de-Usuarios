const express = require('express');
const handlebars = require('express-handlebars');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3333;
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

//configurando express session 

app.use(session({
    secret: "keyword",
    resave: true,
    saveUninitialized: true
}));

//configurando flash...

app.use(flash());

//Middlewares

app.use((req, res, next) => {
    res.locals.sucess_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
})

//usando config do mongoose para redes diferentes
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
//conectando ao mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogApp').then(() => {
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
app.use('/admin', admin);

//outros...
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:3333`);
});