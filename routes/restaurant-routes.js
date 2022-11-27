//OBSOLETE - Solo ejemplo
const express = require('express');
const { check } = require('express-validator');

const restaurantController = require('../controllers/restaurant-controllers');
const fileUpload = require('../middleware/file-upload');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/all', restaurantController.getRestaurants);
router.get('/:rid', restaurantController.getRestaurantById);
router.get('/user/:uid', restaurantController.getRestaurantByUser);
router.get('/nearme', restaurantController.getRestaurantsNearMe);

// router.get('/:pid', restaurantController.getRestaurantById);

// router.get('/user/:uid', restaurantController.getRestaurantsByUserId);

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
router.patch(
    '/:pid',
    [
        check('name')
            .not()
            .isEmpty(),
    ],
    restaurantController.updateRestaurant
);

router.delete('/:pid', restaurantController.deleteRestaurant);

module.exports = router;
