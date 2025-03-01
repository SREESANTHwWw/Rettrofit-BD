const express = require('express');
const CatchAsyncError = require('../Middlewares/CatchAsyncError');
const ErrorHandler = require('../Utils/ErrorHandler');
const ServicesModel = require('../Model/ServicesModel');

const Router = express.Router();



Router.post('/create-service',CatchAsyncError(async(req,res,next)=>{
    try{
        const {servicename,description} = req.body;

        // Check if service already exists
        const serviceExists = await ServicesModel.findOne({servicename});
        if(serviceExists){
            return res.status(400).json({message:"Service name already exists"});
        }

        // Create new service
        const serviceData = {
            servicename,
            description,
        }

        const serviceCreated = await ServicesModel.create(serviceData);
        res.status(201).json({msg:"Service created successfully",service:serviceCreated});
    }catch(error){
        return next(new ErrorHandler(error.message,400));
    }
}))

Router.get('/get-service',CatchAsyncError(async(req,res,next)=>{    
    try{
        const serviceget = await ServicesModel.find();
        res.status(200).json({msg:"Service get success",serviceget});
    }catch(error){
        return next(new ErrorHandler(error.message,400));
    }
}))

module.exports = Router;