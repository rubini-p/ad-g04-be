//OBSOLETE - Solo ejemplo
const express = require('express');
const { check } = require('express-validator');

const restaurantController = require('../controllers/restaurant-controllers');
const fileUpload = require('../middleware/file-upload');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/all', restaurantController.getRestaurants);


// router.get('/:pid', restaurantController.getRestaurantById);

// router.get('/user/:uid', restaurantController.getRestaurantsByUserId);

router.use(checkAuth);

router.post(
    '/',
    // fileUpload.single('image'),
    [
        check('restaurant_name')
            .not()
            .isEmpty()
    ],
    restaurantController.createRestaurant
);
//
router.patch(
    '/:pid',
    [
        check('restaurant_name')
            .not()
            .isEmpty(),
    ],
    restaurantController.updateRestaurant
);

router.delete('/:pid', restaurantController.deleteRestaurant);

module.exports = router;
