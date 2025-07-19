import mongoose, {Schema} from "mongoose";


const inventoryInBranchSchema = new Schema(
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


export const inventoryInBranch = mongoose.model("InventoryInBranch", inventoryInBranchSchema)
