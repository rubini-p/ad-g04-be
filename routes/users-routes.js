const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/:tkn', usersController.checkToken);

router.post(
  '/signup',
  [
    check('name'),
      check('lastName'),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

router.post('/reset', usersController.reset);
router.post('/resetpassword', usersController.resetPassword);



module.exports = router;
