const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    
    productname: {
        type: String,
        tirm:true,
    },
    productimages:{
        type:[String]
    },
    description: {
        type: String,
        tirm:true,      
    },
    reviews: {
        type: Number,
        default: 0  
    },
    undercategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", ProductSchema)