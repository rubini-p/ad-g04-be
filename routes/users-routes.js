const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/:tkn', usersController.checkToken);
router.get('/onlyfavs/favs', usersController.onlyFavs)
router.post(
  '/signup',
  [
    check('email')
      .normalizeEmail()
      .isEmail()
  ],
  usersController.signup
);

router.post(
  '/signupgoogle',
  [
    check('email')
      .normalizeEmail()
      .isEmail()
  ],
  usersController.signupGoogle
);

router.post(
  '/signupDefault',
  [
    check('email')
      .normalizeEmail()
      .isEmail()
  ],
  usersController.signupDefault
);


router.post('/login', usersController.login);
router.post('/logingoogle', usersController.loginGoogle);
router.post('/loginDefault', usersController.loginDefault);

router.post('/reset', usersController.reset);
router.post('/resetpassword', usersController.resetPassword);

router.use(checkAuth);
router.patch('/edit', usersController.editUser);
router.delete('/', usersController.deleteAccount);
router.post('/changepassword', usersController.changePassword);


module.exports = router;
