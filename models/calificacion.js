// WIP, Armar modelo de calificaciones
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calificacionSchema = new Schema(
  {
    restaurant_id: {
      type: Number,
      required: true,
    },
    usuario_id: {
      type: Number,
      required: true,
    },
    puntuacion: {
      type: Number,
      required: true,
    },
    comentario: {
      type: String,
      required: true,
      maxlength: 400,
    },
    fecha: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = Item = mongoose.model("Calificacion", calificacionSchema);
