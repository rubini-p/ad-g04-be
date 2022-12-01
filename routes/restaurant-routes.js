//OBSOLETE - Solo ejemplo
const express = require('express');
const { check } = require('express-validator');

const restaurantController = require('../controllers/restaurant-controllers');
const fileUpload = require('../middleware/file-upload');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/all', restaurantController.getRestaurants);
router.get('/favorites', restaurantController.getRestaurantsFavorites);
router.get('/id/:rid', restaurantController.getRestaurantById);
router.get('/user/:uid', restaurantController.getRestaurantsByUser);
router.get('/nearme', restaurantController.getRestaurantsNearMe);
router.get('/filter', restaurantController.filterRestaurants);
router.get('/filterfavorites', restaurantController.filterFavoritesRestaurants);

// router.get('/:pid', restaurantController.getRestaurantById);

// router.get('/user/:uid', restaurantController.getRestaurantsByUserId);
router.delete('/:rid', restaurantController.deleteRestaurant);

router.use(checkAuth);

router.post(
    '/',
    // fileUpload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'image', maxCount: 8 }]),
    [
        check('name')
            .not()
            .isEmpty()//,
      //   check('address')
      //     .not()
      //     .isEmpty(),
      // check('latitude')
      //   .not()
      //   .isEmpty(),
      // check('longitude')
      //   .not()
      //   .isEmpty()
    ],
    restaurantController.createRestaurant
);
//
router.patch('/:rid', restaurantController.updateRestaurant);


module.exports = router;
