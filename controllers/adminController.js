import cartModel from "../models/cartModel.js";
import foodModel from "../models/foodModel.js"
import userModel from "../models/userModel.js"
import orderModel from '../models/orderModel.js'
import adminModel from "../models/adminModel.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

//token creation
const createtoken = (adminid) => {
    return jwt.sign({ adminid }, process.env.JWT_SECRET,{ expiresIn: '24h' });
  };

//get all users
const userDatas=async(req,res)=>{
    try {
        const allUsers=await userModel.find({})
        if(!allUsers){
            return res.json({success:false,message:"no users"})
        }
        return res.json({success:true,message:"user is found",allUsers})

    } catch (error) {
        
    }
}

//login
const adminLogin=async(req,res)=>{
    try {
        const {username,password}=req.body;
        console.log(username,password)
        if(!username || !password){
            return res.status(403).json({success:false,message:"credentials needed"})
        }
      
        const existadmin=await adminModel.findOne({username});
        if(!existadmin){
            return res.status(403).json({success:false,message:"no data found"})
        }
             const passwordMatch=await bcrypt.compare(password,existadmin.password);
       if(!passwordMatch){
        return res.json({success:false,message:"incorrect password"})
       }
       const token=createtoken(existadmin._id) ;
       console.log(token)
       return res.json({success:true,message:"login success",token})
    } catch (error) {
        console.log(error)
    }
}


//all orders
const orderDatas=async(req,res)=>{
    try {
        const allOrders=await orderModel.find({}).populate('items.itemId')
        if(!allOrders){
            return res.json({success:false,message:"no orders found"})
        }
        return res.json({success:true,message:"orders found",allOrders})

    } catch (error) {
        
    }
}

//all foods list
const foodDatas=async(req,res)=>{
    try {
        const allFoods=await foodModel.find({})
         
       
        if(!allFoods){
            return res.json({success:false,message:"no orders found"})
        }
        return res.json({success:true,message:"food data found",allFoods})

    } catch (error) {
        
    }
}

//update user orders
const updateOrder=async(req,res)=>{
    try {
        const {orderid,status}=req.body;
       const updated= await orderModel.findByIdAndUpdate(orderid,{trackingStatus:Number(status)},{new:true})
       if(updated){
        const orders=await orderModel.find({})
        return res.json({success:true,message:"UPDATED SUCCESFULLY",orders})
       }
    } catch (error) {
        console.log(error)   }
}


//update food data
const updateFood=async(req,res)=>{
    try {
        const {fooddetails,foodid}=req.body;
        const updatedfood=await foodModel.findByIdAndUpdate(foodid,fooddetails,{new:true})
        return res.json({success:true,updatedfood,message:"updated succesfully"})
    } catch (error) {
        
    }
}

//update food availablity
const updatefoodstatus=async(req,res)=>{
    try {
        const {foodid,foodstatus}=req.body;
        console.log(foodstatus)
        const updatedstatus=await foodModel.findByIdAndUpdate(foodid,{
            isAvailable:!foodstatus
        },{new:true})
        return res.json({updatedstatus})
    } catch (error) {
        console.log(error)
    }
}


export {userDatas,orderDatas,foodDatas,adminLogin,updateOrder,updateFood,updatefoodstatus}