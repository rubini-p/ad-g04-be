// WIP Armar controller

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Food = require("../models/food");

const getFoodByfood = async (req, res, next) => {
  const { foodId } = req.body;
  let existingFood;
  try {
    console.log("foodId", foodId)
    existingFood = await Food.find({_id: foodId});
    console.log("existingFood", existingFood)
    //({ foodId: foodId })
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
  //res.json({ Food: existingFood.toObject({ getters: true }) });
};

const createFood = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422)
      );
    }
    const { category, foodname, description, price, photos, ingredients, isCeliac, isVegan, foodId } = req.body;
    const createdFood = new Food({
        category, foodname, description, price, ingredients, isCeliac, isVegan, photos, foodId,
      });
      console.log(createdFood);
      try {
        await createdFood.save();
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
          ingredients: createdFood.ingredients,
          isCeliac: createdFood.isCeliac,
          isVegan: createdFood.isVegan,
          foodId: createdFood.foodId,
        });
    
};

const updateFood = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  console.log("hola")
  const { foodId, category, foodname, description, price, photos, ingredients, isCeliac, isVegan } = req.body;
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
  //de esta manera estamos pisando la foto
  food.photos = photos;
  food.ingredients = ingredients;
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

  // const imagePath = food.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await food.remove();
    //food.creador.foods.pull(food);
    //await food.creador.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete food.",
      500
    );
    return next(error);
  }

  // fs.unlink(imagePath, err => {
  //   console.log(err);
  // });

  res.status(200).json({ message: "Deleted food." });
};

exports.createFood = createFood;
exports.getFoodByfood = getFoodByfood; 
exports.updateFood = updateFood;
exports.deleteFood = deleteFood;