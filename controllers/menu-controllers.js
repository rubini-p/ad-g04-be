const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Menu = require("../models/menu");

const getMenuById = async (req, res, next) => {
  const { menuId } = req.body;
  let existingMenu;
  try {
    existingMenu = await Menu.findOne({ _id: menuId })
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Menu.",
      500
    );
    return next(error);
  }

  if (!existingMenu) {
    const error = new HttpError(
      "Could not find Menu for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ Menu: existingMenu.toObject({ getters: true }) });
};

const getMenuCategories = async (req, res, next) => {
  console.log('getting menu categories');
  let existingMenu;
  try {
    existingMenu = await Menu.findById(req.params.mid)
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Menu.",
      500
    );
    return next(error);
  }

  if (!existingMenu) {
    const error = new HttpError(
      "Could not find Menu for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ Menu: existingMenu.toObject({ getters: true }) });
};

const createMenu = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { restaurant, category, menu } = req.body;
  const categoryAccepted = [ 'Promoción', 'Entradas', 'Minutas', 'Ensalada', 'Cafetería' , 'Carnes', 'Pizzas', 'Pescados', 'Pastas', 'Postres'];

  if (categoryAccepted.includes(category)) {
    const createdMenu = new Menu({
      category,
      menu,
      restaurant
    });
    try {
      await createdMenu.save();
    } catch (err) {
      const error = new HttpError(
        "Signing up failed, please try again later.",
        500
      );
      return next(error);
    }
    res
      .status(201)
      .json({ menu: createdMenu.toObject({ getters: true }) });
  }else{
    const error = "La categoria ingresada no es valida.";
    return next(error);
  }
};


const updateMenu = async (req, res, next) => {
  console.log('updating menu...');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { menuId, category } = req.body;
  console.log('body: ', req.body);
  let menu;
  try {
    menu = await Menu.findById(menuId);
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not update menu.',
        500
    );
    return next(error);
  }
  // console.log('Category: ', category);
  // console.log('CategoryMenu: ', menu.category);
  console.log('menu: ', menu);
  if (category) {
    menu.category = category;
  }
  try {
    await menu.save();
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not update menu.',
        500
    );
    return next(error);
  }

  res.status(200).json({ menu: menu.toObject({ getters: true }) });
};

const deleteMenu = async (req, res, next) => {
  const menuId = req.params.pid;

  let menu;
  try {
    menu = await Menu.findById(menuId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete menu.",
      500
    );
    return next(error);
  }

  if (!menu) {
    const error = new HttpError("Could not find menu for this id.", 404);
    return next(error);
  }

  try {
    await menu.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete menu.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted menu." });
};



exports.getMenuById = getMenuById;
exports.createMenu = createMenu;
exports.updateMenu = updateMenu;
exports.deleteMenu = deleteMenu;
exports.getMenuCategories = getMenuCategories;