import cartModel from "../models/cartModel.js";
import foodModel from "../models/foodModel.js"
import userModel from "../models/userModel.js"
import orderModel from '../models/orderModel.js'
import adminModel from "../models/adminModel.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const createtoken = (adminid) => {
    return jwt.sign({ adminid }, process.env.JWT_SECRET,{ expiresIn: '24h' });
  };
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


const adminLogin=async(req,res)=>{
    try {
        const {username,password}=req.body;
        console.log(username,password)
        if(!username || !password){
            return res.json({success:false,message:"credentials needed"})
        }
      
        const existadmin=await adminModel.findOne({username});
        if(!existadmin){
            return res.json({success:false,message:"no data found"})
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


export {userDatas,orderDatas,foodDatas,adminLogin,updateOrder}