const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
    categoryname: {
        type: String,
        trim:true,
    },
    categoryimage: {
        type:String
    },

    hasSubcategory: {
        type: Boolean,
    },
    subcategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        default:null
    }
    
})

module.exports = mongoose.model("Category", CategorySchema)