const express = require("express")
const router = express.Router();

//Local imports
const { 
    addItemsToCart,
    fetchCartItems,
    updateCartItems,
    deleteCartItems } = require("../../controllers/shoppingView/cart.controller");

router.post('/addToCart', addItemsToCart);
router.get('/:userId', fetchCartItems);
router.put('/updateCart', updateCartItems);
router.delete('/:userId/:productId', deleteCartItems);

module.exports = router;