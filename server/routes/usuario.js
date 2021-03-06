const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const _ = require('underscore')

const Usuario = require('../models/usuario')

const app = express()

app.get('/', (req, res) => {
    res.send('Hola Mundo')
})
app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)
    Usuario.find({ estado: true /*--conditions*/ }, 'nombre email role estado google img' /*CAMPOS QUE DESEO MOSTRAR*/ )
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true /*--conditions*/ }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })
})
app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null
        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });

})
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre',
        'email',
        'img',
        'role',
        'estado'
    ])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})
app.delete('/deleteUsuario/:id', function(req, res) {
    let id = req.params.id
    let updateEstado = {
            estado: false
        }
        /* {New: true} - REGRESA LOS DATOS ACTUALIZADOS*/
    Usuario.findByIdAndUpdate(id, updateEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

module.exports = app