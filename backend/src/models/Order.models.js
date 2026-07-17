const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId: String,
    cartId: String,
    
    cartItems:[{
        productId: String,
        title: String,
        image: String,
        price: String,
        quantity: String,
    }],

     addressInfo: {
    addressId: String,
    address: String,
    city: String,
    zipCode: String,
    phoneNo: String,
    notes: String,
  },

  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
//   paymentId: String,
//   payerId: String,
   // Add this
  paymentReference: String,
})

module.exports = mongoose.model('Order', OrderSchema);