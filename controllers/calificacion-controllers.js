const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Calificacion = require("../models/calificacion");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const calificacion = require("../models/calificacion");

const altaCalificacion = async (req, res, next) => {
  console.log(req);
  let { restaurant_id, usuario_id, puntuacion, comentario, fecha } = req.body;
  if (validarFormulario) {
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
      restaurant: restaurant_id,
      usuario: usuario_id,
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
    res.status(201).json(calificacion);
  } else {
  }
};

const validarFormulario = (params) => {
  return true;
};

//const ObtenerPromedioRestaurant
//const ObtenerPromedioPorRestaurant

const obtenerCalificacionesRestaurant = async (req, res, next) => {
  let { restaurant } = req.params;

  let listByRestaurant;
  try {
    listByRestaurant = await calificacion.findOne({
      restaurant_id: restaurant,
    });
    console.log(listByRestaurant);
  } catch (err) {
    const error = new HttpError(
      "No se encontraron calificaciones para el restaurante indicado",
      500
    );
    return next(error);
  }
  res.status(201).json(listByRestaurant);
};

exports.altaCalificacion = altaCalificacion;
exports.obtenerCalificacionesRestaurant = obtenerCalificacionesRestaurant;
//exports.ObtenerPromedioRestaurant = ObtenerPromedioRestaurant;
//exports.ObtenerPromedioPorRestaurant = ObtenerPromedioPorRestaurant;
