// const express = require('express');
// const mongoose = require('mongoose');
// const config = require('config');
// const app = express();
// const db = config.get('mongoURI');const express = require('express');
// const mongoose = require('mongoose');
// const config = require('config');
// const app = express();
// const db = config.get('mongoURI');



// const Receta = require('./models/Receta');

// como guardar votos
// votes collection
//
// {
//     userId: "123",
//         objectId: "abc",
//     rating: 5
// }
//
// const port = 5001;
// app.listen(port, () => console.log(`Server started on port: http://localhost:${port}`));
// app.use(express.json());
//
// app.get('/recetas/list', (req, res) => {
//     Receta.find()
//         .sort({ date: -1 })
//         .then(items => console.log(res.json(items)));
// });
//
// app.post('/recetas/receta/nuevareceta', (req, res) => {
//     const newReceta = new Receta({
//         nombre_receta: req.body.nombre_receta,
//         ingredientes_ppal: req.body.ingredientes_ppal,
//         ingredientes: req.body.ingredientes,
//         categoria: req.body.categoria,
//         dificultad: req.body.dificultad,
//         status: req.body.status,
//         Proceso: req.body.Proceso,
//         Intro: req.body.Intro,
//         rating: req.body.rating,
//         avatarUrl: req.body.avatarUrl,
//         coverUrl: req.body.coverUrl,
//         })
//         newReceta
//         .save()
//     .then(() => res.json({ success: true }))
//     .catch(err => res.status(404).json({ success: false }));
// });
//
//
// app.post('/recetas/receta/nuevareceta', function (req, res) {
//     if(!req.body.nombre || !req.body.apellido) {
//         respuesta = {
//             error: true,
//             codigo: 502,
//             mensaje: 'El campo nombre y apellido son requeridos'
//         };
//     } else {
//         if(usuario.nombre !== '' || usuario.apellido !== '') {
//             respuesta = {
//                 error: true,
//                 codigo: 503,
//                 mensaje: 'El usuario ya fue creado previamente'
//             };
//         } else {
//             usuario = {
//                 nombre: req.body.nombre,
//                 apellido: req.body.apellido
//             };
//             respuesta = {
//                 error: false,
//                 codigo: 200,
//                 mensaje: 'Usuario creado',
//                 respuesta: usuario
//             };
//         }
//     }
//     res.send(respuesta);
// });
// // console.log('pepe2')
// // Receta.findOneAndUpdate({ _id: req.params.id }, req.body)
//
// // Get one recipe
// app.get('/recetas/receta/:id', (req, res) => {
//     Receta.findOne()
//         .then(items => console.log(res.json(items)));
// });
//
// // Update an entry
// app.put('/recetas/receta/:id', (req, res) => {
//     Receta.findOneAndUpdate({ _id: req.params.id }, req.body)
//         .then(() => res.json({ success: true }))
//         .catch(err => res.status(404).json({ success: false }));
// });
//
// // Delete an entry
// app.delete('/recetas/receta/borrar/:id', (req, res) => {
//     Receta.findOneAndDelete({ _id: req.params.id })
//         .then(() => res.json({ success: true }))
//         .catch(err => res.status(404).json({ success: false }));
// });

// #############################################    NEW SERVER.JS    #############################################

const config = require('config');
const db = config.get('mongoURI');

const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recetasRoutes = require('./routes/recetas-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

// app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/recetas', recetasRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

// mongoose
//     .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
//     .then(() => {console.log('connected to db')})
//     .catch((error) => {console.log(error)
//     })

mongoose
    .connect(db , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.listen(5001);
    })
    .catch(err => {
        console.log(err);
    });


