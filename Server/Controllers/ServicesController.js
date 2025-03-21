const express = require('express');
const CatchAsyncError = require('../Middlewares/CatchAsyncError');
const ErrorHandler = require('../Utils/ErrorHandler');
const ServicesModel = require('../Model/ServicesModel');
const upload = require('../Multer');
const cloudinary = require("cloudinary").v2;
const Router = express.Router();
const mongoose = require("mongoose");


Router.post('/create-service',upload.array("ServicesImages",5), CatchAsyncError(async(req,res,next)=>{
    try{
        let {servicename,description,underService,hasSubService} = req.body;

        // Check if service already exists
        const serviceExists = await ServicesModel.findOne({servicename});
        if(serviceExists){
            return res.status(400).json({message:"Service name already exists"});
        }

 const fileUrls = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "Services", // Cloudinary folder
          });
          return result.secure_url; // Return Cloudinary URL
        })
      );
      if (underService === "" || !mongoose.Types.ObjectId.isValid(underService)) {
        underService = null; // Set to null if empty
      }
        // Create new service
        const serviceData = {
            servicename,
            description,
            underService,
            hasSubService,
            ServicesImages:fileUrls
        }

        const serviceCreated = await ServicesModel.create(serviceData);
        res.status(201).json({msg:"Service created successfully",serviceCreated});
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

Router.get('/get-underService/:id',CatchAsyncError(async(req,res,next)=>{    
    try{
        const serviceget = await ServicesModel.find({underService:req.params.id});
        res.status(200).json({msg:"Service get success",serviceget});
    }catch(error){
        return next(new ErrorHandler(error.message,400));
    }
}))
Router.get(`/get-one-service/:id`,CatchAsyncError(async(req,res,next)=>{    
    try{    
        const serviceget = await ServicesModel.find({_id:req.params.id});
        res.status(200).json({msg:"Service get success",serviceget});
    }catch(error){
        return next(new ErrorHandler(error.message,400));
    }    
}))
Router.delete('/delete-service/:id',CatchAsyncError(async(req,res,next)=>{
    try {
        const ServiceDlt = await ServicesModel.findByIdAndDelete(req.params.id)
        res.status(200).json({msg:"Service deleted successfully",ServiceDlt});
        
    } catch (error) {
        return next( new ErrorHandler(error.message,400))
        
    }
}))

Router.get(`/get-related-service/:mainService_id/:service_id`,CatchAsyncError(async(req,res,next)=>{
    try {
        const {mainService_id , service_id} = req.params
        const relatedServices = await ServicesModel.find({
            underService: mainService_id,
          _id: { $ne: service_id }, // Exclude the current service
        }).limit(6);
        if(!relatedServices){
            return next(new ErrorHandler("Services not found",400))
        }
        res.status(200).json({ msg: "Service get success", relatedServices });
        
    } catch (error) {
         return next (new ErrorHandler(error.message,400))
    }
}))

module.exports = Router;