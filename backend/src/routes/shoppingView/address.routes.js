const express = require("express")
const router = express.Router();

//Local imports
const { 
    addAddress,
    fetchAddress,
    editAddress,
    deleteAddress } = require("../../controllers/shoppingView/address.controller");

router.post('/add-address', addAddress);
router.get('/fetch-address/:userId', fetchAddress);
router.put('/edit-address/:userId/:addressId', editAddress);
router.delete('/delete-address/:userId/:addressId', deleteAddress);

module.exports = router;