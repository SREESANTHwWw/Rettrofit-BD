const mongoose = require("mongoose")

const ServicesSchema = new mongoose.Schema({
    servicename: {
        type: String,       
    },
    description: {
        type: String,
    },
    ServicesImages: {
        type:[String]
    },
    underService:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Services",
        default: null
    },
    createdAt: {        
        type: Date,
        default: Date.now
    }
})    
module.exports = mongoose.model("Services", ServicesSchema)
    