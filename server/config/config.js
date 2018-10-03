//============================================
//PORT
// la variable process.env.PORT ya existe en heroku
//============================================
process.env.PORT = process.env.PORT || 3000;

//============================================
//Entorno
// la variable process.env.URBDB   toca setearla desde consola heroku config:set URBDB="mongodb://cafe-user:abc123@ds121593.mlab.com:21593/cafe"
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

//============================================
//Vencimiento del token
//============================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
// la variable process.env.CADUCIDAD_TOKEN   toca setearla desde consola heroku config:set CADUCIDAD_TOKEN="60 * 60 * 24 * 30"
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//============================================
//SEED de autenticacion
// la variable process.env.SEED   toca setearla desde consola heroku config:set SEED="este-es-el-seed-produccion"
//============================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';