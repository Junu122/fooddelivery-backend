import foodModel from "../models/foodModel.js"
const foodLists=async(req,res)=>{
    try {
        const foodlists=await foodModel.find({})
        res.json({success:true,data:foodlists})
    } catch (error) {
        return error
    }
}

export {foodLists}