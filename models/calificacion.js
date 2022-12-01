// WIP, Armar modelo de calificaciones
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calificacionSchema = new Schema(
  {
    restaurant_id: {
      type:  mongoose.Types.ObjectId, required: true, ref: 'Restaurant',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 400,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = Item = mongoose.model("Calificacion", calificacionSchema);
