//WIP Armar food routes
const express = require("express");
const { check } = require("express-validator");

const foodController = require("../controllers/food-controllers");
//const fileUpload = require("../middleware/file-upload");
const router = express.Router();

//router.get("/", foodController.getFoodById);

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
    /*
    check("category").not().isEmpty(),
    check("foodname").not().isEmpty(),
    check("description").not().isEmpty(),
    check("price").not().isEmpty(),
    check("photos").not().isEmpty(),
    check("ingredients").not().isEmpty(),
    check("isCeliac").not().isEmpty(),
    check("isVegan").not().isEmpty(),*/
  ],
  foodController.createFood
);
/*
router.post(
  "/updateFood",
  [
    check("category").not().isEmpty(),
    check("foodname").not().isEmpty(),
    check("description").not().isEmpty(),
    check("price").not().isEmpty(),
    //check("photos").not().isEmpty(),
    check("ingredients").not().isEmpty(),
    check("isCeliac").not().isEmpty(),
    check("isVegan").not().isEmpty(),
  ],
  foodController.updateFood
);

//router.delete('/:pid', foodControllers.delete);
*/
module.exports = router;
