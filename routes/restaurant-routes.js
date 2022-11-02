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
// router.patch(
//     '/:pid',
//     [
//         check('nombre_receta')
//             .not()
//             .isEmpty(),
//         check('ingredientes_ppal')
//             .not()
//             .isEmpty(),
//         check('ingredientes')
//             .not()
//             .isEmpty(),
//         check('categoria')
//             .not()
//             .isEmpty(),
//         check('dificultad')
//             .not()
//             .isEmpty(),
//         check('status')
//             .not()
//             .isEmpty(),
//         check('Proceso')
//             .not()
//             .isEmpty(),
//         check('Intro')
//             .not()
//             .isEmpty(),
//         check('rating')
//             .not()
//             .isEmpty(),
//         check('avatarUrl')
//             .not()
//             .isEmpty(),
//         check('coverUrl')
//             .not()
//             .isEmpty()
//     ],
//     restaurantControllers.updateRestaurant
// );
//
// router.delete('/:pid', restaurantControllers.deleteRestaurant);

module.exports = router;
