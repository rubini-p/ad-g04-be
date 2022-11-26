require('dotenv').config()

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
const restaurantsRoutes = require('./routes/restaurant-routes');
const HttpError = require('./models/http-error');

const key = fs.readFileSync('./cert/privkey.pem');
const cert = fs.readFileSync('./cert/fullchain.pem');
const https = require('https');

const app = express();

const server = https.createServer({key: key, cert: cert }, app);

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

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
app.use('/api/restaurants', restaurantsRoutes);


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

mongoose
    .connect(db , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        server.listen(5001);
    })
    .catch(err => {
        console.log(err);
    });


