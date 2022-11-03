const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MenuSchema = new Schema({
    category: { type: Array, required: false }, 
    food: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Food' }],
    restaurant: { type: mongoose.Types.ObjectId, required: true, ref: 'Restaurant' }
    });


module.exports = mongoose.model('Menu', MenuSchema);
