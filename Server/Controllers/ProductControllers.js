const express = require("express");
const CategoryModel = require("../Model/CategoryModel");
const CatchAsyncError = require("../Middlewares/CatchAsyncError");
const ErrorHandler = require("../Utils/ErrorHandler");
const ProductModel = require("../Model/ProductModel");
const  upload  = require("../Multer");
const Router = express.Router();
const cloudinary = require("cloudinary").v2;

Router.post(
  "/create-product",
  upload.array("productimages", 5), // s
  async (req, res, next) => {
    try {
      const { productname, undercategory, description } = req.body;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Check if product already exists
      const productExists = await ProductModel.findOne({ productname });
      if (productExists) {
        return res.status(400).json({ message: "Product name already exists" });
      }

      // 🔹 Upload each image to Cloudinary and store URLs
      const fileUrls = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products", // Cloudinary folder
          });
          return result.secure_url; // Return Cloudinary URL
        })
      );

      // Create new product
      const productData = {
        productname,
        undercategory,
        description,
        productimages: fileUrls, // 
      };

      const productCreated = await ProductModel.create(productData);

      res.status(201).json({
        msg: "Product created successfully",
        product: productCreated,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

Router.get(
  "/get-product",
  CatchAsyncError(async (req, res,next) => {
    try {
      const productget = await ProductModel.find();
      res.status(200).json({ msg: "product get success", productget });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
Router.get(
  "/get-One-product/:id",
  CatchAsyncError(async (req, res,next) => {
    try {
      const productget = await ProductModel.find({ _id: req.params.id });
      res.status(200).json({ msg: "product get success", productget });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
Router.get(
  "/get-category-product/:id",
  CatchAsyncError(async (req, res) => {
    try {
      const productget = await ProductModel.find({
        undercategory: req.params.id,
      });
      res.status(200).json({ msg: "product get success", productget });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

Router.get('/get-related-product/:category_id/:product_id', CatchAsyncError(async (req, res,next) => {  
  try {
    const {category_id , product_id} = req.params

    const relatedProducts = await ProductModel.find({
      undercategory: category_id,
      _id: { $ne: product_id }, // Exclude the current product
    }).limit(6);

    res.status(200).json({ msg: "product get success", relatedProducts });
    
  } catch (error) {
     return next(new ErrorHandler(error.message,400))
  }
    
}))
Router.patch(
  "/update-product/:id",
  upload.array("productimages", 5),
  CatchAsyncError(async (req, res, next) => {
    try {
      const { productname, description, selectedIndex } = req.body;

      // Find the existing product
      const existingProduct = await ProductModel.findById(req.params.id);
      if (!existingProduct) {
        return next(new ErrorHandler("Product not found", 404));
      }

      const updateproduct = {};
      if (productname) updateproduct.productname = productname;
      if (description) updateproduct.description = description;

      // Handle updating a specific image in the array
      if (req.files && req.files.length > 0) {
        const fileUrls = req.files.map(
          (file) => `http://localhost:5000/uploads/${file.filename}`
        );

        if (selectedIndex !== undefined) {
          // Convert selectedIndex to number if it's a string (from FormData)
          const index = Number(selectedIndex);

          if (index >= 0 && index < existingProduct.productimages.length) {
            // Replace the image at the selected index
            existingProduct.productimages[index] = fileUrls[0]; 
          }
        } else {
          // If no specific index is given, replace all images
          existingProduct.productimages = fileUrls;
        }

        updateproduct.productimages = existingProduct.productimages;
      }

      // Update product
      const productupdate = await ProductModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateproduct },
        { new: true, runValidators: true }
      );

      res.status(200).json({ msg: "Product updated successfully", productupdate });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
Router.delete(
  "/delete-product/:id",
  CatchAsyncError(async (req, res) => {
    try {
      const productdelete = await ProductModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "Product deleted successfully", productdelete });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));    
    }
  })
);

module.exports = Router;
