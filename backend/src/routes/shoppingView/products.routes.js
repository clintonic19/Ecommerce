const express = require("express")
const router = express.Router();

//Local imports
const { filterProducts, getProducts } = require("../../controllers/shoppingView/products.controller");

router.get('/filter', filterProducts);
router.get('/:id', getProducts);

module.exports = router;
