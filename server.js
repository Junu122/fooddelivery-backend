import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import "dotenv/config"
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";


const app=express()
const port =process.env.PORT

//middlewares

app.use(express.json());
app.use(cors())



app.use(express.urlencoded({extended:false}))

app.set('view engine', 'ejs')


//database connection
connectDB()


//api end point

app.use('/api/auth',userRouter)
app.use('/api/admin',adminRouter)



app.listen(port,()=>{
    console.log("server is running on port 4000")
})

