const express = require("express");
const { check } = require("express-validator");

const foodController = require("../controllers/food-controllers");
const router = express.Router();

router.get('/getFoodByMenu', foodController.getFoodByMenu);

router.post(
  "/createFood",
  [
    check("category"),
    check("foodname"),
    check("description"),
    check("price"),
    check("photos"),
    check("ingredients"),
    check("isCeliac"),
    check("isVegan"),
    check("menuId").not().isEmpty(),
  ],
  foodController.createFood
);

router.post(
  "/updateFood",
  [
    check("foodId").not().isEmpty(),
    check("category"),
    check("foodname"),
    check("description"),
    check("price"),
    check("photos"),
    check("ingredients"),
    check("isCeliac"),
    check("isVegan"),
  ],
  foodController.updateFood
);

router.delete('/:pid', foodController.deleteFood);

module.exports = router;
