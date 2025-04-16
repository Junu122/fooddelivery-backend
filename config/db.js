import mongoose from "mongoose";

export const connectDB=async()=>{
  await  mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("databas connected")
  }).catch((error)=>{
    console.log(error,"error occured")
  })
} 