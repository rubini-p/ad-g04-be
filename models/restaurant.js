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
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }},
  open: { type: {
  monday: {type: Number},
  tuesday:  {type: Number},
  wednesday:  {type: Number},
  thursday:  {type: Number},
  friday:  {type: Number},
  saturday:  {type: Number},
  sunday:  {type: Number}
  } },
  close: { type: {
    monday: {type: Number},
    tuesday:  {type: Number},
    wednesday:  {type: Number},
    thursday:  {type: Number},
    friday:  {type: Number},
    saturday:  {type: Number},
    sunday:  {type: Number}
    } },
  temporarilyClosed: { type: Boolean , default: false}, // default value false
  coverImage: { type: String },
  image: {type: [ String ]},
  kindOfFood: { type: [ String ] },
  description: {type : String},
  priceRange: { type: Number },
  owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
  },
  {
    versionKey: false,
  });

RestaurantSchema.index({location: '2dsphere'})

module.exports = Item = mongoose.model('Restaurant', RestaurantSchema);
