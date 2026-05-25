const Product = require('../../models/products.models');

// Filter products based on query parameters (e.g., category, price range, etc.)
const filterProducts = async(req, res) =>{
    try {
        const products = await Product.find({})
        
        res.status(200).json({ 
            message: 'Products filtered successfully', 
            data: products });
    } catch (error) {
        res.status(500).json({ message: 'Error filtering products', error: error.message });
    }
};



const getProducts = async(req, res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: 'Error filtering products', error: error.message });
    }
};

module.exports = { filterProducts, getProducts };