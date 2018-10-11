const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
// middleware: todos los archivos que lleguen pasan primer por 'req.files'
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: 'No se ha seleccionado ningun archivo.'
        });
    }

    // validamos tipo   usuarios o productos
    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son: ${tiposValidos.join(', ')}`
            }
        });
    }

    // archivo es el nombre del parametro que toca colocar el que consume el servicio
    let archivo = req.files.archivo;

    //extensiones permitidas
    let archivoCortado = archivo.name.split('.');
    let extension = archivoCortado[archivoCortado.length - 1];
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son: ${extensionesValidas.join(', ')}`,
                ext: extension
            }
        });
    }

    // cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //Aqui imagen ya cargada en la carpeta
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo, tipo);
        } else {
            imagenProducto(id, res, nombreArchivo, tipo);
        }
        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente...'
        // });
    });
});

function imagenUsuario(id, res, nombreArchivo, tipo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(tipo, nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(tipo, nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe.'
                }
            });
        }


        borraArchivo(tipo, usuarioDB.img);

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });

}

function imagenProducto(id, res, nombreArchivo, tipo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(tipo, nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(tipo, nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe.'
                }
            });
        }


        borraArchivo(tipo, productoDB.img);

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(tipo, nombreImagen) {
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;