const HttpError = require("../models/http-error");
const Calificacion = require("../models/calificacion");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");
// const calificacion = require("../models/calificacion");

const altaCalificacion = async (req, res, next) => {
  console.log('creando calificacion...', req.body);
  let { restaurant_id, username, stars, comment, date } = req.body;
  if (validarFormulario) {
    let usuario;
    // try {
    //   usuario = await User.findById(usuario_id);
    // } catch (err) {
    //   const error = new HttpError(
    //     "No se puede encontrar un usuario con el id indicado",
    //     500
    //   );
    //   return next(error);
    // }

    let restaurant;
    try {
      restaurant = await Restaurant.findById(restaurant_id);
      console.log("este es el resto que encontre: ", restaurant._id);
    } catch (err) {
      const error = new HttpError(
        "No se puede encontrar un restaurant con el id indicado",
        500
      );
      return next(error);
    }

    let calificacion = new Calificacion({
      restaurant_id,
      username,
      stars,
      comment,
      date
    });
    // console.log("esta es la calificacion creada: ", calificacion)

    // #### obtener promedio

    // avg = await Calificacion.find({restaurant_id: req.body.restaurant_id})
    // console.log('rid: ',req.body.restaurant_id )

    let resto = await Restaurant.findById(req.body.restaurant_id);
    const avg = await Calificacion.aggregate(
      [
        { $match : { restaurant_id: resto._id } },
        {$group:{_id: "$restaurant_id",
            avg: { $avg: "$stars" }
          }
        }
      ]
    )

    resto.grade = Math.round(avg[0].avg * 10) / 10

    // console.log('avg ', avg[0].avg);

    // ####

    try {

      await calificacion.save();
      await resto.save()
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

const ObtenerPromedioRestaurant = async (req, res, next) => {
  let { restaurant } = req.params;
  let listOfCalifications = obtenerCalificacionesByID(restaurant);
  if (listOfCalifications) {
    let promedio = CalcularPromedio(listOfCalifications);
    res.status(201).json({ promedio: promedio });
  } else {
    const error = new HttpError(
      "No se pudo encontrar calificaciones para el restaurant indicado",
      500
    );
    return next(error);
  }
};

const ObtenerPromedioPorRestaurant = async (req, res, next) => {
  let { restaurant } = req.params;
  let listOfCalifications = obtenerCalificacionesByID(restaurant);

  res.status(201).json(listOfCalifications);
};

const obtenerCalificacionesRestaurant = async (req, res, next) => {
  let listByRestaurant;

  try {
    listByRestaurant = await Calificacion.find({ restaurant_id: req.params.rid } );
    // console.log(listByRestaurant);
  } catch (err) {
    const error = new HttpError(
      "No se encontraron calificaciones para el restaurante indicado",
      500
    );
    return next(error);
  }
  res.status(201).json(listByRestaurant);
};

const obtenerCalificacionesByID = async (restaurant_id) => {
  let listOfCalifications;
  try {
    listOfCalifications = await calificacion.findOne({
      restaurant_id: restaurant_id,
    });
    // console.log(listOfCalifications);
  } catch (err) {
    const error = new HttpError(
      "No se encontraron calificaciones para el restaurante indicado",
      500
    );
    return null;
  }
  return listOfCalifications;
};

function CalcularPromedio(listOfCalifications) {
  let total = 0;
  let cantidad = 0;
  for (const calificacion of listOfCalifications) {
    total += calificacion.puntuacion;
    cantidad++;
  }
  return total / cantidad;
}

exports.altaCalificacion = altaCalificacion;
exports.obtenerCalificacionesRestaurant = obtenerCalificacionesRestaurant;
exports.ObtenerPromedioRestaurant = ObtenerPromedioRestaurant;
//exports.ObtenerPromedioPorRestaurant = ObtenerPromedioPorRestaurant;
