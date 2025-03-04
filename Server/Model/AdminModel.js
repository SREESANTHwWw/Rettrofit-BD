const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const AdminSchema = new mongoose.Schema({

    username:{
        type: String,
        required:[true ,'Must Provide a Name'],
        trim:true,
        maxlength:[20 ,'More than 20 character']
    },
    password:{
        type:String,
        required:[true ,"Must Provide A Password"],
        minlength:[8 , "less than 8 character"],
        select:false
    },
    role:{
      default:"admin",
      type:String
    }
    
})
AdminSchema.pre("save", async function(next){
    if(!this.isModified("password")){
      next()
      
    }
    this.password = await bcrypt.hash(this.password, 10)
  } )
  AdminSchema.methods.getJwtToken=function(){
    return jwt.sign({
      id:this._id,
      username:this.username,
      role:this.role
    },process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES,
    });
    }

  AdminSchema.methods.comparePassword= async function (enterpassword) {
    return await  bcrypt.compare(enterpassword, this.password )
} 

module.exports = mongoose.model("Admin ",AdminSchema)