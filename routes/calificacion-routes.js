const express = require('express');
const { check } = require('express-validator');

const calificacionController = require('../controllers/calificacion-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.post('/altaCalificacion', calificacionController.AltaCalificacion);

module.exports = router;
