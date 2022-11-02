// WIP Armar el modelo de food

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    category: { type: String, required: false }, 
    foodname: { type: String, required: false }, 
    description: { type: String, required: false }, 
    price: { type: Number, required: false },
    photos: { type: String, required: false },
    ingredients: { type: Array, required: false },
    isCeliac: { type: Boolean, required: false },
    isVegan: { type: Boolean, required: false },
    menuId: { type: mongoose.Types.ObjectId, required: true, ref: 'Menu' }
    });


module.exports = mongoose.model('Food', FoodSchema);