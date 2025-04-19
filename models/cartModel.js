import mongoose from "mongoose";

  const cartSchema = new mongoose.Schema({
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
          required: true,
          unique: true 
        },
        items: [{
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food',
            required: true
          },
          quantity: {
            type: Number,
            required: true,
            default: 1
          }
        }]
      }, { timestamps: true });



const cartModel=mongoose.models.cart || mongoose.model("cart",cartSchema)
export default cartModel