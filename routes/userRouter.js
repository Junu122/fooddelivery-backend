import express from "express"
import { foodLists } from "../controllers/userController.js"
import { userLogin } from "../controllers/userController.js"
import { userRegister,addToCart,removeFromCart,usercart,createOrder ,verifyPayment,myOrders} from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const userRouter=express.Router()


// userRouter.post('/register')
// userRouter.post('/login')

userRouter.get('/food-list',foodLists)
userRouter.post('/login',userLogin)
userRouter.post('/register',userRegister)
userRouter.post('/addToCart',authMiddleware,addToCart)
userRouter.post('/removeFromCart',authMiddleware,removeFromCart)
userRouter.get('/userCart',authMiddleware,usercart)
userRouter.post('/create-order',createOrder)
userRouter.post('/verify-payment',verifyPayment)
userRouter.get('/my-orders',authMiddleware,myOrders)
export default userRouter