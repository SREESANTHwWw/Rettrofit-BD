const express = require("express")
const AdminModel = require("../Model/AdminModel")
const CatchAsyncError = require("../Middlewares/CatchAsyncError")
const sendToken = require("../Utils/jwToken")

const Router = express.Router()


Router.post('/create-admin', CatchAsyncError( async(req,res,next)=>{

    try {
        const {username,password} =req.body

        const admindata ={
            username,
            password,
        }
        const admincreate = await AdminModel.create(admindata)
        res.status(201).json({msg:"admin created success"})
        
    } catch (error) {
        return next( new ErrorHandler(error.message,400))
      
        
    }
}))

Router.post('/login-admin',CatchAsyncError( async(req,res)=>{
    try {
        const {username,password} = req.body

        const user = await AdminModel.findOne({username}).select("+password")
        if(!user){
           return res.status(404).json({ms:"User not Found"})
        }
        const isValidPassword = await user.comparePassword(password)
        if(!isValidPassword){
           return res.status(401).json({msg:"password Error"})
        }
        sendToken(user, 201, res);
    } catch (error) {

   return next(new ErrorHandler(error.message,400))
        
    }
}))

module.exports= Router