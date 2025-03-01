const express = require("express")
const DatabaseConnection = require("./DB/Database")
const adminRouter = require("./Controllers/AdminController")
const CategoryRoute = require("./Controllers/CategoryContoller")
const ProductRoute = require("./Controllers/ProductControllers")
const OrderRoute = require("./Controllers/OrderController")
const ServicesRoute =require("./Controllers/ServicesController")
const cors =require("cors")
const path = require("path")


const app =express()

require("dotenv").config()

app.get(`/`,(req,res)=>{
    res.send(" i m here")

})
app.use(express.json())
app.use(cors())

app.use('/api/v1/', adminRouter)
app.use('/api/v1/', CategoryRoute)
app.use('/api/v1/', ProductRoute)
app.use('/api/v1/', OrderRoute)
app.use('/api/v1/', ServicesRoute)
app.use('/uploads', express.static(path.join(__dirname, "uploads")))


const start = async()=>{
    try {
        await DatabaseConnection()
        app.listen(process.env.PORT,()=>{

            console.log(`Server Running ${process.env.PORT}`)
        })

        
    } catch (error) {
        console.log(error)
        
    }

}
start()

