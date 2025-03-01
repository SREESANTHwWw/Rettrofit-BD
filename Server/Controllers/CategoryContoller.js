const express = require("express")
const CategoryModel = require("../Model/CategoryModel")
const CatchAsyncError = require("../Middlewares/CatchAsyncError")
const ErrorHandler = require("../Utils/ErrorHandler")
const Router = express.Router()

Router.post('/create-category', CatchAsyncError( async(req,res,next)=>{

    try {
        const {categoryname} =req.body

        const categorydata ={   
            categoryname,
        }    
        const categorycreate = await CategoryModel.create(categorydata)
        res.status(201).json({msg:"category created success"})
        
    } catch (error) {
        return next( new ErrorHandler(error.message,400))   
    }
}))

Router.get('/get-category',CatchAsyncError( async(req,res)=>{
    try {
        const categoryget = await CategoryModel.find()
        res.status(200).json({msg:"category get success",categoryget})
        
    } catch (error) {
        return next( new ErrorHandler(error.message,400))   
    }
}))

module.exports = Router