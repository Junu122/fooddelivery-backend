import express from "express"
import { userDatas,orderDatas,foodDatas,adminLogin,updateOrder,updateFood,updatefoodstatus } from "../controllers/adminController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
const adminRouter=express.Router();


adminRouter.get('/userdata',adminMiddleware,userDatas)
adminRouter.get('/orderdata',adminMiddleware,orderDatas)
adminRouter.get('/fooddata',adminMiddleware,foodDatas)
adminRouter.post('/admin-login',adminMiddleware,adminLogin)
adminRouter.post('/update-order',adminMiddleware,updateOrder)
adminRouter.post('/updatefood',adminMiddleware,updateFood)
adminRouter.post('/update-foodstatus',adminMiddleware,updatefoodstatus)
export default adminRouter
