if(process.env.NODE_PRODUCTION == "production") {

    module.exports = {mongoURI: "mongodb+srv://Leonardoferreira:sk8forever@cad1.xztca.mongodb.net/Cad1?retryWrites=true&w=majority"}

} else {
    module.exports = {mongoURI: "mongodb://localhost/blogApp"}
}