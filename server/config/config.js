//============================================
//PORT
//============================================

process.env.PORT = process.env.PORT || 3000;

//============================================
//Entorno
//============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
    //urlDB = 'mongodb://cafe-user:abc123@ds121593.mlab.com:21593/cafe';
}
process.env.URBDB = urlDB;