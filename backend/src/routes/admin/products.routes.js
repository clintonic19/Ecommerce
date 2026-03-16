const express = require("express")
const router = express.Router();

//Local imports
const { imageUpload, addNewProduct, fetchAllProducts, editProduct, deleteProduct} = require("../../controllers/admin/products.controller");
const{ upload } = require("../../configs/cloudinary");

router.post('/upload-image',  upload.single("file"), imageUpload );
router.post('/add-product', addNewProduct);
router.get('/', fetchAllProducts);
router.put('/edit-product/:id', editProduct);
router.delete('/delete-product/:id', deleteProduct);

module.exports = router;
