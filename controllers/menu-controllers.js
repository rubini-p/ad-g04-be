// WIP Armar controller

//const fs = require('fs');

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
//const Menu = require('../models/Menu');
const Menu = require("../models/menu");

/*const getMenu = async (req, res, next) => {
  //const menuId = req.params.pid;
  //let menusAll;
  let menus;
  try {
    menus = await Menu.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching menu failed, please try again later.",
      500
    );
    return next(error);
  }
  
  if (!menus) {
    const error = new HttpError(
        'Could not find Menu for the provided id.',
        404
    );
    return next(error);
  }


  //res.json({menus});
  res.json({ menus: menus.map((menu) => menu.toObject({ getters: true })) });
};*/

const getMenuById = async (req, res, next) => {
  //const menuId = req.params.pid;
  const { menuId } = req.body;
  let existingMenu;
  try {
    existingMenu = await Menu.findOne({ menuId: menuId })
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
/*
const getmenusByexistingMenuId = async (req, res, next) => {
  const existingMenuId = req.params.uid;
  console.log(existingMenuId)
  // let menus;
  let existingMenuWithmenus;
  try {
    // existingMenuWithmenus = await existingMenu.findById(existingMenuId).populate('menus');
    // existingMenuWithmenus = await existingMenu.findById(existingMenuId).populate('menus');
    existingMenuWithmenus = await Menu.findById(existingMenuId).populate('menus');
    console.log('pepe', existingMenuWithmenus)
  } catch (err) {
    console.log(err)
    const error = new HttpError(
        'Fetching menus failed, please try again later.',
        500
    );
    return next(error);
  }

  // if (!menus || menus.length === 0) {
  if (!existingMenuWithmenus || existingMenuWithmenus.menus.length === 0) {
    return next(
        new HttpError('Could not find menus for the provided existingMenu id.', 404)
    );
  }

  res.json({
    menus: existingMenuWithmenus.menus.map(Menu =>
        Menu.toObject({ getters: true })
    )
  });
};
*/

const createMenu = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { id, category, food } = req.body;
  //tenemos que pasarlo a una tabla
  const categoryAccepted = [
    "Promocion del Dia",
    "Entradas",
    "Minutas",
    "Ensaladas",
    "Cafeteria",
    "Carnes",
    "Pizzas",
    "Pescado",
    "Pastas",
    "Postres",
  ];
  if (categoryAccepted.includes(category)) {
    const createdMenu = new Menu({
      category,
      food,
    });
    console.log(createdMenu);
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
      .json({
        menuId: createdMenu.id,
        category: createdMenu.category,
        food: createdMenu.food,
      });
  }else{
    //deberia ser un 404
    const error = "La categoria ingresada no es valida.";
    return next(error);
  }
};


const updateMenu = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { menuId, category } = req.body;
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
  menu.category = category;
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

  let Menu;
  try {
    Menu = await Menu.findById(menuId).populate("creador");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Menu.",
      500
    );
    return next(error);
  }

  if (!Menu) {
    const error = new HttpError("Could not find Menu for this id.", 404);
    return next(error);
  }

  if (Menu.creador.id !== req.existingMenuData.existingMenuId) {
    const error = new HttpError(
      "You are not allowed to delete this Menu.",
      401
    );
    return next(error);
  }

  // const imagePath = Menu.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await Menu.remove();
    Menu.creador.menus.pull(Menu);
    await Menu.creador.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Menu.",
      500
    );
    return next(error);
  }

  // fs.unlink(imagePath, err => {
  //   console.log(err);
  // });

  res.status(200).json({ message: "Deleted Menu." });
};

exports.getMenuById = getMenuById;
//exports.getmenus = getmenus;
//exports.getmenusByexistingMenuId = getmenusByexistingMenuId;
exports.createMenu = createMenu;
exports.updateMenu = updateMenu;
exports.deleteMenu = deleteMenu;
