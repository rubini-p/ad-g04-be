// WIP Armar controller

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Food = require("../models/food");

/*
const getMenuById = async (req, res, next) => {
    //const menuId = req.params.pid;
    const { menuId } = req.body;
    let existingFood;
    try {
      existingFood = await Menu.findOne({ menuId: menuId })
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find a Menu.",
        500
      );
      return next(error);
    }
  
    if (!existingFood) {
      const error = new HttpError(
        "Could not find Menu for the provided id.",
        404
      );
      return next(error);
    }
  
    res.json({ Menu: existingFood.toObject({ getters: true }) });
  };
*/
const createFood = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422)
      );
    }
    const { category, foodname, description, price, photos, ingredients, isCeliac, isVegan } = req.body;
    const createdFood = new Food({
        category, foodname, description, price, ingredients, isCeliac, isVegan, photos,
      });
      console.log(createdFood);
      try {
        await createdFood.save();
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
          foodId: createdFood.id,
          category: createdFood.category,
          foodname: createdFood.foodname,
          description: createdFood.description,
          price: createdFood.price,
          photos: createdFood.photos,
          ingredients: createdFood.ingredients,
          isCeliac: createdFood.isCeliac,
          isVegan: createdFood.isVegan,
        });
    
  };

  exports.createFood = createFood;