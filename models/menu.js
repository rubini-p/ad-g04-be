// WIP Armar el modelo de menu
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MenuSchema = new Schema({
    id: { type: Number, required: false },
    category: { type: String, required: true }, 
    food: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Food' }]
    });


module.exports = mongoose.model('Menu', MenuSchema);
