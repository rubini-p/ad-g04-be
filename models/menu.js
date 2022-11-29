const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MenuSchema = new Schema({
    category: { type: {
        promocion: {type: Boolean},
        entradas:  {type: Boolean},
        minutas:  {type: Boolean},
        ensalada:  {type: Boolean},
        cafeteria:  {type: Boolean},
        carnes:  {type: Boolean},
        pizzas:  {type: Boolean},
        pescados: {type: Boolean},
        pastas: {type: Boolean},
        postres: {type: Boolean}
} },
    food: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Food' }],
    restaurant: { type: mongoose.Types.ObjectId, required: true, ref: 'Restaurant' }
    },
  {
      versionKey: false,
  });


module.exports = mongoose.model('Menu', MenuSchema);
