const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    
    productname: {
        type: String,
        trim:true,
    },
    productimages:{
        type:[String]
    },
    description: {
        type: String,
        tirm:true,      
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
},{ timestamps: true })

module.exports = mongoose.model("Product", ProductSchema)