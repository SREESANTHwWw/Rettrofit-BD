const express = require('express');

const  ErrorHandler  = require('../Utils/ErrorHandler');
const OrderModel = require('../Model/Ordermodel');
const CatchAsyncError = require('../Middlewares/CatchAsyncError');
const SendMail = require('../Utils/SendMail');
const SendServiceMail = require('../Utils/SendServiceMail');
const ServiceOrderModel = require('../Model/ServiceOrderModel');
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

Router.get(`/get-product-order`,CatchAsyncError(async(req,res)=>{
    try {
        const orderget = await OrderModel.find()
        res.status(200).json({msg:"success",orderget})        
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
    }))

Router.post('/place-service-order',CatchAsyncError(async(req,res,next)=>{
    try {
        const {name,email,number,address,servicename,date,city,pincode} = req.body;
        const orderData = {
            name,
            email,
            number,
            address,
            city,
            pincode,
            servicename ,
            date:Date.now()
        }
        const ordercreate = await ServiceOrderModel.create(orderData)
        await SendServiceMail(
            {name,email,number,address,servicename,date:Date.now() ,city,pincode}, next)
        res.status(201).json({msg:"success",ordercreate})
      
    } catch (error) {
       return next(new ErrorHandler(error.message,400))
    }
}))

Router.get('/get-service-order',CatchAsyncError(async(req,res)=>{
    try {
        const orderget = await ServiceOrderModel.find()
        res.status(200).json({msg:"success",orderget})        
    } catch (error) {
        return next(new ErrorHandler(error.message,400))
    }
}))

module.exports = Router;