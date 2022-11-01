//WIP Armar menu routes
const express = require('express');
const { check } = require('express-validator');

const menuController = require('../controllers/menu-controllers');
const fileUpload = require('../middleware/file-upload');

//const checkAuth = require('../middleware/check-auth');
const router = express.Router();
/*
router.get('/all', recetasControllers.getRecetas);


router.get('/:pid', recetasControllers.getRecetaById);

router.get('/user/:uid', recetasControllers.getRecetasByUserId);

router.use(checkAuth);
*/

router.get('/', menuController.getMenuById);

router.post(
    '/createMenu',
    [
        check('category')
            .not()
            .isEmpty(),
        check('food'),
        check('restaurant')
            .not()
            .isEmpty(),
    ],
    menuController.createMenu
);

router.post(
    '/updateMenu',
    [
        check('category')
            .not()
            .isEmpty(),
        check('food'),
    ],
    menuController.updateMenu
);

//router.delete('/:pid', menuControllers.delete);

module.exports = router;
