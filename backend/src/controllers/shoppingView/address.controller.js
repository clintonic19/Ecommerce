const express = require('express');
const Address = require('../../models/Address.models')

const addAddress = async(req, res) =>{
try{
    const { userId, address, city, state, zipCode, phoneNo, notes } = req.body;

    if(!userId || !address || !city || !state || !phoneNo || !notes){
        return res.status(400).json({ 
            status: false,
            message: "Please provide all required fields"
        });
    };

    const newAddress = new Address({
        userId,
        address,
        city,
        state,
        zipCode,
        phoneNo,
        notes
    });

    await newAddress.save();

    res.status(201).json({ 
        status: true,
        message: "Address added successfully",
        data: newAddress
    });

}catch(err){
    res.status(500).json({ 
        status: false,
        message: "Unable to add address",
        errorStack: err.stack
    });
}
}

const fetchAddress = async(req, res) =>{
try{
    const { userId } = req.params;

    if(!userId){
        return res.status(400).json({ 
            status: false,
            message: "Please provide userId"
        });
    };

    const addresses = await Address.find({ userId });

    res.status(200).json({
        status: true,
        message: "Addresses fetched successfully",
        data: addresses
    });

}catch(err){
    res.status(500).json({ 
        status: false,
        message: "Unable to fetch address",
        errorStack: err.stack
    });
}
}

const editAddress = async(req, res) =>{
try{
    const { userId, addressId } = req.params;

    if(!userId || !addressId){
        return res.status(400).json({ 
            status: false,
            message: "Please provide userId and addressId"
        });
    };

    const updatedAddress = await Address.findOneAndUpdate(
        { _id: addressId, userId },
        req.body,
        { new: true }
    );

    if(!updatedAddress){
        return res.status(404).json({ 
            status: false,
            message: "Address not found"
        });
    };

    res.status(200).json({
        status: true,
        message: "Address updated successfully",
        data: updatedAddress
    });

}catch(err){
    res.status(500).json({ 
        status: false,
        message: "Unable to edit address",
        errorStack: err.stack
    });
}
}

const deleteAddress = async(req, res) =>{
try{
    const { userId, addressId } = req.params;

    if(!userId || !addressId){
        return res.status(400).json({ 
            status: false,
            message: "Please provide userId and addressId"
        });
    };

    const deletedAddress = await Address.findOneAndDelete({ _id: addressId, userId });

    if(!deletedAddress){
        return res.status(404).json({ 
            status: false,
            message: "Address not found"
        });
    };

    res.status(200).json({
        status: true,
        message: "Address deleted successfully",
        data: deletedAddress
    });

}catch(err){
    res.status(500).json({ 
        status: false,
        message: "Unable to delete address",
        errorStack: err.stack
    });
}
}

module.exports = {
    addAddress,
    fetchAddress,
    editAddress,
    deleteAddress
}