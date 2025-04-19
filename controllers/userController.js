import cartModel from "../models/cartModel.js";
import foodModel from "../models/foodModel.js"
import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const createtoken = (userid) => {
    return jwt.sign({ userid }, process.env.JWT_SECRET,{ expiresIn: '10m' });
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


const addToCart=async(req,res)=>{
  const {itemId}=req.body;
  const userId = req.userid;
  try {
    const existcart=await cartModel.findOne({userId});
   console.log(existcart)
    if(!existcart ){
      const newItem=await new cartModel({
     userId:userId,
     items:[{itemId,quantity:1}]
      })
     
      await newItem.save();
      return res.json({success:true,message :"added succesfully"})
    }else{
     const existitem=existcart.items.find(item=>item.itemId.toString()===itemId.toString())
     if(existitem){
      existitem.quantity+=1
     }else{
      existcart.items.push({ itemId, quantity: 1 });
     }
     await existcart.save()
     return res.json({success:true,message :"added succesfully"})
    }
  } catch (error) {
    console.log(error)
  }
}

const removeFromCart=async(req,res)=>{
  const {itemId}=req.body;
  const userId = req.userid;
  try {
    const existcart=await cartModel.findOne({userId});
    const existitem=existcart.items.find(item=>item.itemId.toString()===itemId.toString())
     if(existitem.quantity===1){
      existcart.items = existcart.items.filter(item => item.itemId.toString() !== itemId.toString());
      await existcart.save()
      return res.json({success:true,message :"removed succesfully"})
     }else if(existitem.quantity>1){
      existitem.quantity-=1;
      await existcart.save()
      return res.json({success:true,message :"removed succesfully"})
     }else{
      existcart.items.push({ itemId, quantity: 1 });
      await existitem.save()
     }
  
     
      
  } catch (error) {
    
  }
}

const usercart=async(req,res)=>{
  console.log("reached here")
  const userId=req.userid;
  try {
    const usercart=await cartModel.findOne({userId});
    if(!usercart){
      return res.status(402).json({success:false,message:"no cart available"})
    }
    return res.json({success:true,message:"cart available",usercart})
  } catch (error) {
    
  }

}

export {foodLists,userLogin,userRegister,addToCart,removeFromCart,usercart}