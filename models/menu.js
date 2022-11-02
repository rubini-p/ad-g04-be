// WIP Armar el modelo de menu
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MenuSchema = new Schema({
    category: { type: Array, required: false }, 
    food: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Food' }],
    //guardar el ID del restaurant
    restaurant: { type: mongoose.Types.ObjectId, required: false, ref: 'Restaurant' }
    });


module.exports = mongoose.model('Menu', MenuSchema);
