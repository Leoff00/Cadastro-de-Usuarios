module.exports = {
    eAdmin(req, res, next) {
        if(req.isAuthenticated() && req.user.eAdmin == 1) {
            return next()
        } 
        req.flash("error_msg", "Somente administradores podem entrar aqui")
        res.redirect("/")


    }
}

//controlador de acesso