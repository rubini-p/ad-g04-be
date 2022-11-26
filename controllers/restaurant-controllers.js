// WIP Armar controller
const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');

const getRestaurants = async (req, res, next) => {
  let restaurants;
  try {
    restaurants = await Restaurant.find();
    console.log(restaurants)
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

  const { name, address, longitude, latitude, openTime, closeTime, temporarilyClosed, grade, kindOfFood,description, priceRange } = req.body;
  const createdRestaurant = new Restaurant({
    name,
    address,
    location: { "type": "Point", "coordinates": [longitude, latitude] },
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { restaurant_name, address, latitude, longitude, openTime, closeTime, isClosed, photos, grade,  foodType, priceRange } = req.body;
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

  if (restaurant_name) {
    restaurant.restaurant_name = restaurant_name;
  }
  if (address) {
  restaurant.address = address;
  }
  if (latitude) {
    restaurant.latitude = latitude;
  }
  if (longitude) {
    restaurant.longitude = longitude;
  }
  if (openTime) {
    restaurant.openTime = openTime;
  }
  if (closeTime) {
    restaurant.closeTime = closeTime;
  }
  if (isClosed) {
    restaurant.isClosed = isClosed; // default value false
  }
    // restaurant.photos = photos;
  if (foodType) {
    restaurant.foodType = foodType;
  }
  if (priceRange) {
    restaurant.priceRange = priceRange;
  }
  if (grade) {
    restaurant.grade = grade;
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
exports.getRestaurantsNearMe = getRestaurantsNearMe;
exports.createRestaurant = createRestaurant;
exports.updateRestaurant = updateRestaurant;
exports.deleteRestaurant = deleteRestaurant;
