const Product = require('../../models/products.models');

// Filter products based on query parameters (e.g., category, price range, etc.)
const filterProducts = async(req, res) =>{
    try {

        const {category =[], brand = [], sortBy = 'price-lowtohigh'} = req.query; // Get the filter parameters from the query string

        let filter = {};
        // Build the filter object based on the provided query parameters
        if (category.length) {
            filter.category = { $in: category.split(',') }; // Filter by category
        }

          if (brand.length) {
            filter.brand = { $in: brand.split(',') }; // Filter by brand
        }

        // Determine the sort order based on the sortBy parameter
        let sort = {};
        switch (sortBy) {
            case 'price-lowtohigh':
                sort.price = 1; // Sort by price in ascending order
                break;
            case 'price-hightolow':
                sort.price = -1; // Sort by price in descending order
                break;
            case 'title-atoz':
                sort.title = 1; // Sort by title in ascending order
                break;
            case 'title-ztoa':
                sort.title = -1; // Sort by title in descending order
                break;
            default:
                sort.price = 1; // Default to ascending order if no valid sortBy is provided
                break;
        }

        const products = await Product.find({...filter}).sort(sort); // Fetch the filtered and sorted products from the database
        res.status(200).json({ 
            message: 'Products filtered successfully', 
            data: products 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error filtering products', 
            error: error.message 
        });
    }
};


const getProducts = async(req, res) =>{
    try {
        const {id} = req.params;
        const products = await Product.findById(id); // Fetch all products from the database
        if(!products) {
            return res.status(404).json({ 
                success: false,
                message: 'No products found', 
            });
        }

        res.status(200).json({ 
            message: 'Products fetched successfully', 
            data: products 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching products', 
            error: error.message 
        });
    }
};

module.exports = { filterProducts, getProducts };