// WIP Armar modelo restaurnt

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RestaurantSchema = new Schema({
    restaurant_name: {
        type: String,
    },
    owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
},
    {
        versionKey: false,
    });


module.exports = Item = mongoose.model('Restaurant', RestaurantSchema);
