const express = require("express")
const CategoryModel = require("../Model/CategoryModel")
const CatchAsyncError = require("../Middlewares/CatchAsyncError")
const ErrorHandler = require("../Utils/ErrorHandler")
const upload = require("../Multer")
const Router = express.Router()
const cloudinary = require("cloudinary").v2;

Router.post('/create-category', upload.single("categoryimage"), CatchAsyncError(async (req, res, next) => {
    try {
      const { categoryname, hasSubcategory,subcategory } = req.body;
  
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }
  
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      // Get the secure URL of the uploaded image
      const fileUrl = result.secure_url;
  
      // Prepare the category data
      const categoryData = {
        categoryname,
        hasSubcategory,
        categoryimage: fileUrl,
        subcategory
      };
  
      // Create the category in the database
      const categoryCreate = await CategoryModel.create(categoryData);
  
      // Respond with success message
      res.status(201).json({
        msg: "Category created successfully",
        categoryCreate,
      });
    } catch (error) {
      // Pass error to the global error handler
      return next(new ErrorHandler(error.message, 400));
    }
  }));


  //get methodss



Router.get('/get-category',CatchAsyncError( async(req,res)=>{
    try {
        const categoryget = await CategoryModel.find()
        res.status(200).json({msg:"category get success",categoryget})
        
    } catch (error) {
        return next( new ErrorHandler(error.message,400))   
    }
}))

Router.get('/get-one-category/:id',CatchAsyncError( async(req,res)=>{
    try {
          const {id} =req.params
        const categoryget = await CategoryModel.find({
          subcategory:id
        })
        res.status(200).json({msg:"category get success",categoryget})
        
    } catch (error) {
        return next( new ErrorHandler(error.message,400))   
    }
}))


Router.delete('/delete-category/:id',CatchAsyncError( async(req,res)=>{
    try {
        const categorydelete = await CategoryModel.findByIdAndDelete(req.params.id)
        res.status(200).json({msg:"category delete success",categorydelete})
        
    } catch (error) {
        return next( new ErrorHandler(error.message,400))   
    }
})) 




module.exports = Router