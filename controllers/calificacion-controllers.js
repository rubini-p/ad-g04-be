const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Calificacion = require("../models/calificacion");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");

const AltaCalificacion = async (req, res, next) => {
  let { restaurant_id, usuario_id, puntuacion, comentario, fecha } = req.body;
  //validar formulario

  if (ValidarFormulario) {
    //buscar el objeto usuario/restaurant con el id obtenido si existe, guardarlo en una var y si no existe, devolver error
    let usuario;
    try {
      usuario = await User.findById(usuario_id);
    } catch (err) {
      const error = new HttpError(
        "No se puede encontrar un usuario con el id indicado",
        500
      );
      return next(error);
    }

    let restaurant;
    try {
      restaurant = await Restaurant.findById(restaurant_id);
    } catch (err) {
      const error = new HttpError(
        "No se puede encontrar un restaurant con el id indicado",
        500
      );
      return next(error);
    }

    let calificacion = new Calificacion({
      restaurant: restaurant,
      usuario: usuario,
      puntuacion: puntuacion,
      comentario: comentario,
      fecha: fecha,
    });

    try {
      await calificacion.save();
    } catch (err) {
      const error = new HttpError(
        "No se pudo crear la calificación, por favor probar nuevamente.",
        500
      );
      return next(error);
    }
    res
    .status(201)
    .json(calificacion);
  } else {
    //devolver error

  }
 };

const ValidarFormulario = (params) => {
  //hacer después
  return true;
};

//const ObtenerPromedioRestaurant
//const ObtenerPromedioPorRestaurant
//const ObtenerCalificacionesRestaurant


exports.AltaCalificacion = AltaCalificacion;
//exports.ObtenerPromedioRestaurant = ObtenerPromedioRestaurant;
//exports.ObtenerPromedioPorRestaurant = ObtenerPromedioPorRestaurant;
//exports.ObtenerCalificacionesRestaurant = ObtenerCalificacionesRestaurant;

