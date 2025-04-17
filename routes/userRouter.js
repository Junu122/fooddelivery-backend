import express from "express"
import { foodLists } from "../controllers/userController.js"
import { userLogin } from "../controllers/userController.js"
import { userRegister } from "../controllers/userController.js"
const userRouter=express.Router()


// userRouter.post('/register')
// userRouter.post('/login')

userRouter.get('/food-list',foodLists)
userRouter.post('/login',userLogin)
userRouter.post('/register',userRegister)
export default userRouter