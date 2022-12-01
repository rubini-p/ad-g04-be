// WIP Armar modelo restaurnt
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RestaurantSchema = new Schema({
  name: {
    type: String,
  },
  address: { type: {
    street: {type: String},
    number: {type: Number},
    neighborhood: {type: String},
    state: {type: String},
    country: {type: String}
  } },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }},
  openTime: { type: {
    monday: {type: Date},
    tuesday:  {type: Date},
    wednesday:  {type: Date},
    thursday:  {type: Date},
    friday:  {type: Date},
    saturday:  {type: Date},
    sunday:  {type: Date}
  } },
  closeTime: { type: {
    monday: {type: Date},
    tuesday:  {type: Date},
    wednesday:  {type: Date},
    thursday:  {type: Date},
    friday:  {type: Date},
    saturday:  {type: Date},
    sunday:  {type: Date}
    } },
  temporarilyClosed: { type: Boolean , default: false}, // default value false
  coverImage: { type: String },
  photos: { type: [{ picture: {type: String} ,portrait: {type: Boolean}}],
  },
  kindOfFood: { type:  String  },
  priceRange: { type: Number },
  grade: { type: Number },
  owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  menu: { type: mongoose.Types.ObjectId, required: false, ref: 'Menu' }
  },
  {
    versionKey: false,
  });

RestaurantSchema.index({location: '2dsphere'})

module.exports = Item = mongoose.model('Restaurant', RestaurantSchema);
