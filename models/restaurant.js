// WIP Armar modelo restaurnt

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RestaurantSchema = new Schema({
    restaurant_name: {
        type: String,
    },
    address: { type: String },
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
    // location: {type: "Point" , coordinates: [Number] },
    // latitude: { type: String },
    // longitude:  {type: String },
    open: { type: [ String ] },
    close: { type: [ String ] },
    isClosed: { type: Boolean }, // default value false
    coverImage: { type: String },
    image: {type: [ String ]},
    foodType: { type: String },
    priceRange: { type: Number },
    owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
  },
    {
        versionKey: false,
    });


module.exports = Item = mongoose.model('Restaurant', RestaurantSchema);
