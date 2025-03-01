const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
    categoryname: {
        type: String,
        tirm:true,
    }
    
})

module.exports = mongoose.model("Category", CategorySchema)