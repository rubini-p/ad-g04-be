const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: false , default: 'User' },
  email: { type: String, required: true },
  //usar como name el email en el googlesignup
  password: { type: String, required: false, minlength: 6 },
  favorite:{ type: [ String ], required: false},
  isAdmin: { type: Boolean, required: true, default: true },
  photo: { type: String, required: false },
  defaultImage: { type: Boolean, required: false, default: true }
},
  {
    versionKey: false,
  }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
