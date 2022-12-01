const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const crypto = require('crypto');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/token");
const Restaurant = require("../models/restaurant");
const {exist} = require("joi");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const onlyFavs = async (req, res, next) => {
  console.log('getting favs list..');
  let user;
  const userId = req.query.userId;
  console.log('query: ', req.query);
  console.log('params: ', req.params);
  try {

    user = await User.findById(userId, '-password');

  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  console.log('los favoritos: ', user.favorite);
  res.json({ favorites: user.favorite } );
};


const signupDefault = async (req, res, next) => {
  console.log('signin up admin...', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password, photo, isAdmin, defaultImage, favorite } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email, isAdmin: true });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);

  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    favorite,
    isAdmin: true,
    photo,
    defaultImage
  });
  console.log('createduser: ', createdUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      'supersecret_dont_share',
      // { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const signup = async (req,res,next) => {
  const {isAdmin} = req.body;
  if (isAdmin)
    signupDefault(req,res,next);
  else
    signupGoogle(req,res,next);

}

const signupGoogle = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { email,  photo, isAdmin, defaultImage, favorite } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ name: email, isAdmin:true});
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

    const createdUser = new User({
    name:email,
    email,
    favorite,
    isAdmin:true,
    photo,
    defaultImage,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      'supersecret_dont_share',
      // { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
}

const editUser = async (req, res, next) => {
  console.log('editing user.. ');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, photo, defaultImage, favorite, userId } = req.body;

  let existingUser;

  let uid;

  console.log(req.userData);

  if (!req.userData) {
    uid = userId;
  } else {
    uid = req.userData.userId;
  }

  console.log('req.body: ', req.body);
  try {
    console.log('uid: ', uid);
    existingUser = await User.findById(uid);
  } catch (err) {
    console.log('token');
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  console.log('favorite: ', favorite);
  if (!existingUser) {
    const error = new HttpError(
      'User does not exist, please signup instead.',
      422
    );
    return next(error);
  }

  if (name) {
    existingUser.name = name;
  };
  if (email) {
    existingUser.email = email;
  };
  if (photo) {
    existingUser.photo = photo;
  };

  if (defaultImage === true) {
    existingUser.defaultImage = defaultImage;
  } else if (defaultImage === false) {
    existingUser.defaultImage = defaultImage;
  }
  ;
  if (favorite) {
    existingUser.favorite = favorite;
  };

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  console.log('user updated: ', existingUser.email);
  res
    .status(201)
    .json({ message: 'user updated' });
};

const loginDefault = async (req, res, next) => {
  console.log('logging in admin..', req.body);
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email, isAdmin: true });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      'supersecret_dont_share'
      // ,
      // { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  console.log('login successfull: ', existingUser.email);
  console.log('existinguser: ', existingUser)
  res.json({
    name: existingUser.name,
    userId: existingUser._id,
    email: existingUser.email,
    token: token,
    favorite: existingUser.favorite,
    photo: existingUser.photo,
    defaultImage: existingUser.defaultImage,
    isAdmin: existingUser.isAdmin,
  });
};

const login = async (req, res, next) => {
  const {isAdmin} = req.body;
  if (isAdmin)
    loginDefault(req,res,next);
  else
    loginGoogle(req,res,next);
}

const loginGoogle = async (req, res, next) => {
  console.log('logging in with google, ', req.body);
  const { email, name, photo,  } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email, isAdmin: false });
    console.log('existingUser: ', existingUser);
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  let createdUser ;
  if (!existingUser) {
    try {
      createdUser = new User({email, isAdmin: false, defaultImage: true, photo, name });
      await createdUser.save();
      console.log('Guarde el usuario no admin');
    } catch (err) {
        const error = new HttpError(
          'Invalid credentials, could not log you in.',
          403
        );
        return next(error);
      }};

  try {
    existingUser = await User.findOne({ email, isAdmin: false });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      'supersecret_dont_share'
      // ,
      // { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  console.log('login successfull: ', existingUser.email)
  console.log(existingUser);
  res.json({
    name: existingUser.name,
    userId: existingUser._id,
    email: existingUser.email,
    token: token,
    favorite: existingUser.favorite,
    photo: existingUser.photo,
    defaultImage: existingUser.defaultImage,
    isAdmin: existingUser.isAdmin,
  });
};

const deleteAccount = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete User.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find User for this id.', 404);
    return next(error);
  }

  if (user.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this User.',
      401
    );
    return next(error);
  }

  try {
    console.log('falle en el user remove');
    await user.remove();
    console.log('falle en el user remove');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.',
      500
    );
    return next(error);
  }

  console.log('Deleted user: ', user.email)
  res.status(200).json({ message: 'Deleted Account.' });
};

const reset = async (req, res, next) => {
  const schema = Joi.object({ email: Joi.string().email().required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new HttpError(
        'user with given email doesn\'t exist.',
        403
      );
      return next(error);
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: Math.floor(100000 + Math.random() * 900000),
      }).save();
    }
    const link = `${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (err) {
    const error = new HttpError(
      'Could not reset password',
      500
    );
    return next(error);
  }
}

const resetPassword = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required(), email: Joi.string().required(), tkn: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.body.tkn,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(req.body.password, 12);
    } catch (err) {
      const error = new HttpError(
        'Could not create user, please try again.',
        500
      );
      return next(error);
    }
    user.password = hashedPassword;
    await user.save();
    await token.delete();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
}

const changePassword = async (req, res, next) => {
  console.log('changing password...');
  const { currentPassword, newPassword } = req.body;

  let existingUser;

  try {
    existingUser = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Password change failed, please try again later.',
      500
    );
    return next(error);
  }
  console.log('user to change password is: ', existingUser.email);
  if (!existingUser) {
    const error = new HttpError(
      'User does not exist',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(currentPassword, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }
  console.log('isvalid: ', isValidPassword , existingUser.password)
   console.log('body: ', req.body);
  if (!isValidPassword) {
    const error = new HttpError(
      'Actual password is wrong',
      403
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
    existingUser.password = hashedPassword;
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      'Changing password failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      // { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  console.log('password changed: ', existingUser.email);
  res
    .status(201)
    .json({ userId: existingUser.id, email: existingUser.email, token: token });
}

const checkToken = async (req, res) => {
  try {
    // const schema = Joi.object({ password: Joi.string().required() });
    // const { error } = schema.validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    console.log('checking token');
    const token = await Token.findOne({
      token: req.params.tkn,
    });
    if (!token) return res.status(400).send("Invalid link or expired2");

    res.send("valid token");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
}

exports.onlyFavs = onlyFavs;
exports.loginGoogle = loginGoogle;
exports.signupGoogle = signupGoogle;
exports.editUser = editUser;
exports.getUsers = getUsers;
exports.signup = signup;
exports.checkToken = checkToken;
exports.deleteAccount = deleteAccount;
exports.login = login;
exports.loginDefault = loginDefault;
exports.signupDefault = signupDefault;
exports.reset = reset;
exports.changePassword = changePassword;
exports.resetPassword = resetPassword;
