const express = require("express")
const router = express.Router();

//Local imports
const { filterProducts } = require("../../controllers/shoppingView/products.controller");

router.get('/filter', filterProducts);

module.exports = router;
