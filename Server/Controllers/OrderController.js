const express = require('express');

const  ErrorHandler  = require('../Utils/ErrorHandler');
const OrderModel = require('../Model/Ordermode');
const CatchAsyncError = require('../Middlewares/CatchAsyncError');
const SendMail = require('../Utils/SendMail');
const Router = express.Router();



Router.post(`/place-order`, CatchAsyncError(async (req, res, next) => {

          try {
                 const {name,email,number,address,productname,date,city,pincode} = req.body;
                
                 const orderData = {
                     name,
                     email,
                     number,
                     address,
                     city,
                     pincode,
                     productname,
                     date:Date.now()
                     
                 }
                 const ordercreate = await OrderModel.create(orderData)
               await SendMail(
                    {name,email,number,address,productname,date:Date.now() ,city,pincode}, next)

                 res.status(201).json({msg:"success",ordercreate})

            
          } catch (error) {
            return next(new ErrorHandler(error.message, 400))
            
          }


}));

module.exports = Router;