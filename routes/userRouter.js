import express from "express"
import { foodLists } from "../controllers/userController.js"
const userRouter=express.Router()


// userRouter.post('/register')
// userRouter.post('/login')

userRouter.get('/food-list',foodLists)

export default userRouter