const config = require('config');
const db = config.get('mongoURI');

const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users-routes');
const menuRoutes = require('./routes/menu-routes');
const foodRoutes = require('./routes/food-routes');
const calificacionRoutes = require('./routes/calificacion-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/users', usersRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/calificacion', calificacionRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

mongoose
    .connect(db , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.listen(5001);
    })
    .catch(err => {
        console.log(err);
    });


