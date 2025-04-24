import mongoose from "mongoose"



const orderSchema=new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true 
      },
      totalAmount: {
        type: Number,
        required: true,
      },
    
      items: [
        {
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food',
            required: true
          },
          quantity: {
            type: Number,
            required: true
          },
          
          
        }
      ],
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      trackingStatus: {
        type: Number,
        enum: [1,2,3,4,5],
        default: 1
      },
      status:{
        type:String,
        enum:["delivered","pending","cancelled"],
        default:"pending"
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
      }
    
   
},{ timestamps: true })

const orderModel=mongoose.model.user || mongoose.model("order",orderSchema)

export default orderModel