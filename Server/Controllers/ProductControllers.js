const express = require("express");
const CategoryModel = require("../Model/CategoryModel");
const CatchAsyncError = require("../Middlewares/CatchAsyncError");
const ErrorHandler = require("../Utils/ErrorHandler");
const ProductModel = require("../Model/ProductModel");
const { upload } = require("../Multer");
const Router = express.Router();

Router.post(
  "/create-product",
  upload.array("productimages", 5), // 🔹 Fixed the field name to match frontend
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

      // Store multiple file URLs
      const fileUrls = req.files.map(
        (file) => `http://localhost:5000/uploads/${file.filename}`
      );

      // Create new product
      const productData = {
        productname,
        undercategory,
        description,
        productimages: fileUrls, // 🔹 Store as an array
      };

      const productCreated = await ProductModel.create(productData);
      res
        .status(201)
        .json({ msg: "Product created successfully", product: productCreated });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

Router.get(
  "/get-product",
  CatchAsyncError(async (req, res) => {
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
  CatchAsyncError(async (req, res) => {
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
