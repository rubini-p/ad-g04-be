const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Location = require('../utils/location');
const HttpError = require('../models/http-error');
const Restaurant = require('../models/restaurant');
const Menu = require('../models/menu');
const User = require('../models/user');
const {create} = require("axios");

const getRestaurants = async (req, res, next) => {
  let restaurants;
  try {
    restaurants = await Restaurant.find(); 
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not find a restaurant.',
        500
    );
    console.log(error)
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
  console.log('nearme...');
  let restaurants;
  try {
    let maxDistance;
    if (!req.query.maxDistance) {
      maxDistance = 1000
    } else {
      maxDistance = req.query.maxDistance
    }
    restaurants = await Restaurant.find({
      location:
        { $near :
            {
              $geometry: { type: "Point",  coordinates: [ req.query.longitude, req.query.latitude ] },
              $maxDistance: maxDistance
            }
        }
    });
    restaurants = restaurants.filter(restaurants => restaurants.temporarilyClosed == false);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a reataurant.',
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
  console.log('Creating restaurant...');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, address, openTime, closeTime, temporarilyClosed, grade, kindOfFood, priceRange } = req.body;
  let aux = address.number + ' ' + address.street  + ' ' + address.state ;
  let coords = await Location(aux);
  let restaurant;
  try {
    restaurant = await Restaurant.findOne({ name: name });
    if(!restaurant){
      const createdRestaurant = new Restaurant({
        name,
        address,
        // funcion que obtenga lat y lng desde la address
        location: { "type": "Point", "coordinates": [coords.lng, coords.lat] },
        openTime,
        closeTime,
        temporarilyClosed, 
        kindOfFood,
        grade,
        priceRange,
        owner: req.userData.userId
      });
    
      const menu = new Menu({
        restaurant: createdRestaurant._id
      });
      await menu.save();

      createdRestaurant.menu = menu._id;
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
      console.log('created restaurant: ', createdRestaurant.name)
      res.status(201).json({ restaurant: createdRestaurant });
    }else{
      const errorER = new HttpError(
        'Something went wrong, could not create restaurant.',
        403
      );
      return next(errorER);
    }
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not create restaurant.',
      500
    );
    return next(error);
  }
  //
  
};

const updateRestaurant = async (req, res, next) => {
  console.log('Updating restaurant');
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, address, menu, openTime, closeTime, temporarilyClosed, grade, kindOfFood, priceRange  } = req.body;
  const restaurantId = req.params.rid;
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
  // console.log(aux);
  let coords = await Location(aux);
  // console.log(coords);
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

  console.log('isclosed:', temporarilyClosed);
  if (temporarilyClosed !== null) {
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

  console.log('getRestaurantByID...');
  // console.log('req: ', req.params);
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
      'Something went wrong, could not get restaurant1.',
      500
    );
    return next(error);
  }

  // if (restaurant.owner.toString() !== req.userData.userId) {
  //   const error = new HttpError('You are not allowed to edit this retaurant.', 401);
  //   return next(error);
  // }

  console.log('encontre este resto: ', restaurant._id);
  res.status(200).json({ restaurant: restaurant.toObject({ getters: true }) });
};

const getRestaurantsByUser = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  let restaurants;
  // console.log('params: ', req.params);
  try {
    // restaurant = await Restaurant.findById(restaurantId).populate('Menu');

    restaurants = await Restaurant.find({ owner: req.params.uid});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not get restaurant2.',
      510
    );
    return next(error);
  }

  // if (restaurant.owner.toString() !== req.userData.userId) {
  //   const error = new HttpError('You are not allowed to edit this retaurant.', 401);
  //   return next(error);
  // }


  res.status(200).json({ restaurants: restaurants.map(restaurant => restaurant.toObject({ getters: true })) });
};

const filterRestaurants = async (req, res, next) => {
//  Filtros nearme stars pricerange categorias kindoffood
  console.log('Filtering...')
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  };

  let result;
  let { stars, kof, price, latitude, longitude, maxDistance } = req.query
  let md;

  if (!stars) {
    stars = 0;
  }

  if (kof === 'TODO' || kof === '') {
    kof = ["TODO!", 'Pizza', 'Asiatica', 'Burgers', 'Ensalada', 'Helado', 'Brunch', 'Cafe', 'Milanesas', 'Italiana', 'Pescados', 'Carnes', 'Desayunos', 'Postres', 'Vegetariana'];
  }
  if (maxDistance === '') {
    md = 1000;
  } else {
    md = maxDistance
  }
  console.log(md);
  // if (!maxDistance) {
  //   md = 0
  // } else {
  //   md = maxDistance
  // }

  // a_price = []
  // if (price) {
  //   price = kof.replace('"','').split(',')
  //   // console.log('kof: ', a_kof);
  // }
  console.log(req.query);
  if (!price) {
    price = [1,2,3,4];
  };

  console.log(price,stars,md,latitude,longitude,kof);

  try {
    // category es un string de categorias separado por comas
    // if (price) {
      result = await Restaurant.find({
        grade: {$gte: stars},
        kindOfFood: {$in: kof },
        temporarilyClosed: false,
        priceRange: {$in: price},
        location: {$near: {$geometry: {type: "Point", coordinates: [longitude, latitude]}, $maxDistance: md}}
      });
    // } else {
    //   result = await Restaurant.find({
    //     grade: {$gte: stars},
    //     temporarilyClosed: false,
    //     priceRange: price,
    //     location: {$near: {$geometry: {type: "Point", coordinates: [longitude, latitude]}, $maxDistance: md}}
    //   })
    // }
      // console.log('Results: ', result)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not get restaurant.',
      510
    );
    return next(error);
  };
  console.log(result);
  res.status(200).json({ restaurants: result.map(restaurant => restaurant.toObject({ getters: true })) });
}

const filterFavoritesRestaurants = async (req, res, next) => {
//  Filtros nearme stars pricerange categorias kindoffood
  console.log('Filtering...')
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  };

  let result;
  let { stars, kof, price, latitude, longitude, maxDistance, userId } = req.query
  let md;

  if (!stars) {
    stars = 0;
  }

  if (kof === 'TODO' || kof === '') {
    kof = ["TODO!", 'Pizza', 'Asiatica', 'Burgers', 'Ensalada', 'Helado', 'Brunch', 'Cafe', 'Milanesas', 'Italiana', 'Pescados', 'Carnes', 'Desayunos', 'Postres', 'Vegetariana'];
  }
  if (maxDistance === '') {
    md = 1000;
  } else {
    md = maxDistance
  }
  console.log(md);
  // if (!maxDistance) {
  //   md = 0
  // } else {
  //   md = maxDistance
  // }

  // a_price = []
  // if (price) {
  //   price = kof.replace('"','').split(',')
  //   // console.log('kof: ', a_kof);
  // }
  console.log(req.query);
  if (!price) {
    price = [1,2,3,4];
  };

  console.log(price,stars,md,latitude,longitude,kof);

  let user = User.findById(userId);

  try {
    // category es un string de categorias separado por comas
    // if (price) {
    result = await Restaurant.find({
      _id: { $in: user.favorite},
      grade: {$gte: stars},
      kindOfFood: {$in: kof },
      temporarilyClosed: false,
      priceRange: {$in: price},
      location: {$near: {$geometry: {type: "Point", coordinates: [longitude, latitude]}, $maxDistance: md}}
    });
    // } else {
    //   result = await Restaurant.find({
    //     grade: {$gte: stars},
    //     temporarilyClosed: false,
    //     priceRange: price,
    //     location: {$near: {$geometry: {type: "Point", coordinates: [longitude, latitude]}, $maxDistance: md}}
    //   })
    // }
    // console.log('Results: ', result)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not get restaurant.',
      510
    );
    return next(error);
  };
  console.log(result);
  res.status(200).json({ restaurants: result.map(restaurant => restaurant.toObject({ getters: true })) });
}


const deleteRestaurant = async (req, res, next) => {
  const restaurantId = req.params.rid;

  let restaurant;
  try {
    restaurant = await Restaurant.findById(restaurantId);
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
  // console.log(restaurant.owner.toString(), req.userData.userId);
  // if (restaurant.owner.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     'You are not allowed to delete this restaurant.',
  //     401
  //   );
  //   return next(error);
  // }

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
exports.getRestaurantsByUser = getRestaurantsByUser;
exports.getRestaurantsNearMe = getRestaurantsNearMe;
exports.createRestaurant = createRestaurant;
exports.updateRestaurant = updateRestaurant;
exports.deleteRestaurant = deleteRestaurant;
exports.filterRestaurants = filterRestaurants;
exports.filterFavoritesRestaurants = filterFavoritesRestaurants;
