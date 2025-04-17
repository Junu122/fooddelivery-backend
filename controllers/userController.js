import foodModel from "../models/foodModel.js"
import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const createtoken = (userid) => {
    return jwt.sign({ userid }, process.env.JWT_SECRET,{ expiresIn: '1h' });
  };
  
const foodLists=async(req,res)=>{
    try {
        const foodlists=await foodModel.find({})
        res.json({success:true,data:foodlists})
    } catch (error) {
        return error
    }
}

const userLogin=async(req,res)=>{
  const  {email,password}=req.body;
  console.log(email,password)
  try {
    if(!email || !password){
        return res.status(404).json({success:false,message:"data incomplete"})
    }
    const existUser=await userModel.findOne({email})
    if(!existUser){
        return res.status(402).json({success:false,emailMessage:"no user found",usererror:true})
    }
    const passwordMatch=await bcrypt.compare(password,existUser.password);
    if(!passwordMatch){
        return res.status(404).json({success:false,passwordMessage:"password is incorrect",passerror:true})
    }
    const token=createtoken(existUser._id);
    return res.status(200).json({ success: true, message: "login success", token });
  } catch (error) {
    return error
  }

}


const userRegister=async(req,res)=>{
  const {name,email,password}=req.body;
   console.log(name,email,password)
  try {
    if(!name || !email || !password){
      return res.status(402).json({success:false,message:"data incomplete"})
    }
    const existUser=await userModel.findOne({email});
    if(existUser){
      return res.status(402).json({success:false,emailMessage:"email exist please login"})
    }
    const hashedPassword=await bcrypt.hash(password,10)
    if(!hashedPassword){
      return res.status(402).json({success:false,passwordMessage:"hashing error"})
    }

    const newUser=new userModel({
      name,
      email,
      password:hashedPassword

    })
    await newUser.save()
    const token=createtoken(newUser._id);

    return res.status(200).json({success:true,message:"user created succesfully",token})
  } catch (error) {
    console.log(error)
    return error.response
  }
}

export {foodLists,userLogin,userRegister}