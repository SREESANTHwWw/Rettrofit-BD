const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({


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
      productname:{
          type:String,
          required:true
      },
      date:{
            type:Date,
            default:Date.now
      },
    
})
const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
    });
};

module.exports = mongoose.model("Order",orderSchema)