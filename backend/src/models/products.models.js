const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    image: String,

    title: {
            type: String,
            required: true,
            trim: true,
        },

    description: {
            type: String,
            required: true,
        },

    category: String,

    brand: String,

    price: Number,

    salePrice: Number,

    totalStock: Number

}, { timestamps: true} )

module.exports = mongoose.model('Product', ProductSchema);
