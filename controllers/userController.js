import Razorpay from "razorpay";
import cartModel from "../models/cartModel.js";
import foodModel from "../models/foodModel.js"
import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from 'crypto'
import orderModel from "../models/orderModel.js";


//function to create token
const createtoken = (userid) => {
    return jwt.sign({ userid }, process.env.JWT_SECRET,{ expiresIn: '24h' });
  };

  //razorpay
  const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_TEST_KEY,
    key_secret:process.env.RAZORPAY_TESTKEY_SECRET
  })

//all available food
const foodLists=async(req,res)=>{
    try {
        const foodlists=await foodModel.find({isAvailable:true})
        
        const todayspecial = await foodModel.find({
          name: { $in: ["Chicken Salad", "Veg Rolls", "Grilled Sandwich","Tomato Pasta","Cooked Noodles","Rice Zucchini"] }
      });
        res.json({success:true,data:foodlists,todayspecial})
    } catch (error) {
        return error
    }
}

//login user
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

//register user
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


//add to cart
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
      return res.json({success:true,message :"added succesfully",newItem})
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


//remove from cart
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

//cart items
const usercart=async(req,res)=>{
  console.log("reached here")
  const userId=req.userid;
  try {
    const usercart=await cartModel.findOne({userId}).populate('items.itemId');
    if(!usercart){
      return res.status(402).json({success:false,message:"no cart available"})
    }
    return res.json({success:true,message:"cart available",usercart})
  } catch (error) {
    
  }

}


//creating user order
const createOrder=async(req,res)=>{
  
  try {
    const { amount, currency, receipt, notes } = req.body;
    const options = {
      amount: amount*100 , 
      currency: currency || 'INR',
      receipt: receipt || 'receipt_order_' + Date.now(),
      notes: notes || {}
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send('Error creating order');
    }

    res.json({succes:true,order});
  } catch (error) {
    console.log(error)
  }
}

//verify razorpay payment
const verifyPayment=async(req,res)=>{
  try {
    const {paymentData,orderdetails,Data}=req.body;

 const generated_signature = crypto
 .createHmac('sha256', process.env.RAZORPAY_TESTKEY_SECRET)
 .update(paymentData.razorpay_order_id + '|' + paymentData.razorpay_payment_id)
 .digest('hex');

if(generated_signature === paymentData.razorpay_signature){
  const items = orderdetails?.notes?.items?.map(item => {
    return {
      itemId: item.itemId,
      quantity: item.quantity
    };
  });
   const orderdata=new orderModel({
     orderId:orderdetails.id,
     totalAmount:orderdetails.amount/100,
     items:items,
     userId:orderdetails?.notes.userId,
     paymentStatus:"paid",
     trackingStatus:1
   })
 await orderdata.save()
 const userId=orderdetails.notes.userId;
 const usercart=await cartModel.findOneAndDelete({userId})
 console.log(usercart,"user cart..............")

   return res.json({success:true,message:"order added succesfully",orderdata})
}else{
  console.log("some error occured")
}
  } catch (error) {
    console.log(error)
  }
 
}


const myOrders=async(req,res)=>{
  const userId = req.userid;
  try {
    const userorders=await orderModel.find({userId}).populate('items.itemId')
    if(userorders){
      return res.json({success:true,message:"user orders found",userorders})
    }
    else{
      return res.json({success:false,message:"no user orders found"})
    }
  } catch (error) {
    
  }
}

export {foodLists,userLogin,userRegister,addToCart,removeFromCart,usercart,createOrder,verifyPayment,myOrders}