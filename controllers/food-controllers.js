const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Food = require("../models/food");
const Menu = require("../models/menu");
const Restaurant = require("../models/restaurant");

const restaurantController = require('../controllers/restaurant-controllers');


const getFoodByMenuByCategory = async (req, res, next) => {
  const { menuId, category } = req.body;
  let existingFood;
  try {
    existingFood = await Food.find({menuId: menuId, category: category});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a food.",
      500
    );
    return next(error);
  }

  if (!existingFood) {
    const error = new HttpError(
      "Could not find food for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ existingFood: existingFood.map(food => food.toObject({ getters: true })) });
};
/*
const getFoodByMenu = async (menuId) => {
  console.log("entre al get");
  console.log(menuId)
  //const { menuId } = req.body;
  //console.log("lo que tengo en el menuid", menuId)
  let existingMenu;
  try {
    existingMenu = await Menu.findById(menuId);
    //console.log(existingMenu)
    //console.log("la food que encontre", existingFood)
    const avg = await Food.aggregate(
      [
        { $match : { menuId: existingMenu._id } },
        {$group:{_id: null,
            avg: { $avg: "$price" }
          }
        }
      ]
    )
    console.log("avg",avg)
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a food.",
      500
    );
    console.log("falle 1")
    //return error;
  }

  if (!existingFood) {
    const error = new HttpError(
      "Could not find food for the provided id.",
      404
    );
    console.log("falle2")
    //return error;
  }
  //return 0;
  //res.json({ existingFood: existingFood.map(food => food.toObject({ getters: true })) });
};*/

const createFood = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422)
      );
    }
    const { category, foodname, description, price, photos, isCeliac, isVegan, menuId } = req.body;
    const createdFood = new Food({
        category, foodname, description, price, isCeliac, isVegan, photos, menuId,
      });
      try {
        await createdFood.save();
        //await getFoodByMenu(menuId);
        try {
          existingMenu = await Menu.findById(menuId);
          //console.log(existingMenu)
          //console.log("la food que encontre", existingFood)
          const avg = await Food.aggregate(
            [
              { $match : { menuId: existingMenu._id } },
              {$group:{_id: null,
                  avg: { $avg: "$price" }
                }
              }
            ]
          )
          let avgFinal;
          if(avg[0].avg < 800){
            avgFinal = 1;  
          }else if(avg[0].avg < 1600 ){
              avgFinal = 2; 
            }else if(avg[0].avg < 2400 ){
              avgFinal = 3; 
              }else{
                avgFinal = 4; 
              }
          let aver = await Restaurant.findOneAndUpdate( {menu : existingMenu._id},{priceRange: avgFinal} );
        } catch (err) {
          const error = new HttpError(
            "Something went wrong, could not find a food.",
            500
          );
        }
      } catch (err) {
        const error = new HttpError(
          "Save failed, please try again later.",
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
          isCeliac: createdFood.isCeliac,
          isVegan: createdFood.isVegan,
          menuId: createdFood.menuId,
        });
    
};

const updateFood = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { foodId, category, foodname, description, price, photos, isCeliac, isVegan } = req.body;
  let food;
  try {
    food = await Food.findById(foodId);
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not update food.',
        500
    );
    return next(error);
  }
  food.category = category;
  food.foodname = foodname;
  food.description = description;
  food.price = price;
  food.photos = photos;
  food.isCeliac = isCeliac;
  food.isVegan = isVegan;

  try {
    await food.save();
  } catch (err) {
    const error = new HttpError(
        'Something went wrong, could not update food.',
        500
    );
    return next(error);
  }

  res.status(200).json({ food: food.toObject({ getters: true }) });
};

const deleteFood = async (req, res, next) => {
  const foodId = req.params.pid;
  let food;
  try {
    food = await Food.findById(foodId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete food.",
      500
    );
    return next(error);
  }

  if (!food) {
    const error = new HttpError("Could not find food for this id.", 404);
    return next(error);
  }

  try {
    await food.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete food.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted food." });
};

exports.createFood = createFood;
exports.getFoodByMenuByCategory = getFoodByMenuByCategory; 
exports.updateFood = updateFood;
exports.deleteFood = deleteFood;