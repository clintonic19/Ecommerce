const { handleImageUpload } = require("../../configs/cloudinary");
const Product = require("../../models/products.models");

const imageUpload = async(req, res) =>{
    try {
        // Check if a file is provided
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "No Image file found. Please upload a file"
            });          
        };

        const result = await handleImageUpload(req.file.buffer);

        res.status(200).json({
        success: true,
        result,
        secure_url: result.secure_url,
        public_id: result.public_id,
        });
        // const base64Image = Buffer.from(req.file.buffer).toString('base64'); // Convert the file buffer to a base64 string
        // const url = `data:${req.file.mimetype};base64,${base64Image}`; // Create a data URL for the image
        // const result = await handleImageUpload(url); // Upload the image to Cloudinary
        // res.status(200).json({ 
        //     success: true,
        //     result
        // });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message,
            message: `Unable to upload Image: ${error.message}`
         });
    }
};

// add a new product with image upload functionality
const addNewProduct = async(req, res) =>{
    try {
        const {image, title, description, category, brand, price, salePrice, totalStock} = req.body;

        //Create new product
        const newProduct = new Product({
            image, title, description, category, 
            brand,  price, salePrice, totalStock
        });

        // Save the new product to the database
        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "New product added successfully",
            data: newProduct
        });
    } catch (error) {
        console.log("Unable to add new product", error);
        
        res.status(500).json({ 
            success: false, 
            error: error.message,
            message: `Unable to add new product: ${error.message}`           
         });
    }
};

// fetch all products
const fetchAllProducts = async(req, res) =>{
    try {
        const products = await Product.find({})
        res.status(200).json({
            success: true,
            message: "All products fetched successfully",
            data: products
        });
    } catch (error) {
        console.log("Unable to fetch product", error);      
        res.status(500).json({ 
            success: false, 
            error: error.message,
            message: `Unable to fetch all products: ${error.message}`          
         });
    }
};

//edit a product
const editProduct = async(req, res) =>{
    try {
        const productId = req.params.id;
        
        const {image, title, description, category, brand, price, salePrice, totalStock} = req.body;

        //FIND PRODUCT BY ID AND UPDATE
        const updateProduct = await Product.findByIdAndUpdate(productId, {
            image, title, description, category, brand, price, salePrice, totalStock
        }, {new: true});

        if(updateProduct){
            res.status(200).json({ 
                success: true, 
                message: "Product updated successfully", 
                data: updateProduct 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: `Product with ${productId} Not Found ` 
            });
        }

    } catch (error) {
        console.log("Unable to edit product", error);
        
        res.status(500).json({ 
            success: false, 
            error: error.message,
            message: `Unable to edit product: ${error.message}`          
         });
    }
};

//delete a product
const deleteProduct = async(req, res) =>{
    try {

        const productId = req.params.id

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if(deletedProduct){
            res.status(200).json({ 
                success: true, 
                message: "Product deleted successfully", 
                data: deletedProduct 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: `Product with ${productId} Not Found ` 
            });
        };

    } catch (error) {
        console.log("Unable to delete product", error);       
        res.status(500).json({ 
            success: false, 
            error: error.message,
            message: `Unable to delete product: ${error.message}`           
         });
    };
};

module.exports = { imageUpload, deleteProduct, editProduct, fetchAllProducts, addNewProduct };