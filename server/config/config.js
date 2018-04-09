//===================
//  PUERTO
//================
process.env.PORT = process.env.PORT || 8080
    //===================
    //  desarrollo
    //================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//===================
//  desarrollo
//================
let urlDB
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb://DaGaMo:Hackerdavid123@ds241039.mlab.com:41039/cafe'
}
process.env.URLDB = urlDB