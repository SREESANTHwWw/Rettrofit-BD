const mongoose = require('mongoose');

const orderServiceSchema = new mongoose.Schema({


      name:{
          type:String,
          required:true
      },
      email:{
          type:String,
          required:true
      },
      number:{
          type:String,
          required:true
      },
      address:{
          type:String,
          required:true
      },
      city:{
          type:String,
          required:true
      },
      pincode:{
            type:String,
            required:true
      },
      servicename :{
          type:String,
          required:true
      },
      date:{
            type:Date,
            default:Date.now
      },
    
})


module.exports = mongoose.model("ServiceOrder",orderServiceSchema)