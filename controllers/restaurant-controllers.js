// WIP Armar controller
const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Receta = require('../models/receta');
const User = require('../models/user');

const getRecetas = async (req, res, next) => {
  const recetaId = req.params.pid;
  let recetasAll;
  let recetas;
  try {
    recetas = await Receta.find();
    console.log(recetas)
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not find a receta.',
        500
    );
    return next(error);
  }

  if (!recetas) {
    const error = new HttpError(
        'Could not find receta for the provided id.',
        404
    );
    return next(error);
  }

  res.json({recetas});
};

const getRecetaById = async (req, res, next) => {
  const recetaId = req.params.pid;

  let receta;
  try {
    receta = await Receta.findById(recetaId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a receta.',
      500
    );
    return next(error);
  }

  if (!receta) {
    const error = new HttpError(
      'Could not find receta for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ receta: receta.toObject({ getters: true }) });
};

const getRecetasByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId)
  // let recetas;
  let userWithRecetas;
  try {
    // userWithRecetas = await User.findById(userId).populate('recetas');
    // userWithRecetas = await User.findById(userId).populate('recetas');
    userWithRecetas = await User.findById(userId).populate('recetas');
    console.log('pepe', userWithRecetas)
  } catch (err) {
    console.log(err)
    const error = new HttpError(
        'Fetching recetas failed, please try again later.',
        500
    );
    return next(error);
  }

  // if (!recetas || recetas.length === 0) {
  if (!userWithRecetas || userWithRecetas.recetas.length === 0) {
    return next(
        new HttpError('Could not find recetas for the provided user id.', 404)
    );
  }

  res.json({
    recetas: userWithRecetas.recetas.map(receta =>
        receta.toObject({ getters: true })
    )
  });
};

const createReceta = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { nombre_receta, ingredientes_ppal, ingredientes, categoria, dificultad, status, Proceso, Intro, rating, avatarUrl, coverUrl, creador } = req.body;

  const createdReceta = new Receta({
    nombre_receta,
    ingredientes_ppal,
    ingredientes,
    categoria,
    dificultad,
    status,
    Proceso,
    Intro,
    rating,
    coverUrl,
    avatarUrl,
    creador: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
        'Creating receta failed, please try again user not found.',
        500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  console.log(user);

  try {
    // const sess = await mongoose.startSession();
    // console.log(sess)
    createdReceta
    // console.log(sess.startTransaction());
    // console.log("2")
    // await createdReceta.save({ session: sess });
    await createdReceta.save();
    console.log("3")
    user.recetas.push(createdReceta);
    console.log("4")
    await user.save();
    console.log("5")
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
        'Creating receta failed, please try again. no se por que falla',
        500
    );
    return next(error);
  }

  res.status(201).json({ receta: createdReceta });
};

const updateReceta = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { nombre_receta, ingredientes_ppal, ingredientes, categoria, dificultad, status, Proceso, Intro, rating, coverUrl, avatarUrl } = req.body;
  const recetaId = req.params.pid;

  let receta;
  try {
    receta = await Receta.findById(recetaId);
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not update receta.',
        500
    );
    return next(error);
  }

  if (receta.creador.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this receta.', 401);
    return next(error);
  }

  receta.nombre_receta = nombre_receta;
  receta.ingredientes_ppal = ingredientes_ppal;
  receta.ingredientes = ingredientes;
  receta.categoria = categoria;
  receta.dificultad = dificultad;
  receta.status = status;
  receta.Proceso = Proceso;
  receta.Intro = Intro;
  receta.rating = rating;
  receta.coverUrl = coverUrl;
  receta.avatarUrl = avatarUrl;

  try {
    await receta.save();
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not update receta.',
        500
    );
    return next(error);
  }

  res.status(200).json({ receta: receta.toObject({ getters: true }) });
};

const deleteReceta = async (req, res, next) => {
  const recetaId = req.params.pid;

  let receta;
  try {
    receta = await Receta.findById(recetaId).populate('creador');
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not delete receta.',
        500
    );
    return next(error);
  }

  if (!receta) {
    const error = new HttpError('Could not find receta for this id.', 404);
    return next(error);
  }

  if (receta.creador.id !== req.userData.userId) {
    const error = new HttpError(
        'You are not allowed to delete this receta.',
        401
    );
    return next(error);
  }

  // const imagePath = receta.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await receta.remove();
    receta.creador.recetas.pull(receta);
    await receta.creador.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not delete receta.',
        500
    );
    return next(error);
  }

  // fs.unlink(imagePath, err => {
  //   console.log(err);
  // });

  res.status(200).json({ message: 'Deleted receta.' });
};

exports.getRecetaById = getRecetaById;
exports.getRecetas = getRecetas;
exports.getRecetasByUserId = getRecetasByUserId;
exports.createReceta = createReceta;
exports.updateReceta = updateReceta;
exports.deleteReceta = deleteReceta;
