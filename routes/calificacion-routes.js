const express = require("express");
const { check } = require("express-validator");

const calificacionController = require("../controllers/calificacion-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post("/", calificacionController.altaCalificacion);
router.get(
  "/restaurant/:rid",
  calificacionController.obtenerCalificacionesRestaurant
);
router.get(
  "/promedio/:rid",
  calificacionController.ObtenerPromedioRestaurant
);

module.exports = router;
