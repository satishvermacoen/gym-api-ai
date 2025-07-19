import mongoose, {Schema} from "mongoose";


const inventorywarehouseSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
    },
    {
        timestamps: true
    }        
    
);


export const inventorywarehouse = mongoose.model("Inventorywarehouse", inventorywarehouseSchema)