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
  openTime: { type: {
    monday: {type: Number},
    tuesday:  {type: Number},
    wednesday:  {type: Number},
    thursday:  {type: Number},
    friday:  {type: Number},
    saturday:  {type: Number},
    sunday:  {type: Number}
  } },
  closeTime: { type: {
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

  photos: { type: [{ picture: {type: String} ,portrait: {type: Boolean}}],

    default: [

      {picture: 'https://media-cdn.tripadvisor.com/media/photo-s/16/7c/25/ed/vista-interior.jpg', portrait: true},

      {picture: 'https://i0.wp.com/www.diegocoquillat.com/wp-content/uploads/2021/11/Promocionar-un-restaurante-segun-Google.jpg?fit=700%2C336&ssl=1', portrait: false}

    ]},
  kindOfFood: { type:  String  },
  priceRange: { type: Number },
  grade: { type: Number },
  owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  menu: { type: mongoose.Types.ObjectId, required: true, ref: 'Menu' }
  },
  {
    versionKey: false,
  });

RestaurantSchema.index({location: '2dsphere'})

module.exports = Item = mongoose.model('Restaurant', RestaurantSchema);
