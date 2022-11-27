// WIP Armar controller
const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Location = require('../utils/location');
const HttpError = require('../models/http-error');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');

const getRestaurants = async (req, res, next) => {
  let restaurants;
  try {
    restaurants = await Restaurant.find();
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not find a receta.',
        500
    );
    return next(error);
  }

  if (!restaurants) {
    const error = new HttpError(
        'Could not find restaurants for the provided id.',
        404
    );
    return next(error);
  }

  res.json({restaurants});
};

const getRestaurantsNearMe = async (req, res, next) => {
  let restaurants;
  try {

    let maxDistance;

    if (!req.query.maxDistance) {
      maxDistance = 1000
    } else {
      maxDistance = req.query.maxDistance
    }
    console.log(maxDistance)
    restaurants = await Restaurant.find({
      location:
        { $near :
            {
              $geometry: { type: "Point",  coordinates: [ req.query.longitude, req.query.latitude ] },
              $maxDistance: maxDistance
            }
        }
    });
    // console.log(restaurants)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a receta.',
      500
    );
    return next(error);
  }

  if (!restaurants) {
    const error = new HttpError(
      'Could not find restaurants for the provided id.',
      404
    );
    return next(error);
  }

  res.json({restaurants});
};

const createRestaurant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, address, openTime, closeTime, temporarilyClosed, grade, kindOfFood,description, priceRange } = req.body;

  let aux = address.number + ' ' + address.street  + ' ' + address.state ;
  let coords = await Location(aux);
  const createdRestaurant = new Restaurant({
    name,
    address,
    // funcion que obtenga lat y lng desde la address
    location: { "type": "Point", "coordinates": [coords.lng, coords.lat] },
    openTime,
    closeTime,
    temporarilyClosed, // default value false
    // coverImage: req.files['coverImage'][0].path,
    // image: req.files['image'].map(file => file.path),
    kindOfFood,
    description,
    grade,
    priceRange,
    owner: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Creating restaurant failed, please try again user not found.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  try {
    await createdRestaurant.save();
  } catch (err) {
    const error = new HttpError(
      'Creating restaurant failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ restaurant: createdRestaurant });
};

const updateRestaurant = async (req, res, next) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, address, menu, openTime, closeTime, temporarilyClosed, grade, kindOfFood, priceRange  } = req.body;
  const restaurantId = req.params.pid;
  let restaurant;
  try {
    restaurant = await Restaurant.findById(restaurantId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update restaurant.',
      500
    );
    return next(error);
  }

  if (restaurant.owner.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this retaurant.', 401);
    return next(error);
  }

  if (name) {
    restaurant.name = name
  }
  if (address) {
  restaurant.address = address;
  let aux = address.number + ' ' + address.street  + ' ' + address.state ;
  console.log(aux);
  let coords = await Location(aux);
  console.log(coords);
    // 2216 virrey del pino buenos aires");
  restaurant.location = { "type": "Point", "coordinates": [coords.lng, coords.lat]
  }
}
  if (openTime) {
    restaurant.openTime = openTime;
  }
  if (closeTime) {
    restaurant.closeTime = closeTime;
  }
  if (temporarilyClosed) {
    restaurant.temporarilyClosed = temporarilyClosed; // default value false
  }
    // restaurant.photos = photos;
  if (kindOfFood) {
    restaurant.kindOfFood = kindOfFood;
  }
  if (priceRange) {
    restaurant.priceRange = priceRange;
  }
  if (grade) {
    restaurant.grade = grade;
  }
  if (menu) {
    restaurant.menu = menu;
  }

  try {
    await restaurant.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update restaurant.',
      500
    );
    return next(error);
  }

  res.status(200).json({ restaurant: restaurant.toObject({ getters: true }) });
};

const getRestaurantById = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const restaurantId = req.params.rid;
  let restaurant;

  try {
    // restaurant = await Restaurant.findById(restaurantId).populate('Menu');
    restaurant = await Restaurant.findById(restaurantId).populate('menu');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not get restaurant.',
      500
    );
    return next(error);
  }

  // if (restaurant.owner.toString() !== req.userData.userId) {
  //   const error = new HttpError('You are not allowed to edit this retaurant.', 401);
  //   return next(error);
  // }


  res.status(200).json({ restaurant: restaurant.toObject({ getters: true }) });
};


const deleteRestaurant = async (req, res, next) => {
  const restaurantId = req.params.pid;

  let restaurant;
  try {
    restaurant = await Restaurant.findById(restaurantId).populate('owner');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete restaurant.',
      500
    );
    return next(error);
  }

  if (!restaurant) {
    const error = new HttpError('Could not find receta for this id.', 404);
    return next(error);
  }

  if (restaurant.owner.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this restaurant.',
      401
    );
    return next(error);
  }

  // const imagePath = receta.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await restaurant.remove();
    // restaurant.owner.restaurant.pull(restaurant);
    // await restaurant.owner.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete restaurant.',
      500
    );
    return next(error);
  }

  // fs.unlink(imagePath, err => {
  //   console.log(err);
  // });

  res.status(200).json({ message: 'Deleted restaurant.' });
};

exports.getRestaurants = getRestaurants;
exports.getRestaurantById = getRestaurantById;
exports.getRestaurantsNearMe = getRestaurantsNearMe;
exports.createRestaurant = createRestaurant;
exports.updateRestaurant = updateRestaurant;
exports.deleteRestaurant = deleteRestaurant;
