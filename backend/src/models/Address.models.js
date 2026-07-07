const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  
  city: {
    type: String,
    required: true
  },

   phoneNo: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },

  zipCode: {
    type: String,
  },

   notes: {
    type: String,
  },

}, { timestamps: true} )

module.exports = mongoose.model('Address', AddressSchema);
