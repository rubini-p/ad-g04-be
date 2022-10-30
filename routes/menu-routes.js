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
    // fileUpload.single('image'),
    [
        check('category')
            .not()
            .isEmpty(),
        check('food'),
    ],
    menuController.createMenu
);
/*
router.patch(
    '/:pid',
    [
        check('nombre_receta')
            .not()
            .isEmpty(),
        check('ingredientes_ppal')
            .not()
            .isEmpty(),
        check('ingredientes')
            .not()
            .isEmpty(),
        check('categoria')
            .not()
            .isEmpty(),
        check('dificultad')
            .not()
            .isEmpty(),
        check('status')
            .not()
            .isEmpty(),
        check('Proceso')
            .not()
            .isEmpty(),
        check('Intro')
            .not()
            .isEmpty(),
        check('rating')
            .not()
            .isEmpty(),
        check('avatarUrl')
            .not()
            .isEmpty(),
        check('coverUrl')
            .not()
            .isEmpty()
    ],
    recetasControllers.updateReceta
);

router.delete('/:pid', recetasControllers.deleteReceta);
*/
module.exports = router;
