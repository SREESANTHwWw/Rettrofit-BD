const mongoose = require("mongoose")

const DatabaseConnection=()=>{
    mongoose.connect(process.env.MONGO_URL).then((res)=>{console.log(`Database Connected ${res.connection.host}`)})

}

module.exports = DatabaseConnection