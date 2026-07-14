const express = require('express');
const https = require('https')


// const  PaystackResponse = {
//   status: string,
//   message: string,
//   data: {
//     access_code: string,
//     authorization_url: string,
//     reference: string
//   }
// };

const getPayment = async(req, res)=>{
try{
    const{email, amount}= req.body;

    if (!email || !amount) {
    return res.status(400).json({
        success: false,
        message: "Email and amount are required",
    });
};

    const response =await fetch(`https://api.paystack.co/transaction/initialize`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        },
        body: JSON.stringify({ 
            email, 
            amount, 
            callback_url: `http://localhost:5173/shop/account` })
    });

    if (!response.ok) {
        throw new Error(`Failed to initiate payment: ${response.statusText}`);
    }

    // const data : PaystackResponse = await response.json();
    const data  = await response.json();

    if (!data.status) {
        return res.status(400).json(data);
    }
    
    console.log("Paystack Payment Initiated:: ", data);
    

    res.status(200).json(data);

}catch(error){
    console.log("Error in payment controller:: ", error);

    return res.status(500).json({
        success: false,
        message: error.message,
    });}

};


const verifyPayment = async(req, res)=>{
try{
    const{reference}= req.params;

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to initiate payment: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);

}catch(error){
    console.log("Error in payment controller:: ", error);
}

};

module.exports = {
    getPayment,
    verifyPayment
}