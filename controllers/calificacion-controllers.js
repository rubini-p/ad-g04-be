const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const Calificacion = require('../models/calificacion');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');

const AltaCalificacion = async (req, res, next) => {
let {restaurant_id, usuario_id, puntuacion, comentario, fecha} = req.body;
  //validar formulario
if(ValidarFormulario){
//buscar el objeto usuario/restaurant con el id obtenido si existe, guardarlo en una var y si no existe, devolver error
let usuario;
try {
  usuario = await User.findById(usuario_id);
} catch (err) {
  const error = new HttpError(
    'No se puede encontrar un usuario con el id indicado',
    500
  );
  return next(error);
}

let restaurant;
try {
  restaurant = await Restaurant.findById(restaurant_id);
} catch (err) {
  const error = new HttpError(
    'No se puede encontrar un restaurant con el id indicado',
    500
  );
  return next(error);
}


let calificacion = { 
  restaurant: restaurant, 
  usuario: usuario, 
  puntuacion: puntuacion, 
  comentario: comentario, 
  fecha: fecha
}

}
else{
  //devolver error
}
//armar el objeto a guardar (formatearlo)
//guardarlo
};


const ValidarFormulario = (params) => {
  //hacer después

return true;

};
//const ObtenerPromedioRestaurant
//const ObtenerPromedioPorRestaurant
//const ObtenerCalificacionesRestaurant

