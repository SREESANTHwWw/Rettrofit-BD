const mongoose = require("mongoose")

const ServicesSchema = new mongoose.Schema({
    servicename: {
        type: String,       
    },
    description: {
        type: String,
    },
    createdAt: {        
        type: Date,
        default: Date.now
    }
})    
module.exports = mongoose.model("Services", ServicesSchema)
    