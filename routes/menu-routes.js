//WIP Armar menu routes
const express = require('express');
const { check } = require('express-validator');

const menuController = require('../controllers/menu-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

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
            .isEmpty()
    ],
    menuController.updateMenu
);

router.delete('/:pid', menuController.deleteMenu);

module.exports = router;
