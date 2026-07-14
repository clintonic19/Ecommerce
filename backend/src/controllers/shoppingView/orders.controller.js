const express = require("express");
const Order = require("../../models/Order.models")
const PayStack = require("../payments/payment.controller");

// const createOrder = async(req, res) =>{
//     try {
//         const{
//             userId, 
//             cartItems, 
//             addressInfo,
//             orderStatus,
//             paymentMethod,
//             paymentStatus,
//             totalAmount,
//             orderDate,
//             orderUpdateDate,
//             paymentId,
//             payerId,
//             paymentReference,
//         }=req.body;

//         const paymentJson = {
//             intent: 'sale',
//             payer : {
//                 payment_method: "payStack"
//              },
             
//             redirect_url:{
//                 return_url: "http://localhost:5173/shop/paystack-return" ,
//                 cancel_url: "http://localhost:5173/shop/paystack-cancel"
//             },

//             transactions:[{
//                 item_list : {
//                     items : cartItems?.map(item =>({
//                         name : item.title,
//                         sku  : item.productId,
//                         price : item.price.toFix(2),
//                         currency : "NGN",
//                         quantity : item.quantity
//                     }))
//                 },

//                 amount: {
//                     currency : "NGN",
//                     total : totalAmount.toFix(2)
//                 },

//                 description: "description"
//             }]
//         }
        
//         PayStack.getPayment.create(paymentJson, async(error, paymentInfo)=>{
//             if(error){
//                 console.log("create payment:: ", error);
                
//                 return res.status(500).json({
//                     success: false,
//                     message : "Error occured during Processing payStack Payment"
//                 })
//             }else{
//                 const newOrder = new Order({
//                     userId, 
//                     cartItems, 
//                     addressInfo,
//                     orderStatus,
//                     paymentMethod,
//                     paymentStatus,
//                     totalAmount,
//                     orderDate,
//                     orderUpdateDate,
//                     paymentId,
//                     payerId,
//                     paymentReference,
//                 })

//                 await newOrder.save();
//                 const approveUrl = paymentInfo.links.find(link => link.rel === "approve_url").href

//         res.status(201).json({
//             success: true,
//             approveUrl,
//             orderId: newOrder._id,
//         });
//             }
//         })

//     } catch (error) {
//         res.status(500).json({ 
//             success: false,
//             message: error.message 
//         });
        
//     }
// }

const createOrder = async (req, res) => {
  try {
    const {
        userId,
        email,
        cartItems ,
        addressInfo,
        totalAmount,
    } = req.body;

    const response = await fetch(
     `https://api.paystack.co/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: totalAmount * 100,
          callback_url: "http://localhost:5173/shop/account",
        }),
      }
    );

    const paymentData = await response.json();

    if (!paymentData.status) {
      return res.status(400).json({
        success: false,
        message: "unable to process payment status",
        status: paymentData
    });
    }

    const CreateNewOrder = await Order.create({
      userId,
      cartItems,
      addressInfo,

      totalAmount,

      paymentMethod: "Paystack",

      paymentStatus: "Pending",

      orderStatus: "Pending",

      paymentReference: paymentData.data.reference,

      orderDate: new Date(),

      orderUpdateDate: new Date(),
    });

    return res.status(201).json({
      success: true,
      authorizationUrl: paymentData.data.authorization_url,
      reference: paymentData.data.reference,
      orderId: CreateNewOrder._id,
    });
  } catch (error) {
    console.log("Unable to process payment:" , error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const PaymentOrder = async(req, res) =>{
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    createOrder,
    PaymentOrder
}
